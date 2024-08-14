// This component is consolidate component used to update hcp patient information enrollment form main page.
// To import Libraries
import { LightningElement, wire} from 'lwc';
//  To import Apex Classes
import LEAD_GET from '@salesforce/apex/BI_PSPB_ThankyouPageUtilites.getExistingLeads';
import CAREGIVER_GET from '@salesforce/apex/BI_PSPB_ThankyouPageUtilites.getLeadCaregiver';
import PHYSICIAN_GET from '@salesforce/apex/BI_PSPB_EnrollmentUtilities.getHcpDetails';
import COTHANKS_GET from '@salesforce/apex/BI_PSPB_ThankyouPageUtilites.checkCaregiverData';

import { resource } from "c/biPspbEnrollmentFormResource";


export default class BiPspbPrepopulateSummaryPage extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with  
	verifyTheInfo = resource.VERIFY_THE_INFO;
	verifyYourInfo = resource.VERIFY_YOUR_INFO;
	addressColan = resource.ADRRESS_COLAN;
	enrollHead = resource.ENROLL_SUMMARY;
	nameColan = resource.NAME_COLAN;
	dobColan = resource.DOB_COLAN;
	emailColan = resource.EMAIL_COLAN;
	phoneColan = resource.PHONE_COLAN;
	prescriptionInfo = resource.PRESCRIPTION_INFO;
	patientinfo = resource.PATIENT_INFO ;
	physicianInfo = resource.PHYSICIAN_INFO ;
	relationColan = resource.RELATION_COLAN;
	caregiverInfo = resource.CAREGIVER_INFO;
	age = true;
	head = true;
	recordDetails;
	caregiver;
	cargivers;
	result;
	recordId;
	count;
	email;
	messageContent;
	messageContentTwo;
	contData;
	valueAvatar = false;
	careEmail;
	// Declaration of Global variables
	beyandGpp = resource.BGPP;
	mailImg = resource.IMG;

	//to get Lead's Physician record
	renderedCallback() {
		try {
			// Retrieve the recordId from localStorage
			this.recordId = localStorage.getItem('recordId');

			PHYSICIAN_GET({ leadId: this.recordId })
				.then((result) => {

					// Assuming result is an array of physician records
					// Assigning the result to a trackable property for further usage
					this.physicianData = result;

				})
				.catch((error) => {
					let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
				});
		} catch (error) {
			let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
		}
	}

	//to get lead records using recordId
	@wire(LEAD_GET, { createLeadId: '$recordId' })
	wiredRecordDetailsLead({ error, data }) {
		
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.recordDetails = data;
				this.email = data[0].Email;
			} else if (error) {
				let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			}
		
	}

	//to get caregiver records using recordId
	@wire(CAREGIVER_GET, { caregiverCreateId: '$recordId' })
	wiredRecordDetailsCaregiver({ error, data }) {
		// Null data is checked and AuraHandledException is thrown from the Apex
		try{
			if (data && data.length > 0) {
			
				this.caregiver = data;
				this.age = true;
				this.head = true;
				this.careEmail = data[0].BI_PSPB_E_mail_ID__c;
				this.valueAvatar = true;
				if (this.careEmail) {
					this.callcothanks();
				}

				this.dispatchEvent(
					new CustomEvent(resource.SEND_AVATAR_MSG, { detail: this.valueAvatar })
				);
		} else if (error && data.length > 0) {
			let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
		}
	}
	catch (err) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', err.body.message);
		globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
	}
		
	}


	//to get physician records using recordId
	@wire(PHYSICIAN_GET, { leadId: '$recordId' })
	wiredRecordDetailsCaregivers({ error, data }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.caregivers = data;
				this.age = false;
				this.head = false;
				if (this.age === false) {
					this.messageContent = resource.THANKYOU_MSG_THREE;
					this.messageContentTwo = resource.THANKYOU_MSG_FOUR + ' ' + data[0].Email;
				}
			} else if (error) {
				let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			}
		} catch (err) {
			let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', err.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
		}
	}
	callcothanks() {
		COTHANKS_GET({ caregiverCreateId: this.recordId })
			.then(result => {

				this.contData = result;
				this.age = true;
				this.head = true;
				if (this.contData === true) {
					this.messageContent =
					resource.THANKYOU_MSG_ONE + ' ' + this.careEmail;
					this.messageContentTwo = resource.THANKYOU_MSG_TWO;
				} else {
					this.messageContent = resource.THANKYOU_MSG_THREE;
					this.messageContentTwo = resource.THANKYOU_MSG_FOUR + ' ' + this.careEmail;
				}
			})
			.catch(err => {
				let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', err.body.message);
            globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			})
	}

}