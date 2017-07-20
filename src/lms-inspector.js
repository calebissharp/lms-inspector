import JSZip from 'jszip';
import pako from 'pako';
import { TextDecoder } from 'text-encoding';

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
 * Extracts a zip file and returns a list of filenames
 * @method uncompressZip
 * @memberof LMSInspector
 * @param {ArrayBuffer} arrayBuffer - the ArayBuffer containing the LMS archive
 * @returns {Promise.<Array.<String>>} - an array of filenames in the zip
 */
export const uncompressZip = arrayBuffer => new Promise((resolve, reject) => {
  const zip = new JSZip();
  zip.loadAsync(arrayBuffer).then(() => resolve(Object.keys(zip.files)));
});

/**
 * Extracts a gzip file and returns a list of filenames
 * @method uncompressGzip
 * @memberof LMSInspector
 * @param {ArrayBuffer} arrayBuffer - the ArayBuffer containing the LMS archive
 * @returns {Promise.<Array.<String>>} - an array of filenames in the gzip
 */
export const uncompressGzip = arrayBuffer => new Promise((resolve, reject) => {
  const uncompressed = pako.inflate(arrayBuffer);
  const files = new TextDecoder('utf-8').decode(uncompressed)
    .substring(0, 1300) // take only the first part of the file that contains filenames
    .replace(/\t|\d+|(f|c|d)\t|\?/g, '') // magical regexp to clean up messy uncompressed string
    .split(/\n/g) // split the string into an array of filenames
    .slice(1); // remove big empty first entry
  resolve(files);
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
