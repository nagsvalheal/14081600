/**
 * @description  This class facilitates the retrieval of data from the Content Management System (CMS) 
   to display articles for the Information Center. Additionally, it provides functionality to retrieve 
   the like response for articles for the current user.
 * History:
 * Version	Author			Date			Detail				Description
 * 1.0		Gokul Krishnan	05-Nov-2023		Created				Initial development
 * 1.1		Gokul Krishnan 	05-Feb-2024		Updated				Updated the patient status retrieve
 * 1.2		Gokul Krishnan	04-Apr-2024		Updated				Catch log added
 * 1.3 		Gokul Krishnan  02-May-2024		Developed			developed article like response retrieve and 
																update
 */

 public with sharing class BI_PSPB_CmsCtrl {
	/**
	 * @description This method retrieves news content for a given channelName within a specified time range.
	 *              Returns in LWC biPspbarticlecontentpage.
	 * @param       articleName - The name of the channel for which news content is to be retrieved.
	 * @return      String - JSON serialized list of news data.
	 */
	@AuraEnabled(cacheable=true)
	public static String retrieveNewsFromCMS(String articleName) {
		List<ReturnWrapper> wrapperList = new List<ReturnWrapper>();
		try {
			// Validate inputs
			String channelId = getChannelId(
				BI_PSPB_InfoCenterConstantCtrl.channelName
			);
			if (String.isBlank(channelId) || String.isBlank(articleName)) {
				throw new AuraHandledException(
					BI_PSPB_InfoCenterConstantCtrl.articleParameterError
				);
			}

			// Define date range
			DateTime startDate = DateTime.newInstance(2023, 2, 2, 17, 0, 0);
			String formattedStartDate = startDate.formatGMT(
				BI_PSPB_InfoCenterConstantCtrl.dateFormat
			);
			DateTime endDate = DateTime.now();
			String formattedEndDate = endDate.formatGMT(
				BI_PSPB_InfoCenterConstantCtrl.dateFormat
			);

			// Get the news content
			ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getAllContent(
				channelId,
				0,
				100,
				BI_PSPB_InfoCenterConstantCtrl.usEnglish,
				BI_PSPB_InfoCenterConstantCtrl.cmsNews,
				false,
				formattedStartDate,
				formattedEndDate,
				true
			);

			// Process each content version
			for (
				ConnectApi.ManagedContentVersion contentVersion : contentCollection.items
			) {
				if (contentVersion.title == articleName) {
					wrapperList.add(processContentVersion(contentVersion));
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_InfoCenterConstantCtrl.errorCmsNewsRetrieve,
				BI_PSPB_CmsCtrl.class.toString(),
				ex
			);
		}
		return JSON.serialize(wrapperList);
	}

	/**
	 * @description Processes a single ManagedContentVersion and returns a ReturnWrapper instance.
	 * @param       contentVersion - The ManagedContentVersion to process.
	 * @return      ReturnWrapper - The processed content wrapped in a ReturnWrapper.
	 */
	private static ReturnWrapper processContentVersion(
		ConnectApi.ManagedContentVersion contentVersion
	) {
		ReturnWrapper wrapper = new ReturnWrapper();
		wrapper.title = contentVersion.title;

		Map<String, ConnectApi.ManagedContentNodeValue> contentNodesMap = contentVersion.contentNodes;

		for (String nodeKey : contentNodesMap.keySet()) {
			if (nodeKey == 'body') {
				ConnectApi.ManagedContentNodeValue bodyNode = contentNodesMap.get(
					nodeKey
				);
				wrapper.body = String.valueOf(bodyNode);
			} else if (nodeKey == 'source') {
				wrapper.url = ((ConnectApi.ManagedContentMediaSourceNodeValue) contentNodesMap.get(
						nodeKey
					))
					.url;
			}
		}

		return wrapper;
	}

	/**
	@description     This method retrieves the unique identifier (channelId) for a given channelName.
					 return in apex  BI_PSPB_CmsCtrl method retrieveMediaUrlFromCMS, retrieveNewsFromCMS
	@param           channelName - The name of the channel for which the channelId is to be retrieved.
	@return          String - The unique identifier (channelId) of the specified channelName.
	*/
	private static String getChannelId(String channelName) {
		String channelId;
		try {
			if (String.isBlank(channelName)) {
				throw new AuraHandledException(
					BI_PSPB_InfoCenterConstantCtrl.errorCmsChannelIdRetrieve
				);
			}
			ConnectApi.ManagedContentChannelCollection channelRepObj = ConnectApi.ManagedContent.getAllDeliveryChannels(
				0,
				10
			);

			//loop through the channels and return the channel Id
			for (
				ConnectApi.ManagedContentChannel channelObj : channelRepObj.channels
			) {
				if (channelObj.channelName == channelName) {
					channelId = channelObj.channelId;
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_InfoCenterConstantCtrl.errorCmsChannelIdRetrieve,
				BI_PSPB_CmsCtrl.class.toString(),
				ex
			);

			// Error throw in apex methods retrieveNewsFromCMS, retrieveMediaFromCMS, retrieveMediaFromCMSNews
		}
		return channelId;
	}

	/**
	@description     Retrieves news content including title, subtitle, and image URL for a given channelName within a specified time range.
					 return in lwc biPspbArticlesForDashboard, biPspbcategoryarticlecmp, biPspbInformationcenterlanding,
					 biPspbrecentarticles, biPspbsearcharticlecmp
	@param           channelName - The name of the channel for which news content is to be retrieved.
	@return          String - JSON serialized list of news data including title, subtitle, and image URL.
	*/
	@AuraEnabled(cacheable=true)
	public static String retrieveMediaFromCMSNews(String channelName) {
		List<ReturnWrapper> wrapperList = new List<ReturnWrapper>();
		try {
			String channelId = getChannelId(channelName);

			if (String.isBlank(channelId)) {
				throw new AuraHandledException(
					BI_PSPB_InfoCenterConstantCtrl.errorCmsChannelIdRetrieve
				);
			}

			//get the image content
			DateTime startDate = DateTime.newInstance(2023, 10, 2, 17, 0, 0);
			String formattedStartDate = startDate.formatGMT(
				BI_PSPB_InfoCenterConstantCtrl.dateFormat
			);

			DateTime endDate = DateTime.now();
			String formattedEndDate = endDate.formatGMT(
				BI_PSPB_InfoCenterConstantCtrl.dateFormat
			);
			ConnectApi.ManagedContentVersionCollection obj = ConnectApi.ManagedContent.getAllContent(
				channelId,
				0,
				100,
				BI_PSPB_InfoCenterConstantCtrl.usEnglish,
				BI_PSPB_InfoCenterConstantCtrl.cmsNews,
				true,
				formattedStartDate,
				formattedEndDate,
				true
			);

			//loop through each item and prepare a wrapper list
			for (ConnectApi.ManagedContentVersion versionObj : obj.items) {
				ReturnWrapper wrapper = new ReturnWrapper();
				wrapper.title = versionObj.title;
				ConnectApi.ManagedContentNodeValue contentNode = versionObj.contentNodes.get(
					'excerpt'
				);
				ConnectApi.ManagedContentNodeValue bannerimage = versionObj.contentNodes.get(
					'bannerImage'
				);

				String subst = String.valueOf(contentNode);
				if (!String.isBlank(subst)) {
					String subTitle = subst.substring(88, subst.length() - 1);
					wrapper.subtitle = subTitle;
				} else {
					wrapper.subtitle = subst;
				}
				String imgurl = String.valueOf(bannerimage);
				if (!String.isBlank(imgurl)) {
					String imageUrl = imgurl.substring(
						imgurl.indexOf('url') + 4,
						imgurl.length() - 1
					);

					wrapper.url = imageUrl;
				} else {
					wrapper.url = String.valueOf(bannerimage);
				}

				wrapperList.add(wrapper);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_InfoCenterConstantCtrl.errorCmsNewsImageRetrieve,
				BI_PSPB_CmsCtrl.class.toString(),
				ex
			);
		}
		return JSON.serialize(wrapperList);
	}

	/**
	 * @description Wrapper class representing news content including title, subtitle, and image URL
	 *              for a given channelName within a specified time range.
	 */
	public class ReturnWrapper {
		/**
		 * @description Title of the CMS news or image.
		 */
		public String title { get; set; }

		/**
		 * @description URL of the CMS image.
		 */
		public String url { get; set; }

		/**
		 * @description Subtitle of the CMS news.
		 */
		public String subtitle { get; set; }

		/**
		 * @description Body content of the CMS news.
		 */
		public String body { get; set; }
	}
}