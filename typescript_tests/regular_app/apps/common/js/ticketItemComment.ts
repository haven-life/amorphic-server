import { supertypeClass, property }  from '../../../../../index.js';
import { Ticket } from './ticket';
import { TicketItem } from './ticketItem';

@supertypeClass
export class TicketItemComment extends TicketItem { //  extends TicketItem

    @property({rule: ['required']})
    text:               string;

     // Only called on the server
    constructor (ticket: Ticket, text, creator?) {
        super(ticket, creator);
        this.text = text;
    };


     remove () {
         this.persistDelete();
     };
};