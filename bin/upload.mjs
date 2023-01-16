import { resolve } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import betterLogging from 'better-logging';
import { packageAndUpload } from '../dist/esm/package-and-upload.js';

betterLogging(console);

const argv = yargs(hideBin(process.argv))
  .option('inputPath', {
    string: true,
    describe: 'The path to the lambda code and node_modules',
    demandOption: true,
  })
  .option('include', {
    array: true,
    string: true,
    describe: 'An array of globs defining what to bundle',
    demandOption: true,
  })
  .option('exclude', {
    array: true,
    string: true,
    describe: 'An array of globs defining what not to bundle',
  })
  .option('rootDir', {
    string: true,
    describe: 'An optional path within the zip to save the files to',
  })
  .option('regions', {
    array: true,
    string: true,
    describe: 'A list of regions to upload the assets in',
    demandOption: true,
  })
  .option('buckets', {
    array: true,
    string: true,
    describe:
      'A list of buckets to upload to (same order as the regions please)',
    demandOption: true,
  })
  .option('functionKey', {
    string: true,
    describe:
      "The path/filename of the zip file in the bucket (you don't need to add the .zip extension, but remember to include a version string of some sort)",
    demandOption: true,
  })
  .option('layerKey', {
    string: true,
    describe:
      'Tells the module to split out the node modules into a zip that you can create a lambda layer from',
  })
  .option('platform', {
    string: true,
    choices: ['AWS', 'GCP'],
    default: 'AWS',
    describe: 'Which platform are we uploading assets for',
  })
  .parse();
try {
  let ix = 0;
  const cwd = process.cwd();
  const inputPath = resolve(cwd, argv.inputPath);
  if (argv.buckets.length !== argv.regions.length)
    throw new Error('must specify a bucket for each region');
  for (const region of argv.regions) {
    await packageAndUpload({
      ...argv,
      region,
      inputPath,
      bucket: argv.buckets[ix],
    });
    ix += 1;
  }
} catch (error) {
  console.error('fatal error', error.message, error.stack);
  process.exit(1);
}
