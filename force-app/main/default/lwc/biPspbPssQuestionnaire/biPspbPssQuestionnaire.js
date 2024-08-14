//This Component enables users to assess the severity of their psoriasis condition using the Psoriasis Symptom Scale questionnaire.
//To import Libraries
import { LightningElement, wire } from 'lwc';
//To import Apex classes
import GET_ASSESSMENT_QUESTIONS from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_PSORIASIS from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
import GET_ASSMNT_BY_CURRENT_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_AFTER_THREE_MONTHS_AND_FOURTEEN_WEEKS from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
//To get UserId
import Id from '@salesforce/user/Id';
//To import Static Resource
import PSSIMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQIMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAIIMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';
export default class BiPspbPssQuestionnaire extends LightningElement {
	//Global variables
	twoMonthsTrueFalse = false;
	isBarRadioChecked = false;
	isNoneChecked = false;
	isDesktop = false;
	isConfirmationDialogOpen = false;
	customFormModal = false;
	message = labels.COMPLETED_ALL;
	saveAsDrfatContent = labels.SUBMIT_LABEL;
	// Add a new boolean property to track if the draft saved popup is open
	isDraftSavedPopupOpen = false;
	draftSavedMessage = labels.POPUP_MESSAGE;
	isMildChecked = false;
	isModerateChecked = false;
	isSevereChecked = false;
	isBarVerySeverChecked = false;
	//the draft number
	totalDraftResponses = 0;
	shouldFetchDraftResponses = true;
	secondNone = false;
	secondMild = false;
	secondModerate = false;
	secondSevere = false;
	secondVerySever = false;
	thirdNone = false;
	firstQuestionText;
	firstQuestionVersinId;
	secondQuestionText;
	secondQuestionVersinId;
	thirdQuestionText;
	thirdQuestionVersinId;
	fourthQuestionText;
	fourthQuestionVersinId;
	firstQuestionResponse = '';
	secondQuestionResponse = '';
	thirdQuestionResponse = '';
	fourthQuestionResponse = '';
	realAssesVerArra = [];
	realrespArray = [];
	arrayForPushResp = [];
	arrayForPushId = [];
	isPopupOpen = false;
	isPopupOpen1 = false;
	firstRspValue = '';
	firstRespVersId = '';
	secondRspValue = '';
	secondRespVersId = '';
	thirdRspValue = '';
	thirdVersionId = '';
	nameToDraftFirst;
	nameToDraftSecond;
	nameToDraftThird;
	nameToDraftFourth;
	fourthRspValue = '';
	fourthVersionId = '';
	selectedValues = {};
	firstResponseText='';
	firstResponseVersinId='';
	secondResponseText='';
	secondResponseVersinId='';
	thirdResponseText='';
	thirdResponseVersinId='';
	fourthResponseText='';
	fourthResponseVersinId='';
	drfatRecords = [];
	firstDraftResp;
	firstDraftVerionId;
	secondDraftResp;
	secondDraftVerionId;
	thirdDraftResp;
	thirdDraftVersionId;
	fourthDraftRes;
	fourthDraftVersionId;
	countquestion = 4;
	thirdMild = false;
	thirdModerate = false;
	thirdSevere = false;
	thirdVerySever = false;
	pssbottom1 = labels.PSS_BOTTOM_TXT;
	pssbottom2 = labels.PSS_BOTTOM_SEC_MSG;
	fourthNone = false;
	fourthMild = false;
	fourthModerte = false;
	fourthSevere = false;
	fourthVerySevere = false;
	dlqiImage = DLQIMAGE;
	pssImage = PSSIMAGE;
	wpaiImage = WPAIIMAGE;
	qualitativeImage = QUALITATIVE_IMAGE;
	introduction = labels.INTRODUCTION_CATEGORY;
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	workAndActivity = labels.WPAI_TXT;
	outStandingQue = labels.OUTSTANDING_QUESTIONNAIRE;
	verySevere = labels.VERY_SEVERE;
	severe = labels.SEVERE;
	moderate = labels.MODERATE;
	mild = labels.MILD;
	none = labels.NONE;
	answered = labels.ANSWERED;
	submit = labels.SUBMIT;
	draftLabel = labels.SAVE_AS_DRAFT;
	returnBackc = labels.BUTTON_RETURN_BACK;
	rolloutWithoutSpaceDate = labels.ROLLOUT_DATE;
	expiresOn = labels.EXPIRES_ON;
	confirmSub = labels.BUTTON_CONFIRM_SUB;
	cannotEdit = labels.CANNOT_EDIT_MSG;
	cancelbt = labels.CANCEL_BUTTON;
	confirmbt = labels.CONFIRM_BUTTON;
	disablecmp;
	questionData = [];
	userid = Id;
	urlq;
	categoryName = labels.PSS_CATEGORY;
	pssRollOutDate;
	expireDate;
	rolloutDate;
	draftResponses = [];
	assessmentId;
	targetDateFourteenWks;
	targetDateTwoMonths;
	forteenWeeks;
	threeMonthsVar;
	dateResponses = [];
	storeDate;
	popUpMenu = false;
	rollOutDateOne;
	isDataLoaded = false;
	handleResizeBound;
	targetElement;
	visibleButton=false;
	//this method will get called once the component gets loaded in to the dom to get the current site url
	renderedCallback() {
		try {
			let currentURL = window.location.href;
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

			this.isDesktop = this.isDesktopView();
			let flexCrd = window.innerWidth;
			if(flexCrd>=1201)
			{
				this.visibleButton=true;
			}
			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);
		} catch (error) {
			// Handle any errors that occur during the execution of the code above
			this.showToast(error.Message, labels.ERROR_VARIANT); //Catching Potential Error
		}
	}

	// Define the function to execute when the custom element is disconnected from the document's DOM

	disconnectedCallback() {
		window.removeEventListener('resize', this.handleResizeBound);
	}
	// Define the function to handle window resize events
	handleResize() {
		this.isDesktop = this.isDesktopView();
	}

	// Define a helper function to determine if the current viewport width represents a desktop view

	isDesktopView() {
		// Retrieve the current viewport width
		let viewportWidth = window.innerWidth;

		// Adjust this threshold based on your design's breakpoints
		return (
			viewportWidth >= 1024 ||
			viewportWidth <= 400 ||
			viewportWidth <= 576 ||
			viewportWidth <= 769 ||
			viewportWidth <= 993 ||
			viewportWidth <= 1200
		); // Example breakpoints at 1024 pixels and 400 pixels
	}

	dispatchValueChangeEvent() {
       const event = new CustomEvent('valuechange', {
            detail: { value: this.valueToSend}
        });
        this.dispatchEvent(event);
    }
	// To retrieve assessment response 
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				this.count = data;
				// Check if count array has elements
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;

			} else if (error) {
				this.showToast(error.body.Message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(err.Message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// Getter method for checkdlqi property
	get checkdlqi() {
		// If stdlq is greater than 0, return 'disabled'; otherwise, return an empty string
		return this.stdlq > 0 ? 'disabled' : '';
	}

	// Getter method for checkpss property
	get checkpss() {
		// If stpss is greater than 0, return 'disabled'; otherwise, return an empty string
		return this.stpss > 0 ? 'disabled' : '';
	}

	// Getter method for checkwai property
	get checkwai() {
		// If stwai is greater than 0, return 'disabled'; otherwise, return an empty string
		return this.stwai > 0 ? 'disabled' : '';
	}

	// Getter method for checkqsq property
	get checkqsq() {
		// If targetDateFourteenWks and targetDateTwoMonths are both null or stqsq is greater than 0, return 'disabled'
		if (
			(this.targetDateFourteenWks === null && this.targetDateTwoMonths === null) ||
			this.stqsq > 0
		) {
			return 'disabled';
		}
		return '';
	}
	@wire(GET_ASSMNT_BY_CURRENT_USER_NAME, { categoryname: '$categoryname' })
	wiredAssessments({ data, error }) {
		this.handleWireResponse(data, error, this.processAssessmentsData);
	}

	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ data, error }) {
		this.handleWireResponse(data, error, this.processRolloutDateData);
	}

	// Common method to handle wire responses
	handleWireResponse(data, error, processDataCallback) {
		try {
			if (data) {
				processDataCallback.call(this, data);
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT);
		}
	}

	// Method to process assessments data
	processAssessmentsData(data) {
		this.assessmentId = data.length > 0 ? data[0].Id : null;
		this.status = data.length > 0 ? data[0].AssessmentStatus : null;

		if (this.status === labels.EXPIRED) {
			this.calculateDates(data[0].ExpirationDateTime);
		}
		else if (this.status === labels.IN_PROGRESS || this.status === labels.COMPLETED_LABEL) {
			this.calculateDates(data[0].BI_PSP_RolloutforCompletedQuestionnarie__c)
		}
	}

	// Method to process rollout date data
	processRolloutDateData(data) {
		this.dateResponses = data;

		if (!this.assessmentId) {
			this.dateResponses.forEach((item) => {
				this.storeDate = item.BI_PSP_DLQI_RollOutDate__c;
			});
			this.calculateDates(this.storeDate);
		}
	}

	// Method to calculate and set relevant dates and expiration
	calculateDates(dateString) {
		let currentDate = new Date(dateString);
		this.rolloutDate = currentDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		let expirationDate = new Date(this.rolloutDate);
		expirationDate.setDate(expirationDate.getDate() + 30);
		this.expireDate = expirationDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		let todayMs = new Date().getTime();
		let expireDateMs = new Date(this.expireDate).getTime();
		let differenceInDays = Math.ceil((expireDateMs - todayMs) / (1000 * 60 * 60 * 24));

		this.expiresIn = differenceInDays > 30 || differenceInDays < 0 ? 30 : differenceInDays;
	}

	// Wire service to fetch patient data after three months and fourteen weeks
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_AFTER_THREE_MONTHS_AND_FOURTEEN_WEEKS)
	wiredResult({ error, data }) {
		try {
			// Check if data is received successfully
			if (data) {
				// Assign the received data to respective properties
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;

				// Assign target dates, defaulting to null if not present in the data
				this.targetDateTwoMonths = data.targetTwoMonthsDate ?? null;
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			} else if (error) {
				// Handle error if any
				this.showToast(error.body.Message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			// Log any errors that occur during execution
			this.showToast(error.Message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// Getter for determining the CSS class of the main popup container
	get popupClass() {
		// If isPopupOpen is true, return 'popup-container', otherwise return 'popup-container hidden'
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	// Getter for determining the CSS class of the save draft popup container
	get popupClassSaveDraft() {
		// If isDraftSavedPopupOpen is true, return 'popup-containersaveasdr', otherwise return '.popup-containersaveasdr hidden'
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: 'popup-containersaveasdr hidden';
	}

	// Getter for determining the CSS class of the secondary popup container
	get popupClass1() {
		// If isPopupOpen1 is true, return 'popup2-container', otherwise return 'popup2-container hidden'
		return this.isPopupOpen1 ? 'popup2-container' : 'popup2-container hidden';
	}

	// Method to hide all modal popups
	customHideModalPopup() {
		// Set boolean properties to false to hide all popups
		this.customFormModal = false;
		this.isPopupOpen = false;
		this.isPopupOpen1 = false;
	}

	// Wire service to fetch draft responses of Psoriasis
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(DRAFT_RESPONSE_OF_PSORIASIS, { questCatgryName: '$pss', twoMonths: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			// Check if data is received successfully
			if (data) {
				this.drfatRecords = data;
				this.getTheDraftEnabled();
				// Map the data to draftResponses array
				this.draftResponses = data.map((response) => ({
					id: response.Id,
					questionText: response.ResponseValue,
					activeVersionId: response.AssessmentQuestion
						? response.AssessmentQuestion.Id
						: null
				}));

				// Update the totalDraftResponses property
				this.totalDraftResponses = this.draftResponses.length;
				// If there are draft responses, extract data for first four questions
				if (this.draftResponses.length >= 1) {
					let firstQuestion = this.draftResponses[0];

					this.firstResponseText = firstQuestion.questionText;

					this.firstResponseVersinId = firstQuestion.activeVersionId;

					// Check if the array has the expected length before accessing the elements
					if (this.draftResponses.length >= 2) {
						let secondQuestion = this.draftResponses[1];

						this.secondResponseText = secondQuestion.questionText;

						this.secondResponseVersinId = secondQuestion.activeVersionId;

						// Continue similarly for the third question
						if (this.draftResponses.length >= 3) {
							let thirdQuestion = this.draftResponses[2];

							this.thirdResponseText = thirdQuestion.questionText;

							this.thirdResponseVersinId = thirdQuestion.activeVersionId;

							// Continue similarly for the fourth question
							if (this.draftResponses.length >= 4) {
								let fourthQuestion = this.draftResponses[3];

								this.fourthResponseText = fourthQuestion.questionText;

								this.fourthResponseVersinId = fourthQuestion.activeVersionId;
							}
						}
					}
				} else if (error) {
					this.showToast(error.body.Message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
				}
			}
		} catch (err) {
			// Log any errors that occur during execution
			this.showToast(err.Message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//this method is for storing the draft response and its version id so that we can use these variables to save the draft response later ,also in this method we will be making the radio buttons as checked if the draft values matches with the values that are stored in to variables with their respective radio option values.

	getTheDraftEnabled() {
		const inputs = this.template.querySelectorAll('.column1 input[type="radio"]');
		const inputInfo = [];
		// Loop through each input element and gather the information
		inputs.forEach(input => {
			inputInfo.push({
				name: input.name,
				value: input.value,
				checked: input.checked,
				ariaInvalid: input.getAttribute('aria-invalid'),
				label: input.nextElementSibling.querySelector('.nds-form-element__label').textContent,
				index: input.nextElementSibling.getAttribute('data-index')
			});
		});
		this.drfatRecords.forEach(record => {
			// Check here if the values are matched
			inputInfo.forEach((input) => {
				if (input.value === record.ResponseValue && record.BI_PSP_ResponseOrder__c === 1) {
					// Define a map to associate ResponseValues with state variables
					const valueToCheckedState = {
						[this.verySevere]: 'isBarVerySeverChecked',
						[this.severe]: 'isSevereChecked',
						[this.moderate]: 'isModerateChecked',
						[this.mild]: 'isMildChecked',
						[this.none]: 'isNoneChecked'

					};
					const checkedState = valueToCheckedState[record.ResponseValue];
					if (checkedState) {
						this[checkedState] = true;
					}
					this.firstDraftResp = record.ResponseValue;
					this.firstDraftVerionId = record.AssessmentQuestion.Id;
				}
				if (input.value === record.ResponseValue && record.BI_PSP_ResponseOrder__c === 2) {
					const valueToCheckedState = {
						[this.verySevere]: 'secondVerySever',
						[this.severe]: 'secondSevere',
						[this.moderate]: 'secondModerate',
						[this.mild]: 'secondMild',
						[this.none]: 'secondNone'
					};
					const checkedState = valueToCheckedState[record.ResponseValue];
					if (checkedState) {
						this[checkedState] = true;
					}
					this.secondDraftResp = record.ResponseValue;
					this.secondDraftVerionId = record.AssessmentQuestion.Id;
				}
				if (input.value === record.ResponseValue && record.BI_PSP_ResponseOrder__c === 3) {
					const valueToCheckedState = {
						[this.verySevere]: 'thirdVerySever',
						[this.severe]: 'thirdSevere',
						[this.moderate]: 'thirdModerate',
						[this.mild]: 'thirdMild',
						[this.none]: 'thirdNone'
					};
					const checkedState = valueToCheckedState[record.ResponseValue];
					if (checkedState) {
						this[checkedState] = true;
					}
					this.thirdDraftResp = record.ResponseValue;
					this.thirdDraftVersionId = record.AssessmentQuestion.Id;
				}
				if (input.value === record.ResponseValue && record.BI_PSP_ResponseOrder__c === 4) {
					const valueToCheckedState = {
						[this.verySevere]: 'fourthVerySevere',
						[this.severe]: 'fourthSevere',
						[this.moderate]: 'fourthModerte',
						[this.mild]: 'fourthMild',
						[this.none]: 'fourthNone'
					};
					const checkedState = valueToCheckedState[record.ResponseValue];
					if (checkedState) {
						this[checkedState] = true;
					}
					this.fourthDraftRes = record.ResponseValue;
					this.fourthDraftVersionId = record.AssessmentQuestion.Id;
				}
			});
		});

	}

	// Wire service to fetch assessment questions
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTIONS, { questionnaireName: '$pss' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			// Check if data is received successfully
			if (data) {
				// Call the method to enable draft saving
				this.getTheDraftEnabled();
				// Map the received data to questionData array
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText,
					activeVersionId: question.ActiveVersion
						? question.ActiveVersion.Id
						: null
				}));
				// Extract data for the first four questions and assign them to respective properties
				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];

				this.firstQuestionText = firstQuestion.questionText;

				this.firstQuestionVersinId = firstQuestion.activeVersionId;

				this.secondQuestionText = secondQuestion.questionText;

				this.secondQuestionVersinId = secondQuestion.activeVersionId;

				this.thirdQuestionText = thirdQuestion.questionText;

				this.thirdQuestionVersinId = thirdQuestion.activeVersionId;

				this.fourthQuestionText = fourthQuestion.questionText;
				this.fourthQuestionVersinId = fourthQuestion.activeVersionId;
			} else if (error) {
				this.showToast(error.body.Message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
			this.dispatchValueChangeEvent();
		} catch (err) {
			this.showToast(err.Message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	// Handle user input for the first question
	handleFirstQuestionChange(event) {
		let cehckedval = event.target.value;
		if (cehckedval === this.verySevere) {
			this.isBarVerySeverChecked = true;
		} else {
			this.isBarVerySeverChecked = false;
		}

		if (cehckedval === this.severe) {
			this.isSevereChecked = true;
		} else {
			this.isSevereChecked = false;
		}

		if (cehckedval === this.moderate) {
			this.isModerateChecked = true;
		} else {
			this.isModerateChecked = false;
		}

		if (cehckedval === this.mild) {
			this.isMildChecked = true;
		} else {
			this.isMildChecked = false;
		}

		if (cehckedval === this.none) {
			this.isNoneChecked = true;
		} else {
			this.isNoneChecked = false;
		}

		// Get the name of the question from the event

		this.nameOfQuestion = event.target.name;

		// Check if the current question is the first question
		if (this.nameOfQuestion === 'firstQuestionResponse') {
			// Update the first question response with the user's input
			this.firstQuestionResponse = event.target.value;
			this.nameToDraftFirst = event.target.name;

			// Push the response and its version ID to arrays if the response is not empty
			if (this.firstQuestionResponse !== '') {
				this.arrayForPushResp.push(this.firstQuestionResponse);
				this.arrayForPushId.push(this.firstQuestionVersinId);
			}

			// Get the last response value and version ID separately
			this.firstRspValue = this.getLastRespValue();
			this.firstRespVersId = this.getLastIdValue();
		}
	}

	// Handle user input for the second question
	handleSecondQuestionChange(event) {
		let cehckedval = event.target.value;
		if (cehckedval === this.verySevere) {
			this.secondVerySever = true;
		} else {
			this.secondVerySever = false;
		}

		if (cehckedval === this.severe) {
			this.secondSevere = true;
		} else {
			this.secondSevere = false;
		}

		if (cehckedval === this.moderate) {
			this.secondModerate = true;
		} else {
			this.secondModerate = false;
		}

		if (cehckedval === this.mild) {
			this.secondMild = true;
		} else {
			this.secondMild = false;
		}

		if (cehckedval === this.none) {
			this.secondNone = true;
		} else {
			this.secondNone = false;
		}

		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Check if the current question is the second question
		if (this.nameOfQuestion === 'secondQuestionResponse') {
			// Update the second question response with the user's input
			this.secondQuestionResponse = event.target.value;
			this.nameToDraftSecond = event.target.name;

			// Push the response and its version ID to arrays if the response is not empty
			if (this.secondQuestionResponse !== '') {
				this.arrayForPushResp.push(this.secondQuestionResponse);
				this.arrayForPushId.push(this.secondQuestionVersinId);
			}

			// Get the last response value and version ID separately
			this.secondRspValue = this.getLastRespValue();
			this.secondRespVersId = this.getLastIdValue();
		}
	}


	// Handle user input for the third question
	handleThirdQuestionChange(event) {
		let cehckedval = event.target.value;
		if (cehckedval === this.verySevere) {
			this.thirdVerySever = true;
		} else {
			this.thirdVerySever = false;
		}

		if (cehckedval === this.severe) {
			this.thirdSevere = true;
		} else {
			this.thirdSevere = false;
		}

		if (cehckedval === this.moderate) {
			this.thirdModerate = true;
		} else {
			this.thirdModerate = false;
		}

		if (cehckedval === this.mild) {
			this.thirdMild = true;
		} else {
			this.thirdMild = false;
		}

		if (cehckedval === this.none) {
			this.thirdNone = true;
		} else {
			this.thirdNone = false;
		}

		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Check if the current question is the third question
		if (this.nameOfQuestion === 'thirdQuestionResponse') {
			// Update the third question response with the user's input
			this.thirdQuestionResponse = event.target.value;
			this.nameToDraftThird = event.target.name;

			// Push the response and its version ID to arrays if the response is not empty
			if (this.thirdQuestionResponse !== '') {
				this.arrayForPushResp.push(this.thirdQuestionResponse);
				this.arrayForPushId.push(this.thirdQuestionVersinId);
			}

			// Get the last response value and version ID separately
			this.thirdRspValue = this.getLastRespValue();
			this.thirdVersionId = this.getLastIdValue();
		}
	}


	// Method to handle user input for the fourth question
	handleFourthQuestionChange(event) {
		let cehckedval = event.target.value;
		if (cehckedval === this.verySevere) {
			this.fourthVerySevere = true;
		} else {
			this.fourthVerySevere = false;
		}

		if (cehckedval === this.severe) {
			this.fourthSevere = true;
		} else {
			this.fourthSevere = false;
		}

		if (cehckedval === this.moderate) {
			this.fourthModerte = true;
		} else {
			this.fourthModerte = false;
		}

		if (cehckedval === this.mild) {
			this.fourthMild = true;
		} else {
			this.fourthMild = false;
		}

		if (cehckedval === this.none) {
			this.fourthNone = true;
		} else {
			this.fourthNone = false;
		}

		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Check if the current question is the fourth question
		if (this.nameOfQuestion === 'fourthQuestionResponse') {
			// Update the fourth question response with the user's input
			this.fourthQuestionResponse = event.target.value;
			this.nameToDraftFourth = event.target.name;

			// Push the response and its version ID to arrays if the response is not empty
			if (this.fourthQuestionResponse !== '') {
				this.arrayForPushResp.push(this.fourthQuestionResponse);
				this.arrayForPushId.push(this.fourthQuestionVersinId);
			}

			// Get the last response value and version ID separately
			this.fourthRspValue = this.getLastRespValue();
			this.fourthVersionId = this.getLastIdValue();
		}
	}

	// Method to get the last response value from the array
	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	// Method to get the last version ID from the array
	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	// Methods to navigate to different questionnaire categories
	navigateToCategory2() {
		window.location.assign(this.urlq + labels.DLQI_URL);
	}

	navigateToCategory3() {
		window.location.assign(this.urlq + labels.PSS_QUESTIONNAIRE_URL);
	}

	navigateToCategory4() {
		window.location.assign(this.urlq + labels.WPAI_QUESTIONAIRE);
	}

	navigateToCategory5() {
		// Navigate to different questionnaire pages based on the target date
		if (this.targetDateFourteenWks !== null) {
			window.location.assign(this.urlq + labels.QUALITATIVE_FOURTEENWEEKS); // Navigate to page 2
		} else {
			window.location.assign(this.urlq + labels.QUALITATIVE_TWO_MONTHS); // Navigate to page 1
		}
	}
	//when you click on the cancel button in the confirm popup Message this mehtod will get invoked and enable all the radio buttons if the provided values in the if condition are matched.

	closePopup() {
		this.isConfirmationDialogOpen = false;
		this.disablecmp = false;

		this.dispatchEvent(
			new CustomEvent('disablevent', {
				detail: this.disablecmp
			})
		);

		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.popUpMenu = false;

		this.updateRadioButtonStatus(this.firstQuestionResponse, {
			severe: 'isSevereChecked',
			mild: 'isMildChecked',
			moderate: 'isModerateChecked',
			none: 'isNoneChecked',
			verySevere: 'isBarVerySeverChecked'
		});

		this.updateRadioButtonStatus(this.secondQuestionResponse, {
			severe: 'secondSevere',
			mild: 'secondMild',
			moderate: 'secondModerate',
			none: 'secondNone',
			verySevere: 'secondVerySever'
		});

		this.updateRadioButtonStatus(this.thirdQuestionResponse, {
			severe: 'thirdSevere',
			mild: 'thirdMild',
			moderate: 'thirdModerate',
			none: 'thirdNone',
			verySevere: 'thirdVerySever'
		});

		this.updateRadioButtonStatus(this.fourthQuestionResponse, {
			severe: 'fourthSevere',
			mild: 'fourthMild',
			moderate: 'fourthModerte',
			none: 'fourthNone',
			verySevere: 'fourthVerySevere'
		});
	}
	//when you click on the cancel button in the Return popup Message this mehtod will get invoked and enable all the radio buttons if the provided values in the if condition are matched.
	closePopup1() {
		this.disablecmp = false;
		this.customFormModal = false;

		this.dispatchEvent(
			new CustomEvent('disablevent', {
				detail: this.disablecmp
			})
		);

		document.body.style.overflow = '';
		this.isPopupOpen1 = false;
		this.popUpMenu = false;

		this.updateRadioButtonStatus(this.firstQuestionResponse, {
			severe: 'isSevereChecked',
			mild: 'isMildChecked',
			moderate: 'isModerateChecked',
			none: 'isNoneChecked',
			verySevere: 'isBarVerySeverChecked'
		});

		this.updateRadioButtonStatus(this.secondQuestionResponse, {
			severe: 'secondSevere',
			mild: 'secondMild',
			moderate: 'secondModerate',
			none: 'secondNone',
			verySevere: 'secondVerySever'
		});

		this.updateRadioButtonStatus(this.thirdQuestionResponse, {
			severe: 'thirdSevere',
			mild: 'thirdMild',
			moderate: 'thirdModerate',
			none: 'thirdNone',
			verySevere: 'thirdVerySever'
		});

		this.updateRadioButtonStatus(this.fourthQuestionResponse, {
			severe: 'fourthSevere',
			mild: 'fourthMild',
			moderate: 'fourthModerte',
			none: 'fourthNone',
			verySevere: 'fourthVerySevere'
		});
	}

	updateRadioButtonStatus(response, statusMap) {
		if (response === this.severe) {
			this[statusMap.severe] = true;
		} else if (response === this.mild) {
			this[statusMap.mild] = true;
		} else if (response === this.moderate) {
			this[statusMap.moderate] = true;
		} else if (response === this.none) {
			this[statusMap.none] = true;
		} else if (response === this.verySevere) {
			this[statusMap.verySevere] = true;
		}
	}
	//when you hit the submit button this method will get invoked and check if all the  questions has been submitted by the user or not if he has submitted then we will show him the confirm popup Message if it is not then we will show a return back popup Message.
	submitResponses() {
		this.handleViewportScrolling();
		this.popUpMenu = true;
		this.checkDraftResponses();
		this.evaluateSubmission();
	}

	// Helper method to handle viewport scrolling
	handleViewportScrolling() {
		document.body.style.overflow = this.isDesktop ? 'hidden' : '';
	}

	// Helper method to check and set draft responses
	checkDraftResponses() {
		const draftResponses = [
			{ response: this.firstDraftResp, draftName: 'nameToDraftFirst', question: 'firstQuestionResponse' },
			{ response: this.secondDraftResp, draftName: 'nameToDraftSecond', question: 'secondQuestionResponse' },
			{ response: this.thirdDraftResp, draftName: 'nameToDraftThird', question: 'thirdQuestionResponse' },
			{ response: this.fourthDraftRes, draftName: 'nameToDraftFourth', question: 'fourthQuestionResponse' }
		];

		draftResponses.forEach(draft => {
			if (draft.response !== '' && typeof draft.response !== 'undefined') {
				this[draft.draftName] = draft.question;
			}
		});
	}

	// Helper method to evaluate if all questions are submitted
	evaluateSubmission() {
		const allQuestionsAnswered = this.nameToDraftFirst && this.nameToDraftSecond && this.nameToDraftThird && this.nameToDraftFourth;

		this.isPopupOpen = allQuestionsAnswered;
		this.disablecmp = true;

		if (allQuestionsAnswered) {
			this.dispatchDisableEvent();
		} else {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.dispatchDisableEvent();
		}
	}

	// Helper method to dispatch disable event
	dispatchDisableEvent() {
		this.dispatchEvent(new CustomEvent('disablevent', { detail: this.disablecmp }));
	}
	// Make page disable
	get popuphide() {
		if (this.popUpMenu === true) {
			return this.popUpMenu === true ? 'disabled' : '';
		}
		return '';
	}

	//this method will get invoked when you click the save as draft button
	saveAsDraft() {
		// Adjust body overflow based on device type
		document.body.style.overflow = this.isDesktop ? 'hidden' : '';

		// Show popup menu
		this.popUpMenu = true;

		// Map draft responses and IDs to their respective arrays
		
		if (this.firstRspValue !== '') {
			this.realrespArray.push(this.firstRspValue);
			this.realAssesVerArra.push(this.firstRespVersId);
		} else if(this.firstRspValue ==='' && this.firstResponseText !==''){
			this.realrespArray.push(this.firstResponseText);
			this.realAssesVerArra.push(this.firstResponseVersinId);
		}
		
		if (this.secondRspValue !== '') {
			this.realrespArray.push(this.secondRspValue);
			this.realAssesVerArra.push(this.secondRespVersId);
		} else if(this.secondRspValue ==='' && this.secondResponseText !==''){
			this.realrespArray.push(this.secondResponseText);
			this.realAssesVerArra.push(this.secondResponseVersinId);
		}

		if (this.thirdRspValue !== '') {
			this.realrespArray.push(this.thirdRspValue);
			this.realAssesVerArra.push(this.thirdVersionId);
		} else if(this.thirdRspValue ==='' && this.thirdResponseText !==''){
			this.realrespArray.push(this.thirdResponseText);
			this.realAssesVerArra.push(this.thirdResponseVersinId);
		}

		if (this.fourthRspValue !== '') {
			this.realrespArray.push(this.fourthRspValue);
			this.realAssesVerArra.push(this.fourthVersionId);
		} else if(this.fourthRspValue ==='' && this.fourthResponseText !==''){
			this.realrespArray.push(this.fourthResponseText);
			this.realAssesVerArra.push(this.fourthResponseVersinId);
		}

		// Filter out empty responses and their corresponding IDs
		let nonEmptyResponses = this.realrespArray.filter(
			(response) => response !== ''
		);
		let nonEmptyIds = this.realAssesVerArra.filter((id) => id !== '');

		let trflse=false;
		//let afafa=2;
		// Check if there are non-empty responses
		if (nonEmptyResponses.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit:trflse,
				isQsqAfterTwoMonths:false
			})
				.then(() => {
					//Close popups and call custom method
					this.customFormModal = false;
					this.closePopup1 = false;
					this.checkyesorno = false;
					this.popUpMetod();
				})
				.catch((error) => {
					this.showToast(error.body.message, labels.ERROR_VARIANT);
				});
		} else {
			// Redirect if no responses
			window.location.assign(this.urlq + labels.OUT_STANDING_URL);
		}
	}
	//custom pop up method as per requirement it should be deplay for certain ms 
	popUpMetod() {
		try {
			// Create an observer to watch when the scroll reaches the top
			const observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					this.isDraftSavedPopupOpen = true;
					observer.disconnect(); // Disconnect the observer once the target is in view
					document.body.removeChild(this.targetElement); // Cleanup the target element
				}
			}, { threshold: 1.0 });

			// Create a target element at the top of the page
			this.targetElement = document.createElement('div');
			this.targetElement.style.position = 'absolute';
			this.targetElement.style.top = '0';
			document.body.appendChild(this.targetElement);

			// Start observing the target
			observer.observe(this.targetElement);

			// Scroll to the top smoothly
			window.scrollTo({ top: 0, behavior: 'smooth' });

		} catch (error) {
			// Handle any errors here
			this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error
		}
	}

	//this will close the custom save as draft popup Message
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}
	//this method is for Confirm Submission pop up Message, when you click on the confim button this will get invoked.

	confirmSubmission() {
		// Arrays to hold responses and version IDs
		if (this.firstRspValue !== '') {
			this.realrespArray.push(this.firstRspValue);
			this.realAssesVerArra.push(this.firstRespVersId);
		} else if(this.firstRspValue ==='' && this.firstResponseText !==''){
			this.realrespArray.push(this.firstResponseText);
			this.realAssesVerArra.push(this.firstResponseVersinId);
		}

		if (this.secondRspValue !== '') {
			this.realrespArray.push(this.secondRspValue);
			this.realAssesVerArra.push(this.secondRespVersId);
		} else if(this.secondRspValue ==='' && this.secondResponseText !==''){
			this.realrespArray.push(this.secondResponseText);
			this.realAssesVerArra.push(this.secondResponseVersinId);
		}

		if (this.thirdRspValue !== '') {
			this.realrespArray.push(this.thirdRspValue);
			this.realAssesVerArra.push(this.thirdVersionId);
		} else if(this.thirdRspValue ==='' && this.thirdResponseText !==''){
			this.realrespArray.push(this.thirdResponseText);
			this.realAssesVerArra.push(this.thirdResponseVersinId);
		}

		if (this.fourthRspValue !== '') {
			this.realrespArray.push(this.fourthRspValue);
			this.realAssesVerArra.push(this.fourthVersionId);
		} else if(this.fourthRspValue ==='' && this.fourthResponseText !==''){
			this.realrespArray.push(this.fourthResponseText);
			this.realAssesVerArra.push(this.fourthResponseVersinId);
		}

		let trflse=true;
		// Check if there are non-empty responses
		if (this.realrespArray.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: this.realAssesVerArra,
				draftResponseTexts: this.realrespArray,
				isItDraftOrSubmit:trflse,
				isQsqAfterTwoMonths:false
			})
				.then(() => {
					// Redirect to outstanding page upon successful submission
					window.location.assign(this.urlq + labels.OUT_STANDING_URL);
				})
				.catch((error) => {
					// Show error toast if there's an error
					this.showToast(error.body.message, labels.ERROR_VARIANT);
				});
		}
	}
	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		//globalThis.location.assign(this.urlq +labels.ERROR_PAGE);
	}
}