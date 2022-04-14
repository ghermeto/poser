import Fastify from 'fastify';
import { nanoid } from 'nanoid'
import sensible from 'fastify-sensible';

import * as mockServer from './mock-server.js';

// constants
const POSER_ADMIN_PORT = process.env.POSER_ADMIN_PORT || 8089;
const LOG_LEVEL = process.env.POSER_LOG_LEVEL ?? 'info';
const PARSERS = (process.env.POSER_PARSERS ?? 'apib').split(',');

const apis = {};

const fastify = Fastify({
    logger: { level: LOG_LEVEL }
});

//error handling
fastify.register(sensible);

// loading parsers
for(let parserKey of PARSERS) {
    try {
        let parser = await import(`@poser/${parserKey}-parser`);
        fastify.log.info(`Loading parser ${parserKey}`);
        fastify.addContentTypeParser(parser.contentType, { parseAs: 'string' }, async function (request, doc) {
            let parsed = await parser.parse(doc, { logger: request.log, mediaType: parser.contentType });
            return { doc, parsed, contentType: parser.contentType };
        });
    } catch (err) {
        fastify.log.error(`Unable to find parser ${parserKey}`);
    }
}

/**
 * Updates stops mock-server, updates routes, then restart it
 * @async
 * @private
 */
async function updateMock() {
    const values = Object.values(apis);
    const APIList = values.map(({parsed}) => parsed.api);
    await mockServer.stop();
    mockServer.loadAPIs(APIList);
    await mockServer.start();
}

/**
 * Inserts or updates the new API
 * @param {string} id 
 * @param {any} body 
 * @param {Object} reply 
 */
async function insertOrUpdate(id, body, reply) {
    if ('doc' in body && 'parsed' in body && 'contentType' in body) {
        apis[id] = body;
        await updateMock();
    
        reply.status(204);
        reply.send(''); 
    } else {
        reply.unsupportedMediaType(`Parser for ${request.headers.contentType} not found`);
    }
}

fastify.get('/poser/apis', async (request, reply) => {
    // returns only documents and content-type
    let filtered = {};
    for (let id in apis) {
        let { doc, contentType } = apis[id];
        filtered[id] = { doc, contentType };
    }
    reply.type('application/json');
    return filtered;
});

fastify.get('/poser/apis/:id', async (request, reply) => {
    if (!apis[request.params.id]) {
        reply.notFound();
    }
    reply.type(apis[request.params.id].contentType);
    return apis[request.params.id].doc;
});

fastify.post('/poser/apis', async (request, reply) => {
    const id = nanoid(10);
    await insertOrUpdate(id, request.body, reply);
});

fastify.put('/poser/apis/:id', async (request, reply) => {
    if (!apis[request.params.id]) {
        reply.notFound();
    }
    await insertOrUpdate(id, request.body, reply);
});

export async function start(port = POSER_ADMIN_PORT) {
    try {
        const values = Object.values(apis);
        await fastify.listen(port);
        mockServer.loadAPIs(values);
        await mockServer.start();
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

export async function stop() {
    try {
        await mockServer.stop();
        await fastify.close();
    } catch (err) {
        fastify.log.error(err);
    }
}

export function getServer() {
    return fastify;
}

export function getMockServer() {
    return mockServer.getServer();
}
