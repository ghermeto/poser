import { parse } from '../lib/parser.js';
import { assert } from 'chai';
import { readFileSync } from 'fs';

function readFile(path) {
  const url = new URL(path, import.meta.url);
  return readFileSync(url, { encoding: 'utf-8'});
}

function getResources(api) {
    return api.resourceGroups.reduce(function(result, item) {
        return result.concat(Array.from(item.resources));
    }, Array.from(api.resources));
}

describe('@poser/oas3-parser', () => {
    describe('petstore.json', () => {
        let api;
        beforeEach(async () => {
            const oas = readFile('data/petstore.json');
            const result = await parse(oas);
            api = result.api;
        });

        it('should convert frist resource', async () => {
            assert.equal(api.title.toValue(), 'Swagger Petstore');

            const resource = api.resources.get(0);
            assert.equal(resource.href?.toValue(), '/pets');
            const transition = resource.transitions.get(0);
            const transaction = transition.transactions.get(0);
            assert.equal(transaction.request.method.toValue(), 'GET');

            const rawBody = transaction.response.messageBody?.toValue();
            const responseHeaders = transaction.response.headers?.toValue() ?? [];
            assert.equal(transaction.response.statusCode.toValue(), 200);
            assert.equal(rawBody, '[{"id":0,"name":"","tag":""}]');
            assert.equal(responseHeaders[0].key, 'Content-Type');
            assert.equal(responseHeaders[0].value, 'application/json');
        });

    });

    describe('link-example.json', () => {
        let api;
        beforeEach(async () => {
            const oas = readFile('data/link-example.json');
            const result = await parse(oas);
            api = result.api;
        });

        it('should convert first resource', () => {
            assert.equal(api.title.toValue(), 'Link Example');

            const resource = api.resources.get(0);
            assert.equal(resource.href?.toValue(), '/2.0/users/{username}');
            const transition = resource.transitions.get(0);
            const transaction = transition.transactions.get(0);
            assert.equal(transaction.request.method.toValue(), 'GET');

            const rawBody = transaction.response.messageBody?.toValue();
            const responseHeaders = transaction.response.headers?.toValue() ?? [];
            assert.equal(transaction.response.statusCode.toValue(), 200);
            assert.equal(rawBody, '{"username":"{{fake.name.firstName}}","uuid":""}');
            assert.equal(responseHeaders[0].key, 'Content-Type');
            assert.equal(responseHeaders[0].value, 'application/json');
        });

        it('should convert second resource', () => {
            assert.equal(api.title.toValue(), 'Link Example');

            const resource = api.resources.get(1);
            assert.equal(resource.href?.toValue(), '/2.0/repositories/{username}');
            const transition = resource.transitions.get(0);
            const transaction = transition.transactions.get(0);
            assert.equal(transaction.request.method.toValue(), 'GET');

            const rawBody = transaction.response.messageBody?.toValue();
            const responseHeaders = transaction.response.headers?.toValue() ?? [];
            assert.equal(transaction.response.statusCode.toValue(), 200);
            assert.equal(rawBody, '[{"slug":"","owner":{"username":"{{fake.name.firstName}}","uuid":""}}]');
            assert.equal(responseHeaders[0].key, 'Content-Type');
            assert.equal(responseHeaders[0].value, 'application/json');
        });
    });
});
