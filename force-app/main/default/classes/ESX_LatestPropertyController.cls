public with sharing class ESX_LatestPropertyController {
    @AuraEnabled
    public static List<PropertyWrapper> getPropertiesByStatus(String status) {
        List<Listing__c> listedProperties = new List<Listing__c>();
        listedProperties = [SELECT Id, Property__c FROM Listing__c];

        // Collect Property Ids
        Set<Id> propertyIds = new Set<Id>();
        for (Listing__c listedProperty : listedProperties) {
            propertyIds.add(listedProperty.Property__c);
        }

        String query = 'SELECT Id, Name, Number_of_Bedrooms__c, Number_of_Bathrooms__c, Landmark__c, City__c, Price__c, Total_Covered_Area__c, Property_Status__c FROM Property__c WHERE Id IN : propertyIds';
        
        if (status == 'sell') {
            query += ' AND Property_Status__c = \'For Sell\'';
        } else if (status == 'rent') {
            query += ' AND Property_Status__c = \'For Rent\'';
        } else if(status == 'both'){
            query += ' AND (Property_Status__c = \'For Sell\' OR Property_Status__c = \'For Rent\')';
        }

        query += 'LIMIT 5';
        
        List<Property__c> properties = Database.query(query);

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

        for(Property__c prop : properties) {
            PropertyWrapper pw = new PropertyWrapper();
            pw.property = prop;
            pw.mediaLinks = propertyExternalLinksMap.containsKey(prop.Id) ? propertyExternalLinksMap.get(prop.Id) : new List<String>();
            propertyList.add(pw);
        }
        System.debug(propertyList); 
        return propertyList;
    }

    public class PropertyWrapper {
        @AuraEnabled
        public Property__c property { get; set; }
        
        @AuraEnabled
        public List<String> mediaLinks { get; set; }
    }
}