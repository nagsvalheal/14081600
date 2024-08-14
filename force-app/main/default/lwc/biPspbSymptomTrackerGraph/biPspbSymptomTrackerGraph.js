import {
	LightningElement
	, wire
}
from 'lwc';
import GET_ENROLLE from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import FETCH_SYMPTOM_EROLLE from '@salesforce/apex/BI_PSP_SymptomTrackerGraphCtrl.getSymptomTrackerDetails';
import GET_LATEST_SYMPTOM_RECORD from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class BiPspbSymptomTrackerGraph extends LightningElement {
	// Variables declaration
	receivedValue;
	dateWithAllery = [];
	highlight = false;
	showDiv = false;
	remainingItems = [];
	pdfName;
	firstDate;
	lastDate;
	symptomIdGet;
	checkValue = false;
	showLine;
	currentDisplayIndex = 0;
	dateWithAlleryTwo = [];
	dateWithAlleryThree = [];
	dateWithAlleryFour = [];
	leftLess;
	rightLess;
	showSpinner = false;
	showChart = false;
	updateValue = false;
	understand = false;
	latestRecord;
	throwErrorMessage = false;
	showLoading = true;
	urlq;
	enrolleId;
	montss;
	yellowEllipse = label.YELLOW_ELLIPSE;
	rightImg = label.RIGHT_ICON;
	darkRedEllipse = label.DARK_RED_ELLIPSE;
	blueEllipse = label.BLUE_ELLIPSE;
	verticalLine = label.VERTICAL_LINE;
	greenEllipse = label.GREEN_ELLIPSE;
	violetEllipse = label.VIOLET_ELLIPSE;
	redEllipse = label.RED_ELLIPSE;
	darkYellowEllipse = label.DARK_YELLOW_ELLIPSE;
	alternateTextTickIcon = label.ALTERNATE_TICK;
	alternateTextVerticalLine = label.ALTERNATE_VERTICAL_LINE;
	alternateTextBallIcon = label.ALTERNATE_ALLERGY_ICON;
	bubbles = '';
	userId = label.Id;
	errorMessage;
	showError;
	CURRENT_INDEX = 0;
	showPopup;
	placeholder = label.MONTH;
	symptomDeclaration = label.SYMPTOM_DECLARATION;
	comeTommorow = label.COME_TO_COMPLETE;
	symptomTrackerLabel = label.SYMPTOM_TRACKER_LABEL;
	noSymptomThisMonth = label.NO_SYMPTOM_THIS_MONTH;
	addNewEntry = label.ADD_NEW_ENTRY;
	clickDateLabel = label.CLICK_DATE;
	pastEntries = label.PAST_ENTRIES;
	updateSymptoms = label.UPDATE_SYMPTOM;
	downloadLabel = label.DOWNLOAD_LABEL;
	itchinessLabel = label.ITCHINESS_VALUES;
	rednessLabel = label.REDNESS_VALUE;
	temperatureLabel = label.TEMPERATURE_VALUES;
	pustulesLabel = label.PUSTULES_VALUE;
	painLabel = label.PAIN_VALUES;
	fatigueLabel = label.FATIGUE_VALUES;
	moodLabel = label.MOOD_IMG;
	confirmSubmission = label.CONFIRM_SUBMISSION;
	aboveInformationCorrect = label.UNDERSTAND_PROVIDED_INFO;
	iUnderstand = label.I_UNDERSTAND;
	sureDownloadSymptom = label.SURE_DOWNLOAD_SYMPTOM;
	yesLabel = label.YES;
	noLabel = label.NO;
	selectedMonthValue;
	ToastMsg = `${this.symptomDeclaration} ${this.comeTommorow}`;
	picklistOptions1 = [];
	filteredOptions;
	selectedOption1;
	bars = [];
	currentYear = new Date()
		.getFullYear();
	currentMonth = new Date()
		.getMonth();
	currentIndex = 0;
	connectedCallback() {
		const globalThis = window;
		this.receivedValue = globalThis?.sessionStorage.getItem('someDynamicValue')
		if (this.receivedValue) {
			this.showDiv = true;
		globalThis.sessionStorage.clear();


		}
    this.setDefaultMonthValue(); // Set the default month and year
    this.processURL();
    this.retrievePrimaryPage();
    this.fetchEnrollmentData();
    this.fetchAndDisplayDataForSelectedMonth(); // Fetches data for the default month and year
}
renderedCallback() {
    // Set the default selection in the dropdown
    const selectElement = this.template.querySelector('.selectWidth');
    if (selectElement && this.selectedOption1) {
        selectElement.value = this.selectedOption1;
    }
}

	setDefaultMonthValue() {
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    this.selectedOption1 = `${currentMonthName} ${currentYear}`; // Set the current month and year as default
}

handleCategoryChange(event) {
    this.selectedOption1 = event.target.value; // Update selectedOption1 based on user selection
    this.checkValue = false;
    this.fetchAndDisplayDataForSelectedMonth(); // Fetch and display data based on the selected month
    this.getsymptomdatewithallergy(this.enrolleId); // Fetch allergy data if needed
}
	handleRightClick(event) {
		event.preventDefault();
		if (this.rightLess) {
			this.currentIndex += 7;
			this.updateDisplayedRecords();
		}
	}
	handleLeftClick(event) {
		if (event.button === 0) {
			if (this.leftLess) {
				this.currentIndex -= 7;
				this.updateDisplayedRecords();
			}
		}
	}

	handleclose() {
		this.showDiv = false;
	}
	getsymptomdatewithallergy(erolleId) {
		FETCH_SYMPTOM_EROLLE({
				erolleId
			})
			.then(result => {
				if (result) {
					const uniqueMonthsYears = new Set();
					this.dateWithAllery = [];
					this.picklistOptions1 = [];
					result.forEach(item => {
						const formattedDate = this.parseDate(item.dates);
						if (!formattedDate) return;
						const existingDate = this.dateWithAllery.find(entry => entry.dates === formattedDate);
						if (existingDate) {
							existingDate.imageUrls.push(this.getImagesForName(item.name));
						}
						else {
							this.dateWithAllery.push({
								dates: formattedDate
								, imageUrls: [this.getImagesForName(item.name)]
								, symptom: item.symptom
							});
						}
						const date = new Date(item.dates);
						if (!isNaN(date.getTime())) {
							const month = date.toLocaleString('default', {
								month: 'long'
							});
							const year = date.getFullYear();
							const monthYear = `${month} ${year}`;
							uniqueMonthsYears.add(monthYear);
						}
					});
					this.picklistOptions1 = Array.from(uniqueMonthsYears)
						.map(monthYear => ({
							label: monthYear
							, value: monthYear
						}));
					// Ensure that the default month and year data is displayed
					this.fetchAndDisplayDataForSelectedMonth();
				}
				else {
					this.showChart = false;
					this.throwErrorMessage = true;
				}
			})
			.catch(error => {
				this.handleError(error.body.message);
			});
	}
	parseDate(dateString) {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date.toISOString()
			.split('T')[0];
	}
	fetchAndDisplayDataForSelectedMonth() {
    if (!this.selectedOption1) return;

    const [monthName, year] = this.selectedOption1.split(' ');
    const selectedDate = new Date(`01 ${monthName} ${year}`);
    const selectedMonth = selectedDate.getMonth();
	this.selctmonthvalue =selectedMonth + 1;
	console.log(this.selctmonthvalue,'this.selctmonthvalue')


    const selectedYear = selectedDate.getFullYear();
		this.selctyear = selectedYear;
		console.log(this.selctyear,'this.selctyear')


    this.filteredOptions = this.dateWithAllery.filter(entry => {
        const entryDate = new Date(entry.dates);
        return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
    });
    this.currentIndex = 0;
    this.updateDisplayedRecords(); // Update the displayed records based on the selected month
}
	updateDisplayedRecords() {
		const totalRecords = this.filteredOptions.length;
		if (this.currentIndex < 0) {
			this.currentIndex = 0;
		}
		this.leftLess = this.currentIndex > 0;
		this.rightLess = this.currentIndex + 7 < totalRecords;
		this.dateWithAllery = this.filteredOptions.slice(this.currentIndex, this.currentIndex + 7);
		if (this.dateWithAllery.length > 0) {
			this.throwErrorMessage = false;
			this.showLine = true;
			this.showChart = true;
			this.updateChartBars();
		}
		else {
			this.throwErrorMessage = true;
			this.showLine = false;
			this.showChart = false;
			this.bars = [];
		}
	}
	getImagesForName(name) {
		switch (name) {
		case label.REDNESS_VALUE:
			return label.RED_ELLIPSE;
		case label.ITCHINESS_VALUES:
			return label.DARK_YELLOW_ELLIPSE;
		case label.PAIN_VALUES:
			return label.VIOLET_ELLIPSE;
		case label.PUSTULES_VALUE:
			return label.GREEN_ELLIPSE;
		case label.FATIGUE_VALUES:
			return label.BLUE_ELLIPSE;
		case label.TEMPERATURE_VALUES:
			return label.DARK_RED_ELLIPSE;
		case label.MOOD_IMG:
			return label.YELLOW_ELLIPSE;
		default:
			return label.DARK_RED_ELLIPSE;
		}
	}

	processURL() {
		const globalThis = window;
		const CURRENT_URL = globalThis.location.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component => [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase()));
		if (DESIRED_COMPONENT.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
			this.urlq = label.BRANDED_URL_NAVIGATION;
		}
		else {
			this.urlq = label.UNASSIGNED_URL_NAVIGATION;
		}
	}
	retrievePrimaryPage() {
		let globalThis = window;
		const primaryPopup = globalThis.sessionStorage.getItem(label.PRIMARY_PAGES);
		if (primaryPopup) {
			this.openundersatand();
		}
	}
	fetchEnrollmentData() {
		GET_ENROLLE()
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then((result) => {
					if (result && result[0].Id !== null) {
						this.enrolleId = result[0].Id;
						this.processURLParameters();
					}
				})
				.catch((error) => {
					// Handle any errors occurring during the promise chain
					this.handleError(error.body.message);
				});
	}
	processURLParameters() {
		const globalThis = window;
		const urlParams = new URLSearchParams(globalThis.location.search);
		const eroll = urlParams.get(label.EROLLS);
		const firstDate = urlParams.get(label.FIRST_DATE);
		const lastDate = urlParams.get(label.LAST_DATE);
	
		const month = urlParams.get(label.MONTHS);
		this.firstDate = firstDate;
		this.lastDate = lastDate;
		this.selectedMonthValue = month;
		if (eroll) {
			const selectElement = this.template.querySelector('.selectWidth');
			if (selectElement) {
				selectElement.value = month;
			}
			this.getsymptomdatewithallergy(eroll);
		}
	}
	updateChartBars() {

		this.bars = this.dateWithAllery.map(entry => {
			// Parse the date string into a Date object
			const date = new Date(entry.dates);
			// Format the date as "day month"
			const day = date.getDate()

				.toString()
				.padStart(2, '0'); // Ensures day is two digits
				
			const month = date.toLocaleString('default', {
				month: 'short'
			}); // "Jan", "Feb", etc.
			const formattedDate = `${day} ${month}`;
			return {
				height: `${entry.imageUrls.length * 20}px`
				, dates: formattedDate, // Use the formatted date here
				imageUrls: entry.imageUrls
			};
		});
	}
	showHighlighter(event) {
		// Get the clicked key from the event
		const clickedKey = event.target.dataset.item;
		// Select all elements with the class 'bar'
		const bars = this.template.querySelectorAll('.bar');
		// Iterate over all the bar elements
		bars.forEach(bar => {
			if (bar.dataset.item === clickedKey) {
				// Highlight the clicked bar
				bar.style.backgroundColor = '#ECDCA8';
				bar.style.borderRadius = '12px';
			}
			else {
				// Reset the style for other bars
				bar.style.backgroundColor = '';
				bar.style.borderRadius = ''; // Make sure to reset borderRadius as well
			}
		});
		// Find the existing date object based on the clicked key
		const EXISTING_DATE = this.dateWithAllery.find(entry => {
			const date = new Date(entry.dates);
			const day = date.getDate()
				.toString()
				.padStart(2, '0');
			const month = date.toLocaleString('default', {
				month: 'short'
			});
			const formattedDate = `${day} ${month}`;
			return formattedDate === clickedKey;
		});
		// Update symptomIdGet with the symptom of the existing date
		this.symptomIdGet = EXISTING_DATE ? EXISTING_DATE.symptom : null;
		// Update checkValue based on the existence of symptomIdGet
		this.checkValue = !!this.symptomIdGet;
	}
	@wire(GET_LATEST_SYMPTOM_RECORD, {
		careProgramEnrolleeId: '$enrolleId'
	})
	wiredLatestRecord({
		error
		, data
	}) {
		try {
			if (data && data !== null) {
				this.latestRecord = data[0];
				this.errorMessage = ''; // Clear any previous error
			}
			else if (error) {
				this.latestRecord = null;
				this.errorMessage = label.LATEST_RECORD;
				this.handleError(error.body.message);
			}
		}
		catch (ex) {
			this.handleError(ex.body.message);
			this.errorMessage = label.UNEXPECTED_ERROR;
		}
	}
	// Function to update the displayed data to the next seven days
	updatesymptom() {
		this.showSpinner = true;
		let globalThis = window;
		globalThis.location.assign(this.urlq + label.SYMPTOM_MAIN_PAGE_URL);
		globalThis.localStorage.clear();
		
	}
	doNotLogout() {
		this.showPopup = false;
		document.body.style.overflow = ''; // Reset to default
	}
	openShowPopUp() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden'; //This is the css property of overflow so this can't be through customlabel
	}
	captureComponent() {
		let globalThis = window;
		if (this.selectedMonthValue !== null && this.dateWithAllery !== null) {
			let currenturl = globalThis.location.href?.split(label.SLASH_LATTER)[0];
			globalThis.open(currenturl + label.SYMPTOM_TRACKER_PDF + this.enrolleId + 
			 label.FIRST_DATE_GRAPH + this.selctmonthvalue + label.LAST_DATE_GRAPH + this.selctyear);
		}
		this.doNotLogout()
	}
}