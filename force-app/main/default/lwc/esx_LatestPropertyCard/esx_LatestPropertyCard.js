import { LightningElement, api } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";

export default class Esx_LatestPropertyCard extends LightningElement {
    @api properties;
    @api status;

    AddressIcon = ListedProperties + '/ForLocation-icon.png';
    BedroomIcon = ListedProperties + '/Bedroom-icon.png';
    BathroomIcon = ListedProperties + '/Bathroom-icon.png';
    AreaIcon = ListedProperties + '/ForArea-icon.png';
    FavouriteIcon = ListedProperties + '/Favourite-icon.png';
    FeaturedIcon = ListedProperties + '/Featured-icon.png';
    ForSellIcon = ListedProperties + '/ForSell-icon.png';
    ForRentIcon = ListedProperties + '/ForRent-icon.png';
    
    get isRent() {
        return this.status === 'rent';
    }

    get isSell() {
        return this.status === 'sell';
    }

    get isRentAndSell() {
        return this.status === 'both';
    }

    get propertyRentStatus() {
        const a =  this.properties.map(prop => prop.status === 'rent');
        return a;

    }

    get propertySellStatus() {
        const b = this.properties.map(prop => prop.status === 'sell');
        return b;
    }

    get allPropertyStatus() {
        const c = this.properties.map(prop => prop.status);
        console.log(c);
        return c;
    }

    connectedCallback() {
        console.log('properties => ', this.properties);
    }

    renderedCallback(){
        console.log('properties stringfy=> ', JSON.stringify(this.properties));
    }

}