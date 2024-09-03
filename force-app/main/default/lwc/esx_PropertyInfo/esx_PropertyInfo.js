import { LightningElement, track,api } from 'lwc';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
import amenity_icons from '@salesforce/resourceUrl/amenityIcons';
import getPropertyInformation from '@salesforce/apex/ESX_PropertyDetailsController.getPropertyInformation';
export default class Esx_PropertyInfo extends LightningElement {
    @api propertyid;
    @track PhoneIcon = property_icons + '/phone.png';
    @track EmailIcon = property_icons + '/Email.png';

    @track BedroomIcon = property_icons + '/bed.png';
    @track BathroomIcon = property_icons + '/bath.png';

    @track isProperty = false;
    @track property;
    // @api propertyId;
    // propertyId = 'a02dL000000xuO1QAI';
    mapMarkers = [
        {
            location: {
                City: 'San Francisco',
                Country: 'USA',
                PostalCode: '94105',
                State: 'CA',
                Street: '50 Fremont St',
            },
        }
    ];

    selectedMarkerValue = 'SF1';
    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue;
    }

    connectedCallback() {
        this.getInfo();
    }

    getInfo() {
        getPropertyInformation({ propertyId: this.propertyid })
            .then(result => {
                this.property = result.property;
                if (this.property.Amenities__c) {
                    const amenitiesArray = this.property.Amenities__c.split(";");
                    this.property.Amenities__c = amenitiesArray.map(amenity => {
                        return {
                            name: amenity,
                        };
                    });
                } else {
                    this.property.Amenities__c = [];
                }
                this.mapMarkers[0].location.City = this.property.City__c;
                this.mapMarkers[0].location.Country = this.property.Country__c;
                this.mapMarkers[0].location.State = this.property.State__c;
                this.mapMarkers[0].location.Street = this.property.Street__c;
                this.mapMarkers[0].location.PostalCode = this.property.Postal_Code__c;
                this.isProperty = true;
            })
            .catch(error => {
                console.error(error);
            });
    }
}