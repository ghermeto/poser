import { assert } from 'chai';
import { Client } from 'undici'

import { start, stop, getServer, getMockServer } from '../lib/server.js';
import { readFile } from './helper.js'

const admin = new Client('http://localhost:8089', { pipelining: 0 });
const mock = new Client('http://localhost:8080', { pipelining: 0 });

describe('@poser/server', () => {
    beforeEach(start);
    afterEach(stop);

    it('should load parameters-api in the mock server', async () => {
        const mson = readFile('./data/parameters-api.md');
        const server = getServer();

        const serverResponse = await admin.request({ 
            path: '/poser/apis',
            method: 'POST', 
            body: mson,
            headers: {
                'Content-Type': 'text/vnd.apiblueprint+markdown'
            }
        });
        

        await serverResponse.body.text();
        assert.equal(serverResponse.statusCode, 204);

        const response = await mock.request({ 
            path: '/message/10',
            method: 'GET', 
            headers: {
                'Accept': 'application/json'
            }
        });

        assert.equal(response.statusCode, 200);
        const body = await response.body.json();
        assert.deepEqual(body, { id: 1, message: 'Hello World!' });
        assert.equal(response.headers['x-my-message-header'], 42);

    });
});
