//This is parent component that hold Introduction Questionnaire and Avatar
import { LightningElement } from 'lwc';
export default class BiPspbMyGppParent extends LightningElement {
    showSpinner = true;
	values = []; // Initialize as an empty array

	handleValueChange(event) {
		const { value } = event.detail;
		this.values.push(value);
		if (this.values.length >= 1) {
			this.showSpinner = false;
		}
	}

}