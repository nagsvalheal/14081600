// This Card displays information related to the Dermatology Life Quality Index (DLQI) questionnaire, aiding in the presentation and understanding of its contents.
//To import Libraries
import { LightningElement, wire} from 'lwc';
//To import Apex classes
import GET_CATEGORY_STATUS from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCategoryStatus';
import GET_ASSESSMENT_BY_CURRENT_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_ASSESSMENT_RESPONSE_OF_DLQI from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
//To import Static Resource
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
//To get UserId
import Id from '@salesforce/user/Id';
//To import Custom lables
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire'; 
export default class BiPspbDlqiCard extends LightningElement {
	//Global variables
	totalQuestionCount = 10;
	rolloutDateFromCard;
	answeredQuestions = 0;
	dateResponses = [];
	storeDate;
	userId = Id;
	rolloutDate;
	expiresIn;
	assessementstatus;
	isStartLabel = true;
	showCompleteddate = false;
	categoryName = labels.DLQI_CATEGORY;
	assessmentId;
	status =labels.COMPLETED_LABEL;
	dlqiRollOutDate;
	expireDate;
	expireApexDate;
	cardImage =DLQI_IMG;
	rollOut = labels.ROLLOUT_DATE_TEXT;
	dlqiHeading = labels.DLQI_HEADING_TEXT;
	dlqiIndexHeading = labels.DLQI_HEADING_ONE_TEXT;
	answeredLabel = labels.ANSWER_LABEL;
	expireLabel = labels.EXPIRE_LABEL;
	urlq;
	completedOnDate;
	completedOn = labels.COMPLETED;
	// Variable to check if data is already loaded
	isDataLoaded = false;
	completedDateFromAssessment = null;
	twoMonthsTrueFalse=false

