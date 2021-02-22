module.exports = (err, req, res, next) => {
    const error = {
        status: err.status || 500,
        message: err.message || "Internal server error"
    }
    err.errors != undefined ? error.errors = err.errors : null;
    res.status(err.status || 500).json(error);
}