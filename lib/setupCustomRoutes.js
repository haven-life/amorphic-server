'use strict';

let fs = require('fs');

function setupCustomRoutes(appDirectory, router) {
    let routerFilePath = appDirectory + '/apps/common/server/Routes.js';

    let routers;

    if(fs.existsSync(routerFilePath)) {
        routers = require(routerFilePath);

        if(routers && typeof routers.routerSetup === 'function') {
            return routers.routerSetup.call(null, router);
        }
    }
}

module.exports = {
    setupCustomRoutes: setupCustomRoutes
};