import { LightningElement, api } from 'lwc';
import FavoriteProperties from "@salesforce/resourceUrl/FavoriteProperties";
// import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import deleteFavProperty from '@salesforce/apex/ESX_FavouritePropertiesController.deleteFavProperty';

export default class Esx_FavouritePropertiesCard extends LightningElement {
    @api property;

    bedroomIcon = FavoriteProperties + '/Bed-icon.png';
    bathroomIcon = FavoriteProperties + '/Bath-icon.png';
    areaIcon = FavoriteProperties + '/Area-icon.png';
    favouriteIcon = FavoriteProperties + '/Like-icon.png';
    safetyRank1Icon = FavoriteProperties + '/SafetyRank1-icon.png';

    // handleDelete() {
    //     // Confirm the deletion
    //     // if (confirm('Are you sure you want to remove this from your favorites?')) {
    //     // Delete the record
    //     deleteRecord(this.property.Id)
    //         .then(() => {
    //             console.log('Record ddeleted');
    //             // Show a success message
    //             // this.dispatchEvent(
    //             //     new ShowToastEvent({
    //             //         title: 'Success',
    //             //         message: 'Property removed from favorites.',
    //             //         variant: 'success',
    //             //     })
    //             // );
    //             // Reload the page after a successful deletion
    //             // location.reload();
    //             this.refreshDataOfTabel();
    //         })
    //         .catch(error => {
    //             // Show an error message if deletion fails
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Error deleting record',
    //                     message: error.body.message,
    //                     variant: 'error',
    //                 })
    //             );
    //         });
    //     // }
    // }

    handleDelete(event) {
        try {
            console.log('Event target ==> ', event.target.dataset.label);
            console.log('Event target ==> ', event.currentTarget.dataset.label);
            if (this === event.target) { 
                deleteFavProperty({ linkedListingId: this.property.Id})
                    .then(result => {
                        console.log('deleteFavPropety Jenish result =>', result);
                    })
                    .catch(error => {
                        console.log('In the error **');
                        console.error(error);
                    });
                console.log('In the If');
            } else {
                console.log('In the else');
            }
        } catch (error) {
            console.error(error.stack);
        }

    }  

    // To refresh data in the parent component
    refreshDataOfTabel(){
        try {
            console.log('refresh data table called');
            this.dispatchEvent(
                new CustomEvent("refreshdata", {
                    detail: true
                })
            );
        } catch (error) {
            console.log('In the error page');
            console.error(error.stack);
        }
    }
}