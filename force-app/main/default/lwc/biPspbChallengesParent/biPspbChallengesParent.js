// This Lightning Web Component is a template with tab navigation for Challenges and Trophy Case, along with sections for Avatar Navigation and Challenge Component.
//To import Libraries
import { LightningElement } from 'lwc';
import { resources } from "c/biPspLabelAndResourceChallenges";
//To get Current UserId
import Id from '@salesforce/user/Id';


export default class BiPspbChallengesParent extends LightningElement {
  //Proper naming conventions with camel case for all the variable will be followed in the future releases
  currentXPvalue;
  userId = Id;
  urlq;
  slashUrl = resources.SLASH_URL;
  slashSite = resources.SLASH_SITEURL;
  siteChallengesUrlBranded = resources.BRANDED_CHALLENGES_SITEURL;
  siteTrophyCaseUrlBranded = resources.BR_TROPHY_CASE_SITE_URL;
  challengeNavValue = resources.CHALLANGENAVVALUE;
  tropyCaseNavValue = resources.TROPHYCASENAVVALUE;
   showSpinner = true;

  // To identify the site url
  renderedCallback() {
    let globalThis = window;
    try {
      const currentURL = window.location.href;
      const urlObject = new URL(currentURL); // Create a URL object // Get the path
      const path = urlObject.pathname; // Get the path
      const pathComponents = path.split('/'); // Split the path using '/' as a separator
      const desiredComponent = pathComponents.find((component) =>
        [resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
          component.toLowerCase()
        )
      ); // Find the component you need (in this case, 'Branded')

      if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
        this.urlq = resources.BRANDED_URL;
      } else {
        this.urlq = resources.UNASSIGNED_URL;
      }
    
    } catch (error) {
     globalThis.sessionStorage.setItem('errorMessage', error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
    }
  }

  // This is used for send the Xp value to child Avatar Component
  sendxpvalue(event) {
    this.currentXPvalue = event.detail;
  }

  // This is used for navigate to specific url to the Challenges Page
  openChallenges() {
    window.location.assign(
      this.slashUrl + this.urlq + this.slashSite + this.siteChallengesUrlBranded
    );
  }

  // This is used for navigate to specific url to the Trophy Page
  openTrophyCase() {
    window.location.assign(
      this.slashUrl + this.urlq + this.slashSite + this.siteTrophyCaseUrlBranded
    );
  }
  handleComponentLoad() {
    // Once the child component has finished loading, hide the spinner
    this.showSpinner = false;
  }
  
}