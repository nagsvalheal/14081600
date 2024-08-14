/*This is Work and Activity Impairment (WPAI) COMPLETED Questionnaire and  this allows you to see Wapi Completed Questionnaire 
	with submitted responses.*/
//To import Libraries
import { LightningElement, wire } from 'lwc';
//To import Apex classes
import GET_ASSESSMENT from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getCompletedQuestionares';
import GET_ASSESSMENT_QUESTION from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import GET_WPAI_EXPIRED from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQstnrcurrentcompleteddate';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_ASSESSMENT_BY_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_Img from '@salesforce/resourceUrl/BI_PSP_PssImage';
import INTRODUCTION_IMG from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbWapiCompletedQuestionnaire extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	sliderValue = 0;
	sliderValuesec = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	userid = Id;
	drfatRecords = [];
	completedOn = labels.COMPLETED;
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	assessmentResponseses;
	shouldShowComponent = false;
	questionData;
	categoryName = labels.QUALITATIVE_LABEL;
	urlq;
	firstQuestionText;
	firstQuestionId;
	secondQuestionId;
	secondQuestionText;
	thirdQuestionText;
	thirdQuestionVersionId;
	fourthQuestionText;
	fourthQuestionVersionId;
	fifthQuestionText;
	fifthQuestionVersionId;
	sixthQuestionText;
	sixthQuestionVerionId;
	firstQuestionResponse;
	secondQuestionResponse;
	thirdQuestionResponse;
	fourthQuestionResponse;
	fifthQuestionResponse;
	sixthQuestionResponse;
	cardImage = INTRODUCTION_IMG;
	cardImageDlqi = DLQI_IMG;
	cardImagePss = PSS_Img;
	cardImageWapi = WPAI_IMG;
	cardImageQsq = QUALITATIVE_IMG;
	wapiCategoryname = labels.WPAI_CATEGORY;
	introduction = labels.INTRODUCTION_CATEGORY;
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	workAPI = labels.WPAI_TXT;
	wpaiBot = labels.WPAI_BOTTOM_TXT;
	wpaiBotOne = labels.WPAI_BOTTOM_TXT_TWO;
	selectmonth = labels.SELECT_MONTH;
	completedQn = labels.COMPLETED_QUESTIONNAIRE_TXT;
	rollout = labels.ROLL_OUT_TXT;
	expiredOn = labels.EXPIRED_ON;
	errorLoading = labels.ERROR_LOADING;
	notFound = labels.NO_ASSESSMENT_RECORD_FOUND;
	includeTxt = labels.INCLUDE_TXT;
	hours = labels.HOUR_TXT;
	skipTxt = labels.WPAI_SKIP;
	sliderText = labels.WPAI_SEC_TXT;
	sliderTextSec = labels.WPAI_SLIDER_TWO;
	workSliderLeft = labels.WPAI_WORK_LEFT;
	workSliderRight = labels.WPAI_WORK_RIGHT;
	dailySilderLeft = labels.WPAI_DAILY_LEFT;
	dailySilderRight = labels.WPAI_DAILY_RIGHT;
	dateResponses = [];
	storedate;
	expireDate;
	rolloutDate;
	selectedAssessment;
	assessments = [];
	forTwoResp = false;
	forSixResponse = false;
	// To get site Url to find the Current SiteName
	connectedCallback() {
		try {
			let global = window;
			let CURRENT_URL = global.location.href;
			// Create a URL object
			let URL_OBJECT = new URL(CURRENT_URL);
			// Get the PATH
			let PATH = URL_OBJECT.pathname;
			// Split the PATH using '/' as a separator
			let PATH_COMPONENTS = PATH.split('/');
			// Find the component you need (in this case, 'Branded')
			let DESIRED_COMPONENT = PATH_COMPONENTS.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENT.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_NAVI_URL;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT); //Catching Potential Error
		}
	}

	dispatchValueChangeEvent() {
		const event = new CustomEvent('valuechange', {
			detail: { value: this.valueToSend }
		});
		this.dispatchEvent(event);
	}
	updateThumbLabelPosition() {
		// Ensure the DOM is ready before querying elements
		Promise.resolve().then(() => {
			this.sliderValue = this.fifthQuestionResponse;

			let slider = this.template.querySelector('.slider');
			let thumbLabel = this.template.querySelector('.thumb-label');

			// Check if both elements exist
			if (slider && thumbLabel) {
				let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
				let sliderWidth = slider.offsetWidth;
				let thumbPosition =
					(this.sliderValue / slider.max) * (sliderWidth - thumbWidth);

				let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
				let maxPosition = sliderWidth - thumbWidth;

				thumbLabel.style.left =
					Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
				thumbLabel.setAttribute('data-value', this.sliderValue);

				// Update the content of the thumb-label
				thumbLabel.textContent = this.sliderValue;
			}
		});
	}

	//To place the value in right position inside the slider
	updateThumbLabelPositionsec() {
		Promise.resolve().then(() => {
			this.sliderValuesec = this.sixthQuestionResponse;

			let slider = this.template.querySelector('.slidersec');
			let thumbLabel = this.template.querySelector('.thumb-labelsec');

			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition =
				(this.sliderValuesec / slider.max) * (sliderWidth - thumbWidth);

			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;

			thumbLabel.style.left =
				Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', this.sliderValuesec);

			// Update the content of the thumb-label
			thumbLabel.textContent = this.sliderValuesec;
		});
	}
	//Get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// To get Assessment record and status for particular record
	/*Null checks are not performed because if there is no Assessment with COMPLETED Status
	it will not navigate to this page.
	*/
	@wire(GET_ASSESSMENT_BY_USER_NAME, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// To get rollout date
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			}
			if (data) {
				this.dateResponses = data;
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// Getting assessment Question
	// There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTION, { questionnaireName: '$wapi' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.processAssessmentQuestions(data);
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	processAssessmentQuestions(data) {
		this.questionData = data.map((question) => ({
			id: question.Id,
			questionText: question.QuestionText,
			activeVersionId: question.ActiveVersion ? question.ActiveVersion.Id : null
		}));

		const questionMapping = [
			{ textKey: 'firstQuestionText', versionKey: 'firstQuestionVersionId' },
			{ textKey: 'secondQuestionText', versionKey: 'secondQuestionVersionId' },
			{ textKey: 'thirdQuestionText', versionKey: 'thirdQuestionVersionId' },
			{ textKey: 'fourthQuestionText', versionKey: 'fourthQuestionVersionId' },
			{ textKey: 'fifthQuestionText', versionKey: 'fifthQuestionVersionId' },
			{ textKey: 'sixthQuestionText', versionKey: 'sixthQuestionVersionId' }
		];

		this.questionData.forEach((question, index) => {
			if (questionMapping[index]) {
				this[questionMapping[index].textKey] = question.questionText;
				this[questionMapping[index].versionKey] = question.activeVersionId;
			}
		});
	}
	//To get the current record COMPLETED data
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_WPAI_EXPIRED, { categoryName: '$wapiCategoryname' })
	wiredwapiexpiredResponses({ data, error }) {
		try {
			if (data) {
				// Map the assessments and format the date for each
				this.assessments = data.map((response) => ({
					effectiveDate: this.formatDate(response.EffectiveDateTime),
					expirationDate: this.formatDate(response.ExpirationDateTime),
					formattedDate: this.formatDate(response.EffectiveDateTime)
				}));

				this.mapAssessment();
			} else if (error) {
				this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// Utility method to format the date using Intl.DateTimeFormat
	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	// Wire method to fetch data of COMPLETED assessment
	// There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT, { targetDate: '$selectedAssessment', categoryName: '$wapiCategoryname' })
	wiredAssessmentResponses({ error, data }) {
		try {
			if (data) {
				this.drfatRecords = data;
				this.assessmentResponsesesdate = data.map(response => ({ res: response.Assessment.EffectiveDateTime }));
				this.assessmentResponsesesdate1 = data.map(response => ({ res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c }));
				this.assessmentResponseses = data.map(response => ({ res: response.ResponseText || null }));

				this.setDates();
				this.updateQuestionResponses();
				this.dispatchValueChangeEvent();

			} else if (error) {
				this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	setDates() {
		const expireData = this.assessmentResponsesesdate[0];
		const rolloutData = this.assessmentResponsesesdate1[0];

		const currentDate = new Date(expireData.res);
		this.expireDate = this.formatDateForCompletedAndExpired(currentDate);

		const currentDate1 = new Date(rolloutData.res);
		this.rolloutDate = this.formatDateForCompletedAndExpired(currentDate1);
	}

	updateQuestionResponses() {
		const length = this.assessmentResponseses.length;

		this.forSixResponse = length >= 6;
		this.forTwoResp = length <= 2 || (length > 2 && length <= 4);
		this.shouldShowComponent = this.forTwoResp;
		if (this.forSixResponse) {
			this.setResponses(this.assessmentResponseses.slice(0, 6));
			this.updateThumbLabelPosition();
			this.updateThumbLabelPositionsec();
		} else if (this.forTwoResp) {
			this.setResponses(this.drfatRecords);
			if (length <= 2) {
				this.updateThumbLabelPositionsec();
			}
		}
	}

	setResponses(responses) {
		responses.forEach((response, index) => {
			if (response.res !== null) {
				switch (index) {
					case 0:
						this.firstQuestionResponse = response.res;
						break;
					case 1:
						this.secondQuestionResponse = response.res;
						break;
					case 2:
						this.thirdQuestionResponse = response.res;
						break;
					case 3:
						this.fourthQuestionResponse = response.res;
						break;
					case 4:
						this.fifthQuestionResponse = response.res;
						break;
					case 5:
						this.sixthQuestionResponse = response.res;
						break;
					default:
						break;
				}
			}
		});

		this.drfatRecords.forEach((record) => {
			if (record.BI_PSP_ResponseOrder__c === 1) {
				this.firstQuestionResponse = record.ResponseText;
			}
			if (record.BI_PSP_ResponseOrder__c === 6) {
				this.sixthQuestionResponse = record.ResponseText;
			}
		});
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
	formatDateForCompletedAndExpired(dateString) {
		return dateString.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
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

		// Log the stored field values
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

	//To get COMPLETED Assessment for current user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(error.message, labels.labels.ERROR_VARIANT); // Catching Potential Error Apex
			}
			else if (data) {
				this.count = data;
				[this.storeWpai, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			}
		} catch (err) {
			this.showToast(err.message, labels.labels.ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	get checkdlqi() {
		return this.storeDlqi > 0 ? '' : 'disabled';
	}
	get checkpss() {
		return this.storePss > 0 ? '' : 'disabled';
	}

	get checkqsq() {
		return this.storeQsq > 0 ? '' : 'disabled';
	}
	//navigation method for other COMPLETED Questionnaries
	navigateToCategory2() {
		window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
	}

	navigateToCategory5() {
		if (this.targetDateFourteenWks !== null) {
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