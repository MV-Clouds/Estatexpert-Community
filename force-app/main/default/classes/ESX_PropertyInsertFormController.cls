public with sharing class ESX_PropertyInsertFormController {
    public class PicklistWrapper {
        @AuraEnabled public List<String> propertyTypes { get; set; }
        @AuraEnabled public List<String> floorNumbers { get; set; }
        @AuraEnabled public List<String> furnishedStatuses { get; set; }
        @AuraEnabled public List<String> transactionTypes { get; set; }
        @AuraEnabled public List<String> priceIncludes { get; set; }
        @AuraEnabled public List<String> possessionStatus { get; set; }
        @AuraEnabled public List<String> indoorFacilities { get; set; }
        @AuraEnabled public List<String> outdoorFacilities { get; set; }
        @AuraEnabled public List<String> brokerages { get; set; }
        @AuraEnabled public List<String> carpetareaUnits { get; set; }
        @AuraEnabled public List<String> coveredareaUnits { get; set; }




    }

    @AuraEnabled(cacheable=true)
    public static PicklistWrapper getAllPicklistValues() {
        PicklistWrapper wrapper = new PicklistWrapper();
        wrapper.propertyTypes = getPicklistValues('Property_Type__c');
        wrapper.floorNumbers = getPicklistValues('Floor_No__c');
        wrapper.furnishedStatuses = getPicklistValues('Furnished_Status__c');
        wrapper.transactionTypes = getPicklistValues('Transaction_Type__c');
        wrapper.priceIncludes = getPicklistValues('Price_Includes__c');
        wrapper.possessionStatus = getPicklistValues('Possession_Status__c');
        wrapper.indoorFacilities = getPicklistValues('Indoor_Facilities__c');
        wrapper.outdoorFacilities = getPicklistValues('Outdoor_Facilities__c');
        wrapper.brokerages = getPicklistValues('Brokerage__c');
        wrapper.carpetareaUnits = getPicklistValues('carpetAreaUnit__c');
        wrapper.coveredareaUnits = getPicklistValues('coveredAreaUnit__c');



        return wrapper;
    }

    private static List<String> getPicklistValues(String fieldName) {
        List<String> picklistValues = new List<String>();
        Schema.DescribeFieldResult fieldResult = Schema.SObjectType.Property__c.fields.getMap().get(fieldName).getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();

        for (Schema.PicklistEntry entry : picklistEntries) {
            picklistValues.add(entry.getLabel());
        }

        return picklistValues;
    }
}