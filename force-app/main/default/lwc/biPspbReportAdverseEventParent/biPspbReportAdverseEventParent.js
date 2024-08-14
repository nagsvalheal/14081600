// This LWC is designed for Adverse Event Main Page that contains consolidated components for avatar , message
// To import Libraries
import { LightningElement, track } from 'lwc';
// To import Custom Labels
import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbReportAdverseEventParent extends LightningElement 
{
	successMsg = support.SUPPORT_CENTER;
	myCase = support.MYCASE;
	// Declaration of variable with @track
	@track valueError;
	// To navigate the user to the respective Branded or Unassigned site
	connectedCallback() 
	{
		let globalThis = window;
		try
		{
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) 
			{
				this.urlq = support.BRANDED_URL_NAVI;
			}
			else 
			{
				this.urlq = support.UNASSIGNED_URL_NAVI;
			}
		}
		catch(error)
		{
			this.showToast(error.message);
		}
	}
	// To navigate to the My Support Page
	openSupportCenter() 
	{
		window.location.assign(this.urlq + support.SUPPORT_PAGE_URL);
	}
	// To navigate to the My Cases Page
	openMyCases() 
	{
		window.location.assign(this.urlq + support.MY_CASE_URL);
	}
	showToast(errorMessage) 
	{
		let global = window;
		global.location?.assign(this.urlq + support.ERROR_PAGE);
		global.sessionStorage.setItem('errorMessage', errorMessage);
	}
	
	// The following event is used in the HTML file
	errorvalue(event) 
	{
		this.valueError = event.detail;
	}
}