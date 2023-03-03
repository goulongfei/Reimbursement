define(['app'],function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/";

        // 采购作废-前置页
        $stateProvider.state('purchaseAbortFront', {
            url: '/purchaseAbortFront',
            controller: 'purchaseAbortFront_controller',
            controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortFront-controller.js',
            templateUrl: './views/purchaseAbort/purchaseAbortFront.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 采购作废-拟单
        $stateProvider.state('purchaseAbortDraft', {
            url: '/purchaseAbortDraft',
            useWorkflow: true,
            workflowUrlBase: '/purchaseAbortDraftWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/purchaseAbort/purchaseAbortDraft.html',
                    controller: 'purchaseAbortDraft_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/purchaseAbort/purchaseAbortDraftReadOnly.html',
                    controller: 'purchaseAbortDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortDraftReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/purchaseAbort/purchaseAbortDraftReadOnly.html',
                    controller: 'purchaseAbortDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortDraftReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 采购作废-审批
        $stateProvider.state('purchaseAbortApproval', {
            url: '/purchaseAbortApproval',
            useWorkflow: true,
            workflowUrlBase: '/purchaseAbortApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/purchaseAbort/purchaseAbortApproval.html',
                    controller: 'purchaseAbortApproval_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/purchaseAbort/purchaseAbortApprovalReadOnly.html',
                    controller: 'purchaseAbortApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/purchaseAbort/purchaseAbortApproval.html',
                    controller: 'purchaseAbortApproval_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/purchaseAbort/purchaseAbortApprovalReadOnly.html',
                    controller: 'purchaseAbortApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/purchaseAbort/purchaseAbortApprovalReadOnly.html',
                    controller: 'purchaseAbortApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/purchaseAbort/purchaseAbortApproval.html',
                    controller: 'purchaseAbortApproval_controller',
                    controllerUrl: './javascript/controllers/purchaseAbort/purchaseAbortApproval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});