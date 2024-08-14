// This LWC is designed for support center main page
// To import Libraries
import { LightningElement} from 'lwc';
import { NavigationMixin } from "lightning/navigation";
// To import Static Resources
import{support} from 'c/biPspbSupportCaseResources';

export default class BiPspbSupportCenter extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @track
	showSpinner = true;
	supportAssist = support.SUPPORT_ASSIST;
    supportService = support.SUPPORT_SERVICE;
    supportFriday  = support.SUPPORT_FRIDAY;
    supportMail = support.SUPPORT_MAIN;
	medical = support.MEDICAL;
    enquiry = support.ENQUIRY;
    event = support.EVENT;
    report = support.REPORT;
    platform = support.PLATFORM;
    support = support.SUPPORT;
	supportCenter = support.SUPPORT_CENTER;
	isFormVisible = false;
	isFormVisibleOne = false;
	isFormVisibleTwo = false;
	isFormVisibleThree = false;
	buttonLabel = 'Show Form'; // Initial label
	fieldOne = '';
	fieldTwo = '';
	subTypeError = false;
	descriptionError = false;
	files = [];
	back = false;
	//The following are invoked from CSS
	classOne = 'buttonbox';
	classTwo = 'buttonbox';
	classThree = 'buttonbox';
	contact = true;
	showCollectButton = true;
	caseType;
	// Declaration of variables
	medicalInformation = support.MEDICAL_INFORMATION;
	reportAdverse = support.REPORT_ADVERSE;
	platformSupport = support.PLATFORM_SUPPORT
	backArrow = support.ARROW;
	phnimg = support.PHN_IMG;
	emailimg = support.EMAIL_IMG;
	supportSms = support.SUPPORT_SMS;
	supportEmail = support.SUPPORT_EMAIL;
	/* This method is used to navigate a user to the respective Unassigned or Branded*/
	connectedCallback() {
		let globalThis = window;
		try {
			const CURRENT_URL = globalThis.location?.href;

			// Create a URL object
			const URL_OBJECT = new URL(CURRENT_URL);

			// Get the PATH
			const PATH = URL_OBJECT.pathname;

			// Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/');

			// Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);

			if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
				this.urlq = support.BRANDED_URL_NAVI;
			}
			else {
				this.urlq = support.UNASSIGNED_URL_NAVI;
			}
			if (this.showCollectButton === true) {
                this.showSpinner = false;
            } else {
                this.showSpinner = true; 	
            }
		}
		catch (error) {
			this.showToast(error.message);
		}
	}
	// To navigate to Medical Information Enquiry page
	medicalInformationtoggle(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		globalThis.location?.assign(this.urlq + support.MIE_PAGE);
	}
	// To navigate to Report Adverse Event page
	reportAdverseEventstoggle(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		globalThis.location?.assign(this.urlq + support.RAE_PAGE);
	}
	// To navigate to Platform Support page
	platformSupporttoggle(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		globalThis.location?.assign(this.urlq + support.PSP_PAGE);
	}
	showToast(errorMessage) {
		let global = window;
	global.location?.assign(this.urlq + support.ERROR_PAGE);
	global.sessionStorage.setItem('errorMessage', errorMessage);
	}
}