import { LightningElement, wire } from 'lwc';
import getFavoritePorperty from '@salesforce/apex/ESX_FavouritePropertiesController.getFavoritePorperty';
import FavoriteProperties from "@salesforce/resourceUrl/FavoriteProperties";

export default class Esx_FavouriteProperties extends LightningElement {
    FavProperties;

    BgImage = FavoriteProperties + '/Bg-Image.png';

    @wire(getFavoritePorperty)
    wiredProperties({ error, data }) {
        if (data) {
            this.FavProperties = data.map(prop => {
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
            console.log(JSON.stringify(this.FavProperties));
        } else if (error) {
            console.log(error);
        }
    }


}