/**
* @description To check the days to send notification and calling
another method to create tasks.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version 
*/
public with sharing class BI_PSPB_NotificationExpiredDaysCtrl {
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
    * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	*/
    public static Integer oneCount() {
        BI_PSPB_NotificationExpiryDate__mdt mcs = BI_PSPB_NotificationExpiryDate__mdt.getInstance(
            BI_PSPB_NotificationConstantsCtrl.notificationExpiredCount
        );
        return mcs.BI_PSPB_OneDay__c.intValue();
    }
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
    * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	*/
    public static Integer sevenCount() {
        BI_PSPB_NotificationExpiryDate__mdt mcs = BI_PSPB_NotificationExpiryDate__mdt.getInstance(
            BI_PSPB_NotificationConstantsCtrl.notificationExpiredCount
        );
        return mcs.BI_PSPB_SevenDays__c.intValue();
    }
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
    * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	*/
    public static Integer twentyEightCount() {
        BI_PSPB_NotificationExpiryDate__mdt mcs = BI_PSPB_NotificationExpiryDate__mdt.getInstance(
            BI_PSPB_NotificationConstantsCtrl.notificationExpiredCount
        );
        return mcs.BI_PSPB_TirtyDays__c.intValue();
    }
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
    * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	*/
    public static Integer thirtyCount() {
        BI_PSPB_NotificationExpiryDate__mdt mcs = BI_PSPB_NotificationExpiryDate__mdt.getInstance(
            BI_PSPB_NotificationConstantsCtrl.notificationExpiredCount
        );
        return mcs.BI_PSPB_TwentyEightDays__c.intValue();
    }
}