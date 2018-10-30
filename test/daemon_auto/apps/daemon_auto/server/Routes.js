'use strict';

// intake an express router object, mutate it with custom endpoints, send it back to amorphic to register.
function routerSetup(expressRouter) {
    expressRouter.get('/test', testService.bind(this));

    return expressRouter;
}

function testService (_req, res) {
    res.status(200).send('test API endpoint OK');
}

module.exports = {
    routerSetup: routerSetup
};