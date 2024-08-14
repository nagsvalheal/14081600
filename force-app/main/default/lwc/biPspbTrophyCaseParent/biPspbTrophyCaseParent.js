//This is consolidated component for trophy case page,which have a trophy coponent as a child and Avatar navigation as a child
//To import libraries
import { LightningElement } from 'lwc';

import { resources } from 'c/biPspLabelAndResourceChallenges';


export default class BiPspbTrophyCaseParent extends LightningElement {
	//Declare the variables
	urlq;
	slashUrl = resources.SLASH_URL;
	slashSite = resources.SLASH_SITEURL;
	siteChallengesUrlBranded = resources.BRANDED_CHALLENGES_SITEURL;
	siteTrophyCaseUrlBranded = resources.BR_TROPHY_CASE_SITE_URL;
	challengeNavValue = resources.CHALLANGENAVVALUE;
  	tropyCaseNavValue = resources.TROPHYCASENAVVALUE;
	showSpinner = true;

	//Used to get the current url and to process the url to fetch the site name accordingly
	renderedCallback() {
		let globalThis = window;
		try {
			const CURRENT_URL = window.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Create a URL object
			const PATH = URL_OBJECT.pathname; // Get the path1
			const PATH_COMPONENTS = PATH.split('/'); // Split the path1 using '/' as a separator
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);  // Find the component you need (in this case, 'Branded')

			if (DESIRED_COMPONENT.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_URL;
			}
			else {
				this.urlq = resources.UNASSIGNED_URL;
			}
		}
		catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	//this event is used for navigation to challenges page
	openChallenges() {
		window.location.assign(this.slashUrl + this.urlq + this.slashSite + this.siteChallengesUrlBranded);
	}
	//this event is used for navigation to Trophy page
	openTrophyCase() {
		window.location.assign(this.slashUrl + this.urlq + this.slashSite + this.siteTrophyCaseUrlBranded);
	}
	
	 handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
  
}