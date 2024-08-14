// This lightning web component is used to display the landing avatar message in the Information Center Landing Page
// To import Libraries
import { LightningElement, wire,api } from 'lwc';
// To import Static Resources
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
//  To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbInfoLandingAvatar extends LightningElement {
	@api siteUrlq;
	caregiver = false;
	renderedCount=0;
	userAccounts;
	cardImage = '';
	searchAvatarMessage = LABELS.ARTICLE_SEARCH_AVATAR_MESSAGE;
	
	// To retrieve the logged in user selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
		if (data) {
			this.cardImage = data[0]?.BI_PSP_AvatarUrl__c
			? data[0]?.BI_PSP_AvatarUrl__c
			: DEFAULT_IMG;
			const event = new CustomEvent('childrendered', {
				detail: { rendered: true }
			});
			this.dispatchEvent(event);

		} else if (error) {
			this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
		}
		} catch (err) {
		this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + LABELS.ERROR_PAGE); 
	}
}