// This component is to fill the Introduction questionaries on the “Let’s personalise” page to get a personalized experience of the PSP.
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
//  To import Apex Classes
import INTRODUCTION_QUESTIONARE from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_INTRODUCTION from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import DELETE_SELECTED_RESPONSE from '@salesforce/apex/BI_PSP_LetsPersonliseCtrl.draftRespoDeletion';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
// To import Static Resources
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
// To import Custom Labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire'; 
// To import current user ID
import Id from '@salesforce/user/Id';
export default class BiPspbIntroductionQuestionnaire extends LightningElement {
	twoMonthsTrueFalse = false;
	countQuestion = 15;
	isMale = false;
	isFemale = false;
	isOther = false;
	isPrefferNotToSay = false;

	isFirstLessThanMonth = false;
	isFirstLessSix = false;
	isFirstLessYear = false;
	isFirstMoreYear = false;

	thirdIsNo = false;
	thirdIsYes = false;

	eighthRadYes = false;
	eighthRadNo = false;

	fourthCheckRelatFam = false;
	fourthCheckWithPartner = false;
	fourthCheckSelfEsteem = false;

	ninthRadYes = false;
	ninthRadNo = false;

	tenthCheckAsthma = false;
	tenthCheckDiabetes = false;
	tenthCheckDepression = false;
	tenthCheckHayFever = false;
	tenthCheckBp = false;
	tenthCheckHighChol = false;
	tenthCheckObesity = false;
	tenthCheckOsteo = false;
	tenthCheckPeptic = false;
	tenthCheckplaque = false;
	tenthCheckpsoriatic = false;
	tenthCheckOthers = false;

	afterSixthRadYes = false;
	afterSixthRadMaybe = false;
	afterSixthRadNo = false;

	sixthRadYes = false;
	sixthRadMayBe = false;
	sixthRadNo = false;

	eleventhRadYes = false;
	eleventhRadMaybe = false;
	eleventhRadNo = false;

	secondRadYes = false;
	secondRadMaybe = false;
	secondRadNo = false;

	thirdRadYes = false;
	thirdRadMaybe = false;
	thirdRadNo = false;

	fourthRadYes = false;
	fourthRadMaybe = false;
	fourthRadNo = false;

	seventhRadYes = false;
	seventhRadMaybe = false;
	seventhRadNo = false;

	twelthRadYes = false;
	twelthRadMaybe = false;
	twelthRadNo = false;

	thirteenththRadYes = false;
	thirteenththRadMaybe = false;
	thirteenththRadNo = false;

	forteenththRadYes = false;
	forteenthRadMaybe = false;
	forteenthRadNo = false;
	sixthQuestionVisible = false;

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
	eleventhQuestionVersinId;
	twelthQuestionText;
	twelthQuestionVersinId;
	thirteeenthQuestionText;
	thirteeenthQuestionVersinId;
	foteenthQuestionText;
	foteenthQuestionVersinId;
	fifteenthQuestionText;
	fifteenthQuestionVersinId;
	sixteenthQuestionText;
	sixteenthQuestionVersinId;
	seventeethQuestionText;
	seventeethQuestionVersinId;
	eighteenthQuestionText;
	eighteenthQuestionVersinId;

	selectedDateRange = '';
	selectedGender = '';
	selectedGppDiscussion = '';
	selectedGppImpact = [];
	hasMedicalConditions = '';
	showMedicalConditions = false;
	selectedMedicalConditions = [];

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

	twelvthQuestionResponse = '';
	thirteenthQuestionResponse = '';
	fourteenthQuestionResponse = '';
	fifteenthQuestionResponse = '';
	sixteenthQuestionResponse = '';

	@track realAssesVerArra = [];
	@track realRespArray = [];
	@track arrayForPushResp = [];
	@track arrayForPushId = [];

	firstRspValue;
	firstRespVersId;
	secondRspValue;
	secondRespVersId;
	thirdRspValue;
	thirdVersionId;
	fourthRspValue;
	fourthVersionId;
	fifthResonseValue;
	fifthVersionId;
	sixthResponseValue;
	sixthVersiD;
	seventhRespalue;
	seventhVersiD;
	eghtResponseValue;
	eightVersiId;
	ninthResponseValue;
	ninthVersId;
	tenthResponseValue;
	tenthVersId;
	eleventhResponseValue;
	eleventhVersiD;
	twelvthRespalue;
	twelvthVersiD;
	thirteenthResponseValue;
	thirteenthVersiId;
	fourteenthResponseValue;
	fourteenthVersId;
	fifteenthResponseValue;
	fifteenthVersId;
	sixteenthResponseValue;
	sixteenthVersId;

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
	nameToDrafteEleventh;
	nameToDrafttwelvth;
	nameToDraftThirteenth;
	nameToDraftFourteenth;
	nameToDraftFifteenth;
	nameToDraftSixteenth;
	nameToDraftSeventeeth;
	eventCheck = false;
	numberOfResponses;
	checkYesOrNo = false;

	@track totalValu = [];
	@track selectMedic = [];
	@track draftResponses = [];

	checkBoxArray;

	@track records = [];

	@track savedArrayForPushResp = [];
	concatenatedValues;

	showSixteenthQuestion = false;
	isConfirmationDialogOpen = false;
	customFormModal = false;

	submitMessage = labels.SUBMIT_MESSAGE;

	@track selectedValues = [];
	customClass = 'nds-form-element nds-form-containerthree';
	isDraftSavedPopupOpen = false;
	draftSavedMessage = labels.POPUP_MESSAGE;

	isPopupOpen = false;
	isPopupOpenDraft = false;

	// Declaration of Global variables
	uniqueUncheckedCount = '';
	uniqueCheckedCount = '';
	itsTrue = false;
	message = labels.COMPLETED_ALL;
	trueOrnOt;
	userId = Id;
	propertyProcessedMap = {};
	fourthRecId;
	sixthResponseId;
	knowTheUnChecked;
	fourthCheck;
	knowSixthChecked;
	toShowSixth;
	sixthCheckedArray = [];
	filteredArray = [];
	isEqualLength = false;
	filterArr = '';
	popUpMenu = false;
	theLab = '';
	checkedBoolean;
	unCheckedBoolean;
	urlq;
	questionData = [];
	cardImageDlqi = DLQI_IMAGE;
	cardImagePss = PSS_IMAGE;
	cardImageWpai = WPAI_IMAGE;
	cardImageQsq = QUALITATIVE_IMAGE;
	footerTextMsg = labels.INTROPAGEONEBOTTOM;
	introduction = labels.INTRODUCTION_CATEGORY;
	letsPeronlizeTxt=labels.LETS_PERSONLIZE_TXT
	pss = labels.PSS_CATEGORY;
	dlqi = labels.DLQI_CATEGORY;
	wapi = labels.WPAI_CATEGORY;
	qsq = labels.QUALITATIVE_LABEL;
	workActivity = labels.WPAI_TXT;
	fifthQuestion = labels.FIFTH_QUESTION;
	sixthQuestion = labels.SIXTH_QUESTION;
	answeredQuestion = 0;
	lessthanMonth = labels.LESSTHAN_A_MONTH;
	lessThanSixMonths = labels.SIXMONTHS;
	lessThanYear = labels.LESS_THAN_YEAR;
	moreThanYear = labels.MORE_THAN_YEAR;
	male = labels.MALE;
	female = labels.FEMALE;
	other = labels.OTHER;
	preferNot = labels.PREFERNOT_TOSAY;
	yes = labels.YES_LABEL;
	no = labels.NO_LABEL;
	relationshipWithff = labels.RELATIONSHIPWITH_FF;
	relationshipWithPartner = labels.RELATIONSHIPWITH_PARTNER;
	selfEsteem = labels.SELF_ESTEEM;
	selectAll = labels.SELECT_ALL;

