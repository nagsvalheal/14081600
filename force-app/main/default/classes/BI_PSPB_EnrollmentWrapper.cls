/** 
 *@description  Wrapper classes are used to hold a group of related data fields together.
 * History:
 * Version  Author          Date            Detail              Description
 * 1.0      Ashif           20-07-2024     Created             Initial development

 */
public without sharing class BI_PSPB_EnrollmentWrapper {
    /**
     * @description  Wrapper classes are used to hold a group of related data fields together.
     *               Used to createLead, caregiverCreate, hcpCreate, consentCreate, createCaregiverRecord.
     */
    public class DataWrapper {
        /** 
         * @description The new first name of the patient or caregiver.
         */
        @AuraEnabled
        public String firstName { get; set; }

        /** 
         * @description The new last name of the patient or caregiver.
         */
        @AuraEnabled
        public String lastName { get; set; }

        /** 
         * @description The new email address of the patient or caregiver.
         */
        @AuraEnabled
        public String email { get; set; }

        /** 
         * @description The new phone number of the patient or caregiver.
         */
        @AuraEnabled
        public String phone { get; set; }


        /** 
         * @description The new city of the patient or caregiver.
         */
        @AuraEnabled
        public String city { get; set; }

        /** 
         * @description The new street address of the patient or caregiver.
         */
        @AuraEnabled
        public String street { get; set; }

        /** 
         * @description The new country of the patient or caregiver.
         */
        @AuraEnabled
        public String country { get; set; }

        /** 
         * @description The new state of the patient or caregiver.
         */
        @AuraEnabled
        public String state { get; set; }

        /** 
         * @description The new postal code of the patient or caregiver.
         */
        @AuraEnabled
        public String code { get; set; }

        /** 
         * @description The new gender of the patient or caregiver.
         */
        @AuraEnabled
        public String sex { get; set; }

        /** 
         * @description The new birthdate of the patient or caregiver.
         */
        @AuraEnabled
        public String dob { get; set; }

        /** 
         * @description The new relation to the patient.
         */
        @AuraEnabled
        public String relation { get; set; }

       
       
        /** 
         * @description This ID is used to query the caregiver record.
         */
        @AuraEnabled
        public String caregiverId { get; set; }

        /** 
         * @description The new preferred method of communication.
         */
        @AuraEnabled
        public String prefferedMethodOfCom { get; set; }

      
    }
/**
     * @description  Wrapper classes are used to hold a group of related data fields together.
     *               Used to  hcpCreate, prescriptionCreate.
     */
    public class HcpWrapper {
          /** 
         * @description The new address line of the patient or caregiver.
         */
        @AuraEnabled
        public String addressLine { get; set; }

         /** 
         * @description The new license for the practitioner.
         */
        @AuraEnabled
        public String lisence { get; set; }

         /** 
         * @description The new frequency of the drug selected by the healthcare provider.
         */
        @AuraEnabled
        public Integer frequency { get; set; }

         /** 
         * @description The new drug selected by the healthcare provider.
         */
        @AuraEnabled
        public String drug { get; set; }

        /** 
         * @description The new unit of the drug selected by the healthcare provider.
         */
        @AuraEnabled
        public String unit { get; set; }

         /** 
         * @description The new practice for the practitioner.
         */
        @AuraEnabled
        public String practice { get; set; }

        /** 
         * @description The new type of practice.
         */
        @AuraEnabled
        public String type { get; set; }

        /** 
         * @description The new refill of practice.
         */
        @AuraEnabled
        public Integer refill { get; set; }
        
        /** 
         * @description The new quantity of practice.
         */
        @AuraEnabled
        public Integer quantity { get; set; }



    }
}