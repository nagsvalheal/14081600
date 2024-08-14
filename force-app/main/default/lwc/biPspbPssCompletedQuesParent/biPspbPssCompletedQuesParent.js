//This is Consolidate Component(LWC) this contains Avatar and Psoriasis Symptom Scale (PSS)Completed Questionnaire to achieve mobile responsive.
//To import Libraries
import { LightningElement, wire} from 'lwc';
//To import Apex Class
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_ASSESSMENT_BY_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire'; 
export default class BiPspbPssCompletedQuesParent extends LightningElement {
	//Global variables(without @track does not trigger automatic re-renders)
	screenWidth;
	count;
	storeWapi=0;
	storePss=0;
	storeDlqi=0;
	storeQsq=0;
	urlq;
	target14wksdate;
	categoryname = labels.QUALITATIVE_LABEL;
	outStandingLabel=labels.OUT_STANDING
	summaryTxt=labels.SUMMARY;
	completedTxt=labels.COMPLETED_TXT;
	letPersonalizeTxt=labels.LET_PERSONALIZE;
		showSpinner = true;
	values = []; // Initialize as an empty array

	handleValueChange(event) {
		const { value } = event.detail;
		this.values.push(value);
		if (this.values.length >= 1) {
			this.showSpinner = false;
		}
	}

	//To get all completed Questionnaire count to prevent tab navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIENT); // Catching Potential Error from Apex
			} else if (data) {
				this.count = data;
				//Checking data of index contains 0;
				this.showTabMenu = this.count.some(count => count !== 0);
				//assigning data values to the variables 
				[this.storeWapi, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIENT); // Catching Potential Error from LWC
		}
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(error.message, labels.ERROR_VARIENT); // Catching Potential Error from Apex
			} else if (data) {
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.target2monthsdate = data.targetTwoMonthsDate ?? null;
				this.target14wksdate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIENT); // Catching Potential Error from LWC
		}
	}
	//To get assessment and status by current User
	/*Null checks are not performed because if it is null i need to restrict navigation
	for Qualitative Questionnaire .
    */
	@wire(GET_ASSESSMENT_BY_USER, { categoryname: '$categoryname' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(error.message, labels.ERROR_VARIENT); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIENT); // Catching Potential Error from LWC
		}
	}
	// To get current site Name
	renderedCallback() {
		try {
			let windowWidth = window.innerWidth;
			if (windowWidth <= 1200) {
				this.screenWidth = '12';
			} else {
				this.screenWidth = '4';
			}
			let currentURL = window.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL); // Get the path
			let path = urlObject.pathname; // Split the path using '/' as a separator
			let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
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
			this.showToast(error.message, labels.ERROR_VARIENT); // Catching Potential Error
		}
	}


	//navigation methods
	openOutQuestionnaires() {
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}
	openSummary() {
		window.location.assign(this.urlq + labels.SUMMARY_URL);
	}
	//navigation for tab navigation
	openComQuestionnaires() {
		if (this.storeDlqi > 0) {
			window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
		} else if (this.storePss > 0) {
			window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
		} else if (this.storeWapi > 0) {
			window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
		} else if (this.storeQsq > 0) {
			if (this.target14wksdate !== null) {
				if (this.status === labels.COMPLETED_LABEL || this.status === labels.EXPIRED) {
					window.location.assign(
						this.urlq + labels.QUALITATIVE_COMPLETED_FOURTEEN_WEEKS
					);
				} else {
					window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
				}
			} else {
				window.location.assign(this.urlq + labels.QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
		}
	}
	openPersonalize() {
		window.location.assign(this.urlq + labels.LETSPERSONLIZE_URL);
	}
	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq +labels.ERROR_PAGE);
	}
}