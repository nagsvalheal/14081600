//This components using user body parts and intencity itchiness values store this lwc
// To import Libraries
import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import { refreshApex } from '@salesforce/apex';
import GET_LATEST_SYMPTOM_RECORD from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
import DELETE_SYMPTOM_TRACKER_RECORDS from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.deleteSymptomTrackerRecords'
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import GET_SYMPTOM_RECORD_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getSymptomRecordData';
import GET_CASE_IMAGE_URL from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getBase64Image';
import GET_ENROLLEE from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import GET_SELECTED_PATIENT from '@salesforce/apex/BI_PSP_CurrentUser.returnTheAccounts';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class BiPspbPrimaryPageSymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@api variable declaration

	@api symptomrecord;
	@api isedit;
	@api recordId;
	@api showeditbtn;
	@api noTriggers;
	@api noPhoto;
	@api nodisplay;
	nodisplayrecordstrigger
	noPhotorecords
	monthName;
	monthValue;
	currentYear;
	selectedMonthValue;

	// The Account Id you want to pass to the Apex method
	//@track variable declaration
	symptomData;
	moodReaction = ''
	symptomGpp;
	valueSymptom;
	isEditOne;
	imageUrls = [];
	symptomRecordData;
	deleteButton = false;
	lastEdit = false;
	edit = false;
	//Variable declaration
	allergyIntoleranceData;
	latestRecord;
	showSpinner = false ;
	accountId;
	itchnessImg = label.ITCHINESS;
	rednessImg = label.REDNESS;
	painImg = label.PAIN;
	pustulesImg = label.PUSTULES;
	fatigueImg = label.FATIGUE;
	temperatureImg = label.TEMPERATURE;
	happyImg = label.HAPPY;
	vectorImg = label.VECTOR;
	userId = label.ID;
	calenderImg = label.CALENDER;
	sadImage = label.REPLACE_SAD;
	speechless = label.REPLACE_SPEECHLESS;
	worried = label.REPLACE_WORRIED;
	happy = label.REPLACE_HAPPY;
	joyfull = label.REPLACE_JOYFUL;
	showeditbtnShow;
	currentDate
	errorAllergyData = label.ERROR_ALLERGY_DATA;
	dateLabel = label.DATE_LABEL;
	gppSymptomLabel = label.GPP_SYMPTOM;
	symptomsLabel = label.SYMPTOMS_LABEL;
	triggersLabel = label.TRIGGER_LABEL;
	noRecordsToDisplay = label.NO_RECORDS_DISPLAY;
	photoLabel = label.PHOTOS_LABEL;
	mistakeModifyOrDelete = label.MISTAKE_MODIFY;
	editLabel = label.EDIT_LABEL;
	deleteLabel = label.DELETE_LABEL;
	editLastEntry = label.EDIT_LAST_ENTRY;
	sureEditEntry = label.SURE_EDIT_ENTRY;
	sureDeleteEntry = label.SURE_DELETE_ENTRY;
	confirmSubmission = label.CONFIRM_SUBMISSION;
	confirmAndSave = label.CONFIRM_SAVE;
	unableToEdit = label.UNABLE_TO_EDIT;
	onlyLastEntryEdited = label.ONLY_LAST_ENTRY_EDIT;
	okLabel = label.OK_LABEL;
	yesLabel = label.YES;
	noLabel = label.NO;
	alternateTextWorried = label.ALTERNATE_TEXT_WORRIED;
    alternateTextSad = label.ALTERNATE_TEXT_SAD;
    alternateTextSpeechless = label.ALTERNATE_TEXT_SPEECHLESS;
    alternateTextJoyful = label.ALTERNATE_TEXT_JOYFUL;
    alternateTextHappy = label.ALTERNATE_TEXT_HAPPY;
	alternateTextCalender = label.ALTERNATE_TEXT_EMPTY_CALENDER;
	alternateTextVector = label.ALTERNATE_TEXT_EMPTY_VECTOR;
	alternateTextUpload = label.ALTERNATE_TEXT_EMPTY_UPLOAD;
	alternateTextItchiness =label.ALTERNATE_TEXT_EMPTY_ITCHINESS;
	alternateTextRedness = label.ALTERNATE_TEXT_EMPTY_REDNESS;
	alternateTextPain = label.ALTERNATE_TEXT_EMPTY_PAIN;
	alternateTextPustules = label.ALTERNATE_TEXT_EMPTY_PUSTULES;
	alternateTextFatigue = label.ALTERNATE_TEXT_EMPTY_FATIGUE;
	alternateTextTemperature = label.ALTERNATE_TEXT_EMPTY_TEMPERATURE;

	navLogo = label.SITE_LOGO;
	errorMessage;
	userName;
	patientName = label.PATIENT_NAME;
	periodLabel = label.PERIOD_LABEL;
	// Process retrieved allergy intolerance data, updating UI and properties, particularly for fatigue symptoms detection.
	@wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$symptomrecord' })
	wiredAllergyIntoleranceData({ error, data }) {
		if (data && data !== null) {
			try {

				this.allergyIntoleranceData = data.map(obj =>
					({
						...obj,
						itchness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.ITCHINESS_VALUES,
						redness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.REDNESS_VALUE,
						pain: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.PAIN_VALUES,
						fatigue: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.FATIGUE_VALUES,
						pustules: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.PUSTULES_VALUE,
						temperature: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.TEMPERATURE_VALUES,
						moods: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.MOOD_VALUES,
						sadImage: obj?.BI_PSP_Mood__c === label.SAD_MOOD,
						speechless: obj?.BI_PSP_Mood__c === label.SPEECHLESS_MOOD,
						worried: obj?.BI_PSP_Mood__c === label.WORRIED_MOOD,
						joyfull: obj?.BI_PSP_Mood__c === label.JOYFULL_MOOD,
						happy: obj?.BI_PSP_Mood__c === label.HAPPY_MOOD
					}));

				// }
			} catch (err) {
				this.handleError(error.body.message);
			}
		} else if (error) {
			this.handleError(error.body.message);
		}
	}
	@wire(GET_SYMPTOM_RECORD_DATA, { symptomTrackerId: '$symptomrecord' })
	wiredgetsymptomrecorddata({ error, data }) {
		if (data && data !== null) {
			try {
				// Split values using semicolon as the delimiter
				const dateStr = data[0].BI_PSP_EditEntrydates__c;
				let dateObj = new Date(dateStr);

// Formatting the date to 'MM/DD/YYYY'
let formattedDate = (dateObj.getMonth() + 1).toString().padStart(2, '0') + '/' +
                    dateObj.getDate().toString().padStart(2, '0') + '/' +
                    dateObj.getFullYear();

// Assigning the formatted date
this.symptomData = formattedDate;
				this.symptomGpp = data[0].BI_PSP_Are_you_currently_experiencing__c;
				if (this.symptomGpp === true) {
					this.valueSymptom = label.YES;
				} else if (this.symptomGpp === false) {
					this.valueSymptom = label.NO;
				}
				this.symptomRecordData = data[0].BI_PSP_Recent_Activities__c
					?.split(';')
					.map(item => item.trim())
					.filter(item => item !== '');

					if(this.symptomRecordData.length > 0){
						if (this.noTriggers === false) {
				this.nodisplayrecordstrigger = false;
			}
			else {
				this.nodisplayrecordstrigger = true;
			}
					}
			} catch (err) {
				this.handleError(error.body.message);
			}
		} else if (error) {
			this.handleError(error.body.message);
		}
	}
	//To fetch the latest symptom recordId
	@wire(GET_LATEST_SYMPTOM_RECORD, { careProgramEnrolleeId: '$accountId' })
	wiredLatestRecord({ error, data }) {
		if (data && data !== null) {
			try {
				this.latestRecord = data[0];
				this.errorMessage = ''; // Clear any previous error
			} catch (err) {
				this.latestRecord = null;
				this.handleError(error.body.message);
			}
		} else if (error) {
			this.latestRecord = null;
			this.handleError(error.body.message);
		}
	}
	// Used to fetch image URL
