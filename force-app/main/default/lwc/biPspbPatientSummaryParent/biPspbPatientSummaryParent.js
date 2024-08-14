//*********************************************************
// Lighting Web Component Name    : BiPspbPatientSummaryCmp
// Created Date       :  20.12.2023,
// @description       : This LWC is used for create Patient enrollment summary thank you message form main CMP component.
// @author            : Niyas
// Modification Log:
// Ver   Date         Author                               Modification
// 59   06-01-2024   Niyas                                Initial Version
// *********************************************************
import { LightningElement } from "lwc";
import { resource } from "c/biPspbEnrollmentFormResource";



export default class BiPspbPatientSummaryParent extends LightningElement {
    congratulation = resource.CONGRATULATION;
    beyandGpp = resource.BGPP;
    footerSrc = resource.BIFOOTER_LOGO_JPEG_URL;
    logoSrc = resource.SPEVIGO_LOGO_JPEG_URL;
    selectedAvatarSrc = resource.OLD_GUY_JPEG_URL;
}