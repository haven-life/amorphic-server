'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Bluebird = require("bluebird");
var amorphic = require('../../../dist/index.js');
var axios = require("axios");
var fs = require("fs");
var path = require("path");
var amorphicContext = require('../../../dist/lib/AmorphicContext');
var daemonController;
describe('Run amorphic as a deamon', function () {
    this.timeout(5000);
    before(function (done) {
        amorphic.listen(__dirname);
        done();
    });
    it('can call the listen function to setup amorphic, and init the app controller', function () {
        chai_1.assert.isOk(daemonController, 'The daemonController was created');
        chai_1.assert.isTrue(daemonController.prop, 'The daemonController was initialized');
        chai_1.assert.equal(daemonController.getObjectTemplate().controller, daemonController, 'The objectTemplate\'s controller references where set up');
    });
    it('should create the download directory', function () {
        var downloadPath = path.join(path.dirname(require.main.filename), 'download');
        chai_1.assert.isTrue(fs.existsSync(downloadPath), 'The download path exists');
    });
    it('should have values with descriptions', function () {
        chai_1.assert.strictEqual(daemonController.__values__('propWithValuesAndDescriptions').length, 1, 'The correct values for the prop');
        chai_1.assert.strictEqual(daemonController.__values__('propWithValuesAndDescriptions')[0], 'value', 'The correct values for the prop');
        chai_1.assert.strictEqual(daemonController.__descriptions__('propWithValuesAndDescriptions')['value'], 'Description', 'The correct description for the value');
    });
    it('should have virtual properties', function () {
        chai_1.assert.strictEqual(daemonController.virtualProp, 'I am virtual', 'Can use virutal props');
    });
    it('can download a file', function () {
        return new Bluebird(function (resolve, reject) {
            try {
                resolve(fs.readFileSync(__dirname + '/./apps/daemon/js/DownloadTest.txt'));
            }
            catch (e) {
                reject(e);
            }
        })
            .then(function (fileData) {
            return axios.get('http://localhost:3001/amorphic/xhr?path=daemon&file=DownloadTest.txt')
                .then(function (response) {
                chai_1.assert.isOk(response, 'The response is ok');
                chai_1.assert.strictEqual(response.status, 200, 'The response code was 200');
                chai_1.assert.strictEqual(response.data, fileData.toString(), 'The file data matches');
            });
        });
    });
    it('should 404 when the file is not there', function () {
        return axios.get('http://localhost:3001/amorphic/xhr?path=daemon&file=NotFound.txt')
            .then(function () {
            chai_1.assert.isNotOk('To be here');
        })
            .catch(function (response) {
            chai_1.assert.isOk(response, 'The error response is ok');
            chai_1.assert.strictEqual(response.message, 'Request failed with status code 404', 'The response message was correct');
            chai_1.assert.strictEqual(response.response.status, 404, 'The response code was 404');
            chai_1.assert.strictEqual(response.response.data, 'Not found', 'The error data matches');
        });
    });
    it('should get an 200 response from a custom GET endpoint', function () {
        return axios.get('http://localhost:3001/api/test')
            .then(function (response) {
            chai_1.assert.isOk(response, 'The response is ok');
            chai_1.assert.strictEqual(response.status, 200, 'The response code was 200');
            chai_1.assert.strictEqual(response.data, 'test API endpoint OK');
        });
    });
    after(function (done) {
        // Clean up server
        if (amorphicContext.appContext.server) {
            amorphicContext.appContext.server.close();
        }
        done();
    });
});
//# sourceMappingURL=unittest.js.map