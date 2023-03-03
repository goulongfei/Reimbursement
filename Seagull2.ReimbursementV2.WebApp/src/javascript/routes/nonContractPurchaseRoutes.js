define(['app'],function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/";

        // 无合同采购-采购申请
        $stateProvider.state('purchaseApplication', {
            url: '/purchaseApplication',
            useWorkflow: true,
            workflowUrlBase: '/PurchaseApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/nonContractPurchase/purchaseApplication.html',
                    controller: 'purchaseApplication_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/nonContractPurchase/purchaseApplicationReadOnly.html',
                    controller: 'purchaseApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/nonContractPurchase/purchaseApplicationReadOnly.html',
                    controller: 'purchaseApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 无合同采购-采购申请审批
        $stateProvider.state('purchaseApproval', {
            url: '/purchaseApproval',
            useWorkflow: true,
            workflowUrlBase: '/PurchaseApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/nonContractPurchase/purchaseApproval.html',
                    controller: 'purchaseApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/nonContractPurchase/purchaseApprovalReadOnly.html',
                    controller: 'purchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/nonContractPurchase/purchaseApproval.html',
                    controller: 'purchaseApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApproval-controller.js'
                },
                'Draft': {
                    templateUrl: './views/nonContractPurchase/purchaseApproval.html',
                    controller: 'purchaseApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/nonContractPurchase/purchaseApprovalReadOnly.html',
                    controller: 'purchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApprovalReadOnly-controller.js'
                },
                'Approval': {
                    templateUrl: './views/nonContractPurchase/purchaseApproval.html',
                    controller: 'purchaseApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/nonContractPurchase/purchaseApprovalReadOnly.html',
                    controller: 'purchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/nonContractPurchase/purchaseApprovalReadOnly.html',
                    controller: 'purchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/purchaseApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 无合同采购-发起支付申请
        $stateProvider.state('startChargeApplication', {
            url: '/startChargeApplication',
            useWorkflow: true,
            workflowUrlBase: '/StartChargeApplicationWf',
            workflowScene: {
                'StartChargeApplication': {
                    templateUrl: './views/nonContractPurchase/startChargeApplication.html',
                    controller: 'startChargeApplication_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/startChargeApplication-controller.js'
                },
                'StartChargeApplicationReadOnly': {
                    templateUrl: './views/nonContractPurchase/startChargeApplicationReadOnly.html',
                    controller: 'startChargeApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/startChargeApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/nonContractPurchase/startChargeApplicationReadOnly.html',
                    controller: 'startChargeApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/startChargeApplicationReadOnly-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/nonContractPurchase/startChargeApplicationReadOnly.html',
                    controller: 'startChargeApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchase/startChargeApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });


        // 无合同采购重新分摊-前置页
        $stateProvider.state('nonContractRenewFront', {
            url: '/nonContractRenewFront',
            controller: 'purchaseRenewFrontpage_controller',
            controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewFrontpage-controller.js',
            templateUrl: './views/nonContractPurchaseRenew/purchaseRenewFrontpage.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 无合同采购重新分摊申请
        $stateProvider.state('nonContractRenewApplication', {
            url: '/nonContractRenewApplication',
            useWorkflow: true,
            workflowUrlBase: '/NonContractRenewApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApplication.html',
                    controller: 'purchaseRenewApplication_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApplication-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApplicationReadOnly.html',
                    controller: 'purchaseRenewApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApplicationReadOnly.html',
                    controller: 'purchaseRenewApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 无合同采购重新分摊审批
        $stateProvider.state('nonContractRenewApproval', {
            url: '/nonContractRenewApproval',
            useWorkflow: true,
            workflowUrlBase: '/NonContractRenewApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApproval.html',
                    controller: 'purchaseRenewApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly.html',
                    controller: 'purchaseRenewApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApproval.html',
                    controller: 'purchaseRenewApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApproval-controller.js'
                },
                'Draft': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApproval.html',
                    controller: 'purchaseRenewApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly.html',
                    controller: 'purchaseRenewApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly-controller.js'
                },
                'Approval': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApproval.html',
                    controller: 'purchaseRenewApproval_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly.html',
                    controller: 'purchaseRenewApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly.html',
                    controller: 'purchaseRenewApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/nonContractPurchaseRenew/purchaseRenewApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 无合同采购数据查看页面
        $stateProvider.state('lookingUpNoContentView', {
            url: '/lookingUpNoContentView',
            controller: 'lookingUpNoContentView_controller',
            controllerUrl: './javascript/controllers/nonContractPurchase/lookingUpNoContentView-controller.js',
            templateUrl: './views/nonContractPurchase/purchaseApproval.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});