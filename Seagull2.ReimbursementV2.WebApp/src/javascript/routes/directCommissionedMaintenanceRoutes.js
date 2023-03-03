define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(第三方维保类)-拟单
        $stateProvider.state('directCommissionedMaintenanceApplication', {
            url: '/directCommissionedMaintenanceApplication',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedMaintenanceApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApplication.html',
                    controller: 'directCommissionedMaintenanceApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly.html',
                    controller: 'directCommissionedMaintenanceApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly.html',
                    controller: 'directCommissionedMaintenanceApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly.html',
                    controller: 'directCommissionedMaintenanceApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly.html',
                    controller: 'directCommissionedMaintenanceApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        }); 

        // 直接委托(第三方维保类)-审批
        $stateProvider.state('directCommissionedMaintenanceApproval', {
            url: '/directCommissionedMaintenanceApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedMaintenanceApprovalWf',
            workflowScene: {
                'Approval': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApproval.html',
                    controller: 'directCommissionedMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly.html',
                    controller: 'directCommissionedMaintenanceApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApproval.html',
                    controller: 'directCommissionedMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly.html',
                    controller: 'directCommissionedMaintenanceApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly-controller.js'
                },
                'Application': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApproval.html',
                    controller: 'directCommissionedMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApproval-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly.html',
                    controller: 'directCommissionedMaintenanceApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApproval.html',
                    controller: 'directCommissionedMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly.html',
                    controller: 'directCommissionedMaintenanceApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApproval.html',
                    controller: 'directCommissionedMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly.html',
                    controller: 'directCommissionedMaintenanceApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApproval.html',
                    controller: 'directCommissionedMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly.html',
                    controller: 'directCommissionedMaintenanceApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
         
        // 直接委托(第三方维保类)-发起合同订立
        $stateProvider.state('directCommissionedMaintenanceStartupContract', {
            url: '/directCommissionedMaintenanceStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedMaintenanceStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceStartupContract.html',
                    controller: 'directCommissionedMaintenanceStartupContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly.html',
                    controller: 'directCommissionedMaintenanceStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly.html',
                    controller: 'directCommissionedMaintenanceStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly.html',
                    controller: 'directCommissionedMaintenanceStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly.html',
                    controller: 'directCommissionedMaintenanceStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractReadOnly.html',
                    controller: 'directCommissionedMaintenanceStartupContractCirculation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/maintenance/directCommissionedMaintenanceStartupContractCirculation-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});