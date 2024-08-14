//This lightning web component is used as parent component to display the recent articles and landing avatar message
// To import Libraries
import { LightningElement, wire } from 'lwc';
// To import Apex Classes
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Static Resource
import LANDING_DESK_IMG from '@salesforce/resourceUrl/BI_PSPB_InfoLandingImg';
import LANDING_MOB_IMG from '@salesforce/resourceUrl/BI_PSPB_InfoLandingMob';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbInfoCenterLandingParent extends LightningElement {

	patientStatusRecord = '';
	showTreatVideo = false;
	urlq;
	showSpinner=false;
	renderedCount=0;
	imageMob = LANDING_MOB_IMG;
	userId = ID;
	imageDesktop = LANDING_DESK_IMG;
	currentPageUrl;
	urlSegments;
	baseUrl;
	siteUrlq;
	spevigoArticleLabel=LABELS.SPEVIGO_ARTICLES;

	renderedChildrenCount = 0;
    totalChildren = 3; // Total number of child components

    articles = LABELS.ARTICLES;
	patientTreatmentVideos = LABELS.PATIENT_TREATMENT_VIDEOS;
	infoCenterLandingMessage = LABELS.INFO_CENTER_LANDING_MESSAGE;
	infoCenterLandingDetailMessage = LABELS.INFO_CENTER_LANDING_DETAIL_MESSAGE;

    // Getter to check if all children have rendered
    get allChildrenRendered() {
        return this.renderedChildrenCount >= this.totalChildren;
    }
   /**
     * @param {boolean} val
     */
    // Setter to increment the count when a child is rendered
    set childRendered(val) {
        if (val) {
            this.renderedChildrenCount++;
            if (this.allChildrenRendered) {
                this.showSpinner = false;
            }
        }
    }

	// To navigate landing informaton center page
	openArticlesPage() {
		window.location.assign(this.siteUrlq + LABELS.LANDING_PAGE);
	}

	// To navigate landing informaton center page
	openSpevigoCategory() {

		if(this.patientStatusRecord === LABELS.CHRONIC_STATUS){
			window.location.assign(this.siteUrlq+LABELS.CATEGORY_PAGE+LABELS.FLARE_PREVENTION_LABEL)
		}
		else{
			window.location.assign(this.siteUrlq+ LABELS.CATEGORY_PAGE + LABELS.FLARE_TREATMENT_LABEL)
		}
	}

	// To navigate Acute or Chronic video page based on patient status
	openPTVPage() {
		if (this.urlq !== LABELS.BRANDED_URL) {
				window.location.assign(this.siteUrlq + LABELS.ACUTE_VIDEO_PAGE);

		} else if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
				window.location.assign(this.siteUrlq + LABELS.ACUTE_VIDEO_PAGE);
			} else {
				window.location.assign(this.siteUrlq + LABELS.CHRONIC_VIDEO_PAGE);
			}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the patient status (acute or chronic or unassigned)
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusRecord = data;

				if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
					this.showTreatVideo = true;
				} else if (this.patientStatusRecord === LABELS.CHRONIC_STATUS) {
					this.showTreatVideo = true;
				} else {
					this.showTreatVideo = false;
				}
				// Handle the data
			} else if (error) {
				// Handle the error
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			} else {
				this.showTreatVideo = false;
				this.patientStatusRecord = LABELS.ACUTE_STATUS;
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	handleChildRendered(event) {
    this.childRendered = event.detail.rendered;
	}

	// To retrieve current site url
	connectedCallback() {
		try {
			this.showSpinner=true;
			let globalThis = window;
			let currentUrl = globalThis.location.href;

			// Create a URL object
			let urlObject = new URL(currentUrl);

			// Get the path
			let path = urlObject.pathname;

			// Split the path using '/' as a separator
			let pathComponents = path.split('/');

			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[LABELS.BRANDED_URL.toLowerCase(), LABELS.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === LABELS.BRANDED_URL.toLowerCase()) {
				this.urlq = LABELS.BRANDED_URL;
				this.siteUrlq = LABELS.BRANDED_SITE_URL;
			} else {
				this.urlq = LABELS.UNASSIGNED_URL;
				this.siteUrlq = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		} catch (error) {
			this.navigateToErrorPage(error.message);  // Catching Potential Error
		}
	}

	// To render the subheader tab
	renderedCallback() {
		try {
			let windowWidth = window.innerWidth;
			let displayvideotab = this.template.querySelector(
				'.grid-containerNavTab'
			);

			if (windowWidth <= 1000) {
				if (displayvideotab) {
					displayvideotab.style.display = 'none';
				}
			} 
			this.renderedChildrenCount++;
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
		}
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.baseUrl + this.siteUrlq + LABELS.ERROR_PAGE; 
	}
}