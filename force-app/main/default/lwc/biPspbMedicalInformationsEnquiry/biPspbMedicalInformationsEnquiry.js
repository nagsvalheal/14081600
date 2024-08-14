// This LWC is used to create case records for Type - Medical Information Enquiry
// To import Libraries
import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { loadStyle } from 'lightning/platformResourceLoader';
// To import Apex Classes
import INSERT_UPDATE_LEAD_CONSENT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.createCase';
import UPDATE_CASE from '@salesforce/apex/BI_PSPB_SupportCenterCtrl.updateCase';
import UPDATE_DRAFT from '@salesforce/apex/BI_PSPB_SupportCenterCtrl.updateDraft';
import CASE_DRAFT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.caseDraft';
import CASE_RECORDS_GET from '@salesforce/apex/BI_PSPB_DraftSupportCtrl.getPSPCaseRecordsMedical';
import ENROLLE_GET from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbMedicalInformationEnquiry extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @api
	
	@api acceptedFormats = '.jpg,.jpeg,.png,.pdf'; // Set the accepted file formats
	@api recordId; // Pass the record ID if applicable
	// Declaration of variables with @track
	showSpinner = true;
	caseContetn = 'ithu case uh';
	draftContent = 'ithu draft uh'
	casePopup = false;
	draftPopup = false;
	medicalInfoHead = support.MEDICAL_HEAD;
	backValue = support.BACK;
	createCase = support.CREATE_CASE;
	createDraft = support.CREATE_DRAFT;
	maxLimit =support.MAX_LIMIT;
	browesAndUpload = support.BROWS_AND_UPLOAD;
	fiveMb = support.FIVEMB;
	attachment = support.ATTACHMENT;
	descriptionValue = support.DESCRIPTION;
	selectType = support.SELECT_TYPE;
	successMsg = support.SUCCESS_MSG;
	successMessage  = support.SUCCESS_MESSAGE;
	// to invoke CSS '' are useed
	back = false;
	classOne = 'buttonbox';
	classTwo = 'buttonbox';
	classThree = 'buttonbox';
	classFour = 'buttonbox';
	classFive = 'desc';
	classSix = 'desc';
	classSeven = 'desc';
	urlq;
	contact = true;
	showCollectButton = true;
	caseType;
	selectedOption;
	userId = support.ID;
	accName;
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
	caseRecord;
	caseMedicalId = null;
	medicalSubType;
	medicalDescription;
	dataValue;
	selectedOptionValues;
	description = '';
	medicalDataGet;
	descriptionLengthError = false;
	browserName = true;
	fileName;
	fileNames;
	showFileNames = false;
	radioBtnColorChange = '';
	faultValue = false;
	filess = [];
	fileDetails = [];
	errorMessage;
	caseSubType;
	caseDescription;
	isReadOnly = false;
	medStatus;
	selectedItemId;
	// Declaration of variables
	rightImg = support.TIC;
	iconWarning = support.WARNING;
	buttonImage = support.IMG;
	backArrow = support.ARROW;
	phnImg = support.PHN_IMG;
	emailImg = support.EMAIL_IMG;
	subType = ''; // Initialize with an empty string
	caseRecordId;
	checkCaseRadiBtn = '';
	isButtonDisabled = false;
	isSubmitButtonDisabled;

	// used in HTML file
	subTypeErr=support.SUBTYPE_ERROR;
	descriptionErr = support.DESCRIPTION_ERROR;
	descritionErrChar = support.DESCRIPTION_ERROR_CHAR;

	subTypeOptions = [
		{ label: support.PRODUCT, value: support.PRODUCT },
		{ label: support.TREATMENT, value: support.TREATMENT }
	];

	connectedCallback() {
		try {
			this.handleSessionStorage();
			this.addEventListeners();
			this.loadCaseRecords();
			this.loadStyles();
			this.handleEnrollment();
			this.determineDesiredComponent();
		} catch (error) {
			this.navigateToAnotherPage(error.message);
		}
	}
	
	handleSessionStorage() {
		let globalThis = window;
		if (typeof globalThis !== support.UNDIFINED) {
			this.selectedItemId = globalThis.sessionStorage.getItem("caseRecordId");
			
		}
	}
	ClosePopup(){
		this.casePopup = false;
		this.draftPopup = false;
		this.isButtonDisabled = false;
		this.isSubmitButtonDisabled = false;
	}
	addEventListeners() {
		let globalThis = window;
		globalThis?.addEventListener('beforeunload', this.handlePageRefresh);
	}
	
	loadStyles() {
		loadStyle(this, support.CASE_RADIO_BTN);
		loadStyle(this, support.RADIO_BTN_COLOR_CHNAGE);
	}
	
	handleEnrollment() {
		ENROLLE_GET()
			.then((result) => {
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
			.catch((error) => {
				this.navigateToAnotherPage(support.ENROLL_NOT_GET,error.message);
			});
	}
	
	determineDesiredComponent() {
		let globalThis = window;
		const CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find((component) =>
			[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(
				component.toLowerCase()
			)
		);
	
		if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
			this.urlq = support.BRANDED_URL_NAVI;
		} else {
			this.urlq = support.UNASSIGNED_URL_NAVI;
		}
	}
	
	handlePageRefresh() {
		let globalThis = window;
		globalThis.sessionStorage?.clear();

	}

	handleclose() {
		this.showDivSubmit = false;
		this.showDivDraft = false;
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


	getmedicalinformation(event) {
		this.medicalDataGet = event.target.value;
	}
	handleRadioChange(event) {
		this.selectedOption = event.target.value;
		this.subTypError = false;
		this.radioBtnColorChange = 'chnageradiobtn1'; // invoked in CSS file
	}
	handledescription(event) {
		this.description = event.target.value;
		if (this.description) {
			this.descriptionError = false;
			// Double quotes can't be avoided since it's invoked from CSS
			this.Description();
			this.descriptionLengthError = false;
		}
		this.descriptionError = false;
	}
	Description(){
		this.template.querySelector("label[data-field='Description']").className =
				'input-error';
			this.classFive = 'desc';
	}
	DescriptionErr(){
		this.template.querySelector("label[data-field='Description']").className =
				'input-error-label';
			this.classFive = 'change'; 
	}
	handleUploadFinished(event) {
		const UPLOADED_FILES = event.detail.files;
		this.files = UPLOADED_FILES;
		this.fileNames = this.files.map((file) => {
			const MAX_LENGTH = 24; // Maximum length of displayed filename
			return file.name.length > MAX_LENGTH
				? file.name.substring(0, MAX_LENGTH) + '...'
				: file.name;
		});
		this.showFileNames = true;
		this.browserName = false;
	}
	handleInsertUpdate(event) {
    let globalThis = window;
    this.caseType = event.currentTarget.dataset.value;
    const FILE_IDS = this.files.map((file) => file.documentId);
    const PARAMETERS = {
        accountId: this.accName,
        type: this.caseType,
        subType: this.selectedOption,
        description: this.description
    };

    if (!this.validateInputs()) {
        return;
    }

    const MAX_LENGTH = 1000;
    if (this.description.length > MAX_LENGTH) {
        this.handleDescriptionLengthError();
        return;
    }

    if (this.caseMedicalId === null) {
        this.insertCase(PARAMETERS, FILE_IDS, globalThis);
    } else {
        this.updateCase(PARAMETERS, FILE_IDS, globalThis);
    }
}

validateInputs() {
    const validationType = this.getValidationType();

    switch (validationType) {
        case support.OPTION_AND_DESC:
            this.handleMissingOptionAndDescription();
            return false;
        case support.MISS_DESCRIPTION:
            this.handleMissingDescription();
            return false;
        case support.MISS_OPTION:
            this.handleMissingOption();
            return false;
        default:
            return true;
    }
}

getValidationType() {
    if (!this.selectedOption && !this.description) {
        return support.OPTION_AND_DESC;
    } else if (this.selectedOption && !this.description) {
        return support.MISS_DESCRIPTION;
    } else if (!this.selectedOption && this.description) {
        return support.MISS_OPTION;
    }
        return support.VALID;
}

handleMissingOptionAndDescription() {
    this.changeRadioBtnColor();
    this.descriptionLengthError = false;
    this.descriptionError = true;
    this.DescriptionErr();
    this.faultValue = true;
}

handleMissingDescription() {
    this.DescriptionErr();
    this.descriptionError = true;
    this.descriptionLengthError = false;
    this.faultValue = true;
}

handleMissingOption() {
    this.changeRadioBtnColor();
    this.descriptionError = false;
    this.faultValue = true;
    this.Description();
}

handleDescriptionLengthError() {
    this.descriptionError = false;
    this.descriptionLengthError = true;
    this.DescriptionErr();
    this.faultValue = true;
}
navigateToAnotherPage(errorMessage){
	let global = window;
	global.location?.assign(this.urlq + support.ERROR_PAGE);
	global.sessionStorage.setItem('errorMessage', errorMessage);
}

insertCase(PARAMETERS, FILE_IDS, globalThis) {
    try {
        INSERT_UPDATE_LEAD_CONSENT({ wrapper: PARAMETERS, fileIds: FILE_IDS });
        this.showDivSubmit = true;
        this.showDivDraft = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.makeEmptyField();
		this.casePopup = true;
    } catch (error) {
		this.navigateToAnotherPage(support.CASE_NOT_INSERT, error.message);
    }
}

updateCase(PARAMETERS, FILE_IDS, globalThis) {
    try {
        UPDATE_CASE({
            recId: this.caseMedicalId,
            //type: this.caseType,
			type:this.selectedOption,
            description: this.description,
            fileIds: FILE_IDS
        });
        this.showDivSubmit = true;
        this.showDivDraft = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.makeEmptyField();
        this.isReadOnly = false;
		this.casePopup = true;
    } catch (error) {
        this.navigateToAnotherPage(support.CASE_NOT_UPDATE, error.message);
    }
}

handleInsertDraft(event) {
	
    this.caseType = event.currentTarget.dataset.value;

    const FILE_IDS = this.files.map((file) => file.documentId);
    const PARAMETERS = this.createParameters();
	

    if (!this.validateInputsDraft()) {
        return;
    }

    if (this.description.length > 1000) {
        this.handleDescriptionLength();
        return;
    }

    if (this.caseMedicalId === null) {
        this.insertDraftCase(PARAMETERS, FILE_IDS);
    } else {
        this.updateDraftCase(PARAMETERS, FILE_IDS);
    }
}

createParameters() {
    return {
        accountId: this.accName,
        type: this.caseType,
        subType: this.selectedOption,
        description: this.description
    };
}

validateInputsDraft() {
    switch (true) {
        case !this.selectedOption && !this.description:
            this.handleMissingOptionAndDescriptionOne();
            return false;
        case this.selectedOption && !this.description:
            this.handleMissingDescription();
            return false;
        case !this.selectedOption && this.description:
            this.handleMissingOptionOne();
            return false;
        default:
            return true;
    }
}

handleDescriptionLength() {
    this.descriptionError = false;
    this.descriptionLengthError = true;
    this.DescriptionErr();
}

insertDraftCase(PARAMETERS, FILE_IDS) {
	
    let globalThis = window;
    const button = this.template.querySelector('.button2');
    this.dataValue = button.getAttribute('data-value');
    this.callfunction();
    try {
        this.isButtonDisabled = true;
        CASE_DRAFT({ wrapper: PARAMETERS, fileIds: FILE_IDS });
        this.showDivDraft = true;
        this.showDivSubmit = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.errorMessage = '';
        this.classFive = 'desc';
        this.makeEmptyField();
        this.loadCaseRecords();
		this.draftPopup = true;
    } catch (error) {
		this.navigateToAnotherPage(support.DRAFT_NOT_INSERT, error.message);
    }
}

updateDraftCase(PARAMETERS, FILE_IDS) {
    let globalThis = window;

    try {
        UPDATE_DRAFT({
            recId: this.caseMedicalId,
           // type: this.caseType,
		type: this.selectedOption,
            description: this.description,
            fileIds: FILE_IDS
        });
        this.showDivDraft = true;
        this.showDivSubmit = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.makeEmptyField();
        this.isReadOnly = false;
		this.draftPopup = true;
    } catch (error) {
        this.navigateToAnotherPage(support.DRAFT_NOT_UPDATE, error.message);
    }
    this.callfunction();
}
handleMissingOptionAndDescriptionOne() {
    this.changeRadioBtnColor();
    this.DescriptionErr();
    this.descriptionLengthError = false;
    this.descriptionError = true;
    this.faultValue = true;
}


handleMissingOptionOne() {
    this.changeRadioBtnColor();
    this.descriptionError = false;
    this.faultValue = true;
    if (this.description.length > 1000) {
        this.handleDescriptionLengthError();
    }
}

makeEmptyField(){
	this.descriptionLengthError = false;
						this.caseType = '';
						this.selectedOption = '';
						this.description = '';
						this.fileNames = '';
						this.browserName = true;
}
changeRadioBtnColor(){
	this.radioBtnColorChange = 'chnageradiobtn'; 
			this.subTypError = true;
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

}