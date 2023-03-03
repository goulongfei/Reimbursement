define(['app'],function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托（集团战略采购）
        // 拟单
        $stateProvider.state('StrategyGroupCommissionedDraftState', {
            url: '/StrategyGroupCommissionedDraft',
            useWorkflow: true,
            workflowUrlBase: '/StrategyGroupCommissionedDraftWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/draft.html',
                    controller: 'strategyGroupCommissionedDraft_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/draft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/draftReadOnly.html',
                    controller: 'strategyGroupCommissionedDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/draftReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'supplierInfoExtend', 'commonUtilExtend']
        });


        //审批
        $stateProvider.state('StrategyGroupCommissionedApprovalState', {
            url: '/StrategyGroupCommissionedApprovalUrl',
            useWorkflow: true,
            workflowUrlBase: '/StrategyGroupCommissionedApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/approval.html',
                    controller: 'strategyGroupCommissionedApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/approval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/approval.html',
                    controller: 'strategyGroupCommissionedApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/approval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/approval.html',
                    controller: 'strategyGroupCommissionedApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/approval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/approval.html',
                    controller: 'strategyGroupCommissionedApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/approval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/approval.html',
                    controller: 'strategyGroupCommissionedApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/approval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/approval.html',
                    controller: 'strategyGroupCommissionedApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/approval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 录入协议编码
        $stateProvider.state('StrategyGroupCommissionedEnterAgreementInfoCodeState', {
            url: '/StrategyGroupCommissionedEnterAgreementInfoCode',
            useWorkflow: true,
            workflowUrlBase: '/StrategyGroupCommissionedEnterAgreementInfoCodeWf',
            workflowScene: {
                'EnterAgreementInfoCode': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/enterAgreementInfoCode.html',
                    controller: 'strategyGroupCommissionedEnterAgreementInfoCode_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/enterAgreementInfoCode-controller.js'
                },
                'EnterAgreementInfoCodeReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/enterAgreementInfoCodeReadOnly.html',
                    controller: 'strategyGroupCommissionedEnterAgreementInfoCodeReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/enterAgreementInfoCodeReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 形成战采协议
        $stateProvider.state('StrategyGroupCommissionedFromStrategyAgreementInfoState', {
            url: '/StrategyGroupCommissionedFromStrategyAgreementInfo',
            useWorkflow: true,
            workflowUrlBase: '/StrategyGroupCommissionedFromStrategyAgreementInfoWf',
            workflowScene: {
                'FromStrategyAgreementInfo': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/fromStrategyAgreementInfo.html',
                    controller: 'strategyGroupCommissionedFromStrategyAgreementInfo_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/fromStrategyAgreementInfo-controller.js'
                },
                'FromStrategyAgreementInfoReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyGroupCommissioned/fromStrategyAgreementInfoReadOnly.html',
                    controller: 'strategyGroupCommissionedFromStrategyAgreementInfoReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyGroupCommissioned/fromStrategyAgreementInfoReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
       
    }]);
});