define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(固定资产采购类)-拟单
        $stateProvider.state('directCommissionedAssetsPurchase', {
            url: '/directCommissionedAssetsPurchase',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedAssetsPurchaseApplicationWf',
            workflowScene: {
            	'Draft': {
            	    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApplication.html',
                	controller: 'directCommissionedAssetsPurchaseApplication_controller',
                	controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApplicationReadOnly.html',
                	controller: 'directCommissionedAssetsPurchaseApplicationReadOnly_controller',
                	controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApplicationReadOnly.html',
                	controller: 'directCommissionedAssetsPurchaseApplicationReadOnly_controller',
                	controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托(固定资产采购类)-审批
        $stateProvider.state('directCommissionedAssetsPurchaseApproval', {
            url: '/directCommissionedAssetsPurchaseApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedAssetsPurchaseApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApproval.html',
                    controller: 'directCommissionedAssetsPurchaseApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApproval.html',
                    controller: 'directCommissionedAssetsPurchaseApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApproval.html',
                    controller: 'directCommissionedAssetsPurchaseApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(固定资产采购类)-发起合同订立
        $stateProvider.state('directCommissionedAssetsPurchaseStartContract', {
            url: '/directCommissionedAssetsPurchaseStartContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedAssetsPurchaseStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContract.html',
                    controller: 'directCommissionedAssetsPurchaseStartContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly.html',
                    controller: 'directCommissionedAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/assetsPurchase/directCommissionedAssetsPurchaseStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});