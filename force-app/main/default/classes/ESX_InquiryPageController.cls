public with sharing class ESX_InquiryPageController {
 
    @AuraEnabled
    public static WrapperClass getInquiryData(){
        WrapperClass wc = new WrapperClass();
        
        try {
            // Query for inquiries related to the current user
            List<Inquiry__c> inquiries = [SELECT Listing__r.Property__r.Name,Listing__r.Property__r.Id,Listing__r.Listing_Type__c,Contact__r.Name,Contact__r.MobilePhone,Contact__r.Email,Inquiry_Date__c,Status__c FROM Inquiry__c WHERE OwnerId = :UserInfo.getUserId()
            ];

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
        // List<Inquiry__c> inquiries = [SELECT Listing__r.Property__r.Name,Listing__r.Property__r.Id,Listing__r.Listing_Type__c,Contact__r.Name,Contact__r.MobilePhone,Contact__r.Email,Inquiry_Date__c,Status__c FROM Inquiry__c Where OwnerId = :UserInfo.getUserId()];

        //     List<Id> propertyIds = new List<Id>();                                   
        //     for(Inquiry__c inquiry :inquiries) {
        //         propertyIds.add(inquiry.Listing__r.Property__r.Id);
        //     }      
        //     System.debug('propertyIds:'+propertyIds);                            
        //     List<Property_Media__c> medias = [SELECT Id,ExternalLink__c,FilenameUrlEncoded__c,Property__c FROM Property_Media__c WHERE Property__c IN:propertyIds];
        //     System.debug('medias:'+medias);
        //     Map<Id, List<Property_Media__c>> propertyMediaUrlsMap = new Map<Id, List<Property_Media__c>>();
        //     for (Property_Media__c media : [SELECT ExternalLink__c,FilenameUrlEncoded__c,Property__c FROM Property_Media__c WHERE Property__c IN :propertyIds]) {
        //         propertyMediaUrlsMap.put(media.Property__c, new List<Property_Media__c>());
        //         propertyMediaUrlsMap.get(media.Property__c).add(media);
        //     }

        //     WrapperClass wc = new WrapperClass();
        //     wc.inquiries = inquiries;
        //     wc.propertyMedia = medias;
        //     wc.medias = propertyMediaUrlsMap;
            
        // return wc;
    }

    public class WrapperClass {
        @AuraEnabled
        public List<Inquiry__c> inquiries;
        @AuraEnabled
        public List<Property_Media__c> propertyMedia;
        @AuraEnabled
        public Map<Id, List<Property_Media__c>> medias;
        @AuraEnabled
        public String errorMessage;
    }

    // @AuraEnabled
    // public static List<Schema.FieldSet> getFieldSetFields(String objectName, String fieldSetName) {
    //     FieldSet fieldSet = Schema.getFieldSet(objectName, fieldSetName);
    //     List<FieldSetEntry> fieldSetEntries = fieldSet.getFieldSetEntries();
        
    //     List<Schema.FieldSet> fieldSets = new List<Schema.FieldSet>();
        
    //     for (Schema.FieldSetEntry field : fieldSetEntries) {
    //         fieldSets.add(new Schema.FieldSet(field.getFieldPath(), field.getLabel()));
    //     }
        
    //     return fieldSets;
    // }

    // @AuraEnabled
    // public static List<sObject> getInquiries() {
    //     // Add your fields to the query from the field set
    //     List<String> fields = getFieldSetFields('Inquiry__c', 'InquryPageFieldset')
    //                              .stream()
    //                              .map(FieldSetEntry::getFieldPath)
    //                              .collect(Collectors.toList());
        
    //     String query = 'SELECT ' + String.join(',', fields) + ' FROM Inquiry__c';
        
    //     return Database.query(query);
    // }
}