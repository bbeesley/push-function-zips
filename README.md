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

#### Table of Contents

*   [Options](#options)
    *   [Properties](#properties)
    *   [inputPath](#inputpath)
    *   [include](#include)
    *   [exclude](#exclude)
    *   [createLayer](#createlayer)
    *   [rootDir](#rootdir)
    *   [region](#region)
    *   [bucket](#bucket)
    *   [functionKey](#functionkey)
    *   [layerKey](#layerkey)
    *   [project](#project)
    *   [platform](#platform)
*   [packageAndUpload](#packageandupload)
    *   [Parameters](#parameters)

### Options

[src/@types/options.ts:11-78](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L6-L10 "Source code on GitHub")

Options to define an upload task

Type: {inputPath: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), include: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?, exclude: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?, createLayer: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?, rootDir: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?, region: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), bucket: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), functionKey: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), layerKey: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?, project: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?, platform: Platform}

#### Properties

*   `inputPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `include` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?**&#x20;
*   `exclude` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?**&#x20;
*   `createLayer` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?**&#x20;
*   `rootDir` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?**&#x20;
*   `region` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `bucket` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `functionKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `layerKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?**&#x20;
*   `project` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?**&#x20;
*   `platform` **Platform**&#x20;

#### inputPath

[src/@types/options.ts:17-17](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L17-L17 "Source code on GitHub")

A pointer to where the files to upload are located

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### include

[src/@types/options.ts:23-23](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L23-L23 "Source code on GitHub")

An array of globs to include in the zip

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### exclude

[src/@types/options.ts:29-29](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L29-L29 "Source code on GitHub")

An array of globs to exclude from the zip

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### createLayer

[src/@types/options.ts:35-35](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L35-L35 "Source code on GitHub")

Whether or not to create a layer zip

Type: [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

#### rootDir

[src/@types/options.ts:41-41](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L41-L41 "Source code on GitHub")

A position within the zip to mount the files

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### region

[src/@types/options.ts:47-47](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L47-L47 "Source code on GitHub")

The AWS region to upload the assets to

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### bucket

[src/@types/options.ts:53-53](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L53-L53 "Source code on GitHub")

The name of the S3 bucket to upload to

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### functionKey

[src/@types/options.ts:59-59](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L59-L59 "Source code on GitHub")

The key name to upload the function zip as

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### layerKey

[src/@types/options.ts:65-65](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L65-L65 "Source code on GitHub")

The key name to upload the layer as

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### project

[src/@types/options.ts:71-71](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L71-L71 "Source code on GitHub")

The name of a google project to upload to

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

#### platform

[src/@types/options.ts:77-77](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/@types/options.ts#L77-L77 "Source code on GitHub")

The target we're uploading to

Type: Platform

### packageAndUpload

[src/package-and-upload.ts:15-33](https://github.com/bbeesley/push-function-zips/blob/82bf200233b2e19dc401397f99c8bbba46281575/src/package-and-upload.ts#L15-L33 "Source code on GitHub")

Packages up an asset based on globs and uploads zips to storage

#### Parameters

*   `arg` **[Options](#options)** Configuration defining what to upload to where

Returns **any** {Promise<void>}
