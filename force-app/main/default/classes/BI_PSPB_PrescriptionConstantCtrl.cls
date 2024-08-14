public with sharing class BI_PSPB_PrescriptionConstantCtrl {
    public static String shareType = System.Label.BI_PSPB_ShareType;
	public static String errorForInsert = System.Label.BI_PSPB_InsertError;
    public static String recordTypeName = System.Label.BI_PSPB_PrescriptionRecordType;
	public static String errorForCase = System.Label.BI_PSPB_ErrorForCase;
	public static Id recordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Case', recordTypeName);
}