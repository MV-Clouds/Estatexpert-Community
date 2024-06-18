import { LightningElement,api } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";

export default class Esx_PropertyCard extends LightningElement {
    @api propertyDetail;
    @api viewtype;

    bedroomIcon = ListedProperties + '/Vector.png';
    bedroomIconWhite = ListedProperties + '/fluent_bed-24-filled_white.png';
    bathroomIcon = ListedProperties + '/fa-solid_bath.png';
    bathroomIconWhite = ListedProperties + '/fa-solid_bath_white.png';
    areaIcon = ListedProperties + '/areaicon.png';
    areaIconWhite = ListedProperties + '/areawhite.png';
    Rectangle = ListedProperties + '/Rectangle.png';
    viewtype = false;
}