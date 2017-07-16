import JSZip from 'jszip';
import pako from 'pako';
import { TextDecoder } from 'text-encoding';

export const LMSInspector = {
  inspect: file => new Promise((resolve, reject) => {
    LMSInspector.convertFileToArrayBuffer(file)
      .then(buffer => {
        const compression = LMSInspector.determineCompression(buffer);

        if (compression === 'zip') return LMSInspector.uncompressZip(buffer);
        if (compression === 'gzip') return LMSInspector.uncompressGzip(buffer);
        return new Error('Could not determine compression type');
      })
      .then(LMSInspector.checkForLMS)
      .then(resolve);
  }),
  convertFileToArrayBuffer: file => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject('Unable to read file');
    reader.readAsArrayBuffer(file);
  }),
  determineCompression: arrayBuffer => {
    const bytes = new Uint8Array(arrayBuffer);

    switch (bytes[0]) {
      case 0x50: return 'zip';
      case 0x1f: return 'gzip';
      default: return null;
    }
  },
  uncompressZip: arrayBuffer => new Promise((resolve, reject) => {
    const zip = new JSZip();
    zip.loadAsync(arrayBuffer).then(() => resolve(Object.keys(zip.files)));
  }),
  uncompressGzip: arrayBuffer => new Promise((resolve, reject) => {
    const uncompressed = pako.inflate(arrayBuffer);
    const files = new TextDecoder('utf-8').decode(uncompressed)
      .substring(0, 1300) // take only the first part of the file that contains filenames
      .replace(/\t|\d+|(f|c|d)\t|\?/g, '') // magical regexp to clean up messy uncompressed string
      .split(/\n/g) // split the string into an array of filenames
      .slice(1); // remove big empty first entry
    resolve(files);
  }),
  checkForLMS: filenames => {
    let result = '';

    filenames.forEach(name => {
      if (name.includes('course_settings')) result = 'canvas';
      if (name.includes('moodle') || name.includes('completion.xml')) result = 'moodle';
      if (name.includes('bb-')) result = 'blackboard';
      if (name.includes('brainhoneymanifest')) result = 'buzz';
      if (name.includes('d2l')) result = 'd2l';
    });

    return result;
  }
};
