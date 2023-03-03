define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";
        // 采购计划-编辑采购计划
        $stateProvider.state('purchasePlanDrafter', {
            url: '/purchasePlanDrafter',
            useWorkflow: true,
            workflowUrlBase: '/PurchasePlanDrafterWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/purchasePlan/purchasePlanDraft.html',
                    controller: 'purchasePlanDraft_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/purchasePlan/purchasePlanDraftReadOnly.html',
                    controller: 'purchasePlanDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanDraftReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/purchasePlan/purchasePlanDraft.html',
                    controller: 'purchasePlanDraft_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanDraft-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/purchasePlan/purchasePlanDraft.html',
                    controller: 'purchasePlanDraft_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanDraft-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/purchasePlan/purchasePlanDraft.html',
                    controller: 'purchasePlanDraft_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanDraft-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 采购计划-编辑采购计划审批
        $stateProvider.state('purchasePlanApproval', {
            url: '/purchasePlanApproval',
            useWorkflow: true,
            workflowUrlBase: '/PurchasePlanApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/purchasePlan/purchasePlanApproval.html',
                    controller: 'purchasePlanApproval_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/purchasePlan/purchasePlanApprovalReadOnly.html',
                    controller: 'purchasePlanApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanApprovalReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/purchasePlan/purchasePlanApprovalReadOnly.html',
                    controller: 'purchasePlanApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanApprovalReadOnly-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/purchasePlan/purchasePlanApprovalReadOnly.html',
                    controller: 'purchasePlanApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/purchasePlan/purchasePlanApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});