public with sharing class GmailIntegration {
    public GmailIntegration() {

    }

    @future (callout=true)
    public static void sendGmail(String subjectMail, String bodyGmail, String sendTo) {
        String errorMessage = '';
        String before = 'From: Jaimin Shah <jaiminshah555@gmail.com>\n' +
                        'To: ' + sendTo + '\n' +
                        'Subject: ' + subjectMail + '\n' +
                        'Content-Type: text/html \n\n' + bodyGmail;
        System.debug(before);
        
        Blob beforeblob = Blob.valueOf(before);
        String paramvalue = EncodingUtil.base64Encode(beforeblob);
        paramvalue = paramvalue.replace('+', '-');
        paramvalue = paramvalue.replace('/', '_');
        System.debug(paramvalue);
        
        Http httpMail = new Http();
        HttpRequest httpReqMail = new HttpRequest();
        HttpResponse httpResMail = new HttpResponse();
        httpReqMail.setEndpoint('callout:Gmail/gmail/v1/users/me/messages/send');
        httpReqMail.setMethod('POST');
        httpReqMail.setHeader('Content-Type', 'application/json');
        httpReqMail.setHeader('Content-Length', '-1');
        
        String refreshToknBody = '{"userId":"me","raw":"' + paramvalue + '"}';
        System.debug(refreshToknBody);
        httpReqMail.setBody(refreshToknBody);
        
        try {
            httpResMail = httpMail.send(httpReqMail);
            if (httpResMail.getStatusCode() == 200) {
                System.debug(httpResMail.getBody());
            } else {
                String errorMessageMail = 'Unexpected Error while communicating with Google Calendar API. ' +
                                        'Status ' + httpResMail.getBody() + ' and Status Code ' + httpResMail.getStatusCode();
                System.debug('Error ' + errorMessageMail);
                System.debug(httpResMail);
            }
        } catch (System.Exception e) {
            System.debug('#### Exception Executed ' + e.getStackTraceString() + ' ' + e.getMessage());
        }
    }

}