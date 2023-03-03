define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(营销类)-拟单
        $stateProvider.state('directCommissionedMarketingDraftState', {
            url: '/directCommissionedMarketingDraft',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedMarketingDraftWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingDraft.html',
                    controller: 'directCommissionedMarketingDraft_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingDraftReadOnly.html',
                    controller: 'directCommissionedMarketingDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingDraftReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingDraftReadOnly.html',
                    controller: 'directCommissionedMarketingDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingDraftReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 直接委托(营销类)-审批
        $stateProvider.state('directCommissionedMarketingApprovalState', {
            url: '/directCommissionedMarketingApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedMarketingApproveWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingApproval.html',
                    controller: 'directCommissionedMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(营销类)-发起合同订立
        $stateProvider.state('directCommissionedMarketingStartContractState', {
            url: '/directCommissionedMarketingStartContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedMarketingStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingStartContract.html',
                    controller: 'directCommissionedMarketingStartContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly.html',
                    controller: 'directCommissionedMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly.html',
                    controller: 'directCommissionedMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly.html',
                    controller: 'directCommissionedMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly.html',
                    controller: 'directCommissionedMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly.html',
                    controller: 'directCommissionedMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/marketing/directCommissionedMarketingStartContractReadOnly-controller.js'
                }

            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});