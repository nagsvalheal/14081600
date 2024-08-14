// This component is used to create and update caregiver details as well as to check for unique emails
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { getObjectInfo ,getPicklistValues} from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle } from 'lightning/platformResourceLoader';
//import { NavigationMixin } from 'lightning/navigation';
// To import current user ID
import Id from '@salesforce/user/Id';
//  To import Apex Classes
import UPDATE_CONTACT_FROM_CHECKBOX from '@salesforce/apex/BI_PSPB_ProfileManagerCtrl.updateContactFromCheckbox';
import CREATECAREGIVER from '@salesforce/apex/BI_PSPB_CaregiverOnboardingCtrl.createCaregiverRecord';
import EXISTING_CAREGIVER_ACCOUNT from '@salesforce/apex/BI_PSPB_EnrollmentUtilities.getExistingAccounts';
import CAREGIVER_DATE_VIEW from '@salesforce/apex/BI_PSPB_ProfileManagerCtrl.getCaregiverDataView';
import UPDATE_CAREGIVERS_DETAILS from '@salesforce/apex/BI_PSPB_ProfileManagerCtrl.updateCaregivers';
import CREATE_ENROLLEE_CREATE from '@salesforce/apex/BI_PSPB_EnrolleeCaregiverCtrl.createEnroleeCaregiver';
import GREAND_ACCESS_BUTTON from '@salesforce/apex/BI_PSPB_ProfileManagerCtrl.grandAccessButton';
import ENROLLEE_DETAILS from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
//To import contact fields
import Contact from '@salesforce/schema/Contact';
import COUNTRY_FIELD from '@salesforce/schema/Contact.BI_PSPB_Relationship_To_Patient__c';


import { resources } from 'c/biPspbResourceProfileManager';
export default class BiPspbAddCaregivers extends LightningElement {
    //Proper naming conventions with camel case for all the variables will be followed in the future releases
    // Declaration of variables with
    firstNameErrorMessageValid = false;
    lastNameErrorMessageValid = false;
    firstName;
    isSubmitButtonDisabled=false;
    lastName;
    toastContent;
    email;
    mobilePhone;
    birth;
    uniqueEmail;
    relations;
    dobdate;
    uniqueFName;
    uniqueLname;
    uniqueDOB;
    uniqueusertype;
    newEmail = '';
    isEmailReadOnly = false;
    nonupdate;
    emailErrorMessage = false;
    mobileErrorMessage = false;
    relationshipErrorMessage = false;
    FirstNameErrorMessage = false;
    dobErrorMessages = false;
    showContactNumber = false;
    required = false;
    savebutton = '';
    grandbutton;
    grantlabel = 'toggle-label';
    slider;
    showPrompt = false;
    errorMessage = '';
    relation;
    caregiverIds = '';
    minorError; // Initialize to false
    minorErrorTwo;
    minorErrorThree;
    error = false;
    dateOfBirth;
    age;
    dobErrorMessage = false;
    showdiv = false;
    updatepopup = false;
    emailError = false;
    sliderView = false;
    // Declaration of Global variables
    Boxedicon = resources.Boxedicon;
    warningIcon=resources.WARNING_IMAGE;
    ticIcon=resources.TIC_IMAGE;
    name = resources.FIRST_NAME;
    surname = resources.LAST_NAME;
    enterDob = resources.ENTER_DOB;
    enterLastName = resources.ENTER_LASTNAME;
    enterFirstName = resources.ENTER_FIRSTNAME;
    enterEmail = resources.ENTER_EMAIL;
    minor = resources.MINOR;
    select = resources.SELECT;
    enterPhone = resources.PHONE_NUMBER
    abovedate = resources.ABOVE_ERROR;
    belowDate = resources.FUTHURE_DATE;
    deleteToastimage = resources.RIGHT_ICON;
    dateofbirth = resources.DATE_OF_BIRTH;
    phone = resources.PHONE_ERROR;
    emailId = resources.EMAIL;
    date = false;
    rightimg = resources.RIGHT_ICON;
    CaregiverInfo = resources.CAREGIVER_INFO;
    addCaregiver = resources.ADD_CAREGIVER;
    updateCaregiver=resources.UPDATE_CAREGIVER;
    validFirstname = resources.VALIDFNAME;
    validLastname = resources.VALIDLNAME;
    validEmail = resources.VALID_EMAIL;
    existEmail = resources.EXIST_EMAIL;
    firstnamelabel = resources.FIRSTNAME_LABEL;
    lastnameLabel = resources.LASTNAME_LABEL;
    dobLabel = resources.DOB_LABEL;
    dobError = resources.DOB;
    grantAccess = resources.GRANT_ACCESS;
    boxContent = resources.BOX_CONTENT;
    relationshipLabel = resources.RELATIONSHIP_LABEL;
    relationshipError = resources.RELATIONSHIP_ERROR;
    caregiverEmail = resources.CAREGIVER_EMAIL;
    phoneMandatory = resources.PHONE_MANDATORY;
    userId = Id;
    accname;
    AccountId;
    recordTypeId;
    checkEmail = false;
    cuurentEmail;
    dob;
    enrolleeids;
    grantAccessDisabled = '';
    Warningicon = resources.WARNING;
    hcpEmailField;


