import { LightningElement,track,wire } from 'lwc';
import backgroundImage from "@salesforce/resourceUrl/FavoriteProperties";
import getInquiryData from '@salesforce/apex/ESX_InquiryPageController.getInquiryData';
export default class Esx_InquiryPage extends LightningElement {

    BgImage = backgroundImage + '/Bg-Image.png';

    @track data = [
        { id: 1,ImageURL:'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?cs=srgb&dl=pexels-pixabay-210617.jpg&fm=jpg', propertyName: 'Property Name', buyerName: 'Evan Flores', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Open', action: 'Open',options:[
            { label: 'Open', value: 'Open' },
            { label: 'Close', value: 'Close' },
            { label: 'Pending', value: 'Pending' }
        ]  },
        { id: 2,ImageURL:'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?cs=srgb&dl=pexels-pixabay-210617.jpg&fm=jpg', propertyName: 'Property Name', buyerName: 'Arlene Wilson', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close',options:[
            { label: 'Open', value: 'Open' },
            { label: 'Close', value: 'Close' },
            { label: 'Pending', value: 'Pending' }
        ]  },
        { id: 3,ImageURL:'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?cs=srgb&dl=pexels-pixabay-210617.jpg&fm=jpg', propertyName: 'Property Name', buyerName: 'Jennie Cooper', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close',options:[
            { label: 'Open', value: 'Open' },
            { label: 'Close', value: 'Close' },
            { label: 'Pending', value: 'Pending' }
        ]  },
        { id: 4,ImageURL:'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?cs=srgb&dl=pexels-pixabay-210617.jpg&fm=jpg', propertyName: 'Property Name', buyerName: 'Philip Steward', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Pending', action: 'Pending',options:[
            { label: 'Open', value: 'Open' },
            { label: 'Close', value: 'Close' },
            { label: 'Pending', value: 'Pending' }
        ]  },
        { id: 5,ImageURL:'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?cs=srgb&dl=pexels-pixabay-210617.jpg&fm=jpg', propertyName: 'Property Name', buyerName: 'Jorge Black', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Open', action: 'Open',options:[
            { label: 'Open', value: 'Open' },
            { label: 'Close', value: 'Close' },
            { label: 'Pending', value: 'Pending' }
        ]  },
        { id: 6,ImageURL:'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?cs=srgb&dl=pexels-pixabay-210617.jpg&fm=jpg', propertyName: 'Property Name', buyerName: 'Gladys Jones', mobileNo: '0123456789', emailId: 'xyz@gmail.com', inquiryDate: 'DD/MM/YYYY', status: 'Close', action: 'Close',options:[
            { label: 'Open', value: 'Open' },
            { label: 'Close', value: 'Close' },
            { label: 'Pending', value: 'Pending' }
        ] }
    ];
    options = [
        { label: 'Open', value: 'Open' },
        { label: 'Close', value: 'Close' },
        { label: 'Pending', value: 'Pending' }
    ];

    @track propertyMediaUrls = [];
    @track Data = [];
    @track FilteredData = [];
    connectedCallback(){
        this.fetchInquryData();
    }

    fetchInquryData(){
        getInquiryData().then((result) => {
            console.log('result:', result);
            this.FilteredData = result.inquiries;
            this.Data = result.inquiries;
            this.propertyMediaUrls = result.medias;
            let number = 0;
            this.Data.forEach(row => {
                number = number + 1;
                const prop_id = row.Listing__r.Property__r.Id;
                console.log('propId:',prop_id);
                console.log('urlCheck:',this.propertyMediaUrls[prop_id][0].ExternalLink__c);
                row.ImageURL = this.propertyMediaUrls[prop_id][0].ExternalLink__c? this.propertyMediaUrls[prop_id][0].ExternalLink__c : '/sfsites/c/resource/nopropertyfound';
                row.number = number;
            });
    })
    }   









    // @track data = [];
    // @track error;
    
    // @track filteredData = this.data;
    // options = [
    //     { label: 'Open', value: 'Open' },
    //     { label: 'Close', value: 'Close' },
    //     { label: 'Pending', value: 'Pending' }
    // ];
    // columns = [
    //     { label: 'No.', fieldName: 'id', type: 'text',fixedWidth: 70, },
    //     {
    //         label: 'Property Name',
    //         // fieldName: 'propertyName',
    //         type: 'customImage',
    //         typeAttributes: {
    //             name: { fieldName: 'propertyName' },
    //             image: { fieldName: 'image' }
    //         }
    //     },
    //     // { label: 'Property Name', fieldName: 'propertyName', type: 'text' },
    //     { label: 'Buyer Name', fieldName: 'buyerName', type: 'text' },
    //     { label: 'Mobile No.', fieldName: 'mobileNo', type: 'phone' },
    //     { label: 'Email ID', fieldName: 'emailId', type: 'email' },
    //     { label: 'Inquiry Date', fieldName: 'inquiryDate', type: 'text' },
    //     // { label: 'Status', fieldName: 'status', type: 'text' },
    //     {
    //         label: 'Status',
    //         fieldName: 'status',
    //         type: 'statusDropdown',
    //         typeAttributes: {
    //             value: { fieldName: 'status' },
    //             rowId: { fieldName: 'id' },
    //             options: {fieldName: 'options'}
    //         }
    //     },

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


    // handleRowAction(event) {
    //     const actionName = event.detail.action.name;
    //     const row = event.detail.row;
    //     if (actionName === 'delete') {
    //         this.deleteRow(row);
    //     }
    // }

    // deleteRow(row) {
    //     const index = this.data.indexOf(row);
    //     if (index > -1) {
    //         this.data.splice(index, 1);
    //         this.filteredData = [...this.data];
    //     }
    // }
}