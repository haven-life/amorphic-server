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
 * Interface for any controller that wants to utilize the various route handlers built into Amorphic
 *
 * Should NOT be used independently of IAmorphicAppController
 * Defines optional functionality / callbacks to tap into Amorphic's potential
 * @export
 * @interface IAmorphicRouteController
 */
export interface IAmorphicRouteController {

    onContentRequest(...args)
    processPost();

}