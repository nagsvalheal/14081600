//This Lightning Web Component allows users to input responses for qualitative questionnaire questions, enhancing the collection of subjective feedback and opinions.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
//To import Apex Classes
import GET_ASSESSMENT_QUESTIONS from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import DRAFT_RESPONSE_SUBMISSION from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_PSORIASIS from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QSQ_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To get Current UserId
import Id from '@salesforce/user/Id';
//To import Custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire';
export default class BiPspbQsqAfterFourteenWeeks extends LightningElement {
	//Track variable Declarations(re-render variables)
	@track realAssesVerArra = [];
	@track realRespArray = [];
	@track arrayForPushResp = [];
	@track arrayForPushId = [];
	@track responsOfDLQI = [];
	@track selectedValues = {};
	isBarRadioChecked = false;
	isNoneChecked = false;
	isMildChecked = false;
	isModerateChecked = false;
	isSevereChecked = false;
	isBarVerySeverChecked = false;
	//the draft number
	totalDraftResponses;
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
	fifthQuestionText;
	fifthQuestionVersinId;
	sixthQuestionText;
	sixthQuestionVersinId;
	seventhQuestionText;
	seventhQuestionVersinId;
	eightQuestionText;
	eightQuestionVersinId;
	firstQuestionResponse = '';
	secondQuestionResponse = '';
	thirdQuestionResponse = '';
	fourthQuestionResponse = '';
	fifthQuestionresponse = '';
	sixthQuestionResponse = '';
	seventhQuestionResponse = '';
	eightQuestionResponse = '';
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
	nameToDraftFirst = '';
	nameToDraftSecond = '';
	nameToDraftThird = '';
	nameToDraftFourth = '';
	nameToDraftFifth = '';
	sliderValuesec = 0;
	nameToDraftSixth = '';
	nameToDraftSeventh = '';
	nameToDraftEighth = '';
	firstResponseText;
	firstResponseVersinId;
	secondResponseText;
	secondResponseVersinId;
	thirdResponseText;
	thirdResponseVersinId;
	fourthResponseText;
	fourthResponseVersinId;
	fifthResponseText;
	fifthResponseVersinId;
	sixthResponseText;
	sixthResponseVersinId;
	seventhResponseText;
	seventhResponseVersinId;
	eighthResponseText;
	eighthResponseVersinId;
	isConfirmationDialogOpen = false;
	customFormModal = false;
	message = labels.COMPLETED_ALL;
	submitLabel = labels.SUBMIT_LABEL;
	isPopupOpen = false;
	saveAsDraftPopUp = false;
	sliderValue = 0;
	sliderValueThree = 0;
	isDraftSavedPopupOpen = false;
	draftSavedMessage = labels.POPUP_MESSAGE;
	//Global variables(without @track does not trigger automatic re-renders)
	twoMonthsTrueFalse = false;
	firstDraftResp;
	firstDraftVerionId;
	questionData = [];
	urlq;
	userid = Id;
	secondDraftResp;
	secondDraftVerionId;
	CheckBoxChecked;
	thirdDraftResp;
	thirdDraftVersionId;
	fourthDraftRes;
	fourthDraftVersionId;
	fifthDraftResp = '';
	fifthDraftVersionId;
	sixthDraftResp;
	sixthDraftVersionId;
	seventhDrafRes;
	seventhDrafResVersionId;
	eigthDrafRes;
	eigthDrafResVersionId;
	chekVal;
	checPrevoiusVal;
	unCheckedResVal;
	checkedResVal;
	fifthArray = [];
	unCheckedArray = [];
	fifthWithoudNewVals;
	popUpMenu = false;
	thirdMild = false;
	thirdModerate = false;
	thirdSevere = false;
	thirdVerySever = false;
	isYesChecked = false;
	isNoChecked = false;
	fifthinfo = false;
	fifthSyTr = false;
	fifthChallenges = false;
	fifthQuestionnaire = false;
	fifthTreatmentVideo = false;
	fifthSupport = false;
	seventhYess = false;
	seventhNoo = false;
	eighthYess = false;
	eighthNoo = false;
	dlqiCardImage = DLQI_IMAGE;
	pssCardImage = PSS_IMAGE;
	wpaiCardImage = WPAI_IMAGE;
	qsqCardImage = QSQ_IMAGE;
	introduction = labels.INTRODUCTION_CATEGORY;
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	wpaiText = labels.WPAI_TXT;
	clickBelow = labels.CLICK_BELOW;
	qsqText = labels.QSQ_EG_TXT;
	outstandingQue = labels.OUTSTANDING_QUESTIONNAIRE;
	informationCentre = labels.INFORMATION_CENTER_TXT;
	symptomTracker = labels.SYMPTOM_TRACKER_TXT;
	challenges = labels.CHALLENGES_TXT;
	questionnaire = labels.QUESTIONNAIRE_TXT;
	treatmentVideos = labels.TREATMENT_VIDEOS;
	support = labels.SUPPORT_TXT;
	yes = labels.YES_LABEL;
	no = labels.NO_LABEL;
	submit = labels.SUBMIT;
	saveasdraft = labels.SAVE_AS_DRAFT;
	returnBackc = labels.BUTTON_RETURN_BACK;
	confirmSub = labels.BUTTON_CONFIRM_SUB;
	cannotEdit = labels.CANNOT_EDIT_MSG;
	cancelbt = labels.CANCEL_BUTTON;
	confirmbt = labels.CONFIRM_BUTTON;
	draftResponses = [];
	handleResizeBound;
	stqsq = 0;
	stdlq = 0;
	stpss = 0;
	stwai = 0;

