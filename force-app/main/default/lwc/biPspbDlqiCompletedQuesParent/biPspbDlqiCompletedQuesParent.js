//This is Consolidate Component(LWC) this contains Avatar and Dermatology Life Quality Index (DLQI) Completed Questionnaire to achieve mobile responsive.
//To import Custom labels
import { LightningElement, wire} from 'lwc';
//To import Apex Class
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import GET_ASSESSMENT_BY_CURRENT_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';

export default class BiPspbDlqiCompletedQuesParent extends LightningElement {
	//Global variables(without @track does not trigger automatic re-renders)
	screenWidth;
	showTabMenu;
	count;
	storeWapiCount;
	storePssCount;
	urlq;
	storeDlqiCount;
	storeQsqCount;
	tagetFourteenDate;
	targetTwoMonthsDate;
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

	//Get the total completed assessment count by this only we are allowing from completed questionnarie Tab navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
			if (data) {
				this.count = data;
				if (
					this.count[0] !== 0 ||
					this.count[1] !== 0 ||
					this.count[2] !== 0 ||
					this.count[3] !== 0
				) {
					this.showTabMenu = true;
					this.storeWapiCount = this.count[0];
					this.storePssCount = this.count[1];
					this.storeDlqiCount = this.count[2];
					this.storeQsqCount = this.count[3];
				} else {
					this.showTabMenu = false;
				}
			}
		} catch (err) {
			this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//Get the  Date for Qualitative Date
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetTwoMonthsDate = data.targetTwoMonthsDate ?? null;
				this.tagetFourteenDate = data.targetFourteenWeeksDate ?? null;
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

	renderedCallback() {
		try {
			let currentURL = window.location.href;
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
			let windowWidth = window.innerWidth;
			if (windowWidth <= 1200) {
				this.screenWidth = '12';
			} else {
				this.screenWidth = '4';
			}
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error
		}
	}
	//Navigation methods
	openOutQuestionnaires() {
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}
	openSummary() {
		window.location.assign(this.urlq + labels.SUMMARY_URL);
	}
	// navigation for all Completed Questionnaire by checking conditions
	openComQuestionnaires() {
		if (this.storeDlqiCount > 0) {
			window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
		} else if (this.storePssCount > 0) {
			window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
		} else if (this.storeWapiCount > 0) {
			window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
		} else if (this.storeQsqCount > 0) {
			if (this.tagetFourteenDate !== null) {
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