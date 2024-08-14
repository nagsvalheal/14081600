/**
 * @description      Controller class for updating and retrieving notification settings.
 * History:
 * Version   Author      Date            Detail          Description
 * 1.0       Adhish      05-Dec-2023     Created         Initial development
 * 1.1       Adhish      15-Apr-2024     Updated         Changed method names
 */

 public with sharing class BI_PSP_NotificationCtrl {


    /**
     * @description Updates notification settings for a given account based on the provided wrapper values.
     * @param enrolleeId The ID of the Account to update notification settings for.
     * @param wrapper Wrapper object containing email, sms, insite, and phone notification values.
     */
	@AuraEnabled
	public static void updateFieldInObject(String enrolleeId, BI_PSPB_notificationSettingParaWrapper wrapper) {
		validateAccountId(enrolleeId);
	
		List<BI_PSP_Notification_Setting__c> notifyList = retrieveNotificationSettings(enrolleeId, wrapper.typeValue);
	
		updateNotificationSettings(notifyList, wrapper);
	}
	
	/**
 * @description Validates the account ID parameter.
 * @param enrolleeId The account ID to validate.
 */
	private static void validateAccountId(String enrolleeId) {
		if (String.isBlank(enrolleeId)) {
			 BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND'), BI_PSP_NotificationCtrl.class.getName(), true, BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
		}
	}
	
	/**
 * @description Retrieves notification settings based on account ID and notification type.
 * @param enrolleeId The ID of the Account to retrieve notification settings for.
 * @param typeValue The notification type value to filter the settings.
 * @return List of BI_PSP_Notification_Setting__c objects containing notification settings.
 */
	public static List<BI_PSP_Notification_Setting__c> retrieveNotificationSettings(String enrolleeId, String typeValue) {


        // Using the common query utility to execute the query
        String sObjectType = 'BI_PSP_Notification_Setting__c';
        String fields = 'Id, BI_PSP_Email__c, BI_PSP_SMS__c, BI_PSP_Insite_Notification__c, BI_PSP_Phone__c';
        String conditions = 'BI_PSP_Notification_Type__c = \'' + typeValue + '\' AND BI_PSP_Enrollee__c = \'' + enrolleeId + '\'';
        Boolean withUserMode = FALSE;
        
		List<BI_PSP_Notification_Setting__c> notifyList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

	
		if (notifyList.isEmpty()) {
			 BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND'), BI_PSP_NotificationCtrl.class.getName(), true, BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
		} 
        return notifyList;
	}
	
	/**
 * @description Updates notification settings with values from the wrapper object.
 * @param notifyList List of BI_PSP_Notification_Setting__c objects to update.
 * @param wrapper Wrapper object containing email, sms, insite, and phone notification values.
 */
	public static void updateNotificationSettings(List<BI_PSP_Notification_Setting__c> notifyList, BI_PSPB_notificationSettingParaWrapper wrapper) {
		for (BI_PSP_Notification_Setting__c notification : notifyList) {
			notification.BI_PSP_Email__c = wrapper.emailValue;
			notification.BI_PSP_SMS__c = wrapper.smsValue;
			notification.BI_PSP_Insite_Notification__c = wrapper.insiteValue;
			notification.BI_PSP_Phone__c = wrapper.phoneValue;
	} 
        BI_PSP_DatabaseOperationsUtility.updateOperation( notifyList ,BI_PSP_NotificationCtrl.class.toString(),false);
		
	}
	

    /**BI_PSP_Enrollee__c
     * @description Retrieves notification settings for a given account and type.
     * @param enrolleeId The ID of the Account to retrieve notification settings for.
     * @param type The type of notification settings to retrieve.
     * @return List of BI_PSP_Notification_Setting__c records representing notification settings.
     */
    @AuraEnabled(cacheable = true)
    public static List<BI_PSP_Notification_Setting__c> retrieveNotifications(Id enrolleeId, String type) {
        List<BI_PSP_Notification_Setting__c> notifyList = new List<BI_PSP_Notification_Setting__c>();
        try {
            if (enrolleeId != null && String.isNotBlank(type)) {
                // Define the necessary parameters for the query
                String sObjectType = 'BI_PSP_Notification_Setting__c';
                String fields = 'Id, BI_PSP_Email__c, BI_PSP_SMS__c, BI_PSP_Insite_Notification__c, BI_PSP_Phone__c';
                String conditions = 'BI_PSP_Notification_Type__c = \'' + type + '\' AND BI_PSP_Enrollee__c = \'' + enrolleeId + '\'';
                Boolean withUserMode = false; 

                // Call the common query utility method
                notifyList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

                if (notifyList.isEmpty()) {
                    BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND'), BI_PSP_NotificationCtrl.class.getName(), true, BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
                }
            } else {
               BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND'), BI_PSP_NotificationCtrl.class.getName(), true, BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.errorForAccount, BI_PSP_NotificationCtrl.class.getName(), ex);
        }
        return notifyList;
    }
    
    /**
     * @description Wrapper class used for passing notification values.
     */
    public class BI_PSPB_notificationSettingParaWrapper {
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean emailValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean smsValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean insiteValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean phoneValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public String typeValue { get; set; }
    }
}