import { toBeNumber, toBeString, toBeArray, toBeBoolean } from 'jest-extended';
expect.extend({ toBeNumber, toBeString, toBeArray, toBeBoolean });

import fs from 'fs';
import DescribeFeatureType from '../lib/DescribeFeatureType';
import { resolve } from 'path';

const parser = new DescribeFeatureType();

describe("DescribeFeatureType Parser - Exception", () => {

    const data = fs.readFileSync(resolve('data/example-exception.xml'), { encoding: 'utf-8' });

    let parsed;

    test("Open and parse", () => {
        parsed = parser.read(data);
        expect(Object.keys(parsed).length).toBeGreaterThan(1);
        fs.writeFileSync('test/example-exception-formatted-parsed.json', JSON.stringify(parsed, undefined, 2), { encoding: 'utf-8' });
    });

    test("Exceptions", () => {
        expect(parsed.version).toBeString();
        expect(parsed.Exception).toBeArray();
        expect(parsed.Exception[0].locator).toBeString();
        expect(parsed.Exception[0].exceptionCode).toBeString();
        expect(parsed.Exception[0].ExceptionText).toBeString();
    });

});