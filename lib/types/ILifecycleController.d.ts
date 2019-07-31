import { Supertype } from '@havenlife/supertype';

type callContext = { retries: number; startTime: Date };
type errorType = 'error' | 'retry' | 'response';
type changeString = { [key: string]: string };
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
 * Interface for any controller that wants to utilize the lifecycle methods in Amorphic
 *
 * Should NOT be used independently of IAmorphicAppController
 * Defines optional functionality / callbacks to tap into Amorphic's potential
 * 
 * @export
 * @interface ILifecycleController
 */
export interface ILifecycleController {

    /**
    * @client
    *
    * Handler that runs prior to session expiry, or logout
    * Allows the client to determine custom logic to run on session expiration
    * 
    * If not implemented, uses default expireController function, defined in client.js
    * 
    * Suggestion on implementation: 
    *  1) Custom work and utilize to expireController (runs on client), clears the session on client
    *  AND / OR 
    *  2) Custom work and utilize amorphic's expireSession which only runs on server (needs to remote in). Clears the session on the server
    */
    publicExpireSession(): void;

    /**
     *@client
     *
     * Upon a new session ( 1st time or Server restart / expiry )
     * This function will be called to allow the developer a hook to clean up any state on the front end instance of the controller 
     * @memberof AmorphicAppController
     */
    shutdown(): void;
    preServerCall();

    /**
     * A hook into 
     *
     * @param {boolean} hasChanges
     * @param {callContext} callContext
     * @param {changeString} changeString
     * @memberof ILifecycleController
     */
    postServerCall(hasChanges: boolean, callContext: callContext, changeString: changeString);

    /**
 * @server
 *
 * Callback to handle errors on a remote call. 
 * 
 * Executes after every other step in the remote call pipeline (see remote call documentation)
 * but before retrying the call (or packaging response and sending back to client)
 *
 * @param {errorType} errorType - Error type associated (error, retry, response)
 * @param {number} remoteCallId - Id for remote call
 * @param {extends Supertype} remoteObj - Instance for which the remote object function is called for - @TODO: revisit when we create a proper remoteable type
 * @param {string} functionName - Name of function being called
 * @param {callContext} callContext - Context (number of retries etc)
 * @param {[key: string]: string} changeString - Object of Changes - Key is [ClassName].[propertyName], Value is [changedValue] example: {'Customer.middlename': 'Karen'}
 * @memberof Controller
 */
    postServerErrorHandler(errorType: errorType, remoteCallId: number, remoteObj: Supertype, functionName: string, callContext: callContext, changeString: changeString);
    serverInit();

    /**
     * @client
     * 
     * 'This' is a new controller instance generated for the new session on the front end
     *  This is a hook to set anything up on a new front end controller tied to this new session
     * 
     * @param {number} sessionExpiration - The number in ms for the expiration time of a session
     * @memberof AmorphicAppController
     */
    clientInit(sessionExpiration?: number);

    /**
     * @client
     * @deprecated
     * 
     * Previous handler for publicExpireSession
     *
     * @memberof AmorphicAppController
     */
    clientExpire();

}