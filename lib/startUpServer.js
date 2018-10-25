'use strict';

// Internal modules
let AmorphicContext = require('./AmorphicContext');
let Logger = require('./utils/logger');
let logMessage = Logger.logMessage;
let processFile = require('./routes/processFile').processFile;
let initializePerformance = require('./utils/initializePerformance').initializePerformance;
let amorphicEntry = require('./amorphicEntry').amorphicEntry;
let processPost = require('./routes/processPost').processPost;
let processMessage = require('./routes/processMessage').processMessage;
let processContentRequest = require('./routes/processContentRequest').processContentRequest;
let generateDownloadsDir = require('./utils/generateDownloadsDir').generateDownloadsDir;
let nonObjTemplatelogLevel = 1;

// External dependencies
let cookieParser = require('cookie-parser');
let express = require('express');
let fs = require('fs');

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
function startUpServer(preSessionInject, postSessionInject, appList, appStartList, appDirectory, sessionRouter) {

    let controllers = {};
    let downloads;
    let sessions = {};

    let amorphicOptions = AmorphicContext.amorphicOptions;
    let mainApp = amorphicOptions.mainApp;
    console.log("our main app is", mainApp);
    let appContext = AmorphicContext.appContext;
    let appConfig = AmorphicContext.applicationConfig[mainApp];
    let reqBodySizeLimit = appConfig.reqBodySizeLimit || '50mb';
    let app = express();
    // const amorphicRequestURIBase = '/amorphic/';
    const amorphicRequestURIBase = `/amorphic/xhr?path=${mainApp}`;

    downloads = generateDownloadsDir();

    if (amorphicOptions.compressXHR) {
        app.use(require('compression')());
    }

    if (preSessionInject) {
        preSessionInject.call(null, app);
    }

    for (let appName in appList) {
        if (appStartList.indexOf(appName) >= 0) {
            let appPath = appDirectory + '/' + appList[appName] + '/public';

            app.use('/' + appName + '/', express.static(appPath, {index: 'index.html'}));

            if (appName === mainApp) {
                app.use('/', express.static(appPath, {index: 'index.html'}));
            }

            logMessage(appName + ' connected to ' + appPath);
        }
    }

    // // TODO: Do we actually need these checks?
    // let rootSuperType = __dirname;
    //
    // if (fs.existsSync(appDirectory + '/node_modules/supertype')) {
    //     rootSuperType = appDirectory;
    // }
    //
    // let rootSemotus = __dirname;
    //
    // if (fs.existsSync(appDirectory + '/node_modules/semotus')) {
    //     rootSemotus = appDirectory;
    // }
    //
    // let rootBindster = __dirname;
    //
    // if (fs.existsSync(appDirectory + '/node_modules/amorphic-bindster')) {
    //     rootBindster = appDirectory;
    // }

    /* amorphic default middlewares */
    app.use(initializePerformance)
        .use(cookieParser())
        .use(sessionRouter)
        .use(express.json({
            limit: reqBodySizeLimit
        }))
        .use(express.urlencoded({
            extended: true
        }));

    app.post('/amorphic/file', processFile.bind(this, downloads));
    app.get('/amorphic/file', processContentRequest.bind(this, sessions, controllers, nonObjTemplatelogLevel))
        // .use('/modules/', express.static(appDirectory + '/node_modules'))
        // .use('/bindster/', express.static(rootBindster + '/node_modules/amorphic-bindster'))
        // .use('/amorphic/', express.static(appDirectory + '/node_modules/amorphic'))
        // .use('/common/', express.static(appDirectory + '/apps/common'))
        // .use('/supertype/', express.static(rootSuperType + '/node_modules/supertype'))
        // .use('/semotus/', express.static(rootSemotus + '/node_modules/semotus')
        .post(`${amorphicRequestURIBase}form`, processPost.bind(this, sessions, controllers, nonObjTemplatelogLevel))
        .use(amorphicEntry.bind(this, sessions, controllers, nonObjTemplatelogLevel));


    if (postSessionInject) {
        postSessionInject.call(null, app);
    }

    app.post(processMessage.bind(this, sessions, nonObjTemplatelogLevel, controllers));

    appContext.server = app.listen(amorphicOptions.port);
}

module.exports = {
    startUpServer: startUpServer
};
