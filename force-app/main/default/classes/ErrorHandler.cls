public with sharing class ErrorHandler {
    public ErrorHandler() {

    }

    //Create a method Store_Exception which will take parameter Exception e which will be a static void method
    public static void Store_Exception(Exception e) {
        try{

            System.debug('Exception: ' + e);

            String slackTraceString = e.getStackTraceString();
            //ClassName is whatever it is after Class. in slacktracestring and before .
            String className = slackTraceString.substringBetween('Class.', '.');

            //methodName is whatever it is after className. in slacktracestring and before :
            String methodName = slackTraceString.substringBetween(className + '.', ':');
            Error_Log__c errorLog = new Error_Log__c();
            errorLog.Line_Number__c = e.getLineNumber();
            errorLog.Slack_Trace__c = e.getStackTraceString();
            errorLog.Error_Message__c = e.getMessage();
            errorLog.Error_Type__c = e.getTypeName();
            errorLog.Class_Name__c = className;
            errorLog.Method_Name__c = methodName;

            insert errorLog;

        }catch(Exception ex){
            system.debug('error in Store_Exception >> '+ ex);
        }
    }
}