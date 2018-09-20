'use strict';

let unitTestConfig = require('./unitTestConfig');  // TODO: This seems like the wrong way to go about this.
let Supertype = require('supertype');
// Passed the main index export.  Will bind the decorators to either Persistor or Semotus
function bindDecorators (objectTemplate) {

    // TODO: In what situation would objectTemplate be null and why is it acceptable just to use this as a replacement?
    objectTemplate = objectTemplate || this;

    this.Amorphic = objectTemplate;
    this.amorphicStatic = objectTemplate;

    /**
     * Purpose unknown
     *
     * @param {unknown} target unknown
     * @param {unknown} props unknown
     *
     * @returns {unknown} unknown.
     */
    this.supertypeClass = function supertypeClass(target, props) {
        let supertypeClass = useDefault(objectTemplate, 'supertypeClass');
        return supertypeClass(target, props, objectTemplate);
    };

    /**
     * Purpose unknown
     *
     * @returns {unknown} unknown.
     */
    this.Supertype = function Supertype() {
        let defaultSupertype = useDefault(objectTemplate, 'Supertype');
        return defaultSupertype.call(this, objectTemplate);
    };
    this.Supertype.prototype = Supertype.Supertype.prototype;

    /**
     *  Purpose unknown
     *
     * @param {unknown} props unknown
     *
     * @returns {unknown} unknown.
     */
    this.property = function property(props) {
        let property = useDefault(objectTemplate, 'property');
        return property(props, objectTemplate);
    };

    /**
     * Purpose unknown
     *
     * @param {unknown} defineProperty unknown
     *
     * @returns {unknown} unknown.
     */
    this.remote = function remote(defineProperty) {
        let remote = useDefault(objectTemplate, 'remote');
        return remote(defineProperty, objectTemplate);
    };

    /**
     * Purpose unknown
     *
     * @returns {unknown} unknown.
     */
    this.Amorphic.create = function create() {
        objectTemplate.connect = unitTestConfig.startup;

        return objectTemplate;
    };

    this.Amorphic.getInstance = function getInstance() {
        return objectTemplate;
    };
}

/**
 * For tests to use Supertype's default if the class doesn't have the associated property
 *
 * @param {*} objectTemplate
 * @param {*} prop
 * @returns
 */
function useDefault(objectTemplate, prop) {
    return objectTemplate[prop] || Supertype[prop];
}

module.exports = {
    bindDecorators: bindDecorators
};
