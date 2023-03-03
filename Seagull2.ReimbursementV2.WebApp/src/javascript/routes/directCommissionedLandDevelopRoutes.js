define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(土地开发类)-拟单
        $stateProvider.state('directCommissionedLandDevelopApplicationState', {
            url: '/directCommissionedLandDevelop',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedLandDevelopApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApplication.html',
                    controller: 'directCommissionedLandDevelopApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopReadOnly.html',
                    controller: 'directCommissionedLandDevelopReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopReadOnly.html',
                    controller: 'directCommissionedLandDevelopReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托(土地开发类)-审批
        $stateProvider.state('directCommissionedLandDevelopApprovalState', {
            url: '/directCommissionedLandDevelopApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedLandDevelopApproveWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApproval.html',
                    controller: 'directCommissionedLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApprovalReadOnly.html',
                    controller: 'directCommissionedLandDevelopApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApproval.html',
                    controller: 'directCommissionedLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApprovalReadOnly.html',
                    controller: 'directCommissionedLandDevelopApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApproval.html',
                    controller: 'directCommissionedLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopApprovalReadOnly.html',
                    controller: 'directCommissionedLandDevelopApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(土地开发类)-发起合同订立
        $stateProvider.state('directCommissionedLandDevelopStartContractState', {
            url: '/directCommissionedLandDevelopStartContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedLandDevelopStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContract.html',
                    controller: 'directCommissionedLandDevelopStartContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly.html',
                    controller: 'directCommissionedLandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly.html',
                    controller: 'directCommissionedLandDevelopStartContractCirculation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractCirculation-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly.html',
                    controller: 'directCommissionedLandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly.html',
                    controller: 'directCommissionedLandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly.html',
                    controller: 'directCommissionedLandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly.html',
                    controller: 'directCommissionedLandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/landDevelop/directCommissionedLandDevelopStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});