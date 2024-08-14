/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_EnrolleeQueryHelper {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param recordId The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<CareProgramEnrollee> getEnrollees(List<Id> recordId) {
		String conditionIds = '(\'' + String.join(recordId, '\', \'') + '\')';
		String fields = 'Id, AccountId, BI_PSPB_PatientStatus__c, Account.PersonContactId, Account.BI_PSP_Birthdate__c';
		String conditions = 'Id IN ' + conditionIds + ' ';
		// Execute query and return results as List<Task>
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'CareProgramEnrollee',
			fields,
			conditions,
			false
		);
		return (List<CareProgramEnrollee>) results; // Cast results to List<Task>
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param birthdate The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static Integer getAge(Date birthdate) {
			// Calculate the age
			Integer age = Date.today().year() - birthdate.year();
			// Adjust age if the birthday hasn't occurred yet this year
			if (
				Date.today().month() < birthdate.month() ||
				(Date.today().month() == birthdate.month() &&
				Date.today().day() < birthdate.day())
			) {
				age--;
			}

			return age;
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param age The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static Boolean isLegalAge(Integer age) {
		return age >= 18;
	}
}