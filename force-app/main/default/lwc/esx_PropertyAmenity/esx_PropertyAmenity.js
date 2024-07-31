import { LightningElement,api } from 'lwc';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';
export default class Esx_PropertyAmenity extends LightningElement {
    @api amenityName;
    @api iconUrl;
}