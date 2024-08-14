/**
 * @description This class is used to retrieve personalized articles based on questionnaire responses.
 * If an answer contains a negative response, it returns negative articles. If no negative responses are found, it returns positive articles.
 * The class was created on 10-Jul-2024.
 * History:
 * Version	Author			Date			Detail				Description
 * 1.0		Gokul Krishnan	10-Jul-2024		Created				Refactor code of personalizedmessagesctrl
 */
public with sharing class BI_PSPB_PersonalizedArticlesCtrl {
	private static String statusOfPatient;
	/**
	 @description main method for getting personalizded articles
	 @return list<String> Article list based on positive or negative responses
    */
	@AuraEnabled(cacheable=true)
	public static List<String> getPersonalizedArticles() {
		List<String> articleList = new List<String>();
		try {
			Id careProgramEnrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0]
				.id;
			// User mode is not enabled because Assessment is health cloud object
			List<Assessment> assessments = BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName(
				BI_PSPB_PersonalizationConstantCtrl.introductionQuestionaire
			);

			if (
				!assessments.isEmpty() &&
				assessments[0].BI_PSP_StatusForPersonalization__c ==
				BI_PSPB_PersonalizationConstantCtrl.completeStatus
			) {
				// User mode is not enabled because AssessmentQuestionResponse is health cloud object
				String sObjectType = 'AssessmentQuestionResponse';
				String fields = 'Name, ResponseText, BI_PSP_Category__c, AssessmentQuestion.Name, AssessmentQuestion.QuestionText, AssessmentQuestionId';
				String conditions =
					'AssessmentId = \'' +
					assessments[0].Id +
					'\'';
				Boolean withUserMode = false;
				List<AssessmentQuestionResponse> assessmentresponse = BI_PSP_CommonQueryUtility.executeQuery(
					sObjectType,
					fields,
					conditions,
					withUserMode
				);
				// User mode is not enabled because CareProgramEnrollee is health cloud object
				String objectType = 'CareProgramEnrollee';
				String field = 'BI_PSPB_PatientStatus__c';
				String condition = 'Id = \'' + careProgramEnrolleeId + '\'';
				Boolean userMode = false;

				List<CareProgramEnrollee> careProgramEnrolleeRecord = BI_PSP_CommonQueryUtility.executeQuery(
					objectType,
					field,
					condition,
					userMode
				);

				if (!careProgramEnrolleeRecord.isEmpty()) {
					statusOfPatient = careProgramEnrolleeRecord[0]
						.BI_PSPB_PatientStatus__c;
				}
				Set<String> negativeResponses = BI_PSPB_PersonalizedArticlesCtrl.getNegativeResponses(
					assessmentresponse
				);

				if (!negativeResponses.isEmpty()) {
					articleList = new List<String>(
						filterArticleByStatus(
							negativeResponses,
							statusOfPatient
						)
					);
					return articleList;
				}

				Set<String> positiveResponses = BI_PSPB_PersonalizedArticlesCtrl.getPositiveResponses(
					assessmentresponse
				);
				articleList = new List<String>(
					filterArticleByStatus(positiveResponses, statusOfPatient)
				);
			}
			/* The absence of an assessment record will not result
			 in an error when accessing personalized articles. */
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_PersonalizationConstantCtrl.errorRetrievePersonalizedArticles,
				BI_PSPB_PersonalizedArticlesCtrl.class.toString(),
				ex
			);
		}
		return articleList;
	}

	/**
	 * @description This method retrieves negative responses from the assessment responses
	 * @param assessmentResponse type - List<AssessmentQuestionResponse> - List of assessment question responses
	 * @return Set<String> Set of negative responses
	 */
	private static Set<String> getNegativeResponses(
		List<AssessmentQuestionResponse> assessmentResponse
	) {
		Set<String> negativeResponses = new Set<String>();

		for (AssessmentQuestionResponse response : assessmentresponse) {
			String questionName = response.AssessmentQuestion.QuestionText;
			String answer = response.ResponseText;
			Map<String, Set<String>> questMap = BI_PSPB_PersonalizationConstantCtrl.negativeResponseMap.get(
				questionName
			);
			if (questMap != null) {
				Set<String> negativeResponse = questMap.get(answer);
				if (negativeResponse != null && negativeResponse.size() > 0) {
					negativeResponses.addAll(negativeResponse);
				}
			} else if (
				questionName ==
				BI_PSPB_PersonalizationConstantCtrl.affectGppQstn
			) {
				if (
					answer.containsIgnoreCase(
						BI_PSPB_PersonalizationConstantCtrl.relationshipWithFriends
					)
				) {
					negativeResponses.add(
						BI_PSPB_PersonalizationConstantCtrl.talkGppLabel
					);
				} else if (
					answer.containsIgnoreCase(
						BI_PSPB_PersonalizationConstantCtrl.relationshipWithPartner
					)
				) {
					negativeResponses.add(
						BI_PSPB_PersonalizationConstantCtrl.gppIntimacyLabel
					);
				} else if (
					answer.containsIgnoreCase(
						BI_PSPB_PersonalizationConstantCtrl.selfEsteem
					)
				) {
					negativeResponses.add(
						BI_PSPB_PersonalizationConstantCtrl.manageScarsLabel
					);
				}
			}
		}
		return negativeResponses;
	}

	/*
	 * @description This method retrieves positive responses from the assessment responses
	 * @param List<AssessmentQuestionResponse> assessmentResponse - List of assessment question responses
	 * @return Set<String> Set of positive responses
	 */
	private static Set<String> getPositiveResponses(
		List<AssessmentQuestionResponse> assessmentResponse
	) {
		Set<String> positiveResponses = new Set<String>();
		//get positive response from assessment
		for (AssessmentQuestionResponse response : assessmentresponse) {
			String questionName = response.AssessmentQuestion.QuestionText;
			String answer = response.ResponseText;
			Map<String, Set<String>> questMap = BI_PSPB_PersonalizationConstantCtrl.positiveResponseMap.get(
				questionName
			);
			if (questMap != null) {
				Set<String> answerCategory = questMap.get(answer);
				if (answerCategory != null && answerCategory.size() > 0) {
					positiveResponses.addAll(answerCategory);
				}
			}
		}
		positiveResponses.add(
			BI_PSPB_PersonalizationConstantCtrl.gppContagiousLabel
		);
		return positiveResponses;
	}

	/**
	 * @description This method filters articles based on the status of the patient
	 * @param  articleSet  - Set of articles
	 * @param  statusOfPatient - Status of the patient
	 * @return Set<String> Filtered set of articles
	 */
	private static Set<String> filterArticleByStatus(
		Set<String> articleSet,
		String statusOfPatient
	) {
		if (
			statusOfPatient == BI_PSPB_PersonalizationConstantCtrl.chronicStatus
		) {
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.spevigoInfusionLabel
			);
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.treatingGppLabel
			);
		} else if (
			statusOfPatient == BI_PSPB_PersonalizationConstantCtrl.acuteStatus
		) {
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.spevigoInjectionLabel
			);
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.preventionGppLabel
			);
		} else {
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.spevigoInfusionLabel
			);
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.treatingGppLabel
			);
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.spevigoInjectionLabel
			);
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.preventionGppLabel
			);
			articleSet.remove(
				BI_PSPB_PersonalizationConstantCtrl.workInGppLabel
			);
		}
		return articleSet;
	}
}