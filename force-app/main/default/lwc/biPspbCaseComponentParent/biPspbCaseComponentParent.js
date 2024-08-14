import { LightningElement } from 'lwc';

import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbCaseComponentParent extends LightningElement {
	supportCenter = support.SUPPORT_CENTER;
	myCase = support.MYCASE;
	connectedCallback() {
		try {
			const globalThis = window;
		const CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);        // Get the path
		const PATH = URL_OBJECT.pathname;        // Split the path using '/' as a separator
		const PATH_COMPONENTS = PATH.split('/');        // Find the component you need (in this case, 'Branded')
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
		if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
			this.urlq = support.BRANDED_URL;
		}
		else {
			this.urlq = support.UNASSIGNED_URL;
		}
		} catch (error) {
			this.showToast(error.message);
		}
		
	}
	showToast(errorMessage) {
		let global = window;
	global.location?.assign(this.urlq + support.ERROR_PAGE);
	global.sessionStorage.setItem('errorMessage', errorMessage);
	}
	openSupportCenter() {
		window.location.assign(support.SUPPORT_PAGE_URL);
	}
	openMyCases() {
		window.location.assign(support.MY_CASE_URL);
	}
}