import { parse } from '../lib/parser.js';
import { assert } from 'chai';
import { readFileSync } from 'fs';

function readMarkdownFile(path) {
  const url = new URL(path, import.meta.url);
  return readFileSync(url, { encoding: 'utf-8'});
}

function getResources(api) {
    return api.resourceGroups.reduce(function(result, item) {
        return result.concat(Array.from(item.resources));
    }, Array.from(api.resources));
}

describe('@poser/apib-parser', () => {
    it('should convert resource-and-actions from Blueprint', async () => {
        const apib = readMarkdownFile('data/resource-and-actions.md');
        const { api } = await parse(apib);
    
        assert.equal(api.title.toValue(), 'Resource and Actions API');
        
        const resource = api.resources.get(0);
        assert.equal(resource.get(1).transactions.get(0).request.method.toValue(), 'GET');
        assert.equal(resource.get(2).transactions.get(0).request.method.toValue(), 'PUT');
    });
    
    it('should convert parameters-api 1st resource from a Blueprint MSON', async () => {
        const apib = readMarkdownFile('data/parameters-api.md');
        const { api } = await parse(apib);

        assert.equal(api.title.toValue(), 'Parameters API');
        
        const resources = getResources(api);
        const resource = resources[0];
        const transition = resource.transitions.get(1);
        const transaction = transition.transactions.get(1);

        assert.equal(resource.href.toValue(), '/message/{id}');
        assert.deepEqual(resource.hrefVariables.toValue(), { id: '1' });
        assert.equal(transaction.request.method.toValue(), 'PUT');
        assert.equal(transaction.request.messageBody.toValue(), '{ "message": "All your base are belong to us." }\n');
    });
        
    it('should convert parameters-api 2nd resource from a Blueprint MSON', async () => {
        const apib = readMarkdownFile('data/parameters-api.md');
        const { api } = await parse(apib);

        assert.equal(api.title.toValue(), 'Parameters API');
        
        const resources = getResources(api);
        const resource = resources[1];
        const transition = resource.transitions.get(0);

        assert.equal(resource.href.toValue(), '/messages{?limit}');
        assert.deepEqual(transition.hrefVariables.toValue(), { limit: undefined });
        assert.equal(transition.transactions.get(0).request.method.toValue(), 'GET');
    });   
    
    it('should convert advanced-action 1st resource from a Blueprint MSON', async () => {
        const apib = readMarkdownFile('data/advanced-action.md');
        const { api } = await parse(apib);

        assert.equal(api.title.toValue(), 'Advanced Action API');
        
        const resources = getResources(api);
        const resource = resources[0];
        const transition = resource.transitions.get(0);
        const transaction = transition.transactions.get(0);

        assert.equal(resource.href.toValue(), '/tasks/tasks{?status,priority}');
        assert.equal(transaction.request.method.toValue(), 'GET');
        assert.isUndefined(transaction.request.messageBody);
        assert.equal(transaction.response.messageBody.toValue(), '[\n    {\n        "id": 123,\n        "name": "Exercise in gym",\n        "done": false,\n        "type": "task"\n    },\n    {\n        "id": 124,\n        "name": "Shop for groceries",\n        "done": true,\n        "type": "task"\n    }\n]\n');
    });
        
});