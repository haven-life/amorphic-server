'use strict';

const fs = require('fs');

function setupCustomRoutes(appDirectory, mainAppName, router) {
    const routerFilePath = appDirectory + '/apps/' + mainAppName + '/server/routes/index.js';

    let routers;

    if(fs.existsSync(routerFilePath)) {
        routers = require(routerFilePath);

        const exportedRouterFunctions = Object.keys(routers);

        if(exportedRouterFunctions.length === 0) {
            console.log('a custom router file was defined, but no exported ' +
                'functions were found. Using default amorphic routes');
            return;
        }

        // iterate through all exported router functions and execute.
        for (const routerFunction of exportedRouterFunctions) {
            if (typeof routers[routerFunction] === 'function') {
                return routers.routerSetup(router);
            }
        }
    }
}

module.exports = {
    setupCustomRoutes: setupCustomRoutes
};