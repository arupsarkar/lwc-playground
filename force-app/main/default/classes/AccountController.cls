public with sharing class AccountController {
    public AccountController() {
        System.debug(LoggingLevel.DEBUG, 'Account Controller - Start');
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name, Phone, Website 
                    FROM Account 
                    LIMIT 10];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> findAccounts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [SELECT Id, Name, Phone, Website 
                    FROM Account
                    WHERE Name LIKE :key 
                    LIMIT 10];
    }
}
