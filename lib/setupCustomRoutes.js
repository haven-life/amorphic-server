'use strict';

const fs = require('fs');

function setupCustomRoutes(appDirectory, mainAppPath, router) {
    const routerFilePath = `${appDirectory}/${mainAppPath}/js/routers/index.js`;

    let routers;

    if(fs.existsSync(routerFilePath)) {
        routers = require(routerFilePath);

        const exportedRouterFunctions = Object.keys(routers);

        if(exportedRouterFunctions.length === 0) {
            console.warn('A custom router file was defined, but no exported functions were found. Using default amorphic routes');
            return;
        }

        // iterate through all exported router functions and execute.
        for (const routerFunction of exportedRouterFunctions) {

            if (typeof routers[routerFunction] === 'function') {
                console.debug('Evaluating router: ' + routerFunction);
                routers[routerFunction](router);
            }
        }

        return router;
    } else {
        console.info('No custom routes found to process.');
        return router;
    }
}

module.exports = {
    setupCustomRoutes: setupCustomRoutes
};