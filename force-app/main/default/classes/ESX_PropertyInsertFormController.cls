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

    @AuraEnabled
    public static Boolean CreateProperty(String jsonData ){
        try {
        System.debug('jsonData:=='+jsonData);

        PropertyInfo propertyData = (PropertyInfo) JSON.deserialize(jsonData, PropertyInfo.class);
        System.debug('propertyData:=='+propertyData);
        Property__c property = new Property__c();
        property.Balconies__c = propertyData.balconies;
        property.Brokerage__c = propertyData.brokerage;
        property.Carpet_Area__c = propertyData.carpetArea;
        property.carpetAreaUnit__c = propertyData.carpetAreaUnit;
        property.City__c = propertyData.city;
        property.Covered_Area__c = propertyData.coveredArea;
        property.coveredAreaUnit__c = propertyData.coveredAreaUnit;
        property.Floor_No__c = (String)propertyData.floorNumber;
        property.Furnished_Status__c = propertyData.furnishedStatus;
        property.Indoor_Facilities__c =  propertyData.indoorAmenities.size()>0?String.join(propertyData.indoorAmenities, ';'):null;
        property.Locality__c = propertyData.locality;
        property.Maintenance_Charges__c = propertyData.maintenanceCharges;
        property.Number_of_Bathrooms__c = propertyData.bathrooms;
        property.Number_of_Bedrooms__c = propertyData.bedrooms;
        property.Number_of_Floors__c =  propertyData.totalFloors;
        property.Outdoor_Facilities__c = propertyData.outdoorAmenities.size()>0?String.join(propertyData.outdoorAmenities, ';'):null;
        property.Possession_Status__c = propertyData.possessionStatus;
        property.Security_Amount__c = propertyData.bookingAmount;
        // Price__c = propertyData.price,
        property.Price_Includes__c = propertyData.priceInclude;
        property.Name = propertyData.city+' | '+propertyData.locality ;
        property.Property_Type__c = propertyData.propertyType;
        property.Landmark__c = propertyData.nearbyLandmark;
        // Size_Area__c = propertyData.sizeArea,
        // Total_Carpet_Area__c = propertyData.totalCarpetArea,
        // Total_Covered_Area__c = propertyData.totalCoveredArea,
        property.Transaction_Type__c = propertyData.transactionType;
        property.Current_Owner__c = propertyData.currentOwner;
        insert property;
        return true;
    } catch (Exception e) {
        System.debug('Error creating property: ' + e.getMessage());
        return false;
    }
    }

    public class PropertyInfo {

        public String saleOrRent;
        public String propertyType;
        public String city;
        public String locality;
        public Integer bedrooms;
        public Integer balconies;
        public String floorNumber;
        public Integer totalFloors;
        public String furnishedStatus;
        public Integer bathrooms;
        public Integer coveredArea;
        public String coveredAreaUnit;
        public Integer carpetArea;
        public String carpetAreaUnit;
        public String transactionType;
        public String possessionStatus;
        public String availableFrom;
        public String expectedPrice;
        public String pricePerSqft;
        public String priceInclude;
        public Integer bookingAmount;
        public Integer maintenanceCharges;
        public String maintenanceChargesUnit;
        public String brokerage;
        public Boolean responseFromBrokers;
        public List<String> indoorAmenities;
        public List<String> outdoorAmenities;
        public String nearbyLandmark;
        public String currentOwner;
        
        // Constructor
        // public PropertyInfo() {}
    
        // Method to deserialize JSON string
    }
}