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
var setupCustomRoutes = require('./setupCustomRoutes').setupCustomRoutes;
var setupCustomMiddlewares = require('./setupCustomMiddlewares').setupCustomMiddlewares;
var nonObjTemplatelogLevel = 1;
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var express = require("express");
var fs = require("fs");
var compression = require("compression");
var http = require("http");
var https = require("https");
//@TODO: Experiment with app.engine so we can have customizable SSR
var AmorphicServer = /** @class */ (function () {
    /**
     *
     * @param {express.Express} app, an instance of an express server
     * @param {string} serverMode
     */
    function AmorphicServer(app, serverMode) {
        this.routers = [];
        this.app = app;
        this.serverMode = serverMode;
    }
    /**
    *
    * @param preSessionInject - callback before server starts up
    * @param postSessionInject - callback after server starts up
    * @param appList - List of strings that are all the apps
    * @param appStartList - List of strings that have the app names for start
    * @param appDirectory - Location of the apps folder
    * @param sessionConfig - Object containing the session config
    */
    AmorphicServer.createServer = function (preSessionInject, postSessionInject, appList, appStartList, appDirectory, sessionConfig) {
        var amorphicOptions = AmorphicContext.amorphicOptions;
        var mainApp = amorphicOptions.mainApp;
        var appConfig = AmorphicContext.applicationConfig[mainApp];
        var server = new AmorphicServer(express(), appConfig.appConfig.serverMode);
        var amorphicRouterOptions = {
            amorphicOptions: amorphicOptions,
            preSessionInject: preSessionInject,
            postSessionInject: postSessionInject,
            appList: appList,
            appStartList: appStartList,
            appDirectory: appDirectory,
            sessionConfig: sessionConfig
        };
        var serverOptions = appConfig.appConfig && appConfig.appConfig.serverOptions;
        var apiPath = serverOptions && serverOptions.apiPath;
        server.setupUserEndpoints(appDirectory, appList[mainApp], apiPath);
        // for anything other than user only routes, set up our default amorphic router.
        if (server.serverMode !== 'api') {
            server.setupAmorphicRouter(amorphicRouterOptions);
        }
        server.app.locals.name = mainApp;
        server.app.locals.version = serverOptions && serverOptions.version;
        // Default port for described
        var port = AmorphicContext.amorphicOptions.port;
        var securePort = serverOptions && serverOptions.securePort;
        var isSecure = serverOptions && serverOptions.isSecure;
        // Secure App (https)
        if (isSecure) {
            var serverOptions_1 = appConfig.appConfig.serverOptions;
            var httpServer = void 0;
            // Use a securePort            
            if (securePort) {
                var serverOptions_2 = appConfig.appConfig.serverOptions;
                httpServer = https.createServer(serverOptions_2, server.app).listen(securePort);
                AmorphicContext.appContext.secureServer = httpServer;
            }
            else {
                httpServer = https.createServer(serverOptions_1, server.app).listen();
                AmorphicContext.appContext.secureServer = httpServer;
            }
        }
        // @TODO: convert to http2 with node-spdy
        // Unsecure App (http)
        AmorphicContext.appContext.server = http.createServer(server.app).listen(port);
        AmorphicContext.appContext.expressApp = server.app;
    };
    /**
    * @static
    * @param {string} appDirectory is the directory wher the app is located
    * @param {AmorphicServer} server
    * @returns {express.Express}
    * @memberof AmorphicServer
    */
    AmorphicServer.prototype.setupStatics = function (appDirectory) {
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
        this.app.use('/modules/', express.static(appDirectory + "/node_modules"))
            .use('/bindster/', express.static(rootBindster + "/node_modules/amorphic-bindster"))
            .use('/amorphic/', express.static(appDirectory + "/node_modules/amorphic"))
            .use('/common/', express.static(appDirectory + "/apps/common"))
            .use('/supertype/', express.static(rootSuperType + "/node_modules/supertype"))
            .use('/semotus/', express.static(rootSemotus + "/node_modules/semotus"));
        return this.app;
    };
    AmorphicServer.prototype.setupAmorphicRouter = function (options) {
        var amorphicOptions = options.amorphicOptions, preSessionInject = options.preSessionInject, postSessionInject = options.postSessionInject, appList = options.appList, appStartList = options.appStartList, appDirectory = options.appDirectory, sessionConfig = options.sessionConfig;
        var mainApp = amorphicOptions.mainApp;
        var appConfig = AmorphicContext.applicationConfig[mainApp];
        var reqBodySizeLimit = appConfig.reqBodySizeLimit || '50mb';
        var controllers = {};
        var sessions = {};
        var downloads = generateDownloadsDir();
        /*
         * @TODO: make compression only process on amorphic specific routes
         */
        if (amorphicOptions.compressXHR) {
            this.app.use(compression());
        }
        /*
        * @TODO: Stop exposing this.app through presessionInject and postSessionInject
        *   Only pass in router instead of app
        */
        if (preSessionInject) {
            preSessionInject.call(null, this.app);
        }
        var appPaths = [];
        /*
         * @TODO: seperate out /appName/ routes to their own expressRouter objects
         * Candidate for future deprecation because we only run app at a time
         */
        for (var appName in appList) {
            if (appStartList.includes(appName)) {
                var appPath = appDirectory + "/" + appList[appName] + "/public";
                appPaths.push(appPath);
                this.app.use("/" + appName + "/", express.static(appPath, { index: 'index.html' }));
                if (appName === mainApp) {
                    this.app.use('/', express.static(appPath, { index: 'index.html' }));
                }
                logMessage(appName + " connected to " + appPath);
            }
        }
        /*
        *  Setting up the general statics
        */
        this.setupStatics(appDirectory);
        /*
         *  Setting up the different middlewares for amorphic
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
        amorphicRouter.use(cookieMiddleware)
            .use(expressSesh)
            .use(uploadRouter.bind(null, downloads))
            .use(downloadRouter.bind(null, sessions, controllers, nonObjTemplatelogLevel))
            .use(bodyLimitMiddleWare)
            .use(urlEncodedMiddleWare)
            .use(postRouter.bind(null, sessions, controllers, nonObjTemplatelogLevel))
            .use(amorphicEntry.bind(null, sessions, controllers, nonObjTemplatelogLevel));
        if (postSessionInject) {
            postSessionInject.call(null, this.app);
        }
        amorphicRouter.use(router.bind(null, sessions, nonObjTemplatelogLevel, controllers));
        var amorphicPath = '/amorphic';
        this.app.use("" + amorphicPath, amorphicRouter);
        this.routers.push({ path: amorphicPath, router: amorphicRouter });
    };
    /**
     *
     *
     * @param {*} appDirectory
     * @param {*} mainAppPath
     * @param {string} [apiPath='/api'] Default to '/api' as the default setting
     * for amorphic is for the '/amorphic' routes to run
     * @memberof AmorphicServer
     */
    AmorphicServer.prototype.setupUserEndpoints = function (appDirectory, mainAppPath, apiPath) {
        if (apiPath === void 0) { apiPath = '/api'; }
        var filePath = this.getBaseControllerFilePath(appDirectory, mainAppPath);
        var router = setupCustomMiddlewares(filePath, express.Router());
        router = setupCustomRoutes(filePath, router);
        if (router) {
            this.app.use(apiPath, router);
            this.routers.push({ path: apiPath, router: router });
        }
    };
    AmorphicServer.prototype.getBaseControllerFilePath = function (appDirectory, mainAppPath) {
        var codeLocation;
        if (this.serverMode === 'api' || this.serverMode === 'daemon') {
            codeLocation = 'js';
        }
        else {
            codeLocation = 'public/js';
        }
        return appDirectory + "/" + mainAppPath + "/" + codeLocation + "/";
    };
    return AmorphicServer;
}());
exports.AmorphicServer = AmorphicServer;
//# sourceMappingURL=AmorphicServer.js.map