'use strict';

const fs = require('fs');
const logMessage = require('./utils/logger').logMessage;

function setupCustomRoutes(appDirectory, mainAppName, router) {
    const routerFilePath = appDirectory + '/apps/' + mainAppName + '/js/routers/index.js';

    let routers;

    if(fs.existsSync(routerFilePath)) {
        routers = require(routerFilePath);

        const exportedRouterFunctions = Object.keys(routers);

        if(exportedRouterFunctions.length === 0) {
            logMessage('A custom router file was defined, but no exported ' +
                'functions were found. Using default amorphic routes');
            return;
        }

        // iterate through all exported router functions and execute.
        for (const routerFunction of exportedRouterFunctions) {

            if (typeof routers[routerFunction] === 'function') {
                logMessage('Evaluating router: ' + routerFunction);
                routers[routerFunction](router);
            }
        }

        return router;
    }
}

module.exports = {
    setupCustomRoutes: setupCustomRoutes
};