// This lightning web component used to show the acute treatment avatar message
// To import Libraries
import { LightningElement, wire,api } from 'lwc';
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForTreatmentVideo';


// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbAcuteVideoAvatar extends LightningElement {
  
  selectedAvatarSrc;
  userid = ID;
  acuteMessage = LABELS.MESSAGE_MOB;
  @api siteUrlq;

  // Method to display message for mobile
  displayMessage() {
    this.acuteMessage = LABELS.MESSAGE_MOB;
    this.template.querySelector(".dot").style.display = "block";
  }

  // Method to display message for desktop
  displayExpandedMessage() {
    this.acuteMessage = LABELS.MESSAGE_DESK;
    this.template.querySelector(".dot").style.display = "none";
  }


  /* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered. */
	// To retrieve the logged in user selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_IMG;
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