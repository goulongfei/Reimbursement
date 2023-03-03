define(['app'],function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(项目集中采购)-拟单
        $stateProvider.state('strategyCentralizedCommissioned', {
            url: '/strategyCentralizedCommissioned',
            useWorkflow: true,
            workflowUrlBase: '/StrategyCentralizedCommissionedWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissioned.html',
                    controller: 'strategyCentralizedCommissioned_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissioned-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedreadonly.html',
                    controller: 'strategyCentralizedCommissionedreadonly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedreadonly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

         // 直接委托(集中采购)-审批
        $stateProvider.state('strategyCentralizedCommissionedApproval', {
            url: '/strategyCentralizedCommissionedApproval',
            useWorkflow: true,
            workflowUrlBase: '/StrategyCentralizedCommissionedApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval.html',
                    controller: 'strategyCentralizedCommissionedapproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapprovalreadonly.html',
                    controller: 'strategyCentralizedCommissionedapprovalreadonly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapprovalreadonly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval.html',
                    controller: 'strategyCentralizedCommissionedapproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval.html',
                    controller: 'strategyCentralizedCommissionedapproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapprovalreadonly.html',
                    controller: 'strategyCentralizedCommissionedapprovalreadonly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapprovalreadonly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval.html',
                    controller: 'strategyCentralizedCommissionedapprovalreadonly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapprovalreadonly.html',
                    controller: 'strategyCentralizedCommissionedapprovalreadonly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/strategyCentralizedCommissionedapprovalreadonly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 录入协议编码
        $stateProvider.state('strategyCentralizedCommissionedEnterAgreementInfoCodeState', {
        	url: '/strategyCentralizedCommissionedEnterAgreementInfoCode',
            useWorkflow: true,
            workflowUrlBase: '/StrategyCentralizedCommissionedEnterAgreementInfoCodeWf',
            workflowScene: {
                'EnterAgreementInfoCode': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/enterAgreementInfoCode.html',
                    controller: 'enterAgreementInfoCode_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/enterAgreementInfoCode-controller.js'
                },
                'EnterAgreementInfoCodeReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/enterAgreementInfoCodeReadOnly.html',
                    controller: 'enterAgreementInfoCodeReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/enterAgreementInfoCodeReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 形成战采协议
        $stateProvider.state('strategyCentralizedCommissionedFromStrategyAgreementInfo', {
        	url: '/strategyCentralizedCommissionedFromStrategyAgreementInfo',
            useWorkflow: true,
            workflowUrlBase: '/StrategyCentralizedCommissionedFromStrategyAgreementInfoWf',
            workflowScene: {
            	'FromStrategyAgreementInfo': {       		
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/fromStrategyAgreementInfo.html',
                    controller: 'fromStrategyAgreementInfo_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/fromStrategyAgreementInfo-controller.js'
                },
                'FromStrategyAgreementInfoReadOnly': {
                    templateUrl: './views/strategyCommissioned/strategyCentralizedCommissioned/fromStrategyAgreementInfoReadOnly.html',
                    controller: 'fromStrategyAgreementInfoReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/strategyCentralizedCommissioned/fromStrategyAgreementInfoReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});