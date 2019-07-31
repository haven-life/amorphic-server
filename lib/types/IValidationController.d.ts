/**
 * Some additional terms
 * 
 * @client - Functionality that executes on the client side
 * @server - Functionality that executes on the server side
 * 
 * @misnomer - Functionality that may have confusing nomenclature
 * 
 * @deprecated - Deprecated functionality that is not used anymore
 */

/**
 * Interface for any controller that wants to utilize the validation methods in Amorphic
 *
 * Should NOT be used independently of IAmorphicAppController
 * Defines optional functionality / callbacks to tap into Amorphic's potential
 * @export
 * @interface IValidationController
 */
export interface IValidationController {

    validateServerIncomingObjects();
    validateServerIncomingObject();
    validateServerCall();
    validateServerIncomingProperty();

}