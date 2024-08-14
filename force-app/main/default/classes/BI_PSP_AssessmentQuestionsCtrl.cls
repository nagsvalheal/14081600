/*
@description       : This Apex class retrieves assessment questions based on different categories 
                   and handles draft responses for introduction questionnaires. It also provides
                   methods to determine the patient status for enrolled care program participants.
                   This Apex class is used in biPspbIntroductionQuestionnaire,biPspbDLQIquestionnaire,
                   biPspbPSSQuestionnaire,biPspbWAPIQuestionnaire,biPspbQSQuestionnaire1,
                   biPspbQSQuestionnaire2,biPspbIntroductionPageone,biPspbIntroductionPagetwo.
* History:
* Version   Author      Date            Detail          Description
* 1.0       Abinsha     05-Dec-2023     Created         Initial development.
* 1.1       Abinsha     01-Jan-2024     Updated         Updated for caregiver.
* 1.2       Abinsha     04-Apr-2024     Updated         Catch log added.
*/

public with sharing class BI_PSP_AssessmentQuestionsCtrl {
    //this list varibale holds the CareProgramEnrollee  record details.
    private static List<CareProgramEnrollee> cpeList;
    // Holds the Care Program Enrollee Id.
    private static String enrolleeId;
    //variable that holds the Assessment Questions of deifferent Categories.
    private static List<AssessmentQuestion> assessmentQuestions;
    //holds a list of AssessmentQuestionResponse  records.
    private static List<AssessmentQuestionResponse> liAssessRespon;
    
    private static String isunassigned = '';
    /**
   * @description  : Retrieves assessment questions related to WAPI category and we are using this method
                    in an LWC component called biPspbWAPIQuestionnaire.
   * @return       : List of AssessmentQuestion records
   */
   @AuraEnabled(cacheable=true)
    public static List<AssessmentQuestion> getTheAssesmentQuestion(String questionnaireName) {
        try {
            if (String.isNotBlank(questionnaireName)) {
                String fields = 'Id, QuestionText, BI_PSP_OrderNumber__c, DeveloperName, ActiveVersion.Id';
                String conditions = 'QuestionCategory = \'' + String.escapeSingleQuotes(questionnaireName) + '\' ORDER BY BI_PSP_OrderNumber__c ASC';
                assessmentQuestions = (List<AssessmentQuestion>) BI_PSP_CommonQueryUtility.executeQuery('AssessmentQuestion', fields, conditions, false);
            } else {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.categoryName, BI_PSP_AssessmentQuestionsCtrl.class.toString(), true, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
            
            if (assessmentQuestions.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentQuestionsCtrl.class.toString(), true, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
            
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentQuestionsCtrl.class.toString(), ex);
        }
        return assessmentQuestions;
    }

    /**
     * @description Retrieves the patient status for enrolled care program participants and we use 
     *              this method in LWCs such as biPspbIntroductionPageone, biPspbIntroductionPagetwo.
     * @return      a string that returns Patient status (Unassigned, Acute, or null if not found)
     */
    @AuraEnabled(cacheable=true)
    public static String patientstatusreturn() {
        try {
            enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
            if (String.isNotBlank(enrolleeId)) {
                String fields = 'Id, BI_PSPB_PatientStatus__c';
                String conditions = 'Id = \'' + String.escapeSingleQuotes(enrolleeId) + '\'';
                cpeList = (List<CareProgramEnrollee>) BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
            } else {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd, BI_PSP_AssessmentQuestionsCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }

            if (!cpeList.isEmpty()) {
                String patientStatus = cpeList[0].BI_PSPB_PatientStatus__c;
                if (patientStatus == BI_PSP_QuestionnaireConstant.unassigned) {
                    isunassigned = BI_PSP_QuestionnaireConstant.unassigned;
                } else if (patientStatus == BI_PSP_QuestionnaireConstant.acute) {
                    isunassigned = BI_PSP_QuestionnaireConstant.acute;
                } else {
                    isunassigned = BI_PSP_QuestionnaireConstant.chronic;
                }
            } else {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd, BI_PSP_AssessmentQuestionsCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
            } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd, BI_PSP_AssessmentQuestionsCtrl.class.toString(), ex);
        }
        return isunassigned;
    }
}