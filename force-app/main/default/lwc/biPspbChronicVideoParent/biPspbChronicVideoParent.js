// This lightning web component is used for display the chronic treatment video and chronic avatar message
// To import Libraries
import { LightningElement } from 'lwc';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbChronicVideoParent extends LightningElement {
	currentPageUrl;
	urlSegments;
	baseUrl;
	siteUrlq;
	articles = LABELS.ARTICLES;
	patientTreatmentVideos = LABELS.PATIENT_TREATMENT_VIDEOS;
	spevigoArticleLabel=LABELS.SPEVIGO_ARTICLES;

	// To navigate to information center landing page
	openAcute() {
		window.location.assign(this.siteUrlq + LABELS.LANDING_PAGE);
	}

	// To navigate to information center chronic video page
	openChronic() {
		window.location.assign(LABELS.BRANDED_SITE_URL + LABELS.CHRONIC_VIDEO_PAGE);
	}

	// Navigate to spevigo article category
	openSpevigoCategory() {
		window.location.assign(this.siteUrlq+LABELS.CATEGORY_PAGE+LABELS.FLARE_PREVENTION_LABEL)
	}

	// To render the subheader
	connectedCallback() {
		try {
			const globalThis = window;
			let currentUrl = globalThis.location.href; // Create a URL object
			let urlObject = new URL(currentUrl); // Get the path
			let path = urlObject.pathname; // Split the path using '/' as a separator
			let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[LABELS.BRANDED_URL.toLowerCase(), LABELS.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === LABELS.BRANDED_URL.toLowerCase()) {
				this.siteUrlq = LABELS.BRANDED_SITE_URL;
			} else {
				this.siteUrlq = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			let windowWidth = globalThis.innerWidth;
			let displayvideotab = this.template.querySelector(
				'.grid-containerTabs'
			);

			if (windowWidth <= 1000) {
				if (displayvideotab) {
					displayvideotab.style.display = 'none';
				}
			}
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
		}
	}


	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + LABELS.ERROR_PAGE);	
	}
}