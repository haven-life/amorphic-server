import {Supertype} from 'supertype';
import {Bindable} from 'amorphic-bindster';
import {Remoteable} from './remoteable';

export class AppController extends Remoteable(Bindable(Supertype)) {};
