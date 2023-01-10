# @beesley/push-function-zips

Zips up and uploads build artifacts for serverless functions

## usage

### cli

Typically this module would be used from the command line. The command line args are described here.

| Argument        | Description                                                                                                                                       | Type      | Required?  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| --help          | Show help                                                                                                                                         | \[boolean] |            |
| --version       | Show version number                                                                                                                               | \[boolean] |            |
| --inputPath     | The path to the lambda code and node\_modules                                                                                                      | \[string]  | \[required] |
| --include       | An array of globs defining what to bundle                                                                                                         | \[array]   | \[required] |
| --exclude       | An array of globs defining what not to bundle                                                                                                     | \[array]   |            |
| --rootDir       | An optional path within the zip to save the files to                                                                                              | \[string]  |            |
| --regions       | A list of regions to upload the assets in                                                                                                         | \[array]   | \[required] |
| --s3Buckets     | A list of buckets to upload to (same order as the regions please)                                                                                 | \[array]   | \[required] |
| --s3FunctionKey | The path/filename of the zip file in the bucket (you don't need to add the .zip extension, but remember to include a version string of some sort) | \[string]  | \[required] |
| --s3LayerKey    | Tells the module to split out the node modules into a zip that you can create a lambda layer from                                                 | \[string]  |            |

```shell
npx @beesley/push-function-zips --inputPath './' --include 'dist/**' --regions 'eu-central-1' --s3Buckets 'my-lambda-artefacts' --s3FunctionKey 'hello-function' --s3LayerKey 'hello-function-dependencies'
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
  s3Bucket: 'my-lambda-artefacts',
  s3FunctionKey: 'hello-function',
  s3LayerKey: 'hello-function-dependencies',
});
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [Options](#options)
    *   [Properties](#properties)
    *   [inputPath](#inputpath)
    *   [include](#include)
    *   [exclude](#exclude)
    *   [createLayer](#createlayer)
    *   [rootDir](#rootdir)
    *   [region](#region)
    *   [s3Bucket](#s3bucket)
    *   [s3FunctionKey](#s3functionkey)
    *   [s3LayerKey](#s3layerkey)
*   [packageAndUpload](#packageandupload)
    *   [Parameters](#parameters)

### Options

[src/package-and-upload.ts:15-70](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L10-L14 "Source code on GitHub")

Options to define an upload task

Type: {inputPath: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), include: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?, exclude: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?, createLayer: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?, rootDir: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?, region: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), s3Bucket: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), s3FunctionKey: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), s3LayerKey: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?}

#### Properties

*   `inputPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `include` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?**&#x20;
*   `exclude` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?**&#x20;
*   `createLayer` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?**&#x20;
*   `rootDir` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?**&#x20;
*   `region` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `s3Bucket` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `s3FunctionKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `s3LayerKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?**&#x20;

#### inputPath

[src/package-and-upload.ts:21-21](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L21-L21 "Source code on GitHub")

A pointer to where the files to upload are located

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### include

[src/package-and-upload.ts:27-27](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L27-L27 "Source code on GitHub")

An array of globs to include in the zip

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### exclude

[src/package-and-upload.ts:33-33](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L33-L33 "Source code on GitHub")

An array of globs to exclude from the zip

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### createLayer

[src/package-and-upload.ts:39-39](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L39-L39 "Source code on GitHub")

Whether or not to create a layer zip

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### rootDir

[src/package-and-upload.ts:45-45](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L45-L45 "Source code on GitHub")

A position within the zip to mount the files

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### region

[src/package-and-upload.ts:51-51](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L51-L51 "Source code on GitHub")

The AWS region to upload the assets to

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### s3Bucket

[src/package-and-upload.ts:57-57](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L57-L57 "Source code on GitHub")

The name of the S3 bucket to upload to

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### s3FunctionKey

[src/package-and-upload.ts:63-63](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L63-L63 "Source code on GitHub")

The key name to upload the function zip as

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### s3LayerKey

[src/package-and-upload.ts:69-69](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L69-L69 "Source code on GitHub")

The key name to upload the layer as

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### packageAndUpload

[src/package-and-upload.ts:271-287](https://github.com/bbeesley/push-function-zips/blob/a6899e3aa4d52e74263aae2787d4163e63b8c238/src/package-and-upload.ts#L271-L287 "Source code on GitHub")

Packages up an asset based on globs and uploads zips to s3

#### Parameters

*   `arg` **[Options](#options)** Configuration defining what to upload to where

Returns **any** {Promise<void>}
