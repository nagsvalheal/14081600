/**
@description Class used for retrieving care programm erolle with challenges associated 
and updating challenges related values.
Reason for using whithout sharing is we use Care Program Enrollee, 
which is a Health Cloud object;
hence, we cannot utilize user mode here.
History:
Version    Author      Date              Detail         Description
1.0        Nandha      25-7-2023        Created        Initial development 
 
*/
public with sharing class BI_PSP_ChallengeEnrolleCtrl {
/**
 * @description Method to retrieve information about enrollees based on the current user's details.
 * This method returns a list of EnrollWrapper objects containing information about the enrollees,
 * including whether the user is a caregiver or a non-caregiver. It is exposed to Aura-enabled components 
 * and is cacheable for better performance.
 * 
 * @return List of EnrollWrapper objects containing enrollee information and any error messages.
 */

@AuraEnabled(cacheable=true)
public static List<EnrollWrapper> getEnrolle() {
    List<EnrollWrapper> successList = new List<EnrollWrapper>();

    try {
        user userRecord = new user();
       userRecord = BI_PSP_CurrentUser.getCurrentUser();
      

        if (userRecord == null) {
            return successList;
        }

        EnrollWrapper successMessage = new EnrollWrapper();
        String recName = userRecord.Name;
        String email = userRecord.Email;

        if (!userRecord.BI_PSPB_Caregiver__c) {
           
            processNonCaregiver(recName, email, successMessage);
        } else {
            
            processCaregiver(recName, email, successMessage);
        }

        successList.add(successMessage);

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSP_ChallengeConstantCtrl.errorWhileGetEnrolleeId,
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
    }
   

    return successList;
}
/**
 * @description Processes information for a user who is not a caregiver. This method retrieves the associated
 * Account record and Care Program Enrollee information based on the user's name and email. It updates the 
 * provided EnrollWrapper object with the patient enrollee details or an error message if not found.
 *
 * @param userRecord The User object containing the current user's details.
 * @param recName The name of the user, used to match the PersonAccount record.
 * @param email The email of the user, used to match the PersonAccount record.
 * @param successMessage The EnrollWrapper object to be updated with enrollee details or error information.
 */
public static void processNonCaregiver(String recName, String email, EnrollWrapper successMessage) {
   
    String accountFields = 'Id, Name, PersonEmail';
   
    String accountConditions = 'Name = \'' + recName + '\' AND PersonEmail = \'' + email + '\' AND IsPersonAccount = TRUE';

    List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery('Account', accountFields, accountConditions, FALSE);

    if (accounts.isEmpty()) {
      
       BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeEnrolleCtrl.class.toString(),true, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
       
    }

    Account account = (Account) accounts[0];

    String careProgramEnrolleeFields = 'Id, BI_PSP_Total_Reward_Points__c, BI_PSP_Challenge_Rank__c';
   
    String careProgramEnrolleeConditions = 'AccountId = \'' + account.Id + '\'';
    

    List<SObject> patientEnrolleList = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', careProgramEnrolleeFields, careProgramEnrolleeConditions, FALSE);

    if (!patientEnrolleList.isEmpty()) {
     
        successMessage.patientEnrolle = ((CareProgramEnrollee) patientEnrolleList[0]);
    } else {
        BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeEnrolleCtrl.class.toString(),true, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
        
    }
}
 /**
    @description Helper method to process caregiver users and retrieve patient enrollee information.
    @param userRecord The User object representing the current user.
    @param recName The name of the current user.
    @param email The email of the current user.
    @param successMessage The EnrollWrapper object to store the retrieved information and any error messages.
    */

public static void processCaregiver(String recName, String email, EnrollWrapper successMessage) {
    String accountFields = 'Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c';
    
    String accountConditions = 'Name = \'' + recName + '\' AND PersonEmail = \'' + email + '\' AND IsPersonAccount = TRUE AND BI_PSPB_Selected_Patient_ID__c != NULL';

    List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery('Account', accountFields, accountConditions, FALSE);

    if (accounts.isEmpty()) {
        BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.errorWhileGetEnrolleeId, BI_PSP_ChallengeEnrolleCtrl.class.toString(),true, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
    }

    Account selectedAccount = (Account) accounts[0];

    String enrolleeCaregiverFields = 'Id, Name, BI_PSPB_Patient__r.Id, BI_PSPB_Patient__r.Name, BI_PSPB_Contact_Id__c, BI_PSPB_Status__c, BI_PSPB_Contact_Id__r.BI_PSPB_Selected_Patient_ID__c, BI_PSPB_Care_Program_Enrollee__c';
    
    String enrolleeCaregiverConditions = 'BI_PSPB_Patient__r.ID = \'' + selectedAccount.BI_PSPB_Selected_Patient_ID__c + '\' AND BI_PSPB_Status__c = \'' + BI_PSP_ChallengeConstantCtrl.challengeActive + '\'';
 
    List<SObject> ecList = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Enrollee_Caregiver__c', enrolleeCaregiverFields, enrolleeCaregiverConditions, FALSE);
 
    if (ecList.isEmpty() || ecList[0].get('BI_PSPB_Care_Program_Enrollee__c') == null) {
        successMessage.error = ecList.isEmpty() ? BI_PSP_ChallengeConstantCtrl.enrolleeNfNs : BI_PSP_ChallengeConstantCtrl.enrolleeNf;
        return;
    }

    BI_PSPB_Enrollee_Caregiver__c enrolleeCaregiver = (BI_PSPB_Enrollee_Caregiver__c) ecList[0];

   
    String careProgramEnrolleeFields = 'Id, BI_PSP_Total_Reward_Points__c, BI_PSP_Challenge_Rank__c';
    
    String careProgramEnrolleeConditions = 'Id = \'' + enrolleeCaregiver.BI_PSPB_Care_Program_Enrollee__c + '\'';

    List<SObject> patientEnrolleList = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', careProgramEnrolleeFields, careProgramEnrolleeConditions, FALSE);

    if (!patientEnrolleList.isEmpty()) {
       
        successMessage.patientEnrolle = (CareProgramEnrollee) patientEnrolleList[0];
    } else {
        
        successMessage.error = BI_PSP_ChallengeConstantCtrl.enrolleeNf;
    }
}
/**
 * @description Wrapper class used to encapsulate information about a patient enrollee and any associated error messages.
 * This class is designed to be used in Aura-enabled components for transferring data between the server and client.
 */
public class EnrollWrapper {
/* The patient enrollee information.*/
@AuraEnabled
public CareProgramEnrollee patientEnrolle;

/* Any error message associated with the patient enrollee.*/
@AuraEnabled
public String error;
}

}