	//To get site url
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

			this.updateThumbLabelPosition(this.sliderValue);
			this.updateThumbLabelPositionsec(this.sliderValuesec);
			this.updateThumbLabelPositionthree(this.sliderValueThree);

			this.isDesktop = this.isDesktopView();
			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);
			this.addSliderEventListener();
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT);// Catching Potential Error
		}
	}
	//To bind the variable to resize
	disconnectedCallback() {
		try {
			window.removeEventListener('resize', this.handleResizeBound);
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT);// Catching Potential Error
		}
	}

	handleResize() {
		this.isDesktop = this.isDesktopView();
	}

	isDesktopView() {
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
			detail: { value: this.valueToSend }
		});
		this.dispatchEvent(event);
	}

	//To get total compelete Count
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				this.count = data;
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT);// Catching Potential Error from LWC
		}
	}
	//To disable the side bar navigation by certain conditions
	get checkdlqi() {
		return this.stdlq > 0 ? 'disabled' : '';
	}
	get checkpss() {
		return this.stpss > 0 ? 'disabled' : '';
	}

	get checkwai() {
		return this.stwai > 0 ? 'disabled' : '';
	}
	get checkqsq() {
		return this.stqsq > 0 ? 'disabled' : '';
	}

	// slider part 1
	//Handling First Question
	handleInputChange(event) {
		this.sliderValue = event.target.value;
		this.updateThumbLabelPosition(this.sliderValue);
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

	//To place the value in right position inside the slider 
	updateThumbLabelPosition(sliderValue) {
		if (typeof window !== 'undefined') {
			let slider = this.template.querySelector('input');
			let thumbLabel = this.template.querySelector('.thumb-label');

			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition =
				(sliderValue / slider.max) * (sliderWidth - thumbWidth);

			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;
			thumbLabel.style.left =
				Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', sliderValue);
		}
	}

	addSliderEventListener() {
		let slidersec = this.template.querySelector('.slidersec');
		let slider = this.template.querySelector('.slider');
		let sliderthree = this.template.querySelector('.sliderthree');

		let updateThumbPosition1 = () => {
			this.updateThumbLabelPosition(slider.value);
		};
		let updateThumbPosition2 = () => {
			this.updateThumbLabelPositionsec(slidersec.value);
		};
		let updateThumbPosition3 = () => {
			this.updateThumbLabelPositionthree(sliderthree.value);
		};

		if (slider) {
			slider.addEventListener('input', updateThumbPosition1);
			slider.addEventListener('mousemove', updateThumbPosition1);
		}

		if (slidersec) {
			slidersec.addEventListener('input', updateThumbPosition2);
			slidersec.addEventListener('mousemove', updateThumbPosition2);
		}
		if (sliderthree) {
			sliderthree.addEventListener('input', updateThumbPosition3);
			sliderthree.addEventListener('mousemove', updateThumbPosition3);
		}
	}

	// slider part 2

	//Handle second Question

	handleInputChangesec(event) {
		this.sliderValuesec = event.target.value;
		this.updateThumbLabelPositionsec(this.sliderValuesec);
		this.thirdQuestionResponse = event.target.value;
		this.nameToDraftThird = event.target.name;
		if (this.thirdQuestionResponse !== '') {
			this.arrayForPushResp.push(this.thirdQuestionResponse);
			this.arrayForPushId.push(this.thirdQuestionVersinId);
		}
		// Get the last values separately
		this.thirdRspValue = this.getLastRespValue();
		this.thirdVersionId = this.getLastIdValue();
	}

	//To place the value in right position inside the slider 
	updateThumbLabelPositionsec(sliderValuesec) {
		if (typeof window !== 'undefined') {
			let slidersec = this.template.querySelector('input');
			let thumbLabelsec = this.template.querySelector('.thumb-labelsec');

			let thumbWidthsec = parseFloat(
				window.getComputedStyle(thumbLabelsec).width
			);
			let sliderWidthsec = slidersec.offsetWidth;
			let thumbPositionsec =
				(sliderValuesec / slidersec.max) * (sliderWidthsec - thumbWidthsec);

			let newPositionsec =
				thumbPositionsec + thumbWidthsec / 2 - sliderWidthsec / 2;
			let maxPositionsec = sliderWidthsec - thumbWidthsec;
			thumbLabelsec.style.left =
				Math.min(maxPositionsec, Math.max(0, newPositionsec)) + 'px';
			thumbLabelsec.setAttribute('data-value', sliderValuesec);
		}
	}

	// slider part 3
	//Handle Third Question
	handleInputChangethree(event) {
		this.sliderValueThree = event.target.value;
		this.updateThumbLabelPositionthree(this.sliderValueThree);
		this.fourthQuestionResponse = event.target.value;
		this.nameToDraftFourth = event.target.name;

		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersinId);
		}
		// Get the last values separately
		this.fourthRspValue = this.getLastRespValue();
		this.fourthVersionId = this.getLastIdValue();
	}

	//To place the value in right position inside the slider 
	updateThumbLabelPositionthree(sliderValueThree) {
		if (typeof window !== 'undefined') {
			let slidersec = this.template.querySelector('input');
			let thumbLabelsec = this.template.querySelector('.thumb-labelthree');

			let thumbWidthsec = parseFloat(
				window.getComputedStyle(thumbLabelsec).width
			);
			let sliderWidthsec = slidersec.offsetWidth;
			let thumbPositionsec =
				(sliderValueThree / slidersec.max) * (sliderWidthsec - thumbWidthsec);

			let newPositionsec =
				thumbPositionsec + thumbWidthsec / 2 - sliderWidthsec / 2;
			let maxPositionsec = sliderWidthsec - thumbWidthsec;
			thumbLabelsec.style.left =
				Math.min(maxPositionsec, Math.max(0, newPositionsec)) + 'px';
			thumbLabelsec.setAttribute('data-value', sliderValueThree);
		}
	}
	//popup
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	//Save as draft popup
	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: ' .popup-containersaveasdr hidden';
	}

	get popupClass1() {
		return this.saveAsDraftPopUp ? 'popup2-container' : 'popup2-container hidden';
	}

	customHideModalPopup() {
		this.customFormModal = false;
		this.isPopupOpen = false;
		this.saveAsDraftPopUp = false;
	}

	//To get The current Response for the current user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(DRAFT_RESPONSE_OF_PSORIASIS, { questCatgryName: '$qsq', someBooleanParam: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			if (data) {
				this.responsOfDLQI = data;
				this.reposneModeeOn();
				this.draftResponses = data.map((response) => ({
					id: response.Id,
					questionText: response.ResponseValue,
					activeVersionId: response.AssessmentQuestion ? response.AssessmentQuestion.Id : null
				}));

				// Update the totalDraftResponses property
				this.totalDraftResponses = this.draftResponses.length;

				// Process draft responses
				this.processDraftResponses();
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	processDraftResponses() {
		const responseMappings = [
			{ textProperty: 'firstResponseText', idProperty: 'firstResponseVersinId' },
			{ textProperty: 'secondResponseText', idProperty: 'secondResponseVersinId' },
			{ textProperty: 'thirdResponseText', idProperty: 'thirdResponseVersinId' },
			{ textProperty: 'fourthResponseText', idProperty: 'fourthResponseVersinId' },
			{ textProperty: 'fifthResponseText', idProperty: 'fifthResponseVersinId' },
			{ textProperty: 'sixthResponseText', idProperty: 'sixthResponseVersinId', extraTextProperty: 'secSixthRespTex' }
		];

		responseMappings.forEach((mapping, index) => {
			if (this.draftResponses.length > index) {
				const question = this.draftResponses[index];
				this[mapping.textProperty] = question.questionText;
				this[mapping.idProperty] = question.activeVersionId;
				if (mapping.extraTextProperty) {
					this[mapping.extraTextProperty] = question.questionText;
				}
			}
		});
	}


	//Assigning order number for response
	reposneModeeOn() {
		// Helper function to handle mapping values to slider
		const mapSliderValue = (responseValue, valueMap) =>
			valueMap[responseValue] || 0 // Default to 0 if not found
			;

		// Helper function to handle updating state for checkbox responses
		const updateCheckedState = (responseValue, stateMap) => {
			const checkedState = stateMap[responseValue];
			if (checkedState) {
				this[checkedState] = true;
			}
		};

		// Define value maps for different response orders
		const valueMap = {
			'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
			'6': 6, '7': 7, '8': 8, '9': 9, '10': 10
		};

		// Define maps to associate ResponseValues with state variables
		const valueToCheckedState = {
			[this.yes]: 'isYesChecked',
			[this.no]: 'isNoChecked'
		};

		const sixthToCheckedState = {
			[this.yes]: 'seventhYess',
			[this.no]: 'seventhNoo'
		};

		const seventhToCheckedState = {
			[this.yes]: 'eighthYess',
			[this.no]: 'eighthNoo'
		};

		const fifthValueToCheckedState = {
			[this.informationCentre]: 'fifthinfo',
			[this.symptomTracker]: 'fifthSyTr',
			[this.challenges]: 'fifthChallenges',
			[this.questionnaire]: 'fifthQuestionnaire',
			[this.treatmentVideos]: 'fifthTreatmentVideo',
			[this.support]: 'fifthSupport'
		};

		// To show popup for submit or Return back
		this.responsOfDLQI.forEach((record) => {
			switch (record.BI_PSP_ResponseOrder__c) {
				case 1:
					this.sliderValue = mapSliderValue(record.ResponseValue, valueMap);
					this.firstDraftResp = record.ResponseValue;
					this.updateThumbLabelPosition(this.sliderValue);
					this.firstDraftVerionId = record.AssessmentQuestion.Id;
					break;

				case 2:
					updateCheckedState(record.ResponseValue, valueToCheckedState);
					this.secondDraftResp = record.ResponseValue;
					this.secondDraftVerionId = record.AssessmentQuestion.Id;
					break;

				case 3:
					this.sliderValuesec = mapSliderValue(record.ResponseValue, valueMap);
					this.thirdDraftResp = record.ResponseValue;
					this.updateThumbLabelPositionsec(this.sliderValuesec);
					this.thirdDraftVersionId = record.AssessmentQuestion.Id;
					break;

				case 4:
					this.sliderValueThree = mapSliderValue(record.ResponseValue, valueMap);
					this.fourthDraftRes = record.ResponseValue;
					this.updateThumbLabelPositionthree(this.sliderValueThree);
					this.fourthDraftVersionId = record.AssessmentQuestion.Id;
					break;

				case 5:
					Object.keys(fifthValueToCheckedState).forEach(key => {
						if (record.ResponseValue.includes(key)) {
							this[fifthValueToCheckedState[key]] = true;
						}
					});
					this.fifthDraftResp = record.ResponseValue;
					this.fifthDraftVersionId = record.AssessmentQuestion.Id;
					break;

				case 7:
					updateCheckedState(record.ResponseValue, sixthToCheckedState);
					this.seventhDrafRes = record.ResponseValue;
					this.seventhDrafResVersionId = record.AssessmentQuestion.Id;
					break;

				case 8:
					updateCheckedState(record.ResponseValue, seventhToCheckedState);
					this.eigthDrafRes = record.ResponseValue;
					this.eigthDrafResVersionId = record.AssessmentQuestion.Id;
					break;

				default:
					break;
			}
		});
	}

	//To get Assessment Questions
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTIONS, { questionnaireName: '$qsq' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (data) {
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText,
					activeVersionId: question.ActiveVersion
						? question.ActiveVersion.Id
						: null
				}));

				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];
				let fifthQuestion = this.questionData[4];
				let sixthQuestion = this.questionData[5];
				let seventhQuestion = this.questionData[6];
				let eighthQuestion = this.questionData[7];

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
				this.dispatchValueChangeEvent();
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT);// Catching Potential Error from LWC
		}
	}

	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		this.chekVal = event.target.value;

		if (this.chekVal === this.yes) {
			this.isYesChecked = true;
		} else {
			this.isYesChecked = false;
		}
		if (this.chekVal === this.no) {
			this.isNoChecked = true;
		} else {
			this.isNoChecked = false;
		}
		this.secondQuestionResponse = event.target.value;
		this.nameToDraftSecond = event.target.name;

		if (this.secondQuestionResponse !== '') {
			this.arrayForPushResp.push(this.secondQuestionResponse);
			this.arrayForPushId.push(this.secondQuestionVersinId);
		}
		// Get the last values separately
		this.secondRspValue = this.getLastRespValue();
		this.secondRespVersId = this.getLastIdValue();
	}

	//Navigation methods for other Questionnaire

	navigateToCategory2() {
		window.location.assign(this.urlq + labels.DLQI_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + labels.PSS_QUESTIONNAIRE_URL);
	}
	navigateToCategory4() {
		window.location.assign(this.urlq + labels.WPAI_QUESTIONAIRE);
	}
	handleSeven(event) {
		this.nameOfQuestion = event.target.name;
		this.checPrevoiusVal = this.fifthDraftResp;
		let checkedValOfBox = event.target.checked;
		let chekVal = event.target.value;

		const checkboxMappings = {
			[this.informationCentre]: 'fifthinfo',
			[this.symptomTracker]: 'fifthSyTr',
			[this.challenges]: 'fifthChallenges',
			[this.questionnaire]: 'fifthQuestionnaire',
			[this.treatmentVideos]: 'fifthTreatmentVideo',
			[this.support]: 'fifthSupport'
		};

		if (checkedValOfBox) {
			if (checkboxMappings[chekVal] !== undefined) {
				this[checkboxMappings[chekVal]] = true;
			}
		}

		if (checkedValOfBox) {
			this.checkedResVal = chekVal;
		} else {
			this.unCheckedResVal = chekVal;
			this.unCheckedArray.push(this.unCheckedResVal);
		}

		this.fifthQuestionresponse = chekVal;
		this.nameToDraftFifth = event.target.name;
		if (this.fifthQuestionresponse !== '') {
			this.arrayForPushResp.push(this.fifthQuestionresponse);
			this.fifthArray.push(this.fifthQuestionresponse);
			this.arrayForPushId.push(this.fifthQuestionVersinId);
		}

		// Get the last values separately
		this.fifthResonseValue = this.getLastRespValue();
		this.fifthVersionId = this.getLastIdValue();

		if (!checkedValOfBox) {
			if (checkboxMappings[chekVal] !== undefined) {
				this[checkboxMappings[chekVal]] = false;
			}
		}

		this.CheckBoxChecked = checkedValOfBox;

	}



	handlerealSeventhQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let chekVal = event.target.value;
		if (chekVal === this.yes) {
			this.seventhYess = true;
		} else {
			this.seventhYess = false;
		}
		if (chekVal === this.no) {
			this.seventhNoo = true;
		} else {
			this.seventhNoo = false;
		}

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

	handleEigthQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let chekVal = event.target.value;
		if (chekVal === this.yes) {
			this.eighthYess = true;
		} else {
			this.eighthYess = false;
		}
		if (chekVal === this.no) {
			this.eighthNoo = true;
		} else {
			this.eighthNoo = false;
		}

		this.eightQuestionResponse = event.target.value;
		this.nameToDraftEighth = event.target.name;

		if (this.eightQuestionResponse !== '') {
			this.arrayForPushResp.push(this.eightQuestionResponse);
			this.arrayForPushId.push(this.eightQuestionVersinId);
		}
		// Get the last values separately
		this.eghtResponseValue = this.getLastRespValue();
		this.eightVersiId = this.getLastIdValue();
	}

	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	closePopup() {
		this.isPopupOpen = false;
		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.popUpMenu = false;

		// Update sliders
		this.template.querySelector('#myRange').value = this.sliderValue;
		this.template.querySelector('#myRangesec').value = this.sliderValuesec;
		this.template.querySelector('#myRangethree').value = this.sliderValueThree;

		// Update radio buttons
		this.template.querySelector('#secondYes').checked = this.isYesChecked;
		this.template.querySelector('#secondNo').checked = this.isNoChecked;
		this.template.querySelector('#seventhYes').checked = this.seventhYess;
		this.template.querySelector('#seventhNo').checked = this.seventhNoo;
		this.template.querySelector('#eighthYes').checked = this.eighthYess;
		this.template.querySelector('#eighthNo').checked = this.eighthNoo;

		// Update checkboxes
		this.template.querySelector('#fifthInfo').checked = this.fifthinfo;
		this.template.querySelector('#fifthSyTr').checked = this.fifthSyTr;
		this.template.querySelector('#fifthChallenges').checked = this.fifthChallenges;
		this.template.querySelector('#fifthQuestionnaire').checked = this.fifthQuestionnaire;
		this.template.querySelector('#fifthTreatmentVideo').checked = this.fifthTreatmentVideo;
		this.template.querySelector('#fifthSupport').checked = this.fifthSupport;
	}

	closePopup1() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.saveAsDraftPopUp = false;
		this.popUpMenu = false;

		// Update sliders
		this.template.querySelector('#myRange').value = this.sliderValue;
		this.template.querySelector('#myRangesec').value = this.sliderValuesec;
		this.template.querySelector('#myRangethree').value = this.sliderValueThree;

		// Update radio buttons
		this.template.querySelector('#secondYes').checked = this.isYesChecked;
		this.template.querySelector('#secondNo').checked = this.isNoChecked;
		this.template.querySelector('#seventhYes').checked = this.seventhYess;
		this.template.querySelector('#seventhNo').checked = this.seventhNoo;
		this.template.querySelector('#eighthYes').checked = this.eighthYess;
		this.template.querySelector('#eighthNo').checked = this.eighthNoo;

		// Update checkboxes
		this.template.querySelector('#fifthInfo').checked = this.fifthinfo;
		this.template.querySelector('#fifthSyTr').checked = this.fifthSyTr;
		this.template.querySelector('#fifthChallenges').checked = this.fifthChallenges;
		this.template.querySelector('#fifthQuestionnaire').checked = this.fifthQuestionnaire;
		this.template.querySelector('#fifthTreatmentVideo').checked = this.fifthTreatmentVideo;
		this.template.querySelector('#fifthSupport').checked = this.fifthSupport;

	}

	// Check if all questions are answered
	areAllQuestionsAnswered() {
		const sliders = this.template.querySelectorAll('.slider');
		const radios = this.template.querySelectorAll('input[type="radio"]:checked');

		// Check if all sliders have a value greater than 0 and all radio groups have a selection
		return [...sliders].every(slider => slider.value > 0) && radios.length >= 3; // Adjust number as per total radio groups
	}

	// Check if at least one checkbox in the fifth question is checked
	isAtLeastOneCheckboxChecked() {
		const checkboxes = this.template.querySelectorAll('input[type="checkbox"]:checked');
		return checkboxes.length > 0;
	}


	submitResponses() { // Set the flag to false before submitting responses
		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = ''; // Reset to default
		}

		const allInputsFilled = this.areAllQuestionsAnswered();
		const atLeastOneFifthChecked = this.isAtLeastOneCheckboxChecked();

		if (allInputsFilled && atLeastOneFifthChecked) {
			this.isPopupOpen = true;
			this.saveAsDraftPopUp = false; // Show submit popup
		} else {
			this.customFormModal = true;
			this.saveAsDraftPopUp = true;
			this.isPopupOpen = false; // Show save as draft popup
		}

	}

	// Utility function to concatenate values with exclusions
	concatenateValues(values, valuesToExclude) {
		return [
			...new Set(
				values.filter(value => value !== undefined && !valuesToExclude.has(value))
			)
		].join(', ');
	}

	updateResponseArrays() {
		const responses = [
			{ value: this.firstRspValue, draft: this.firstDraftResp, id: this.firstRespVersId, draftId: this.firstDraftVerionId },
			{ value: this.secondRspValue, draft: this.secondDraftResp, id: this.secondRespVersId, draftId: this.secondDraftVerionId },
			{ value: this.thirdRspValue, draft: this.thirdDraftResp, id: this.thirdVersionId, draftId: this.thirdDraftVersionId },
			{ value: this.fourthRspValue, draft: this.fourthDraftRes, id: this.fourthVersionId, draftId: this.fourthDraftVersionId },
			{ value: this.fifthResonseValue, draft: this.fifthDraftResp, id: this.fifthVersionId, draftId: this.fifthDraftVersionId },
			{ value: this.seventhRespalue, draft: this.seventhDrafRes, id: this.seventhVersiD, draftId: this.seventhDrafResVersionId },
			{ value: this.eghtResponseValue, draft: this.eigthDrafRes, id: this.eightVersiId, draftId: this.eigthDrafResVersionId }
		];

		responses.forEach(({ value, draft, id, draftId }) => {
			this.realRespArray.push(value !== '' ? value : draft);
			this.realAssesVerArra.push(id !== '' && value !== '' ? id : draftId);
		});
	}

	// Utility function to extract values from an array
	extractValuesFromArray(array) {
		const values = [];
		for (let i = 0; i < Math.min(6, array.length); i++) {
			values[i] = array[i];
		}
		return values;
	}


	saveAsDraft() {
		document.body.style.overflow = this.isDesktop ? 'hidden' : ''; // Set overflow style based on device type
		this.popUpMenu = true;
		// Extract values from fifthArray and handle additional values
		const values = this.extractValuesFromArray(this.fifthArray);
		const additionalValues = (this.checPrevoiusVal || '')
			.split(',')
			.map(value => value.trim());
		const valuesToExclude = new Set(this.unCheckedArray);
		const haveSameElements = additionalValues.every(value =>
			valuesToExclude.has(value)
		);

		if (haveSameElements) {
			this.fifthDraftResp = '';
			this.fifthDraftVersionId = '';
		}

		// Concatenate values and update response value
		const concatenatedValues = this.concatenateValues([
			...values,
			...additionalValues
		], valuesToExclude);
		this.fifthResonseValue = concatenatedValues;

		// Update response arrays
		this.updateResponseArrays();

		// Filter non-empty responses and IDs
		const nonEmptyResponses = this.realRespArray.filter(response => response !== '');
		const nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

		if (nonEmptyResponses.length > 0) {
			let afterFourteenWeeks = false;
			let twoMonths = false;
			DRAFT_RESPONSE_SUBMISSION({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: afterFourteenWeeks,
				isQsqAfterTwoMonths: twoMonths
			})
				.then(() => {
					this.customFormModal = false;
					this.closePopup1 = false;
					this.checkyesorno = false;
					this.popUpMetod();
				})
				.catch((error) => {
					this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error
					// Handle any errors that occur during the response save
				});
		} else {
			window.location.assign(this.urlq + labels.OUT_STANDING_URL);
		}
	}

	// To Submit Response and Navigate to outstanding Questionnaire
	confirmSubmission() {
		// Extract values from fifthArray and handle additional values
		const values = this.extractValuesFromArray(this.fifthArray);
		const additionalValues = (this.checPrevoiusVal || '')
			.split(',')
			.map(value => value.trim());
		const valuesToExclude = new Set(this.unCheckedArray);
		const haveSameElements = additionalValues.every(value =>
			valuesToExclude.has(value)
		);

		if (haveSameElements) {
			this.fifthDraftResp = '';
			this.fifthDraftVersionId = '';
		}

		// Concatenate values and update response value
		const concatenatedValues = this.concatenateValues([
			...values,
			...additionalValues
		], valuesToExclude);
		this.fifthResonseValue = concatenatedValues;

		// Update response arrays
		this.updateResponseArrays();

		// Filter non-empty responses and IDs
		const nonEmptyResponses = this.realRespArray.filter(response => response !== '');
		const nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

		if (nonEmptyResponses.length > 0) {
			let afterFourteenWeeks = true;
			let twoMonths = false;
			DRAFT_RESPONSE_SUBMISSION({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: afterFourteenWeeks,
				isQsqAfterTwoMonths: twoMonths
			})
				.then(() => {
					window.location.assign(this.urlq + labels.OUT_STANDING_URL);
				})
				.catch((error) => {
					this.showToast(error.message, labels.ERROR_VARIANT); // Catching Potential Error
					// Handle any errors that occur during the response save
				});
		}
	}
	//Save as draft popup
	popUpMetod() {
		this.isDraftSavedPopupOpen = true;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	//Navigation to outstanding Questionnaire
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + labels.OUTSTANDING_PAGE_URL);
	}

	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq + labels.ERROR_PAGE);
	}

}