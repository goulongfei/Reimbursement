define(['app'],function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/";

        // 调整采购时间-拟单
        $stateProvider.state('modifyPurchaseTimeState', {
            url: '/modifyPurchaseTime',
            useWorkflow: true,
            workflowUrlBase: '/ModifyPurchaseTimeWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/modifyPurchaseTime/modifyPurchaseTime.html',
                    controller: 'modifyPurchaseTime_controller',
                    controllerUrl: './javascript/controllers/modifyPurchaseTime/modifyPurchaseTime-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/modifyPurchaseTime/modifyPurchaseTimeReadOnly.html',
                    controller: 'modifyPurchaseTimeReadOnly_controller',
                    controllerUrl: './javascript/controllers/modifyPurchaseTime/modifyPurchaseTimeReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 调整采购时间-审批
        $stateProvider.state('modifyPurchaseTimeApprovalState', {
            url: '/modifyPurchaseTimeApproval',
            useWorkflow: true,
            workflowUrlBase: '/ModifyPurchaseTimeApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/modifyPurchaseTime/modifyPurchaseTimeApproval.html',
                    controller: 'modifyPurchaseTimeApproval_controller',
                    controllerUrl: './javascript/controllers/modifyPurchaseTime/modifyPurchaseTimeApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/modifyPurchaseTime/modifyPurchaseTimeApprovalReadOnly.html',
                    controller: 'modifyPurchaseTimeApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/modifyPurchaseTime/modifyPurchaseTimeApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/modifyPurchaseTime/modifyPurchaseTimeApproval.html',
                    controller: 'modifyPurchaseTimeApproval_controller',
                    controllerUrl: './javascript/controllers/modifyPurchaseTime/modifyPurchaseTimeApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});