import { LightningElement, wire, track } from 'lwc';
import getFavoritePorperty from '@salesforce/apex/ESX_FavouritePropertiesController.getFavoritePorperty';
import FavoriteProperties from "@salesforce/resourceUrl/FavoriteProperties";
import isLoggedInUserDataCorrect from '@salesforce/apex/ESX_UserUtil.isLoggedInUserDataCorrect';
import { esxRemoveLoginSession } from "c/esx_UserModule";

export default class Esx_FavouriteProperties extends LightningElement {
    @track favProperties;
    @track bgImage = FavoriteProperties + '/Bg-Image.png';
    @track contactId = '';
    @track isDataAvailable = true;

    // LWC lifecycle event.
    connectedCallback(){
        this.checkUserIsLoggedIn();
    }

    // Checking user logged in or not and loading data after that
    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
            if (loggedUserInfo) {
                let loggedUserInfoObj = JSON.parse(loggedUserInfo);
                isLoggedInUserDataCorrect({contactId: loggedUserInfoObj.contactId, siteUserId: loggedUserInfoObj.siteUserId})
                    .then(result => {
                        console.log('isLoggedInUserDataCorrect ** => ', result);
                        if (result) {
                            this.contactId = loggedUserInfoObj.contactId;
                            this.getFavouritesPropertiesData(this.contactId);
                        } else {
                            esxRemoveLoginSession();
                            this.customNavigation('Login');
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                this.customNavigation('Login');
            }
        } catch (error) {
            console.error(error.stack);
        }
    }

    // To get data of favioreted properties data
    getFavouritesPropertiesData(contactId) {
        try {
            getFavoritePorperty({contactId: contactId})
                .then(result => {
                    console.log('result => ', result);
                    if (result) {
                        if (result.length > 0) {
                            this.favProperties = result.map(prop => {
                                return {
                                    Id : prop.linkedListingId,
                                    name: prop.property.Name,
                                    bedrooms: prop.property.Number_of_Bedrooms__c,
                                    bathrooms: prop.property.Number_of_Bathrooms__c,
                                    floor: prop.property.Floor_No__c,
                                    area: prop.property.Total_Carpet_Area__c,
                                    price: prop.listingPrice,
                                    status:prop.listingStatus,
                                    mediaLinks: prop.mediaLinks
                                };
                            });
                        } else {
                            // Code for the empty state.
                            this.isDataAvailable = false;
                        }
                    } else {
                        console.log('In the else');
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error.stack);
        }
    }

    // Navigate to community page using page API name
    customNavigation(pageAPIName) {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageAPIName
            },
        });
    }

    // Handles a custom event that fired from the property catd component and refresh the data
    refreshView(event) {
        try {
            console.log('Custom event fired refresh view');
            this.favProperties = [];
            this.getFavouritesPropertiesData(this.contactId);
        } catch (error) {
            console.error(error.stack);
        }
    }
}