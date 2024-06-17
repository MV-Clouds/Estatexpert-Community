import { LightningElement } from 'lwc';
import PropertiesStatus from '@salesforce/apex/ESX_LatestPropertyController.getPropertiesByStatus';
import { NavigationMixin } from 'lightning/navigation';

export default class Esx_LatestProperty extends NavigationMixin(LightningElement) {
    properties;
    status = 'both';

    connectedCallback() {
        console.log('OUTPUT : ', this.status);
        PropertiesStatus({ status: this.status })
            .then(data => {
                this.properties = data.map(prop => {
                    return {
                        id: prop.property.Id,
                        name: prop.property.Name,
                        bedrooms: prop.property.Number_of_Bedrooms__c,
                        bathrooms: prop.property.Number_of_Bathrooms__c,
                        landmark: prop.property.Landmark__c,
                        city: prop.property.City__c,
                        price: prop.property.Price__c,
                        area: prop.property.Total_Covered_Area__c,
                        status: prop.property.Property_Status__c,
                        mediaLinks: prop.mediaLinks,
                        isForSale: prop.property.Property_Status__c == 'For Sell' ? true : false,
                        isForRent: prop.property.Property_Status__c == 'For Rent' ? true : false
                    };
                });
            })
            .catch(error => {
                console.error(`Error loading ${this.status} properties:`, error);
            });
    }

    // Handle button click to filter properties by status
    handleStatusClick(event) {
        const buttons = this.template.querySelectorAll('.button');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');
        this.status = event.target.textContent.toLowerCase();
        console.log(this.status);
        this.loadFilteredProperties();
    }

    navigateToPage(url) {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: url
            }
        });
    }

    handlePropertyClick(event) {
        event.preventDefault();
        this.navigateToPage('https://mvclouds9-dev-ed.develop.my.site.com/property');
    }

    // Load filtered properties by status
    loadFilteredProperties() {
        PropertiesStatus({ status: this.status })
            .then(data => {
                this.properties = data.map(prop => {
                    return {
                        id: prop.property.Id,
                        name: prop.property.Name,
                        bedrooms: prop.property.Number_of_Bedrooms__c,
                        bathrooms: prop.property.Number_of_Bathrooms__c,
                        landmark: prop.property.Landmark__c,
                        city: prop.property.City__c,
                        price: prop.property.Price__c,
                        area: prop.property.Total_Covered_Area__c,
                        status: prop.property.Property_Status__c,
                        mediaLinks: prop.mediaLinks,
                        isForSale: prop.property.Property_Status__c == 'For Sell' ? true : false,
                        isForRent: prop.property.Property_Status__c == 'For Rent' ? true : false
                    };
                });
            })
            .catch(error => {
                console.error(`Error loading ${this.status} properties:`, error);
            });
    }
}