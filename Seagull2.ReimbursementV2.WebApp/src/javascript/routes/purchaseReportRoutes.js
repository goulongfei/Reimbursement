define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 采购报表查看
        $stateProvider.state('purchaseReportViewState', {
            url: '/purchaseReportView',
            templateUrl: './views/viewPage/purchaseReportView.html',
            controller: 'purchaseReportViewController',
            controllerUrl: './javascript/controllers/viewPage/purchaseReportView.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        //采购单据查看页面
        $stateProvider.state('purchaseDataViewState', {
            url: '/purchaseDataView',
            templateUrl: './views/viewPage/purchaseDataView.html',
            controller: 'purchaseDataView_controller',
            controllerUrl: './javascript/controllers/viewPage/purchaseDataView-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        //动态周报-采购列表
        $stateProvider.state('purchaseDynamicReportView', {
            url: '/purchaseDynamicReportView',
            templateUrl: './views/viewPage/purchaseDynamicReportView.html',
            controller: 'purchaseDynamicReportView_controller',
            controllerUrl: './javascript/controllers/viewPage/purchaseDynamicReportView-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        //项目采购计划上报跟踪表
        $stateProvider.state('purchasePlanReport', {
            url: '/purchasePlanReport',
            templateUrl: './views/purchasePlan/purchasePlanReport.html',
            controller: 'purchasePlanReport_controller',
            controllerUrl: './javascript/controllers/purchasePlan/purchasePlanReport-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});