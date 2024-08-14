/*A Lightning Web Component displaying treatment timeline reminders for users
with dynamic date calculations and navigation features.*/
// To import Libraries
import { LightningElement, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {resources} from 'c/biPspbNotificationReminderResources';
import TASKS_DATE_OF_TREATMENT from '@salesforce/apex/BI_PSPB_TreatmentWidgetCtrl.getTasksWithDateOfTreatment';

export default class BiPspbReminderWidget extends NavigationMixin(LightningElement)
{
	// Variable declaration
	timelineData = [];
	reminderDates = [];
	isDataAvailable = true;
	userId = resources.ID;
	cpeId;
	showAlarm=true;
	lastDateTreatment;
	showTooltip = false;
	check;
	toolTip = resources.TOOL_TIP;
	remainCheck;
	today;
	days = resources.DAYS;
	upcomingDays = resources.UPCOMING_DAYS;
	addDate = resources.ADD_DATE;
	reminders = resources.REMINDERS;
	noReminders = resources.NO_REMINDER;
	alternateForAlarm = resources.ALTERNATE_ALARM;
	additionalDates = [];
	datehighlights;
	reminderDateSet;
	daysDifferenceSet;
	imgAlarm = resources.ALARM;
	//It determines if there's any treatment data available and if the first treatment date has already passed.
	get isAvailable() {
		if (this.timelineData.length > 0) {
			this.showAlarm=false;
			const TREATMENT_DATE = new Date(this.timelineData[0]?.BI_PSPB_Date_of_Treatment__c);
			const CURRENT_DATE = new Date();
			return !TREATMENT_DATE || TREATMENT_DATE < CURRENT_DATE;
		}
		return false;
	}
	// To get the date of treatment of the careprogram enrollee and calculates the day difference.
	@wire(TASKS_DATE_OF_TREATMENT)
	wiredTaskDates({ data,error }) {
			if (data) {
				this.isDataAvailable = false;
				
				const TREATMENT_DATE = new Date(data[0].BI_PSPB_Date_of_Treatment__c);
                const DAYS_DIFFERENCE = this.calculateDaysDifference(TREATMENT_DATE);
                this.daysDifferenceSet = DAYS_DIFFERENCE;
                this.determineCardTitleAndReminders(DAYS_DIFFERENCE, TREATMENT_DATE);
                this.mapTimelineData(data);
			} else if (error) {
				this.handleError(error.body.message);
			}
	}
	// Difference between days are calculated.
    calculateDaysDifference(treatmentDate) {
        const CURRENT_DATE = new Date();
        const TIME_DIFFERENCE = treatmentDate.getTime() - CURRENT_DATE.getTime();
        return Math.ceil(TIME_DIFFERENCE / (1000 * 3600 * 24));
    }
	/* Used to determine the appropriate reminder message and reminder dates
	based on the number of days left until the treatment date.*/
    determineCardTitleAndReminders(daysDifference, treatmentDate) {
		const reminders = [
			{ days: 14, title: resources.PRESCRIPTION_REMINDER_ONE },
			{ days: 10, title: resources.PRESCRIPTION_REMINDER_TWO },
			{ days: 7, title: resources.PRESCRIPTION_REMINDER_THREE },
			{ days: 3, title: resources.TREATMENT_REMINDER_ONE },
			{ days: 1, title: resources.TREATMENT_REMINDER_TWO }	
		];
		const REMINDER = reminders.find(REMINDERS => daysDifference > REMINDERS.days);
		if (REMINDER) {
			this.isDataAvailable = true;
			this.cardTitle = REMINDER.title;
			this.reminderDates.push(this.getReminderDate(treatmentDate, REMINDER.days));
			this.isDataAvailable = true;
		} else {
			this.cardTitle = resources.NO_UPCOMING_REMAINDERS;
			this.reminderDates.push(this.getReminderDate(treatmentDate));
			this.isDataAvailable = false;

		}
	}
	//It processes each reminder and calculates various properties related to the treatment timeline.
    mapTimelineData(result) {
        this.timelineData = result.map(reminder => {
            const DAYS_LEFT = this.calculateDaysLeft(reminder.BI_PSPB_Reminder_Date__c);
            const ADDITIONAL_DATES = this.calculateAdditionalDates(reminder.BI_PSPB_Date_of_Treatment__c);
            const CSS_CLASS = this.getCssClass(DAYS_LEFT);
            return {
                Id: reminder.Id,
                Subject: reminder.BI_PSPB_Subject__c,
                Date_of_Treatment__c: reminder.BI_PSPB_Date_of_Treatment__c,
                DayOfWeek: this.getDayOfWeek(reminder.BI_PSPB_Date_of_Treatment__c),
                DaysLeft: DAYS_LEFT,
                AdditionalDates: ADDITIONAL_DATES.map(date => ({
                    ...date,
                    CSS_CLASS: CSS_CLASS,
                })),
            };
        });
    }
	// To call style class according to the data.
	getCssClass(daysLeft) {
		if (daysLeft === 4) {
			return 'green';
		} else if (daysLeft === 7) {
			return 'yellow';
		}
		return 'red';
	}
	//It is used to display the days of treatment when we hover the circle button.
	handleMouseOver(event) {
		this.check = event.currentTarget.dataset.datavalues;
		const DATE1 = new Date(this.check);
		const DATE2 = new Date(this.timelineData[0]?.Date_of_Treatment__c);
		const diffTime = Math.abs(DATE2 - DATE1);
		this.remainCheck = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		this.tooltipText = this.getTooltipText(this.remainCheck);
		this.showTooltip = true;
	}
	// On hovering, the text is displayed.
	getTooltipText(remainCheck) {
        switch (true) {
            case (remainCheck > 1 && remainCheck !== 3):
                return resources.TOOL_TIP.replace('{0}', remainCheck);
            case (remainCheck < -1):
                return resources.TOOL_TIP.replace('{0}', Math.abs(remainCheck));
            case (remainCheck === 3):
                return resources.THREE_DAYS_TOOL_TIP;
            case (remainCheck === 1):
                return resources.ONE_DAY_TOOL_TIP;
            default:
                return resources.TREATMENT_DATE_TOOL_TIP;
        }
    }
	// When not hovering,making it false.
	handleMouseOut() {
		this.showTooltip = false;
	}
	// Used to add a specified number of days to a given date.
	addDays(date, days) {
		let result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	// On rendering, calling these methods.
	renderedCallback() {

		this.updateCSSClasses();
		this.applySpecialStyling();
		
	}
	// Update CSS classes for the elements based on predefined class names
	updateCSSClasses() {
		const CLASSNAMES = [
			resources.DEC, resources.NOV, resources.OCT, resources.SEP, resources.AUG, resources.JULY,
			resources.JUNE, resources.MAY, resources.APRIL, resources.MARCH, resources.FEB, resources.JAN
		];
		this.updateClassNames(CLASSNAMES, 'red-background');
		const MONTH_CLASSNAMES = [
			resources.DECEMBER, resources.NOVEMBER, resources.OCTOBER, resources.SEPTEMBER,
			resources.AUGUST, resources.JULY_MONTH, resources.JUNE_MONTH, resources.MAY_MONTH,
			resources.APRIL_MONTH, resources.MARCH_MONTH, resources.FEBRUARY, resources.JANUARY
		];
		this.updateMonthClassNames(MONTH_CLASSNAMES);
		this.updateClassNames(['circlebutton'], 'treatmentDate');
	}
	// Adds a specified CSS class to the last element of each class name provided in the classNames array.
	updateClassNames(classNames, classNameToAdd) {
		classNames.forEach(className => {
			const ELEMENTS = this.template.querySelectorAll('.' + className);
			const LAST_ELEMENT = ELEMENTS[ELEMENTS.length - 1];
			if (LAST_ELEMENT) {
				LAST_ELEMENT.classList.add(classNameToAdd);
			}
		});
	}
	/*updates the text content of the first element of each class name provided in the
	monthClassNames array to the three-letter abbreviation of the class name.*/
	updateMonthClassNames(monthClassNames) {
		monthClassNames.forEach(className => {
			const ELEMENTS = this.template.querySelectorAll('.' + className);
			const MIDDLE_ELEMENT = ELEMENTS[0];
			if (MIDDLE_ELEMENT) {
				MIDDLE_ELEMENT.textContent = className.substring(0, 3);
			}
		});
	}
	/* Applies special styling to elements if the current date plus a specified
	number of days matches a predefined reminder date.*/
	applySpecialStyling() {
		const TODAY = new Date();
		const NEW_DATE = this.addDays(TODAY, this.datehighlights);
		const FORMATTED_DATE = this.formatDate(new Date(NEW_DATE));
		if (FORMATTED_DATE === this.reminderDateSet) {
			this.applyCircleStyling();
		}
	}
	/* Adds the circle1 CSS class to specific circle elements, targeting the last
	six elements with the class circlebutton.*/
	applyCircleStyling() {
		const CIRCLES = this.template.querySelectorAll('.circlebutton');
		const INDICES_TO_STYLES = [-6, -5, -4, -3, -2, -1];
		INDICES_TO_STYLES.forEach(index => {
			const element = CIRCLES[CIRCLES.length + index];
			if (element) {
				element.classList.add('circle1');
			}
		});
	}
	// Formats a given date as a string in the YYYY-MM-DD format.
	formatDate(date) {
		const YEAR = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		return `${YEAR}-${month}-${day}`;
	}
	// Navigates to reminder page.
	handleReminder() {
		let globalThis = window;
		globalThis.location?.assign(resources.BRANDED_URL + resources.REMINDER_PAGE_URL);
	}
	// To display the Date with the suffix format
	getOrdinalNumber(number) {
		const SUFFIXES = [resources.TH, resources.ST, resources.ND, resources.RD];
		const PERCENT = number % 100;
		return number + (SUFFIXES[(PERCENT - 20) % 10] || SUFFIXES[PERCENT] || SUFFIXES[0]);
	}
	// To calculate the days left
	getReminderDate(treatmentDate, daysBefore) {
		const DATE = new Date(treatmentDate);
		DATE.setDate(treatmentDate.getDate() - daysBefore);
		const OPTIONS = { month: 'short', day: 'numeric', weekday: 'short' };
		return DATE.toLocaleDateString(resources.LABEL_US, OPTIONS);
	}
	// To get the day of week
	getDayOfWeek(date) {
		return new Date(date).toLocaleDateString(resources.LABEL_US, { weekday: 'long' });
	}
	// Method to calculate days left until the earliest date
	calculateDaysLeft(earliestDate) {
		const CURRENT_DATE = new Date();
		const TREATMENT_DATE_TIME = new Date(earliestDate); // Get treatment date
		TREATMENT_DATE_TIME.setHours(0, 0, 0, 0);
		CURRENT_DATE.setHours(0, 0, 0, 0);
		const TIME_DIFF = TREATMENT_DATE_TIME.getTime() - CURRENT_DATE.getTime();
		const DAYS_LEFT = Math.ceil(TIME_DIFF / (1000 * 3600 * 24));
		return DAYS_LEFT;
	}
	// Method to calculate additional reminder dates based on treatment date
	calculateAdditionalDates(treatmentDate) {
		const DAYS_BEFORE = [14, 10, 7, 3, 1, 0];
		const TREATMENT_DATE_TIME = new Date(treatmentDate);
		if (isNaN(TREATMENT_DATE_TIME)) {
			return this.additionalDates;
		}
		DAYS_BEFORE.forEach(days => {
			const DATE = new Date(TREATMENT_DATE_TIME);
			DATE.setDate(TREATMENT_DATE_TIME.getDate() - days);
			const MONTH = DATE.toLocaleDateString('en-US', { month: 'short' });
			const DAY = DATE.getDate();
			const ORDINAL_DAY = this.getOrdinalNumber(DAY);
			const FORMATTED_DATE = `${ORDINAL_DAY}`;
			this.additionalDates.push({ date: FORMATTED_DATE, month: MONTH, monthname: MONTH + 1, dateandmonth: DATE });
		});
		return this.additionalDates;
	}
	handleError(error){
		let globalThis=window;
		globalThis.location.href = resources.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
}