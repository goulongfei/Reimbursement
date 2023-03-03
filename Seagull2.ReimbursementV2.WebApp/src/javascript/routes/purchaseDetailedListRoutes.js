define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //我的采购清单
        $stateProvider.state('purchaseDetailedListState', {
            url: '/purchaseDetailedList',
            controller: 'purchaseDetailedList_controller',
            controllerUrl: './javascript/controllers/purchaseDetailedList/purchaseDetailedList-controller.js',
            templateUrl: './views/purchaseDetailedList/purchaseDetails.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/costCenter']
        });
    }]);
});