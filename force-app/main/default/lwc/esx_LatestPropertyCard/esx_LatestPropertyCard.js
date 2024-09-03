import { LightningElement, api } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";
import isLoggedInUserDataCorrect from '@salesforce/apex/ESX_UserUtil.isLoggedInUserDataCorrect';
import { NavigationMixin } from 'lightning/navigation';

import ImageNotFound from '@salesforce/resourceUrl/ImageNotFound';

export default class Esx_LatestPropertyCard extends NavigationMixin(LightningElement) {
    @api property;

    addressIcon = ListedProperties + '/ForLocation-icon.png';
    bedroomIcon = ListedProperties + '/Bedroom-icon.png';
    bathroomIcon = ListedProperties + '/Bathroom-icon.png';
    areaIcon = ListedProperties + '/ForArea-icon.png';
    favouriteIcon = ListedProperties + '/Favourite-icon.png';
    featuredIcon = ListedProperties + '/Featured-icon.png';
    forSellIcon = ListedProperties + '/ForSell-icon.png';
    forRentIcon = ListedProperties + '/ForRent-icon.png';
    mobileAddressIcon = ListedProperties + '/mapicon_mobile.png';

    imageNot = ImageNotFound;

    connectedCallback() {
        console.log('properties stringfy=> ', JSON.stringify(this.property));
    }

    get formattedAddress() {
        const { landmark, city } = this.property || {};

        if (!landmark && !city) {
            return '';
        }

        if (landmark && !city) {
            return landmark;
        }

        if (!landmark && city) {
            return city;
        }

        return `${landmark}, ${city}`;
    }

    handleNavigate(page) {
        let pageApi = page;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageApi
            },
        });
    }

    checkUserIsLoggedIn() {
        try {
            let loggedUserInfo = localStorage.getItem('loggedUserInfo');
            console.log('User info:', loggedUserInfo);
            if (loggedUserInfo) {
                let loggedUserInfoObj = JSON.parse(loggedUserInfo);
                console.log('loggeduserInfo:', loggedUserInfoObj);
                isLoggedInUserDataCorrect({ contactId: loggedUserInfoObj.contactId, siteUserId: loggedUserInfoObj.siteUserId })
                    .then(result => {
                        console.log('isLoggedInUserDataCorrect ** => ', result);
                        if (result) {
                            console.log('Add to favourite called');
                        }else{
                            this.handleNavigate('Login');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                this.handleNavigate('Login');
            }
        } catch (error) {
            console.error(error);
        }
    }

    addToFavourite(){
        this.checkUserIsLoggedIn();
        // Call Apex method to add property to favourites
    }

    // redirectToPropertyDetail(){
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://mvclouds9-dev-ed.develop.my.site.com/z-test-3'
    //         }
    //     });
    //     // this.handleNavigate('z_Test_3');
    // }

    handlePropertyDetail(event){
        try {
            let propertyId = event.currentTarget.dataset.key;
            console.log('propertyId-->', propertyId);
            if (propertyId){
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Property_Details__c'
                    },
                    state: {
                        id: propertyId
                    }
                });
            }
        } catch (error) {
            console.error(error.stack);
        }
    }

    handleErrro(event) {
        console.log("Error Image is Called!!:::::::::::::::::::::::::::::");
        event.target.src = this.imageNot;
        event.target.onerror = null;
    }

}