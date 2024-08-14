/**

*@description       This Method  is used to get URL for the Google Calender.
* History
 * Version  Author      Date            Detail      Description
 * 1.0      Anand S     30-Dec-2024     Created     This was an intial development.
 * 1.1      Rajaa       06-Apr-2024     Updated     Code Review Changes.
 * 1.2      Rajaa       23-July-2024    Update      Code Refactor .
 */ 
public with sharing class BI_PSPB_GoogleCalendarCtrl {
    /**

*@description       This Method  is used to get URL for the Google Calender.
*@param             eventDate  The Event Date for the patient.On the date of treatment.
*@return            googleCalendarURL return the Url of Google Calender.
*                   Returned in the LWC Component biPspbReminderSetup

**/
    @AuraEnabled(cacheable=true)
    public static String generateGoogleCalendarUrl(Date eventDate) {
        String googleCalendarUrl;
        try {
            if (eventDate == null) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.parameterError,BI_PSPB_GoogleCalendarCtrl.class.toString(),false,BI_PSPB_TreatmentConstantsClassCtrl.logError);
            } 

            BI_PSPB_Notification__mdt notificationMetadata = BI_PSPB_Notification__mdt.getInstance(  
                BI_PSPB_TreatmentConstantsClassCtrl.dateOfTreatmentMetaData
            );
            system.debug(notificationMetadata+'notificationMetadata');
            String title = notificationMetadata.BI_PSPB_CalenderTitle__c;
            system.debug(title+'title');
            String detail = notificationMetadata.BI_PSPB_CalenderDescription__c;

            DateTime startDateTime = createDateTime(eventDate, 0, 0, 0);
            DateTime endDateTime = createDateTime(eventDate, 23, 59, 59);

            String startDateTimeString = startDateTime.formatGmt(BI_PSPB_TreatmentConstantsClassCtrl.timeFormat);
            String endDateTimeString = endDateTime.formatGmt(BI_PSPB_TreatmentConstantsClassCtrl.timeFormat);
             googleCalendarUrl = createGoogleCalendarUrl(title, startDateTimeString, endDateTimeString, detail);

            if (String.isBlank(googleCalendarUrl)) {               
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.googleUrlError,BI_PSPB_GoogleCalendarCtrl.class.toString(),false,BI_PSPB_TreatmentConstantsClassCtrl.logError);
            }

        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage( ex.getMessage(), BI_PSPB_GoogleCalendarCtrl.class.toString(), ex);
        }
        return googleCalendarUrl;
        
    } 

    private static DateTime createDateTime(Date eventDate, Integer hour, Integer minute, Integer second) {
        return DateTime.newInstanceGmt(
            eventDate.year(),
            eventDate.month(),
            eventDate.day(),
            hour,
            minute,
            second
        );
    }

    private static String createGoogleCalendarUrl(String title, String startDateTimeString, String endDateTimeString, String detail) {
        return BI_PSPB_TreatmentConstantsClassCtrl.googleCalendar +
               '&text=' + EncodingUtil.urlEncode(title, 'UTF-8') +
               '&dates=' + startDateTimeString + '/' + endDateTimeString +
               '&details=' + EncodingUtil.urlEncode(detail, 'UTF-8') +
               '&trp=true';
    }
}