import { IValidationController } from './IValidationController';
import { ILifecycleController } from './ILifecycleController';
import { IAmorphicRouteController } from './IAmorphicRouteController';
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
 * Basic interface for any Amorphic Application Controller
 *
 * Defines optional functionality / callbacks to tap into Amorphic's potential
 * @export
 * @interface IAmorphicAppController
 */
export interface IAmorphicAppController extends IValidationController, ILifecycleController, IAmorphicRouteController {

    /**
     * Miscellaneous Hooks
     */

    /**
     * @client
     * 
     * Error handler to catch 'internal error's from Semotus propagated back to the client
     * 
     * @param err Generic Semotus error caught and propogated up to this handler
     */
    handleRemoteError(err: Error): void;

    /**
     * @misnomer
     * @client 
     * 
     * Hook into the stringified log from a front end amorphic instance's logger 
     * 
     * @param {string} output
     * @memberof AmorphicAppController
     */
    displayError(output: string): void;

}