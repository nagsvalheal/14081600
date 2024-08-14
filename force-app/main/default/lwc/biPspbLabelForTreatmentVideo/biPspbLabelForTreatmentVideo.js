import { LightningElement } from 'lwc';
import FLARE_TREATMENT_HEADING from '@salesforce/label/c.BI_PSPB_FlareTreatmentHeading';
import TRANSCRIPT from '@salesforce/label/c.BI_PSP_Transcript';
import DISCLAIMER from '@salesforce/label/c.BI_PSP_Disclaimer';
import DISCLAIMERMESSAGE from '@salesforce/label/c.BI_PSPB_DisclaimerMessage';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';
import MESSAGE_DESK from '@salesforce/label/c.BI_PSPB_AcuteDeskMessage';
import MESSAGE_MOB from '@salesforce/label/c.BI_PSPB_AcuteMobMessage';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import LANDING_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import ACUTE_VIDEO_PAGE from '@salesforce/label/c.BI_PSPB_AcuteVideoPage';

import CHRONIC_VIDEO_HEADING from '@salesforce/label/c.BI_PSPB_FlarePreventionHeadingChronic';
import DISCLAIMER_MESSAGE_CHRONIC from '@salesforce/label/c.BI_PSPB_DisclaimerMessageChronic';
import CHRONIC_MOB_MESSAGE from "@salesforce/label/c.BI_PSPB_ChronicMobMessage";
import CHRONIC_DESK_MESSAGE from "@salesforce/label/c.BI_PSPB_ChronicDeskMessage";
import TREATMENT_VIDEO_AVATAR_HEADING from "@salesforce/label/c.BI_PSP_TreatmentVideoAvatarHeading";
import VIDEO_AVATAR_MESSAGE_CHRONIC from "@salesforce/label/c.BI_PSPB_VideoAvatarMessageChronic";
export const LABELS = {
    CHRONIC_MOB_MESSAGE,
    CHRONIC_DESK_MESSAGE,
    TREATMENT_VIDEO_AVATAR_HEADING,
    VIDEO_AVATAR_MESSAGE_CHRONIC,
    DISCLAIMER_MESSAGE_CHRONIC,
    CHRONIC_VIDEO_HEADING,
    FLARE_TREATMENT_HEADING,
    TRANSCRIPT,
    DISCLAIMER,
    DISCLAIMERMESSAGE,
    ERROR_PAGE,
    MESSAGE_DESK,
    MESSAGE_MOB,
    BRANDED_URL,
    UNASSIGNED_URL,
    BRANDED_SITE_URL,
    UNASSIGNED_SITE_URL,
    LANDING_PAGE,
    ACUTE_VIDEO_PAGE
}
export default class BiPspbLabelForTreatmentVideo extends LightningElement {}