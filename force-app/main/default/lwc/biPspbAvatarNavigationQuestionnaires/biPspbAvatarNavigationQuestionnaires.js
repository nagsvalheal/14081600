//This Lightning web component purpose is Avatar Prompt message for all the navigation pages
//To import the Libraries
import { LightningElement, wire, api } from 'lwc';
//To import the Apex class
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import GET_ASSESSMENT_BY_CURRENT_USERNAME_PSS from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_DRAFT_RESPONSE from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import the User Id
import {resource} from 'c/biPspbQuestionaireResource';


export default class BiPspbAvatarNavigationQuestionnaires extends LightningElement {
	// Declaration of variables with @track
	selectAvatar = resource.SELECT_AVATAR;
	qualitySatisfation = resource.QUALITY_SATISFACTION;
	selectedOne;
	selectedTwo;
	saveAsDraftMsg;
	contentDot = true;
	content = false;
	summary = false;
	twoContent = false;
	challangeContent = false;
	mobileName;
	twoMobileName;
	navigationContentDotOne;
	navigationContentFive = 'navigationcontent5'; //css class
	selected;
	selectedName = '';
	selectedNameOne;
	mobileValue;
	selectedNameThree;
	selectedNameTwo;
	selectedNameFour;
	selectedNameFive;
	selectedFive;
	caregiver = false;
	main = true;
	showAllCmps = true;
	xpValue;
	closeValue = 'close'; //css class
	cuurentTab;
	contentDotOne = false;
	twoContentMobile = false;
	challengeContentMobile = false;
	subMobile;
	
	twoContentMobileOne = false;
	// Declaration of variables 
	userContacts;
	name;
	rendered = false;
	avtList;
	selectedAvatarSrc;
	seperateChallenge;
	userAccounts;
	shouldShowComponent = false;
	challengeNameOne;
	challengeNameTwo;
	userId = resource.Id;
	wpaiCategory = resource.WAPI_CATEGORY;
	twoMonthsTrueFalse = false;
	qualitative = false;
	questionResponseForSeven;
	categoryName = resource.QUALITATIVE_LABEL;
	dermo = false;
	showClose = false;



	@api
	get receivedXpValue() {
		return this.xpValue;
	}
	set receivedXpValue(value) {
		this.xpValue = value;
		if (this.xpValue === resource.XP_VALUE) {
			this.challangeContent = false;
		}
	}
	// To het the Response for WAPI

	@wire(GET_DRAFT_RESPONSE, { questCatgryName: '$wpaiCategory', someBooleanParam: '$twoMonthsTrueFalse' })

	wiredDraftResponses({ data }) {

		try {

			if (data) {

				const objectsWithResponseOrderSeven = data.filter(item => item.BI_PSP_ResponseOrder__c === 1);
				this.questionResponseForSeven = objectsWithResponseOrderSeven[0].ResponseValue;
			}

		}
		catch (error) {
			this.handleError(error.body.message); // Catching Potential Error from Apex
		}
	}
	@api
	get valuefromparent() {
		return this.valueFromParentValue;
	}
	set valuefromparent(value) {

		this.valueFromParentValue = value;
		if (value === resource.NO) {
			this.mobileName = resource.WPAI_MOB_TWO;
this.mobileValue = resource.WORK_PRODUCT;
			this.selectedNameOne = resource.SUMMARY_WPAI;
this.selectedOne =resource.WPAIN_VALUE;
this.selectedTwo = resource.WPAIN_VALUE_THREE;

		}
	
	else {
			this.mobileName = resource.QUES_PROBLEM;
this.mobileValue = resource.QUES_ON_PAGE;
			this.selectedNameOne = resource.QUES_ON_PAGE;
			this.selectedOne ='';
			this.selectedTwo = '';
		}

	}
	@api
	get receivedCategory() {
		this.dispatchValueChangeEvent();
		return this._receivedCategory;
	}

