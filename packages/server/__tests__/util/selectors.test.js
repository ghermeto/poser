import { assert } from 'chai';

import { selectResources } from '../../lib/util/selectors.js';
import { readRefractFile } from '../helper.js'

describe('util/selectors', () => {
    describe('selectResources', () => {
        it('should select the simplest resources', () => {
            const result = readRefractFile('./data/simplest-apib.json');
            const resources = selectResources(result.api);
            assert.isArray(resources);
            assert.lengthOf(resources, 1);
        });

        it('should select resources from parameters-api', () => {
            const result = readRefractFile('./data/parameters-api.json');
            const resources = selectResources(result.api);
            assert.isArray(resources);
            assert.lengthOf(resources, 2);
        });

        it('should select resources from advanced-action', () => {
            const result = readRefractFile('./data/advanced-action.json');
            const resources = selectResources(result.api);
            assert.isArray(resources);
            assert.lengthOf(resources, 1);
        });
    });
});
