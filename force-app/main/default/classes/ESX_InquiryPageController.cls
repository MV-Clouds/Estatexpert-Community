public with sharing class ESX_InquiryPageController {
 
    @AuraEnabled
    public static WrapperClass getInquiryData(Id contactId){
        WrapperClass wc = new WrapperClass();
        
        try {
            // Query for inquiries related to the current user
            List<Inquiry__c> inquiries = [SELECT Id, Listing__r.Property__r.Name,Listing__r.Property__r.Id,Listing__r.Property__r.Property_Status__c,Listing__r.Property__r.Current_Owner__r.Id,Listing__r.Property__r.Current_Owner__r.Name,Listing__r.Property__r.Current_Owner__r.MobilePhone,Listing__r.Property__r.Current_Owner__r.Email,Inquiry_Date__c,Status__c FROM Inquiry__c WHERE Listing__r.Property__r.Current_Owner__r.Id = :contactId];

            List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: contactId];

            Set<Id> cdIds = new Set<Id>();
            for (ContentDocumentLink cdl :cdlList) {
                cdIds.add(cdl.ContentDocumentId);
            }

            List<ContentDocument> document = [SELECT Id, Title, FileExtension, LatestPublishedVersionId FROM ContentDocument WHERE Id IN: cdIds AND Title like 'ProfileImage%' order by CreatedDate DESC LIMIT 1];

            if(document.size() > 0){
                ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE Id =: document[0].LatestPublishedVersionId];
                wc.image = EncodingUtil.Base64Encode(cv.VersionData);
            }
            if (!inquiries.isEmpty()) {
                // Extract property IDs from the inquiries
                List<Id> propertyIds = new List<Id>();
                for (Inquiry__c inquiry : inquiries) {
                    if (inquiry.Listing__r != null && inquiry.Listing__r.Property__r != null) {
                        propertyIds.add(inquiry.Listing__r.Property__r.Id);
                    }
                }

                if (!propertyIds.isEmpty()) {
                    // Query for property media related to the extracted property IDs
                    List<Property_Media__c> medias = [SELECT Id, ExternalLink__c, FilenameUrlEncoded__c, Property__c FROM Property_Media__c WHERE Property__c IN :propertyIds];

                    // Create a map of property IDs to their corresponding media records
                    Map<Id, List<Property_Media__c>> propertyMediaUrlsMap = new Map<Id, List<Property_Media__c>>();
                    for (Property_Media__c media : medias) {
                        if (!propertyMediaUrlsMap.containsKey(media.Property__c)) {
                            propertyMediaUrlsMap.put(media.Property__c, new List<Property_Media__c>());
                        }
                        propertyMediaUrlsMap.get(media.Property__c).add(media);
                    }

                    // Assign the data to the wrapper class
                    wc.inquiries = inquiries;
                    wc.propertyMedia = medias;
                    wc.medias = propertyMediaUrlsMap;
                } else {
                    wc.errorMessage = 'No properties found for the inquiries.';
                }
            } else {
                wc.errorMessage = 'No inquiries found for the current user.';
            }
        } catch (Exception e) {
            wc.errorMessage = 'An error occurred: ' + e.getMessage();
            System.debug('Error in getInquiryData: ' + e);
        }
        
        return wc;
    }

    public class WrapperClass {
        @AuraEnabled
        public List<Inquiry__c> inquiries;
        @AuraEnabled
        public List<Property_Media__c> propertyMedia;
        @AuraEnabled
        public Map<Id, List<Property_Media__c>> medias;
        @AuraEnabled
        public String image;
        @AuraEnabled
        public String errorMessage;
    }

    @AuraEnabled
    public static Boolean DeleteInquiry(Id inquiryId){
        try {
            Inquiry__c inquiry = [SELECT Id FROM Inquiry__c WHERE Id=:inquiryId LIMIT 1];
                if(inquiry!=null){
                    delete inquiry;
                }
        } catch(Exception e) {
                System.debug(e.getMessage());
        }
        return true;
    }
    @AuraEnabled
    public static Boolean updateInquiryStatus(String Status,Id recordId){
        try {
            Inquiry__c inquiry = [SELECT Id,Status__c FROM Inquiry__c WHERE Id=:recordId LIMIT 1];
            inquiry.Status__c = Status;
            if(inquiry!=null){
                update inquiry;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return true;
    }

}