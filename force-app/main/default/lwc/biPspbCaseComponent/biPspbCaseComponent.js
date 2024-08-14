// This Lightning Web Component in Salesforce manages case records, enables filtering and view case details.
// To import Library files
import { LightningElement, wire,api} from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';
// To import Apex Classes
import CASESER from '@salesforce/apex/BI_PSPB_CaseSupportCtrl.getCases';
import CASE_DETAILS from '@salesforce/apex/BI_PSPB_CaseSupportCtrl.getCaserecord';
import CASE_IMAGE from '@salesforce/apex/BI_PSPB_CaseSupportCtrl.getBaseImage';
import ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';

// To display the records in column view
import{support} from 'c/biPspbSupportCaseResources';

const COLUMNS = [
	{ label: support.LABEL_CASENUMBER, fieldName: 'CaseNumber' },
	{ label: support.LABEL_SUBJECT, fieldName: 'Subject' },
	{ label: support.LABEL_STATUS, fieldName: 'Status' },
	{ label: support.LABEL_PRIORITY, fieldName: 'Priority' },
	{ label: support.LABEL_TYPE, fieldName: 'Type' }
];
// To filter records based on type
const TYPE_OPTIONS = [
	{ label: support.LABEL_MIE, value: support.LABEL_MIE },
	{ label: support.LABEL_RAE, value: support.LABEL_RAE },
	{ label: support.LABEL_PSP, value: support.LABEL_PSP }
];
// To filter records based on status
const STATUS_OPTIONS = [
	{ label: support.LABEL_DRAFT, value: support.LABEL_DRAFT },
	{ label: support.LABEL_SUBMITTED, value: support.LABEL_SUBMITTED }
];

export default class BiPspbCaseComponent extends NavigationMixin(LightningElement)
{

	// Declaration of variable with @track
	showSpinner = true;
	status = support.LABEL_STATUS;
	subType = support.SUB_TYPE;
    desciption = support.DECRIPTIOS;
    createdOn = support.CREATED_ON;
    createdBy = support.CREATED_BY;
    noCase = support.ALL_CREAR;
    none = support.NONE;
	attachment = support.ATTACHMENT;
	myCase = support.MYCASE;
	cases = [];
	caseTypeFilter = '';
	typeFilter = support.LABEL_ALL;
	statusFilter = support.LABEL_ALL;
	casestatusFilter = '';
	showCase = false;
	selectedCase = {};
	displayForm = true;
	displayRecordForm = false;
	changeStaus = '';
	labelBtn = '';
	stautusVarible;
	editImg = support.DRAFT;
	showForm = false;
	urlq;
	imgforDraft = false;
	casesDate = []; //This variable is referred in the HTML file of this component
	draftStatus = '';
	draftStatusNeed = '';
	draftStatusDraft = '';
	draftStatustfirst = false;
	draftStatusNeedtfirst = false;
	draftStatusDraftFirst = false;
	formattedDateNewOne;
	recordDate;
	userName;
	@api selectedCaseId;
	editIcon = false;
	typeValue;
	hideSubtype = true;
	subTypePlatformFilter;
	subTypePlatformHide = true;
	touch;
	down;
	up;
	ifnorecord = false;
	ifNotCaseFound = true;
	ifNotCase = false;
	casevar = false;
	casevariable=false;
	checking=true;
	caseImageUrl;
	fileType;
	fileName;
	// Declaration of variables
	caseId;
	columns = COLUMNS;
	typeOptions = TYPE_OPTIONS;
	statusOptions = STATUS_OPTIONS;
	userId = support.ID;
	accountName = '';
	// get method to retrieve the date format
	get formattedCases() {
		return this.cases.map((flitercase) => ({
			
			...flitercase,
			FormattedDate: this.formatDate(flitercase.CreatedDate)
		}));
	}
	// get method to retrieve the image	
	// get hasImage() {
	// 	console.log(this.caseImageUrl,'this.caseImageUrl');
	// 	return this.caseImageUrl?.data;

	// }
	
