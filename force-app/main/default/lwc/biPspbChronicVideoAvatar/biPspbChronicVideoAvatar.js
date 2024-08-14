// This lightning web component is used for display the chronic patient avatar treatment message
// To import Libraries
import { LightningElement, wire, api } from "lwc";
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_AVATAR_IMG from "@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation";
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForTreatmentVideo';
// To get Current UserId
import ID from "@salesforce/user/Id";

export default class BiPspbChronicVideoAvatar extends LightningElement {
  @api siteUrlq;
  selectedAvatarSrc;
  caregiver = false;
  userid = ID;
  messageText = LABELS.CHRONIC_MOB_MESSAGE;
  treatmentVideoAvatarHeading = LABELS.TREATMENT_VIDEO_AVATAR_HEADING;
  videoAvatarMessageChronic =  LABELS.VIDEO_AVATAR_MESSAGE_CHRONIC;

  // Method to display message for mobile
  displayMessage() {
    this.messageText = LABELS.CHRONIC_MOB_MESSAGE;
    this.template.querySelector(".paranew").style.display = "block";
  }

  // Method to display message for desktop
  displayExpandedMessage() {
    this.messageText = LABELS.CHRONIC_DESK_MESSAGE;
    this.template.querySelector(".paranew").style.display = "none";
  }

    /* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered. */
	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_AVATAR_IMG;
				}
			else if (error) {
        this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex			}
		}
    }catch (err) {
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