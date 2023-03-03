define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //添加推广项目
        $stateProvider.state('JdMallUsers', {
            url: '/JdMallUsers',
            controller: 'JdMallUsersController',
            controllerUrl: './javascript/controllers/JdMallUser/JdMallUsersController.js',
            templateUrl: './views/JdMallUser/JdMallUsers.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        //添加供应商回标IP信息
        $stateProvider.state('SupplierReplyBiddingReport', {
            url: '/SupplierReplyBiddingReport',
            controller: 'supplierReplyBiddingReportController',
            controllerUrl: './javascript/controllers/supplierReplyBiddingReport/supplierReplyBiddingReportController.js',
            templateUrl: './views/supplierReplyBiddingReport/SupplierReplyBiddingReport.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});