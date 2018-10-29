export {Supertype} from 'supertype';
export {Persistable, ContainsPersistable, Persistor} from 'persistor';
export {Remoteable, amorphicStatic} from './lib/utils/remoteable';
export {Bindable} from 'amorphic-bindster';
import {Persistor} from 'persistor';
import { Handler } from 'express';

// This class is for Amorphic unit tests
export class Amorphic extends Persistor {
    static create () : Amorphic;
    connect (configDirectory, schemaDirectory?)
    incomingIp: string;
}

export declare var Config : any;
export function remote(props?);
export function property(props?: Object);
export function supertypeClass(props?: any);

export enum RouteType {
    //@TODO: fill with get, put, etc. see express's index.d.ts for the list of stuff
}

export interface Route {
    path: string;
    HTTPMethod: RouteType;
    callback: Handler;
}