// Thin wrapper that re-exports the notFoundHandler from errorHandler for clearer imports.
const { notFoundHandler } = require("./errorHandler");

module.exports = { notFoundHandler };