	asthma = labels.ASTHMA;
	diabetes = labels.DIABETESMELLITUS;
	depression = labels.DEPRESSION;
	hayFever = labels.HAY_FEVER;
	hypertension = labels.HYPERTENSION;
	highcholestrol = labels.HIGHCHOLESTEROL;
	obesityc = labels.OBESITY;
	osteoporosisc = labels.OSTEOPOROSIS;
	ulcer = labels.ULCER;
	psoriasis = labels.PSORIASIS;
	psoriaticarthritis = labels.PSORIATICARTHRITIS;
	others = labels.OTHERS;
	doYouAgree = labels.DO_YOU_AGREE;
	maybe = labels.MAYBE;

	answered = labels.ANSWERED;
	submit = labels.SUBMIT;
	draftLabel = labels.SAVE_AS_DRAFT;
	outstandingQue = labels.OUTSTANDING_QUESTIONNAIRE;
	returnBack = labels.BUTTON_RETURN_BACK;

	confirmSub = labels.BUTTON_CONFIRM_SUB;
	cannotEdit = labels.CANNOT_BE_EDITED;
	cancelbt = labels.CANCEL_BUTTON;
	confirmbt = labels.CONFIRM_BUTTON;

	checPrevoiusVal;
	unCheckedResVal;
	uncheckedArray = [];
	uncheckVar;


	sixthDraftVal;
	sixthUnCheckedVals;
	sixthUnChekedArray = [];
	checkedResVal;


	firstQResForEach;
	secQResForEach;
	secQRes;
	secQVersionResForEach;

	thirdQResForEach;
	thirdQVersionResForEach;

	fourQResForEach;
	fourQVersionResForEach;

	fifthQResForEach;
	sixthQResForEach;

	sevenQResForEach;
	sevenQVersionResForEach;

