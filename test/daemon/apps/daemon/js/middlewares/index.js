'use strict';

let express = require('express');

function exampleMiddleware(expressRouter) {
    expressRouter.use(express.json({
        limit: '1000mb'
    }));

    return expressRouter;
}

module.exports = {
    exampleMiddleware: exampleMiddleware
};