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
var cookieParser = require("cookie-parser");
var express = require("express");
var fs = require("fs");
var serveStatic = require("serve-static");
var compression = require("compression");
var AmorphicServer = /** @class */ (function () {
    /**
        * Purpose unknown
        *
        * @param {express.Express} app Express server
        *
     **/
    function AmorphicServer(app) {
        this.app = app;
    }
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
    AmorphicServer.createServer = function (preSessionInject, postSessionInject, appList, appStartList, appDirectory, sessionRouter) {
        var controllers = {};
        var downloads;
        var sessions = {};
        var amorphicOptions = AmorphicContext.amorphicOptions;
        var mainApp = amorphicOptions.mainApp;
        var appContext = AmorphicContext.appContext;
        var appConfig = AmorphicContext.applicationConfig[mainApp];
        var reqBodySizeLimit = appConfig.reqBodySizeLimit || '50mb';
        var server = new AmorphicServer(express());
        downloads = generateDownloadsDir();
        if (amorphicOptions.compressXHR) {
            server.app.use(compression());
        }
        if (preSessionInject) {
            preSessionInject.call(null, server.app);
        }
        for (var appName in appList) {
            if (appStartList.includes(appName)) {
                var appPath = appDirectory + "/" + appList[appName] + "/public";
                server.app.use("/" + appName + "/", serveStatic(appPath, { index: 'index.html' }));
                if (appName === mainApp) {
                    server.app.use('/', serveStatic(appPath, { index: 'index.html' }));
                }
                logMessage(appName + " connected to " + appPath);
            }
        }
        // TODO: Do we actually need these checks?
        var rootSuperType = __dirname;
        if (fs.existsSync(appDirectory + "/node_modules/supertype")) {
            rootSuperType = appDirectory;
        }
        var rootSemotus = __dirname;
        if (fs.existsSync(appDirectory + "/node_modules/semotus")) {
            rootSemotus = appDirectory;
        }
        var rootBindster = __dirname;
        if (fs.existsSync(appDirectory + "/node_modules/amorphic-bindster")) {
            rootBindster = appDirectory;
        }
        server.app.use(initializePerformance)
            .use('/modules/', serveStatic(appDirectory + "/node_modules"))
            .use('/bindster/', serveStatic(rootBindster + "/node_modules/amorphic-bindster"))
            .use('/amorphic/', serveStatic(appDirectory + "/node_modules/amorphic"))
            .use('/common/', serveStatic(appDirectory + "/apps/common"))
            .use('/supertype/', serveStatic(rootSuperType + "/node_modules/supertype"))
            .use('/semotus/', serveStatic(rootSemotus + "/node_modules/semotus"))
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
    };
    return AmorphicServer;
}());
exports.AmorphicServer = AmorphicServer;
//# sourceMappingURL=AmorphicServer.js.map