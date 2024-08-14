// This component is designed to display the ranks of the user based on their Challenges XP value
import { LightningElement, api } from 'lwc';
import { resources } from "c/biPspLabelAndResourceChallenges";
export default class BiPspRankComponent extends LightningElement {
	@api image;
	@api date;
	@api level;
	showBold;
	altValue = resources.ALTVALUE;
	
	// According to the date value, UI experience will be rendered
	connectedCallback() {
		if (this.date) {
			this.showBold = true;
		}
		else {
			this.showBold = false;
		}
	}
}