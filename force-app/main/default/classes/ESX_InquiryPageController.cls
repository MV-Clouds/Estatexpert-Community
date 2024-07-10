public without sharing class ESX_InquiryPageController {

    @AuraEnabled
    public static WrapperClass getInquiryData(Id contactId){
        WrapperClass wc = new WrapperClass();
        try {
            List<Inquiry__c> inquiries = [SELECT Id, Listing__r.Property__r.Name,Listing__r.Property__r.Id,Listing__r.Property__r.Property_Status__c,Contact__r.Name,Contact__r.MobilePhone,Contact__r.Email,Contact__r.Id,Listing__r.Property__r.Current_Owner__r.Id,Listing__r.Property__r.Current_Owner__r.Name,Listing__r.Property__r.Current_Owner__r.MobilePhone,Listing__r.Property__r.Current_Owner__r.Email,Inquiry_Date__c,Status__c FROM Inquiry__c WHERE Listing__r.Property__r.Current_Owner__r.Id = :contactId];
             Set<Id> contactIds = new Set<Id>();
             for (Inquiry__c inquiry : inquiries) {
                 if (inquiry.Contact__r.Id != null) {
                     contactIds.add(inquiry.Contact__r.Id);
                 }
             }

             List<ContentDocumentLink> cdlListProfile = [
                 SELECT Id, ContentDocumentId, LinkedEntityId 
                 FROM ContentDocumentLink 
                 WHERE LinkedEntityId IN :contactIds
             ];

             Map<Id, Id> contentDocumentToContactMap = new Map<Id, Id>();
             for (ContentDocumentLink cdl : cdlListProfile) {
                 contentDocumentToContactMap.put(cdl.ContentDocumentId, cdl.LinkedEntityId);
             }

             List<ContentDocument> documents = [
                 SELECT Id, Title, FileExtension, LatestPublishedVersionId 
                 FROM ContentDocument 
                 WHERE Id IN :contentDocumentToContactMap.keySet() AND Title LIKE 'ProfileImage%' 
                 ORDER BY CreatedDate DESC
             ];

             Map<Id, String> contactContentVersionMap = new Map<Id, String>();
 
             if (!documents.isEmpty()) {
                List<ContentVersion> contentVersions = [
                     SELECT Id, ContentDocumentId, VersionData 
                     FROM ContentVersion 
                     WHERE Id IN (SELECT LatestPublishedVersionId FROM ContentDocument WHERE Id IN :contentDocumentToContactMap.keySet())
                ];

                if (!contentVersions.isEmpty()) {
                    for (ContentVersion cv : contentVersions) {
                        Id conId = contentDocumentToContactMap.get(cv.ContentDocumentId);
                        if (conId != null) {
                            contactContentVersionMap.put(conId,  EncodingUtil.Base64Encode(cv.VersionData));
                        }
                    }
                }
             }

             wc.contactContentVersions = contactContentVersionMap;           

            if (!inquiries.isEmpty()) {
                List<Id> propertyIds = new List<Id>();
                for (Inquiry__c inquiry : inquiries) {
                    if (inquiry.Listing__r != null && inquiry.Listing__r.Property__r != null) {
                        propertyIds.add(inquiry.Listing__r.Property__r.Id);
                    }
                }

                if (!propertyIds.isEmpty()) {
                    List<Property_Media__c> medias = [SELECT Id, ExternalLink__c, FilenameUrlEncoded__c, Property__c FROM Property_Media__c WHERE Property__c IN :propertyIds];

                    Map<Id, List<Property_Media__c>> propertyMediaUrlsMap = new Map<Id, List<Property_Media__c>>();
                    for (Property_Media__c media : medias) {
                        if (!propertyMediaUrlsMap.containsKey(media.Property__c)) {
                            propertyMediaUrlsMap.put(media.Property__c, new List<Property_Media__c>());
                        }
                        propertyMediaUrlsMap.get(media.Property__c).add(media);
                    }

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
        }
        return wc;
    }

    public class WrapperClass {
        @AuraEnabled
        public List<Inquiry__c> inquiries { get; set; }
        @AuraEnabled
        public List<Property_Media__c> propertyMedia { get; set; }
        @AuraEnabled
        public Map<Id, String> contactContentVersions { get; set; }
        @AuraEnabled
        public Map<Id, List<Property_Media__c>> medias { get; set; }
        @AuraEnabled
        public String errorMessage { get; set; }
    }

    @AuraEnabled
    public static Boolean deleteInquiry(Id inquiryId){
        try {
            if(inquiryId!=null){
                List<Inquiry__c> inquiry = [SELECT Id FROM Inquiry__c WHERE Id=:inquiryId LIMIT 1];
                    if(inquiry.size()>0){
                        delete inquiry;
                    }
            }
            return true;
        } catch(Exception e) {
            System.debug(e.getMessage());
            return null;
        }
    }
    @AuraEnabled
    public static Boolean updateInquiryStatus(String Status,Id recordId){
        try {
            if(Status != null && recordId != null){
                List<Inquiry__c> inquiry = [SELECT Id,Status__c FROM Inquiry__c WHERE Id=:recordId LIMIT 1];
                if(inquiry.size()>0){
                    inquiry[0].Status__c = Status;
                    update inquiry;
                }
            }
            return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}