define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(非开发运营类)-拟单
        $stateProvider.state('directCommissionedBusinessOperationsApplicationState', {
            url: '/directCommissionedBusinessOperationsApplication',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedBusinessOperationsApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApplication.html',
                    controller: 'directCommissionedBusinessOperationsApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApplicationReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApplicationReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托(非开发运营类)-审批
        $stateProvider.state('directCommissionedBusinessOperationsApprovalState', {
            url: '/directCommissionedBusinessOperationsApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedBusinessOperationsApproveWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApproval.html',
                    controller: 'directCommissionedBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApprovalReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApproval.html',
                    controller: 'directCommissionedBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApprovalReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApproval.html',
                    controller: 'directCommissionedBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsApprovalReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(非开发运营类)-发起合同订立
        $stateProvider.state('directCommissionedBusinessOperationsStartContractState', {
            url: '/directCommissionedBusinessOperationsStartContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedBusinessOperationsStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContract.html',
                    controller: 'directCommissionedBusinessOperationsStartContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsStartContractCirculation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly.html',
                    controller: 'directCommissionedBusinessOperationsStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/businessOperations/directCommissionedBusinessOperationsStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});