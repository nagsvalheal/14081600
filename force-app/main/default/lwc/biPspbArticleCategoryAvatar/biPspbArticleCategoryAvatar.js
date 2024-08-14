// This lightning web component is used to display the avatar message in the Information Center category Page
// To import Libraries
import { LightningElement, wire, api} from 'lwc';
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbArticleCategoryAvatar extends LightningElement {
	@api siteUrlq;
	renderedCount = 0;
	categoryPageMessage = LABELS.ARTICLE_SEARCH_AVATAR_MESSAGE;
	acuteMessage = this.categoryPageMessage.substring(0,128) + '...';
	cardimage = '';

	// Method to display message for mobile
	displayMessage() {
		this.acuteMessage = this.categoryPageMessage.substring(0,128) + '...';
		this.template.querySelector('.paranew').style.display = 'block';
	}

	// Method to display message for desktop
	displayExpandedMessage() {
		this.acuteMessage = this.categoryPageMessage;
		this.template.querySelector('.paranew').style.display = 'none';
	}

	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
		if (data) {
			this.cardimage = data[0]?.BI_PSP_AvatarUrl__c? data[0]?.BI_PSP_AvatarUrl__c
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