public without sharing class ESX_PropertyDataTableController {
    public ESX_PropertyDataTableController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Property__c> getListingData(Integer listingSize){
        try {
            List<Property__c> propertyData = new List<Property__c>();
            Map<Id,Id> propertyId = new Map<Id,Id>();
            List<Listing__c> listingData = new List<Listing__c>();
            List<Property_Media__c> propertyMediaData = new List<Property_Media__c>();

            // listingData = [SELECT Id, Name,Property__c,Listing_Type__c,Listing_Status__c, Listing_Price__c,Listing_Description__c,Listing_Date__c FROM     ORDER BY CreatedDate DESC LIMIT 50000 OFFSET : listingSize];

            // for (Listing__c lis : listingData) {
            //     propertyId.put(lis.Id,lis.Property__c);
            // }

            // propertyMediaData = [SELECT Id,ExternalLink__c,Property__c FROM Property_Media__c WHERE Property__c IN : propertyId.values()];   



            propertyData = [SELECT ID,(SELECT ID, Name,Property__c,Listing_Type__c,Listing_Status__c, Listing_Price__c,Listing_Description__c,Listing_Date__c FROM  Listings__r ORDER BY CreatedDate DESC LIMIT 1),
                                    (SELECT Id,ExternalLink__c,Property__c FROM Property_Medias__r ORDER BY CreatedDate DESC LIMIT 1) FROM Property__c ORDER BY CreatedDate DESC LIMIT 50000 ];

                                    System.debug('propertyData--->'+propertyData);


            return propertyData;
            
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