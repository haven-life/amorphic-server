import * as fs from 'fs';
import * as express from 'express';

export namespace CustomMiddleware {

    /**
    *   
    * Keep in mind when registering the middlewares be careful!
    * @TODO: when implementing middlewares register error handling from middlewares on APP not ROUTER 
    * https://github.com/expressjs/express/issues/2679
    */
    export function setupMiddlewares(appDirectory, mainAppName, router) {
        const middlewareFilePath = appDirectory + '/apps/' + mainAppName + '/js/middlewares/index.js';

        return setupHelper(middlewareFilePath, false, router);
    }

    export function setupRouters(appDirectory, mainAppName, router) {
        const routerFilePath = appDirectory + '/apps/' + mainAppName + '/js/routers/index.js';
        
        return setupHelper(routerFilePath, true, router);
    }
}

function setupHelper(path: string, isRouter: boolean, router: express.Router) {
    let middlewares;
    const subject = isRouter ? 'router' : 'middleware';

    if (fs.existsSync(path)) {
        middlewares = require(path);

        const exportedFunctions = Object.keys(middlewares);

        if (exportedFunctions.length === 0) {
            console.warn(`A custom ${subject} file was defined, but no exported functions were found. Using default amorphic settings`);
            return;
        }

        // iterate through all exported router functions and execute.
        for (const exportedFunc of exportedFunctions) {

            if (typeof middlewares[exportedFunc] === 'function') {
                console.debug(`Evaluating ${subject}: ${exportedFunc}`);
                middlewares[exportedFunc](router);
            }
        }

        return router;

    } else {
        console.info(`No custom ${subject} found to process.`);
        return router;
    }

}