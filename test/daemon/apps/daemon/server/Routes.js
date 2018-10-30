'use strict';

// intake an express router object, mutate it with custom endpoints, send it back to amorphic to register.
function routerSetup(expressRouter) {
    expressRouter.get('/tennis', tennisService.bind(this));

    return expressRouter;
}

function tennisService (_req, res) {
    res.status(200).send('Tennis API endpoint OK');
}

module.exports = {
    routerSetup: routerSetup
};