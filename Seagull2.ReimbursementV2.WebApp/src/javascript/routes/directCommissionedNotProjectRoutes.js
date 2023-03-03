define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(非项目服务类)-拟单
        $stateProvider.state('directCommissionedNotProjectApplicationState', {
            url: '/directCommissionedNotProject',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedNotProjectApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApplication.html',
                    controller: 'directCommissionedNotProjectApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectReadOnly.html',
                    controller: 'directCommissionedNotProjectReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectReadOnly.html',
                    controller: 'directCommissionedNotProjectReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托(非项目服务类)-审批
        $stateProvider.state('directCommissionedNotProjectApprovalState', {
            url: '/directCommissionedNotProjectApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedNotProjectApproveWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApproval.html',
                    controller: 'directCommissionedNotProjectApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApprovalReadOnly.html',
                    controller: 'directCommissionedNotProjectApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApproval.html',
                    controller: 'directCommissionedNotProjectApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApprovalReadOnly.html',
                    controller: 'directCommissionedNotProjectApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApproval.html',
                    controller: 'directCommissionedNotProjectApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectApprovalReadOnly.html',
                    controller: 'directCommissionedNotProjectApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(非项目服务类)-发起合同订立
        $stateProvider.state('directCommissionedNotProjectStartContractState', {
            url: '/directCommissionedNotProjectStartContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedNotProjectStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectStartContract.html',
                    controller: 'directCommissionedNotProjectStartContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectStartContractReadOnly.html',
                    controller: 'directCommissionedNotProjectStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectStartContractReadOnly.html',
                    controller: 'directCommissionedNotProjectStartContractCirculation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectStartContractCirculation-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectStartContractReadOnly.html',
                    controller: 'directCommissionedNotProjectStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(非项目服务类)-发起订单生成
        $stateProvider.state('directCommissionedNotProjectGenerateOrderState', {
            url: '/directCommissionedNotProjectGenerateOrder',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedNotProjectGenerateOrderWf',
            workflowScene: {
                'GenerateOrder': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectGenerateOrder.html',
                    controller: 'directCommissionedNotProjectGenerateOrder_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectGenerateOrder-controller.js'
                },
                'GenerateOrderReadOnly': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectGenerateOrderReadOnly.html',
                    controller: 'directCommissionedNotProjectGenerateOrderReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectGenerateOrderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/notProject/directCommissionedNotProjectGenerateOrderReadOnly.html',
                    controller: 'directCommissionedNotProjectGenerateOrderReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/notProject/directCommissionedNotProjectGenerateOrderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});