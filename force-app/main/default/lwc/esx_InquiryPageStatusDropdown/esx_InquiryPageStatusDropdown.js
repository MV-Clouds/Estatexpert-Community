import { LightningElement,api } from 'lwc';

export default class Esx_InquiryPageStatusDropdown extends LightningElement {

    @api value;
    @api rowId;

    options = [
        { label: 'Open', value: 'Open' },
        { label: 'Close', value: 'Close' },
        { label: 'Pending', value: 'Pending' }
    ];

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