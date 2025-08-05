const userRoutes = require("./user.route")

const router = (app) => {
    app.use("/api/user", userRoutes);

    // app.use("*", (req, res) => {
    //     res.status(404).send("Endpoint not found!");
    // });

    app.use(function errorHandler(err, req, res, next) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
            errors: err || null,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        })
    });
}

module.exports = { router }