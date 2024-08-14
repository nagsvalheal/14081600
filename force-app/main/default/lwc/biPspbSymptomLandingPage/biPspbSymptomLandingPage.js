// This LWC serves as a landing page for a symptom tracker, offering options to create new entries and displaying a happy face image. 
// It dynamically determines the URL based on the current page and navigates users accordingly.
// To import Libraries
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
import USER_ENROLLEE_ID from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import FETCH_SYMPTOM_ENROLLEE from '@salesforce/apex/BI_PSP_SymptomTrackerGraphCtrl.getSymptomTrackerDetails';
export default class BiPspbSymptomLandingPage extends NavigationMixin(LightningElement) {
	graphDatas = '';
	isLoading = true;
	edits;
	userId = label.ID;
	enrolleeId;
	showSymptom = false;
	//variable declaration
	emptyGraph = label.EMPTY_GRAPH;
	symptomTracker = label.SYMPTOM_TRACKER_LABEL;
	noSymptomYet = label.NO_SYMPTOM_YET;
	createNewEntry = label.CREATE_NEW_ENTRY ;
	alternateTextEmptyGraph = label.ALTERNATE_TEXT_EMPTY_GRAPH;
    showSpinner=false;
	//This method is called when the component is connected to the DOM.
	connectedCallback() {
		let globalThis = window;
		try {
			this.loadEnrolleeData();
			const currentURL = globalThis.location?.href;
			// Create a URL object
			const urlObject = new URL(currentURL);
			// Get the path
			const path = urlObject.pathname;
			// Split the path using '/' as a separator
			const pathComponents = path.split(label.SLASH);
			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find(component =>
				[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
				this.brandedOrUnassigned = label.BRANDED_URL_NAVIGATION;
			}
			else {
				this.brandedOrUnassigned = label.UNASSIGNED_URL_NAVIGATION;
			}
		}
		catch (error) {
			this.handleError(error.body.message);
		}
	}

	handleError(error) {
        let globalThis=window;
        globalThis.location.href = label.ERROR_PAGE;
        globalThis.sessionStorage.setItem('errorMessage', error);
    }
	openEntryDate() {
		let globalThis = window;
		globalThis.location?.assign(label.SYMPTOM_MAIN_PAGE_URL)
		globalThis.localStorage.clear()
	}

	// Determine component type based on URL path
	// Fetch enrollee data and handle response
	loadEnrolleeData() {
		USER_ENROLLEE_ID()
			.then(data => {
				if (data && data.length > 0) {
					this.enrolleeId = data[0].Id;
					this.getSymptom();
				} else {
					this.showError = true;
					this.ERROR_MESSAGE = label.ENROLLEE_ERROR;
				}
			})
			.catch(error => {
				// Handle any errors occurring during the promise chain
				this.handleError(error.body.message);
			});
	}
	//This function is responsible for fetching symptom data for the current month.
	getSymptom() {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonthIndex = currentDate.getMonth();
		const currentMonthName = [
			label.JANUARY, label.FEBRUARY, label.MARCH, label.APRIL, label.MAY, label.JUNE,
			label.JULY, label.AUGUST, label.SEPTEMBER, label.OCTOBER, label.NOVEMBER, label.DECEMBER
		][currentMonthIndex];
		const selectedMonthIndex = currentMonthIndex; // Calculate first date (last date of previous month)
		const firstDate = new Date(currentYear, selectedMonthIndex, 0, 18, 30, 0);
		let lastDate = new Date(currentYear, selectedMonthIndex + 1, 1, 18, 30, 0); // Adjust for next year if necessary
		if (selectedMonthIndex === 11) {
			lastDate.setFullYear(currentYear + 1);
		}
		this.firstdate = firstDate.toISOString();
		this.lastDate = lastDate.toISOString();
		this.getSymptomDateWithAllergy({
			enrollees: this.enrolleeId,
			firstDate: firstDate.toISOString(),
			lastDate: lastDate.toISOString(),
			currentMonthName: currentMonthName
		});
	}
	//This function is responsible for fetching symptom data for a specific enrollee within a given date range.
	getSymptomDateWithAllergy({
		enrollees,
		firstDate,
		lastDate,
		currentMonthName
	}) {
		let globalThis = window;
		FETCH_SYMPTOM_ENROLLEE({
				erolleId: enrollees,
				firstDate: firstDate,
				lastDate: lastDate
			})
			.then(result => {
				
				
				
				if (result && result.length > 0) {
					globalThis.location.assign(this.brandedOrUnassigned + label.SYMPTOM_GRAPH_URL + this.enrolleeId + label.FIRST_DATE_GRAPH + this.firstdate + label.LAST_DATE_GRAPH + this.lastDate + label.MONTH_DATE + currentMonthName);
					this.isLoading  = true;
		

				} else {
					let urlParams = new URLSearchParams(globalThis.location.href.split(label.QUESTION_MARK)[1]);
					this.EDITS = urlParams.get(label.EDITS);
					this.isLoading  = false;
				}
			})
			.catch(error => {
				this.handleError(error.body.message);
			});
	}

	
}