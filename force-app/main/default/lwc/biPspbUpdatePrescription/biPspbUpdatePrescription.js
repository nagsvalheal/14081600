// To import libraries
import { LightningElement} from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
//To Import apex clases
import CASE_RECORD_CREATE from '@salesforce/apex/BI_PSPB_PatientPrescriptionCtrl.createCaseRecordWithFiles';
// To Import Static Resources
import MY_ICON from '@salesforce/resourceUrl/BI_PSPB_UploadIcon';
import MY_ICON_ONE from '@salesforce/resourceUrl/BI_PSPB_RedUploadIcon';
import TIC from '@salesforce/resourceUrl/BI_PSP_ToastTickIcon';
import UPLOAD_FILE_CSS from '@salesforce/resourceUrl/BI_PSPB_UploadFileCss';
import WARNING_ICON from '@salesforce/resourceUrl/BI_PSP_WarningIcon';
import{support} from 'c/biPspbSupportCaseResources';
// To Import Custom Labels
import { LABELS } from 'c/biPspbLabelForUpdatePrescription';
export default class BiPspbUpdatePrescription extends LightningElement {
	showDiv = false;
	PrescriptionErrorMessage = false;
	radioValueNine = true;
	imgOne = true;
	imgTwo = false;
	radioValueThree = false;
	fileUploadStar = false;
	fileUpload = "file";
	imgPad = "imagepad2";
	pharmacyValue = "";
	commentsValue = "";
	selectedValue;
	BI_PSPB_physical_copy__c = false;
	BI_PSPB_e_prescription__c = false;
	Message = false;
	radioValue = "";
	getAttachFile = "";
	starName = "";
	uploadFile = "uploadfile";
	ePrescriptionQuestion = false;
	files = [];
	radioValueSecond = "";
	fileName = "";
	handleUploadFinished = true;
	fileNames = [];
	browsCondition = true;
	canceLandSubmit = true;
	BrowseLabel = "Browselabelone";
	pharmacyLabel = LABELS.PHARMACY_LABEL;
	uploadErrorLabel = LABELS.UPLOAD_ERROR;
	fileIds = [];
	rightImg = TIC;
	uploadedAttachments = [];
	uploadedNotes = [];
	myIconUrl = MY_ICON;
	myIconUrlOne = MY_ICON_ONE;
	warningIcons = WARNING_ICON;
	value = "";
	updatePrescriptionLabel = LABELS.UPDATE_PRESCRIPTION_LABEL;
	prescriptionContactMsg = LABELS.PRESCRIPTION_CONTACT_MSG;
	latestPrescriptionQstn = LABELS.LATEST_PRESCRIPTION_QSTN;
	ePrescriptionQstn = LABELS.EPRESCRIPTION_QSTN;
	submitLabel = LABELS.SUBMIT;
	cancelLabel = LABELS.CANCEL;
	additionalCommentsLabel = LABELS.ADDITIONAL_COMMENTS;
	prescriptionToastMsg = LABELS.PRESCRIPTION_TOAST_MSG;
	pharmacyPrescriptionLabel = LABELS.PHARMACY_PRESCRIPTION_QSTN;
	optionsOne = [
		{ label: LABELS.YES, value: LABELS.YES },
		{ label: LABELS.NO, value: LABELS.NO }
	];
	optionsTwo = [
		{ label: LABELS.YES, value: LABELS.YES },
		{ label: LABELS.NO, value: LABELS.NO }
	];