	set receivedCategory(value) {
		let globalThis = window;
		let recievedCatgry = globalThis.location?.pathname;
		const currentTabName = recievedCatgry.split('/').pop();
		this._receivedCategory = value;

		this.summary = true;
		this.dermo = true;
		this.main = false;

		if (value === resource.DLQI_CATEGORY) {
			this.content = false;
			this.contentDot = false;
		}

		if (value === resource.DLQI_CATEGORY) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (currentTabName === resource.SUMMARY_URL && value === resource.DLQI_CATEGORY) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDotOne = 'navigationcontentdot1';
				//Strings are hardcoded for css responsiveness
				this.mobileName = resource.QUES_MOB_ONE ;
				this.mobileValue = resource.AIM_GRAPH;
				this.selectedNameSix = resource.DLQI_CATEGERY;
				this.selectedNameFive = resource.QUES_MOB_TWO;
this.selectedFive = resource.QUES_MOB_THREE;
				this.selectedNameFour = resource.QUES_VALUE_FOUR;
				this.selectedNameTwo =resource.QUES_VALUE_FOUR;

			}

		}
		else if (value === resource.WAPI_CATEGORY) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (currentTabName === resource.SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDotOne = 'navigationcontentdot1sub1';
				this.selectedNameSix = resource.QUES_VALUE_FIVE;
				this.mobileName = resource.WPAI_PUSTULAR;
				this.mobileValue = resource.WPAI_RESPONCE;
				this.selectedNameFive = resource.QUES_VALUE_SIX;
this.selectedFive = resource.QUES_VALUE_SEVEN;
				this.selectedNameFour = resource.QUES_VALUE_FOUR;
				this.selectedNameTwo = resource.QUES_VALUE_FOUR;
			}
		}
		else if (value === resource.PSS_CATEGORY) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (currentTabName === resource.SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDotOne = 'navigationcontentdot1sub2';
				this.mobileName = resource.LISTED_PEOPLE;
				this.selectedNameSix = resource.QUES_VALUE_EIGHT;
				this.mobileValue = resource.LISTED_QUESTIONAIRE;
				this.selectedNameFive = resource.QUES_VALUE_NINE;
this.selectedFive = resource.THE_GRAPH_VALUE;
				this.selectedNameFour = resource.QUES_VALUE_FOUR;
				this.selectedNameTwo = resource.QUES_VALUE_FOUR

			}
		}

	}
	//Getting assessment records and status
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */

	@wire(GET_ASSESSMENT_BY_CURRENT_USERNAME_PSS, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.handleError(error.body.message); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
				if (this.status === resource.COMPLETED_LABEL) {
					this.shouldShowComponent = false;
				}
			}
		} catch (err) {
			this.handleError(err.message); // Catching Potential Error from LWC
		}
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.handleError(error.body.message);
			}

			if (data) {
				this.handleEnrollmentData(data);
			}
		} catch (err) {
			this.handleError(err.message);
		}
	}

	handleEnrollmentData(data) {
		this.targetTwoMonthsDate = data.targetTwoMonthsDate ?? null;
		this.targetFourteenWeeksDate = data.targetFourteenWeeksDate ?? null;

		if (this.targetFourteenWeeksDate !== null) {
			this.processEnrollmentDate(this.targetFourteenWeeksDate, 7);
		} else if (this.targetTwoMonthsDate !== null) {
			this.processEnrollmentDate(this.targetTwoMonthsDate, 6);
		}
	}

	processEnrollmentDate(questionCount) {
		this.shouldShowComponent = true;
		this.totalquestioncount = questionCount;

		if (!this.assessmentId || this.status === resource.EXPIRED || this.status === resource.IN_PROGRESS || this.status === resource.COMPLETED_LABEL) {
			if (this.status === resource.IN_PROGRESS) {
				this.isStartLabel = false;
			} else if (this.status === resource.COMPLETED_LABEL || this.statusFourteenWeek === resource.COMPLETE) {
				this.shouldShowComponent = false;
			} else {
				this.isStartLabel = true;
			}

			if (this.status === resource.EXPIRED && this.targetFourteenWeeksDate === null) {
				this.shouldShowComponent = false;
			}

		}
	}


	//To trigger Close icon in Avatar navigation
	handleClose() {
		let globalThis = window;
		this.showClose = false;
		if (this.contentDot === false && this.contentDotOne === false) {
			let handleClse = globalThis.location?.pathname;
			this.saveAsDraftMsg = '';
			const currentTabName = handleClse.split('/').pop();
			this.contentDot = true;

			this.mobileName = this.subMobile;
			if (currentTabName === resource.SUMMARY_URL) {
				this.navigationContentFive = 'navigationcontent5sub';
				this.contentDotOne = true;
				this.contentDot = false;
				this.mobileName = this.subMobile;
			}
			if (currentTabName === resource.OUTSTANDING_QUESTIONNAIRE_URL) {
				this.twoContentMobile = false;

			}
			if (currentTabName === resource.PATIENT_FIRST_AVATAR) {
				this.twoContentMobile = false;
			}
			if (currentTabName === resource.SUMMARY_URL) {
				this.twoContentMobileOne = false;
			}
		}

	}

	//To trigger three Dots in Avatar Navigation
	mobileclick() {
		this.showClose = true;
		const currentTabName = window.location.pathname.split('/').pop();
		this.subMobile = this.mobileName;
		this.mobileName = this.mobileValue;
		this.closeValue = 'close1';
		this.contentDot = false;
		this.contentDotOne = false;
		if (currentTabName === resource.SUMMARY_URL) {
			this.navigationContentFive = 'navigationcontent5sub';

			this.mobileName = this.mobileValue;
		}
		if (currentTabName === resource.OUTSTANDING_QUESTIONNAIRE_URL) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (currentTabName === resource.PATIENT_FIRST_AVATAR) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (currentTabName === resource.SUMMARY_URL) {
			this.twoContentMobileOne = true;
			this.twoMobileName = this.selectedNameFour;
		}
		if ((currentTabName === resource.QSQ_FOURTEENWEEKS_URL) || (currentTabName === resource.QSQ_TWOMONTHS_URL)) {
			this.saveAsDraftMsg = resource.YOU_SUBMIT;
		}


	}

	renderedCallback() {
		if (this._receivedCategory === resource.DLQI_CATEGORY) {
			this.content = false;
			this.contentDot = false;
		}

	}

	// Unified method to fetch user details
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {

				const currentTabName = window.location.pathname.split('/').pop();
				const isCaregiver = data.isCaregiver;

				this.name = data.length > 0 ? data[0]?.Name : '';
				this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : resource.DEFAULT_AVATAR_NAVIGATION;

				this.setTabSpecificContent(currentTabName);

				if (data?.length > 0) {
					if (this.qualitative === false) {
						this.content = true;
					}
					this.contentDot = true;
					this.caregiver = isCaregiver;
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : resource.DEFAULT_AVATAR_NAVIGATION;

					let pathname = window.location.pathname;
					if (pathname === resource.BR_SITE_URL || pathname === '') {
						this.mobileName = resource.SELECT_MOB_ONE;
this.mobileValue = resource.SELECT_MOB_TWO;
						this.selectedNameOne = resource.SELECT_PATIENT_VALUE;
this.selectedOne = resource.SELECT_PATIENT_ONE;
					}
				}
			} else if (error) {
				this.handleError(error.body.message);
			}
		} catch (err) {
			this.handleError(err.message);
		}
	}

	setTabSpecificContent(currentTabName) {
		if (currentTabName === resource.AVATAR_QUESTIONNAIRE_URL || currentTabName === resource.AVATAR_QUESTIONNAIRE_TWO_URL) {
			this.mobileName = resource.LETS_PERSONAL_MOB_TWO;
this.mobileValue = resource.PERSONALIZE_MSG_ONE;
			this.selectedNameOne = resource.WE_WANT_LEARN;
this.selectedOne = resource.YOUR_SELF;
		} else if (currentTabName === resource.OUTSTANDING_QUESTIONNAIRE_URL) {
			if (this.shouldShowComponent === true) {
				this.twoContent = true;
			}
			this.mobileName = resource.KNOW_RESULT;
this.mobileValue = resource.KNOW_RESULT_DOCTER;
			this.selectedNameOne = resource.KNOW_YOUR;
this.selectedOne =resource.QUESOUTSTAND_VALUE_TWO ;
this.selectedTwo =resource.QUESOUTSTAND_VALUE_SIX;
			this.selectedNameTwo = resource.QUESOUTSTAND_VALUE_THREE;
this.selectedNameTwoSub = resource.QUESOUTSTAND_VALUE_FOUR;
		} else if (currentTabName === resource.LETS_PERSONALIZE_URL) {
			this.mobileName = resource.LETS_PERSONAL_MOB_ONE;
			this.mobileValue = resource.PERSONALIZE_MSG_ONE;
			this.selectedNameOne = resource.WE_WANT_LEARN;
this.selectedOne = resource.YOUR_SELF;
		} else if (currentTabName === resource.DLQI_QUESTIONNAIRE_URL) {
			this.mobileName = resource.AIM_DLQI;
this.mobileValue = resource.AIM_DLQI_LAST;
			this.selectedNameOne = resource.AIM_DERMATOLOGY;
		} else if (currentTabName === resource.PSS_QUESTIONNAIRE_URL) {
			this.mobileName = resource.PERSONALIZE_MOB;
this.mobileValue = resource.PERSONALIZE_VALUE_ONE;
			this.selectedNameOne =resource.PERSONALIZE_VALUE_ONE;
		} else if (currentTabName === resource.WAPI_QUESTIONNAIRE_URL) {
			if (this.questionResponseForSeven === resource.NO) {
				this.mobileName = resource.WPAI_MOB_TWO;
this.mobileValue = resource.WORK_PRODUCT;
				this.selectedNameOne = resource.SUMMARY_WPAI;
this.selectedOne = resource.WPAIN_VALUE;
this.selectedTwo = resource.WPAIN_VALUE_THREE;
			} else {
				this.mobileName = resource.QUES_PROBLEM;
this.mobileValue =resource.QUES_ON_PAGE;
				this.selectedNameOne = resource.QUES_ON_PAGE;
			}
		} else if (currentTabName === resource.QSQ_TWOMONTHS_URL || currentTabName === resource.QSQ_FOURTEENWEEKS_URL) {
			this.mobileName = resource.AIM_QUES;
			this.content = false;
			this.qualitative = true;
			this.twoContent = true;
			this.mobileValue = resource.AIM_DRAFT_SUBMIT;
			this.selectedNameOne = resource.MONTHS_TWO;
			this.selectedNameTwo = resource.COME_BACK;
		} else if (currentTabName === resource.WAPI_COMPLETED) {
			this.mobileName = resource.COMPLETED_MOB_QUES;
this.mobileValue = resource.WPAI_VALUE_FOUR;
			this.selectedNameOne = resource.WPAI_VALUE_FOUR;
		} else if (currentTabName === resource.PSS_COMPLETED_URL) {
			this.mobileName = resource.PSORIUS_MOB_THREE;
this.mobileValue =resource.PSORIUS_VALUE_TWO;
			this.selectedNameOne = resource.PSORIUS_VALUE_TWO;
		} else if (currentTabName === resource.DLQI_COMPLETED_URL) {
			this.mobileName = resource.QUES_HERE;
this.mobileValue = resource.QUES_VALUE_ONE;
			this.selectedNameOne = resource.QUES_VALUE_ONE;
		} else if (currentTabName === resource.QSQ_TWOMONTHS_COMPLETED_URL) {
			this.handlevalues();
		} else if (currentTabName === resource.QSQ_FOURTEENWEEKS_COMPLETED_URL) {
		this.handlevalues();
		}
	}
handlevalues(){
	this.mobileName = resource.STATISFATION_HERE_MOB;
	this.mobileValue = resource.STATISFATION_HERE;
				this.selectedNameOne = resource.STATISFATION_HERE;
}
	handleError(err){
		this.navigateToErrorPage(err);
	}
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.href = this.urlq + resource.ERROR_PAGE; 
	}
}