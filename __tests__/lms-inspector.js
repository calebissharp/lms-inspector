import fs from 'fs';
import path from 'path';
import * as LMSInspector from '../src/lms-inspector';

// zip
const buzzArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/buzz.zip'))).buffer;
const blackboardArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/blackboard.zip'))).buffer;
const canvasArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/canvas.imscc'))).buffer;
const d2lArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/d2l.zip'))).buffer;
const moodleZipArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/moodle.zip'))).buffer;
// gzip
const moodleArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/moodle.mbz'))).buffer;

// image
const potatoArrayBuffer = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'samples/potato.jpg'))).buffer;

it('converts a file to an ArrayBuffer', () => {
  const buffer = new ArrayBuffer(10);
  const file = new File([buffer], 'filename');
  LMSInspector.convertFileToArrayBuffer(file)
    .then(result => expect(buffer).toEqual(result));
});

it('can determine the kind of compression an ArrayBuffer has', () => {
  expect(LMSInspector.determineCompression(buzzArrayBuffer)).toEqual('zip');
  expect(LMSInspector.determineCompression(moodleArrayBuffer)).toEqual('gzip');
});

it('can uncompress a zip', () => {
  LMSInspector.uncompressZip(buzzArrayBuffer)
    .then(files => expect(files['brainhoneymanifest.xml']).toBeDefined())
});

it('can uncompress a gzip', () => {
  LMSInspector.uncompressGzip(moodleArrayBuffer)
    .then(files => expect(files['moodle_backup.xml']).toBeDefined());
});

it('can determine what kind of lms a list of files is for', () => {
  LMSInspector.uncompressZip(buzzArrayBuffer)
    .then(files => expect(LMSInspector.getType(files)).toEqual('buzz'))
  LMSInspector.uncompressZip(blackboardArrayBuffer)
    .then(files => expect(LMSInspector.getType(files)).toEqual('blackboard'))
  LMSInspector.uncompressZip(canvasArrayBuffer)
    .then(files => expect(LMSInspector.getType(files)).toEqual('canvas'))
  LMSInspector.uncompressZip(d2lArrayBuffer)
    .then(files => expect(LMSInspector.getType(files)).toEqual('d2l'))
  LMSInspector.uncompressZip(moodleZipArrayBuffer)
    .then(files => expect(LMSInspector.getType(files)).toEqual('moodle'))

  LMSInspector.uncompressGzip(moodleArrayBuffer)
  .then(files => expect(LMSInspector.getType(files)).toEqual('moodle'))
});

it('inspects a file', () => {
  LMSInspector.inspect(new File([buzzArrayBuffer], 'buzz.zip'))
    .then(info => expect(info).toEqual({
      type: 'buzz',
      version: '',
    }));
  LMSInspector.inspect(new File([moodleArrayBuffer], 'moodle.mbz'))
    .then(info => expect(info).toEqual({
      type: 'moodle',
      version: '3.1.3 (Build: 20161114)',
    }));
  LMSInspector.inspect(new File([moodleZipArrayBuffer], 'moodle.zip'))
    .then(info => expect(info).toEqual({
      type: 'moodle',
      version: '1.9.19+ (Build: 20121112)',
    }));
});

it('returns an error if the file is not an LMS archive', () => {
  LMSInspector.inspect(new File([potatoArrayBuffer], 'potato.jpg'))
    .then(console.log)
    .catch(error => expect(error).toEqual('Could not determine compression type'));
});
