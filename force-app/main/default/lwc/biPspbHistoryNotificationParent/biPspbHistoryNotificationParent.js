//This Consolidated component is used to display the History Notification For Patient on click of the notification icon in Dashboard
//To import the Libraries
import { LightningElement } from 'lwc';
import {resources} from 'c/biPspbNotificationReminderResources';
export default class BiPspbHistoryNotificationParent extends LightningElement 
{
	actionRequired = resources.ACTION_REQUIRED_HEADING;
	general = resources.GENERAL_HEADING;
	history = resources.BI_PSP_HISTORY;
	// To fetch the URL path
	connectedCallback() 
	{
		try 
		{
			let globalThis = window;
			let CURRENT_URL = globalThis.location?.href;
			let URL_OBJECT = new URL(CURRENT_URL); 
			let PATH = URL_OBJECT.pathname; 
			let PATHCOMPONENTS = PATH.split('/'); 
			let DESIREDCOMPONENT = PATHCOMPONENTS.find(component =>
				[resources.BRANDED_SITE_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);

			if (DESIREDCOMPONENT.toLowerCase() === resources.BRANDED_SITE_URL.toLowerCase()) 
			{
				this.urlq = resources.BRANDED_SITE_URL;
			}
			else 
			{
				this.urlq = resources.UNASSIGNED_URL;
			}
		}
		catch (error)
		{
			let globalThis=window;
			globalThis.location.href = resources.ERROR_PAGE;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
		}
	}
	// navigation for messagecenter page  
	openGeneral() 
	{
		let globalThis = window;
		globalThis.location?.assign(resources.MESSAGE_CENTER_URL);
	}
	// navigation for action page 
	openActionReq() 
	{
		let globalThis = window;
		globalThis.location?.assign(resources.ACTION_URL);
	}
	// navigation for history
	openHistory() 
	{
		let globalThis = window;
		globalThis.location?.assign(resources.HISTORY_URL);
	}
}