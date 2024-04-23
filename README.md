# ol-describe-feature-type

<p align="center">
    <a href="https://www.npmjs.com/package/ol-describe-feature-type">
        <img src="https://img.shields.io/npm/v/ol-describe-feature-type.svg" alt="npm version">
    </a>
    <a href="https://img.shields.io/npm/dm/ol-describe-feature-type">
        <img alt="npm" src="https://img.shields.io/npm/dm/ol-describe-feature-type">
    </a>
    <a href="https://github.com/gastonzalba/ol-describe-feature-type/blob/master/LICENSE">
        <img src="https://img.shields.io/npm/l/ol-describe-feature-type.svg" alt="license">
    </a>
</p>

Module to work alongside OpenLayers for reading WFS Describe Feature Type XML data and convert it to JSON.

## Online example

See [converter](https://raw.githack.com/GastonZalba/ol-describe-feature-type/main/examples/converter.html) to text and parse data

## Usage

```js
import DescribeFeatureType from 'ol-describe-feature-type';

const parser = new DescribeFeatureType();

const parsedData = parser.read(describeFeatureTypeXML);

// use ´readFormatted´ to get an object emulating a native geoserver/mapserver json response
const parsedDataFormated = parser.readFormatted(describeFeatureTypeXML);

```

## Changelog

See CHANGELOG for details of changes in each release.

## Install

### Parcel, Webpack, etc.

NPM package: [ol-describe-feature-type](https://www.npmjs.com/package/ol-describe-feature-type).

Install the package via `npm`

```shell
npm install ol-describe-feature-type
```

### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for the Options.

## Development

```shell
# install dependencies
npm install

# run test
npm test
# run test without pretest
npx jest

# run online example locally on http://localhost:3009/
npm run watch 
```

## License
MIT (c) Gastón Zalba.
