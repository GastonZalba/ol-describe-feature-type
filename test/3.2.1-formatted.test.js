import { toBeNumber, toBeString, toBeArray, toBeBoolean } from 'jest-extended';
expect.extend({ toBeNumber, toBeString, toBeArray, toBeBoolean });

import fs from 'fs';
import DescribeFeatureType from '../lib/DescribeFeatureType';
import { resolve } from 'path';

const parser = new DescribeFeatureType();

describe("DescribeFeatureType Parser - GML version 3.2.1 - FORMATED", () => {

    const data = fs.readFileSync(resolve('data/example-3.2.1.xml'), { encoding: 'utf-8' });

    let parsed;

    test("Open and parse", () => {
        parsed = parser.readFormatted(data);
        expect(Object.keys(parsed).length).toBeGreaterThan(1);
        fs.writeFileSync('test/example-3.2.1-formatted-parsed.json', JSON.stringify(parsed, undefined, 2), { encoding: 'utf-8' });
    });

    test("General attributes", () => {
        expect(parsed.elementFormDefault).toBeString();
        expect(parsed.targetNamespace).toBeString();
        expect(parsed.targetPrefix).toBeString();
    });

    test("featureTypes", () => {
        expect(parsed.featureTypes).toBeArray();
        expect(parsed.featureTypes[0].typeName).toBeString();
        expect(parsed.featureTypes[0].properties).toBeArray();
        expect(parsed.featureTypes[0].properties[0].name).toBeString();
        expect(parsed.featureTypes[0].properties[0].maxOccurs).toBeNumber();
        expect(parsed.featureTypes[0].properties[0].minOccurs).toBeNumber();
        expect(parsed.featureTypes[0].properties[0].nillable).toBeBoolean();
        expect(parsed.featureTypes[0].properties[0].type).toBeString();
        expect(parsed.featureTypes[0].properties[0].localType).toBeString();
    });

});