	brandedUrl = LABELS.BRANDED_URL;
	unassignedUrl = LABELS.UNASSIGNED_URL;
	brandedUrlNavi = LABELS.BRANDED_URL_NAVI;
	updateRx = LABELS.UPDATERX;
	unAssignedUrlNavi = LABELS.UNASSIGNED_URL_NAVI;
	urlq;
	// To get the current site path Branded or Unassigned and navigate to the respective page
	connectedCallback() {
		try {
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/');
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[
					this.brandedUrl.toLowerCase(),
					this.unassignedUrl.toLowerCase()
				].includes(component.toLowerCase())
			);

			if (DESIRED_COMPONENTS.toLowerCase() === this.brandedUrl.toLowerCase()) {
				this.urlq = this.brandedUrlNavi;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}
			loadStyle(this, UPLOAD_FILE_CSS);
			this.loadRadioBtnStyles();
		} catch (error) {
			// Handle error
			this.navigateToErrorPage(error.message);
		}
	}

	loadRadioBtnStyles() {
		loadStyle(this, support.CASE_RADIO_BTN);
		loadStyle(this, support.RADIO_BTN_COLOR_CHNAGE);
	}

	handleComments(event) {
		this.commentsValue = event.target.value;
	}
	handlePharmacyValue(event) {
		this.pharmacyValue = event.target.value;
		const PRESCRIPTION = this.template.querySelector(
			'lightning-input[data-field="prescription"]'
		);
		if (this.pharmacyValue !== "") {
			this.PrescriptionErrorMessage = false;
			PRESCRIPTION.className = "textInput";
			this.template.querySelector(
				'label[data-field="prescription"]'
			).className = "input-label";
		}
	}

	//if the priscription value is "yes" Additional Comments,files will show
	handlePhysicalCopyRecord(event) {
		this.radioValue = event.target.value;
		if (this.radioValue === LABELS.YES) {
			this.handleUploadFinished = true;
			this.ePrescriptionQuestion = false;
			this.Message = false;
			this.radioValueNine = true;
			this.fileUploadStar = true;
			this.starName = "starclass";
			this.radioValueThree = false;
			this.radioValueSecond = "";
			this.canceLandSubmit = true;
			this.PrescriptionErrorMessage = false;
		}
		//if the priscription value is "NO" epriscription and will show
		else {
			this.ePrescriptionQuestion = true;
			this.handleUploadFinished = true;
			this.radioValueNine = this.ePrescriptionQuestion && this.radioValue === LABELS.NO;
			this.radioValueThree = this.ePrescriptionQuestion && this.radioValue === LABELS.YES;
			this.fileUploadStar = false;
			this.starName = "";
			this.starName = "starclass";
			this.uploadFile = "uploadfile";
			this.fileUpload = "file";
			this.imgPad = "imagepad2";
			this.imgTwo = false;
			this.imgOne = true;
			this.errorMessage = false;
			this.BrowseLabel = "Browselabelone";
			this.PrescriptionErrorMessage = false;
		}
	}
	// if the e-priscription value is "yes" pysical copy,Additional Comments,file upload fields will show
	handleEprescription(event) {
		this.radioValueSecond = event.target.value;
		const RADIO = event.target.value;

		if (RADIO === LABELS.YES) {
			this.radioValueThree = true;
			this.Message = false;
			this.handleUploadFinished = false;
			this.radioValueNine = true;
			this.canceLandSubmit = true;
		} else {
			this.handleUploadFinished = false;
			this.radioValueThree = false;
			this.Message = true;
			this.canceLandSubmit = false;
			this.radioValueNine = false;
		}
		if (this.radioValueSecond === LABELS.YES) {
			this.handleUploadFinished = true;
			this.PrescriptionErrorMessage = false;
		}
	}

	// clear file fuction

	clearFile() {
		const FILED_INPUT = this.template.querySelector('input[type="file"]');
		FILED_INPUT.value = "";
		this.fileName = "";
	}

	// if the  prescription input box is empty this error message will work
	errorvalidate() {
		let isValid = true;
		const PRESCRIPTION = this.template.querySelector(
			'lightning-input[data-field="prescription"]'
		);
		if (!PRESCRIPTION.value) {
			this.PrescriptionErrorMessage = true;
			isValid = false;
			PRESCRIPTION.className = "textInput-err";
			this.template.querySelector(
				'label[data-field="prescription"]'
			).className = "input-error-label";
		} else {
			this.PrescriptionErrorMessage = false;
			PRESCRIPTION.className = "textInput";
			this.template.querySelector(
				'label[data-field="prescription"]'
			).className = "input-label";
		}
		return isValid;
	}

	//  file  onupload fuctions
	handleUploadFinisheds(event) {
		this.files = event.detail.files;
		this.fileNames = this.files.map((file) => {
			const MAX_LENGTH = window.innerWidth > 768 ? 35 : 20; // Maximum length of displayed filename
			return file.name.length > MAX_LENGTH
				? file.name.substring(0, MAX_LENGTH) + "..."
				: file.name;
		});

		this.fileIds = this.files.map((file) => file.documentId);
		//if user select the file this functions will work
		if (this.files) {
			this.starName = "starclass";
			this.uploadFile = "uploadfile";
			this.fileUpload = "file";
			this.imgPad = "imagepad2";
			this.imgTwo = false;
			this.imgOne = true;
			this.errorMessage = false;
			this.BrowseLabel = "Browselabelone";
			this.browsCondition = false;
		}
	}

	//user submit the record  all select value will saveed in the database

	handleSubmit() {
		let caseupdate = {
			eprescription: this.radioValueSecond,
			physicalCopy: this.radioValue,
			prescriptionSentTo: this.pharmacyValue,
			additionalComments: this.commentsValue
		};
		// Validate the form only when radioValue is 'no' and radioValueSecond is 'yes'
		const ISVALID =
			this.radioValue === LABELS.NO && this.radioValueSecond === LABELS.YES
				? this.errorvalidate()
				: true;
		
		
		if (!ISVALID || (this.radioValue === LABELS.NO && this.radioValueSecond ==='')) {
			return;
		}
		// if radioValue and file is not selected this if class function are worked.
		if (this.files.length === 0 && this.radioValue === LABELS.YES) {
			this.starName = "starclass2";
			this.uploadFile = "uploadfile2";
			this.fileUpload = "file1";
			this.imgTwo = true;
			this.imgOne = false;
			this.uploadfileerrorMessage = true;
			this.errorMessage = LABELS.UPLOAD_ERROR;
			this.BrowseLabel = "Browselabeltwo";
		}
		// if radio value and all values is given the record was summited in this elesif function
		else if (
			this.radioValue === null ||
			(this.radioValue === LABELS.YES && this.files) ||
			this.radioValue === LABELS.NO
		) {
			CASE_RECORD_CREATE({
				wrapper: caseupdate,
				fileIds: this.fileIds
			})
				.then(() => {
					this.prescriptionToastMsg = LABELS.PRESCRIPTION_TOAST_MSG;
					this.showDiv = true;

					window.scrollTo({ top: 0, behavior: "smooth" });
				})

				.catch((error) => {
					this.navigateToErrorPage(error.body.message);
				});
		}
	}

	// if the user click the cancel button all select value will removed

	reset() {
		this.radioValue = "";
		this.radioValueSecond = "";
		this.pharmacyValue = "";
		this.commentsValue = "";
		this.handleUploadFinisheds = "";
		this.starName = "starclass";
		this.uploadFile = "uploadfile";
		this.fileUpload = "file";
		this.imgPad = "imagepad2";
		this.imgTwo = false;
		this.imgOne = true;
		this.errorMessage = false;
		this.files = "";
		this.fileNames = "";
		this.browsCondition = true;
		this.PrescriptionErrorMessage = false;
		this.prescription1 = false;
		this.prescriptionToastMsg ='';
		this.showDiv = false;
	}
	// popup message close event

	handleclose() {
		this.showDiv = false;
		window.location.reload();
	}
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.urlq + LABELS.ERROR_PAGE;
	}
}