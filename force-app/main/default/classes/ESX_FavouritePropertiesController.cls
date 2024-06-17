public with sharing class ESX_FavouritePropertiesController {

    @AuraEnabled(cacheable=true)
    public static List<PropertyWrapper> getFavoritePorperty(){
        // Fetch Linked Listing records with their associated Listing information
        List<Linked_Listing__c> linkedListings = new List<Linked_Listing__c>();
        linkedListings = [SELECT Id, Listing__c FROM Linked_Listing__c WHERE Contact__c = '003dL000001BHZdQAO'];

        // Collect Listing Ids
        Set<Id> listingIds = new Set<Id>();

        for (Linked_Listing__c linkedListing : linkedListings) {
            listingIds.add(linkedListing.Listing__c);
        }
        // Fetch Listing records with their associated Property Ids
        List<Listing__c> listedProperties = new List<Listing__c>();
        listedProperties = [SELECT Id, Property__c, Listing_Price__c, Listing_Status__c FROM Listing__c WHERE Id IN : listingIds];

        // Collect Property Ids
        Set<Id> propertyIds = new Set<Id>();
        for (Listing__c listedProperty : listedProperties) {
            propertyIds.add(listedProperty.Property__c);
        }

        // Fetch Property records using the collected Property Ids
        List<Property__c> properties = new List<Property__c>();
        properties = [SELECT Name,Number_of_Bedrooms__c, Number_of_Bathrooms__c, Total_Carpet_Area__c, Floor_No__c FROM Property__c WHERE Id IN : propertyIds];

        Map<Id, Property__c> propertyMap = new Map<Id, Property__c>(properties);

        Map<Id, List<String>> propertyExternalLinksMap = new Map<Id, List<String>>();
        List<Property_Media__c> mediaRecords = new List<Property_Media__c>();
        mediaRecords = [SELECT Property__c, ExternalLink__c FROM Property_Media__c WHERE Property__c IN :propertyIds];
        for (Property_Media__c  mediaRecord : mediaRecords){
            if (!propertyExternalLinksMap.containsKey(mediaRecord.Property__c)) {
                propertyExternalLinksMap.put(mediaRecord.Property__c, new List<String>());
            }
            propertyExternalLinksMap.get(mediaRecord.Property__c).add(mediaRecord.ExternalLink__c);
        }
       
        List<PropertyWrapper> propertyList = new List<PropertyWrapper>();

        for (Listing__c listing : listedProperties) {
            Property__c property = propertyMap.get(listing.Property__c);
            if (property != null) {
                PropertyWrapper pw = new PropertyWrapper();
                pw.property = property;
                pw.mediaLinks = propertyExternalLinksMap.containsKey(property.Id) ? propertyExternalLinksMap.get(property.Id) : new List<String>();
                pw.listingPrice = listing.Listing_Price__c;
                pw.listingStatus = listing.Listing_Status__c;

                for (Linked_Listing__c linkedListing : linkedListings) {
                    if (linkedListing.Listing__c == listing.Id) {
                        pw.linkedListingId = linkedListing.Id;
                        break;
                    }
                }
              // Add to the property list
              propertyList.add(pw);
            }
            
        }
        System.debug(propertyList);
        return propertyList;
}

    // @AuraEnabled(cacheable=true)
    // public static List<String> getExternalLinks(Id propertyId) {
    //     List<String> externalLinks = new List<String>();
    //     List<Property_Media__c> mediaRecords = [SELECT ExternalLink__c FROM Property_Media__c WHERE Property__c = :propertyId limit 1];
    //     for(Property_Media__c media : mediaRecords) {
    //         externalLinks.add(media.ExternalLink__c);
    //     }
    //     return externalLinks;   
    // }

    public class PropertyWrapper {
        @AuraEnabled
        public Property__c property { get; set; }
        
        @AuraEnabled
        public List<String> mediaLinks { get; set; }
        
        @AuraEnabled
        public Decimal listingPrice { get; set; }
        
        @AuraEnabled
        public String listingStatus { get; set; }

        @AuraEnabled
        public Id linkedListingId { get; set; } 
    }
}