//This component is to Select avatar in account manager.
//To import the libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import the Apex class
import CURRENT_USER from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import LOGGED_USER from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import AVATAR from '@salesforce/apex/BI_PSPB_EnrolleeAvatarCtrl.updateEnrolleeAvatar';

//To import the custom labels
import {label} from 'c/biPspbAvatarResources';
export default class BiPspbAvatarSelection extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with @track
		caregiver = false;
		avatarImg;
		avatarImage;
		loggedPatient;
		selected = label.SELECTED;
		chooseAvatar = label.CHOOSE_AVATAR;
		errorPage = label.ERROR_PAGE;
		siteUrlBranded = label.BRANDEDSITE_URL;
		displayNavErrorPage = label.DISPLAY_NAV_ERRORPAGE;
		

	@track imageClass = [

		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_AFRO_MAN, dataid: 1 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_AFRO_WOMAN, dataid: 2 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_ARAB_MAN, dataid: 3 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_ARAB_WOMAN, dataid: 4 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_ASIAN_MAN, dataid: 5 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_ASIAN_WOMAN, dataid: 6 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_CAUCASIAN_MAN, dataid: 7 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_CAUCASIAN_WOMAN, dataid: 8 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_INDIAN_MAN, dataid: 9 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_INDIAN_WOMAN, dataid: 10 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_LATINO_MAN, dataid: 11 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ADULT_LATINO_WOMAN, dataid: 12 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_AFRO_MAN, dataid: 13 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_AFRO_WOMAN, dataid: 14 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_ARAB_MAN, dataid: 15 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_ARAB_WOMAN, dataid: 16 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_ASIAN_MAN, dataid: 17 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_ASIAN_WOMAN, dataid: 18 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_CAUCASIAN_MAN, dataid: 19 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_CAUCASIAN_WOMAN, dataid: 20 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_INDIAN_MEN, dataid: 21 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_INDIAN_WOMAN, dataid: 22 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_LATINO_MAN, dataid: 23 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: label.ELDER_ADULT_LATINO_WOMAN, dataid: 24 },
	]

	// Declaration of Global variables
	userAccounts;
	loggedUserData;

	//To fetch the Logging user 
	@wire(LOGGED_USER)
	wiredLoggedUser({ error, data }) {
		let globalThis = window;
		try {
			
			//nullcheck is handled in apex
			if (data) {
				
				this.loggedUserData = data;
				if (this.loggedUserData && this.loggedUserData?.BI_PSPB_Caregiver__c === true) {
					this.loggedPatient = false;
				}
				if (this.loggedUserData && this.loggedUserData?.BI_PSPB_Caregiver__c === false) {
					this.loggedPatient = true;
					
				}
			} else if (error) {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  this.siteUrlBranded + this.displayNavErrorPage );
			}
		} catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  this.siteUrlBranded + this.displayNavErrorPage );
		}
	}

	handleavatare(event) {
		
		this.avatarImg = event.target.getAttribute('data-id')
		for (let i = 0; i < this.imageClass.length; i++) {
			this.imageClass[i].avatarclass = 'avatar';
		}
		
		const CLICKED_AVATAR = this.imageClass.find(avatar => {
				// Assuming this.avatarImg is a JSON string representing an object
				const parsedAvatarImg = JSON.parse(this.avatarImg);
				return avatar.dataid === parsedAvatarImg;
			});

		if (CLICKED_AVATAR) {
			CLICKED_AVATAR.avatarclass = 'selected'; //css class
			this.avatarImage = CLICKED_AVATAR.image
			
		}
	}

	
	//To fetch the Account data from apex class
	@wire(CURRENT_USER)
	wiredUserAccounts({ error, data }) {
		let globalThis = window;
		try {
			if (data) {
				this.userAccounts = data;
				let myString;
		
					myString = data[0]?.BI_PSP_AvatarUrl__c;
				
	
				if (myString) {
					this.updateAvatarClass(myString);
				}
			} else if (error) {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  this.siteUrlBranded + this.displayNavErrorPage );
			}
		} catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  this.siteUrlBranded + this.displayNavErrorPage );
		}
	}
	
	updateAvatarClass(myString) {
		const parts = myString.split('/');
	
		// Update imageClass based on the parts of the URL
		this.imageClass.forEach(image => {
			image.avatarclass = 'avatar'; // Default class
		});
	
		const clickedAvatar = this.imageClass.find(avatar => avatar.image.toString().includes(parts[4]));
		if (clickedAvatar) {
			clickedAvatar.avatarclass = 'selected';
			this.avatarImage = clickedAvatar.image;
		}
	}
	
	// Save the avatar url to patient in acount object 
	handleSave() {
		
		if (!this.avatarImage) {
			return;
		}
	
		if (this.avatarImage) {
			const { ENROLLEE_ID, NEW_AVATAR_SRC } = this.getEnrolleeDetails();
			this.updateAvatar(ENROLLEE_ID, NEW_AVATAR_SRC);
		}
	}
	
	getEnrolleeDetails() {
		let ENROLLEE_ID;
		const NEW_AVATAR_SRC = this.avatarImage;
			ENROLLEE_ID = this.userAccounts[0].Id;
		return { ENROLLEE_ID, NEW_AVATAR_SRC };
	}
	
	updateAvatar(enrolleeId, avatarSrc) {
		let globalThis = window;
		AVATAR({ enrolleeId, avatarSrc })
			.then(() => {
				
				window.location.reload();
			})
			.catch(error => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.errorPage );
			});
	}
	
HandleToast(error){
	this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
}
	//This showtoast message is used for get error
	showToast(title, message, variant) {
		const EVENT = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(EVENT);
	}
}