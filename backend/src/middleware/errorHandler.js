
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};


const errorHandler = (err, req, res, next) => {
    console.error("Unhandled error:", err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
       
    });
};

module.exports = { notFoundHandler, errorHandler };

