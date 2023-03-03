define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(项目定义服务类)-拟单
        $stateProvider.state('directCommissionedProjectDefine', {
        	url: '/directCommissionedProjectDefine',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedProjectDefineWf',
            workflowScene: {
            	'Draft': {
                	templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApplication.html',
                	controller: 'directCommissionedProjectDefineApplication_controller',
                	controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApplicationReadOnly.html',
                	controller: 'directCommissionedProjectDefineApplicationReadOnly_controller',
                	controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApplicationReadOnly.html',
                    controller: 'directCommissionedProjectDefineApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托(项目定义服务类)-审批
        $stateProvider.state('directCommissionedProjectDefineApproval', {
            url: '/directCommissionedProjectDefineApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedProjectDefineApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApproval.html',
                    controller: 'directCommissionedProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApprovalReadOnly.html',
                    controller: 'directCommissionedProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApproval.html',
                    controller: 'directCommissionedProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApprovalReadOnly.html',
                    controller: 'directCommissionedProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApproval.html',
                    controller: 'directCommissionedProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApproval-controller.js'
                },
                 'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApproval.html',
                    controller: 'directCommissionedProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineApprovalReadOnly.html',
                    controller: 'directCommissionedProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目定义服务类)-发起合同订立
        $stateProvider.state('directCommissionedProjectDefineStartContract', {
            url: '/directCommissionedProjectDefineStartContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedProjectDefineStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineStartContract.html',
                    controller: 'directCommissionedProjectDefineStartContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly.html',
                    controller: 'directCommissionedProjectDefineStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly.html',
                    controller: 'directCommissionedProjectDefineStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly.html',
                    controller: 'directCommissionedProjectDefineStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly.html',
                    controller: 'directCommissionedProjectDefineStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/projectDefine/directCommissionedProjectDefineStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});