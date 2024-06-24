import LightningDatatable from 'lightning/datatable';
import statusDropdown from './customDropdown.html';
import customImage from './customImageandName.html';
export default class CustomDatatable extends LightningDatatable {



    options = [
        { label: 'Open', value: 'Open' },
        { label: 'Close', value: 'Close' },
        { label: 'Pending', value: 'Pending' }
    ];

    static customTypes = {
        statusDropdown: {
            template: statusDropdown,
            standardCellLayout: true,
            typeAttributes: ['value', 'rowId']
        },
        customImage: {
            template: customImage,
            standardCellLayout: true,
            typeAttributes: ['name','image']
        },
    }
}