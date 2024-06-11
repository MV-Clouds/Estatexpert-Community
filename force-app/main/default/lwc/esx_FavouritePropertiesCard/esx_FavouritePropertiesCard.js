import { LightningElement, api } from 'lwc';
import FavoriteProperties from "@salesforce/resourceUrl/FavoriteProperties";
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Esx_FavouritePropertiesCard extends LightningElement {
    @api property;

    bedroomIcon = FavoriteProperties + '/Bed-icon.png';
    bathroomIcon = FavoriteProperties + '/Bath-icon.png';
    areaIcon = FavoriteProperties + '/Area-icon.png';
    favouriteIcon = FavoriteProperties + '/Like-icon.png';
    safetyRank1Icon = FavoriteProperties + '/SafetyRank1-icon.png';

    handleDelete() {
        // Confirm the deletion
        // if (confirm('Are you sure you want to remove this from your favorites?')) {
        // Delete the record
        deleteRecord(this.property.Id)
            .then(() => {
                // Show a success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Property removed from favorites.',
                        variant: 'success',
                    })
                );
                // Reload the page after a successful deletion
                location.reload();
            })
            .catch(error => {
                // Show an error message if deletion fails
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
        // }
    }
}