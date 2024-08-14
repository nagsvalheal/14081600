//This LWC is used UserSymptomTracker graph download in pdf - biPspbSymptomTrackerPdf
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import * as label from 'c/biPspbLabelAndResourceSymptom';
import FETCH_SYMPTOM_EROLLE from '@salesforce/apex/BI_PSP_SymptomTrackerGraphCtrl.getSymptomTrackerDetails';
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import GET_SELECTED_PATIENT from '@salesforce/apex/BI_PSP_CurrentUser.returnTheAccounts';
//import html2canvas from '@salesforce/resourceUrl/htmljs';

export default class BiPspbSymptomTrackerPdf extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	dateWithAllery = [];
	remainingItems = [];
	highlight = false;
	showLine;
	dateWithAlleryTwo = [];
	dateWithAlleryThree = [];
	dateWithAlleryFour = [];
	dateWithAlleryFive = [];
	dateWithAlleryAll = [];
	rightLess;
	nextSeven;
	nextSevenOne;
	nextSevenTwo;
	nextSevenThree;
	//Variable declaration
	monthName;
	monthValue;
	currentYear;
	selectedMonthValue;
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
	navLogo = label.SITE_LOGO;
	userId = label.ID;
	errorMessage;
	userName;
	patientName = label.PATIENT_NAME;
	periodLabel = label.PERIOD_LABEL;
	itchinessLabel = label.ITCHINESS_VALUES;
	rednessLabel = label.REDNESS_VALUE;
	temperatureLabel = label.TEMPERATURE_VALUES;
	pustulesLabel = label.PUSTULES_VALUE;
	painLabel = label.PAIN_VALUES;
	fatigueLabel = label.FATIGUE_VALUES;
	moodLabel = label.MOOD_IMG;
	placeholder = label.MONTH;
	showEditBtn = false;
	noTriggers= false;
	nohoto =false;
	nodisplay =true;
selectedMonth;
selectedYear;

	//It retrieves URL parameters such as 'eroll', 'firstdate', and 'lastdate' to fetch symptom data for a specific enrollee within a given date range.
	connectedCallback() {
	
			let globalThis = window;
			let urlParams = new URLSearchParams(globalThis.location?.href.split(label.QUESTION_MARK)[1]);
			let eroll = urlParams.get(label.EROLLS);
			this.selectedMonth = urlParams.get(label.FIRST_DATE);
			this.selectedYear = urlParams.get(label.LAST_DATE);
			console.log(this.selectedMonth,'firstdate',this.selectedYear);
			
			this.getsymptomdatewithallergy(eroll);
			if (label.ID !== null && label.ID !== undefined) {
				USER_DETAILS()
					// Null data is checked and AuraHandledException is thrown from the Apex
					.then(user => {
						if (user.BI_PSPB_Caregiver__c === false) {
							this.userName = user.FirstName + ' ' + user.LastName;
						} else {
							// this.getSelectedPatientId();
							GET_SELECTED_PATIENT()
							.then(data => {
					        	// Null data is checked and AuraHandledException is thrown from the Apex
								this.userName = data[0].Name;
							})
							.catch(error => {
								this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
							})
						}
					})
					.catch(error => {
						this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
					})
			}
	
	}


	// Handles the change event when the user selects a new month in the category dropdown.
	
	//Handles errors by displaying a toast message.
	getsymptomdatewithallergy(erolles) {
			FETCH_SYMPTOM_EROLLE({ erolleId: erolles})
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {
					console.log(result,'result');
					const filteredResults = this.filterResultsByDate(result);
					//  console.log('FilteredJSONJSONJSONJSON Results:', JSON.stringify(filteredResults, null, 2));
					this.updateDisplay(JSON.stringify(filteredResults, null, 2));
					 
            })
				.catch(error => {
					this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
				});
	}
	// Method to filter results by date
filterResultsByDate(results) {
	console.log('OUTPUT : ',results);

	console.log('OUTPUT :selectedYear ',this.selectedMonth,this.selectedYear);
      const selectedMonth = parseInt(this.selectedMonth, 10);
    const selectedYear = parseInt(this.selectedYear, 10);

    return results.filter(item => {
        const itemDate = new Date(item.dates); // 'dates' field contains date string in 'YYYY-MM-DD' format
        const itemMonth = itemDate.getMonth() + 1; // getMonth() is zero-based, so add 1
        const itemYear = itemDate.getFullYear();

        // Compare itemMonth and itemYear with selectedMonth and selectedYear
        return itemMonth === selectedMonth && itemYear === selectedYear;
    });
}


updateDisplay(resultRecord) {
    console.log('Type of resultRecord:', typeof resultRecord);
    console.log('Is Array:', Array.isArray(resultRecord));
    console.log('Filtered Results:', resultRecord);

    resultRecord = JSON.parse(resultRecord);

    this.dateWithAllery = [];
    this.picklistOptions1 = [];
    const uniqueMonthsYears = new Set();

    resultRecord.forEach(item => {
        const formattedDate = this.parseDate(item.dates);
        if (!formattedDate) return;

        const existingDate = this.dateWithAllery.find(entry => entry.dates === formattedDate);
        if (existingDate) {
            const imageUrl = this.getImagesForName(item.name);
            console.log('Adding image URL:', imageUrl);
            existingDate.imageUrls.push(imageUrl);
        } else {
            this.dateWithAllery.push({
                dates: formattedDate,
                imageUrls: [this.getImagesForName(item.name)],
                symptom: item.symptom
            });
        }

        const date = new Date(item.dates);
        if (!isNaN(date.getTime())) {
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const monthYear = `${month} ${year}`;
            uniqueMonthsYears.add(monthYear);
        }
    });

    this.picklistOptions1 = Array.from(uniqueMonthsYears)
        .map(monthYear => ({
            label: monthYear,
            value: monthYear
        }));

    this.fetchAndDisplayDataForSelectedMonth();
}


parseDate(dateString) {
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? null : date.toISOString()
			.split('T')[0];
	}

	//This function is typically called to allow users to print the content of the page.
	myFunction() {
		let globalThis = window;
		globalThis.print();
	}
	//The image URL corresponding to the symptom name.
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
	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}