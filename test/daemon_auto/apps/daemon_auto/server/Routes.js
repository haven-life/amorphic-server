'use strict';

function routerSetup(expressRouter) {
    console.log('This is our router!', expressRouter);

    expressRouter.get('/tennis', tennisBallService.bind(this));

    return expressRouter;
}

function tennisBallService (req, res) {
    console.log("!!! HEY A TENNIS BALL!");
    res.send('TENNIS BALL INCOMING!');
}

module.exports = {
    routerSetup: routerSetup
};