	eigthQResForEach;
	nineQResForEach;
	tenthQResForEach;
	eleventhQResForEach;
	twelthQResForEach;
	thirteenthQResForEach;
	fourteenthQResForEach;
	fifteenthQResForEach;
	sixteenthQResForEach;
	handleResizeBound;
	targetElement;
	stqsq = 0;
	stdlq = 0;
	stpss = 0;
	stwai = 0;
	visibleButton=false;
	//Below defined getter method to determine the CSS class for the  popup container based on its visibility
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: 'popup-containersaveasdr hidden';
	}

	get popupClass1() {
		return this.isPopupOpenDraft ? 'popup2-container' : 'popup2-container hidden';
	}

	// Method to hide both main and secondary popups
	customHideModalPopup() {
		this.customFormModal = false;
		this.isPopupOpen = false;
		this.isPopupOpenDraft = false;
	}

	//to check whether the page is in Brandd or unassigned.Also to check the desktop view
	renderedCallback() {
		try {
			let currentURL = window.location.href;

			let urlObject = new URL(currentURL);

			let path = urlObject.pathname;

			let pathComponents = path.split('/');

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
			let globalThis = window;
			let flexCrd = globalThis?.innerWidth;
			if(flexCrd>=1201)
			{
				this.visibleButton=true;
			}
			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);
		} catch (error) {
			this.showToast( error.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	disconnectedCallback() {
		// Remove the resize event listener when the component is disconnected

		window.removeEventListener('resize', this.handleResizeBound);

	}

	handleResize() {
		// Handle the resize event by updating the isDesktop property
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
            detail: { value: this.valueToSend}
        });
        this.dispatchEvent(event);
    }

	// Wire adapter to fetch patient data after three months and fourteen weeks
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				// Assign fetched data to component properties
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetDateTwoMonths = data.targetTwoMonthsDate ?? null;
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			}
			else if (error) {
				this.showToast( error.body.message, labels.ERROR_VARIANT); // Catching Potential from Apex
			}
		} catch (err) {
			this.showToast( err.message, labels.ERROR_VARIANT);// Catching Potential from LWC
		}
	}

	// Wire adapter to count assessment responses
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				// Assign fetched data to component properties
				this.count = data;
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			}
			else if (error) {
				this.showToast( error.body.message, labels.ERROR_VARIANT);// Catching Potential from Apex
			}
		} catch (err) {
			this.showToast( err.message, labels.ERROR_VARIANT);// Catching Potential from LWC
		}
	}

	//below are  Getter methods to determine if dlqi ,pss,wapi check is enabled
	get checkdlqi() {
		return this.stdlq > 0 ? 'disabled' : '';
	}

	get checkpss() {
		return this.stpss > 0 ? 'disabled' : '';
	}

	get checkwai() {
		return this.stwai > 0 ? 'disabled' : '';
	}

	// Getter method to determine if qsq check is enabled
	get checkqsq() {
		if (this.targetDateFourteenWks === null && this.targetDateTwoMonths === null) {
			return 'disabled';
		} else if (this.stqsq > 0) {
			return 'disabled';
		}
		return '';
	}

	// Wire adapter to fetch draft responses of introduction
	@wire(DRAFT_RESPONSE_OF_INTRODUCTION, { questCatgryName: '$introduction', twoMonths: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.records = data;
				this.answeredQuestion = this.records.length;
				this.draftResponsesforlater();

				// Loop through each record to check conditions
				this.records.forEach((record) => {
					if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === this.yes
					) {
						this.countQuestion = 16;
						this.answeredQuestion = this.records.length;
					} else if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === this.no
					) {
						this.answeredQuestion = this.records.length;
					}
				});

				// Check if the answer question count exceeds a certain threshold
				if (this.answeredQuestion > this.countQuestion) {
					this.countQuestion = 16;
				}
			}
			else if (error) {
				this.showToast( error.body.message, labels.ERROR_VARIANT);// Catching Potential from Apex
			}
		} catch (err) {
			this.showToast( err.message, labels.ERROR_VARIANT);// Catching Potential from LWC
		}
	}
	//this method is for storing the draft response and its version id so that we can use these variables to save the draft response later ,also in this method we will be making the radio buttons as checked if the draft values matches with the values that are stored in to variables with their respective radio option values.

	// Utility function to check response value and set corresponding variables
	setResponseValue({ record, targetValue, responseVar, versionVar, flagVar }) {
		if (record.ResponseValue === targetValue && record.AssessmentQuestion.Id !== null) {
			this[responseVar] = record.ResponseValue;
			this[versionVar] = record.AssessmentQuestion.Id;
			this[flagVar] = true;
		}
	}

	// Utility function to check response value for multiple targets
	setResponseValues({ record, targets, responseVar, versionVar }) {
		targets.forEach(target => {
			if (record.ResponseValue.includes(target.value) && record.AssessmentQuestion.Id !== null) {
				this[target.flag] = true;
				this[responseVar] = record.ResponseValue;
				this[versionVar] = record.AssessmentQuestion.Id;
			}
		});
	}

	// Utility function to handle radio button responses
	setRadioButtonResponse({ record, targetValue, responseVar, versionVar, flagVar }) {
		if (record.ResponseValue === targetValue && record.AssessmentQuestion.Id !== null) {
			this[responseVar] = record.ResponseValue;
			this[versionVar] = record.AssessmentQuestion.Id;
			this[flagVar] = true;
		}
	}

	draftResponsesforlater() {
		const genderTargets = [
			{ value: this.female, flag: 'isFemale' },
			{ value: this.male, flag: 'isMale' },
			{ value: this.other, flag: 'isOther' },
			{ value: this.preferNot, flag: 'isPrefferNotToSay' }
		];

		const durationTargets = [
			{ value: this.lessthanMonth, flag: 'isFirstLessThanMonth' },
			{ value: this.lessThanSixMonths, flag: 'isFirstLessSix' },
			{ value: this.lessThanYear, flag: 'isFirstLessYear' },
			{ value: this.moreThanYear, flag: 'isFirstMoreYear' }
		];

		const thirdTargets = [
			{ value: this.relationshipWithff, flag: 'fourthCheckRelatFam' },
			{ value: this.relationshipWithPartner, flag: 'fourthCheckWithPartner' },
			{ value: this.selfEsteem, flag: 'fourthCheckSelfEsteem' }
		];

		const tenthTargets = [
			{ value: this.asthma, flag: 'tenthCheckAsthma' },
			{ value: this.diabetes, flag: 'tenthCheckDiabetes' },
			{ value: this.depression, flag: 'tenthCheckDepression' },
			{ value: this.hayFever, flag: 'tenthCheckHayFever' },
			{ value: this.hypertension, flag: 'tenthCheckBp' },
			{ value: this.highcholestrol, flag: 'tenthCheckHighChol' },
			{ value: this.obesityc, flag: 'tenthCheckObesity' },
			{ value: this.osteoporosisc, flag: 'tenthCheckOsteo' },
			{ value: this.ulcer, flag: 'tenthCheckPeptic' },
			{ value: this.psoriasis, flag: 'tenthCheckplaque' },
			{ value: this.psoriaticarthritis, flag: 'tenthCheckpsoriatic' },
			{ value: this.others, flag: 'tenthCheckOthers' }
		];

		const yesNoMaybeTargets = [
			{ responseOrder: 3, yes: 'thirdIsYes', no: 'thirdIsNo', responseVar: 'thirdQResForEach', versionVar: 'thirdQVersionResForEach' },
			{ responseOrder: 5, yes: 'fifthRadYes', no: 'fifthRadNo', customClass: true, responseVar: 'fifthQResForEach', versionVar: 'fifthQVersionResForEach' },
			{ responseOrder: 7, yes: 'afterSixthRadYes', no: 'afterSixthRadNo', maybe: 'afterSixthRadMaybe', responseVar: 'sevenQResForEach', versionVar: 'sevenQVersionResForEach' },
			{ responseOrder: 8, yes: 'sixthRadYes', no: 'sixthRadNo', maybe: 'sixthRadMayBe', responseVar: 'eigthQResForEach', versionVar: 'eigthQVersionResForEach' },
			{ responseOrder: 9, yes: 'eleventhRadYes', no: 'eleventhRadNo', maybe: 'eleventhRadMaybe', responseVar: 'nineQResForEach', versionVar: 'nineQVersionResForEach' },
			{ responseOrder: 10, yes: 'secondRadYes', no: 'secondRadNo', maybe: 'secondRadMaybe', responseVar: 'tenthQResForEach', versionVar: 'tenthQVersionResForEach' },
			{ responseOrder: 11, yes: 'thirdRadYes', no: 'thirdRadNo', maybe: 'thirdRadMaybe', responseVar: 'eleventhQResForEach', versionVar: 'eleventhQVersionResForEach' },
			{ responseOrder: 12, yes: 'fourthRadYes', no: 'fourthRadNo', maybe: 'fourthRadMaybe', responseVar: 'twelthQResForEach', versionVar: 'twelthQVersionResForEach' },
			{ responseOrder: 13, yes: 'seventhRadYes', no: 'seventhRadNo', maybe: 'seventhRadMaybe', responseVar: 'thirteenthQResForEach', versionVar: 'thirteenthQVersionResForEach' },
			{ responseOrder: 14, yes: 'twelthRadYes', no: 'twelthRadNo', maybe: 'twelthRadMaybe', responseVar: 'fourteenthQResForEach', versionVar: 'fourteenthQVersionResForEach' },
			{ responseOrder: 15, yes: 'thirteenththRadYes', no: 'thirteenththRadNo', maybe: 'thirteenththRadMaybe', responseVar: 'fifteenthQResForEach', versionVar: 'fifteenthQVersionResForEach' },
			{ responseOrder: 16, yes: 'forteenththRadYes', no: 'forteenthRadNo', maybe: 'forteenthRadMaybe', responseVar: 'sixteenthQResForEach', versionVar: 'sixteenthQVersionResForEach' }
		];

		this.records.forEach((record) => {
			// Gender targets
			if (record.BI_PSP_ResponseOrder__c === 2) {
				genderTargets.forEach(target => {
					this.setResponseValue({ record, targetValue: target.value, responseVar: 'secQResForEach', versionVar: 'secQVersionResForEach', flagVar: target.flag });
				});
			}

			// Duration targets
			if (record.BI_PSP_ResponseOrder__c === 1) {
				durationTargets.forEach(target => {
					this.setResponseValue({ record, targetValue: target.value, responseVar: 'firstQResForEach', versionVar: 'firstQVersionResForEach', flagVar: target.flag });
				});
			}

			// Third targets
			if (record.BI_PSP_ResponseOrder__c === 4) {
				this.fourthRecId = record.Id;
				this.setResponseValues({ record, targets: thirdTargets, responseVar: 'fourQResForEach', versionVar: 'fourQVersionResForEach' });
			}

			// Tenth targets
			if (record.BI_PSP_ResponseOrder__c === 6) {
				this.sixthResponseId = record.Id;
				this.setResponseValues({ record, targets: tenthTargets, responseVar: 'sixthQResForEach', versionVar: 'sixthQVersionResForEach' });
			}

			// Yes/No/Maybe targets
			yesNoMaybeTargets.forEach(target => {
				if (record.BI_PSP_ResponseOrder__c === target.responseOrder) {
					this.setRadioButtonResponse({ record, targetValue: this.yes, responseVar: target.responseVar, versionVar: target.versionVar, flagVar: target.yes });
					this.setRadioButtonResponse({ record, targetValue: this.no, responseVar: target.responseVar, versionVar: target.versionVar, flagVar: target.no });
					if (target.maybe) {
						this.setRadioButtonResponse({ record, targetValue: this.maybe, responseVar: target.responseVar, versionVar: target.versionVar, flagVar: target.maybe });
					}
					// Special case for customClass handling
					if (target.customClass) {
						if (record.ResponseValue === this.yes) {
							this.sixthQuestionVisible = true;
							this.customClass = 'nds-form-element nds-form-containertwo';
						} else if (record.ResponseValue === this.no) {
							this.sixthQResForEach = '';
							this.sixthQVersionResForEach = '';
							this.customClass = 'nds-form-element nds-form-containerthree';
						}
					}
				}
			});
		});
	}


	//this wire method is for retrieving the introduction Questions and storing them to different variables one by one
	@wire(INTRODUCTION_QUESTIONARE, { questionnaireName: '$introduction' })
	wiredAssessmentQuestion({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText ? question.QuestionText : null,
					activeVersionId: question.ActiveVersion
						? question.ActiveVersion.Id
						: null
				}));
				//the below set of varibales holds the Questions of introduction Questionnaire
				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];
				let FifthQuestion = this.questionData[4];
				let SixthQuestion = this.questionData[5];
				let SeventhQuestion = this.questionData[6];
				let EighthQuestion = this.questionData[7];
				let NinthQuestion = this.questionData[8];
				let TenthQuestion = this.questionData[9];
				let EleventhQuestion = this.questionData[10];
				let TwelthQuestion = this.questionData[11];
				let ThirteenthQuestion = this.questionData[12];
				let FourteenthQuestion = this.questionData[13];
				let FifteenththQuestion = this.questionData[14];
				let SixteenthQuestion = this.questionData[15];

				this.firstQuestionText = firstQuestion.questionText;

				this.firstQuestionVersinId = firstQuestion.activeVersionId;

				this.secondQuestionText = secondQuestion.questionText;

				this.secondQuestionVersinId = secondQuestion.activeVersionId;

				this.thirdQuestionText = thirdQuestion.questionText;

				this.thirdQuestionVersinId = thirdQuestion.activeVersionId;

				this.fourthQuestionText = fourthQuestion.questionText;

				this.fourthQuestionVersinId = fourthQuestion.activeVersionId;

				this.fifthQuestionText = FifthQuestion.questionText;

				this.fifthQuestionVersinId = FifthQuestion.activeVersionId;

				this.sixthQuestionText = SixthQuestion.questionText;

				this.sixthQuestionVersinId = SixthQuestion.activeVersionId;

				this.seventhQuestionText = SeventhQuestion.questionText;

				this.seventhQuestionVersinId = SeventhQuestion.activeVersionId;

				this.eightQuestionText = EighthQuestion.questionText;

				this.eightQuestionVersinId = EighthQuestion.activeVersionId;

				this.ninthQuestionText = NinthQuestion.questionText;

				this.ninthQuestionVersinId = NinthQuestion.activeVersionId;

				this.tenthQuestionText = TenthQuestion.questionText;

				this.tenthQuestionVersinId = TenthQuestion.activeVersionId;

				this.eleventhQuestionText = EleventhQuestion.questionText;
				this.eleventhQuestionVersinId = EleventhQuestion.activeVersionId;

				this.twelthQuestionText = TwelthQuestion.questionText;

				this.twelthQuestionVersinId = TwelthQuestion.activeVersionId;

				this.thirteeenthQuestionText = ThirteenthQuestion.questionText;

				this.thirteeenthQuestionVersinId = ThirteenthQuestion.activeVersionId;

				this.foteenthQuestionText = FourteenthQuestion.questionText;

				this.foteenthQuestionVersinId = FourteenthQuestion.activeVersionId;

				this.fifteenthQuestionText = FifteenththQuestion.questionText;

				this.fifteenthQuestionVersinId = FifteenththQuestion.activeVersionId;
				this.sixteenthQuestionText = SixteenthQuestion.questionText;
				this.sixteenthQuestionVersinId = SixteenthQuestion.activeVersionId;
				this.dispatchValueChangeEvent();
			} else if (error) {
				this.showToast( error.body.message, labels.ERROR_VARIANT);// Catching Potential from Apex
			}
		} catch (err) {
			this.showToast( err.message, labels.ERROR_VARIANT);// Catching Potential from LWC
		}
	}

	//below are the handlers that handles the resposnes from user input(16 hhandlers)
	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;
		let chekVal = event.target.value;
		if (chekVal === this.lessthanMonth) {
			this.isFirstLessThanMonth = true;
		} else {
			this.isFirstLessThanMonth = false;
		}

		if (chekVal === this.lessThanSixMonths) {
			this.isFirstLessSix = true;
		} else {
			this.isFirstLessSix = false;
		}

		if (chekVal === this.lessThanYear) {
			this.isFirstLessYear = true;
		} else {
			this.isFirstLessYear = false;
		}

		if (chekVal === this.moreThanYear) {
			this.isFirstMoreYear = true;
		} else {
			this.isFirstMoreYear = false;
		}

		if (this.nameOfQuestion === 'firstQuestionResponse') {
			this.firstQuestionResponse = event.target.value;
			this.nameToDraftFirst = event.target.name;

			if (this.firstQuestionResponse !== '') {
				//pushes the responses and version ids to arrays
				this.arrayForPushResp.push(this.firstQuestionResponse);
				this.arrayForPushId.push(this.firstQuestionVersinId);
			}
			this.firstRspValue = this.getLastRespValue();
			this.firstRespVersId = this.getLastIdValue();
		}
	}

	handleSecondQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.male) {
			this.isMale = true;
		} else {
			this.isMale = false;
		}

		if (checkedVal === this.female) {
			this.isFemale = true;
		} else {
			this.isFemale = false;
		}

		if (checkedVal === this.other) {
			this.isOther = true;
		} else {
			this.isOther = false;
		}

		if (checkedVal === this.preferNot) {
			this.isPrefferNotToSay = true;
		} else {
			this.isPrefferNotToSay = false;
		}

		this.nameOfQuestion = event.target.name;

		if (this.nameOfQuestion === 'secondQuestionResponse') {
			this.secondQuestionResponse = event.target.value;
			this.nameToDraftSecond = event.target.name;
			if (this.secondQuestionResponse !== '') {
				this.arrayForPushResp.push(this.secondQuestionResponse);
				this.arrayForPushId.push(this.secondQuestionVersinId);
			}
			// Get the last response value
			this.secondRspValue = this.getLastRespValue();
			// Get the last response version id
			this.secondRespVersId = this.getLastIdValue();
		}
	}

	handleEigthQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.sixthRadYes = true;
		} else {
			this.sixthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.sixthRadNo = true;
		} else {
			this.sixthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.sixthRadMayBe = true;
		} else {
			this.sixthRadMayBe = false;
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

	//this handler handles the user input
	handlethirdQuestionChange(event) {
		let checkedval = event.target.value;
		if (checkedval === this.yes) {
			this.thirdIsYes = true;
		} else {
			this.thirdIsYes = false;
		}

		if (checkedval === this.no) {
			this.thirdIsNo = true;
		} else {
			this.thirdIsNo = false;
		}

		this.nameOfQuestion = event.target.name;

		if (this.nameOfQuestion === 'thirdQuestionRespo') {
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
	}


	//this handler handles the user input Response
	handleNinthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.eleventhRadYes = true;
		} else {
			this.eleventhRadYes = false;
		}

		if (checkedVal === this.no) {
			this.eleventhRadNo = true;
		} else {
			this.eleventhRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.eleventhRadMaybe = true;
		} else {
			this.eleventhRadMaybe = false;
		}

		this.ninthQuestionResponse = event.target.value;
		this.nameToDraftNinth = event.target.name;
		if (this.ninthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.ninthQuestionResponse);
			this.arrayForPushId.push(this.ninthQuestionVersinId);
		}
		// Get the last values separately
		this.ninthResponseValue = this.getLastRespValue();
		this.ninthVersId = this.getLastIdValue();
	}

	handleFifteenthQuestionChange(event) {
		let checkedVal = event.target.value;

		//the below if conditions checks the value if it is true then set the radion buttons as checked otherwise unchecked.
		if (checkedVal === this.yes) {
			this.thirteenththRadYes = true;
		} else {
			this.thirteenththRadYes = false;
		}

		if (checkedVal === this.no) {
			this.thirteenththRadNo = true;
		} else {
			this.thirteenththRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.thirteenththRadMaybe = true;
		} else {
			this.thirteenththRadMaybe = false;
		}

		this.fifteenthQuestionResponse = event.target.value;
		this.nameToDraftFifteenth = event.target.name;

		if (this.fifteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fifteenthQuestionResponse);
			this.arrayForPushId.push(this.fifteenthQuestionVersinId);
		}

		// Get the last values separately
		this.fifteenthResponseValue = this.getLastRespValue();

		this.fifteenthVersId = this.getLastIdValue();
	}


	handleFourteenthQuestionChange(event) {
		let checkedVal = event.target.value;

		if (checkedVal === this.yes) {
			this.twelthRadYes = true;
		} else {
			this.twelthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.twelthRadNo = true;
		} else {
			this.twelthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.twelthRadMaybe = true;
		} else {
			this.twelthRadMaybe = false;
		}

		this.fourteenthQuestionResponse = event.target.value;
		this.nameToDraftFourteenth = event.target.name;

		if (this.fourteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourteenthQuestionResponse);
			this.arrayForPushId.push(this.foteenthQuestionVersinId);
		}
		// Get the last values separately
		this.fourteenthResponseValue = this.getLastRespValue();

		this.fourteenthVersId = this.getLastIdValue();
	}


	handleThirteenthQuestionChange(event) {
		let checkedVal = event.target.value;

		if (checkedVal === this.yes) {
			this.seventhRadYes = true;
		} else {
			this.seventhRadYes = false;
		}

		if (checkedVal === this.no) {
			this.seventhRadNo = true;
		} else {
			this.seventhRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.seventhRadMaybe = true;
		} else {
			this.seventhRadMaybe = false;
		}

		this.thirteenthQuestionResponse = event.target.value;
		this.nameToDraftThirteenth = event.target.name;

		if (this.thirteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.thirteenthQuestionResponse);
			this.arrayForPushId.push(this.thirteeenthQuestionVersinId);
		}

		this.thirteenthResponseValue = this.getLastRespValue();
		this.thirteenthVersiId = this.getLastIdValue();
	}

	handleTwelthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.fourthRadYes = true;
		} else {
			this.fourthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.fourthRadNo = true;
		} else {
			this.fourthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.fourthRadMaybe = true;
		} else {
			this.fourthRadMaybe = false;
		}

		this.twelvthQuestionResponse = event.target.value;
		this.nameToDrafttwelvth = event.target.name;

		if (this.twelvthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.twelvthQuestionResponse);
			this.arrayForPushId.push(this.twelthQuestionVersinId);
		}

		this.twelvthRespalue = this.getLastRespValue();
		this.twelvthVersiD = this.getLastIdValue();
	}

	handleEleventhQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === 'Yes') {
			this.thirdRadYes = true;
		} else {
			this.thirdRadYes = false;
		}

		if (checkedVal === this.no) {
			this.thirdRadNo = true;
		} else {
			this.thirdRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.thirdRadMaybe = true;
		} else {
			this.thirdRadMaybe = false;
		}

		this.eleventhQuestionResponse = event.target.value;
		this.nameToDrafteEleventh = event.target.name;

		if (this.eleventhQuestionResponse !== '') {
			this.arrayForPushResp.push(this.eleventhQuestionResponse);
			this.arrayForPushId.push(this.eleventhQuestionVersinId);
		}
		// Get the last values separately
		this.eleventhResponseValue = this.getLastRespValue();
		this.eleventhVersiD = this.getLastIdValue();
	}

	handleTenthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.secondRadYes = true;
		} else {
			this.secondRadYes = false;
		}

		if (checkedVal === this.no) {
			this.secondRadNo = true;
		} else {
			this.secondRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.secondRadMaybe = true;
		} else {
			this.secondRadMaybe = false;
		}

		this.tenthQuestionResponse = event.target.value;
		this.nameToDrafttenth = event.target.name;
		if (this.tenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.tenthQuestionResponse);
			this.arrayForPushId.push(this.tenthQuestionVersinId);
		}

		this.tenthResponseValue = this.getLastRespValue();
		this.tenthVersId = this.getLastIdValue();
	}

	handleSeventhQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.afterSixthRadYes = true;
		} else {
			this.afterSixthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.afterSixthRadNo = true;
		} else {
			this.afterSixthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.afterSixthRadMaybe = true;
		} else {
			this.afterSixthRadMaybe = false;
		}
		this.seventhQuestionResponse = event.target.value;
		this.nameToDraftSeventh = event.target.name;

		if (this.seventhQuestionResponse !== '') {
			this.arrayForPushResp.push(this.seventhQuestionResponse);
			this.arrayForPushId.push(this.seventhQuestionVersinId);
		}

		this.seventhRespalue = this.getLastRespValue();
		this.seventhVersiD = this.getLastIdValue();
	}

	handleSixthQuestionchange(event) {
		this.sixthDraftVal = this.sixthQResForEach;
		const checkBoval = event.target.checked;
		const vals = event.target.value;

		this.knowSixthChecked = checkBoval;

		// Map of condition values to checkbox variables
		const conditionMap = {
			[this.asthma]: 'tenthCheckAsthma',
			[this.diabetes]: 'tenthCheckDiabetes',
			[this.depression]: 'tenthCheckDepression',
			[this.hayFever]: 'tenthCheckHayFever',
			[this.hypertension]: 'tenthCheckBp',
			[this.highcholestrol]: 'tenthCheckHighChol',
			[this.obesityc]: 'tenthCheckObesity',
			[this.osteoporosisc]: 'tenthCheckOsteo',
			[this.ulcer]: 'tenthCheckPeptic',
			[this.psoriasis]: 'tenthCheckplaque',
			[this.psoriaticarthritis]: 'tenthCheckpsoriatic',
			[this.others]: 'tenthCheckOthers'
		};

		if (checkBoval) {
			this.unCheckedBoolean = true;
			this.sixthCheckedArray.push(vals);
		} else {
			this.unCheckedBoolean = false;
			this.uncheckVar = this.yes;
			this.sixthUnCheckedVals = vals;
			this.sixthUnChekedArray.push(vals);
		}

		if (Object.hasOwn(conditionMap, vals)) {
			this[conditionMap[vals]] = checkBoval;
		}

		this.sixthQuestionResponse = vals;
		this.nameToDraftSixth = event.target.name;

		if (vals !== '') {
			this.arrayForPushResp.push(vals);
			this.arrayForPushId.push(this.sixthQuestionVersinId);
			this.selectMedic.push(vals);
		}

		this.sixthResponseValue = this.getLastRespValue();
		this.sixthVersiD = this.getLastIdValue();

		if (typeof this.sixthQResForEach !== 'undefined' && this.filterArr === '') {
			const qResArray = this.sixthQResForEach.split(',');
			this.filteredArray = qResArray.filter(value => value.trim() !== '');

			if (this.filteredArray.length > 0) {
				this.sixthCheckedArray = [...this.sixthCheckedArray, ...this.filteredArray];
			}
		}

		const uniqueUnchekedArray = Array.from(new Set(this.sixthUnChekedArray));
		this.uniqueUncheckedCount = uniqueUnchekedArray.length;

		const uniqueCheckedArray = Array.from(new Set(this.sixthCheckedArray));
		this.uniqueCheckedCount = uniqueCheckedArray.length;

		this.isEqualLength = this.uniqueUncheckedCount === this.uniqueCheckedCount;
	}

	handleSixteenthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.forteenththRadYes = true;
		} else {
			this.forteenththRadYes = false;
		}

		if (checkedVal === this.no) {
			this.forteenthRadNo = true;
		} else {
			this.forteenthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.forteenthRadMaybe = true;
		} else {
			this.forteenthRadMaybe = false;
		}

		this.sixteenthQuestionResponse = event.target.value;
		this.nameToDraftSixteenth = event.target.name;

		if (this.sixteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.sixteenthQuestionResponse);
			this.arrayForPushId.push(this.sixteenthQuestionVersinId);
		}

		this.sixteenthResponseValue = this.getLastRespValue();
		this.sixteenthVersId = this.getLastIdValue();
	}


	deleteYesBasedRes() {
		this.sixthQResForEach = '';
		this.sixthQVersionResForEach = '';
	}

	handleFifthQuestionChange(event) {

		this.sixthQuestionVisible = event.target.value === this.yes;
		this.fifthQuestionresponse = event.target.value;
		this.nameToDraftFifth = event.target.name;
		if (this.fifthQuestionresponse !== '') {
			this.arrayForPushResp.push(this.fifthQuestionresponse);
			this.arrayForPushId.push(this.fifthQuestionVersinId);
		}

		this.fifthResonseValue = this.getLastRespValue();

		this.fifthVersionId = this.getLastIdValue();

		let val = event.target.value;
		//if the value of the fifth Question is yes then total number of question will be 16 otherwise 15.
		if (val === this.yes) {
			this.fifthRadYes = true;
			this.fifthRadNo = false;
			this.countQuestion = 16;
			this.customClass = 'nds-form-element nds-form-containertwo'
		}

		if (val === this.no) {

			this.fifthRadNo = true;
			this.fifthRadYes = false;
			this.sixthQuestionVisible = false;
			this.customClass = 'nds-form-element nds-form-containerthree'
			this.deleteYesBasedRes();
			//if the response value is No then we will delete the repsones of sixth Questions and also make the checkboxes as unchecked.
			let fifthIdStore = this.sixthResponseId;

			DELETE_SELECTED_RESPONSE({ idOfRes: fifthIdStore })
				.then(() => {
					this.tenthCheckAsthma = false;
					this.tenthCheckDiabetes = false;
					this.tenthCheckDepression = false;
					this.tenthCheckHayFever = false;
					this.tenthCheckBp = false;
					this.tenthCheckHighChol = false;
					this.tenthCheckObesity = false;
					this.tenthCheckOsteo = false;
					this.tenthCheckPeptic = false;
					this.tenthCheckplaque = false;
					this.tenthCheckpsoriatic = false;
					this.tenthCheckOthers = false;
					this.sixthResponseValue = '';
					this.sixthVersiD = '';
					this.sixthQResForEach = '';
					this.sixthQVersionResForEach = '';

				})
				.catch((error) => {
					this.showToast( error.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
				});

			this.countQuestion = 15;
		}
	}

	handleFourthQuestionChange(event) {
		this.checPrevoiusVal = this.fourQResForEach;

		let checkval = event.target.value;

		if (checkval === this.relationshipWithff) {
			this.fourthCheckRelatFam = true;
		}

		if (checkval === this.relationshipWithPartner) {
			this.fourthCheckWithPartner = true;
		}

		if (checkval === this.selfEsteem) {
			this.fourthCheckSelfEsteem = true;
		}

		let checkBoval = event.target.checked;

		if (checkBoval) {
			this.fourthCheck = this.yes;
		} else {
			this.unCheckedResVal = event.target.value;
			this.uncheckedArray.push(this.unCheckedResVal);

			let unchVal = event.target.value;

			this.knowTheUnChecked = this.yes;
			if (unchVal === this.relationshipWithff) {
				this.fourthCheckRelatFam = false;
			}

			if (unchVal === this.relationshipWithPartner) {
				this.fourthCheckWithPartner = false;
			}

			if (unchVal === this.selfEsteem) {
				this.fourthCheckSelfEsteem = false;
			}
		}

		this.fourthQuestionResponse = event.target.value;
		this.nameToDraftFourth = event.target.name;

		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersinId);
			this.totalValu.push(this.fourthQuestionResponse);
		}

		this.fourthRspValue = this.getLastRespValue();
		this.fourthVersionId = this.getLastIdValue();
	}
	//getLastRespValue will extract the last input response of the user, its the same for remaining hanler
	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}
	//getLastIdValue will extract the last input response version  id of the user, its the same for remaining hanler
	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}
	//Navigation to other Questionnaire Pages
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
		if (this.targetDateFourteenWks !== null) {
			window.location.assign(this.urlq + labels.QUALITATIVE_FOURTEENWEEKS);
		} else {
			window.location.assign(this.urlq + labels.QUALITATIVE_TWO_MONTHS);
		}
	}

	//When clicked on Return back to Question buttton.This will close the popup and show you the page with all the previous response selection ,just before clicking the button.
	closePopup1() {
		this.resetPopupDraftState();
		this.resetPopupState();
		this.updateArrays();
		this.updateCheckedConditions();
		this.updateRadios();
	}

	resetPopupDraftState() {
		this.sixthCheckedArray = [];
		this.sixthUnChekedArray = [];
		this.filteredArray = [];
		this.filterArr = 'true';

		if (this.sixthResponseValue === '' && this.sixthQResForEach === '') {
			this.unCheckedBoolean = false;
		}
	}

	resetPopupState() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpenDraft = false;
		this.popUpMenu = false;
	}

	updateArrays() {
		const values = this.totalValu.slice(0, 3);
		const concatenatedValues = this.concatenateValues(...values);

		const commonArray = this.getCommonArray();
		const concatenatedMedicValues = this.concatenateValues(...commonArray);

		this.updateFourthChecks(concatenatedValues);
		this.updateMedicalConditionsChecks(concatenatedMedicValues);
	}

	concatenateValues(...values) {
		return [...new Set(values.filter(value => value !== undefined))].join(', ');
	}


	updateFourthChecks(concatenatedValues) {
		const { relationshipWithff: fam, relationshipWithPartner: partner, selfEsteem } = this;

		if (this.knowTheUnChecked === '' && this.fourthCheck !== '') {
			this.fourthCheckRelatFam = concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = concatenatedValues.includes(selfEsteem);
		} else if (this.knowTheUnChecked !== '' && this.fourthCheck === '') {
			this.fourthCheckRelatFam = !concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = !concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = !concatenatedValues.includes(selfEsteem);
		}
	}

	//When clicked on cancelbuttton.This will close the popup and show you the page with all the previous responses just before clicking the button.
	closePopup() {
		this.resetPopupStateForConfirm();
		this.updateFormModalState();
		this.updateResponseStates();
		this.updateMedicalConditions();
		this.updateRadios();
	}

	resetPopupStateForConfirm() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.isPopupOpenDraft = false;
		this.popUpMenu = false;
	}

	updateFormModalState() {
		let fam = this.relationshipWithff;
		let partner = this.relationshipWithPartner;
		let selfEsteem = this.selfEsteem;

		let firstValue = this.getTotalValueAtIndex(0);
		let secondValue = this.getTotalValueAtIndex(1);
		let thirdValue = this.getTotalValueAtIndex(2);

		let concatenatedValues = this.concatenateValues(firstValue, secondValue, thirdValue);
		let concatenatedMedicValues = this.getConcatenatedMedicValues();
		// Create an object to encapsulate the family and partner parameters
		let familyPartnerData = {
			fam,
			partner,
			selfEsteem,
			concatenatedValues
		};

		this.updateFamilyAndPartnerChecks(familyPartnerData);
		this.updateMedicalConditionsChecks(concatenatedMedicValues);
	}

	getTotalValueAtIndex(index) {
		return index < this.totalValu.length ? this.totalValu[index] : undefined;
	}


	getConcatenatedMedicValues() {
		let commonArray = this.getCommonArray();
		return this.concatenateValues(...commonArray);
	}

	getCommonArray() {
		let commonArray = [];
		const conditions = [
			{ flag: this.tenthCheckAsthma, value: this.asthma },
			{ flag: this.tenthCheckDiabetes, value: this.diabetes },
			{ flag: this.tenthCheckDepression, value: this.depression },
			{ flag: this.tenthCheckHayFever, value: this.hayFever },
			{ flag: this.tenthCheckBp, value: this.hypertension },
			{ flag: this.tenthCheckHighChol, value: this.highcholestrol },
			{ flag: this.tenthCheckObesity, value: this.obesityc },
			{ flag: this.tenthCheckOsteo, value: this.osteoporosisc },
			{ flag: this.tenthCheckPeptic, value: this.ulcer },
			{ flag: this.tenthCheckplaque, value: this.psoriasis },
			{ flag: this.tenthCheckpsoriatic, value: this.psoriaticarthritis },
			{ flag: this.tenthCheckOthers, value: this.others }
		];
		conditions.forEach(cond => {
			if (cond.flag) commonArray.push(cond.value);
		});
		return commonArray;
	}

	updateFamilyAndPartnerChecks({ concatenatedValues, fam, partner, selfEsteem }) {
		if (this.knowTheUnChecked === '' && this.fourthCheck !== '') {
			this.fourthCheckRelatFam = concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = concatenatedValues.includes(selfEsteem);
		} else if (this.knowTheUnChecked !== '' && this.fourthCheck === '') {
			this.fourthCheckRelatFam = !concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = !concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = !concatenatedValues.includes(selfEsteem);
		}
	}

	updateMedicalConditionsChecks(concatenatedMedicValues) {
		const medicalConditions = [
			{ value: this.asthma, check: 'tenthCheckAsthma' },
			{ value: this.diabetes, check: 'tenthCheckDiabetes' },
			{ value: this.depression, check: 'tenthCheckDepression' },
			{ value: this.hayFever, check: 'tenthCheckHayFever' },
			{ value: this.hypertension, check: 'tenthCheckBp' },
			{ value: this.highcholestrol, check: 'tenthCheckHighChol' },
			{ value: this.obesityc, check: 'tenthCheckObesity' },
			{ value: this.osteoporosisc, check: 'tenthCheckOsteo' },
			{ value: this.ulcer, check: 'tenthCheckPeptic' },
			{ value: this.psoriasis, check: 'tenthCheckplaque' },
			{ value: this.psoriaticarthritis, check: 'tenthCheckpsoriatic' },
			{ value: this.others, check: 'tenthCheckOthers' }
		];
		medicalConditions.forEach(cond => {
			this[cond.check] = concatenatedMedicValues.includes(cond.value);
		});
	}

	updateRadios() {
		this.updateRadioState({
			response: this.fifthQuestionresponse, yesValue: this.yes, noValue: this.no,
			yesKey: 'fifthRadYes', noKey: 'fifthRadNo'
		});

		this.updateRadioState({
			response: this.secondQuestionResponse, yesValue: this.male, noValue: this.female,
			maybeValue: this.other, yesKey: 'isMale', noKey: 'isFemale', maybeKey: 'isOther'
		});

		this.updateRadioState({
			response: this.eightQuestionResponse, yesValue: this.yes, noValue: this.no,
			maybeValue: this.maybe, yesKey: 'sixthRadYes', noKey: 'sixthRadNo', maybeKey: 'sixthRadMayBe'
		});

		this.updateRadioState({
			response: this.sixteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'forteenththRadYes', noKey: 'forteenthRadNo', maybeKey: 'forteenthRadMaybe'
		});

		this.updateRadioState({
			response: this.fifteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'thirteenththRadYes', noKey: 'thirteenththRadNo', maybeKey: 'thirteenththRadMaybe'
		});

		this.updateRadioState({
			response: this.ninthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'eleventhRadYes', noKey: 'eleventhRadNo', maybeKey: 'eleventhRadMaybe'
		});

		this.updateRadioState({
			response: this.tenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'secondRadYes', noKey: 'secondRadNo', maybeKey: 'secondRadMaybe'
		});

		this.updateRadioState({
			response: this.firstQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'firstRadYes', maybeKey: 'firstRadMaybe', noKey: 'firstRadNo'
		});

		this.updateRadioState({
			response: this.eleventhQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'thirdRadYes', maybeKey: 'thirdRadMaybe', noKey: 'thirdRadNo'
		});

		this.updateRadioState({
			response: this.secondQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'secondRadYes', maybeKey: 'secondRadMaybe', noKey: 'secondRadNo'
		});

		this.updateRadioState({
			response: this.thirdQuestionResponse, yesValue: this.yes,
			noValue: this.no, yesKey: 'thirdIsYes', noKey: 'thirdIsNo'
		});

		this.updateRadioState({
			response: this.seventhQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'afterSixthRadYes', maybeKey: 'afterSixthRadMaybe', noKey: 'afterSixthRadNo'
		});

		this.updateRadioState({
			response: this.twelvthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'fourthRadYes', maybeKey: 'fourthRadMaybe', noKey: 'fourthRadNo'
		});


		this.updateRadioState({
			response: this.thirteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'seventhRadYes', maybeKey: 'seventhRadMaybe', noKey: 'seventhRadNo'
		});

		this.updateRadioState({
			response: this.fourteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'twelthRadYes', maybeKey: 'twelthRadMaybe', noKey: 'twelthRadNo'
		});
	}

	updateRadioState({ response, yesValue, noValue, maybeValue, yesKey, noKey, maybeKey }) {
		this[yesKey] = response === yesValue;
		this[noKey] = response === noValue;
		if (maybeValue !== undefined) {
			this[maybeKey] = response === maybeValue;
		}
	}


	//On click the PAGE will become static then it will show you the popup based on the criteria that gets matched.
	submitResponses() {
		if (this.isDesktop) {
			//this will make the page as static
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		const allInputs = this.template.querySelectorAll('input[type="radio"]:checked');
		const fifthQuestionChecked = this.template.querySelector('input[name="NinthQuestionResponse"]:checked');
		const sixthQuestionChecked = this.template.querySelectorAll('input[name="tenthQuestionResponse"]:checked');

		if (allInputs.length < 14) {
			this.customFormModal = true;
			this.isPopupOpenDraft = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		} else if (fifthQuestionChecked && fifthQuestionChecked.value === 'No') {
			this.customFormModal = true;
			this.isPopupOpenDraft = false;
			this.isPopupOpen = true;
			this.checkYesOrNo = false;
		} else if (fifthQuestionChecked && fifthQuestionChecked.value === 'Yes' && sixthQuestionChecked.length === 0) {
			this.customFormModal = true;
			this.isPopupOpenDraft = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		} else {
			this.customFormModal = true;
			this.isPopupOpenDraft = false;
			this.isPopupOpen = true;
			this.checkYesOrNo = false;
		}
	}

	//hiding the popup
	get popuphide() {
		if (this.popUpMenu === true) {
			return this.popUpMenu === true ? 'disabled' : '';
		}
		return '';
	}
	//on click of the draft button
	// Utility function to adjust body overflow style based on the view mode
	adjustBodyOverflow() {
		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = ''; // Reset to default
		}
	}

	// Utility function to gather responses
	gatherResponses() {
		this.checkinc = 0;

		// Fourth response processing
		let fourthResponseArray = [];
		if (this.fourthCheckRelatFam) fourthResponseArray.push(this.relationshipWithff);
		if (this.fourthCheckWithPartner) fourthResponseArray.push(this.relationshipWithPartner);
		if (this.fourthCheckSelfEsteem) fourthResponseArray.push(this.selfEsteem);
		this.fourthRspValue = [...new Set(fourthResponseArray.filter(value => value !== undefined))].join(', ');

		// Tenth response processing
		let commonArray = [];
		if (this.tenthCheckAsthma) commonArray.push(this.asthma);
		if (this.tenthCheckDiabetes) commonArray.push(this.diabetes);
		if (this.tenthCheckDepression) commonArray.push(this.depression);
		if (this.tenthCheckHayFever) commonArray.push(this.hayFever);
		if (this.tenthCheckBp) commonArray.push(this.hypertension);
		if (this.tenthCheckHighChol) commonArray.push(this.highcholestrol);
		if (this.tenthCheckObesity) commonArray.push(this.obesityc);
		if (this.tenthCheckOsteo) commonArray.push(this.osteoporosisc);
		if (this.tenthCheckPeptic) commonArray.push(this.ulcer);
		if (this.tenthCheckplaque) commonArray.push(this.psoriasis);
		if (this.tenthCheckpsoriatic) commonArray.push(this.psoriaticarthritis);
		if (this.tenthCheckOthers) commonArray.push(this.others);
		this.sixthResponseValue = [...new Set(commonArray.filter(value => value !== undefined))].join(', ');
	}

	// Utility function to handle responses and versions
	handleResponsesAndVersions() {
		const responsePairs = [
			{ response: this.firstQuestionResponse, draftResponse: this.firstQResForEach, responseValue: this.firstRspValue, versionId: this.firstRespVersId, versionDraft: this.firstQVersionResForEach },
			{ response: this.secondQuestionResponse, draftResponse: this.secQResForEach, responseValue: this.secondRspValue, versionId: this.secondRespVersId, versionDraft: this.secQVersionResForEach },
			{ response: this.thirdQuestionResponse, draftResponse: this.thirdQResForEach, responseValue: this.thirdRspValue, versionId: this.thirdVersionId, versionDraft: this.thirdQVersionResForEach },
			{ response: this.fourthQuestionResponse, draftResponse: this.fourQResForEach, responseValue: this.fourthRspValue, versionId: this.fourthVersionId, versionDraft: this.fourQVersionResForEach, recId: this.fourthRecId },
			{ response: this.fifthQuestionresponse, draftResponse: this.fifthQResForEach, responseValue: this.fifthResonseValue, versionId: this.fifthVersionId, versionDraft: this.fifthQVersionResForEach },
			{ response: this.sixthQuestionResponse, draftResponse: this.sixthQResForEach, responseValue: this.sixthResponseValue, versionId: this.sixthVersiD, versionDraft: this.sixthQVersionResForEach, recId: this.sixthResponseId },
			{ response: this.seventhQuestionResponse, draftResponse: this.sevenQResForEach, responseValue: this.seventhRespalue, versionId: this.seventhVersiD, versionDraft: this.sevenQVersionResForEach },
			{ response: this.eightQuestionResponse, draftResponse: this.eigthQResForEach, responseValue: this.eghtResponseValue, versionId: this.eightVersiId, versionDraft: this.eigthQVersionResForEach },
			{ response: this.ninthQuestionResponse, draftResponse: this.nineQResForEach, responseValue: this.ninthResponseValue, versionId: this.ninthVersId, versionDraft: this.nineQVersionResForEach },
			{ response: this.tenthQuestionResponse, draftResponse: this.tenthQResForEach, responseValue: this.tenthResponseValue, versionId: this.tenthVersId, versionDraft: this.tenthQVersionResForEach },
			{ response: this.eleventhQuestionResponse, draftResponse: this.eleventhQResForEach, responseValue: this.eleventhResponseValue, versionId: this.eleventhVersiD, versionDraft: this.eleventhQVersionResForEach },
			{ response: this.twelvthQuestionResponse, draftResponse: this.twelthQResForEach, responseValue: this.twelvthRespalue, versionId: this.twelvthVersiD, versionDraft: this.twelthQVersionResForEach },
			{ response: this.thirteenthQuestionResponse, draftResponse: this.thirteenthQResForEach, responseValue: this.thirteenthResponseValue, versionId: this.thirteenthVersiId, versionDraft: this.thirteenthQVersionResForEach },
			{ response: this.fourteenthQuestionResponse, draftResponse: this.fourteenthQResForEach, responseValue: this.fourteenthResponseValue, versionId: this.fourteenthVersId, versionDraft: this.fourteenthQVersionResForEach },
			{ response: this.fifteenthQuestionResponse, draftResponse: this.fifteenthQResForEach, responseValue: this.fifteenthResponseValue, versionId: this.fifteenthVersId, versionDraft: this.fifteenthQVersionResForEach },
			{ response: this.sixteenthQuestionResponse, draftResponse: this.sixteenthQResForEach, responseValue: this.sixteenthResponseValue, versionId: this.sixteenthVersId, versionDraft: this.sixteenthQVersionResForEach }
		];

		this.realRespArray = [];
		this.realAssesVerArra = [];

		responsePairs.forEach(pair => {
			if (pair.response === '' && pair.draftResponse !== '') {
				this.realRespArray.push(pair.draftResponse);
				this.realAssesVerArra.push(pair.versionDraft);
			} else {
				this.realRespArray.push(pair.responseValue);
				this.realAssesVerArra.push(pair.versionId);
			}

			// Special case handling for the fourth and sixth responses
			if ((pair.response === '' && pair.draftResponse !== '') || pair.responseValue === '') {
				if (pair.responseValue === '' && pair.recId) {
					DELETE_SELECTED_RESPONSE({ idOfRes: pair.recId })
						.then(() => {
							if (pair.responseValue === '') {
								this.realAssesVerArra[this.realAssesVerArra.length - 1] = '';
								if (pair.recId === this.fourthRecId) {
									this.fourthCheckRelatFam = false;
									this.fourthCheckWithPartner = false;
									this.fourthCheckSelfEsteem = false;
								}
								if (pair.recId === this.sixthResponseId) {
									this.tenthCheckAsthma = false;
									this.tenthCheckDiabetes = false;
									this.tenthCheckDepression = false;
									this.tenthCheckHayFever = false;
									this.tenthCheckBp = false;
									this.tenthCheckHighChol = false;
									this.tenthCheckObesity = false;
									this.tenthCheckOsteo = false;
									this.tenthCheckPeptic = false;
									this.tenthCheckplaque = false;
									this.tenthCheckpsoriatic = false;
									this.tenthCheckOthers = false;
									this.sixthQResForEach = '';
									this.sixthQVersionResForEach = '';
								}
							}
						})
						.catch((error) => {
							this.showToast( error.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
						});
				}
			}
		});
	}

	// saveAsDraft method
	saveAsDraft() {
		this.adjustBodyOverflow();
		this.popUpMenu = true;
		this.checkinc = 0;

		this.gatherResponses();
		this.handleResponsesAndVersions();

		let nonEmptyResponses = this.realRespArray.filter(response => response !== '');
		let nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

		if (nonEmptyResponses.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: false,
				isQsqAfterTwoMonths: false
			})
				.then(() => {
					this.customFormModal = false;
					this.closePopup1 = false;
					this.checkYesOrNo = false;
					this.popUpMetod();
				})
				.catch((error) => {
					this.showToast( error.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
				});
		} else {
			window.location.assign(this.urlq + labels.OUT_STANDING_URL);
		}
	}

	// confirmSubmission method
	confirmSubmission() {
		this.checkinc = 1;

		this.gatherResponses();
		this.handleResponsesAndVersions();

		let nonEmptyResponses = this.realRespArray.filter(response => response !== '');
		let nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

		if (nonEmptyResponses.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: true,
				isQsqAfterTwoMonths: false
			})
				.then(() => {
					window.location.assign(this.urlq + labels.OUT_STANDING_URL);
				})
				.catch((error) => {
					this.showToast( error.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
	}
	//save as draft popup
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
			this.showToast( error.message, labels.ERROR_VARIANT); // Catching Potential Error
		}
	}
	//closes the save as draft popup
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}

	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq +labels.ERROR_PAGE);
	}
}