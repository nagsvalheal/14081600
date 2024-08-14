//This Lightning web component facilitates setting up reminders and treatment schedules, allowing users to save and manage their healthcare appointments efficiently
// To import Libraries
import { LightningElement,wire } from "lwc";
// To import the apex classes
import AVATAR from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import GOOGLE_URL from "@salesforce/apex/BI_PSPB_GoogleCalendarCtrl.generateGoogleCalendarUrl";
import OUTLOOK_URL from "@salesforce/apex/BI_PSPB_OutlookReminderCalendarCtrl.generateOutlookCalendarUrl";
import REMINDER_DATES from "@salesforce/apex/BI_PSPB_TreatmentCtrl.createRemainderRecord";
import PREPOPULATED_VALUES from "@salesforce/apex/BI_PSPB_TreatmentWidgetCtrl.prepopulatedValues";
// To import labels
import {resources} from 'c/biPspbNotificationReminderResources';

export default class BiPspbReminderSetup extends LightningElement {
	//Variable declaration
	dobErrorMessage;
	showDiv = false;

	isSubmitButtonDisabled = false;
	variable = true;
	selectedDate;
	reminderSetup = resources.REMINDER_SETUP;
	selectedReminders = [];
	selectedTreatment = [];
	datePlaceHolder = resources.DATE_PLACE_HOLDER;
	showMessage = false;
	showMessageTwo = false;
	value = [];
	treatValue = [];
	formattedReminderDates = [];
	cpeId;
	doneLabel = resources.DONE_LABEL;
	reminders = resources.REMINDERS;
	alternateForTick = resources.ALTERNATE_TICK;
	alternateForError = resources.ALTERNATE_ERROR;
	alternateForBox = resources.ALTERNATE_BOX;
	alternateForGoogleCalendar = resources.ALTERNATE_GOOGLE_CALENDAR;
	alternateForOutlookCalendar = resources.ALTERNATE_OUTLOOK_CALENDAR;
	alternateForAvatar = resources.ALTERNATE_AVATAR;
	timeline = resources.TIMELINE;
	dateOfTreatment = resources.DATE_OF_TREATMENT;
	daysBefore = resources.DAYS_BEFORE;
	dayBefore = resources.DAY_BEFORE;
	dayOne = resources.DAY_ONE;
	daySeven = resources.DAY_SEVEN;
	dayTen = resources.DAY_TEN;
	whenTreatment = resources.WHEN_TREATMENT;
	fieldRequired = resources.FIELD_REQUIRED;
	dayFourteen = resources.DAY_FOURTEEN;
	dayThree = resources.DAY_THREE;
	receiveReminder = resources.RECEIVE_REMINDER;
	recieveReminderDate = resources.RECEIVE_REMINDER_DATE;
	dateRequiredField = resources.DATE_OF_TREATMENT_FIELD;
	setTreatmentPrescription = resources.SET_TREATMENT_PRESCRIPTION;
	treatmentReminderView = resources.TREATMENT_REMINDER_MOBILE;
	useReminderView = resources.USE_REMINDER_MOBILE;
	lookReminders = resources.LOOK_REMINDERS;
	setTreatmentText = resources.SET_TREATMENT;
	avatarTextOne = resources.REMINDER_AVATAR_ONE;
	avatarTextTwo = resources.REMINDER_AVATAR_TEXT;
	avatarTextThree = resources.REMINDER_AVATAR_THREE;
	save = resources.SAVE;
	isPartVisible = false;
	googleCalendarUrls = [];
	outlookCalendarUrls = [];
	prepopulatedValues = [];
	existingReminder = [];
	userId = resources.ID;
	selectCalendar = resources.SELECT_CALENDAR;
	reminderText = resources.REMINDER_TEXT;
	addCalendar = resources.ADD_CALENDAR;
	boxedIcon = resources.BOXED_ICON;
	valueOne;
	valueTwo;
	valueThree;
	treatValueOne;
	treatmentValue;
	closeDot = true;
	clss = true;
	defaultClass = true;
	checkingdata = false;
	disableFourteen = false;
	disableTen = false;
	disableSeven = false;
	checkedFourteen = false;
	checkedTen = false;
	checkedSeven = false;
	checkedThree = false;
	checkedOne = false;
	showAfterSaveContent = true;
	showBeforeSaveContent = true;
	checkdata = false;
	//Variable declaration
	userAccounts;
	selectedAvatarSrc;
	rightimg = resources.TICK;
	googleCalIcon = resources.GOOGLE_ICON;
	outlookCalIcon = resources.OUTLOOK_ICON;
	warning = resources.WARNING;
	name;
	rendered = false;
	//To fetch data for the treatment reminder 
	@wire(PREPOPULATED_VALUES)
	wiredPrepopulatedValues({ data , error }) {
		try{
			if (data) {
				this.prepopulatedValues = data;
				this.selectedDate = data["Day of Treatment"];
				this.existingReminder = data.selectedCheckboxes ? data.selectedCheckboxes.split(';').filter(item => item).map(item => parseFloat(item)) : [];
				this.updateCheckboxDisabling();
				this.updateCheckBoxValues();
			}   
			
			if (typeof window !== 'undefined') {
					this.dispatchEvent(new CustomEvent('load'));
				}
			else if (error) {
				this.handleError(error.body.message);
			}
		} catch {
			this.handleError(error.body.message);
		}
	}
	// Getting avatar of the logged in caregiver.
	@wire(AVATAR)
	wiredAvatarImage({ error, data }) {
		try {
			if (data) {
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0].BI_PSP_AvatarUrl__c : resources.DEFAULT_AVATAR_URL;
			} else if (error) {
				this.handleError(error.body.message);
			}
		} catch {
			this.handleError(error.body.message);
		}
	}
	//Updating the values of the checked boxes.
	updateCheckBoxValues() {
		this.value = [];
		this.treatValue = [];
		const reminders = [14, 10, 7, 3, 1];
		const reminderMappings = {
			14: { array: 'value', checkProp: 'checkedFourteen' },
			10: { array: 'value', checkProp: 'checkedTen' },
			7: { array: 'value', checkProp: 'checkedSeven' },
			3: { array: 'treatValue', checkProp: 'checkedThree' },
			1: { array: 'treatValue', checkProp: 'checkedOne' }
		};
		reminders.forEach(reminder => {
			this.updateReminder(reminder, reminderMappings[reminder]);
		});
	}
	// Updates the reminder status and associated array based on its existence in the existingReminder list.
	updateReminder(reminder, config) {
		const isChecked = this.existingReminder.includes(reminder);
		if (isChecked) {
			this[config.array].push(reminder);
		}
		this[config.checkProp] = isChecked;
	}
	// Disables checkboxes based on the number of days between the current date and the selected date.
	updateCheckboxDisabling() {
		const CURRENT_DATE = new Date();
		let selectedDate = new Date(this.selectedDate);
		const DIFFERENCE_DAYS = Math.floor(
			(selectedDate - CURRENT_DATE) / (1000 * 60 * 60 * 24)
		);
		this.disableFourteen = DIFFERENCE_DAYS < 14;
		this.disableTen = DIFFERENCE_DAYS < 10;
		// Update the checked properties based on the disabling status
		if (this.disableFourteen) this.checkedFourteen = false;
		if (this.disableTen) this.checkedTen = false;
	}
	// Calling the method setMinDate.
	connectedCallback() {
		try {
		
			this.setMinDate();
		} catch {
			this.handleError(resources.ERROR_FOR_REMINDER_VALUES);
		}
	}
	// Sets the minimum date to 8 days from today when the component is initialized.
	setMinDate() {
		const TODAY = new Date();
		const FUTURE_DATE = new Date(TODAY);
		FUTURE_DATE.setDate(FUTURE_DATE.getDate() + 8);
		this.minDate = FUTURE_DATE.toISOString().slice(0, 10);
	}
	// Prevent manual input
	handleKeyDown(event) {
		event.preventDefault();
	}
	// Ensure the value is only set by the date picker
	handleInput(event) {
		const INPUT = event.target;
		const DATE_VALUE = INPUT.value;
		// Clear the input value if it is not a valid date
		if (isNaN(Date.parse(DATE_VALUE))) {
			INPUT.value = '';
		}
	}
	// To get the values of the check box enabled
	setCheckboxValues(callback) {
		this.value = [];
		this.treatValue = [];
		// Define configuration for checkbox values
		const checkboxConfigs = [
		{ value: 14, disabledProp: 'disableFourteen' },
		{ value: 10, disabledProp: 'disableTen' },
		{ value: 7, disabledProp: 'disableSeven' }
		];
		// Add values to 'value' array based on the configuration
		checkboxConfigs.forEach(config => {
			if (!this[config.disabledProp]) {
				this.value.push(config.value);
			}
		});
		// Add treatment values if they are not null
		[this.treatValueOne, this.treatmentValue].forEach(val => {
			if (val !== null) {
			this.treatValue.push(val);
			}
		});
		// Invoke callback if provided
		if (callback && typeof callback === 'function') {
			callback();
		}
	}
	// To display the Date with the suffix format
	getOrdinalNumber(number) {
		const SUFFIXES = [resources.TH, resources.ST, resources.ND, resources.RD];
		const VNUMBER = number % 100;
		return number + (SUFFIXES[(VNUMBER - 20) % 10] || SUFFIXES[VNUMBER] || SUFFIXES[0]);
	}
	// To close the modal box
	closeButton() {
		this.showBeforeSaveContent = true;
		this.defaultClass = true;
		this.clss = false;
		this.close = false;
		this.closeDot = true;
		this.variable = true;
		this.checkdata = false;
	}
	// To display the short names of the month
	renderedCallback() {
		// Iterate over each class name
		const MONTH_CLASSNAMES = [resources.DEC, resources.NOV, resources.OCT, resources.SEP, resources.AUG, resources.JULY,
			resources.JUNE, resources.MAY, resources.APRIL, resources.MARCH, resources.FEB, resources.JAN];
			MONTH_CLASSNAMES.forEach((className) => {
				// Find all elements with the current class name
				const CLASS_SHORT = className.substr(0, 3)
				const ELEMENTS = this.template.querySelectorAll(`.${CLASS_SHORT}`);
				// Get the last element
				const LAST_ELEMENT = ELEMENTS[ELEMENTS.length - 1];
				// Change its background color to red
				if (LAST_ELEMENT) {
					LAST_ELEMENT.classList.add("red-background");
				}
			}
		);
		const MONTHNAME_CLASSNAMES = [
			resources.DECEMBER,resources.NOVEMBER, resources.OCTOBER, resources.SEPTEMBER,
			resources.AUGUST, resources.JULY_MONTH, resources.JUNE_MONTH, resources.MAY_MONTH,
			resources.APRIL_MONTH,resources.MARCH_MONTH,resources.FEBRUARY,resources.JANUARY
		];
		MONTHNAME_CLASSNAMES.forEach((className) => {
			// Find all elements with the current class name
			const ELEMENTS = this.template.querySelectorAll(`.${className}`);
			// Get the last element
			const MIDDLE_ELEMENT = ELEMENTS[0];
			// Change its background color to red
			if (MIDDLE_ELEMENT) {
				MIDDLE_ELEMENT.textContent = className.substring(0, 3);
			}
		});
		const CIRCLE_BUTTON = ["circlebutton"];
		CIRCLE_BUTTON.forEach((className) => {
			// Find all elements with the current class name
			const ELEMENTS = this.template.querySelectorAll(`.${className}`);
			// Get the last element
			const LAST_ELEMENT = ELEMENTS[ELEMENTS.length - 1];
			// Change its background color to red
			if (LAST_ELEMENT) {
				LAST_ELEMENT.classList.add("treatmentDate");
			}
		});
	}
	mobileclick() {
		this.clss = true;
		this.closeDot = false;
		this.checkdata = true;
		this.variable = false;
	}
	// Handle change event when date is selected
	handleDateChange(event) {
		this.selectedDate = event.target.value;
		// Calculate difference in days between selected date and current date
		const CURRENT_DATE = new Date();
		let selectedDate = new Date(this.selectedDate);
		const DIFFERENCE_DAYS = Math.floor(
			(selectedDate - CURRENT_DATE) / (1000 * 60 * 60 * 24)
		);
		// Update checkbox disable and checked properties based on date difference
		this.disableFourteen = DIFFERENCE_DAYS < 14;
		this.disableTen = DIFFERENCE_DAYS < 10;
		// Set initial values for checkboxes
		this.checkedFourteen = !this.disableFourteen;
		this.checkedTen = !this.disableTen; // Uncheck checkbox 10
		this.checkedSeven = true;
		this.checkedOne = true;
		this.checkedThree = true;
		this.value = [];
		this.treatValue = [];
		// Call handlers directly for checkboxes
		this.handleCheckBoxFourteen({ target: { checked: !this.disableFourteen, value: 14 } });
		this.handleCheckBoxTen({ target: { checked: !this.disableTen, value: 10 } });
		this.handleCheckBoxSeven({ target: { checked: true, value: 7 } });
		this.handleCheckBoxThree({ target: { checked: true, value: 3 } });
		this.handleCheckBoxOne({ target: { checked: true, value: 1 } });
	}
	// Handle checkbox change for 14 days reminder
	handleCheckBoxFourteen(event) {
		// Update valueOne based on checkbox state
		this.valueOne = event.target.checked
			? parseInt(event.target.value, 10)	
			: null;
		// Update value array based on checkbox state
		if (event.target.checked) {
			this.value.push(this.valueOne);
			this.checkedFourteen = true;
		} else {
			let valueToRemove = 14;
			let index = this.value.findIndex((item) => item === valueToRemove);
			this.checkedFourteen = false;
			if (index > -1) {
				this.value.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedFourteen = false;
			}
		}
	}
	// Handle checkbox change for 10 days reminder
	handleCheckBoxTen(event) {
		// Update valueTwo based on checkbox state
		this.valueTwo = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		// Update value array based on checkbox state
		if (event.target.checked) {
			this.value.push(this.valueTwo);
			this.checkedTen = true;
		} else {
			let valueToRemove = 10;
			let index = this.value.findIndex((item) => item === valueToRemove);
			this.checkedTen = false;
			if (index > -1) {
				this.value.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedTen = false;
			}
		}
	}
	// Handle checkbox change for 7 days reminder
	handleCheckBoxSeven(event) {
		// Update valueThree based on checkbox state
		this.valueThree = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		// Update value array based on checkbox state
		if (event.target.checked) {
			this.value.push(this.valueThree);
			this.checkedSeven = true;
		} else {
			let valueToRemove = 7;
			let index = this.value.findIndex((item) => item === valueToRemove);
			this.checkedSeven = false;
			if (index > -1) {
				this.value.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedSeven = false;
			}
		}
	}
	// Handle checkbox change for 3 days reminder
	handleCheckBoxThree(event) {
		// Update treatValueOne based on checkbox state
		this.treatValueOne = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		this.disable3 = this.treatValueOne === null;
		// Update treatValue array based on checkbox state
		if (event.target.checked) {
			this.treatValue.push(this.treatValueOne);
			this.checkedThree = true;
		} else {
			let valueToRemove = 3;
			let index = this.treatValue.findIndex((item) => item === valueToRemove);
			this.checkedThree = false;
			if (index > -1) {
				this.treatValue.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedThree = false;
			}
		}
	}
	// Handle checkbox change for 1 day reminder
	handleCheckBoxOne(event) {
		// Update treatmentValue based on checkbox state
		this.treatmentValue = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		this.disable1 = this.treatmentValue === null;
		// Update treatValue array based on checkbox state
		if (event.target.checked) {
			this.treatValue.push(this.treatmentValue);
			this.checkedOne = true;
		} else {
			let valueToRemove = 1;
			let index = this.treatValue.findIndex((item) => item === valueToRemove);
			this.checkedOne = false;
			if (index > -1) {
				this.treatValue.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedOne = false;
			}
		}
	}
	handleclose() {
		this.showDiv = false;
		this.isSubmitButtonDisabled = false;
	}
	// Handle success after saving reminders    
	handleSuccess() {
		// Check if any required fields are not filled
		this.isSubmitButtonDisabled = true;
		this.allReminderDates = [];
		this.formattedReminderDates = [];
		this.defaultClass = false;
		this.showMessage = this.value.length === 0;
		this.showMessageTwo = this.treatValue.length === 0;	
		window.scrollTo({ top: 0, behavior: 'smooth' });
		this.showDiv = false;
		this.showAddToCalendarBtn = true;
		this.selectedReminders = this.value;
		this.selectedTreatment = this.treatValue;
		// Proceed if all required fields are filled
		const LASTNAME_FIELD = this.template.querySelector(
			'input[data-field="DOB"]'
		);
		
		if (!LASTNAME_FIELD.value) {
			LASTNAME_FIELD.className = "textInput-err";
			this.template.querySelector('p[data-field="DOB"]').className =
				"input-error-label";
		} else {
			LASTNAME_FIELD.className = "textInput";
			this.template.querySelector('p[data-field="DOB"]').className =
				"input-label";
		}
		if (!this.showMessage &&
			!this.showMessageTwo &&
			this.selectedDate &&
			this.selectedReminders.length > 0
		) {
			let allReminderDates = [];
			// Iterate over selectedReminders and selectedTreatment arrays
			[14, 10, 7, 3, 1].forEach((days, index) => {
				const SELECTED_DATE_TIME = new Date(this.selectedDate).getTime();
				const REMINDER_DATE_TIME = SELECTED_DATE_TIME - days * 24 * 60 * 60 * 1000;
				const REMINDER_DATE = new Date(REMINDER_DATE_TIME);
				// Format reminder date
				let formattedDate = this.formatDate(REMINDER_DATE);
				let formattedDatemonth = formattedDate.split(" ")[0] + 1;
				let month = formattedDate.split(" ")[0]
				formattedDate = this.getOrdinalNumber(formattedDate.split(" ")[1])
				// Push formatted reminder date into allReminderDates array
				allReminderDates.push({
					id: index,
					days: days,
					formattedDate,
					formattedDatemonth,
					month
				});
			}
			);
			// Add next three days' reminders to allReminderDates
			for (let i = 1; i <= 3; i++) {
				const SELECTED_DATE_TIME = new Date(this.selectedDate).getTime();
				const NEXT_DATE = new Date(SELECTED_DATE_TIME + i * 24 * 60 * 60 * 1000);
				// Format next date
				let formattedDate = this.formatDate(NEXT_DATE);
				allReminderDates.push({
					id: `nextThreeDays-${i}`,
					formattedDate
				});
			}
			// Add selectedDate reminder to allReminderDates
			const SELECTED_DATE_FORMATTED = this.formatDate(
				new Date(this.selectedDate)
			);
			let formattedDatemonth = SELECTED_DATE_FORMATTED.split(" ")[0] + 1;
			let month = SELECTED_DATE_FORMATTED.split(" ")[0];
			allReminderDates.push({
				id: "selectedDate",
				days: 0,
				formattedDate: this.getOrdinalNumber(SELECTED_DATE_FORMATTED.split(" ")[1]),
				formattedDatemonth,
				month
			});
			// Sort allReminderDates by date
			allReminderDates.sort((a, b) => {
				const DATE_A = new Date(a.formattedDate);
				const DATE_B = new Date(b.formattedDate);
				return DATE_A.getTime() - DATE_B.getTime();
			});
			// Update formattedReminderDates with filtered reminder dates
			this.formattedReminderDates = allReminderDates.filter(
				(date) => date.days !== undefined
			);
			this.saveTaskRecords();
			this.checkedFourteen = this.value.includes(14);
			this.checkedTen = this.value.includes(10);
			this.checkedSeven = this.value.includes(7);
			this.checkedThree = this.treatValue.includes(3);
			this.checkedOne = this.treatValue.includes(1);
			this.showAfterSaveContent = false;
			this.showBeforeSaveContent = false;
			this.closeDot = false;
			this.close = true;
			this.defaultClass = false;
		}
	}
	fetchOutlookCalendarURL(dateSelected) {
		OUTLOOK_URL({ eventDate: dateSelected })
			.then((data) => {
				if (data) {
					this.outlookCalendarUrls = data;
					this.isPartVisible = true;
					document.body.style.overflow = 'hidden';
				}
			})
			.catch((error) => {
				this.handleError(error.body.message);
			});
	}
	
	fetchGoogleCalendarURL(dateSelected) {
		GOOGLE_URL({ eventDate: dateSelected })
			.then((data) => {
				if (data) {
					this.googleCalendarUrls = data;
					this.isPartVisible = true;
					document.body.style.overflow = 'hidden';
				}
			})
			.catch((error) => {
				this.handleError(error.body.message);
			});
	}
	// Function to format date
	formatDate(date) {
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'short' });
		return `${month} ${day}`;
	}
	// Save task records to Salesforce
	saveTaskRecords() {
		let selectedDate = this.selectedDate;
		const SELECTED_REMINDERS_FILTERED = this.selectedReminders.filter(days => days === 14 && !this.disableFourteen ||
			days === 10 && !this.disableTen ||
			days === 7 && !this.disableSeven);
		const SELECTED_TREATMENT_FILTERED = this.selectedTreatment.filter(days => days === 3 && !this.disable3 ||
			days === 1 && !this.disable1);

		// Call Apex method to save reminder records
		REMINDER_DATES({
			selectedDate,
			selectedReminders: SELECTED_REMINDERS_FILTERED,
			selectedTreatment: SELECTED_TREATMENT_FILTERED
		})
			// Null data is checked and AuraHandledException is thrown from the Apex
			.then(() => {
				this.showDiv = true;
				this.showAfterSaveContent = false;
			})
			.catch((error) => {
				this.handleError(error.body.message);
			})
	}
	// Handler for clicking the 'Add to Calendar' button
	handleAddCalendarButtonClick() {
		// Set the visibility of the calendar modal to true
		this.fetchGoogleCalendarURL(this.selectedDate);
		this.fetchOutlookCalendarURL(this.selectedDate);
	}
	// Handler to close the calendar modal
	closeModal() {
		this.isPartVisible = false;
		document.body.style.overflow = '';
	}
	// Open Google Calendar for adding reminders
	openGoogleCalendar() {
		// Check if Google Calendar URLs are available
		if (this.googleCalendarUrls && this.googleCalendarUrls.length > 0) {
			// Open each Google Calendar URL in a new tab
			for (let i = 0; i < this.googleCalendarUrls.length; i++) {
				window.open(this.googleCalendarUrls[i], "_blank");
			}
		}
	}
	// Open Outlook Calendar for adding reminders
	openOutlookCalendar() {
		// Check if Outlook Calendar URLs are available
		if (this.outlookCalendarUrls && this.outlookCalendarUrls.length > 0) {
			// Open each Outlook Calendar URL in a new tab
			for (let i = 0; i < this.outlookCalendarUrls.length; i++) {
				window.open(this.outlookCalendarUrls[i], "_blank");
			}
		}
	}
	handleError(error){
		let globalThis=window;
		globalThis.location.href = resources.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
}