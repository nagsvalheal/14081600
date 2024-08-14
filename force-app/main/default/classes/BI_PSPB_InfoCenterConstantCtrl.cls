/**
 * @description This class serves as a centralized repository for custom labels used across the InfoCenter module.
 * It provides easy access to various labels such as language locale keys, CMS news types, reactions, and error messages.
 * History:
 * Version	Author			Date			Detail				Description
 * 1.0		Gokul Krishnan	10-Jul-2024		Created				Common custom label added
 */
public with sharing class BI_PSPB_InfoCenterConstantCtrl {
	// Custom label for english language
	public static string usEnglish = System.Label.BI_PSPB_LanguageLocaleKey;
	public static string dateFormat =System.Label.BI_PSP_CmsDateFormat;
	// Custom label for cms news type
	public static string cmsNews = System.Label.BI_PSP_CmsNews;
	// Custom label for Like and Dislike reaction
	public static String channelName = System.Label.BI_PSP_ChannelName;
	// Custom label for error messages
	public static string errorCmsNewsRetrieve = System.Label.BI_PSP_ErrorCmsNewsRetrieve;
	public static string errorCmsChannelIdRetrieve = System.Label.BI_PSP_ErrorCmsChannelIdRetrieve;
	public static string errorCmsNewsImageRetrieve = System.Label.BI_PSP_ErrorCmsNewsImageRetrieve;
	public static string articleParameterError = System.Label.BI_PSPB_ArticleParameterError;
	// Custom label for Article Like
	public static String errorInsertLabel = System.Label.BI_PSPB_InsertError;
	public static String errorRetrieveLike = System.Label.BI_PSPB_ErrorRetrieveArticleLike;
	public static String errorLikeLabel = System.Label.BI_PSP_Like;
	public static String errorDislikeLabel = System.Label.BI_PSP_Dislike;
	public static String viewLabel = System.Label.BI_PSPB_View;
	// Custom label for Treatment Video
	public static String errorTreatmentVideoRetrieve = System.Label.BI_PSP_TreatmentVideoRetrieveError;
	public static String unassignedStatus = System.Label.BI_PSP_Unassigned;

}