import { LightningElement, track, wire } from 'lwc';
import backgroundImage from "@salesforce/resourceUrl/FavoriteProperties";
import { loadStyle } from 'lightning/platformResourceLoader';
import getInquiryData from '@salesforce/apex/ESX_InquiryPageController.getInquiryData';
import DeleteInquiry from '@salesforce/apex/ESX_InquiryPageController.DeleteInquiry';
import customStyles from '@salesforce/resourceUrl/InquiryPageCss';
import Blank_Profile_Photo from '@salesforce/resourceUrl/Blank_Profile_Photo';
import updateInquiryStatus from '@salesforce/apex/ESX_InquiryPageController.updateInquiryStatus';
export default class Esx_InquiryPage extends LightningElement {

    BgImage = backgroundImage + '/Bg-Image.png';

    options = [
        { label: '--Select--', value: '' },
        { label: 'Open', value: 'Open' },
        { label: 'Close', value: 'Close' },
        { label: 'Pending', value: 'Pending' }
    ];

    @track propType = 'All';
    @track propertyMediaUrls = [];
    @track profilepicUrls = [];
    @track Data = [];
    @track FilteredData = [];
    @track allBtnVarient = 'brand';
    @track buyBtnVarient = 'brand-outline';
    @track rentBtnVarient = 'brand-outline';
    @track isData = false;
    @track contactId = '';
    @track profileImgUrl;
    @track showSpinner = false;
    @track selectedStatusMap = new Map();

    connectedCallback() {
        this.checkUserIsLoggedIn();
    }