    // wire to Check if grand access toggle is true or false
    @wire(GREAND_ACCESS_BUTTON)
    wiredGrantAccess({ error, data }) {

        try {
            //Null data is checked and AuraHandledException is thrown from the Apex
            if (data) {
                if (data[0].BI_PSPB_Status__c === resources.ACTIVE) {
                    this.slider = true;
                    this.showPrompt = true;

                } 
                else {
                    // If false, disable the checkbox
                    this.slider = false;
                    this.showPrompt = false;

                }

            }
            if (typeof window !== 'undefined') {
					this.dispatchEvent(new CustomEvent('load'));
				}
             else if (error) {
                let globalThis = window;
                this.error =error.body.message;
                globalThis.location.href = resources.ERROR_PAGE;
                globalThis.sessionStorage.setItem('errorMessage',  this.error);
            }
        } catch (err) {
            let globalThis = window;
            this.error = resources.RECORD_NOT_FOUND;
            globalThis.location.href = resources.ERROR_PAGE;
            globalThis.sessionStorage.setItem('errorMessage', this.error);

        }

    }

    handleclose() {
        this.isSubmitButtonDisabled = false;
        this.showdiv = false;
        this.sliderView=true;
        this.updatepopup = false;
    }

    //to retrieve and prepopulate caregiver information
    @wire(CAREGIVER_DATE_VIEW)
    wiredUserCaregivers({ data, error }) {
        try {

            //null data is checked and Aurahandled exception is thrown from Apex
            if (data) {
                this.caregiverList = data;


                if (this.caregiverList.length > 0) {
                    this.sliderView = true;
                    this.caregiverIds = this.caregiverList[0].BI_PSPB_Contact_Id__r.Id;
                    this.firstName = this.caregiverList[0].BI_PSPB_Contact_Id__r.FirstName;
                    this.lastName = this.caregiverList[0].BI_PSPB_Contact_Id__r.LastName;
                    this.mobilePhone = this.caregiverList[0].BI_PSPB_Contact_Id__r.Phone;
                    this.email = this.caregiverList[0].BI_PSPB_Contact_Id__r.Email;
                    this.relations = this.caregiverList[0].BI_PSPB_Contact_Id__r.BI_PSPB_Relationship_To_Patient__c;
                    this.dobdate = this.caregiverList[0].BI_PSPB_Contact_Id__r.BI_PSP_Birthdate__c;
                    this.savebutton = resources.SAVECHANGES;
                    if (this.email !== '') {
                        this.isEmailReadOnly = true; // Set the email field as read-only


                    }
                }
            } else if (error) {
                let globalThis = window;
                this.error = resources.CAREGIVER_NOT_FOUND;//carerecord notfound
                globalThis.location.href = resources.ERROR_PAGE;
                globalThis.sessionStorage.setItem('errorMessage', this.error);//catching potential error from Apex
            }
            else {
                this.savebutton = resources.ADDCAREGIVER; //this happens if there is no data
            }
        } catch (err) {
            let globalThis = window;
            this.error = resources.CAREGIVER_NOT_FOUND;
            globalThis.location.href = resources.ERROR_PAGE;      //carerecord notfound  
            globalThis.sessionStorage.setItem('errorMessage', this.error);//catching potential error from LWC
        }

    }

