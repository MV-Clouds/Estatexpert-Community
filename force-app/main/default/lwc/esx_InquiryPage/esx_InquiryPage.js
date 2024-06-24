import { LightningElement,track } from 'lwc';

export default class Esx_InquiryPage extends LightningElement {

    @track data = [
        { id: 1, propertyName: 'Property Name', buyerName: 'Evan Flores', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Open', action: 'Open' },
        { id: 2, propertyName: 'Property Name', buyerName: 'Arlene Wilson', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close' },
        { id: 3, propertyName: 'Property Name', buyerName: 'Jennie Cooper', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close' },
        { id: 4, propertyName: 'Property Name', buyerName: 'Philip Steward', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Pending', action: 'Pending' },
        { id: 5, propertyName: 'Property Name', buyerName: 'Jorge Black', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Open', action: 'Open' },
        { id: 6, propertyName: 'Property Name', buyerName: 'Gladys Jones', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close' }
    ];

    @track filteredData = this.data;

    columns = [
        { label: 'No.', fieldName: 'id', type: 'text',fixedWidth: 70, },
        { label: 'Property Name', fieldName: 'propertyName', type: 'text' },
        { label: 'Buyer Name', fieldName: 'buyerName', type: 'text' },
        { label: 'Mobile No.', fieldName: 'mobileNo', type: 'phone' },
        { label: 'Email ID', fieldName: 'emailId', type: 'email' },
        { label: 'Inquiry Date', fieldName: 'inquiryDate', type: 'text' },
        { label: 'Status', fieldName: 'status', type: 'text' },
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
}