define(['app'],function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/";

        // 比价采购-采购申请
        $stateProvider.state('comparePricePurchaseApplication', {
            url: '/comparePricePurchaseApplication',
            useWorkflow: true,
            workflowUrlBase: '/ComparePricePurchaseApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApplication.html',
                    controller: 'comparePricePurchaseApplication_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApplicationReadOnly.html',
                    controller: 'comparePricePurchaseApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApplication.html',
                    controller: 'comparePricePurchaseApplication_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApplication-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApplicationReadOnly.html',
                    controller: 'comparePricePurchaseApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApplicationReadOnly.html',
                    controller: 'comparePricePurchaseApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 比价采购-审批
        $stateProvider.state('comparePricePurchaseApproval', {
            url: '/comparePricePurchaseApproval',
            useWorkflow: true,
            workflowUrlBase: '/ComparePricePurchaseApprovalWf',
            workflowScene: {
                'Approval': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApproval.html',
                    controller: 'comparePricePurchaseApproval_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApproval.html',
                    controller: 'comparePricePurchaseApproval_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApprovalReadOnly.html',
                    controller: 'comparePricePurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApproval.html',
                    controller: 'comparePricePurchaseApproval_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApprovalReadOnly.html',
                    controller: 'comparePricePurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/comparePricePurchase/comparePricePurchaseApprovalReadOnly.html',
                    controller: 'comparePricePurchaseApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/comparePricePurchase/comparePricePurchaseApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });        
    }]);
});