    @wire(getObjectInfo, { objectApiName: Contact })
    objectInfo;
    //wire to retrieve the relationship picklist values
    @wire(getPicklistValues,
        {
            recordTypeId: '$objectInfo.data.defaultRecordTypeId',
            fieldApiName: COUNTRY_FIELD

        }
    )
    RelationshipValues({ data, error }) {
        if (data) {
            this.relation = data.values;
        } else if (error) {
            this.relation = undefined;
            let globalThis = window;
            this.error = resources.RECORD_NOT_FOUND;
            globalThis.location.href = resources.ERROR_PAGE;
            globalThis.sessionStorage.setItem('errorMessage', this.error);// Catching Potential Error from Apex
        }
    }
    patientvalidateForm() {
        let isValid = true;
        return isValid;
    }


    //to validate preferred communication method
    handleCommunicationMethodChange(event) {
        const PSP_BR_PreferredMethodofCommunication = event.detail.value;
        this.PSP_BR_Preferred_Method_of_Communication = PSP_BR_PreferredMethodofCommunication;
        if (PSP_BR_PreferredMethodofCommunication === resources.SMS_LABEL) {
            this.showContactNumber = true;
        } else {
            this.showContactNumber = false;
        }
    }


    //FIRST_NAME LAST_NAME regex
    handleKeyDown1(event) {
        const allowedCharacters = /^[A-Za-z]+$/u;
        if (!allowedCharacters.test(event.key)) {
            event.preventDefault();
        }
    }
    // Not allow paste event in FIRST_NAME and last name
    handlePaste(event) {
        // Prevent default paste behavior
        event.preventDefault();
    }


    //validate FIRST_NAME field
    firstnamevalueget(event) {
        this.firstName = event.target.value;
        this.FirstNameErrorMessage = false;
        this.firstName =
            event.target.value.trim().charAt(0).toUpperCase() +
            event.target.value.trim().slice(1);


        this.validateFirstName(); // Call the method to validate the first name


    }


