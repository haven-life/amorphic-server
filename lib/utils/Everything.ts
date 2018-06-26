import {Supertype} from 'supertype';
import {Bindable} from 'amorphic-bindster';
import {Remoteable} from './remoteable';
import {Persistable} from 'persistor';

export class Everything extends Persistable(Remoteable(Bindable(Supertype))) {};
