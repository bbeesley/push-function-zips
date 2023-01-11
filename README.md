# @beesley/push-function-zips

Zips up and uploads build artifacts for serverless functions

## usage

### cli

Typically this module would be used from the command line. The command line args are described here.

| Argument      | Description                                                                                                                                       | Type       | Required?   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| --help        | Show help                                                                                                                                         | \[boolean] |             |
| --version     | Show version number                                                                                                                               | \[boolean] |             |
| --inputPath   | The path to the lambda code and node\_modules                                                                                                     | \[string]  | \[required] |
| --include     | An array of globs defining what to bundle                                                                                                         | \[array]   | \[required] |
| --exclude     | An array of globs defining what not to bundle                                                                                                     | \[array]   |             |
| --rootDir     | An optional path within the zip to save the files to                                                                                              | \[string]  |             |
| --regions     | A list of regions to upload the assets in                                                                                                         | \[array]   | \[required] |
| --buckets     | A list of buckets to upload to (same order as the regions please)                                                                                 | \[array]   | \[required] |
| --functionKey | The path/filename of the zip file in the bucket (you don't need to add the .zip extension, but remember to include a version string of some sort) | \[string]  | \[required] |
| --layerKey    | Tells the module to split out the node modules into a zip that you can create a lambda layer from                                                 | \[string]  |             |
| --platform    | Which cloud provider we are uploading to (AWS or GCP)                                                                                             | \[string]  |             |

```shell
npx @beesley/push-function-zips --inputPath './' --include 'dist/**' --regions 'eu-central-1' --buckets 'my-lambda-artefacts' --functionKey 'hello-function' --layerKey 'hello-function-dependencies' --platform 'AWS'
```

### programmatic

It is possible to use this module programmatically if you so desire.

```typescript
import { packageAndUpload } from '@beesley/push-function-zips';

await packageAndUpload({
  inputPath: './',
  include: ['dist/**'],
  createLayer: true,
  region: 'eu-central-1',
  bucket: 'my-lambda-artefacts',
  functionKey: 'hello-function',
  layerKey: 'hello-function-dependencies',
});
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents
