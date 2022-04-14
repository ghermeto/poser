
/**
 * Searches APIs for a list of all resources
 * @param {Object} api refract api element
 * @returns {Object[]}
 */
export function selectResources(api) {
    return api.resourceGroups.reduce(function(result, item) {
        return result.concat(Array.from(item.resources));
    }, Array.from(api.resources));
}
