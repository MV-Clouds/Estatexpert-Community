public without sharing class ESX_PropertyDataTableController {
    public ESX_PropertyDataTableController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Property__c> getListingData(Integer listingSize){
        try {
            Set<Id> propertyIdsFromListings = new Set<Id>();
            Set<Id> propertyIdsFromMedia = new Set<Id>();
            List<Listing__c> listings = new List<Listing__c>();
            List<Property_Media__c> propertyMedia = new List<Property_Media__c>();
            Set<Id> intersectingPropertyIds = new Set<Id>();


        // Fetch listing data
        listings = [SELECT Property__c FROM Listing__c WHERE Property__c != null ORDER BY CreatedDate DESC LIMIT 50000 OFFSET : listingSize];
        
        // Collect property IDs from listings
        for (Listing__c listing : listings) {
            propertyIdsFromListings.add(listing.Property__c);
        }

        // Fetch property media data
        propertyMedia = [SELECT Property__c FROM Property_Media__c WHERE Property__c != null ORDER BY CreatedDate DESC LIMIT 50000];

        // Collect property IDs from media
        for (Property_Media__c media : propertyMedia) {
            propertyIdsFromMedia.add(media.Property__c);
        }

        // Find intersection of property IDs from both sets
        propertyIdsFromListings.retainAll(propertyIdsFromMedia);
        intersectingPropertyIds = propertyIdsFromListings;

        // Fetch property data with related listings and media
        List<Property__c> properties = [SELECT Id,Name,Price__c,
                                        (SELECT Id, Name, Property__c,Property__r.Name,property__r.Number_of_Bedrooms__c,property__r.Number_of_Bathrooms__c,property__r.Carpet_Area__c,property__r.carpetAreaUnit__c,property__r.Indoor_Facilities__c,property__r.Outdoor_Facilities__c,property__r.Amenities__c, Listing_Type__c, Listing_Status__c, Listing_Price__c, Listing_Description__c, Listing_Date__c FROM Listings__r ORDER BY CreatedDate DESC LIMIT 1),
                                        (SELECT Id, ExternalLink__c, Property__c FROM Property_Medias__r ORDER BY CreatedDate DESC LIMIT 1) FROM Property__c WHERE Id IN :intersectingPropertyIds ORDER BY CreatedDate DESC LIMIT 50000];

        System.debug('properties--->' + properties);

        return properties;
            
        } catch (Exception e) {
           System.debug('error--->'+ e.getMessage() + ' '  + e.getLineNumber());
           return null;
        }
    }


    // public class propertyDetail {
    //     @AuraEnabled
    //     public Integer index {get; set;}
    //     @AuraEnabled
    //     public string name {get; set;}
    //     @AuraEnabled
    //     public Id contactId {get; set;}
    //     @AuraEnabled
    //     public String error {get; set;}
    // }
}