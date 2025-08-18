/**
 * Recursively converts all snake_case keys in an object to camelCase.
 * Handles nested objects and arrays.
 *
 * @param {object | Array} obj The object or array to convert.
 * @returns {object | Array} The new object or array with camelCase keys.
 */
function snakeToCamel(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => snakeToCamel(item));
    }

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // Use a different object for the accumulator to avoid modifying the original object
    return Object.keys(obj).reduce((acc, key) => {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelCaseKey] = snakeToCamel(obj[key]);
        return acc;
    }, {});
}

const convertSnakeToCamelMiddleware = (
    req,
    res,
    next
) => {
    const originalJson = res.json;

    res.json = function (body) {
        if (body && typeof body === 'object' && !Array.isArray(body)) {
            // Create a deep copy of the body before conversion to avoid circular references
            const convertedBody = snakeToCamel(JSON.parse(JSON.stringify(body)));
            return originalJson.call(this, convertedBody);
        }

        if (body && Array.isArray(body)) {
            const convertedBody = body.map(item => snakeToCamel(JSON.parse(JSON.stringify(item))));
            return originalJson.call(this, convertedBody);
        }

        return originalJson.call(this, body);
    };

    next();
};

module.exports = { convertSnakeToCamelMiddleware };