    renderedCallback() {
        loadStyle(this, customStyles)
            .then(() => {
                console.log('Custom styles loaded successfully.');
            })
            .catch(error => {
                console.error('Error loading custom styles:', error);
            });
    }

    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
            if (loggedUserInfo) {
                let loggedUserInfoObj = JSON.parse(loggedUserInfo);
                console.log('contactId:', loggedUserInfoObj.contactId);
                this.contactId = loggedUserInfoObj.contactId;
                console.log('contactIdFinal:', this.contactId);
                if (this.contactId !== null && this.contactId !== undefined && this.contactId !== '') {
                    console.log('contact id geted');
                    this.fetchInquryData();
                }
                // isLoggedInUserDataCorrect({contactId: loggedUserInfoObj.contactId, siteUserId: loggedUserInfoObj.siteUserId})
                //     .then(result => {
                //         console.log('isLoggedInUserDataCorrect ** => ', result);
                //         if (result) {
                //             console.log('here=====');
                //             this.contactId = loggedUserInfoObj.contactId;
                //             console.log('contactId:',this.contactId);
                //             // Call method if user is logged in
                //             if(this.contactId !== null && this.contactId !== undefined && this.contactId !== ''){
                //                 console.log('contact id geted');
                //                 this.fetchInquryData();
                //             }
                //         }
                //     })
                //     .catch(error => {
                //         console.log('incatch');
                //         console.log(error);
                //     });

            }
        } catch (error) {
            console.error({ error });
        }
    }

    fetchInquryData() {
        try {
            getInquiryData({ contactId: this.contactId }).then((result) => {
                try {
                    console.log('inquiryResult', result);
                    if (result.inquiries.length >= 0) {
                        this.isData = true;
                        this.FilteredData = result.inquiries;
                        this.Data = result.inquiries;
                        this.profilepicUrls = result.contactContentVersions;
                        console.log('profilemap:', this.profilepicUrls);
                        this.propertyMediaUrls = result.medias;
                        // if ((result != null && result != undefined) && (result.image != null && result.image != undefined)) {
                        //     this.profileImgUrl = 'data:image/jpeg;base64,' + result.image;
                        // } else {
                        //     this.profileImgUrl = Blank_Profile_Photo;
                        // }
                        // let number = 0;
                        const formatDate = (dateStr) => {
                            let date;
                            const parts = dateStr.split(/[-\/]/);
                            if (parts.length === 3) {
                                if (parts[0].length === 4) {
                                    date = new Date(parts[0], parts[1] - 1, parts[2]);
                                } else if (parts[2].length === 4) {
                                    date = new Date(parts[2], parts[1] - 1, parts[0]);
                                } else {
                                    const year = parseInt(parts[2]) > 50 ? '19' + parts[2] : '20' + parts[2];
                                    date = new Date(year, parts[1] - 1, parts[0]);
                                }
                            } else {
                                date = new Date(dateStr);
                            }
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        };
                        this.Data.forEach((row, index) => {
                            const prop_id = row.Listing__r.Property__r.Id;
                            const conId = row.Contact__r.Id;
                            row.ImageURL = this.propertyMediaUrls[prop_id][0].ExternalLink__c ? this.propertyMediaUrls[prop_id][0].ExternalLink__c : '/sfsites/c/resource/nopropertyfound';
                            row.Inquiry_Date__c = row.Inquiry_Date__c ? formatDate(row.Inquiry_Date__c) : '';
                            if (this.profilepicUrls) {
                                row.profileUrl = this.profilepicUrls[conId] ? row.profileUrl = 'data:image/jpeg;base64,' + this.profilepicUrls[conId] : Blank_Profile_Photo;
                            } else {
                                row.profileUrl = Blank_Profile_Photo;
                            }
                            row.number = index + 1;
                        });
                        this.FilteredData.forEach((row, index) => {
                            const prop_id = row.Listing__r.Property__r.Id;
                            const conId = row.Contact__r.Id;
                            row.ImageURL = this.propertyMediaUrls[prop_id][0].ExternalLink__c ? this.propertyMediaUrls[prop_id][0].ExternalLink__c : '/sfsites/c/resource/nopropertyfound';
                            row.Inquiry_Date__c = row.Inquiry_Date__c ? formatDate(row.Inquiry_Date__c) : '';
                            if (this.profilepicUrls) {
                                row.profileUrl = this.profilepicUrls[conId] ? row.profileUrl = 'data:image/jpeg;base64,' + this.profilepicUrls[conId] : Blank_Profile_Photo;
                            } else {
                                row.profileUrl = Blank_Profile_Photo;
                            }
                            row.number = index + 1;
                        });
                    } else {
                        this.isData = false;
                    }
                } catch (innerError) {
                    console.error('Error processing result:', innerError);
                }
            }).catch((fetchError) => {
                console.error('Error fetching inquiry data:', fetchError);
            });
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    }



    delete_row(event) {
        console.log('recordIdtoDelete:', event.currentTarget.dataset.key);
        let inquiryId = event.currentTarget.dataset.key;
        DeleteInquiry({ inquiryId: inquiryId }).then((result) => {
            if (result) {
                this.fetchInquryData();
            }
        })
    }

    handleStatusChange(event) {
        const recordId = event.currentTarget.dataset.key;
        const selectedValue = event.target.value;
        this.selectedStatusMap.set(recordId, selectedValue);
        this.updateSaveButtonState(recordId, selectedValue);
    }

    updateSaveButtonState(recordId, selectedValue) {
        const allSaveButtons = this.template.querySelectorAll('.save-button');
        allSaveButtons.forEach((button) => {
            if (button.dataset.key === recordId) {
                button.dataset.status = selectedValue;
                button.disabled = selectedValue ? false : true; // Enable if selectedValue is not empty
            }
        });
    }

    saveUpdatedStatus(event) {
        let status = event.currentTarget.dataset.status;
        let recordId = event.currentTarget.dataset.key;
        console.log('recordIdtoUpdate:', recordId);
        console.log('statusToUpdate:', status);
        updateInquiryStatus({ Status: status, recordId: recordId }).then((result) => {
            if (result) {
                this.fetchInquryData();
                this.updateSaveButtonAfterSave(recordId);
            }
        })
    }

    updateSaveButtonAfterSave(recordId) {
        // Query all save buttons
        const allSaveButtons = this.template.querySelectorAll('.save-button');
        allSaveButtons.forEach((button) => {
            if (button.dataset.key === recordId) {
                button.disabled = true; // Disable the button after save action
            }
        });
    }

    handleFilter(event) {
        if (event.target.label === 'Buy') {
            this.propType = 'For Sell';
            this.buyBtnVarient = 'brand';
            this.allBtnVarient = 'brand-outline';
            this.rentBtnVarient = 'brand-outline';
            this.applyFilter();
        }
        if (event.target.label === 'Rent') {
            this.propType = 'For Rent';
            this.buyBtnVarient = 'brand-outline';
            this.allBtnVarient = 'brand-outline';
            this.rentBtnVarient = 'brand';
            this.applyFilter();
        }
        if (event.target.label === 'All') {
            this.propType = '';
            this.buyBtnVarient = 'brand-outline';
            this.allBtnVarient = 'brand';
            this.rentBtnVarient = 'brand-outline';
            this.applyFilter();
            // this.FilteredData = this.Data;
            // if(this.FilteredData.length > 0){
            //     this.isData = true;
            // }
        }
    }

    applyFilter() {
        this.FilteredData = this.Data.filter(row => {
            const isPropertyType = this.propType ? row.Listing__r.Property__r.Property_Status__c == this.propType : true;
            return isPropertyType;
        });
        if (this.FilteredData.length > 0) {
            this.isData = true;
            // let num = 0;
            this.FilteredData.forEach((row, index) => {
                // num = num + 1;
                row.number = index + 1;
            });
        } else {
            this.isData = false;
        }
    }

}