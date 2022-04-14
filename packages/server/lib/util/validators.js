
/**
 * @class InvalidRouteDefinition
 */
class InvalidRouteDefinition extends Error {}

/**
 * Tests a route in the find-my-way route format
 * @param {string} routeTemplate 
 * @throws
 */
export function validateRoute(route) {
    const routeRegex = /^(\/(?:[\:]?[\w\+\.-])*)+$/gi;
    if(!routeRegex.test(route)) {
        throw new InvalidRouteDefinition(`Route '${route}' is not valid!`);
    }
}
