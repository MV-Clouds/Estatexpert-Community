public without sharing class ESX_PropertyDetailsController {

    @AuraEnabled
    public static PropertyWrapper getPropertyInformation(Id propertyId){
        try {
            List<Property__c> property = [SELECT Id,Name,Description__c,Amenities__c,Street__c,State__c,City__c,Landmark__c,Country__c,Locality__c,Postal_Code__c,Current_Owner__r.Name,Number_of_Parking__c,Floor_No__c,Total_Covered_Area__c,Number_of_Bedrooms__c,Number_of_Bathrooms__c,Number_of_Floors__c,Balconies__c,Furnished_Status__c,Price__c,Total_Carpet_Area__c,Transaction_Type__c,Possession_Status__c,Age_Of_Construction__c FROM Property__c WHERE Id =:propertyId];
            List<String> propertyMedias = new List<String>();
            List<Property_Media__c> mediaRecords = new List<Property_Media__c>();
            mediaRecords = [SELECT Id,Property__c, ExternalLink__c,Tags__c FROM Property_Media__c WHERE Property__c =:propertyId];
            PropertyWrapper propertyInfo = new PropertyWrapper();

            propertyInfo.property = property[0];
            propertyInfo.mediaLinks = mediaRecords;
            return propertyInfo;
        } catch (Exception e) {
            return null;
        }
        
    }

    public class PropertyWrapper {
        @AuraEnabled
        public Property__c property { get; set; }
        
        @AuraEnabled
        public List<Property_Media__c> mediaLinks { get; set; }
    }
}