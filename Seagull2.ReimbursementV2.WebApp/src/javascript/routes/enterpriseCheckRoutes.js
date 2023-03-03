define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";
 
        $stateProvider.state('prepare', {
            url: '/prepare',
            controller: 'prepare_controller',
            controllerUrl: './javascript/controllers/enterpriseCheck/prepare-controller.js',
            templateUrl: './views/enterpriseCheck/prepare.html',
            requiredLogin: true
            //dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        $stateProvider.state('associationMining', {
            url: '/associationMining/:companyNames',
            controller: 'associationMining_controller',
            controllerUrl: './javascript/controllers/enterpriseCheck/associationMining-controller.js',
            templateUrl: './views/enterpriseCheck/associationMining.html',
            requiredLogin: true
            //dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        $stateProvider.state('legalAssociation', {
            url: '/legalAssociation/:companyNames',
            controller: 'legalAssociation_controller',
            controllerUrl: './javascript/controllers/enterpriseCheck/legalAssociation-controller.js',
            templateUrl: './views/enterpriseCheck/legalAssociation.html',
            requiredLogin: true
            //dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });


        $stateProvider.state('monitoringReportDetail', {
            url: '/monitoringReportDetail/:companyNames',
            controller: 'monitoringReportDetail_controller',
            controllerUrl: './javascript/controllers/enterpriseCheck/monitoringReportDetail-controller.js',
            templateUrl: './views/enterpriseCheck/monitoringReportDetail.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        $stateProvider.state('personalCenter', {
            url: '/personalCenter',
            controller: 'personal_center_controller',
            controllerUrl: './javascript/controllers/enterpriseCheck/personal-center-controller.js',
            templateUrl: './views/enterpriseCheck/personal-center.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});