import fury from '@apielements/core';
import openapi3Parser from '@apielements/openapi3-parser';

export const contentType = 'application/vnd.oai.openapi+json';

export async function parse(source, { logger = console, mediaType = contentType } = {}) {
    fury.use(openapi3Parser);
    try {
        let parsed = await fury.parse({ source, mediaType });
        logger.debug(parsed);
        return parsed;
    } catch (err) {
        logger.error(err.message);
        throw err;
    }
};
