import { toBeNumber, toBeString, toBeArray, toBeBoolean } from 'jest-extended';
expect.extend({ toBeNumber, toBeString, toBeArray, toBeBoolean });

import fs from 'fs';
import DescribeFeatureType from '../lib/DescribeFeatureType';
import { resolve } from 'path';

const parser = new DescribeFeatureType();

describe("DescribeFeatureType Parser - GML version 3.2.1", () => {

    const data = fs.readFileSync(resolve(__dirname, 'example-3.2.1.xml'), { encoding: 'utf-8' });

    let parsed;

    test("Open and parse", () => {
        parsed = parser.read(data);
        expect(Object.keys(parsed).length).toBeGreaterThan(1);
        fs.writeFileSync('test/example-3.2.1-parsed.json', JSON.stringify(parsed, undefined, 2), { encoding: 'utf-8' });
    });

    test("General attributes", () => {
        expect(parsed.elementFormDefault).toBeString();
        expect(parsed.targetNamespace).toBeString();
        expect(parsed.import.namespace).toBeString();
        expect(parsed.import.schemaLocation).toBeString();
    });

    test("complexType", () => {
        expect(parsed.complexType).toBeArray();
        expect(parsed.complexType[0].name).toBeString();
        expect(parsed.complexType[0].complexContent.extension.sequence).toBeArray();
        expect(parsed.complexType[0].complexContent.extension.sequence[0].name).toBeString();
        expect(parsed.complexType[0].complexContent.extension.sequence[0].maxOccurs).toBeNumber();
        expect(parsed.complexType[0].complexContent.extension.sequence[0].minOccurs).toBeNumber();
        expect(parsed.complexType[0].complexContent.extension.sequence[0].nillable).toBeBoolean();
        expect(parsed.complexType[0].complexContent.extension.sequence[0].type).toBeString();
        expect(parsed.complexType[0].complexContent.extension.sequence[0].localType).toBeString();
    });

    test("element", () => {
        expect(parsed.element).toBeArray();
        expect(parsed.element.length).toBeGreaterThan(1);
        expect(parsed.element[0].name).toBeString();
        expect(parsed.element[0].substitutionGroup).toBeString();
        expect(parsed.element[0].type).toBeString();
    });

});