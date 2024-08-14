//This is Consolidate Component(LWC) this contains Avatar and Dermatology Life Quality Index (DLQI) Questionnaire to achieve mobile responsive.
//To import Custom labels
import { LightningElement, wire, track } from 'lwc';
//To import Apex classes
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_ASSESSMENT_BY_CURRENT_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';
export default class BiPspbDlqiQuesParent extends LightningElement {
	//Global variables
	count;
	urlq;
	screenWidth;
	categoryname = labels.QUALITATIVE_LABEL;
	showTabMenuSummary = false;
	showTabMenu = false;
	outStandingLabel = labels.OUT_STANDING
	summaryTxt = labels.SUMMARY;
	completedTxt = labels.COMPLETED_TXT;
	letPersonalizeTxt = labels.LET_PERSONALIZE
	showSpinner = true;
	values = []; // Initialize as an empty array
	@track finalPartOfUrl = labels.DLQI_URL;

	//To get site url
	handleUrlChange(event) {
		// Access the value from the event detail
		this.urlq = event.detail.value;
	}
	handleValueChange(event) {
		const { value } = event.detail;
		this.values.push(value);
		if (this.values.length >= 1) {
			this.showSpinner = false;
		}
	}

	//To get total completed Questionnaire count for the particular user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.count = data;
				//Checking data of index contains 0;
				this.showTabMenu = this.count.some(count => count !== 0);
				//assigning data values to the variables 
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
				//Checking 1st 3 index values contains 0;
				this.showTabMenuSummary = this.count.slice(0, 3).some(count => count !== 0);
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get the Qualitative date for top bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetDateTwoMonths = data.targetTwoMonthsDate ?? null;
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get assessment and status by current User
	/*Null checks are not performed because if it is null i need to restrict navigation
	for Qualitative Questionnaire .
	*/
	@wire(GET_ASSESSMENT_BY_CURRENT_USER, { categoryname: '$categoryname' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get the site url
	renderedCallback() {
		try {
			let windowWidth = window.innerWidth;
			if (windowWidth <= 1200) {
				this.screenWidth = '12';
			} else {
				this.screenWidth = '4';
			}
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
		}
	}

	//Navigation for tab
	openOutQuestionnaires() {
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}
	openSummary() {
		window.location.assign(this.urlq + labels.SUMMARY_URL);
	}
	//Navigation for completed QUestionnarie
	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + labels.OUT_STANDING_URL);
		} else if (this.stpss > 0) {
			window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
		} else if (this.stwai > 0) {
			window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
		} else if (this.stqsq > 0) {
			if (this.targetDateFourteenWks !== null) {
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
		globalThis.location.assign(this.urlq + labels.ERROR_PAGE);
	}

}