	loadStyles() {
		loadStyle(this, support.SLDSCLASS);
	}
	// To retireve current URL, based on that navigation will be set
	connectedCallback() {
	
		try {
			const globalThis = window;
			loadStyle(this, support.SLDSCLASS);
	
			const CURRENTURL = globalThis.location?.href;
	
			// Handle URL path and set `this.urlq`
			const URLOBJECT = new URL(CURRENTURL);
			const PATH = URLOBJECT.pathname;
			const PATHCOMPONENTS = PATH.split('/');
			const DESIRED_COMPONENT = PATHCOMPONENTS.find((component) =>
				[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			
			if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
				this.urlq = support.BRANDED_URLNAVI;
			} else {
				this.urlq = support.UNASSIGNED_URLNAVI;
			}
	
			// Check and manage session storage
			if (this.isSessionStorageAvailable(globalThis)) {
				this.manageSessionStorage(globalThis);
			}
			this.ifNotCaseFound = false;
			
		} catch (error) {
			this.handleToNavigate(error.message); // Error caught when current URL is not fetched
		}
	}
	
	isSessionStorageAvailable(globalThis) {
		return typeof globalThis !== support.UNDIFINED && globalThis.sessionStorage;
	}
	
	manageSessionStorage(globalThis) {
		this.count = globalThis.sessionStorage.getItem('count');
		if (this.count !== '2') {
			globalThis.sessionStorage.setItem('count', '2');
		} else {
			globalThis.sessionStorage.setItem('count', '1');
		}
	}
	

	

	// To check any case record is available for the current user
	@wire(ENROLLE, { userId: '$userId' })
	wiredGetEnrolle({ error, data }) {
		// Null data is checked and AuraHandledException is thrown from the Apex
		
		if (data) {
			
				if (data[0].patientEnrolle) {
					this.accountName = data[0].patientEnrolle.Id;
					this.loadCases(this.typeFilter, this.statusFilter);
				}
				else if (data[0].error) {
					this.showError = true;
					this.errorMessage = data[0].error;
				}
			}
			else if (error) {
				this.handleToNavigate(support.ENROLL_NOT_GET,error.message);
			}
		
	}
    
	/*@wire(CASE_IMAGE, { caseId: '$caseId' })
	caseImageUrl;*/
 get hasImage() {
        console.log(this.caseImageUrl, 'this.caseImageUrl');
       	return !!this.caseImageUrl; // Check if caseImageUrl is not null/undefined/empty
	   	// return this.caseImageUrl?.data;

    }
		@wire(CASE_IMAGE, { caseId: '$selectedCaseId' })
		//caseImageUrl;
		wiredCaseImage({ error, data }) {
			if (data) {
				console.log(data.fileType, 'data.fileType');

				this.caseImageUrl = data.base64Image; 
				this.fileName =  data.title;// Since getBaseImage returns a string, directly assign it
				this.fileType = data.fileType;
				 if (this.fileType === 'PDF') { // Check if the file type is 'pdf'
            this.caseImageUrl = support.PDF_IMG; 
            this.fileName = data.title;
            this.fileType = data.fileType;
            console.log(this.fileName, 'this.fileName');
        } else {
            console.log('Non-PDF file detected, no action taken.');
        }
				console.log(this.fileName, 'this.fileName');
			} else if (error) {
				console.error('Error fetching case image URL:', error);
				this.error = error; // Store the error if needed for UI handling
			}
		}

	loadCases(typeFilter, statusFilter) {
		this.fetchCases(typeFilter, statusFilter)
			.then((result) => {
				this.processCasesResult(result);
				return this.getFirstCaseId(result);
			})
			.then((firstCaseId) => {
				if (firstCaseId) {
					return this.handleCaseClicOne(firstCaseId);
				}
				return this.handleCaseClicOne(firstCaseId);
			})
			.catch((error) => {
					this.handleToNavigateyi(error.message);
				
			});
			
	}
	
	fetchCases(typeFilter, statusFilter) {
		return CASESER({ cpeId: this.accountName, type: typeFilter, status: statusFilter });
	}
	
	processCasesResult(result) {
		if (result !== null) {
			this.ifNotCaseFound =false;
			this.ifnorecord = false;
			this.ifNotCase = result.length > 0;
		} else {
			this.ifnorecord = true;
			this.ifNotCaseFound =true;
			this.showSpinner = false;
		}
	
		this.handleCaseVisibility();
	
		this.hideSubtype = (result[0]?.Type !== support.LABEL_PSP);
	
		this.cases = result.map((caseRecord) => this.processCaseRecord(caseRecord));
	}
	
	handleCaseVisibility() {
		if (this.ifnorecord === true && this.ifNotCase === true) {
			this.casevar = true;
			this.ifNotCaseFound = false;
			this.checking = true;
		} else {
			this.casevariable = false;
			this.checking = true;
			this.casevar = false;
		}
	}
	
	processCaseRecord(caseRecord) {
		
		let draftStatusNeed = '';
		let draftStatusDraft = '';
		let draftStatus = '';
		let draftStatusNeedtfirst = false;
		let draftStatusDraftFirst = false;
		let draftStatustfirst = false;
	
		switch (caseRecord.Status) {
			case support.LABEL_NEEDMOREINFORMATION:
				draftStatusNeed = support.LABEL_NEEDINFO;
				draftStatusNeedtfirst = true;
				break;
			case support.LABEL_DRAFT:
				draftStatusDraft = support.LABEL_DRAFT;
				draftStatusDraftFirst = true;
				break;
			case support.LABEL_SUBMITTED:
				draftStatus = support.LABEL_SUBMITTED;
				draftStatustfirst = true;
				break;
			default:			
				break;
		}
	
		const imgfordraft1 = caseRecord.Status === support.LABEL_DRAFT;
		const imgfordraft2 = caseRecord.Status === support.LABEL_NEEDMOREINFORMATION;
	
		return {
			...caseRecord,
			down: true,
			up: false,
			touch: false,
			imgforDraft: imgfordraft1,
			imgfordraft1: imgfordraft2,
			draftStatusNeed: draftStatusNeed,
			draftStatusDraft: draftStatusDraft,
			draftStatus: draftStatus,
			draftStatusNeedtfirst: draftStatusNeedtfirst,
			draftStatusDraftFirst: draftStatusDraftFirst,
			draftStatustfirst: draftStatustfirst,
			FormattedDate: this.formatDate(caseRecord.CreatedDate)
		};
	}
	
	getFirstCaseId(result) {
		return result[0]?.Id;
	}
	
	
	// To convert the date into formatted date
	formatDate(createdDate) {
		const DATEOBJECT = new Date(createdDate);
		const FORMATTEDDATE = DATEOBJECT.toLocaleDateString();
		this.formattedDateNewOne = DATEOBJECT.toLocaleDateString();
		return FORMATTEDDATE;
	}

	// To display the records based on click event
	handleFilterChange(event) {
		if (event.target.label === support.LABEL_TYPE) {
			this.caseTypeFilter = event.target.value;
			this.typeFilter = this.caseTypeFilter;
		}
		else if (event.target.label === support.LABEL_STATUS) {
			this.casestatusFilter = event.target.value;
			this.statusFilter = this.casestatusFilter;
		}
		this.loadCases(this.typeFilter, this.statusFilter);
	}

	// To view the Case details, based on the case records clicked
	openForm() {
		// Display the form.
		this.showForm = true;
		this.displayForm = false;
		this.displayRecordForm = true;
		this.showCase = false;
	}

	// To display the newly created case from support center
	createCase() {
		// Find the form element and submit it to create the Case record
		const FORM = this.template.querySelector('lightning-record-edit-form');
		FORM.submit();
		this.displayForm = true;
		this.displayRecordForm = false;
	}

	// Handler to display case details with the required background on the detailed side(left)
	handleCaseClick(event) {
		this.selectedCaseId = event.currentTarget.dataset.caseId;
		this.updateBackgroundClasses(event);
		this.fetchCaseDetails(this.selectedCaseId)
			.then((result) => {
				this.processCaseDetails(result);
			})
			.catch((error) => {
				this.handleToNavigate(support.RECORD_NOT_FETCH,error.message);
			});
	}
	
	updateBackgroundClasses(event) {
		const BOXES = this.template.querySelectorAll('.large-screen-background');
		const BOXESES = this.template.querySelectorAll('.small-screen-background');
		const CLICKEDBOX = event.currentTarget;
		const globalThis = window;
	
	
		BOXES.forEach(box => {
			box.classList.remove('small-screen-background', 'large-screen-background', 'white-background', 'resultDiv');
			box.classList.add('white-background');
		});
		BOXESES.forEach(box => {
			box.classList.remove('small-screen-background', 'large-screen-background', 'white-background', 'resultDiv');
			box.classList.add('white-background');
		});
	
		if (globalThis?.innerWidth < 600) {
			CLICKEDBOX.classList.remove('large-screen-background', 'white-background', 'resultDiv');
			CLICKEDBOX.classList.add('small-screen-background');
		} else {
			CLICKEDBOX.classList.remove('small-screen-background', 'white-background', 'resultDiv');
			CLICKEDBOX.classList.add('large-screen-background');
		}
	}
	
	fetchCaseDetails(caseId) {
		return CASE_DETAILS({ caseId: caseId });
	}
	
	processCaseDetails(result) {
		let globalThis = window;
		this.caserecordidget = result.Id;
		globalThis?.sessionStorage.setItem('caserecordid', this.caserecordidget);
		this.selectedCase = result;
		this.typeValue = this.selectedCase.Type;
		this.subTypePlatformFilter = this.selectedCase.BI_PSPB_Sub_Type__c;
		this.stautusVarible = this.selectedCase.Status;
		this.userName = this.selectedCase.CreatedBy.Name;
	
		this.subTypePlatformHide = (this.typeValue !== support.LABEL_PSP);
	
		this.updateStatusAndIcons();
	
		this.hideSubtype = (this.typeValue !== support.LABEL_PSP);
	
		const CREATEDATE = result.CreatedDate;
		this.recordDate = CREATEDATE.split('T')[0];
	
		this.showForm = false;
		this.showCase = true;
	}
	
	updateStatusAndIcons() {
		switch (this.stautusVarible) {
			case support.LABEL_SUBMITTED:
				this.changeStaus = 'submittedClass';
				this.labelBtn = support.LABEL_SUBMITTED;
				this.editIcon = false;
				break;
			case support.LABEL_DRAFT:
				this.changeStaus = 'draftClass';
				this.labelBtn = support.LABEL_DRAFT;
				this.editIcon = true;
				this.editImg = support.DRAFT;
				break;
			case support.LABEL_NEEDMOREINFORMATION:
				this.changeStaus = 'NeedClass';
				this.labelBtn = support.LABEL_NEEDINFO;
				this.editIcon = true;
				this.editImg = support.DRAFT;
				break;
			default:
			
				break;
		}
	}
	
	handleCaseClicOne(id) {
		let globalThis = window;
		this.selectedCaseId = id;
		const BOXES = this.template.querySelectorAll('.resultDiv');
		this.caseId = this.selectedCaseId;

		BOXES.forEach((box) => {
			box.classList.remove('resultDiv')
			box.classList.add('white-background');
			if (box.dataset.caseId === this.selectedCaseId) {
				box.classList.remove('white-background');
				box.classList.add('large-screen-background');
			}
		});
	

		// To display the case records based on the filter criteria selected in the right side of the page
		CASE_DETAILS({ caseId: this.selectedCaseId })
    .then((result) => {
        this.caserecordidget = result.Id;
        globalThis?.sessionStorage.setItem('caserecordid', this.caserecordidget);
        this.selectedCase = result;
        this.typeValue = this.selectedCase.Type;
        this.subTypePlatformFilter = this.selectedCase.BI_PSPB_Sub_Type__c;
        this.stautusVarible = this.selectedCase.Status;
        this.userName = this.selectedCase.CreatedBy.Name;
		this.updateStatusAndIcons();
        this.showForm = false;
        this.showCase = true;
        const createdate = result.CreatedDate;
        this.recordDate = createdate.split('T')[0];
		this.showSpinner = false;
    })
    .catch((error) => {
        this.handleToNavigate(support.RECORD_NOT_FETCH,error.message);
    });
	}
	
	// To convert the image to blob
	readAsDataURL(blob) {
		return new Promise((resolve, reject) => {
			const READER = new FileReader();
			READER.onload = (event) => {
				const BASE64STRING = event.target.result;
				resolve(`data:image/${blob.type?.split('/')[1]};base64,${BASE64STRING}`);
			};

			READER.onerror = (error) => {
				reject(error);
			};

			READER.readAsDataURL(blob);
		});
	}

	// To navigate to the File Preview
	

	// Handler to pass the URL when edit icon is clicked

	handledraft() {
		const globalThis = window;
		globalThis?.sessionStorage.setItem('caseRecordId', this.caserecordidget);
		if (this.typeValue === support.LABEL_MIE) {

			globalThis.location?.assign(
				support.MIE_PAGE
			);

		}
		else if (this.typeValue === support.LABEL_RAE) {

			globalThis.location?.assign(support.RAE_PAGE);

		}
		else if (this.typeValue === support.LABEL_PSP) {

			globalThis.location?.assign(support.PSP_PAGE);

		}
		else{
			this.handleToNavigate(support.RECORD_NOT_FETCH,error.message);
		}
	}

	// Record gets visible only if click event occurs
	click(event) {
		const caseId = event.currentTarget.dataset.caseId;
		this.updateCaseTouch(caseId, true);
	}

	// Record gets visible automatically without click event
	notclick(event) {
		const caseId = event.currentTarget.dataset.caseId;
		this.updateCaseTouch(caseId, false);
	}

	// To update the draft records
	updateCaseTouch(caseId, touchValue) {
		this.cases = this.cases.map((caseRecord) => ({
			...caseRecord,
			touch: caseRecord.Id === caseId ? touchValue : caseRecord.touch,
			down: caseRecord.Id === caseId ? !touchValue : caseRecord.down,
			up: caseRecord.Id === caseId ? touchValue : !touchValue,

			FormattedDate: this.formatDate(caseRecord.CreatedDate)
		}));
	}
	handleToNavigate(errorMessage) {
		let global = window;
	global.location?.assign(support.ERROR_PAGE);
	global.sessionStorage.setItem('errorMessage', errorMessage);
	}

}