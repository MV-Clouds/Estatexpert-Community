public without sharing class ESX_PropertyDetailsController {

    @AuraEnabled
    public static PropertyWrapper getPropertyInformation(Id propertyId){
        try {
            List<Property__c> property = [SELECT Id,Name,Description__c,Amenities__c,Street__c,State__c,City__c,Landmark__c,Country__c,Locality__c,Postal_Code__c,Current_Owner__c,Current_Owner__r.RecordType.Name,Current_Owner__r.Name,Number_of_Parking__c,Floor_No__c,Total_Covered_Area__c,Number_of_Bedrooms__c,Number_of_Bathrooms__c,Number_of_Floors__c,Balconies__c,Furnished_Status__c,Price__c,Total_Carpet_Area__c,Transaction_Type__c,Possession_Status__c,Age_Of_Construction__c FROM Property__c WHERE Id =:propertyId];
            List<String> propertyMedias = new List<String>();
            List<Property_Media__c> mediaRecords = new List<Property_Media__c>();
            String image;
            mediaRecords = [SELECT Id,Property__c, ExternalLink__c,Tags__c FROM Property_Media__c WHERE Property__c =:propertyId];


            List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: property[0].Current_Owner__c];

            Set<Id> cdIds = new Set<Id>();
            for (ContentDocumentLink cdl :cdlList) {
                cdIds.add(cdl.ContentDocumentId);
            }

            List<ContentDocument> document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id IN: cdIds AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];
            if(document.size() > 0){
                ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE Id =: document[0].LatestPublishedVersionId];
                image = EncodingUtil.Base64Encode(cv.VersionData);
            }

            List<String> picklistValues = new List<String>();
            Schema.DescribeFieldResult fieldResult = Schema.SObjectType.Property_Media__c.fields.getMap().get('Tags__c').getDescribe();
            List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();

            for (Schema.PicklistEntry entry : picklistEntries) {
                picklistValues.add(entry.getLabel());
            }
            PropertyWrapper propertyInfo = new PropertyWrapper();

            propertyInfo.property = property[0];
            propertyInfo.mediaLinks = mediaRecords;
            propertyInfo.ownerProfileImage = image;
            propertyInfo.mediaTags = picklistValues;
            return propertyInfo;
        } catch (Exception e) {
            return null;
        }
        
    }

    public class PropertyWrapper {
        @AuraEnabled
        public Property__c property { get; set; }

        @AuraEnabled
        public String ownerProfileImage { get; set; }
        
        @AuraEnabled
        public List<Property_Media__c> mediaLinks { get; set; }

        @AuraEnabled
        public List<String> mediaTags { get; set; }
    }
}