	valueToSend;
	// To get site Url to find the Current SiteName
	renderedCallback() {
		try {
			let currentURL = window.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL);
			// Get the path
			let path = urlObject.pathname;
			// Split the path using '/' as a separator
			let pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_NAVI_URL;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(error.message, labels.ERROR_VARIANT); //Catching Potential Error
		}
	}

	// For Mobile Response 
	get flexCard() {
		let globalThis = window;
		let flexCrd = globalThis?.innerWidth;

		if (flexCrd <= 600) {
			return this.isStartLabel ? 'flexCard' : 'flexCard1';
		}
		return 'flexCard';
	}
	get bottomBar() {
		let globalThis = window;
		let bottmBar = globalThis?.innerWidth;

		if (bottmBar <= 600) {
			return this.isStartLabel ? 'bottomBar' : 'bottomBar1';
		}
		return 'bottomBar';

	}
	get shiftImage() {
		let globalThis = window;
		let img = globalThis?.innerWidth;

		if (img <= 600) {
			return this.isStartLabel ? 'image' : 'image1';
		}
		return 'image1';

	}
	get dlqiTextChange() {
		let globalThis = window;
		let dlqi = globalThis?.innerWidth;

		if (dlqi <= 600) {
			return this.isStartLabel ? 'dlqi2' : 'dlqi22';
		}
		return 'dlqi2';

	}
	get dlqiTextChangeRollout() {
		let globalThis = window;
		let dlqiThree = globalThis?.innerWidth;

		if (dlqiThree <= 600) {
			return this.isStartLabel ? 'dlqi3' : 'dlqi33';
		}
		return 'dlqi3';

	}
	get ans() {
		let globalThis = window;
		let answer = globalThis?.innerWidth;

		if (answer <= 600) {
			return this.isStartLabel ? 'ans' : 'ans1';
		}
		return 'ans';

	}
	@wire(GET_ASSESSMENT_BY_CURRENT_USER, { categoryname: '$categoryName' })
	wiredAssessments({ data, error }) {
		if (data) {
			this.handleAssessments(data);
		} else if (error) {
			this.showToast(error.body.message, labels.ERROR_VARIANT);
		}
	}
	handleAssessments(data) {
		this.assessmentId = data.length > 0 ? data[0].Id : null;
		this.status = data.length > 0 ? data[0].AssessmentStatus : null;
		this.completedDateFromAssessment = data.length > 0 ? data[0].BI_PSP_RolloutforCompletedQuestionnarie__c : null;
		if (this.completedDateFromAssessment !== null) {
			this.handleDateForCard(this.completedDateFromAssessment);
		}
		if (this.status === labels.EXPIRED) {
			this.setDates(data.length > 0 ? data[0].ExpirationDateTime : null);
		} else if (this.status === labels.COMPLETED_LABEL) {
			this.showCompleteddate = true;
			this.isStartLabel = false;
			this.setCompletedDate(data.length > 0 ? data[0].EffectiveDateTime : null);
		}
	}

	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ data, error }) {
		if (data) {
			this.handleRolloutDate(data);
		} else if (error) {
			this.showToast(error.body.message, labels.ERROR_VARIANT);
		}
	}

	handleDateForCard(data) {
		this.rolloutDateFromCard = data;
		if (this.status === labels.IN_PROGRESS || this.status === labels.COMPLETED_LABEL) {
			this.setDates(this.rolloutDateFromCard);
		}
		this.isDataLoaded = true;
	}


	handleRolloutDate(data) {
		this.dateResponses = data;
		if (!this.assessmentId) {
			this.storeDate = data[0]?.BI_PSP_DLQI_RollOutDate__c || null;
			this.setDates(this.storeDate);
		}
	}

	setDates(date) {
		this.valueToSend = date;
        this.dispatchValueChangeEvent();
		let currentDate = new Date(date);
		this.rolloutDate = this.formatDate(currentDate);

		let expireDate = new Date(currentDate);
		expireDate.setDate(expireDate.getDate() + 30);
		this.expireDate = this.formatDate(expireDate);

		this.expiresIn = this.calculateDifferenceInDays(expireDate);
		if (this.expiresIn > 30 || this.expiresIn < 0) {
			this.expiresIn = 30;
		}
	}

	setCompletedDate(date) {
		
		let currentDate = new Date(date);
		this.completedOnDate = this.formatDate(currentDate);
	}

	formatDate(date) {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	calculateDifferenceInDays(date) {
		let todayMs = new Date().getTime();
		let expireDateMs = date.getTime();
		return Math.ceil((expireDateMs - todayMs) / (1000 * 60 * 60 * 24));
	}
	//To get total Response from Questionnaire to show the count
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_RESPONSE_OF_DLQI, { questCatgryName: '$categoryName', someBooleanParam: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			if (data) {
				let objectsWithResponseOrder = data.filter(
					(item) => item.BI_PSP_ResponseOrder__c === 7
				);
				if (objectsWithResponseOrder.length > 0) {
					if (objectsWithResponseOrder[0].ResponseValue === labels.NO_LABEL) {
						this.totalQuestionCount = 11;
					} else {
						this.totalQuestionCount = 10;
					}
				}
			} else if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(err.message, labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	// To get assessment and their status
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */
	@wire(GET_CATEGORY_STATUS, { assessmentId: '$assessmentId' })
	wiredCategoryStatus({ error, data }) {
		try {
			if (error) {
				this.showToast(error.body.message, labels.ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.answeredQuestions = data;
				if (this.answeredQuestions > 10) {
					this.totalQuestionCount = 11;
				}

				if (
					this.totalQuestionCount === this.answeredQuestions &&
					this.status === labels.IN_PROGRESS
				) {
					this.isStartLabel = false;
				} else if (
					this.totalQuestionCount !== this.answeredQuestions &&
					this.answeredQuestions < this.totalQuestionCount &&
					this.answeredQuestions > 0 &&
					this.status === labels.IN_PROGRESS
				) {
					this.isStartLabel = false;
				} else if (this.status === labels.EXPIRED) {
					this.isStartLabel = true;
					this.answeredQuestions = 0;
				} else if (
					this.answeredQuestions === this.totalQuestionCount &&
					this.status === labels.COMPLETED_LABEL
				) {
					this.isStartLabel = false;
				}
			}
		} catch (err) {
			this.showToast(err.message, labels.labels.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// Dynamic Button label according to Responses
	get buttonLabel() {
		if (!this.assessmentId) {
			this.isStartLabel = true;

			return labels.START_LABEL;
		} else if (
			this.totalQuestionCount === this.answeredQuestions &&
			this.status === labels.IN_PROGRESS
		) {
			this.isStartLabel = false;
			return labels.RESUME;
		} else if (
			this.totalQuestionCount !== this.answeredQuestions &&
			this.answeredQuestions < this.totalQuestionCount &&
			this.answeredQuestions > 0
		) {
			this.isStartLabel = false;
			return labels.RESUME;
		} else if (this.status === labels.EXPIRED) {
			this.isStartLabel = true;
			return labels.START_LABEL;
		}
		this.isStartLabel = false;
		return labels.COMPLETED_LABEL;
	}

	//Navigation to QUestionnarie
	handleButtonClick() {
		if (this.buttonLabel === labels.START_LABEL) {
			let rolldate = new Date(this.rolloutDate);
			let currentDate = new Date();
			if (currentDate >= rolldate) {
				window.location.assign(this.urlq + labels.DLQI_URL);
			}
		} else if (this.buttonLabel === labels.RESUME) {
			window.location.assign(this.urlq + labels.DLQI_URL);
		} else {
			window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
		}
	}
	dispatchValueChangeEvent() {
       const event = new CustomEvent('valuechange', {
            detail: { value: this.valueToSend}
        });
        this.dispatchEvent(event);
    }
	// showToast used for all the error messages caught
	showToast(message, variant) {
		let messageList = message + ' ' + variant;
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', messageList);
		globalThis.location.assign(this.urlq +labels.ERROR_PAGE);
	}
}