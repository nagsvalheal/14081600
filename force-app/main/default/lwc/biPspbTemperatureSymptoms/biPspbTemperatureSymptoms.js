import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
// To import Apex Classes
import GET_ENROLLEE from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';

export default class BiPspTemperaturesymtom extends NavigationMixin(LightningElement) {
    @track boxedIcon = label.BOXED_ICON;
    @track humanParts = '';
    @track slider = 0;
    @track formatedTextVal;
    @track showMessage = false;
    @track temperatureValues = label.TEMPERATURE_VALUES;
    @track localStorageValueItchiness;
    @track insertCount;
    @track sliderValue = 0;
    @track moodValues = '';
    @track submitModal = false;
    @track allergyIntoleranceData;
    @track carePlanTemplateName;
    @track tempValuesFill = true;
    errorMessage;
    recordInsertCount = 0;
    lastSymptomId;
    accountId;
    userId = label.ID;
    valOfTemp = 37.5;
    alternateTextIcon = label.ALTERNATE_TEXT_ICON;
    currentBodyTemperature = label.CURRENT_BODY_TEMPERATURE;
    provideTemperature = label.MORE_ABOUT_TEMPERATURE;
    confirmAndSave = label.CONFIRM_SAVE;
    feverTemperature = label.FEVER_TEMPERATURE;


    @wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
    wiredAllergyIntoleranceData({data }) {
        try{
        if (data && data !== null) {
                data.forEach(record => {
                    let carePlanTempla = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;
                    if (carePlanTempla === label.TEMPERATURE_VALUES) {
                        this.carePlanTemplateName = carePlanTempla;
                    }
                    if (record?.BI_PSP_Temperature__c) {
                        this.valOfTemp = record.BI_PSP_Temperature__c;
                        if (this.valOfTemp > 41.6) {
                            this.showMessage = true;
                        }
                    }
                });
            
        } 
    }catch (error) {
    this.handleError(error.body.message);
    }}

    connectedCallback() {
        let globalThis = window;
        try {
            this.insertCount = globalThis?.sessionStorage.getItem('counttemp');
            this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
            let temprtevalues = globalThis?.sessionStorage.getItem('temprature');
            Promise.resolve().then(() => {
                try {
                    if (temprtevalues) {
                        this.valOfTemp = temprtevalues;
                    }
                    if (this.valOfTemp > 38) {
                        this.showMessage = true;
                    }
                } catch (error) {
                    this.handleError(error.body.message);
                }
            });
            GET_ENROLLEE()
            // Null data is checked and AuraHandledException is thrown from the Apex
            .then((result) => {
                    if (result &&  result[0].Id !== null) {
                        this.accountId = result[0].Id;
                    } 
        })
        .catch(error =>  this.handleError(error.body.message));
            this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId);
            this.currntmooderror = true;
        } catch (error) {
            this.handleError(error.body.message);
        }
    }

    decimalPattern = /^\d+(\.\d{0,2})?$/u;
    onchangeOfTempa(event) {
        let input = event.target;
        if (input.value > 41.6) {
            input.value = 41.6;
        }
        this.valOfTemp = event.target.value;
        if (!this.valOfTemp.match(/^\d+(\.\d{0,2})?$/u)) {
            this.valOfTemp = parseFloat(this.valOfTemp).toFixed(2);
        }
        let valoFValue = parseFloat(this.valOfTemp);
        if (isNaN(valoFValue) || valoFValue < 33.8 || valoFValue > 41.6) {
            this.tempvaluesfill = true;
        } else {
            this.tempvaluesfill = false;
        }
        if (this.valOfTemp > 38) {
            this.showMessage = true;
            this.showButton = true;
        } else {
            this.showMessage = false;
            this.showButton = false;
        }
    }

    onchangeAccept() {
        let record = {
            SliderValue: parseFloat(this.sliderValue),
            CareprogramId: this.accountId,
            ValoF: parseFloat(this.valOfTemp) || 0,
            SymptomId: this.lastSymptomId || this.localStorageValueItchiness,
            Symptomname: this.temperatureValues || '',
            Moodvalues: this.moodValues || '',
        };
        this.bodyparts = this.humanParts;

        try {
            if (this.insertCount === '1' || (this.lastSymptomId && this.carePlanTemplateName === label.TEMPERATURE_VALUES)) {
                this.handleRecordUpdate(RECORD_UPDATE_ALLERGY_INTOLERANCE, record);
            } else {
                this.handleRecordInsert(RECORD_INSERT_ALLERGY_INTOLERANCE, record);
            }
        } catch (error) {
            this.handleError(error.body.message);
        }
    }

    handleRecordUpdate(apexMethod, record) {
        let globalThis = window;
        try {
            let result = apexMethod({ itchinessallrecordupdate: record, bodyParts: this.humanParts });
            if (result && result !== null) {
                globalThis?.sessionStorage.setItem('temprature', this.valOfTemp);
                globalThis?.sessionStorage.setItem('syptombtn', false);
                this.dispatchCustomEvent('updatechildprop', false);
            }
        } catch (error) {
            this.handleError(error.body.message);
        }
    }

    handleRecordInsert(apexMethod, record) {
        let globalThis = window;
        try {
            let result = apexMethod({ itchinessallrecordinsert: record, bodyParts: this.humanParts });
            if (result && result !== null) {
                this.dispatchCustomEvent('updatechildprop', false);
                this.dispatchCustomEvent('addtask', label.TEMPERATURE_VALUES);
                this.recordInsertCount++;
                globalThis?.sessionStorage.setItem('counttemp', this.recordInsertCount);
                globalThis?.sessionStorage.setItem('syptombtn', false);
                globalThis?.sessionStorage.setItem('temprature', this.valOfTemp);
            }
        } catch (error) {
            this.handleError(error.body.message);
        }
    }


    handleError(error) {
        let globalThis = window;
        globalThis.location.href = label.ERROR_PAGE;
        globalThis.sessionStorage.setItem('errorMessage', error);
    }

    dispatchCustomEvent(eventName, detail) {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent(eventName, { detail });
            this.dispatchEvent(event);
        }
    }

    opensubmitModal() {
        this.submitModal = true;
    }

    closesubmitModal() {
        this.submitModal = false;
    }
}