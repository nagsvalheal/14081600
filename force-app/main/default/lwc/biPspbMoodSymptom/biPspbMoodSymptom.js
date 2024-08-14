// Import libraries
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// Import Apex classes
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import GET_ENROLLEE from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
// Import custom labels
import * as label from 'c/biPspbLabelAndResourceSymptom';

export default class BiPspbMoodSymptom extends NavigationMixin(LightningElement) {
    // Properties
    moodTrack =false;
    currentMoodError = false;
    boxedIcon = label.BOXED_ICON;
    valueOfTemperature;
    localStorageValueItchiness;
    lastSymptomId;
    emojiName = [];
    sliderValue = 0;
    currentMoodErrorSad = false;
    insertCount;
    itchinessValues = label.MOOD_IMG;
    allergyIntoleranceData;
    carePlanTemplateName;
    humanParts = '';
    wooriedMood = label.WORRIED_MOOD;
    speechLessMood = label.SPEECHLESS_MOOD;
    joyFullMood = label.JOYFULL_MOOD;
    happyMood = label.HAPPY_MOOD;
    sadMood = label.SAD_MOOD;
    alternateTextWorried = label.ALTERNATE_TEXT_WORRIED;
    alternateTextSad = label.ALTERNATE_TEXT_SAD;
    alternateTextSpeechless = label.ALTERNATE_TEXT_SPEECHLESS;
    alternateTextJoyful = label.ALTERNATE_TEXT_JOYFUL;
    alternateTextHappy = label.ALTERNATE_TEXT_HAPPY;
    alternateTextIcon = label.ALTERNATE_TEXT_ICON;
    extremeSadness = label.EXTREME_SADNESS;
    recordInsertCount = 0;
    accountId;
    userId = label.ID;
    selectedEmoji = null;
    imgUrlSad = label.WORRIED;
    imgUrlWorried = label.SAD;
    imgUrlSpeechless = label.SPEECHLESS;
    imgUrlJoyfull = label.JOYFULL;
    imgUrlHappy = label.HAPPY;
    isButtonDisabled = false;
    fatiqueErrors = false;
    moodInfo = label.MOOD_INFO;
    confirmAndSave = label.CONFIRM_SAVE;


    // Lifecycle hook
    connectedCallback() {
        this.loadInitialData();
    }

    loadInitialData() {
        try {
            this.initializeProperties();
            this.fetchEnrolleeData();
            this.loadMoodSymptom();
        } catch (error) {
            this.handleError(error.body.message);
        }
    }

    initializeProperties() {
        const globalThis = window;
        this.insertCount = globalThis?.sessionStorage.getItem('countmood');
        this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
        this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time');
        this.currentMoodError = true;
    }

    loadMoodSymptom() {
        const globalThis = window;
        const moodSymptom = globalThis?.sessionStorage.getItem('mood');

        if (moodSymptom) {
            this.fatiqueErrors = true;
        } else {
            this.moodDataRefreshData(this.lastSymptomId);
            this.fatiqueErrors = false;
        }

        this.updateImageUrlsBasedOnMood(moodSymptom);
        this.emojiName = moodSymptom;
    }

    updateImageUrlsBasedOnMood(moodSymptom) {
        switch (moodSymptom) {
            case label.SAD_MOOD:
                this.imgUrlSad = label.REPLACE_WORRIED;
                break;
            case label.HAPPY_MOOD:
                this.imgUrlHappy = label.REPLACE_HAPPY;
                break;
            case label.JOYFULL_MOOD:
                this.imgUrlJoyfull = label.REPLACE_JOYFUL;
                break;
            case label.SPEECHLESS_MOOD:
                this.imgUrlSpeechless = label.REPLACE_SPEECHLESS;
                break;
            case label.WORRIED_MOOD:
                this.imgUrlWorried = label.REPLACE_SAD;
                this.currentMoodErrorSad = true;
                break;
            default:

                break;
        }
    }


    fetchEnrolleeData() {
        GET_ENROLLEE()
        // Null data is checked and AuraHandledException is thrown from the Apex
        .then((result) => {
                if (result &&  result[0].Id !== null) {
                    this.accountId = result[0].Id;
                } 
            }).catch(error =>  this.handleError(error.body.message));
    }

