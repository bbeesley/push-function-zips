import test from 'ava';
import sinon from 'sinon';

import { Storage } from '@google-cloud/storage';
import { packageAndUpload, Platform } from '../dist/esm/package-and-upload.js';

const bucketMethodStub = sinon.stub(Storage.prototype, 'bucket');
const fileMethodStub = sinon.stub();
const saveMethodStub = sinon.stub();

class BucketStub {
  file() {
    fileMethodStub(...arguments);
    return new FileStub();
  }
}

class FileStub {
  async save() {
    saveMethodStub(...arguments);
  }
}

test.serial.beforeEach(() => {
  bucketMethodStub.reset();
  bucketMethodStub.returns(new BucketStub());
  fileMethodStub.reset();
  saveMethodStub.reset();
});

test.serial('uploads a single asset to cloud storage', async (t) => {
  await packageAndUpload({
    platform: Platform.GCP,
    inputPath: './',
    include: ['src/**'],
    exclude: ['node_modules/**'],
    bucket: 'test-bucket',
    functionKey: 'fn',
  });
  const bucketMethodCalls = bucketMethodStub.getCalls();
  const fileMethodCalls = fileMethodStub.getCalls();
  const saveMethodCalls = saveMethodStub.getCalls();
  t.true(bucketMethodCalls.length === 1);
  t.true(fileMethodCalls.length === 1);
  t.true(saveMethodCalls.length === 1);
  const bucketMethodCall = bucketMethodCalls.shift();
  const fileMethodCall = fileMethodCalls.shift();
  const saveMethodCall = saveMethodCalls.shift();
  const bucketArg = bucketMethodCall.args[0];
  const fileArg = fileMethodCall.args[0];
  const saveArg = saveMethodCall.args[0];
  t.snapshot({
    bucketArg,
    fileArg,
    saveArg,
  });
});
