'use strict';
let assert = require('chai').assert;
let Bluebird = require('bluebird');
let amorphic = require('../../dist/index.js');
let axios = require('axios');
let fs = require('fs');
let path = require('path');
let amorphicContext = require('../../dist/lib/AmorphicContext');

describe('Run amorphic as deamon only', function() {

    this.timeout(5000);

    before(function(done) {
        amorphic.listen(__dirname);
        done();
    });

    it('can call the listen function to setup amorphic, and init the app controller', function() {
        assert.isOk(daemonController, 'The daemonController was created');
        assert.isTrue(daemonController.prop, 'The daemonController was initialized');

        assert.equal(daemonController.getObjectTemplate().controller, daemonController, 'The objectTemplate\'s controller references where set up');
    });

    it('should create the download directory', function() {
        let downloadPath = path.join(path.dirname(require.main.filename), 'download');
        assert.isTrue(fs.existsSync(downloadPath), 'The download path exists');
    });

    it('should have values with descriptions', function() {
        assert.strictEqual(daemonController.__values__('propWithValuesAndDescriptions').length, 1, 'The correct values for the prop');
        assert.strictEqual(daemonController.__values__('propWithValuesAndDescriptions')[0], 'value', 'The correct values for the prop');
        assert.strictEqual(daemonController.__descriptions__('propWithValuesAndDescriptions')['value'], 'Description', 'The correct description for the value');
    });

    it('should have virtual properties', function() {
        assert.strictEqual(daemonController.virtualProp, 'I am virtual', 'Can use virutal props');
    });


    it('should get an 200 response from a custom GET endpoint', function() {
        return axios.get('http://localhost:3001/api/test')
            .then(function(response) {
                assert.isOk(response, 'The response is ok');
                assert.strictEqual(response.status, 200, 'The response code was 200');
                assert.strictEqual(response.data, 'test API endpoint OK');
            });
    });

    it('should get a response from a second custom endpoint', function() {
        return axios.get('http://localhost:3001/api/test-other-endpoint')
            .then(function(response) {
                assert.isOk(response, 'The response is ok');
                assert.strictEqual(response.status, 200, 'The response code was 200');
                assert.strictEqual(response.data, 'test API endpoint OK');
            });
    });

    it('should use middleware limits to reject a POST request that\'s too large', function() {
        return axios.post('http://localhost:3001/api/middleware-endpoint', {
            firstName: 'Fred',
            lastName: 'Flintstone'
        })
        .catch(function(response) {
            assert.strictEqual(response.response.status, 413, 'The response code was 413');
        });
    });

    it('should post to the endpoint successfully', function() {
        return axios.post('http://localhost:3001/api/middleware-endpoint', {})
            .then(function(response) {
                assert.strictEqual(response.status, 200, 'The response code was 200');
            });
    });

    // Amorphic xhr tests
    it('should error out because amorphic/xhr cannot be reached', function() {
        return axios.get('http://localhost:3001/amorphic/xhr')
            .then(function() {
                assert.isNotOk('To be here');
            })
            .catch(function(response) {
                assert.isOk(response, 'The error response is ok');
                assert.strictEqual(response.message, 'Request failed with status code 404', 'The response message was correct');
                assert.strictEqual(response.response.status, 404, 'The response code was 404');
            });
    });

    after(function(done) {
        // Clean up server
        if(amorphicContext.appContext.server){
            amorphicContext.appContext.server.close();
        }
        done();
    });
});
