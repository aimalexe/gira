const asyncHandler = (routeHandlerFunction) => (req, res, next) =>
    Promise
        .resolve(routeHandlerFunction(req, res, next))
        .catch((error) => {
            console.error(`
                ❌ Async Error Caught
                📍 Route: ${req.method} ${req.originalUrl}
                🧠 Message: ${error.message}
                🧾 Stack: ${error.stack?.split("\n")[1]?.trim() || "No stack trace"}
            `);

            next(error);
        });


module.exports = asyncHandler;