//This DLQI questionnaire page(LWC) allows users to measure the impact of their skin problems on their quality of life over the past week.
//To import Libraries
import { LightningElement, wire } from 'lwc';
//To import Apex classes
import GET_ASSESMENT_QUE_FROM_DLQI from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_DRAFT_DERMATOLOGY from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_DERMATOLOGY from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
import GET_ASSMNT_BY_CURRENT_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_PATIENT_AFTER_THREE_MONTHS_AND_FOURTEEN_WEEKS from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Static Resource
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbDlqiQuestionnaire extends LightningElement {
	//Gobal Variables
	twoMonthsTrueFalse = false;
	eigthQuestionVisible = false;
	numberOfResponses;
	checkYesOrNo = false;
	firstQuestionText;
	firstQuestionVersinId;
	secondQuestionText;
	secondQuestionVersinId;
	thirdQuestionText;
	thirdQuestionVersinId;
	fourthQuestionText;
	fourthQuestionVersinId;
	fifthQuestionText;
	fifthQuestionVersinId;
	sixthQuestionText;
	sixthQuestionVersinId;
	seventhQuestionText;
	seventhQuestionVersinId;
	eightQuestionText;
	eightQuestionVersinId;
	ninthQuestionText;
	ninthQuestionVersinId;
	tenthQuestionText;
	tenthQuestionVersinId;
	eleventhQuestionText;
	eleventhQuestionVerionID;
	firstQuestionResponse = '';
	secondQuestionResponse = '';
	thirdQuestionResponse = '';
	fourthQuestionResponse = '';
	fifthQuestionresponse = '';
	sixthQuestionResponse = '';
	seventhQuestionResponse = '';
	eightQuestionResponse = '';
	ninthQuestionResponse = '';
	tenthQuestionResponse = '';
	eleventhQuestionResponse = '';
	totalDraftResponses = 0;
	realAssesVerArra = [];
	realrespArray = [];
	arrayForPushResp = [];
	arrayForPushId = [];
	firstRspValue = '';
	firstRespVersId = '';
	secondRspValue = '';
	secondRespVersId = '';
	thirdRspValue = '';
	thirdVersionId = '';
	fourthRspValue = '';
	fourthVersionId = '';
	fifthResonseValue = '';
	fifthVersionId = '';
	sixthResponseValue = '';
	sixthVersiD = '';
	seventhRespalue = '';
	seventhVersiD = '';
	eghtResponseValue = '';
	eightVersiId = '';
	ninthResponseValue = '';
	ninthVersId = '';
	tenthResponseValue = '';
	tenthVersId = '';
	eleventhResponseValue = '';
	eleventhVersId = '';
	firstResponseText;
	firstResponseVersinId;
	secondResponseText;
	secondResponseVersinId;
	thirdResponseText;
	thirdResponseVersinId;
	fourthResponseText;
	fourthResponseVersinId;
	fifthResponseText;
	fifthResponseVersionId;
	sixthResponseText;
	SixthResponseVersionId;
	seventhResponseText;
	SeventhResponseVersionId;
	eighthResponseText;
	EigthResponseVersionId;
	ninthResponseText;
	NinthResponseVersionId;
	tenthResponseText;
	tenthResponseVersionId;
	eleventhResponseText;
	eleventhResponseVersionId;
	isPopupOpen = false;
	isPopupOpen1 = false;
	nameToDraftFirst;
	nameToDraftSecond;
	nameToDraftThird;
	nameToDraftFourth;
	nameToDraftFifth;
	nameToDraftSixth;
	nameToDraftSeventh;
	nameToDraftEighth;
	nameToDraftNinth;
	nameToDrafttenth;
	nameToDraftEleventh;
	firstRadVerMuch = false;
	firstRadAlot = false;
	firstRadALittle = false;
	firstRadSevere = false;
	secondRadVerMch = false;
	secondRadAlot = false;
	secondRadAlittle = false;
	secondRadNotAtAll = false;
	thirdRadVerMch = false;
	thirdRadAlot = false;
	thirdRadAlittle = false;
	thirdRadNotAll = false;
	thirdRadNotReelevent = false;
	fourthRadVeryMch = false;
	fourthRadAlot = false;
	fourthRadVAlittle = false;
	fourthRadNotAtll = false;
	fourthRadNotRelevetn = false;
	fifthRadVeryMch = false;
	fifthRadAlot = false;
	fifthRadAlittle = false;
	fifthRadNotAtAll = false;
	fifthRadNotRelevent = false;
	sixthRadVeryMuch = false;
	sixthRadAlot = false;
	sixthRadAlittle = false;
	sixthRadNotAtAll = false;
	sixthRadNotRelevent = false;
	eighthRadNotAtAll = false;
	eighthRadAlot = false;
	eighthRadAlittle = false;
	ninthRadverMuch = false;
	ninthRadAlot = false;
	ninthRadAlittle = false;
	ninthRadNotAtAll = false;
	ninthRadNotRelevent = false;
	tenthRadverMuch = false;
	tenthRadAlot = false;
	tenthRadAlittle = false;
	tenthRadNotAtAll = false;
	tenthRadNotRelevent = false;
	isConfirmationDialogOpen = false;
	customFormModal = false;
	message = labels.COMPLETED_ALL;
	submitLabel = labels.SUBMIT_LABEL;
	cardRollOutDate;
	isDraftSavedPopupOpen = false;
	draftSavedMessage = labels.POPUP_MESSAGE;
	//Global variables(without does not trigger automatic re-renders)
	isTenthRespnseTrue = false;
	isFirstRespnseTrue = false;
	countQuestion = 10;
	questionData = [];
	dlqiCardImage = DLQI_IMAGE;
	pssCardImage = PSS_IMAGE;
	wpaiCardImage = WPAI_IMAGE;
	qsqCardImage = QUALITATIVE_IMAGE;
	userId = Id;
	introduction = labels.INTRODUCTION_CATEGORY;
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	wapiQstnrTxt = labels.WPAI_TXT;
	dlqiFirstMsg = labels.DLQI_BOTTOM;
	dlqiSecMsg = labels.DLQI_BOTTOM_TEXT_TWO;
	dlqiThirdMsg = labels.WPAI_BOTTOM_TXT_TWO;
	dlqiFourthMsg = labels.BI_PSP_dlqibottom4;
	verymuch = labels.VERY_MUCH;
	alot = labels.A_LOT;
	alittle = labels.A_LITTLE;
	notatall = labels.NOT_AT_ALL;
	notrelevant = labels.NOT_RELEVANT;
	yes = labels.YES_LABEL;
	no = labels.NO_LABEL;
	answered = labels.ANSWERED;
	submit = labels.SUBMIT;
	saveasdraft = labels.SAVE_AS_DRAFT;
	rolloutdate = labels.ROLLOUT_DATE;
	expireson = labels.EXPIRES_ON;
	outstandingque = labels.OUTSTANDING_QUESTIONNAIRE;
	returnbackc = labels.BUTTON_RETURN_BACK;
	confirmsub = labels.BUTTON_CONFIRM_SUB;
	cannotedit = labels.CANNOT_EDIT_MSG;
	cancelbt = labels.CANCEL_BUTTON;
	confirmbt = labels.CONFIRM_BUTTON;
	popupmenu = false;
	firstDraftResp = '';
	firstDraftVerionId = '';
	secondDraftResp = '';
	secondDraftVerionId = '';
	thirdDraftResp = '';
	thirdDraftVersionId = '';
	fourthDraftRes = '';
	fourthDraftVersionId = '';
	fifthDraftResp = '';
	fifthDraftVersionId = '';
	sixthDraftResp = '';
	sixthDraftVersionId = '';
	seventhDraftResp = '';
	seventhDraftVersionId = '';
	eigthDraftResp = '';
	eigthDraftVersionId = '';
	ninthDraftResp = '';
	ninthDraftVersionId = '';
	tenthDraftResp = '';
	tenthDraftVersionId = '';
	eleventhDraftResp = '';
	eleventhDraftVersionId = '';
	fourteenWeeksDate;
	twoMonthsDate;
	forteenWeeks;
	threeMonthsVar;
	payload;
	assessmentId;
	dateResponses = [];
	storeDate;
	responsOfDlqi = [];
	categoryname = labels.DLQI_CATEGORY;
	dlqiRollOutDate;
	rolloutDate;
	expireDate;
	urlq;
	handleResizeBound;
	visibleButton=false;

	// This function is called when the component is connected to the DOM
	renderedCallback() {
		try {
			// Find the current URL of the page
			let currentURL = window.location.href;
			// Log the user ID
			// Create a URL object from the current URL
			let urlObject = new URL(currentURL);
			// Get the pathname from the URL object
			let path = urlObject.pathname;
			// Split the pathname into components using '/' as a separator
			let pathComponents = path.split('/');
			// Find the desired component ('Branded' or 'Unassigned') in the pathname
			let desiredComponent = pathComponents.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			// Determine which URL component is currently active and assign it to 'this.urlq'
			if (desiredComponent.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_NAVI_URL;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
			}

			// Check if the current view is on desktop or not
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
		}
		catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
		}
	}

	dispatchValueChangeEvent() {
       const event = new CustomEvent('valuechange', {
            detail: { value: this.valueToSend}
        });
        this.dispatchEvent(event);
    }

	// This function is called when the component is disconnected from the DOM
	disconnectedCallback() {
		// Remove the event listener for window resize events
		window.removeEventListener('resize', this.handleResizeBound);
	}

	// This function is called when the window is resized
	handleResize() {
		// Update the 'isDesktop' property based on the current viewport width
		this.isDesktop = this.isDesktopView();
	}

	// This function determines if the current view is on a desktop device
	isDesktopView() {
		// Get the current viewport width
		let viewportWidth = window.innerWidth;

		// Adjust this threshold based on your design's breakpoints
		// Example breakpoints at 1024, 400, 576, 769, 993, and 1200 pixels
		return (
			viewportWidth >= 1024 ||
			viewportWidth <= 400 ||
			viewportWidth <= 576 ||
			viewportWidth <= 769 ||
			viewportWidth <= 993 ||
			viewportWidth <= 1200
		);
	}

	// Wire method to fetch assessment count data from the countAssessment Apex method
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				// If data is received, update component properties
				this.count = data;

				// If there are records in the response, update component properties accordingly
				if (this.count.length > 0) {
					this.stwai = this.count[0];
					this.stpss = this.count[1];
					this.stdlq = this.count[2];
					this.stqsq = this.count[3];
				}
			} else if (error) {
				// Display error message to the user
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			// Catch any errors that occur during execution and log them
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// Getter method to determine if the 'CheckDLQI' button should be disabled
	get checkdlqi() {
		return this.stdlq > 0 ? 'disabled' : '';
	}

	// Getter method to determine if the 'CheckPSS' button should be disabled
	get checkpss() {
		return this.stpss > 0 ? 'disabled' : '';
	}

	// Getter method to determine if the 'CheckWAI' button should be disabled
	get checkwai() {
		return this.stwai > 0 ? 'disabled' : '';
	}

	// Getter method to determine if the 'CheckQSQ' button should be disabled
	get checkqsq() {
		// Check if target dates are null and if QSQ count is greater than 0
		if (this.fourteenWeeksDate === null && this.twoMonthsDate === null) {
			return 'disabled';
		} else if (this.stqsq > 0) {
			return 'disabled';
		}
		return '';
	}


	// Wire method to fetch assessments based on the current user's category name.
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
	Even if there are no assessment records, we show the Questionaire page for the user to create assessment records. 
	The page will not be blank.
	*/
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


	// Wire method to fetch data for patients after three months and fourteen weeks
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_AFTER_THREE_MONTHS_AND_FOURTEEN_WEEKS)
	wiredResult({ error, data }) {
		try {
			if (data) {
				// If data is received, update component properties
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.twoMonthsDate = data.targetTwoMonthsDate ?? null;
				this.fourteenWeeksDate = data.targetFourteenWeeksDate ?? null;
			} else if (error) {
				// Log error message if there's an error fetching data
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			// Catch any errors that occur during execution and log them
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}


	// Getter method to determine the CSS class for the main popup container
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	// Getter method to determine the CSS class for the save draft popup container
	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: ' .popup-containersaveasdr hidden';
	}

	// Getter method to determine the CSS class for the secondary popup container
	get popupClass1() {
		return this.isPopupOpen1 ? 'popup2-container' : 'popup2-container hidden';
	}

	// Method to hide all modal popups
	customHideModalPopup() {
		this.isPopupOpen = false;
		this.isPopupOpen1 = false;
		this.customFormModal = false;
	}

	// Wire method to fetch draft responses of Drmatology
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(DRAFT_RESPONSE_OF_DERMATOLOGY, { questCatgryName: '$dlqi', someBooleanParam: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			if (data) {
				this.responsOfDlqi = data;
				this.draftResonsesForLaterSubmission();

				// Map draft responses to a structured format
				this.draftResponses = data.map((response) => ({
					id: response.Id,
					questionText: response.ResponseValue,
					activeVersionId: response.AssessmentQuestion ? response.AssessmentQuestion.Id : null
				}));

				// Update the totalDraftResponses property
				this.totalDraftResponses = this.draftResponses.length;

				// Determine countQuestion based on conditions
				const objectsWithResponseOrder7 = data.filter(
					(item) => item.BI_PSP_ResponseOrder__c === 7
				);

				if (objectsWithResponseOrder7.length > 0) {
					if (this.draftResponses.length > this.countQuestion ||
						objectsWithResponseOrder7[0].ResponseText === this.no) {
						this.countQuestion = 11;
					} else {
						this.countQuestion = 10;
					}
				}

				// Handle each response using a loop
				this.draftResponses.forEach((response, index) => {
					if (index === 0) {
						this.firstResponseText = response.questionText;
						this.firstResponseVersionId = response.activeVersionId;
					} else if (index === 1) {
						this.secondResponseText = response.questionText;
						this.secondResponseVersionId = response.activeVersionId;
					} else if (index === 2) {
						this.thirdResponseText = response.questionText;
						this.thirdResponseVersionId = response.activeVersionId;
					} else if (index === 3) {
						this.fourthResponseText = response.questionText;
						this.fourthResponseVersionId = response.activeVersionId;
					} else if (index === 4) {
						this.fifthResponseText = response.questionText;
						this.fifthResponseVersionId = response.activeVersionId;
					} else if (index === 5) {
						this.sixthResponseText = response.questionText;
						this.sixthResponseVersionId = response.activeVersionId;
					} else if (index === 6) {
						this.seventhResponseText = response.questionText;
						this.seventhResponseVersionId = response.activeVersionId;
					} else if (index === 7) {
						this.eighthResponseText = response.questionText;
						this.eighthResponseVersionId = response.activeVersionId;
					} else if (index === 8) {
						this.ninthResponseText = response.questionText;
						this.ninthResponseVersionId = response.activeVersionId;
					} else if (index === 9) {
						this.tenthResponseText = response.questionText;
						this.tenthResponseVersionId = response.activeVersionId;
					} else if (index === 10) {
						this.eleventhResponseText = response.questionText;
						this.eleventhResponseVersionId = response.activeVersionId;
					}
				});
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			// Catch any errors that occur during processing
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}


	//this method is for storing the draft response and its version id to class variables so that we can use these variables to save the draft response later ,also in this method we will be making the radio buttons as checked if the draft values matches with the values that are stored in to variables with their respective radio option values.
	setResponseValues(order, responseValue, assessmentQuestionId) {
		const responseValues = {
			veryMuch: this.verymuch,
			alot: this.alot,
			alittle: this.alittle,
			notAtAll: this.notatall,
			notRelevant: this.notrelevant,
			yes: this.yes,
			no: this.no
		};

		switch (order) {
			case 1:
				this.firstRadVerMuch = responseValue === responseValues.veryMuch;
				this.firstRadAlot = responseValue === responseValues.alot;
				this.firstRadALittle = responseValue === responseValues.alittle;
				this.firstRadSevere = responseValue === responseValues.notAtAll;
				this.firstDraftResp = responseValue;
				this.firstDraftVerionId = assessmentQuestionId;
				this.isFirstRespnseTrue = true;
				break;
			case 2:
				this.secondRadVerMch = responseValue === responseValues.veryMuch;
				this.secondRadAlot = responseValue === responseValues.alot;
				this.secondRadAlittle = responseValue === responseValues.alittle;
				this.secondRadNotAtAll = responseValue === responseValues.notAtAll;
				this.secondDraftResp = responseValue;
				this.secondDraftVerionId = assessmentQuestionId;
				break;
			case 3:
				this.thirdRadVerMch = responseValue === responseValues.veryMuch;
				this.thirdRadAlot = responseValue === responseValues.alot;
				this.thirdRadAlittle = responseValue === responseValues.alittle;
				this.thirdRadNotAll = responseValue === responseValues.notAtAll;
				this.thirdRadNotReelevent = responseValue === responseValues.notRelevant;
				this.thirdDraftResp = responseValue;
				this.thirdDraftVersionId = assessmentQuestionId;
				break;
			case 4:
				this.fourthRadVeryMch = responseValue === responseValues.veryMuch;
				this.fourthRadAlot = responseValue === responseValues.alot;
				this.fourthRadVAlittle = responseValue === responseValues.alittle;
				this.fourthRadNotAtll = responseValue === responseValues.notAtAll;
				this.fourthRadNotRelevetn = responseValue === responseValues.notRelevant;
				this.fourthDraftRes = responseValue;
				this.fourthDraftVersionId = assessmentQuestionId;
				break;
			case 5:
				this.fifthRadVeryMch = responseValue === responseValues.veryMuch;
				this.fifthRadAlot = responseValue === responseValues.alot;
				this.fifthRadAlittle = responseValue === responseValues.alittle;
				this.fifthRadNotAtAll = responseValue === responseValues.notAtAll;
				this.fifthRadNotRelevent = responseValue === responseValues.notRelevant;
				this.fifthDraftResp = responseValue;
				this.fifthDraftVersionId = assessmentQuestionId;
				break;
			case 6:
				this.sixthRadVeryMuch = responseValue === responseValues.veryMuch;
				this.sixthRadAlot = responseValue === responseValues.alot;
				this.sixthRadAlittle = responseValue === responseValues.alittle;
				this.sixthRadNotAtAll = responseValue === responseValues.notAtAll;
				this.sixthRadNotRelevent = responseValue === responseValues.notRelevant;
				this.sixthDraftResp = responseValue;
				this.sixthDraftVersionId = assessmentQuestionId;
				break;
			case 7:
				this.seventhRadYes = responseValue === responseValues.yes;
				this.seventhRadNo = responseValue === responseValues.no;
				this.seventhRadNotRelevnt = responseValue === responseValues.notRelevant;
				this.eigthQuestionVisible = responseValue !== responseValues.no;
				this.eigthQuestionVisible = responseValue !== responseValues.notRelevant;
				this.seventhDraftResp = responseValue;
				this.seventhDraftVersionId = assessmentQuestionId;
				break;
			case 8:
				this.eighthRadNotAtAll = responseValue === responseValues.notAtAll;
				this.eighthRadAlot = responseValue === responseValues.alot;
				this.eighthRadAlittle = responseValue === responseValues.alittle;
				this.eigthDraftResp = responseValue;
				this.eigthDraftVersionId = assessmentQuestionId;
				break;
			case 9:
				this.ninthRadverMuch = responseValue === responseValues.veryMuch;
				this.ninthRadAlot = responseValue === responseValues.alot;
				this.ninthRadAlittle = responseValue === responseValues.alittle;
				this.ninthRadNotAtAll = responseValue === responseValues.notAtAll;
				this.ninthRadNotRelevent = responseValue === responseValues.notRelevant;
				this.ninthDraftResp = responseValue;
				this.ninthDraftVersionId = assessmentQuestionId;
				break;
			case 10:
				this.tenthRadverMuch = responseValue === responseValues.veryMuch;
				this.tenthRadAlot = responseValue === responseValues.alot;
				this.tenthRadAlittle = responseValue === responseValues.alittle;
				this.tenthRadNotAtAll = responseValue === responseValues.notAtAll;
				this.tenthRadNotRelevent = responseValue === responseValues.notRelevant;
				this.tenthDraftResp = responseValue;
				this.tenthDraftVersionId = assessmentQuestionId;
				break;
			case 11:
				this.eleventhRadverMuch = responseValue === responseValues.veryMuch;
				this.eleventhRadAlot = responseValue === responseValues.alot;
				this.eleventhRadAlittle = responseValue === responseValues.alittle;
				this.eleventhRadNotAtAll = responseValue === responseValues.notAtAll;
				this.eleventhRadNotRelevent = responseValue === responseValues.notRelevant;
				this.eleventhDraftResp = responseValue;
				this.eleventhDraftVersionId = assessmentQuestionId;
				break;
			default:
				break;
		}
	}

	draftResonsesForLaterSubmission() {
		this.responsOfDlqi.forEach((record) => {
			if (record.AssessmentQuestionId) {
				this.setResponseValues(record.BI_PSP_ResponseOrder__c, record.ResponseValue, record.AssessmentQuestionId);
			}
		});
	}
	// Wire method to fetch assessment questions from dermatology
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESMENT_QUE_FROM_DLQI, { questionnaireName: '$dlqi' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (data) {
				//we are calling this draft  method that we did for stioring the draft responses and question version ids.Also for making the radio buttons as checked.
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText,
					activeVersionId: question.ActiveVersion
						? question.ActiveVersion.Id
						: null
				}));

				//here we will be storing the Questions to respective varaibles.
				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];
				let fifthQuestion = this.questionData[4];
				let sixthQuestion = this.questionData[5];
				let seventhQuestion = this.questionData[6];
				let eighthQuestion = this.questionData[7];
				let ninthQuestion = this.questionData[8];
				let tenthQuestion = this.questionData[9];
				let eleventhQuestion = this.questionData[10];

				this.firstQuestionText = firstQuestion.questionText;

				this.firstQuestionVersinId = firstQuestion.activeVersionId;

				this.secondQuestionText = secondQuestion.questionText;

				this.secondQuestionVersinId = secondQuestion.activeVersionId;

				this.thirdQuestionText = thirdQuestion.questionText;

				this.thirdQuestionVersinId = thirdQuestion.activeVersionId;

				this.fourthQuestionText = fourthQuestion.questionText;

				this.fourthQuestionVersinId = fourthQuestion.activeVersionId;

				this.fifthQuestionText = fifthQuestion.questionText;

				this.fifthQuestionVersinId = fifthQuestion.activeVersionId;

				this.sixthQuestionText = sixthQuestion.questionText;

				this.sixthQuestionVersinId = sixthQuestion.activeVersionId;

				this.seventhQuestionText = seventhQuestion.questionText;

				this.seventhQuestionVersinId = seventhQuestion.activeVersionId;

				this.eightQuestionText = eighthQuestion.questionText;

				this.eightQuestionVersinId = eighthQuestion.activeVersionId;

				this.ninthQuestionText = ninthQuestion.questionText;

				this.ninthQuestionVersinId = ninthQuestion.activeVersionId;

				this.tenthQuestionText = tenthQuestion.questionText;

				this.tenthQuestionVersinId = tenthQuestion.activeVersionId;

				this.eleventhQuestionText = eleventhQuestion.questionText;

				this.eleventhQuestionVerionID = eleventhQuestion.activeVersionId;
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
			this.dispatchValueChangeEvent();
		} catch (err) {
			// Catch any errors that occur during processing
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//this is a handler that we use to handle the responses of the First Question user input.
	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let chekVal = event.target.value;
		if (chekVal === this.verymuch) {
			this.firstRadVerMuch = true;
		} else {
			this.firstRadVerMuch = false;
		}

		if (chekVal === this.alot) {
			this.firstRadAlot = true;
		} else {
			this.firstRadAlot = false;
		}

		if (chekVal === this.alittle) {
			this.firstRadALittle = true;
		} else {
			this.firstRadALittle = false;
		}

		if (chekVal === this.notatall) {
			this.firstRadSevere = true;
		} else {
			this.firstRadSevere = false;
		}

		if (this.nameOfQuestion === 'firstQuestionResponse') {
			this.firstQuestionResponse = event.target.value;
			this.nameToDraftFirst = event.target.name;

			if (this.firstQuestionResponse !== '') {
				this.arrayForPushResp.push(this.firstQuestionResponse);
				this.arrayForPushId.push(this.firstQuestionVersinId);
			}
			// Get the last values separately
			this.firstRspValue = this.getLastRespValue();
			this.firstRespVersId = this.getLastIdValue();
		}
	}


	navigateToCategory3() {
		// Navigate to Category pss questionnaire
		window.location.assign(this.urlq + labels.PSS_QUESTIONNAIRE_URL);
	}

	navigateToCategory4() {
		// Navigate to Category wapi questionnaire
		window.location.assign(this.urlq + labels.WPAI_QUESTIONAIRE);
	}

	navigateToCategory5() {
		// Check if fourteenWeeksDate is not null
		if (this.fourteenWeeksDate !== null) {
			// Navigate to Category qsq 2 questionnaire - Page 2
			window.location.assign(this.urlq + labels.QUALITATIVE_FOURTEENWEEKS); // Navigate to page 2
		} else {
			// Navigate to Category qsq 1 questionnaire - Page 1
			window.location.assign(this.urlq + labels.QUALITATIVE_TWO_MONTHS); // Navigate to page 1
		}
	}

	//this is a handler that we use to handle the responses of the Second Question user input.
	handleSecondQuestionChange(event) {
		// Get the name of the question from the event target
		this.nameOfQuestion = event.target.name;

		// Get the value of the selected option
		let chekVal = event.target.value;
		// Set boolean flags based on the selected option
		if (chekVal === this.verymuch) {
			this.secondRadVerMch = true;
		} else {
			this.secondRadVerMch = false;
		}

		if (chekVal === this.alot) {
			this.secondRadAlot = true;
		} else {
			this.secondRadAlot = false;
		}

		if (chekVal === this.alittle) {
			this.secondRadAlittle = true;
		} else {
			this.secondRadAlittle = false;
		}

		if (chekVal === this.notatall) {
			this.secondRadNotAtAll = true;
		} else {
			this.secondRadNotAtAll = false;
		}
		// Update the response value if the question name matches
		if (this.nameOfQuestion === 'secondQuestionResponse') {
			this.secondQuestionResponse = event.target.value;
			this.nameToDraftSecond = event.target.name;

			// Push the response and its corresponding version ID to arrays
			if (this.secondQuestionResponse !== '') {
				this.arrayForPushResp.push(this.secondQuestionResponse);
				this.arrayForPushId.push(this.secondQuestionVersinId);
			}
			// Get the last values separately
			this.secondRspValue = this.getLastRespValue();
			this.secondRespVersId = this.getLastIdValue();
		}
	}

	//this is a handler that we use to handle the responses of the third Question user input.
	handleThirdQuestionChange(event) {
		// Get the name of the question from the event target
		this.nameOfQuestion = event.target.name;

		// Get the value of the selected option
		let chekVal = event.target.value;
		if (chekVal === this.verymuch) {
			this.thirdRadVerMch = true;
		} else {
			this.thirdRadVerMch = false;
		}

		if (chekVal === this.alot) {
			this.thirdRadAlot = true;
		} else {
			this.thirdRadAlot = false;
		}

		if (chekVal === this.alittle) {
			this.thirdRadAlittle = true;
		} else {
			this.thirdRadAlittle = false;
		}

		if (chekVal === this.notatall) {
			this.thirdRadNotAll = true;
		} else {
			this.thirdRadNotAll = false;
		}

		if (chekVal === this.notrelevant) {
			this.thirdRadNotReelevent = true;
		} else {
			this.thirdRadNotReelevent = false;
		}
		// Update the response value if the question name matches
		if (this.nameOfQuestion === 'thirdQuestionResponse') {
			this.thirdQuestionResponse = event.target.value;
			this.nameToDraftThird = event.target.name;

			// Push the response and its corresponding version ID to arrays
			if (this.thirdQuestionResponse !== '') {
				this.arrayForPushResp.push(this.thirdQuestionResponse);
				this.arrayForPushId.push(this.thirdQuestionVersinId);
			}
			// Get the last values separately
			this.thirdRspValue = this.getLastRespValue();
			this.thirdVersionId = this.getLastIdValue();
		}
	}
	//this is a handler that we use to handle the responses of the Fourth Question user input.
	handleFourthQuestionChange(event) {
		// Get the name of the question from the event target
		this.nameOfQuestion = event.target.name;
		// Get the value of the selected option
		let chekVal = event.target.value;
		if (chekVal === this.verymuch) {
			this.fourthRadVeryMch = true;
		} else {
			this.fourthRadVeryMch = false;
		}

		if (chekVal === this.alot) {
			this.fourthRadAlot = true;
		} else {
			this.fourthRadAlot = false;
		}

		if (chekVal === this.alittle) {
			this.fourthRadVAlittle = true;
		} else {
			this.fourthRadVAlittle = false;
		}

		if (chekVal === this.notatall) {
			this.fourthRadNotAtll = true;
		} else {
			this.fourthRadNotAtll = false;
		}

		if (chekVal === this.notrelevant) {
			this.fourthRadNotRelevetn = true;
		} else {
			this.fourthRadNotRelevetn = false;
		}
		// Update the response value if the question name matches
		if (this.nameOfQuestion === 'fourthQuestionResponse') {
			this.fourthQuestionResponse = event.target.value;
			this.nameToDraftFourth = event.target.name;

			// Push the response and its corresponding version ID to arrays
			if (this.fourthQuestionResponse !== '') {
				this.arrayForPushResp.push(this.fourthQuestionResponse);
				this.arrayForPushId.push(this.fourthQuestionVersinId);
			}
			// Store the last response values to another varaible so that we can use it for draft submission and Confirm Submission.
			this.fourthRspValue = this.getLastRespValue();
			this.fourthVersionId = this.getLastIdValue();
		}
	}


	//this is a handler that we use to handle the responses of the Fifth Question user input.
	handleFifthQuestionChange(event) {
		// Get the name of the question from the event target
		this.nameOfQuestion = event.target.name;
		// Get the value of the selected option
		let chekVal = event.target.value;
		if (chekVal === this.verymuch) {
			this.fifthRadVeryMch = true;
		} else {
			this.fifthRadVeryMch = false;
		}

		if (chekVal === this.alot) {
			this.fifthRadAlot = true;
		} else {
			this.fifthRadAlot = false;
		}

		if (chekVal === this.alittle) {
			this.fifthRadAlittle = true;
		} else {
			this.fifthRadAlittle = false;
		}

		if (chekVal === this.notatall) {
			this.fifthRadNotAtAll = true;
		} else {
			this.fifthRadNotAtAll = false;
		}
		if (chekVal === this.notrelevant) {
			this.fifthRadNotRelevent = true;
		} else {
			this.fifthRadNotRelevent = false;
		}

		// Update the response value if the question name matches
		if (this.nameOfQuestion === 'fifthQuestionResponse') {
			this.fifthQuestionresponse = event.target.value;
			this.nameToDraftFifth = event.target.name;
			// Push the response and its corresponding version ID to arrays
			if (this.fifthQuestionresponse !== '') {
				this.arrayForPushResp.push(this.fifthQuestionresponse);
				this.arrayForPushId.push(this.fifthQuestionVersinId);
			}
			// Get the last values separately
			this.fifthResonseValue = this.getLastRespValue();
			this.fifthVersionId = this.getLastIdValue();
		}
	}

	//this is a handler that we use to handle the responses of the Sixth Question user input.
	handleSixthQuestionChange(event) {
		// Get the name of the question from the event target
		this.nameOfQuestion = event.target.name;
		// Get the value of the selected option
		let chekVal = event.target.value;
		if (chekVal === this.verymuch) {
			this.sixthRadVeryMuch = true;
		} else {
			this.sixthRadVeryMuch = false;
		}

		if (chekVal === this.alot) {
			this.sixthRadAlot = true;
		} else {
			this.sixthRadAlot = false;
		}

		if (chekVal === this.alittle) {
			this.sixthRadAlittle = true;
		} else {
			this.sixthRadAlittle = false;
		}

		if (chekVal === this.notatall) {
			this.sixthRadNotAtAll = true;
		} else {
			this.sixthRadNotAtAll = false;
		}
		if (chekVal === this.notrelevant) {
			this.sixthRadNotRelevent = true;
		} else {
			this.sixthRadNotRelevent = false;
		}

		// Update the response value if the question name matches
		if (this.nameOfQuestion === 'sixthQuestionResponse') {
			this.sixthQuestionResponse = event.target.value;
			this.nameToDraftSixth = event.target.name;
			// Push the response and its corresponding version ID to arrays
			if (this.sixthQuestionResponse !== '') {
				this.arrayForPushResp.push(this.sixthQuestionResponse);
				this.arrayForPushId.push(this.sixthQuestionVersinId);
			}
			// Get the last values separately
			this.sixthResponseValue = this.getLastRespValue();
			this.sixthVersiD = this.getLastIdValue();
		}
	}
	//delete response based on Selecting no as the option
	deletionOfResponseOnNo() {
		// Reset values when response is 'No'
		this.eightQuestionResponse = '';
		this.eghtResponseValue = '';
		this.eightVersiId = '';
		this.eigthDraftResp = '';
		this.eigthDraftVersionId = '';
	}
	//this is a handler that we use to handle the responses of the seventh Question user input.
	handleSevethQuestionChange(event) {
		// Check if the checkbox is checked
		if (event.target.checked) {
			let val = event.target.value;

			// Handle different values of the checkbox
			if (val === this.yes) {
				this.seventhRadYes = true;
				this.seventhRadNo = false;
				this.seventhRadNotRelevnt = false;
				this.countQuestion = 10;
				this.payload = { countvalue: this.countQuestion };
				this.deletionOfResponseOnNo(); // Reset values when 'No' is selected
				this.eighthRadAlot = false;
				this.eighthRadAlittle = false;
				this.eighthRadNotAtall = false;
				this.countQuestion = 11;
			} else if (val === this.no) {
				this.seventhRadYes = false;
				this.seventhRadNo = true;
				this.seventhRadNotRelevnt = false;
			} else if (val === this.notrelevant) {
				this.seventhRadYes = false;
				this.seventhRadNo = false;
				this.seventhRadNotRelevnt = true;
				this.eighthRadAlot = false;
				this.eighthRadAlittle = false;
				this.eighthRadNotAtall = false;
			}
		}

		// Set visibility of eighth question based on the response
		this.eigthQuestionVisible = event.target.value === this.yes;

		this.nameOfQuestion = event.target.name;

		// Update response and IDs for seventh question
		if (this.nameOfQuestion === 'seventhQuestionResponse') {
			this.seventhQuestionResponse = event.target.value;
			this.nameToDraftSeventh = event.target.name;

			if (this.seventhQuestionResponse !== '') {
				this.arrayForPushResp.push(this.seventhQuestionResponse);
				this.arrayForPushId.push(this.seventhQuestionVersinId);
			}

			// Get the last values separately
			this.seventhRespalue = this.getLastRespValue();
			this.seventhVersiD = this.getLastIdValue();
		}
	}

	//this is a handler that we use to handle the responses of the Eigth Question user input.
	handleEighthQuestionChange(event) {
		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Get the value of the selected option
		let checkVal = event.target.value;
		// Set boolean flags based on the selected option
		if (checkVal === this.alot) {
			this.eighthRadAlot = true;
		} else {
			this.eighthRadAlot = false;
		}

		if (checkVal === this.alittle) {
			this.eighthRadAlittle = true;
		} else {
			this.eighthRadAlittle = false;
		}

		if (checkVal === this.notatall) {
			this.eighthRadNotAtall = true;
		} else {
			this.eighthRadNotAtall = false;
		}

		// Update response and IDs for eighth question
		if (this.nameOfQuestion === 'eigthQuestionResponse') {
			// Set the response value and name for draft
			this.eightQuestionResponse = event.target.value;
			this.nameToDraftEighth = event.target.name;

			// Push response value and version ID to arrays if response is not empty
			if (this.eightQuestionResponse !== '') {
				this.arrayForPushResp.push(this.eightQuestionResponse);
				this.arrayForPushId.push(this.eightQuestionVersinId);
			}

			// Get the last values separately
			this.eghtResponseValue = this.getLastRespValue();
			this.eightVersiId = this.getLastIdValue();
		}
	}

	//this is a handler that we use to handle the responses of the Ninth Question user input.
	handleninthQuestionChange(event) {
		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Get the value of the selected option
		let checkVal = event.target.value;

		// Set boolean flags based on the selected option
		if (checkVal === this.verymuch) {
			this.ninthRadverMuch = true;
		} else {
			this.ninthRadverMuch = false;
		}

		if (checkVal === this.alot) {
			this.ninthRadAlot = true;
		} else {
			this.ninthRadAlot = false;
		}

		if (checkVal === this.alittle) {
			this.ninthRadAlittle = true;
		} else {
			this.ninthRadAlittle = false;
		}

		if (checkVal === this.notatall) {
			this.ninthRadNotAtAll = true;
		} else {
			this.ninthRadNotAtAll = false;
		}

		if (checkVal === this.notrelevant) {
			this.ninthRadNotRelevent = true;
		} else {
			this.ninthRadNotRelevent = false;
		}

		// Update response and IDs for ninth question
		if (this.nameOfQuestion === 'ninthQuestionResponse') {
			// Set the response value and name for draft
			this.ninthQuestionResponse = event.target.value;
			this.nameToDraftNinth = event.target.name;

			// Push response value and version ID to arrays if response is not empty
			if (this.ninthQuestionResponse !== '') {
				this.arrayForPushResp.push(this.ninthQuestionResponse);
				this.arrayForPushId.push(this.ninthQuestionVersinId);
			}

			// Get the last values separately
			this.ninthResponseValue = this.getLastRespValue();
			this.ninthVersId = this.getLastIdValue();
		}
	}

	//this is a handler that we use to handle the responses of the Tenth Question user input.
	handleTenthQuestionChange(event) {
		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Get the value of the selected option
		let checkVal = event.target.value;

		// Set boolean flags based on the selected option
		if (checkVal === this.verymuch) {
			this.tenthRadverMuch = true;
		} else {
			this.tenthRadverMuch = false;
		}

		if (checkVal === this.alot) {
			this.tenthRadAlot = true;
		} else {
			this.tenthRadAlot = false;
		}

		if (checkVal === this.alittle) {
			this.tenthRadAlittle = true;
		} else {
			this.tenthRadAlittle = false;
		}

		if (checkVal === this.notatall) {
			this.tenthRadNotAtAll = true;
		} else {
			this.tenthRadNotAtAll = false;
		}

		if (checkVal === this.notrelevant) {
			this.tenthRadNotRelevent = true;
		} else {
			this.tenthRadNotRelevent = false;
		}

		// Update response and IDs for tenth question
		if (this.nameOfQuestion === 'tenthQuestionResponse') {
			// Set the response value and name for draft
			this.tenthQuestionResponse = event.target.value;
			this.nameToDrafttenth = event.target.name;

			// Check if the draft name is not null, set isTenthRespnseTrue flag to true
			if (this.nameToDrafttenth !== null) {
				this.isTenthRespnseTrue = true;
			}

			// Push response value and version ID to arrays if response is not empty
			if (this.tenthQuestionResponse !== '') {
				this.arrayForPushResp.push(this.tenthQuestionResponse);
				this.arrayForPushId.push(this.tenthQuestionVersinId);
			}

			// Get the last values separately
			this.tenthResponseValue = this.getLastRespValue();
			this.tenthVersId = this.getLastIdValue();
		}
	}

	//this is a handler that we use to handle the responses of the eleventh Question user input.
	handleEleventhQuestionChange(event) {
		// Get the name of the question from the event
		this.nameOfQuestion = event.target.name;

		// Get the value of the selected option
		let checkVal = event.target.value;

		// Set boolean flags based on the selected option
		if (checkVal === this.verymuch) {
			this.eleventhRadverMuch = true;
		} else {
			this.eleventhRadverMuch = false;
		}

		if (checkVal === this.alot) {
			this.eleventhRadAlot = true;
		} else {
			this.eleventhRadAlot = false;
		}

		if (checkVal === this.alittle) {
			this.eleventhRadAlittle = true;
		} else {
			this.eleventhRadAlittle = false;
		}

		if (checkVal === this.notatall) {
			this.eleventhRadNotAtAll = true;
		} else {
			this.eleventhRadNotAtAll = false;
		}

		if (checkVal === this.notrelevant) {
			this.eleventhRadNotRelevent = true;
		} else {
			this.eleventhRadNotRelevent = false;
		}

		// Update response and IDs for eleventh question
		if (this.nameOfQuestion === 'eleventhQuestionResponse') {
			// Set the response value and name for draft
			this.eleventhQuestionResponse = event.target.value;
			this.nameToDraftEleventh = event.target.name;

			// Push response value and version ID to arrays if response is not empty
			if (this.eleventhQuestionResponse !== '') {
				this.arrayForPushResp.push(this.eleventhQuestionResponse);
				this.arrayForPushId.push(this.eleventhQuestionVerionID);
			}

			// Get the last values separately
			this.eleventhResponseValue = this.getLastRespValue();
			this.eleventhVersId = this.getLastIdValue();
		}
	}

	// Function to get the last response value from the array
	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	// Function to get the last version ID from the array
	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	popupvar = '';

	// Helper function to set radio button values based on responses
	setRadioButtons(questionResponse, responsePrefix) {
		switch (questionResponse) {
			case this.verymuch:
				this[`${responsePrefix}RadVerMuch`] = true;
				break;
			case this.alot:
				this[`${responsePrefix}RadAlot`] = true;
				break;
			case this.alittle:
				this[`${responsePrefix}RadALittle`] = true;
				break;
			case this.notatall:
				this[`${responsePrefix}RadNotAtAll`] = true;
				break;
			case this.notrelevant:
				this[`${responsePrefix}RadNotRelevent`] = true;
				break;
			case this.yes:
				this[`${responsePrefix}RadYes`] = true;
				break;
			case this.no:
				this[`${responsePrefix}RadNo`] = true;
				break;
			case 'Severe':
				this[`${responsePrefix}RadSevere`] = true;
				break;
			default:
				// Handle unknown responses if necessary
				break;
		}
	}

	// Method to handle the close popup action
	closePopup() {
		this.isConfirmationDialogOpen = false;
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.isPopupOpen1 = false;

		if (!this.isPopupOpen) {
			this.popupvar = this.yes;
		}
		this.popupmenu = false;

		// Set radio button values for all questions
		this.setButtonValues();
	}

	// Method to handle the close popup action for saving as draft
	closePopup1() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpen1 = false;
		this.popupmenu = false;

		// Set radio button values for all questions
		this.setButtonValues();

	}
	setButtonValues() {
		this.setRadioButtons(this.firstQuestionResponse, 'first');
		this.setRadioButtons(this.secondQuestionResponse, 'second');
		this.setRadioButtons(this.thirdQuestionResponse, 'third');
		this.setRadioButtons(this.fourthQuestionResponse, 'fourth');
		this.setRadioButtons(this.fifthQuestionresponse, 'fifth');
		this.setRadioButtons(this.sixthQuestionResponse, 'sixth');
		this.setRadioButtons(this.seventhQuestionResponse, 'seventh');
		this.setRadioButtons(this.eightQuestionResponse, 'eight');
		this.setRadioButtons(this.ninthQuestionResponse, 'ninth');
		this.setRadioButtons(this.tenthQuestionResponse, 'tenth');
		this.setRadioButtons(this.eleventhQuestionResponse, 'eleventh');
	}
	//when you hit the submit button this method will get invoked and check if all the  questions has been submitted by the user or not if he has submitted then we will show him the confirm popup message if it is not then we will show a return back popup message.
	// Utility function to adjust body overflow style based on the view mode
	adjustBodyOverflow() {
		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = ''; // Reset to default
		}
	}

	// Utility function to set draft names based on draft responses
	setDraftNames() {
		const draftNames = [
			{ draftResp: this.firstDraftResp, nameToDraft: 'nameone', nameVar: 'nameToDraftFirst' },
			{ draftResp: this.secondDraftResp, nameToDraft: 'nametwo', nameVar: 'nameToDraftSecond' },
			{ draftResp: this.thirdDraftResp, nameToDraft: 'namethree', nameVar: 'nameToDraftThird' },
			{ draftResp: this.fourthDraftRes, nameToDraft: 'namefour', nameVar: 'nameToDraftFourth' },
			{ draftResp: this.fifthDraftResp, nameToDraft: 'namefive', nameVar: 'nameToDraftFifth' },
			{ draftResp: this.sixthDraftResp, nameToDraft: 'namesix', nameVar: 'nameToDraftSixth' },
			{ draftResp: this.seventhDraftResp, nameToDraft: 'nameseven', nameVar: 'nameToDraftSeventh' },
			{ draftResp: this.eigthDraftResp, nameToDraft: 'nameeigth', nameVar: 'nameToDraftEighth' },
			{ draftResp: this.ninthDraftResp, nameToDraft: 'nameninth', nameVar: 'nameToDraftNinth' },
			{ draftResp: this.tenthDraftResp, nameToDraft: 'nametenth', nameVar: 'nameToDrafttenth' },
			{ draftResp: this.eleventhDraftResp, nameToDraft: 'nameeleventh', nameVar: 'nameToDraftEleventh' }
		];

		draftNames.forEach(draft => {
			if (typeof draft.draftResp !== 'undefined') {
				this[draft.nameVar] = draft.nameToDraft;
			}
		});
	}

	// Utility function to check if all draft names are set
	allDraftNamesSet(includeEighth) {
		const draftNames = [
			this.nameToDraftFirst,
			this.nameToDraftSecond,
			this.nameToDraftThird,
			this.nameToDraftFourth,
			this.nameToDraftFifth,
			this.nameToDraftSixth,
			this.nameToDraftSeventh,
			this.nameToDraftNinth,
			this.nameToDrafttenth,
			this.nameToDraftEleventh
		];

		if (includeEighth) {
			draftNames.push(this.nameToDraftEighth);
		}

		return draftNames.every(name => typeof name !== 'undefined');
	}

	// Utility function to handle eigth question visibility
	handleEigthQuestionVisible() {
		if (this.seventhRespalue === this.no || this.seventhDraftResp === this.no) {
			if (this.eghtResponseValue !== '') {
				this.isPopupOpen = true;
				this.isPopupOpen1 = false;
				this.checkYesOrNo = true;
			} else {
				this.customFormModal = true;
				if (this.eigthDraftResp === '') {
					this.isPopupOpen1 = true;
					this.isPopupOpen = false;
				} else {
					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
				}
				this.checkYesOrNo = false;
			}
		} else {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		}
	}

	// Utility function to handle eigth question not visible
	handleEigthQuestionNotVisible() {
		if (
			this.seventhRespalue === this.yes ||
			this.seventhDraftResp === this.yes ||
			this.seventhRespalue === this.notrelevant ||
			this.seventhDraftResp === this.notrelevant
		) {
			this.isPopupOpen = true;
			this.isPopupOpen1 = false;
		} else {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
		}
	}

	// submitResponses method
	submitResponses() {
		this.adjustBodyOverflow();
		this.popupmenu = true;
		this.setDraftNames();

		const allInputs = this.template.querySelectorAll('input[type="radio"]:checked');
		const seventhQuestionChecked = this.template.querySelector('input[name="seventhQuestionResponse"]:checked');
		const eighthQuestionRadios = this.template.querySelectorAll('input[name="eigthQuestionResponse"]');

		let isEighthQuestionChecked = false;
		if (eighthQuestionRadios.length > 0) {
			isEighthQuestionChecked = Array.from(eighthQuestionRadios).some(radio => radio.checked);
		}

		if (allInputs.length < 10) {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
		}
		else if (allInputs.length === 10 && seventhQuestionChecked.value !== this.yes) {
			this.customFormModal = false;
			this.isPopupOpen1 = false;
			this.isPopupOpen = true;

		}
		else if (allInputs.length === 10 && seventhQuestionChecked.value === this.yes && isEighthQuestionChecked === false) {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
		}
		else if (allInputs.length === 10 && seventhQuestionChecked.value === this.yes && isEighthQuestionChecked === true) {
			this.isPopupOpen1 = false;
			this.customFormModal = false;
			this.isPopupOpen = true;
		}
		else if (allInputs.length === 11) {
			this.isPopupOpen = true;
			this.customFormModal = false;
			this.isPopupOpen1 = false;
			
		}

	}

	// If popupmenu is true, return 'disabled'; otherwise, return an empty string
	get popuphide() {
		if (this.popupmenu === true) {
			return this.popupmenu === true ? 'disabled' : '';
		}
		return '';
	}
	//this method will get invoked when you click the save as draft button
	// Method to process responses and version IDs using an object
	processResponses(responses) {
		responses.forEach(({ responseValue, draftResponse, versionId, draftVersionId }) => {
			this.realrespArray.push(responseValue !== '' ? responseValue : draftResponse);
			this.realAssesVerArra.push(versionId !== '' ? versionId : draftVersionId);
		});
	}

	saveAsDraft() {
		this.toggleBodyOverflow(this.isDesktop);
		this.popupmenu = true;

		const responses = this.getResponseData();
		this.processResponseData(responses);
		const nonEmptyResponses = this.getNonEmptyItems(this.realrespArray);
		const nonEmptyIds = this.getNonEmptyItems(this.realAssesVerArra);
		const isDraft = false;

		if (nonEmptyResponses.length > 0) {
			this.submitDraft(nonEmptyIds, nonEmptyResponses, isDraft);
		} else {
			this.redirectToOutstandingPage();
		}
	}

	confirmSubmission() {
		this.redirectToOutstandingPage();

		const responses = this.getResponseData();
		this.processResponseData(responses);

		const nonEmptyResponses = this.getNonEmptyItems(this.realrespArray);
		const nonEmptyIds = this.getNonEmptyItems(this.realAssesVerArra);

		if (this.isValidResponseCount(nonEmptyResponses.length)) {
			this.submitConfirmedResponses(nonEmptyIds, nonEmptyResponses);
		}
	}

	// Helper method to toggle body overflow based on device type
	toggleBodyOverflow(isDesktop) {
		document.body.style.overflow = isDesktop ? 'hidden' : '';
	}

	// Helper method to get response data
	getResponseData() {
		return [
			{ responseValue: this.firstRspValue, draftResponse: this.firstDraftResp, versionId: this.firstRespVersId, draftVersionId: this.firstDraftVerionId },
			{ responseValue: this.secondRspValue, draftResponse: this.secondDraftResp, versionId: this.secondRespVersId, draftVersionId: this.secondDraftVerionId },
			{ responseValue: this.thirdRspValue, draftResponse: this.thirdDraftResp, versionId: this.thirdVersionId, draftVersionId: this.thirdDraftVersionId },
			{ responseValue: this.fourthRspValue, draftResponse: this.fourthDraftRes, versionId: this.fourthVersionId, draftVersionId: this.fourthDraftVersionId },
			{ responseValue: this.fifthResonseValue, draftResponse: this.fifthDraftResp, versionId: this.fifthVersionId, draftVersionId: this.fifthDraftVersionId },
			{ responseValue: this.sixthResponseValue, draftResponse: this.sixthDraftResp, versionId: this.sixthVersiD, draftVersionId: this.sixthDraftVersionId },
			{ responseValue: this.seventhRespalue, draftResponse: this.seventhDraftResp, versionId: this.seventhVersiD, draftVersionId: this.seventhDraftVersionId },
			{ responseValue: this.eghtResponseValue, draftResponse: this.eigthDraftResp, versionId: this.eightVersiId, draftVersionId: this.eigthDraftVersionId },
			{ responseValue: this.ninthResponseValue, draftResponse: this.ninthDraftResp, versionId: this.ninthVersId, draftVersionId: this.ninthDraftVersionId },
			{ responseValue: this.tenthResponseValue, draftResponse: this.tenthDraftResp, versionId: this.tenthVersId, draftVersionId: this.tenthDraftVersionId },
			{ responseValue: this.eleventhResponseValue, draftResponse: this.eleventhDraftResp, versionId: this.eleventhVersId, draftVersionId: this.eleventhDraftVersionId }
		];
	}

	// Helper method to process responses and version IDs
	processResponseData(responses) {
		this.realrespArray = [];
		this.realAssesVerArra = [];
		responses.forEach(({ responseValue, draftResponse, versionId, draftVersionId }) => {
			this.realrespArray.push(responseValue !== '' ? responseValue : draftResponse);
			this.realAssesVerArra.push(versionId !== '' ? versionId : draftVersionId);
		});
	}

	// Helper method to get non-empty items from an array
	getNonEmptyItems(array) {
		return array.filter(item => item !== '');
	}

	// Helper method to check if the number of responses is valid
	isValidResponseCount(count) {
		return count === 10 || count === 11;
	}

	// Helper method to submit draft responses
	submitDraft(nonEmptyIds, nonEmptyResponses, isDraft) {
		SUBMIT_DRAFT_DERMATOLOGY({
			darftQuestionIds: nonEmptyIds,
			draftResponseTexts: nonEmptyResponses,
			isItDraftOrSubmit: isDraft,
			isQsqAfterTwoMonths: false
		})
			.then(() => {
				this.customFormModal = false;
				this.closePopup1 = false;
				this.checkYesOrNo = false;
				this.popUpMetod();
			})
			.catch(error => {
				this.showToast(error.body.message, labels.ERROR_VARIANT);
			});
	}

	// Helper method to submit confirmed responses
	submitConfirmedResponses(nonEmptyIds, nonEmptyResponses) {
		const isSubmit = true;
		SUBMIT_DRAFT_DERMATOLOGY({
			darftQuestionIds: nonEmptyIds,
			draftResponseTexts: nonEmptyResponses,
			isItDraftOrSubmit: isSubmit,
			isQsqAfterTwoMonths: false
		})
			.then(() => {
				this.redirectToOutstandingPage();
			})
			.catch(error => {
				this.showToast(error.body.message, labels.ERROR_VARIANT);
			});
	}

	// Helper method to redirect to the outstanding page
	redirectToOutstandingPage() {
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}

	//this method is for the custom pop up message when clicked on the save as draft button.
	//custom pop up method as per requirement it should be deplay for certain ms 
	popUpMetod() {
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
	}
	//this method will close the save as drfat custom pop up
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}
	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq + labels.ERROR_PAGE);
	}
}