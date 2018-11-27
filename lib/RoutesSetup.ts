import { Handler, ErrorRequestHandler } from 'express';
export enum RouteType {  GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD }

/**
 * NOTE: The order in which you export your Routes and your Middlewares matter.
 * Your middlewares/routes will be registered sequentially as they are exported, so if you export them as
 *  export * from './a'
 *  export * from './b'
 *  export * from './c'
 * 
 * A will be the first middleware registered, then B, and so on. See the Middleware section for special handling of error middlewares
 */

/**
* @member HTTPMethod - array of RouteTypes (get, post) depending on what you want the route to do.
* Usually it is only necessary to register on
* @member callbacks - array of callbacks that will be called sequentially when this route is hit. 
* This array can be treated as one idempotent set
*/
export interface RouteHandlers {
    HTTPMethod: RouteType;
    callbacks: Handler[];
}

/**
 * Route interface. Should be exported in apps/<app_name>/server/middlewares/index.ts
 * 
 * @member path - path for this route
 * @member handlers - array of subRoutes (for nested Routes) and RouteHandlers
 */
export interface Router {
    path: string;
    handlers: (Router | RouteHandlers)[];
}

/**
 * Middleware interfaces. Should be exported in apps/<app_name>/server/middlewares/index.ts
**/

export type Middleware = GenericMiddleware | ErrorMiddleware;


/**
 * Interface for generic middlewares (bodyparser, compression, etc.)
 * 
 * @member path - optional param if this middleware is custom to a specific route (as opposed to all (default))
 * @member callbacks - optional array of callbacks that will be called sequentially. 
 * This array can be treated as one idempotent set. 
 * @member errorCallback - optional callback for the last middleware, which, if exists should be an error handler
 *                        if no path is given, then is registered on all
 */
export interface GenericMiddleware {
    path?: string;
    callbacks: Handler[];
}


/**
 * NOTE: Error middlewares should always be exported after the other middlewares are finished executing.
 * These middlewares are also sequential, meaning that the order in which you export them matters greatly.
 * 
 * If you export an ErrorMiddleware 'A' with a path '/v1' first, and then you export another ErrorMiddleware 
 * 'B' with the path '/v1/customers', in that specific sequence, then 'A' will be the one that is caught, and 
 * if 'A' ends the response, then 'B' will not trigger.
 */

/**
 * Interfaces for specific error handling middlewares. 
 * 
 * @member path - optional param if this middleware is custom to a specific route (as opposed to all (default))
 * @member errorCallback - optional callback for the last middleware, which, if exists should be an error handler
 *                          if no path is given, then is registered on all
 */
export interface ErrorMiddleware {
    path?: string;
    errorCallback: ErrorRequestHandler;
}
