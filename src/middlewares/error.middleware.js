module.exports = (error, req, res, next) => {
    res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message || "Internal server error"
        });
}