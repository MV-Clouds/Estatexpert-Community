import { LightningElement,api } from 'lwc';
import LightningDatatable from 'lightning/datatable';
import statusDropdown from './customDropdown.html';
export default class Esx_InquiryPageStatusDropdown extends LightningElement {

    @api value;
    @api rowId;

    options = [
        { label: 'Open', value: 'Open' },
        { label: 'Close', value: 'Close' },
        { label: 'Pending', value: 'Pending' }
    ];

    static customTypes = {
        statusDropdown: {
            template: statusDropdown,
            standardCellLayout: true,
            typeAttributes: ['value', 'rowId'],
            typeAttributes: ['title']
        },
    }

    handleChange(event) {
        const selectedEvent = new CustomEvent('statuschange', {
            detail: {
                value: event.detail.value,
                rowId: this.rowId
            }
        });
        this.dispatchEvent(selectedEvent);
    }
}