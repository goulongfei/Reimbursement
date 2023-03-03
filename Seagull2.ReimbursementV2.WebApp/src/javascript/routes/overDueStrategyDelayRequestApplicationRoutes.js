define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 战采延期申请-拟单
        $stateProvider.state('strategyDelayRequest', {
            url: '/strategyDelayRequest',
            useWorkflow: true,
            workflowUrlBase: '/OverDueStrategyDelayRequestApplicationWf',
            workflowScene: {
                'StrategyDelayRequest': {
                    templateUrl: './views/OverDueStrategyDelayRequest/OverDueStrategyDelayRequestApplication.html',
                    controller: 'overDueStrategyDelayRequestApplication-controller',
                    controllerUrl: './javascript/controllers/OverDueStrategyDelayRequest/overDueStrategyDelayRequestApplication-controller.js'
                },
                'StrategyDelayRequestReadOnly': {
                    templateUrl: './views/OverDueStrategyDelayRequest/OverDueStrategyDelayRequestReadOnly.html',
                    controller: 'overDueStrategyDelayRequestReadOnly-controller',
                    controllerUrl: './javascript/controllers/OverDueStrategyDelayRequest/overDueStrategyDelayRequestReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 战采延期申请-审批
        $stateProvider.state('strategyDelayRequestApprove', {
            url: '/strategyDelayRequestApprove',
            useWorkflow: true,
            workflowUrlBase: '/OverDueStrategyDelayRequestApproveWf',
            workflowScene: {
                'Approval': {
                    templateUrl: './views/OverDueStrategyDelayRequest/OverDueStrategyDelayRequestApproval.html',
                    controller: 'overDueStrategyDelayRequestReadOnly-controller',
                    controllerUrl: './javascript/controllers/OverDueStrategyDelayRequest/overDueStrategyDelayRequestReadOnly-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/OverDueStrategyDelayRequest/OverDueStrategyDelayRequestReadOnly.html',
                    controller: 'overDueStrategyDelayRequestReadOnly-controller',
                    controllerUrl: './javascript/controllers/OverDueStrategyDelayRequest/overDueStrategyDelayRequestReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/OverDueStrategyDelayRequest/OverDueStrategyDelayRequestReadOnly.html',
                    controller: 'overDueStrategyDelayRequestReadOnly-controller',
                    controllerUrl: './javascript/controllers/OverDueStrategyDelayRequest/overDueStrategyDelayRequestReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});