"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Internal modules
var AmorphicContext = require('./AmorphicContext');
var Logger = require('./utils/logger');
var logMessage = Logger.logMessage;
var uploadRouter = require('./routers/uploadRouter').uploadRouter;
var initializePerformance = require('./utils/initializePerformance').initializePerformance;
var amorphicEntry = require('./amorphicEntry').amorphicEntry;
var postRouter = require('./routers/postRouter').postRouter;
var downloadRouter = require('./routers/downloadRouter').downloadRouter;
var router = require('./routers/router').router;
var generateDownloadsDir = require('./utils/generateDownloadsDir').generateDownloadsDir;
var nonObjTemplatelogLevel = 1;
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var express = require("express");
var fs = require("fs");
var compression = require("compression");
var routesRelativePath = '/js/routes/';
var middlewaresRelativePath = '/js/middlewares/';
/**
 * @TODO: seperate out amorphic shit to defaultRouter (express.Router) to seperate out middleware
 */
var AmorphicServer = /** @class */ (function () {
    // async registerAppsRoutes(appPaths: string[]) {
    //     let promises = appPaths.map(async appPath => {
    //         let router: express.Router = express.Router();
    //         const routes: {[routeExport: string]: routeObject: any} = await import(`${appPath}${routesRelativePath}`);
    //         // what are the types and values of Routes (key, value) dictionary. Key is what type and what value, value is what type and what value
    //         Object.keys(routes).forEach(key => {
    //         });
    //     });     
    //     await promises;   
    // }
    /**
    * @TODO: make this a proper class
    *
    * @param {express.Express} app Express server
    *
    **/
    function AmorphicServer(app) {
        this.app = app;
        this.app;
    }
    /**
     * @static
     * @param {string} appDirectory is the directory wher the app is located
     * @param {AmorphicServer} server
     * @returns
     * @memberof AmorphicServer
     */
    AmorphicServer.setupStatics = function (appDirectory, server) {
        //   TODO: Do we actually need these checks?
        var rootSuperType, rootSemotus, rootBindster;
        if (fs.existsSync(appDirectory + "/node_modules/supertype")) {
            rootSuperType = appDirectory;
        }
        else {
            rootSuperType = __dirname;
        }
        if (fs.existsSync(appDirectory + "/node_modules/semotus")) {
            rootSemotus = appDirectory;
        }
        else {
            rootSemotus = __dirname;
        }
        if (fs.existsSync(appDirectory + "/node_modules/amorphic-bindster")) {
            rootBindster = appDirectory;
        }
        else {
            rootBindster = __dirname;
        }
        router.use('/modules/', express.static(appDirectory + "/node_modules"))
            .use('/bindster/', express.static(rootBindster + "/node_modules/amorphic-bindster"))
            .use('/amorphic/', express.static(appDirectory + "/node_modules/amorphic"))
            .use('/common/', express.static(appDirectory + "/apps/common"))
            .use('/supertype/', express.static(rootSuperType + "/node_modules/supertype"))
            .use('/semotus/', express.static(rootSemotus + "/node_modules/semotus"));
        return router;
    };
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
    AmorphicServer.createServer = function (preSessionInject, postSessionInject, appList, appStartList, appDirectory, sessionConfig) {
        var controllers = {};
        var sessions = {};
        var amorphicOptions = AmorphicContext.amorphicOptions;
        var mainApp = amorphicOptions.mainApp;
        var appContext = AmorphicContext.appContext;
        var appConfig = AmorphicContext.applicationConfig[mainApp];
        var reqBodySizeLimit = appConfig.reqBodySizeLimit || '50mb';
        var server = new AmorphicServer(express());
        var downloads = generateDownloadsDir();
        if (amorphicOptions.compressXHR) {
            server.app.use(compression());
        }
        if (preSessionInject) {
            preSessionInject.call(null, server.app);
        }
        var appPaths = [];
        /**
         * Deprecated(?) because we only run app at a time
         */
        for (var appName in appList) {
            if (appStartList.includes(appName)) {
                var appPath = appDirectory + "/" + appList[appName] + "/public";
                appPaths.push(appPath);
                server.app.use("/" + appName + "/", express.static(appPath, { index: 'index.html' }));
                if (appName === mainApp) {
                    server.app.use('/', express.static(appPath, { index: 'index.html' }));
                }
                logMessage(appName + " connected to " + appPath);
            }
        }
        /**
         *  Setting up the different middlewares
         */
        var cookieMiddleware = cookieParser();
        var expressSesh = expressSession(sessionConfig);
        var bodyLimitMiddleWare = express.json({
            limit: reqBodySizeLimit
        });
        var urlEncodedMiddleWare = express.urlencoded({
            extended: true
        });
        var amorphicRouter = express.Router();
        amorphicRouter.use(initializePerformance);
        this.setupStatics(appDirectory, amorphicRouter);
        amorphicRouter.use(cookieMiddleware)
            .use(expressSesh)
            .use(uploadRouter.bind(this, downloads))
            .use(downloadRouter.bind(this, sessions, controllers, nonObjTemplatelogLevel))
            .use(bodyLimitMiddleWare)
            .use(urlEncodedMiddleWare)
            .use(postRouter.bind(this, sessions, controllers, nonObjTemplatelogLevel))
            .use(amorphicEntry.bind(this, sessions, controllers, nonObjTemplatelogLevel));
        if (postSessionInject) {
            postSessionInject.call(null, amorphicRouter);
        }
        amorphicRouter.use(router.bind(this, sessions, nonObjTemplatelogLevel, controllers));
        // amorphicRouter.get('/', function () {console.log('GET route')});
        // amorphicRouter.post('/', function () {console.log('POST route')});
        // amorphicRouter.put('/', function () {console.log('PUT route')});
        // amorphicRouter.patch('/', function () {console.log('PATCH route')});
        // amorphicRouter.delete('/', function () {console.log('DELETE route')});
        // amorphicRouter.head('/', function () {console.log('HEAD route')});
        var amorphicPath = '/amorphic/xhr';
        /**
         * where we set up all daemon mode stuff
        */
        server.app.use("" + amorphicPath, amorphicRouter);
        appContext.server = server.app.listen(amorphicOptions.port);
    };
    /**
     * To be implemented
     */
    AmorphicServer.prototype.registerAppMiddlewares = function () {
    };
    return AmorphicServer;
}());
exports.AmorphicServer = AmorphicServer;
//# sourceMappingURL=AmorphicServer.js.map