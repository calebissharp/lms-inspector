import JSZip from 'jszip';
import tar from 'tar-stream';
import intoStream from 'into-stream';
import gunzip from 'gunzip-maybe';
import { Buffer } from 'buffer';

/** @namespace LMSInspector */

/**
 * Reads a File into an `ArrayBuffer`
 * @method convertFileToArrayBuffer
 * @memberof LMSInspector
 * @param {File} file - file to convert to ArrayBuffer
 * @returns {Promise.<ArrayBuffer>}
 */
export const convertFileToArrayBuffer = file => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onloadend = () => resolve(reader.result);
  reader.onerror = () => reject('Unable to read file');
  reader.readAsArrayBuffer(file);
});

/**
 * Looks at the first byte of an ArrayBuffer to get the compression type
 * @method determineCompression
 * @memberof LMSInspector
 * @param {ArrayBuffer} arrayBuffer - the ArrayBuffer containing the LMS archive
 * @returns {String} - the type of compression
 */
export const determineCompression = arrayBuffer => {
  const bytes = new Uint8Array(arrayBuffer);

  switch (bytes[0]) {
    case 0x50: return 'zip';
    case 0x1f: return 'gzip';
    default: return null;
  }
};

/**
 * Extracts a zip file and returns a list of files
 * @method uncompressZip
 * @memberof LMSInspector
 * @param {ArrayBuffer} arrayBuffer - the ArayBuffer containing the LMS archive
 * @returns {Promise.<Object>} - an object with filenames and files
 */
export const uncompressZip = arrayBuffer => new Promise((resolve, reject) => {
  const zip = new JSZip();
  zip.loadAsync(arrayBuffer).then(() => {
    const entries = Object.values(zip.files);
    Promise.all(entries.map(entry => entry.async('string').then(u8 => [entry.name, u8])))
      .then(list => {
        // eslint-disable-next-line no-return-assign
        const result = list.reduce((acc, cur) => { acc[cur[0]] = cur[1]; return acc; }, {});
        resolve(result);
      });
  });
});

/**
 * Extracts a tar.gz file and returns a list of files
 * @method uncompressGzip
 * @memberof LMSInspector
 * @param {ArrayBuffer} arrayBuffer - the ArayBuffer containing the LMS archive
 * @returns {Promise.<Object>} - an object with filenames and files
 */
export const uncompressGzip = arrayBuffer => new Promise((resolve, reject) => {
  const extract = tar.extract();
  const files = {};
  intoStream(Buffer.from(arrayBuffer)).pipe(gunzip()).pipe(extract)
    .on('entry', (header, stream, callback) => {
      files[header.name] = '';
      stream.on('data', data => { files[header.name] += data.toString(); });
      stream.on('end', callback);
    })
    .on('finish', () => resolve(files));
});

/**
 * Looks at a list of files and determines which LMS they are for, if any
 * @method getType
 * @memberof LMSInspector
 * @param {Object} files - an object with filenames and files
 * @returns {String} - the LMS type
 */
export const getType = files => {
  const filenames = Object.keys(files);
  if (filenames.includes('course_settings/canvas_export.txt')) return 'canvas';
  if (filenames.includes('moodle.xml') || filenames.includes('moodle_backup.xml')) return 'moodle';
  if (filenames.includes('brainhoneymanifest.xml')) return 'buzz';
  if (filenames.includes('imsmanifest.xml')) {
    if (files['imsmanifest.xml'].includes('manifest identifier="D2L_')) {
      return 'd2l';
    }
    return 'blackboard';
  }

  return Promise.reject('File is not an LMS archive');
};

/**
 * Takes an LMS type, and the list of files in the archive, then looks through the files for information
 * regarding the version
 * @method getVersion
 * @memberof LMSInspector
 * @param {String} type - the LMS type
 * @param {Object} files - an object containing the filenames and files in the archive
 * @returns {String} - a string containing the version if found, or an empty string
 */
export const getVersion = (type, files) => {
  switch (type) {
    case 'moodle':
      const parser = new DOMParser();
      if (files['moodle.xml']) {
        const doc = parser.parseFromString(files['moodle.xml'], 'text/xml');
        return doc.getElementsByTagName('MOODLE_RELEASE')[0].childNodes[0].nodeValue;
      }
      if (files['moodle_backup.xml']) {
        const doc = parser.parseFromString(files['moodle_backup.xml'], 'text/xml');
        return doc.getElementsByTagName('moodle_release')[0].childNodes[0].nodeValue;
      }
      return '';
    default:
      return '';
  }
};

/**
 * Takes a list of files to extract information about the archive
 * @method getInfo
 * @memberof LMSInspector
 * @param {Object} file - the filenames and files
 * @returns {Object} - an object containing information about the archive
 */
export const getInfo = files => {
  const type = getType(files);
  const version = getVersion(type, files);

  return { type, version };
};

/**
 * @method inspect
 * @memberof LMSInspector
 * @param {File} file - The file to inspect
 * @returns {Promise.<Object>} - The information of the LMS
 */
export const inspect = file => (
  convertFileToArrayBuffer(file)
    .then(buffer => {
      const compression = determineCompression(buffer);

      if (compression === 'zip') return uncompressZip(buffer);
      if (compression === 'gzip') return uncompressGzip(buffer);
      return Promise.reject('Could not determine compression type');
    })
    .then(getInfo)
);