    validateFirstName() {

        if (!this.firstName) {
            this.FirstNameErrorMessage = true;
            this.firstNameErrorMessageValid = false;
            // Add CSS classes to highlight the input field and label with an error
            //to get data field value from html
            this.template.querySelector('lightning-input[data-field="FirstName"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="FirstName"]').className = 'input-error-label';
        } else if (!/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.firstName)) {
            this.FirstNameErrorMessage = false;
            this.firstNameErrorMessageValid = true;
            this.template.querySelector('lightning-input[data-field="FirstName"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="FirstName"]').className = 'input-error-label';
        } else {
            this.firstNameerrorMessag = false;
            this.firstNameErrorMessageValid = false;
            // Remove CSS classes if the validation passes
            this.template.querySelector('lightning-input[data-field="FirstName"]').className = 'textInput';
            this.template.querySelector('div[data-field="FirstName"]').className = 'input-label';
        }
    }
    //validate LAST_NAME field
    Lastnamevalueget(event) {
        this.lastName = event.target.value;
        this.lastName =
            event.target.value.trim().charAt(0).toUpperCase() +
            event.target.value.trim().slice(1);
        this.LastNameerrorMessage = false;
        this.validatelastName();




    }
    validatelastName() {

        if (!this.lastName) {
            this.LastNameerrorMessage = true;
            this.lastNameErrorMessageValid = false;
            // Add CSS classes to highlight the input field and label with an error
            this.template.querySelector('lightning-input[data-field="LastName"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="LastName"]').className = 'input-error-label';
        }
        else if (!/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.lastName)) {
            this.LastNameerrorMessage = false;
            this.lastNameErrorMessageValid = true;
            this.template.querySelector('lightning-input[data-field="LastName"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="LastName"]').className = 'input-error-label';
        }
        else {
            this.LastNameerrorMessage = false;
            this.lastNameErrorMessageValid = false;
            // Remove CSS classes if the validation passes
            this.template.querySelector('lightning-input[data-field="LastName"]').className = 'textInput';
            this.template.querySelector('div[data-field="LastName"]').className = 'input-label';
        }

    }
    //validate age field
    agecalculationEvent(event) {
        this.dobdate = event.target.value;
        this.validateDate();
        this.dobErrorMessages = false;


    }


    // Validate that the date is not in the future
    validateDate() {
        const currentDate = new Date();
        const selectedDate = new Date(this.dobdate);


        if (!this.dobdate) {
            this.required = true;
            this.dobErrorMessage = false;
            this.template.querySelector('lightning-input[data-field="Birthdate"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="Birthdate"]').className = 'input-error-label';
        }
        else {
            this.required = false;
            this.dobErrorMessage = false;
            this.template.querySelector('lightning-input[data-field="Birthdate"]').className = 'textInput';
            this.template.querySelector('div[data-field="Birthdate"]').className = 'input-label';
        }


        if (selectedDate > currentDate) {


            this.dobErrorMessage = resources.FUTHURE_DATE;
            this.required = false;
            this.template.querySelector('lightning-input[data-field="Birthdate"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="Birthdate"]').className = 'input-error-label';
            return;
        }


        // Validate that the user is not a minor (you can set a minimum age)
        const minAge = resources.MINOR_AGE;
        const userBirthYear = selectedDate.getFullYear();
        const currentYear = currentDate.getFullYear();


        if (currentYear - userBirthYear < minAge) {
            this.dobErrorMessage = resources.MINOR;
            this.required = false;
            this.template.querySelector('lightning-input[data-field="Birthdate"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="Birthdate"]').className = 'input-error-label';
            return;
        }
        //get full year
        if (selectedDate < new Date('1900-01-01')) {
            this.dobErrorMessage = resources.ABOVE_ERROR;
            this.required = false;
            this.template.querySelector('lightning-input[data-field="Birthdate"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="Birthdate"]').className = 'input-error-label';
            return;
        }




        // If both validations pass, clear the error message


        this.dobErrorMessage = '';
        this.clearErrorStyles();


    }
    applyErrorStyles() {
        this.template.querySelector('lightning-input[data-field="Birthdate"]').classList.add('textInput-err');
        this.template.querySelector('div[data-field="Birthdate"]').classList.add('input-error-label');
    }


    clearErrorStyles() {
        this.template.querySelector('lightning-input[data-field="Birthdate"]').classList.remove('textInput-err');
        this.template.querySelector('div[data-field="Birthdate"]').classList.remove('input-error-label');
    }


    //validate phone field
    phonenumberEvent(event) {
        this.mobilePhone = event.target.value;
        this.mobileErrorMessage = false;
        this.validatePhone();
    }
    validatePhone() {
        if (!this.mobilePhone) {
            this.mobileErrorMessage = true;
            this.template.querySelector('lightning-input[data-field="phone"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="phone"]').className = 'input-error-label';
        } else {
            this.mobileErrorMessage = false;
            this.template.querySelector('lightning-input[data-field="phone"]').className = 'textInput';
            this.template.querySelector('div[data-field="phone"]').className = 'input-label';
        }
    }


    //to validate email
    caremailevent(event) {
        this.email = event.target.value;
        this.emailErrorMessage = false;
        this.checkEmail = false;
        this.validateemail();


    }


    validateemail() {
        if (!this.email) {
            this.emailErrorMessage = true;
            this.emailError = false;
            this.template.querySelector('lightning-input[data-field="email"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="email"]').className = 'input-error-label';
        } else if (!this.validateEmail(this.email)) {
            this.emailErrorMessage = false;
            this.emailError = true;
            this.hcpEmailField.className = 'textInput-err';
            this.template.querySelector('div[data-field="email"]').className =
                'input-error-label';
        }
        else {


            this.emailErrorMessage = false;
            this.emailError = false;
            this.template.querySelector('lightning-input[data-field="email"]').className = 'textInput';
            this.template.querySelector('div[data-field="email"]').className = 'input-label';
        }
    }




    //to validate relationship
    relationshipEvent(event) {
        this.relations = event.target.value;
        this.relationshipErrorMessage = false;
        this.validaterelation();


    }
    validaterelation() {
        if (!this.relations) {
            this.relationshipErrorMessage = true;
            this.template.querySelector('lightning-combobox[data-field="relationship"]').className = 'textInput-err';
            this.template.querySelector('div[data-field="relationship"]').className = 'input-error-label';
        } else {
            this.relationshipErrorMessage = false;
            this.template.querySelector('lightning-combobox[data-field="relationship"]').className = 'textInput';
            this.template.querySelector('div[data-field="relationship"]').className = 'input-label';


        }
    }


    //phone regex
    validatePhoneInput(event) {
        const charCode = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
        if (charCode !== 43 && (charCode < 48 || charCode > 57)) { // Allow only digits (48-57) and the plus symbol (43)
            event.preventDefault(); // Prevent the character from being entered
        }
    }

  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailPattern.test(email);
}

    handleKeyDownThree(event) {
        event.preventDefault();
    }
    //-----get current enrollee


    connectedCallback() {

        try {

            loadStyle(this, resources.TEXT_ALIGN);
            ENROLLEE_DETAILS({ userId: this.userId })

                .then(result => {
                    if (result !== null) {
                        if (result[0].patientEnrolle !== null) {
                            this.enrolleeids = result[0].patientEnrolle.Id;


                        } else if (result[0].error !== null) {
                            this.showError = true;
                            this.errorMessage = result[0].error;
                        }
                    }
                })
                .catch(() => {
                    let globalThis = window;
                    this.error = resources.CAREGIVER_NOT_FOUND;//enrolee notfound
                    globalThis.location.href = resources.ERROR_PAGE;
                    globalThis.sessionStorage.setItem('errorMessage', this.error); //catching potential error from Apex

                })
        } catch (err) {
            let globalThis = window;
            this.error = resources.CAREGIVER_NOT_FOUND;//enrolee notfound
            globalThis.location.href = resources.ERROR_PAGE;
            globalThis.sessionStorage.setItem('errorMessage', this.error);//catching potential error from LWC
        }


    }




    checkemailvalid(event) {


        this.cuurentEmail = event.target.value;




    }


    //caregiver information inserted and updated, email validated
    handlesave() {
        let isValid = true;
        this.sliderView=true;

        // Validate First Name
        this.FirstNameErrorMessage = !this.firstName;
        this.setFieldError('FirstName', this.FirstNameErrorMessage);

        // Validate Last Name
        this.LastNameerrorMessage = !this.lastName;
        if (!this.LastNameerrorMessage) {
            // Validate Last Name Format if Last Name is not empty
            this.lastNameErrorMessageValid = !/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.lastName);
            this.setFieldError('LastName', this.lastNameErrorMessageValid);
        } else {
            // Set the required error message for Last Name when it's empty
            this.setFieldError('LastName', this.LastNameerrorMessage);
        }

        // Validate Relations
        this.relationshipErrorMessage = !this.relations;
        this.setFieldError('relationship', this.relationshipErrorMessage);

        // Validate Date of Birth
        this.required = !this.dobdate;
        this.dobErrorMessage = false;
        this.setFieldError('Birthdate', this.required);

        // Validate Mobile Phone
        this.mobileErrorMessage = !this.mobilePhone;
        this.setFieldError('phone', this.mobileErrorMessage);

        // Validate Email
        this.emailErrorMessage = !this.email;
        this.emailError = false;
        this.setFieldError('email', this.emailErrorMessage);

        if (
            this.email &&
            !this.dobErrorMessage &&
            !this.emailError &&
            !this.FirstNameErrorMessage &&
            !this.lastNameErrorMessageValid &&
            !this.required &&
            !this.relationshipErrorMessage &&
            !this.mobileErrorMessage &&
            !this.emailErrorMessage
        ) {
            // Check existing caregiver account
            EXISTING_CAREGIVER_ACCOUNT({ email: this.email })
                .then(data => {
                    if (data) {
                        this.uniqueEmail = [];
                        this.uniqueFName = [];
                        this.uniqueLname = [];
                        this.uniqueDOB = [];
                        this.uniqueusertype = [];
                        // Loop through retrieved data to extract unique values
                        // Extract unique values from data and populate arrays
                        this.uniqueEmail = data.map(record => record.PersonEmail);
                        this.uniqueFName = data.map(record => record.FirstName);
                        this.uniqueLname = data.map(record => record.LastName);
                        this.uniqueDOB = data.map(record => record.BI_PSP_Birthdate__c);
                        this.uniqueusertype = data.map(record => ({ type: record.BI_PSPB_User_Type__c, email: record.PersonEmail }));


                    }

                    if (
                        this.uniqueFName !== undefined &&
                        this.uniqueLname !== undefined &&
                        this.uniqueEmail !== undefined &&
                        this.uniqueDOB !== undefined &&
                        this.uniqueusertype !== undefined
                    ) {

                        if (
                            this.uniqueFName.includes(this.firstName) &&
                            this.uniqueLname.includes(this.lastName) &&
                            this.uniqueDOB.includes(this.dobdate) &&
                            this.uniqueEmail.includes(this.email) &&
                            this.uniqueusertype.some(obj => obj.type === resources.Caregiver && obj.email === this.email) &&
                            this.savebutton !== resources.SAVECHANGES

                        ) {

                           
                            // Create new enrollee
                            CREATE_ENROLLEE_CREATE({
                               
                                patientId: this.enrolleeids,
                                firstName: this.firstName,
                                email: this.email
                            })
                                .then(() => {
                                        
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    
                                    this.showdiv = true;
                                    this.toastContent=this.addCaregiver;
                                })
                                .catch(() => {

                                    let globalThis = window;
                                    this.error = resources.CAREGIVER_NOT_UPDATE;

                                    globalThis.location.href = resources.ERROR_PAGE;
                                    globalThis.sessionStorage.setItem('errorMessage',this.error);
                                });
                        } else if (this.uniqueEmail.includes(this.email) && this.caregiverIds === '') {
                            this.checkEmail = true;
                            this.setFieldError('email', true);
                        }
                    } else {
                        // Add new caregiver
                        let addcaregiverDetails = {
                            caregiverId: this.enrolleeids,
                            firstName: this.firstName,
                            lastName: this.lastName,
                            email: this.email,
                            dob: this.dobdate,
                            relation: this.relations,
                            phone: this.mobilePhone,
                        };
                      this.isSubmitButtonDisabled = true;
                        CREATECAREGIVER({
                            newCaregiver: addcaregiverDetails
                        })
                            .then(() => {

                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                this.showdiv = true;
                                this.toastContent=this.addCaregiver;
                            })
                            .catch((error) => {
                                let globalThis = window;
                                globalThis.location.href = resources.ERROR_PAGE;
                                globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                            });
                    }
                })
                .catch(() => {
                    let globalThis = window;
                    this.error = resources.CAREGIVER_NOT_UPDATE;//carerecordinsert
                    globalThis.location.href = resources.ERROR_PAGE;
                    globalThis.sessionStorage.setItem('errorMessage', this.error);
                });
        }

        // Update existing caregiver details
        if (
            this.caregiverIds !== '' &&
            !this.required &&
            !this.dobErrorMessage &&
            !this.mobileErrorMessage &&
            !this.lastNameErrorMessageValid &&
            !this.FirstNameErrorMessage &&
            !this.firstNameErrorMessageValid
        ) {
            this.checkEmail = false;
            let addcaregiverDetails = {
                accountId: this.caregiverIds,
                firstName: this.firstName,
                lastName: this.lastName,
                personEmail: this.email,
                personBirthdate: this.dobdate,
                relations: this.relations,
                phone: this.mobilePhone,
            };
            this.isSubmitButtonDisabled = true;
            UPDATE_CAREGIVERS_DETAILS({
                wrapper: addcaregiverDetails
            })
                .then(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.updatepopup = true;
                    this.toastContent=this.updateCaregiver;
                })
                .catch(() => {
                    let globalThis = window;
                    this.error = resources.CAREGIVER_NOT_UPDATE;//carerecordupdate
                    globalThis.location.href = resources.ERROR_PAGE;
                    globalThis.sessionStorage.setItem('errorMessage',  this.error);
                });
        }

        return isValid;
    }

    setFieldError(fieldName, hasError) {
        const field = this.template.querySelector(`lightning-input[data-field="${fieldName}"]`) ||
            this.template.querySelector(`lightning-combobox[data-field="${fieldName}"]`);

        if (field) {
            if (hasError) {
                field.className = 'textInput-err';
                this.template.querySelector(`div[data-field="${fieldName}"]`).className = 'input-error-label';
            } else {
                field.className = 'textInput';
                this.template.querySelector(`div[data-field="${fieldName}"]`).className = 'input-label';
            }
        }
    }


    handlecontactsuccess(event) {
        this.contact__c = event.detail.id;
    }

    grantaccces() {

        UPDATE_CONTACT_FROM_CHECKBOX({ isChecked: this.slider })
            .then(() => { })
            .catch((error) => {
                let globalThis = window;
                globalThis.location.href = resources.ERROR_PAGE;
                globalThis.sessionStorage.setItem('errorMessage', error.body.message); //catching potential error from Apex

            });
    }


    //to make grant access button true
    handleCheckboxChange(event) {
        this.slider = event.target.checked;


        this.grantaccces();
        if (this.slider) {
            this.showPrompt = true;
        } else {
            this.showPrompt = false;
        }
    }




    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        if (typeof window !== 'undefined') {
            this.dispatchEvent(event);
        }
    }


}