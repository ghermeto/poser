import Fastify from 'fastify';
import sensible from 'fastify-sensible';

import { validateRoute } from './util/validators.js';
import { selectResources } from './util/selectors.js';
import { routeTransformer, bodyTransformer } from './util/transformers.js';
import { acceptStrategy, requestContentTypeStrategy } from './util/fastify-constraint-strategies.js'

const PORT = process.env.POSER_PORT ?? 8080;
const LOG_LEVEL = process.env.POSER_LOG_LEVEL ?? 'info';

  
function getParameters(resource, transition) {
    let variables = transition.hrefVariables?.toValue() ?? {};
    return variables.reduce(function(result, item) {
        return result.concat(Array.from(item.resources));
    }, resource.hrefVariables?.toValue() ?? {} );
}

/**
 * Creates a new server
 * @private
 * @returns {Object} 
 */
function createServer() {
    return Fastify({
        logger: { level: LOG_LEVEL },
        forceCloseConnections: true,
        constraints: { 
            accept: acceptStrategy,
            contentType: requestContentTypeStrategy 
        }
    });
}

let fastify = createServer();

//error handling
fastify.register(sensible);

/**
 * Load APIs as routes
 * APIs are decribed as objects created by the Refract Spec
 * @see https://github.com/refractproject/refract-spec
 * @param {Object[]} apis 
 */
export function loadAPIs(apis = []) {
    for(let api of apis) {
        const title = api.title?.toValue() || 'unamed';
        fastify.log.info('loading routes for API ' + title);

        for(let resource of selectResources(api)) {
            const resourceUrl = resource.href?.toValue();

            for(let transition of resource.transitions) {
                const transitionUrl = transition.href?.toValue();

                for(let transaction of transition.transactions) {
                    const transactionUrl = transaction.href?.toValue();
                    const method = transaction.request.method.toValue();
                    const rawBody = transaction.response.messageBody?.toValue();
                    const bodyContentType = transaction.response.messageBody?.contentType?.toValue();
                    const responseHeaders = transaction.response.headers?.toValue() ?? [];
                    const statusCode = transaction.response.statusCode.toValue() ?? 201;

                    // the URL can be defined in many stages
                    const url = routeTransformer(transactionUrl ?? transitionUrl ?? resourceUrl);
                    validateRoute(url);
                    fastify.log.debug({ url, method, statusCode }, 'loading route');

                    // the content-type can be defined as property of the body or as a header
                    const headerContentType = (transaction.response.header('Content-Type') ?? [])[0]?.toValue();
                    const contentType = bodyContentType || headerContentType;
        
                    const definition = { 
                        url, 
                        method, 
                        handler: async (request, reply) => {
                            const { params } = request;

                            //setting headers
                            for (let responseHeader of responseHeaders) {
                                reply.header(responseHeader.key, responseHeader.value);
                            }

                            //status code
                            reply.status(statusCode);
                            
                            if (rawBody) {
                                // interpolating response body
                                // can use { param.reqParam } or { faker.name.firstName }
                                const messageBody = bodyTransformer(rawBody, { params });
                                request.log.debug({ messageBody }, 'interpolated payload');

                                // set content type, if found
                                if (contentType) {
                                    reply.type(contentType);
                                }
                                
                                reply.send(messageBody);
                            } else {
                                reply.send('');
                            }
                        }
                    };

                    // defining constraints 
                    // this is to allow multiple routes for different content-types
                    definition.constraints = definition.constraints ?? {};

                    // api def is based on content-type header on request
                    const reqContentType = transaction.request.messageBody?.contentType?.toValue();
                    const reqHeaderContentType = (transaction.request.header('Content-Type') ?? [])[0]?.toValue();
                    const type = reqContentType || reqHeaderContentType;
                    if (type) {
                        definition.constraints.contentType = type; 
                    }

                    // api def is based on accept header
                    let accept = (transaction.request.header('Accept') ?? [])[0]?.toValue();
                    if (accept) {
                        definition.constraints.accept = accept;
                    }

                    fastify.route(definition);
                }
            }
        }
    }
}

/**
 * Starts listening on a given port [default=8080]
 * @param {{port: number=8080}} param
 */
export async function start({ port = PORT } = {}) {
    try {
        await fastify.listen(PORT);
        fastify.log.info(`Server started on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
    }      
}

/**
 * Stops the current mock server and replaces the instance with a new one.
 * When stop is called, references to all mocking routes are lost
 * @param {{restart: boolean=false, port: number=8080}}
 */
 export async function stop({ restart = false, port = PORT } = {}) {
    let decommissioned = fastify;
    fastify = createServer();
    try {
        await decommissioned.close();
        decommissioned.log.info('Server stopped');
        if (restart) {
            await start(port);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}

/**
 * Gets the underlying server object
 * @returns {Object}
 */
export function getServer() {
    return fastify;
}

