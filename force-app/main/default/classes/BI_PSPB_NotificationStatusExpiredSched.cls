/**
* @description Used to expire the notifications
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_NotificationStatusExpiredSched implements Schedulable {
    /**
	* @description Executing the batch class to expire all the notifications.
    * @param context The context in which the job is executed. 
	*/
    public void execute(SchedulableContext context) {
        BI_PSPB_NotificationStatusExpiredBatch batch = new BI_PSPB_NotificationStatusExpiredBatch();
        Database.executeBatch(batch, 100);
    }
}