import JSZip from 'jszip';
import pako from 'pako';
import { Readable } from 'stream';
import tar from 'tar-stream';
import { TextDecoder } from 'text-encoding';
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
    const entries = Object.values(zip.files)
    Promise.all(entries.map(entry => entry.async('string').then(u8 => [entry.name, u8])))
      .then(list => {
        const result = list.reduce((acc, cur) => { acc[cur[0]] = cur[1]; return acc }, {})

        resolve(result)
      })
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
	const extract = tar.extract()
  const files = {}
	intoStream(Buffer.from(arrayBuffer)).pipe(gunzip()).pipe(extract)
    .on('entry', (header, stream, callback) => {
      // files[header.name] = stream.read()
      stream.resume()
      stream.on('data', data => files[header.name] = data.toString())
      stream.on('end', callback)
    })
    .on('finish', () => resolve(files))
});

/**
 * Looks at a list of files and determines which LMS they are for, if any
 * @method checkForLMS
 * @memberof LMSInspector
 * @param {Array.<String>} filenames - an array of filenames in an archive
 * @returns {Promise.<String>} - the LMS type
 */
export const checkForLMS = filenames => new Promise((resolve, reject) => {
  filenames.forEach(name => {
    if (name.includes('course_settings')) resolve('canvas');
    if (name.includes('moodle') || name.includes('completion.xml')) resolve('moodle');
    if (name.includes('bb-')) resolve('blackboard');
    if (name.includes('brainhoneymanifest')) resolve('buzz');
    if (name.includes('d2l')) resolve('d2l');
  });

  reject('File is not an LMS archive');
});

/**
 * @method inspect
 * @memberof LMSInspector
 * @param {File} file - The file to inspect
 * @returns {Promise.<String>} - The name of the LMS
 */
export const inspect = file => (
  convertFileToArrayBuffer(file)
    .then(buffer => {
      const compression = determineCompression(buffer);

      if (compression === 'zip') return uncompressZip(buffer);
      if (compression === 'gzip') return uncompressGzip(buffer);
      return Promise.reject('Could not determine compression type');
    })
    .then(checkForLMS)
);
