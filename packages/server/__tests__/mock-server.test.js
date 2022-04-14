
import { assert } from 'chai';

import * as mockServer from '../lib/mock-server.js';
import { readRefractFile } from './helper.js'

describe('lib/mock-server', () => {
    afterEach(async () => {
        await mockServer.stop();
    });

    it('should load API from simple refract element', async () => {
        //load apis
        const result = readRefractFile('./data/simplest-apib.json');
        mockServer.loadAPIs([result.api]);
        
        // make a fake request
        const app = mockServer.getServer();
        const response = await app.inject({ method: 'GET', url: '/' });

        assert.equal(response.statusCode, 204);
    });

    it('should load parameters-api GET /message/:id with text/plain constraint', async () => {
        //load apis
        const result = readRefractFile('./data/parameters-api.json');
        mockServer.loadAPIs([result.api]);
        
        // make a fake request
        const app = mockServer.getServer();
        const response = await app.inject({ 
            method: 'GET', 
            url: '/message/10',
            headers: {
                'Accept': 'text/plain'
            }
        });

        assert.equal(response.statusCode, 200);
        assert.equal(response.body, 'Hello World!\n');
        assert.equal(response.headers['x-my-message-header'], 42);
    });

    it('should load parameters-api GET /message/:id with application/json constraint', async () => {
        //load apis
        const result = readRefractFile('./data/parameters-api.json');
        mockServer.loadAPIs([result.api]);
        
        // make a fake request
        const app = mockServer.getServer();
        const response = await app.inject({ 
            method: 'GET', 
            url: '/message/10',
            headers: {
                'Accept': 'application/json'
            }
        });

        assert.equal(response.statusCode, 200);
        assert.equal(response.body, '{\n  "id": 1,\n  "message": "Hello World!"\n}\n');
        assert.equal(response.headers['x-my-message-header'], 42);
    });

    it('should load parameters-api PUT /message/:id with application/json constraint', async () => {
        //load apis
        const result = readRefractFile('./data/parameters-api.json');
        mockServer.loadAPIs([result.api]);
        
        // make a fake request
        const app = mockServer.getServer();
        const response = await app.inject({ 
            method: 'PUT', 
            url: '/message/10',
            headers: {
                'Content-Type': 'application/json'
            },
            payload: {'message': 'test'}
        });

        assert.equal(response.statusCode, 204);
    });

    it('should load parameters-api GET /messages with application/json constraint', async () => {
        //load apis
        const result = readRefractFile('./data/parameters-api.json');
        mockServer.loadAPIs([result.api]);
        
        // make a fake request
        const app = mockServer.getServer();
        const response = await app.inject({ 
            method: 'GET', 
            url: '/messages',
            headers: {
                'Accept': 'application/json'
            }
        });

        assert.equal(response.statusCode, 200);
        const body =  JSON.parse(response.body);
        assert.isArray(body);
        assert.lengthOf(body, 3);
    });

    it('should load advanced-action GET /task/:id and interpolate param', async () => {
        //load apis
        const result = readRefractFile('./data/advanced-action.json');
        mockServer.loadAPIs([result.api]);
        
        // make a fake request
        const app = mockServer.getServer();
        const response = await app.inject({ 
            method: 'GET', 
            url: '/task/10'
        });

        const body =  response.json();
        assert.equal(response.statusCode, 200);
        assert.equal(body.name, 'Go to gym');
        assert.equal(body.done, false);
        assert.equal(body.id, 10);
    });
});
