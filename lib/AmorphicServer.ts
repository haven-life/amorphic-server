// Internal modules
let AmorphicContext = require('./AmorphicContext');
let Logger = require('./utils/logger');
let logMessage = Logger.logMessage;
let uploadRouter = require('./routers/uploadRouter').uploadRouter;
let initializePerformance = require('./utils/initializePerformance').initializePerformance;
let amorphicEntry = require('./amorphicEntry').amorphicEntry;
let postRouter = require('./routers/postRouter').postRouter;
let downloadRouter = require('./routers/downloadRouter').downloadRouter;
let router = require('./routers/router').router;
let generateDownloadsDir = require('./utils/generateDownloadsDir').generateDownloadsDir;
let nonObjTemplatelogLevel = 1;

import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as compression from 'compression';

export class AmorphicServer {
    app: express.Express;

    /**
    * Purpose unknown
    *
    * @param {unknown} preSessionInject unknown
    * @param {unknown} postSessionInject unknown
    * @param {unknown} appList unknown
    * @param {unknown} appStartList unknown
    * @param {unknown} appDirectory unknown
    * @param {unknown} sessionRouter unknown
    */

    static createServer(preSessionInject, postSessionInject, appList, appStartList, appDirectory, sessionRouter) {

        let controllers = {};
        let downloads;
        let sessions = {};

        let amorphicOptions = AmorphicContext.amorphicOptions;
        let mainApp = amorphicOptions.mainApp;
        let appContext = AmorphicContext.appContext;
        let appConfig = AmorphicContext.applicationConfig[mainApp];
        let reqBodySizeLimit = appConfig.reqBodySizeLimit || '50mb';
        let server = new AmorphicServer(express());

        downloads = generateDownloadsDir();

        if (amorphicOptions.compressXHR) {
            server.app.use(compression());
        }

        if (preSessionInject) {
            preSessionInject.call(null, server.app);
        }

        for (let appName in appList) {
            if (appStartList.includes(appName)) {
                let appPath = `${appDirectory}/${appList[appName]}/public`;

                server.app.use(`/${appName}/`, express.static(appPath, { index: 'index.html' }));

                if (appName === mainApp) {
                    server.app.use('/', express.static(appPath, { index: 'index.html' }));
                }

                logMessage(`${appName} connected to ${appPath}`);
            }
        }

        // TODO: Do we actually need these checks?
        let rootSuperType = __dirname;

        if (fs.existsSync(`${appDirectory}/node_modules/supertype`)) {
            rootSuperType = appDirectory;
        }

        let rootSemotus = __dirname;

        if (fs.existsSync(`${appDirectory}/node_modules/semotus`)) {
            rootSemotus = appDirectory;
        }

        let rootBindster = __dirname;

        if (fs.existsSync(`${appDirectory}/node_modules/amorphic-bindster`)) {
            rootBindster = appDirectory;
        }

        server.app.use(initializePerformance)
            .use('/modules/', express.static(`${appDirectory}/node_modules`))
            .use('/bindster/', express.static(`${rootBindster}/node_modules/amorphic-bindster`))
            .use('/amorphic/', express.static(`${appDirectory}/node_modules/amorphic`))
            .use('/common/', express.static(`${appDirectory}/apps/common`))
            .use('/supertype/', express.static(`${rootSuperType}/node_modules/supertype`))
            .use('/semotus/', express.static(`${rootSemotus}/node_modules/semotus`))
            .use(cookieParser())
            .use(sessionRouter)
            .use(uploadRouter.bind(this, downloads))
            .use(downloadRouter.bind(this, sessions, controllers, nonObjTemplatelogLevel))
            .use(express.json({
                limit: reqBodySizeLimit
            }))
            .use(express.urlencoded({
                extended: true
            }))
            .use(postRouter.bind(this, sessions, controllers, nonObjTemplatelogLevel))
            .use(amorphicEntry.bind(this, sessions, controllers, nonObjTemplatelogLevel));


        if (postSessionInject) {
            postSessionInject.call(null, server.app);
        }

        server.app.use(router.bind(this, sessions, nonObjTemplatelogLevel, controllers));

        appContext.server = server.app.listen(amorphicOptions.port);
    }

    /**
        * @TODO: make this a proper class
        *
        * @param {express.Express} app Express server
        * 
     **/
    constructor(app: express.Express) {
        this.app = app;
    }
}