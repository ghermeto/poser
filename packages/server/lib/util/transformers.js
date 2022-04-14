import { faker } from '@faker-js/faker';

const routeRegex = /{(?:\s)?(([+?&#]?(?:[\w\-]+?(?:\.[\w\-]*?)*?))|(\?[\w\-]+,[\w\-]+))(?:\s)?}/gi;

/**
 * Converts a route template using RFC 6570 format to a find-my-way route format
 * @param {string} routeTemplate 
 * @returns {string} route
 */
export function routeTransformer(routeTemplate) {
    return routeTemplate.replace(routeRegex, (placeholder, key) => {
        if (key.startsWith('?') || key.startsWith('&') || key.startsWith('#')) {
            // we don't handle querystring or fragments in routes
            return '';
        } else if (key.startsWith('+')) {
            // we handle expands from RFC 6570
            return ':' + key.substring(1) + '+';
        } else {
            return ':' + key;
        }
	});
}

const bodyRegex = /{{(\d+|[a-z$_][\w\-$]*?(?:\.[\w\-$]*?)*?)}}/gi;

/**
 * Transforms a body templated with double curly brackets ({{ }})
 * @param {string} bodyTemplate 
 * @param {Object} values 
 * @returns {string} body
 */
export function bodyTransformer(bodyTemplate, values = {}) {
    const data = { faker, ...values };
    return bodyTemplate.replace(bodyRegex, (placeholder, key) => {
		let value = data; 
		for (let prop of key.split('.')) {
			value = value ? value[prop] : undefined;
		}
        const transformed = typeof value === 'function' ? value() : value;
		return String(transformed);
	});
}
