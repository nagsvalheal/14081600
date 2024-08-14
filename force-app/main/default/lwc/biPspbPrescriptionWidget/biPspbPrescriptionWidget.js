//This component for unassigned update prescription.
//To import Libraries
import { LightningElement } from 'lwc';
//To import static resource
import WIDGET_ICON from '@salesforce/resourceUrl/BI_PSPB_UpdateRxIcon';
//To import custom labels
import { LABELS } from 'c/biPspbLabelForUpdatePrescription';

export default class BiPspbPrescriptionWidget extends LightningElement {
	// navigation for update prescription component
	myUrl = WIDGET_ICON;
	updateRx = LABELS.UPDATERX;
	baseUrl;
	currentPageUrl;
	urlSegments;
	updatePrescriptionLabel = LABELS.UPDATE_PRESCRIPTION_LABEL;
	prescriptionMessage = LABELS.PRESCRIPTION_MESSAGE;
	updateLabel = LABELS.UPDATE_LABEL;
	brandedUrl = LABELS.BRANDED_URL;
	unassignedUrl = LABELS.UNASSIGNED_URL;
	brandedUrlNavi = LABELS.BRANDED_URL_NAVI;
	unAssignedUrlNavi = LABELS.UNASSIGNED_URL_NAVI;
	connectedCallback() {
		try {
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[this.brandedUrl.toLowerCase(), this.unassignedUrl.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENTS.toLowerCase() === this.brandedUrl.toLowerCase()) {
				this.urlq = this.brandedUrlNavi;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}
		} catch (error) {
		this.navigateToErrorPage(error.message);
		}
	}
	navigateUpdateRx() {
		window.location.href = this.urlq + this.updateRx;
	}
		// navigateToErrorPage used for all the error messages caught
		navigateToErrorPage(errorMessage) {
			let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', errorMessage);
			globalThis.location.href = this.urlq + LABELS.ERROR_PAGE;
	}
}