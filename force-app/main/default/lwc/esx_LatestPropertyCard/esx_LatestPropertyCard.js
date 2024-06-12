import { LightningElement, api } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";

export default class Esx_LatestPropertyCard extends LightningElement {
    @api property;

    addressIcon = ListedProperties + '/ForLocation-icon.png';
    bedroomIcon = ListedProperties + '/Bedroom-icon.png';
    bathroomIcon = ListedProperties + '/Bathroom-icon.png';
    areaIcon = ListedProperties + '/ForArea-icon.png';
    favouriteIcon = ListedProperties + '/Favourite-icon.png';
    featuredIcon = ListedProperties + '/Featured-icon.png';
    forSellIcon = ListedProperties + '/ForSell-icon.png';
    forRentIcon = ListedProperties + '/ForRent-icon.png';

    connectedCallback() {
        console.log('properties stringfy=> ', JSON.stringify(this.property));
    }

}