    moodDataRefreshData(symptomLastId) {
        GET_ALLERGY_INTOLERANCE_DATA({ symptomTrackerId: symptomLastId })
            .then(data => {
                if (data) {
                    Promise.resolve().then(() => {
                        this.processMoodData(data);
                    });
                }
            })
            .catch(error =>  this.handleError(error.body.message));
    }

    processMoodData(data) {
        data.forEach(record => {
            const moodSymptom = record.BI_PSP_Mood__c;
            this.fatiqueErrors = true;
            const carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;

            if (carePlanTemplate === this.itchinessValues) {
                this.carePlanTemplateName = this.itchinessValues;
                this.updateImageUrlsBasedOnMood(moodSymptom);
                this.emojiName = moodSymptom;
            }
        });
    }

    handleEmojiClick(event) {
        const emojiName = event.currentTarget.getAttribute('data-name');
        this.fatiqueErrors = !!emojiName;
        this.emojiName = emojiName;
        this.isButtonDisabled = false;
        this.currentMoodError = this.currentMoodErrorSad = false;
        this.resetImageUrls();
        this.updateImageUrlsBasedOnMood(emojiName);
        this.selectedEmoji = emojiName;
    }

    resetImageUrls() {
        this.imgUrlHappy = label.HAPPY;
        this.imgUrlJoyfull = label.JOYFULL;
        this.imgUrlSpeechless = label.SPEECHLESS;
        this.imgUrlWorried = label.SAD;
        this.imgUrlSad = label.WORRIED;
    }

    onchangeAccept() {
        const globalThis = window;
        const itchinessAllRecord = {
            valueOfSlider: parseFloat(this.sliderValue),
            careProgramId: this.accountId,
            sliderValue: parseFloat(this.valueOfTemperature) || 0,
            symptomId: this.localStorageValueItchiness || this.lastSymptomId,
            symptomName: this.itchinessValues || '',
            moodvalues: this.emojiName || '',
        };
        this.partsOfBody = this.humanParts;

        const handleResult = (result) => {
            if (result) {
                this.updateSessionStorage();
                if (!this.lastSymptomId && this.recordInsertCount !== undefined) {
                    this.recordInsertCount++;
                    globalThis?.sessionStorage.setItem('countmood', this.recordInsertCount);
                }
            }
        };

        const handleError = (error) => {
            this.handleError(error.body.message);
        }

        // Perform the record operation based on insertCount
        this.performRecordOperation(itchinessAllRecord, handleResult, handleError);
    }
    performRecordOperation (itchinessAllRecord, handleResult, handleError){
        if (this.insertCount === '1') {
            RECORD_UPDATE_ALLERGY_INTOLERANCE({
                itchinessallrecordupdate: itchinessAllRecord,
                bodyParts: this.partsOfBody
            })
                .then(handleResult)
                .catch(handleError);
        } else {
            this.handleAlternativeCase(itchinessAllRecord, handleResult, handleError);
        }
    }

    handleAlternativeCase(itchinessAllRecord, handleResult, handleError) {
        this.moodTrack=true;
        if (this.lastSymptomId) {   
            RECORD_UPDATE_ALLERGY_INTOLERANCE({
                itchinessallrecordupdate: itchinessAllRecord,
                bodyParts: this.humanParts
            })
                .then(handleResult)
                .catch(handleError);
        } else {
            RECORD_INSERT_ALLERGY_INTOLERANCE({
                itchinessallrecordinsert: itchinessAllRecord,
                bodyParts: this.humanParts
            })
                .then(handleResult)
                .catch(handleError);
        }
    }

    updateSessionStorage() {
        const globalThis = window;
        globalThis?.sessionStorage.setItem('mood', this.emojiName);
        globalThis?.sessionStorage.setItem('syptombtn', false);
        if (typeof window !== 'undefined') {
            this.dispatchEvent(new CustomEvent('updatechildprop', { detail: false }));
            this.dispatchEvent(new CustomEvent('addtask', { detail: label.MOOD_IMG }));
        }
    }

}