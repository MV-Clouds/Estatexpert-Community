import { LightningElement, track } from 'lwc';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
import amenity_icons from '@salesforce/resourceUrl/amenityIcons';
import SVG_LOGO from "@salesforce/resourceUrl/testSvg";
import getPropertyInformation from '@salesforce/apex/ESX_PropertyDetailsController.getPropertyInformation';
export default class Esx_PropertyInfo extends LightningElement {

    @track PhoneIcon = property_icons + '/phone.png';
    @track EmailIcon = property_icons + '/Email.png';

    @track BedroomIcon = property_icons + '/bed.png';
    @track BathroomIcon = property_icons + '/bath.png';

    @track CarParkingIcon = property_icons + '/bus.png';
    // @track SwimmingIcon = property_icons + '/swim.png';
    // @track GymIcon = property_icons + '/gym.png';
    // @track RestaurantIcon = property_icons + '/restaurant.png';
    // @track WifiIcon = property_icons + '/wifi.png';
    // @track PetCenterIcon = property_icons + '/pet.png';
    // @track SportsIcon = property_icons + '/sports.png';
    // @track LaundryIcon = property_icons + '/laundry.png';
    // @track ParkIcon = property_icons + '/park.png';
    // @track BicycleIcon = property_icons + '/bicycle.png';
    // @track EmergencyIcon = property_icons + '/phone.png';
    // @track HockeyIcon = property_icons + '/golf.png';
    // @track LibraryIcon = property_icons + '/library.png';
    // @track BabyParkIcon = property_icons + '/babypark.png';

    @track isProperty = false;
    @track property;
    propertyId = 'a02dL000000xuO1QAI';
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
    // baseUrl = amenity_icons;
    sampleUrl = amenity_icons +'/Security.svg';
    svgURL = `${this.sampleUrl}#amenity`;
    // generateIconUrl(amenity) {
    // const iconName = amenity.toLowerCase().replace(/[\s\/]+/g, '_') + '.png';
    // console.log('fileName:==', iconName);
    //     return `${amenity_icons}/${amenity}.svg`;
    // }

    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.target.selectedMarkerValue;
    }
    connectedCallback() {
        this.getInfo();
    }

    getInfo() {
        getPropertyInformation({ propertyId: this.propertyId })
            .then(result => {
                this.property = result.property;
                if (this.property.Amenities__c) {
                    const amenitiesArray = this.property.Amenities__c.split(";");
                    this.property.Amenities__c = amenitiesArray.map(amenity => {
                        return {
                            name: amenity,
                            icon: `${amenity_icons}/${amenity}.svg` || this.CarParkingIcon
                        };
                    });
                    console.log('row.Amenities__c', this.property.Amenities__c);
                    console.log("svgURL=====>",this.svgURL);
                } else {
                    this.property.Amenities__c = [];
                }
                console.log('amenitycheck-=====>', this.property);
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