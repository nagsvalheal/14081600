/*The Consolidate Component serves as a centralized container for organizing and presenting multiple Questionnaire cards 
within the Lightning Web Component. */
import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';
export default class BiPspbOutstandingPage extends LightningElement {
	userid = Id;
	showSpinner = true;
	values = []; // Initialize as an empty array

	handleValueChange(event) {
		const { value } = event.detail;
		this.values.push(value);
		if (this.values.length >= 2) {
			this.showSpinner = false;
		}
	}

}