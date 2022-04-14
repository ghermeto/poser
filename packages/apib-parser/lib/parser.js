import fury from '@apielements/core';
import apibParser from '@apielements/apib-parser';

export const contentType = 'text/vnd.apiblueprint+markdown';

export async function parse(source, { logger = console, mediaType = contentType } = {}) {
    fury.use(apibParser);
    try {
        let parsed = await fury.parse({ source, mediaType });
        logger.debug(parsed);
        return parsed;
    } catch (err) {
        logger.error(err.message);
        throw err;
    }
};