@wire(GET_CASE_IMAGE_URL, { symptomTrackerId: '$symptomrecord' })
caseImageURL;

get hasImage() {
    this.imageUrls = [];
    
    try {
        if (this.caseImageURL && this.caseImageURL.data) {
            let splitArray = this.caseImageURL.data.map((obj) => {
                if (obj) {
                   
                    return obj.split('data:')[1]; // Split and log the result
                }
                return ''; // Return an empty string if obj is null or undefined
            });

            splitArray.forEach(record => {
                if (record) {
                    this.imageUrls = [...this.imageUrls, 'data:' + record];
                }
            });
        }
    } catch (error) {
        // Handle the error here
        this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
    }

    return this.imageUrls.length > 0;
}

	symptomidgetid
	//It initializes component tasks, including edit button visibility, user data retrieval, URL parsing, setting URLs

	connectedCallback() {
		let globalThis = window;
		try {
			if (this.showeditbtn === false) {
				this.showeditbtnShow = false;
				this.nodisplay=false;
			}
			else {
				this.showeditbtnShow = true;
				this.nodisplay=true;
			}
				const DATE = new Date();
				const MONTH_NAMES = [label.JANUARY, label.FEBRUARY, label.MARCH, label.APRIL, label.MAY, label.JUNE, label.JULY, label.AUGUST, label.SEPTEMBER, label.OCTOBER, label.NOVEMBER, label.DECEMBER];
			this.monthName = MONTH_NAMES[DATE.getMonth()];
			let month = this.monthName?.substr(0, 3);
			this.monthValue = month;
			const CURRENT_DATE = new Date();
			this.currentYear = CURRENT_DATE.getFullYear();

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
			

			GET_ENROLLEE()
                // Null data is checked and AuraHandledException is thrown from the Apex
                .then((result) => {
                        if (result &&  result[0].Id !== null) {
                            this.accountId = result[0].Id;
                        } 
                })
                .catch((error) => {
                    // Handle any errors occurring during the promise chain
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                });


				


			const currentURL = globalThis.location?.href;
			// Create a URL object
			const urlObject = new URL(currentURL);
			// Get the path
			const path = urlObject.pathname;
			// Split the path using '/' as a separator
			const pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find(component =>
				[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
				this.urlq = label.BRANDED_URL_NAVIGATION;
			}
			else {
				this.urlq = label.UNASSIGNED_URL_NAVIGATION;
			}
			this.symptomidgetid = this.symptomrecord;
			this.currentDate = new Date().toISOString().slice(0, 10);
			if (this.isedit === true) {
				this.isEditOne = false;
			} else {
				this.isEditOne = true;
			}
		}
		catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	// Manually refresh the wire adapter
	refreshWireAdapter() {
		return refreshApex(this.wiredAllergyIntoleranceData);
	}
	//function asynchronously reads a Blob object as a data URL and returns a Promise resolving with the data URL.
	// Function asynchronously reads a Blob object as a data URL and returns a Promise resolving with the data URL.
readAsDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const result = event.target.result;

            if (typeof result === 'string') {
                // Directly resolve if the result is already a string
                resolve(result);
            } else {
                // Convert ArrayBuffer to string if necessary
                const base64String = btoa(
                    new Uint8Array(result).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                resolve(`data:image/${blob.type.split('/')[1]};base64,${base64String}`);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        // Read the Blob as a Data URL
        reader.readAsDataURL(blob);
    });
}

	//To delete the entry or modify data
	handleDeleteClick() {
		this.opendeletbtn();
	}
	//This function deletes symptom tracker records and it disables a delete button.
	lastrecorddelete() {
		this.showSpinner = true;
		let globalThis = window;
		DELETE_SYMPTOM_TRACKER_RECORDS({ symptomTrackerId: this.symptomrecord })
		globalThis.location.reload()

			.then(result => {
				if (result) {
					this.showSpinner = false;
					globalThis.location.reload();
				}
			})
			.catch(error => {
				// Handle error
				this.showSpinner = false;
				this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
			});
		this.deleteButton = false;
	}
	// Open delete button and prevent scrolling on the body.
	opendeletbtn() {
		// Add your specific logic for opening the mood modal
		this.deleteButton = true;
		document.body.style.overflow = 'hidden';
		this.submitModal = false;
	}
	// Close delete button, restore scrolling, and perform last record deletion.
	handleDeleteBtn() {
		// Add your specific logic for closing the mood modal
		this.deleteButton = false;
		document.body.style.overflow = ''; // Reset to default
		this.lastrecorddelete();
	}
	// Close delete button and restore scrolling to default.
	closedeletbtnadd() {
		// Add your specific logic for closing the mood modal
		this.deleteButton = false;
		document.body.style.overflow = '';

		// Reset to default   
	}
	//This function opens the mood modal and disables scrolling on the page
	openlastedit() {
		// Add your specific logic for opening the mood modal      
		this.lastEdit = true;
		document.body.style.overflow = 'hidden';
	}
	// Add your specific logic for closing the mood modal
	closelastedit() {
		this.lastEdit = false;
		document.body.style.overflow = ''; // Reset to default
	}
	//Compares the latest record with the current symptom record
	navigateToSymptom() {
		if (this.latestRecord !== this.symptomrecord) {
			this.openlastedit()
		} else if (this.latestRecord === this.symptomrecord) {
			// Redirect to a new page and set item in localStorage
			this.openedit();
		}
	}
	// Add your specific logic for opening the mood modal
	openedit() {
		this.edit = true;
		document.body.style.overflow = 'hidden';
	}
	// Add your specific logic for closing the mood modal
	closeEdit() {
		this.edit = false;
		this.lastEdit =false;
		this.deleteButton = false;
		document.body.style.overflow = ''; // Reset to default
	}
	lastedtirdate() {
		let globalThis = window;
		if (this.latestRecord !== this.symptomrecord) {
			this.openlastedit();
			this.lastEdit = false;
			document.body.style.overflow = '';
		} else if (this.latestRecord === this.symptomrecord) {
			// Redirect to a new page and set item in localStorage
			globalThis.location?.assign(label.SYMPTOM_MAIN_PAGE_URL);
			// Store data labeled as 'symptomlastid' in the session storage without altering custom labels.
			globalThis.localStorage.setItem('symptomlastid', this.symptomrecord);
		}
	}

		handleError(error) {
		let globalThis = window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
	// showToast used for all the error messages caught
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