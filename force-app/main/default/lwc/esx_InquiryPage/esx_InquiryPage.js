import { LightningElement,track,wire } from 'lwc';
import backgroundImage from "@salesforce/resourceUrl/FavoriteProperties";
export default class Esx_InquiryPage extends LightningElement {

    // static customTypes = {
    //     statusDropdown: {
    //         template: statusDropdown,
    //         standardCellLayout: true,
    //         typeAttributes: ['value', 'rowId'],
    //         typeAttributes: ['title']
    //     },
    // }

    BgImage = backgroundImage + '/Bg-Image.png';

    @track data = [
        { id: 1, propertyName: 'Property Name', buyerName: 'Evan Flores', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Open', action: 'Open' },
        { id: 2, propertyName: 'Property Name', buyerName: 'Arlene Wilson', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close' },
        { id: 3, propertyName: 'Property Name', buyerName: 'Jennie Cooper', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close' },
        { id: 4, propertyName: 'Property Name', buyerName: 'Philip Steward', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Pending', action: 'Pending' },
        { id: 5, propertyName: 'Property Name', buyerName: 'Jorge Black', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Open', action: 'Open' },
        { id: 6, propertyName: 'Property Name', buyerName: 'Gladys Jones', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close' }
    ];
    // @track data = [];
    @track error;

    @track filteredData = this.data;

    columns = [
        { label: 'No.', fieldName: 'id', type: 'text',fixedWidth: 70, },
        { label: 'Property Name', fieldName: 'propertyName', type: 'text' },
        { label: 'Buyer Name', fieldName: 'buyerName', type: 'text' },
        { label: 'Mobile No.', fieldName: 'mobileNo', type: 'phone' },
        { label: 'Email ID', fieldName: 'emailId', type: 'email' },
        { label: 'Inquiry Date', fieldName: 'inquiryDate', type: 'text' },
        // { label: 'Status', fieldName: 'status', type: 'text' },
        {
            label: 'Status',
            fieldName: 'status',
            type: 'statusDropdown',
            typeAttributes: {
                value: { fieldName: 'status' },
                rowId: { fieldName: 'id' }
            }
        },

        {   
            label:'Action',
            type: 'button-icon',
            fixedWidth: 90,
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'delete',
                variant: 'bare',
                alternativeText: 'Delete'
            }
        } 
       ];

    // columns = [
    //     { label: 'No.', fieldName: 'id', type: 'text',fixedWidth: 70, },
    //     { label: 'Property Name', fieldName: 'Listing__r.Property__r.Name', type: 'text' },
    //     { label: 'Buyer Name', fieldName: 'Contact__r.Name', type: 'text' },
    //     { label: 'Mobile No.', fieldName: 'Contact__r.MobilePhone', type: 'phone' },
    //     { label: 'Email ID', fieldName: 'Contact__r.Email', type: 'email' },
    //     { label: 'Inquiry Date', fieldName: 'Inquiry_Date__c', type: 'text' },
    //     { label: 'Status', fieldName: 'Status__c', type: 'text' },
    //     // {
    //     //     label: 'Status',
    //     //     fieldName: 'status',
    //     //     type: 'customDropdown',
    //     //     typeAttributes: {
    //     //         value: { fieldName: 'status' },
    //     //         rowId: { fieldName: 'id' }
    //     //     }
    //     // },

    //     {   
    //         label:'Action',
    //         type: 'button-icon',
    //         fixedWidth: 90,
    //         typeAttributes: {
    //             iconName: 'utility:delete',
    //             name: 'delete',
    //             variant: 'bare',
    //             alternativeText: 'Delete'
    //         }
    //     } 
    //    ];

    // @wire(getInquiries)
    // wiredInquiries({ error, data }) {
    //     console.log('data:',data);
    //     if (data) {
    //         this.data = data;
    //         // this.setColumns(data);
    //     } else if (error) {
    //         this.error = error;
    //         this.data = undefined;
    //     }
    // }


    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'delete') {
            this.deleteRow(row);
        }
    }

    deleteRow(row) {
        const index = this.data.indexOf(row);
        if (index > -1) {
            this.data.splice(index, 1);
            this.filteredData = [...this.data];
        }
    }
}