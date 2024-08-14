//This is Qualitative satisfaction questionnaire COMPLETED Questionnaire(LWC). This allows you to see your submited Responses.
//To import Libraries
import { LightningElement, wire} from 'lwc';
//To import Apex classes
import GET_ASSESSMENT_QUESTIONS from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import GET_TWO_MONTHS_RECORD from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getQSQCompletedQuestionaresFourteenWks';
import GET_TWO_MONTHS_EXPIRED from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getQSQExpiredQuestionnaireFourteenWks';
import GET_EXPIRATION_DATE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQSQExpiredQuestionnaireTwoMonths';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import INTRO_IMAGE from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire'; 
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbQsqCompletedQuesFourteenWeeks extends LightningElement {
	firstQuestionText;
	secondQuestionText;
	thirdQuestionText;
	fourthQuestionText;
	fifthQuestionText;
	sixthQuestionText;
	seventhQuestionText;
	eightQuestionText;
	sliderValue = 0;
	sliderValuesec = 0;
	sliderValuethree = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	informationCenter = labels.INFORMATION_CENTER_TXT;
	symptomTracker = labels.SYMPTOM_TRACKER_TXT;
	challenges = labels.CHALLENGES_TXT;
	questionnaire = labels.QUESTIONNAIRE_TXT;
	treatmentVideos = labels.TREATMENT_VIDEOS;
	support = labels.SUPPORT_TXT;
	userid = Id;
	records = [];
	questionData = [];
	urlq;
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	assessmentlen = 0;
	cardimage = INTRO_IMAGE;
	cardImageDlqi = DLQI_IMAGE;
	cardImagePss = PSS_IMAGE;
	cardImageWpai = WPAI_IMAGE;
	cardImageQsq = QUALITATIVE_IMAGE;
	completedOn = labels.COMPLETED;
	fifthQuestDisplay = true; //new one
	unselectedFifthQues = false;
	isFiveThere = null; //new one
	targetFourteenWeeksDate;
	targetTwoMonthsDate;
	introduction = labels.INTRODUCTION_CATEGORY;
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	workApi = labels.WPAI_TXT;
	completedQn = labels.COMPLETED_QUESTIONNAIRE_TXT;
	rollout = labels.ROLL_OUT_TXT;
	expiredOn = labels.EXPIRED_ON;
	selectMonth = labels.SELECT_MONTH;
	notFound = labels.NO_ASSESSMENT_RECORD_FOUND;
	qsqText = labels.QSQ_EG_TXT;
	rolloutDate;
	expireDate;
	assessments = [];
	assessmentResponseses = [];
	selectedAssessment;
	firstQuestionResponse;
	secondQuestionResponse;
	thirdQuestionResponse;
	fourthQuestionResponse;
	fifthQuestionResponse;
	sixthQuestionResponse;
	seventhQuestionResponse;
	eigthQuestionResponse;
	//To get site url
	connectedCallback() {
		try {
			let global = window;
			let currentURL = global.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL);
			// Get the path
			let path = urlObject.pathname;
			// Split the path using '/' as a separator
			let pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_NAVI_URL;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT); //Catching Potential Error
		}
	}

	// Method to update the thumb label position
	updateThumbLabelPosition(sliderClass, thumbLabelClass, value) {
		Promise.resolve().then(() => {
			let slider = this.template.querySelector(sliderClass);
			let thumbLabel = this.template.querySelector(thumbLabelClass);

			if (!slider || !thumbLabel) return;

			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition = (value / slider.max) * (sliderWidth - thumbWidth);

			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;

			thumbLabel.style.left = Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', value);

			// Update the content of the thumb-label
			thumbLabel.textContent = value;
		});
	}

		dispatchValueChangeEvent() {
       const event = new CustomEvent('valuechange', {
            detail: { value: this.valueToSend}
        });
        this.dispatchEvent(event);
    }
	//To get the Assessment record which is expired
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_EXPIRATION_DATE)
	wiredExpiresResponses({ data, error }) {
		try {
			if (data) {
				this.assessmentlen = data.length;
			}
			else if (error) {
				/*we are already handling exception for this apex wired method in Qualitative after 14 weeks 
				and this can be method can hold empty data since after fourteen weeks is only avaialbe after
				the completion after 2 months Qualitative.*/

			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	// To get assessment Question
	// There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTIONS, { questionnaireName: '$qsq' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (data) {
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText,
					activeVersionId: question.ActiveVersion ? question.ActiveVersion.Id : null
				}));

				this.questionTexts = this.questionData.map(q => q.questionText);

				// Assign the question texts to properties
				[
					this.firstQuestionText,
					this.secondQuestionText,
					this.thirdQuestionText,
					this.fourthQuestionText,
					this.fifthQuestionText,
					this.sixthQuestionText,
					this.seventhQuestionText,
					this.eightQuestionText
				] = this.questionTexts;

			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.targetTwoMonthsDate = data.targetTwoMonthsDate ?? null;
				this.targetFourteenWeeksDate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	//To get the expired and Effective date for all selected Records
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_TWO_MONTHS_EXPIRED)
	wiredwapiexpiredResponses({ data, error }) {
		try {
			if (data) {
				// Map the assessments and format the date for each
				this.assessments = data.map((response) => ({
					effectiveDate: this.formatDate(response.EffectiveDateTime),
					expirationDate: this.formatDate(response.ExpirationDateTime),
					formattedDate: this.formatDate(response.EffectiveDateTime)
				}));

				this.mapAssessmentData();
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	get assessmentOptions() {
		return this.assessments.map((assessment) => ({
			label: assessment.formattedDate,
			value: assessment.effectiveDate
		}));
	}
	handleAssessmentChange(event) {
		let selectedValues = event.target.value;
		this.selectedAssessment = selectedValues;
	}

	// Example of iterating through this.assessments and storing field values in other properties
	mapAssessmentData() {
		// Example: Store the field values in other properties
		this.storedEffectiveDates = this.assessments.map(
			(assessment) => assessment.effectiveDate
		);
		this.storedExpirationDates = this.assessments.map(
			(assessment) => assessment.expirationDate
		);
		this.storedFormattedDates = this.assessments.map(
			(assessment) => assessment.formattedDate
		);

		// Access the first record from the storedEffectiveDates and storedExpirationDates arrays
		if (
			this.storedEffectiveDates.length > 0 &&
			this.storedExpirationDates.length > 0
		) {
			let firstEffectiveDate = this.storedEffectiveDates[0];
			let firstExpirationDate = this.storedExpirationDates[0];

			// Log or use the retrieved values as needed

			this.htmlEffect = firstEffectiveDate;
			this.selectedAssessment = firstEffectiveDate;

			this.htmlExpirationDate = firstExpirationDate;
		}
	}

	// Getting assessment by selected target date
	@wire(GET_TWO_MONTHS_RECORD, { targetDate: '$selectedAssessment' })
	wiredAssessmentResponses({ error, data }) {
		try {
			if (data) {
				this.processAssessmentData(data);
				this.dispatchValueChangeEvent();
			} else if (error) {
				this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	processAssessmentData(data) {
		this.records = data;
		this.setAssessmentDates(data);
		this.setQuestionResponses(data);
		this.checkFifthQuestion();

		// Update thumb label positions

		this.updateThumbLabelPosition('.slider', '.thumb-label', this.firstQuestionResponse);
		this.updateThumbLabelPosition('.slidersec', '.thumb-labelsec', this.thirdQuestionResponse);
		this.updateThumbLabelPosition('.sliderthree', '.thumb-labelthree', this.fourthQuestionResponse);

	}

	setAssessmentDates(data) {
		this.assessmentResponsesesdate = data.map((response) => ({
			res: response.Assessment.EffectiveDateTime
		}));
		this.assessmentResponsesesdate1 = data.map((response) => ({
			res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c
		}));

		let effectiveDate = new Date(this.assessmentResponsesesdate[0].res);
		let rolloutDate = new Date(this.assessmentResponsesesdate1[0].res);

		this.expireDate = effectiveDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		this.rolloutDate = rolloutDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	setQuestionResponses(data) {
		data.forEach((record) => {
			switch (record.BI_PSP_ResponseOrder__c) {
				case 1:
					this.firstQuestionResponse = record.ResponseText;
					break;
				case 2:
					this.secondQuestionResponse = record.ResponseText;
					break;
				case 3:
					this.thirdQuestionResponse = record.ResponseText;
					break;
				case 4:
					this.fourthQuestionResponse = record.ResponseText;
					break;
				case 5:
					this.isFiveThere = labels.YES_LABEL; // New one
					this.fifthQuestionResponse = Array.from(
						record.ResponseText.split(',').filter(
							(element) => element.trim() !== ''
						)
					);
					break;
				case 7:
					this.sixthQuestionResponse = record.ResponseText;
					break;
				case 8:
					this.seventhQuestionResponse = record.ResponseText;
					break;
				default:
					break;
			}
		});
	}

	checkFifthQuestion() {
		if (this.isFiveThere !== labels.YES_LABEL) {
			this.fifthQuestDisplay = false;
			this.unselectedFifthQues = false;
		} else {
			this.fifthQuestDisplay = true;
			this.unselectedFifthQues = false;
		}
	}

	//To get assessment Total count for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				this.count = data;

				if (this.count.length > 0) {
					this.storeWpai = this.count[0];
					this.storePss = this.count[1];
					this.storeDlqi = this.count[2];
					this.storeQsq = this.count[3];
				}
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	get checkdlqi() {
		return this.storeDlqi > 0 ? '' : 'disabled';
	}
	get checkpss() {
		return this.storePss > 0 ? '' : 'disabled';
	}

	get checkwai() {
		return this.storeWpai > 0 ? '' : 'disabled';
	}

	//Navigation for side bar
	navigateToCategory2() {
		window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
	}
	navigateToCategory4() {
		window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
	}
	navigateToCategory5() {
		if (this.targetTwoMonthsDate !== null && this.assessmentlen > 0) {
			window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
		}
	}
	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq +labels.ERROR_PAGE);
	}

}