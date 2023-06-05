import test from 'ava';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import JSZip from 'jszip';
import { packageAndUpload, Platform } from '../dist/esm/package-and-upload.js';

const mockS3 = mockClient(S3Client);

test.serial.beforeEach(() => {
  mockS3.reset();
  mockS3.on(PutObjectCommand).resolves({});
});

test.serial(
  'uploads a single asset to s3 when layers not enabled',
  async (t) => {
    await packageAndUpload({
      platform: Platform.AWS,
      inputPath: './',
      include: ['src/**'],
      exclude: ['node_modules/**'],
      createLayer: false,
      region: 'eu-central-1',
      bucket: 'test-bucket',
      functionKey: 'fn',
    });
    const calls = mockS3.calls();
    t.true(calls.length === 1);
    const call = calls.shift();
    const { Bucket, Key } = call?.args[0].input ?? {};
    t.snapshot({ Bucket, Key });
  },
);
test.serial('uploads 2 assets to s3 when layers are enabled', async (t) => {
  await packageAndUpload({
    platform: Platform.AWS,
    inputPath: './',
    exclude: ['**/typescript/**'],
    createLayer: true,
    region: 'eu-central-1',
    bucket: 'test-bucket',
    functionKey: 'fn',
    layerKey: 'layer',
  });
  const calls = mockS3.calls();
  t.true(calls.length === 2);
  const firstCall = calls.shift();
  const { Bucket: FirstBucket, Key: FirstKey } = firstCall?.args[0].input ?? {};
  t.snapshot({ Bucket: FirstBucket, Key: FirstKey });
  const secondCall = calls.shift();
  const { Bucket: SecondBucket, Key: SecondKey } =
    secondCall?.args[0].input ?? {};
  t.snapshot({ Bucket: SecondBucket, Key: SecondKey });
});
test.serial('wraps the layer node_modules in a nodejs directory', async (t) => {
  await packageAndUpload({
    platform: Platform.AWS,
    inputPath: './',
    exclude: ['**/typescript/**'],
    createLayer: true,
    region: 'eu-central-1',
    bucket: 'test-bucket',
    functionKey: 'fn',
    layerKey: 'layer',
  });
  const calls = mockS3.calls();
  t.true(calls.length === 2);
  const secondCall = calls.pop();
  const { Body } = secondCall?.args[0].input ?? {};
  const zip = new JSZip();
  const result = await zip.loadAsync(Body);
  const zipContent = Object.keys(result.files);
  t.is(zipContent.shift(), 'nodejs/');
  t.true(zipContent.every((name) => name.startsWith('nodejs/')));
});

test.serial('respects include globs', async (t) => {
  await packageAndUpload({
    platform: Platform.AWS,
    inputPath: './',
    include: ['*.json'],
    exclude: ['node_modules/**'],
    createLayer: false,
    region: 'eu-central-1',
    bucket: 'test-bucket',
    functionKey: 'fn',
  });
  const calls = mockS3.calls();
  const call = calls.pop();
  const { Body } = call?.args[0].input ?? {};
  const zip = new JSZip();
  const result = await zip.loadAsync(Body);
  const zipContent = Object.keys(result.files);
  t.truthy(zipContent.find((name) => name === 'package.json'));
});
test.serial('respects exclude globs', async (t) => {
  await packageAndUpload({
    platform: Platform.AWS,
    inputPath: './',
    exclude: ['node_modules/**', '*.json'],
    createLayer: false,
    region: 'eu-central-1',
    bucket: 'test-bucket',
    functionKey: 'fn',
  });
  const calls = mockS3.calls();
  const call = calls.pop();
  const { Body } = call?.args[0].input ?? {};
  const zip = new JSZip();
  const result = await zip.loadAsync(Body);
  const zipContent = Object.keys(result.files);
  t.falsy(zipContent.find((name) => name === 'package.json'));
});
