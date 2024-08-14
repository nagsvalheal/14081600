import { LightningElement, api } from 'lwc';
import TIC from '@salesforce/resourceUrl/BI_PSP_ToastTickIcon';

export default class BiPspbCommonPopup extends LightningElement {
    rightImg = TIC;
    showToast = true;
    @api toastMessage;
    
    handleClick() {
        // Create and dispatch a custom event
        const event = new CustomEvent('buttonclick', {
            detail: { message: 'Button was clicked!' }
        });
        this.dispatchEvent(event);
    }
}