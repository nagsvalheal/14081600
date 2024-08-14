//This is Psoriasis Symptom Scale (PSS) completed Questionnaire (LWC),this allows you to see Completed Questionnaire with submitted responses.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
//To import Apex classes
import GET_DATE_FOR_COMPLETED_QUESTIONNAIRE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getCompletedQuestionares';
import GET_PSS_COMPLETED_QUESTIONNAIRE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQstnrcurrentcompleteddate';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_ASSESSMENT_BY_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Static Resource
import PSS from '@salesforce/resourceUrl/BI_PSP_PssImage';
import LET_PERSONLIZE from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To get UserId
import Id from '@salesforce/user/Id';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';


export default class BiPspbPssCompletedQuestionnaires extends LightningElement {
	//Track variable Declarations(re-render variables)
	@track storedEffectiveDates = [];
	@track storedExpirationDates = [];
	htmlEffect;
	htmlExpirationDate;
	selectedValue;
	//Global variables(without @track does not trigger automatic re-renders)
	assessmentResponseses = [];
	categoryName = labels.QUALITATIVE_LABEL;
	urlq;
	records = [];
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	userid = Id;
	assessments = []; // Updated to store a list of assessments
	selectedAssessment; // Added variable to store the selected assessment
	rolloutDate;
	expirationDate;
	expireDate;
	targetFourteenWeekDate;
	pssCategoryname = labels.PSS_CATEGORY;
	introduction = labels.INTRODUCTION_CATEGORY;
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	workAPI = labels.WPAI_TXT;
	cardimage = LET_PERSONLIZE;
	cardImageDlqi = DLQI_IMG;
	cardImagePss = PSS;
	cardImageWpai = WPAI_IMG;
	cardImageQsq = QUALITATIVE_IMG;
	dateResponses = [];
	pssBottomTxt = labels.PSS_BOTTOM_TXT;
	pssBottomTxtOne = labels.PSS_BOTTOM_TXT_ONE;
	selectMonth = labels.SELECT_MONTH;
	notFound = labels.NO_ASSESSMENT_RECORD_FOUND;
	completedQn = labels.COMPLETED_QUESTIONNAIRE_TXT;
	rollOut = labels.ROLL_OUT_TXT;
	expiredOn = labels.EXPIRED_ON;
	completedOn = labels.COMPLETED;
	// To get site Url to find the Current SiteName
	connectedCallback() {
		try {
			let globalthis = window;
			let currentURL = globalthis.location.href;
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
	//To get date for all pss COMPLETED_ON assessment by current user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_DATE_FOR_COMPLETED_QUESTIONNAIRE, { targetDate: '$selectedAssessment', categoryName: '$pssCategoryname' })
	wiredRecords({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.records = data;
				this.assessmentResponsesesdate = data.map((response) => ({
					res: response.Assessment.EffectiveDateTime
				}));

				this.assessmentResponsesesdate1 = data.map((response) => ({
					res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c
				}));

				let dateRollout = this.assessmentResponsesesdate[0];
				let dateExpire = this.assessmentResponsesesdate1[0];
				let theDate = dateRollout.res;
				let theDateTwo = dateExpire.res;
				//rolloutdate:
				let currentDate = new Date(theDate);

				this.expireDate = this.formatDateForCompletedAndExpired(currentDate)
				//expireDate:
				let currentDate1 = new Date(theDateTwo);
				this.rolloutDate = this.formatDateForCompletedAndExpired(currentDate1)
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	dispatchValueChangeEvent() {
		const event = new CustomEvent('valuechange', {
			detail: { value: this.valueToSend }
		});
		this.dispatchEvent(event);
	}
	// Options for the assessment dropdown
	get assessmentOptions() {
		return this.assessments.map((assessment) => ({
			label: assessment.formattedDate,
			value: assessment.effectiveDate
		}));
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.targetFourteenWeekDate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	//To get existing assessment record and their status
	/*Null checks are not performed because if there is no Assessment with completed Status
	it will not navigate to this page.
	*/
	@wire(GET_ASSESSMENT_BY_USER, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	// To get rollOut date for Questionnaire to display
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.dateResponses = data;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	//To get the completed Assessment record in pss
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PSS_COMPLETED_QUESTIONNAIRE, { categoryName: '$pssCategoryname' })
	wiredAssessmentResponses({ data, error }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				// Map the assessments and format the date for each
				this.assessments = data.map((response) => ({
					effectiveDate: this.formatDate(response.EffectiveDateTime),
					expirationDate: this.formatDate(response.ExpirationDateTime),
					formattedDate: this.formatDate(response.EffectiveDateTime)
				}));

				this.mapAssessment();
				this.dispatchValueChangeEvent();
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	// Utility method to format the date using Intl.DateTimeFormat
	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}
	//Formatting the date for Rollout and Expired
	formatDateForCompletedAndExpired(dateString) {
		return dateString.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Handle assessment dropdown change
	handleAssessmentChange(event) {
		let selectedValues = event.target.value;
		this.selectedAssessment = selectedValues;
	}

	// Example of iterating through this.assessments and storing field values in other properties
	mapAssessment() {
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
	//To get all completed Questionnaire count for tab navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.count = data;
				[this.storeWpai, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	get checkdlqi() {
		return this.storeDlqi > 0 ? '' : 'disabled';
	}

	get checkwai() {
		return this.storeWpai > 0 ? '' : 'disabled';
	}
	get checkqsq() {
		return this.storeQsq > 0 ? '' : 'disabled';
	}


	//navigation methods for all completed Questionnaire
	navigateToCategory2() {
		window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
	}

	navigateToCategory4() {
		window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
	}
	navigateToCategory5() {
		if (this.targetFourteenWeekDate !== null) {
			if (this.status === labels.COMPLETED_LABEL || this.status === labels.EXPIRED) {
				window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_FOURTEEN_WEEKS);
			} else {
				window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
		} else {
			window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
		}
	}
	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq + labels.ERROR_PAGE);
	}

}