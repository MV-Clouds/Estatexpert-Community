public with sharing class ESX_LatestPropertyController {
    @AuraEnabled(cacheable=true)
    public static List<PropertyWrapper> getPropertyListing(){
        List<Property__c> properties = [SELECT Id, Name, Number_of_Bedrooms__c, Number_of_Bathrooms__c, Landmark__c, City__c, Price__c, Total_Covered_Area__c, Property_Status__c	 
                                         FROM Property__c WHERE Property_Status__c = 'For Sell' OR Property_Status__c = 'For Rent'];

        List<PropertyWrapper> propertyList = new List<PropertyWrapper>();

        for(Property__c prop : properties) {
            PropertyWrapper pw = new PropertyWrapper();
            pw.property = prop;
            pw.mediaLinks = getExternalLinks(prop.Id);
            propertyList.add(pw);
        }
        
        return propertyList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getExternalLinks(Id propertyId) {
        List<String> externalLinks = new List<String>();
        List<Property_Media__c> mediaRecords = [SELECT ExternalLink__c FROM Property_Media__c WHERE Property__c = :propertyId limit 1];
        for(Property_Media__c media : mediaRecords) {
            externalLinks.add(media.ExternalLink__c);
        }
        return externalLinks;   
    }

    public class PropertyWrapper {
        @AuraEnabled
        public Property__c property { get; set; }
        
        @AuraEnabled
        public List<String> mediaLinks { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<PropertyWrapper> getPropertiesByStatus(String status) {
        String query = 'SELECT Id, Name, Number_of_Bedrooms__c, Number_of_Bathrooms__c, Landmark__c, City__c, Price__c, Total_Covered_Area__c, Property_Status__c FROM Property__c';
        
        if (status == 'sell') {
            query += ' WHERE Property_Status__c = \'For Sell\'';
        } else if (status == 'rent') {
            query += ' WHERE Property_Status__c = \'For Rent\'';
        }
        
        List<Property__c> properties = Database.query(query);
        List<PropertyWrapper> propertyList = new List<PropertyWrapper>();

        for(Property__c prop : properties) {
            PropertyWrapper pw = new PropertyWrapper();
            pw.property = prop;
            pw.mediaLinks = getExternalLinks(prop.Id);
            propertyList.add(pw);
        }
        
        return propertyList;
    }
}