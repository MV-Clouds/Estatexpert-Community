public with sharing class Esx_FileUploaderController {

    @AuraEnabled
    public static Map<String, String> getPicklistLabelName(String fieldname){
        try {
            System.debug('<------getPicklistLabelName----->');
            Map<String, String> picklistValuesWithLabels = new Map<String, String>();
            Schema.DescribeFieldResult fieldResult = Property_Media__c.getSObjectType().getDescribe().fields.getMap().get(fieldname).getDescribe();
            List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry entry : picklistEntries) {
                picklistValuesWithLabels.put(entry.getValue(), entry.getLabel());
            }

            System.debug(picklistValuesWithLabels);
            return picklistValuesWithLabels;

        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage() + '\nStackTrace: ' + e.getStackTraceString() + ' ' + e.getLineNumber());
            return null;
        }
    }

    @AuraEnabled
    public static List<AWS_Config__c> getAWSInfo(){
        try {
          System.debug('<------getAWSInfo----->');
          List<AWS_Config__c> aws = [SELECT ID,AWS_Access_Key__c,AWS_Secret_Access_Key__c,Name,S3_Bucket_Name__c,S3_Region_Name__c FROM AWS_Config__c LIMIT 1];
          return aws;
        } catch (Exception e) {
            return null;
        }
    }

    @AuraEnabled
    public static List<Property_Media__c> getPropertyMedia(String propertyId){
        try {
            System.debug('<------getPropertyMedia----->');
            List<Property_Media__c> propertyMediaValue = new List<Property_Media__c>();

            if (String.isNotBlank(propertyId)) {

                propertyMediaValue = [SELECT Id, Property__c,ExternalLink__c, FilenameUrlEncoded__c, Filename__c, IsExternalLink__c, Size__c, Tags__c  FROM Property_Media__c WHERE Property__c =: propertyId]; 
                return propertyMediaValue;

            }else {
                return propertyMediaValue;
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage() + '\nStackTrace: ' + e.getStackTraceString() + ' ' + e.getLineNumber());
            return null;
        }
    
    }

    @AuraEnabled
    public static List<Property_Media__c> insertMedias(String media){
        try {
            System.debug('<------insertMedias----->');
            System.debug(JSON.serializePretty(media));
            List<mediaList> med = (List<mediaList>)JSON.deserialize(media, List<mediaList>.class);

            List<Property_Media__c> propertyMediaList = new List<Property_Media__c>();

            for (mediaList var : med) {
                Property_Media__c property_mediaObj = new Property_Media__c(
                ExternalLink__c = var.Location,
                Property__c = var.property,
                Filename__c = var.name,
                Size__c = var.size,
                Tags__c = var.tags);
                propertyMediaList.add(property_mediaObj);
            }

            if (propertyMediaList.size() > 0) {
                insert propertyMediaList;
            }
                
            return propertyMediaList;
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage() + '\nStackTrace: ' + e.getStackTraceString() + ' ' + e.getLineNumber());
            return null;
        }
    }

    @AuraEnabled
    public static string deleteAWSImage(String mediaId){
        try {
            System.debug('<------deleteAWSImage----->');
            List<Property_Media__c> media = [SELECT Id  FROM Property_Media__c WHERE Id =: mediaId];
            if (media.size() > 0) {
                delete media;
                return 'Success';
            }else{
                return 'Records Not Found';
            }
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage() + '\nStackTrace: ' + e.getStackTraceString() + ' ' + e.getLineNumber());
            return null;
        }
    }

    public class mediaList{
        @AuraEnabled
        public Id property{get;set;}
        @AuraEnabled
        public String Location{get;set;}
        @AuraEnabled
        public String name{get;set;}
        @AuraEnabled
        public Decimal size{get;set;}
        @AuraEnabled
        public String tags{get;set;}
    }

}