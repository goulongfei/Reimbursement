define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/";

        // 无合同采购-(非开发运营类) 拟单
        $stateProvider.state('businessOperationsApplication', {
            url: '/businessOperationsApplication',
            useWorkflow: true,
            workflowUrlBase: '/BusinessOperationsApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsApplication.html',
                    controller: 'businessOperationsApplication_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsApplicationReadOnly.html',
                    controller: 'businessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsApplicationReadOnly-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsApplicationReadOnly.html',
                    controller: 'businessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 无合同采购-(非开发运营类)  审批
        $stateProvider.state('businessOperationsApproval', {
            url: '/businessOperationsApproval',
            useWorkflow: true,
            workflowUrlBase: '/BusinessOperationsApprovalWf',
            workflowScene: {
                'Approval': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsApproval.html',
                    controller: 'businessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsApprovalReadOnly.html',
                    controller: 'businessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsApproval.html',
                    controller: 'businessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsApproval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 无合同采购-(非开发运营类) 发起支付申请
        $stateProvider.state('businessOperationsChargeApplication', {
            url: '/businessOperationsChargeApplication', 
            useWorkflow: true,
            workflowUrlBase: '/BusinessOperationsChargeApplicationWf',
            workflowScene: {
                'StartChargeApplication': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsChargeApplication.html',
                    controller: 'businessOperationsChargeApplication_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsChargeApplication-controller.js'
                },
                'StartChargeApplicationReadOnly': {
                    templateUrl: './views/nonContractPurchaseBusinessOperations/businessOperationsChargeApplicationReadOnly.html',
                    controller: 'businessOperationsChargeApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseBusinessOperations/businessOperationsChargeApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});