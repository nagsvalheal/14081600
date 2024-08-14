public with sharing class BI_PSPB_NotificationContext {
    public String category;
    public String notificationType;
    public String chatterType;
    public List<String> communityUserName;
    public List<Id> recordId;

    public BI_PSPB_NotificationContext(String category, String notificationType, String chatterType, List<String> communityUserName, List<Id> recordId) {
        this.category = category;
        this.notificationType = notificationType;
        this.chatterType = chatterType;
        this.communityUserName = communityUserName;
        this.recordId = recordId;
    }
}