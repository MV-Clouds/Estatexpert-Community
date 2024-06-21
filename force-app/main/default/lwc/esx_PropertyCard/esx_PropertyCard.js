import { LightningElement,api, track } from 'lwc';
import ListedProperties from "@salesforce/resourceUrl/ListedProperties";

export default class Esx_PropertyCard extends LightningElement {
    @api propertydata;
    @api viewtype;

    bedroomIcon = ListedProperties + '/Vector.png';
    bedroomIconWhite = ListedProperties + '/fluent_bed-24-filled_white.png';
    bathroomIcon = ListedProperties + '/fa-solid_bath.png';
    bathroomIconWhite = ListedProperties + '/fa-solid_bath_white.png';
    areaIcon = ListedProperties + '/areaicon.png';
    areaIconWhite = ListedProperties + '/areawhite.png';
    Rectangle = ListedProperties + '/Rectangle.png';


    // list view
    active_list = ListedProperties + '/active_list.png';
    area_list = ListedProperties + '/area_list.png';
    bathroom_list = ListedProperties + '/bathroom_list.png';
    bedroom_list = ListedProperties + '/bedroom_list.png';
    safety_list = ListedProperties + '/safety_list.png';
    carpet_list = ListedProperties + '/carpet_list.png';
    bathrooms_list = ListedProperties + '/bathrooms_list.png';
    bedrooms_list = ListedProperties + '/bedrooms_list.png';


    // mobile icons
    mapicon_mobile = ListedProperties + '/mapicon_mobile.png';
    cook_mobile = ListedProperties + '/cook_mobile.png';
    bedroom_mobile = ListedProperties + '/bedroom_mobile.png';
    bathroom_mobile = ListedProperties + '/bathroom_mobile.png';
    aresqft_mobile = ListedProperties + '/aresqft_mobile.png';

    
    

}