define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //直接委托战略采购前置页
        $stateProvider.state('strategyCommissionedFont', {
            url: '/strategyCommissionedFont',
            controller: 'strategyCommissionedFontController',
            controllerUrl: './javascript/controllers/frontPage/strategyCommissionedFontController.js',
            templateUrl: './views/frontPage/strategyCommissionedFont.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托前置页
        $stateProvider.state('directCommissionedFront', {
            url: '/directCommissionedFront',
            controller: 'directCommissionedFrontController',
            controllerUrl: './javascript/controllers/frontPage/directCommissionedFrontController.js',
            templateUrl: './views/frontPage/directCommissionedFront.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标前置页
        $stateProvider.state('biddingFront', {
            url: '/biddingFront',
            controller: 'biddingFrontController',
            controllerUrl: './javascript/controllers/frontPage/biddingFrontController.js',
            templateUrl: './views/frontPage/biddingFront.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标前置页-配到流程中心版
        $stateProvider.state('biddingFrontOaportal', {
            url: '/biddingFrontOaportal',
            controller: 'biddingFrontController',
            controllerUrl: './javascript/controllers/frontPage/biddingFrontController.js',
            templateUrl: './views/frontPage/biddingFrontOaportal.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 战略采购前置页-配到流程中心版
        $stateProvider.state('strategyPurchaseFontOaportal', {
            url: '/strategyPurchaseFontOaportal',
            controller: 'strategyCommissionedFontController',
            controllerUrl: './javascript/controllers/frontPage/strategyCommissionedFontController.js',
            templateUrl: './views/frontPage/strategyPurchaseFontOaportal.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 采购计划前置页
        $stateProvider.state('purchasePlanFront', {
            url: '/purchasePlanFront',
            controller: 'purchasePlanFrontController',
            controllerUrl: './javascript/controllers/frontPage/purchasePlanFrontController.js',
            templateUrl: './views/frontPage/purchasePlanFront.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 采购门户前置页
        //$stateProvider.state('purchaseDetails', {
        //    url: '/purchaseDetails',
        //    controller: 'purchaseDetailsController',
        //    controllerUrl: './javascript/controllers/frontPage/purchaseDetailsController.js',
        //    templateUrl: './views/frontPage/purchaseDetails.html',
        //    requiredLogin: true,
        //    dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/costCenter']
        //});
        $stateProvider.state('purchaseDetails', {
            url: '/purchaseDetails',
            controller: 'purchaseDetailedList_controller',
            controllerUrl: './javascript/controllers/purchaseDetailedList/purchaseDetailedList-controller.js',
            templateUrl: './views/purchaseDetailedList/purchaseDetails.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/costCenter']
        });
        // 询价前置页-配到流程中心版
        $stateProvider.state('enquiryFront', {
            url: '/enquiryFront',
            controller: 'enquiryFrontController',
            controllerUrl: './javascript/controllers/frontPage/enquiryFrontController.js',
            templateUrl: './views/frontPage/enquiryFront.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标前置页-配到流程中心版
        $stateProvider.state('enquiryFrontOaportal', {
            url: '/enquiryFrontOaportal',
            controller: 'enquiryFrontController',
            controllerUrl: './javascript/controllers/frontPage/enquiryFrontController.js',
            templateUrl: './views/frontPage/enquiryFrontOaportal.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 跳转广联达页面
        $stateProvider.state('glodonHome', {
            url: '/glodonHome',
            controller: 'glodonHomeController',
            controllerUrl: './javascript/controllers/frontPage/glodonHomeController.js',
            templateUrl: './views/frontPage/glodonHome.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});