/*
@description Class used for fetching values from Symptom Tracker and Questionnaire objects for chart.
and Questionnaire objects.
History:
Version    Author      Date              Detail         Description
1.0        Gowsic N    10-Dec-2023       Created        Initial development
1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions   
1.2        Abinsha     04-Aug-2024       updated        code refactoring
*/
public with sharing class BI_PSP_QuestionnaireGraphCtrl {

	/*
@description Method for getting Questionnaire details.
Retrieves Questionnaire details based on the provided parameters.
@param erolleId The ID of the care program enrollee.
@param questionnaireCategory The category of the questionnaire.
@param selectedMonths Comma-separated list of selected months.
@return Map containing questionnaire details.
*/
	@AuraEnabled(cacheable=true)
    public static Map<String, List<AssessmentQuestionResponse>> getQuestionnaireDetails(
        String erolleId,
        String questionnaireCategory,
        String selectedMonths
    ) {
        Map<String, List<AssessmentQuestionResponse>> returnQuestionResponse = new Map<String, List<AssessmentQuestionResponse>>();
        try {
            if (String.isBlank(erolleId) || String.isBlank(questionnaireCategory)) {
                return null;
            }

            List<Assessment> recordAssessment = fetchAssessments(erolleId, questionnaireCategory);
            if (recordAssessment.isEmpty()) {
                return null;
            }

            Set<Id> assessmentIds = collectAssessmentIds(recordAssessment, selectedMonths);
            if (assessmentIds.isEmpty()) {
                return null;
            }

            List<AssessmentQuestionResponse> assQuesResponse = fetchAssessmentQuestionResponses(assessmentIds, questionnaireCategory);
            if (assQuesResponse.isEmpty()) {
                return null;
            }

            populateReturnQuestionResponse(returnQuestionResponse, assQuesResponse);
        } catch (Exception ex) {
           BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSP_QuestionnaireGraphCtrl.class.toString(), ex);
        }

        return returnQuestionResponse.isEmpty() ? null : returnQuestionResponse;
    }

    private static List<Assessment> fetchAssessments(String erolleId, String questionnaireCategory) {
        String fields = 'Id, Name, AssessmentStatus, BI_PSP_DateForCQ__c, BI_PSP_CareProgramEnrollee__r.Name';
        String conditions = 'BI_PSP_CareProgramEnrollee__r.Id = \'' + erolleId + '\' ' +
                            'AND Name = \'' + questionnaireCategory + '\' ' +
                            'AND AssessmentStatus != \'' + BI_PSP_QuestionnaireConstant.inProgress + '\' ' +
                            'ORDER BY EffectiveDateTime ASC';
        List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
        return (List<Assessment>) sObjectResponses;
    }

    private static Set<Id> collectAssessmentIds(List<Assessment> recordAssessment, String selectedMonths) {
        Set<Id> assessmentIds = new Set<Id>();
        if (!String.isBlank(selectedMonths)) {
            for (Assessment assess : recordAssessment) {
                if (selectedMonths.contains(assess.BI_PSP_DateForCQ__c)) {
                    assessmentIds.add(assess.Id);
                }
            }
        }
        return assessmentIds;
    }

    private static List<AssessmentQuestionResponse> fetchAssessmentQuestionResponses(Set<Id> assessmentIds, String questionnaireCategory) {
        List<String> fieldsList = new List<String>{
            'Id',
            'Assessment.Id',
            'AssessmentQuestion.QuestionText',
            'AssessmentQuestion.BI_PSP_shortQuestionText__c',
            'AssessmentQuestion.Name',
            'Assessment.AssessmentStatus',
            'ResponseText',
            'BI_PSP_Questionnaire_Name__c',
            'Assessment.BI_PSP_DateForCQ__c',
            'Assessment.Name'
        };

        List<String> assessmentIdsList = new List<String>();
        for (Id assessmentId : assessmentIds) {
            assessmentIdsList.add(assessmentId);
        }

        String assessmentIdsStr = String.join(assessmentIdsList, '\', \'');
        String query = 'SELECT ' + String.join(fieldsList, ', ') +
                       ' FROM AssessmentQuestionResponse' +
                       ' WHERE AssessmentId IN (\'' + assessmentIdsStr + '\')' +
                       ' AND Assessment.Name = \'' + questionnaireCategory + '\'';

        List<SObject> queryResponse = BI_PSP_CommonQueryUtility.executeComplexQuery(query, false);
        return (List<AssessmentQuestionResponse>) queryResponse;
    }

    private static void populateReturnQuestionResponse(Map<String, List<AssessmentQuestionResponse>> returnQuestionResponse, List<AssessmentQuestionResponse> assQuesResponse) {
        for (AssessmentQuestionResponse assres : assQuesResponse) {
            String dateKey = String.valueOf(assres.Assessment.BI_PSP_DateForCQ__c);
            if (!returnQuestionResponse.containsKey(dateKey)) {
                returnQuestionResponse.put(dateKey, new List<AssessmentQuestionResponse>());
            }
            returnQuestionResponse.get(dateKey).add(assres);
        }
    }

	/*
@description Method for getting completed Questionnaire details.
Retrieves Questionnaire details based on the provided parameters.
@param erolleId The ID of the care program enrollee.
@param selectedMonths Comma-separated list of selected months.
@return size of questionnaire details.
*/
	@AuraEnabled(cacheable=true)
	public static List<Assessment> getQuestionnaireLast(
		String erolleId,
		String selectedMonths
	) {
		List<Assessment> assessments = new List<Assessment>();
		try {
			List<Assessment> recordAssessment = new List<Assessment>();
			// Query Assessments
			if (!String.isBlank(erolleId) && !String.isBlank(selectedMonths)) {
				 String fields = 'Id, Name, AssessmentStatus, BI_PSP_DateForCQ__c, BI_PSP_CareProgramEnrollee__r.Name';
                String conditions = 'BI_PSP_CareProgramEnrollee__r.Id = \'' + erolleId + '\' ' +
                                    'AND Name != \'' + BI_PSP_QuestionnaireConstant.introduction + '\' ' +
                                    'AND Name != \'' + BI_PSP_QuestionnaireConstant.qualiCategory + '\' ' +
                                    'AND AssessmentStatus != \'' + BI_PSP_QuestionnaireConstant.inProgress + '\' ' +
                                    'ORDER BY EffectiveDateTime ASC';

                // Execute the query using the common query method
                List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
                recordAssessment=((List<Assessment>)sObjectResponses);

			}
			// Return null if no assessments found, returning null is required because we have a functionality that requires null value to be returned
			if (recordAssessment.isEmpty()) {
				return null;
			}

			// Collect Assessment Ids for selected months, returning null is required because we have a functionality that requires null value to be returned
			for (Assessment assess : recordAssessment) {
				if (selectedMonths.contains(assess.BI_PSP_DateForCQ__c)) {
					assessments.add(assess);
				}
			}
			
		} catch (Exception ex) {
				BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSP_QuestionnaireConstant.emptyAssesment, BI_PSP_QuestionnaireGraphCtrl.class.toString(), ex);
		}
        // Return null if no assessment ids found, returning null is required because we have a functionality that requires null value to be returned
			if (assessments.isEmpty()) {
				return null;
			} else {
				return assessments;
			}
	}

}