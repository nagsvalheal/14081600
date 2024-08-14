/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_DashboardEnrolleeService {
       /**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */ 
    public static CareProgramEnrollee getCareProgramEnrollee(String accountId) {
        String fields = 'Id';
		String conditions =
			'Id = \'' +
			accountId +
			'\' ' +
			'LIMIT 1';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'CareProgramEnrollee',
			fields,
			conditions,
			false
		);
        CareProgramEnrollee enrollee = (CareProgramEnrollee)results[0];
        return enrollee;
    }
}