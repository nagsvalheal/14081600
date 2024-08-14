// This LWC is used to create case record for Type - PSP Platform
// To import Libraries
import { LightningElement,api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';
// To import Apex Classes
import INSERT_UPDATE_LEAD_CONSENT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.createCase';
import UPDATE_CASE from '@salesforce/apex/BI_PSPB_SupportCenterCtrl.updateCase';
import UPDATE_DRAFT from '@salesforce/apex/BI_PSPB_SupportCenterCtrl.updateDraft';
import CASE_DRAFT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.caseDraft';
import CASE_RECORDS_GET from '@salesforce/apex/BI_PSPB_DraftSupportCtrl.getPSPCaseRecordsPlatformSupport';
import ENROLLE_GET from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbPlatformSupport extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @api
	@api acceptedFormats = '.jpg,.jpeg,.png,.pdf'; // Set the accepted file formats
	@api recordId; // Pass the record ID if applicable

	// Declaration of variables with @track
	showSpinner = true;
	casePopup = false;
	draftPopup = false;
	platformSuppport = support.PLATFORM_HEAD;
	descriptionErr = support.DESCRIPTION_ERROR;
	descritionErrChar = support.DESCRIPTION_ERROR_CHAR;
	backValue = support.BACK;
	createCase = support.CREATE_CASE;
	createDraft = support.CREATE_DRAFT;
	maxLimit =support.MAX_LIMIT;
	browesAndUpload = support.BROWS_AND_UPLOAD;
	fiveMb = support.FIVEMB;
	attachment = support.ATTACHMENT;
	descriptionValue = support.DESCRIPTION;
	successMsg = support.SUCCESS_MSG;
	successMessage  = support.SUCCESS_MESSAGE;
	urlq;
	showDivSubmit = false;
	showDivDraft = false;
	fileIcon = support.MY_ICON;
	isFormVisible = false;
	isFormVisibleOne = false;
	isFormVisibleTwo = false;
	isFormVisibleThree = false;
	fieldOne = '';
	fieldTwo = '';
	subTypError = false;
	descriptionError = false;
	files = [];
	back = false;
	// to invoke CSS '' are useed
	classFive = 'desc';
	contact = true;
	selectedOption;
	userId = support.ID;
	accName;
	fileName;
	caseRecord;
	caseMedicalId = null;
	caseType;
	medicalSubType;
	medicalDescription;
	selectedOptionValues;
	description = '';
	medicalDataGet;
	descriptionLengthError = false;
	browserName = true;
	fileNames;
	showFileNames = false;
	radioBtnColorChange = ''
	caseSubType;
	dataValue;
	caseDescription;
	selectedItemId;
	// Declaration of variables
	rightImg = support.TIC;
	iconWarning = support.WARNING;
	buttonImage = support.IMG;
	backArrow = support.ARROW;
	parametershnImg = support.PHN_IMG;
	emailImg = support.EMAIL_IMG;
	subType = ''; // Initialize with an empty string
	caseRecordId;
	isButtonDisabled = false;
	isSubmitButtonDisabled;
	// used in HTML file

	connectedCallback() {
		let globalThis = window;
		this.selectedItemId = globalThis.sessionStorage.getItem(
			"caseRecordId"
		);
		
		globalThis?.addEventListener('beforeunload', this.handlePageRefresh);

		this.loadCaseRecords();
		loadStyle(this, support.CASE_RADIO_BTN);
		try {
			this.detectBrandedOrUnassigned();

			ENROLLE_GET({ userId: this.userId })
				.then(result => {

					if (result !== null) {

						if (result[0].patientEnrolle !== null) {
							this.accName = result[0].patientEnrolle.Id;
						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
						this.showSpinner = false;
					}
				})
				// Null data is checked and AuraHandledException is thrown from the Apex
				.catch(error => {
					this.navigateToAnotherPage(support.ENROLL_NOT_GET,error.message);
				})
		} catch (error) {
			this.navigateToAnotherPage(error.message);
		}
	}
	handlePageRefresh() {
		let globalThis = window;
		globalThis.sessionStorage?.clear();

	}
	ClosePopup(){
		this.casePopup = false;
		this.draftPopup = false;
		this.isButtonDisabled = false;
		this.isSubmitButtonDisabled = false;
	}
	loadCaseRecords() {
		const promise = CASE_RECORDS_GET({ accountId: this.selectedItemId });
	
		// Manually resolve the promise
		promise.then(data => {
			if (data && data.length > 0) {
				this.caseRecord = data[0];
				this.caseMedicalId = data[0].Id;
				this.caseType = data[0].Type;
				this.description1 = data[0].Description;
				this.selectedOptionValues = data[0].BI_PSPB_Sub_Type__c;
				this.selectedOption = this.selectedOptionValues;
				this.description = this.description1;
				this.medStatus = data[0].Status;
	
				if (this.medStatus === support.NEED_MORE_INFO) {
					this.isReadOnly = true;
				}
			}
		});
	}

handleRadioChange(event) {
		this.selectedOption = event.target.value;
		this.subTypError = false;
}
handleDescriptionErr(){
	this.classFive = 'change';
	this.template.querySelector("div[data-field='desc']").className = 'input-error-label';
}
handleDescription(){
	this.classFive = 'desc';
	this.template.querySelector("div[data-field='desc']").className = 'input-label';
}
	handledescription(event) {
		this.description = event.target.value;
		if (this.description === '') {
			this.descriptionError = true;
			this.descriptionLengthError = false;
			// Double quotes can't be avoided since it's invoked from CSS
			this.handleDescriptionErr();
		}
		else {
			this.descriptionError = false;
			this.handleDescription();
			this.descriptionLengthError = false;
			// Double quotes can't be avoided since it's invoked from CSS
			
		}
	}

	handleUploadFinished(event) {
		const UPLOADED_FILES = event.detail.files;
		this.files = UPLOADED_FILES;
		this.fileNames = this.files.map(file => {
			const MAX_LENGTH = 24; // Maximum length of displayed filename
			return file.name.length > MAX_LENGTH ? file.name.substring(0, MAX_LENGTH) + '...' : file.name;
		});
		this.showFileNames = true;
		this.browserName = false;

	}

	handleInsertUpdate(event) {
		this.caseType = event.currentTarget.dataset.value;
		const FILE_IDS = this.files.map(file => file.documentId);
		const PARAMETERS = {
			accountId: this.accName,
			type: this.caseType,
			subType: this.selectedOption,
			description: this.description
		};
		if (!this.validateDescription()) {
			return;
		}
		this.processOperation(PARAMETERS, FILE_IDS);
		
	}
	validateDescription() {
		if (!this.description) {
			this.descriptionError = true;
			this.descriptionLengthError = false;
			this.handleDescriptionErr();
			return false;
		}
		else if (this.description.length > 1000) {
			this.descriptionError = false;
			this.descriptionLengthError = true;
			this.handleDescriptionErr();
			return false;
		}
		this.descriptionError = false;
		this.descriptionLengthError = false;
		this.handleDescription();
		return true;
	}
	processOperation(PARAMETERS, FILE_IDS) {
		const globalThis = window;
		if (this.caseMedicalId === null) {
			this.insertOrUpdateLeadConsent(PARAMETERS, FILE_IDS, globalThis);
		} else {
			this.updateCase(FILE_IDS, globalThis);
		}
}
	insertOrUpdateLeadConsent(parameters, fileIds, globalThis) {
	try{
		INSERT_UPDATE_LEAD_CONSENT({ wrapper: parameters, fileIds });
		this.showDivSubmit = true;
		this.showDivDraft = false;
		globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
		this.resetFormState();
		this.casePopup = true;
	}
	catch(error){
		this.navigateToAnotherPage(support.CASE_NOT_INSERT, error.message);
	}
		} 
		

	updateCase(FILE_IDS, globalThis) {
			try{
				UPDATE_CASE({ recId: this.caseMedicalId, description: this.description,fileIds: FILE_IDS });
				this.resetFormState();	
				this.casePopup = true;			
				globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
		}catch(error){
			this.navigateToAnotherPage(support.CASE_NOT_UPDATE, error.message);
		}
		
	}
	resetFormState() {
		this.description = '';
		this.fileNames = '';
		this.browserName = true;
		this.descriptionLengthError = false;
		this.handleDescription();
	}
					
	handleInsertDraft(event) {
		this.caseType = event.currentTarget.dataset.value;
		const FILE_IDS = this.files.map(file => file.documentId);
		const PARAMETERS = {
			accountId: this.accName,
			type: this.caseType,
			subType: this.selectedOption,
			description: this.description
		};
	
		if (!this.validateDescription()) {
			return;
		}
	
		this.processDraftOperation(PARAMETERS, FILE_IDS);
	}
	processDraftOperation(PARAMETERS, FILE_IDS) {
		const globalThis = window;

		if (this.caseMedicalId === null) {
			this.insertDraft(PARAMETERS, FILE_IDS, globalThis);
		} else {
			this.updateDraft(FILE_IDS, globalThis);
		}
	}
	insertDraft(parameters, fileIds, globalThis) {
		this.isButtonDisabled = true;
		this.isSubmitButtonDisabled = true;
	
		try{
			const button = this.template.querySelector('.button2');
			this.dataValue = button.getAttribute('data-value');
			this.callfunction();
			CASE_DRAFT({ wrapper: parameters, fileIds });
			this.loadCaseRecords();
			this.updateUIAfterInsertDraft(globalThis);
			this.draftPopup = true;
			
		}
		catch(error){
			this.navigateToAnotherPage(support.DRAFT_NOT_INSERT, error.message);
		}
		
	}
	updateDraft(FILE_IDS, globalThis) {
		try{
			
			UPDATE_DRAFT({
				recId: this.caseMedicalId,
				type: this.selectedOption,
				description: this.description,
				fileIds: FILE_IDS
			});
			this.updateUIAfterInsertDraft(globalThis);
			this.draftPopup = true;
		}catch(error){
			this.navigateToAnotherPage(support.DRAFT_NOT_UPDATE, error.message);
		}
			
	}
	updateUIAfterInsertDraft(globalThis) {
		this.showDivDraft = true;
		this.showDivSubmit = false;
		globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
		this.resetFormState();
	}
			
	callfunction() {
		if (this.showDivDraft === true || this.dataValue) {
			this.isSubmitButtonDisabled = true;
		}
		else {
			this.isSubmitButtonDisabled = false;
		}
	}

	handleBack() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + support.SUPPORT_PAGE_URL);
	}
	handleclose() {
		this.showDivSubmit = false;
		this.showDivDraft = false;
		this.isButtonDisabled = false;
		this.isSubmitButtonDisabled = false;
	}
	detectBrandedOrUnassigned() {
		let globalThis = window;
		const CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
		//set the url and navigations are done within branded site 
		if (DESIRED_COMPONENT && DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
			this.urlq = support.BRANDED_URL_NAVI;
		}
		//set the url and navigations are done within unassigned site 
		else {
			this.urlq = support.UNASSIGNED_URL_NAVI;
		}
	}
	navigateToAnotherPage(errorMessage){
		let global = window;
		global.location?.assign(this.urlq + support.ERROR_PAGE);
		global.sessionStorage.setItem('errorMessage', errorMessage);
	}

}