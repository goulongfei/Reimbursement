define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //添加申请组织联系人
        $stateProvider.state('OrganizationContacts', {
            url: '/OrganizationContacts',
            controller: 'OrganizationContactController',
            controllerUrl: './javascript/controllers/OrganizationContact/OrganizationContactController.js',
            templateUrl: './views/OrganizationContact/OrganizationContacts.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});