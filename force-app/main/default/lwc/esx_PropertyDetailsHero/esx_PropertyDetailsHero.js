import { LightningElement,track } from 'lwc';
import samplePropertyImage from'@salesforce/resourceUrl/samplePropertyImage';
import property_icons from '@salesforce/resourceUrl/propertyViewIcons';

export default class Esx_PropertyDetailsHero extends LightningElement {

    samplePropertyImage = samplePropertyImage;
    @track bedroomIcon = property_icons +'/bed.png';
    @track bathroomIcon = property_icons +'/bath.png';
    @track balconyIcon = property_icons +'/balcony.png';
    @track furnishedIcon = property_icons +'/furnished.png';
}