define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(项目实施类)-拟单
        $stateProvider.state('directCommissionedImplementApplication', {
            url: '/directCommissionedImplementApplication',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApplication.html',
                    controller: 'directCommissionedImplementApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApplicationReadOnly.html',
                    controller: 'directCommissionedImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApplicationReadOnly.html',
                    controller: 'directCommissionedImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApplicationReadOnly.html',
                    controller: 'directCommissionedImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApplicationReadOnly.html',
                    controller: 'directCommissionedImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-预算初审
        $stateProvider.state('directCommissionedImplementInitialAudit', {
            url: '/directCommissionedImplementInitialAudit',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementInitialAuditWf',
            workflowScene: {
                'InitialAudit': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAudit.html',
                    controller: 'directCommissionedImplementInitialAudit_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAudit-controller.js'
                },
                'InitialAuditReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly.html',
                    controller: 'directCommissionedImplementInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly.html',
                    controller: 'directCommissionedImplementInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly.html',
                    controller: 'directCommissionedImplementInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly.html',
                    controller: 'directCommissionedImplementInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly-controller.js'
                },
                'StartupContract': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly.html',
                    controller: 'directCommissionedImplementInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly.html',
                    controller: 'directCommissionedImplementInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementInitialAuditReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-审批
        $stateProvider.state('directCommissionedImplementApproval', {
            url: '/directCommissionedImplementApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementApprovalWf',
            workflowScene: {
                'Approval': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApproval.html',
                    controller: 'directCommissionedImplementApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApproval.html',
                    controller: 'directCommissionedImplementApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApprovalReadOnly.html',
                    controller: 'directCommissionedImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApprovalReadOnly.html',
                    controller: 'directCommissionedImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApprovalReadOnly.html',
                    controller: 'directCommissionedImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApprovalReadOnly-controller.js'
                },
                  'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementApprovalReadOnly.html',
                    controller: 'directCommissionedImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-预算审计
        $stateProvider.state('directCommissionedImplementAudit', {
            url: '/directCommissionedImplementAudit',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementAuditApplicationWf',
            workflowScene: {
                'Audit': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplication.html',
                    controller: 'directCommissionedImplementAuditApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplication-controller.js'
                },
                'AuditReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-预算审计申请
        $stateProvider.state('directCommissionedImplementAuditApplication', {
            url: '/directCommissionedImplementAuditApplication',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementAuditApplicationWf',
            workflowScene: {
                'AuditApplication': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplication.html',
                    controller: 'directCommissionedImplementAuditApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplication-controller.js'
                },
                'AuditApplicationReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'Audit': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'AuditReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'AuditApproval': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'AuditApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-预算审计-资料复合
        $stateProvider.state('directCommissionedImplementAuditApplicationApproval', {
            url: '/directCommissionedImplementAuditApplicationApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementAuditApplicationWf',
            workflowScene: { 
                'AuditApproval': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationApproval.html',
                    controller: 'directCommissionedImplementAuditApplicationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationApproval-controller.js'
                },
                'AuditApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationApproval.html',
                    controller: 'directCommissionedImplementAuditApplicationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditApplicationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditApplicationApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditApplicationApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-预算审计-审计实施
        $stateProvider.state('directCommissionedImplementAuditImplementation', {
            url: '/directCommissionedImplementAuditImplementation',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementAuditImplementationWf',
            workflowScene: {
                'AuditImplementation': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementation.html',
                    controller: 'directCommissionedImplementAuditImplementation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementation-controller.js'
                },
                'AuditImplementationReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly-controller.js'
                }, 
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly-controller.js'
                },
                'StartupContract': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-预算审计-审计实施-审批
        $stateProvider.state('directCommissionedImplementAuditImplementationApproval', {
            url: '/directCommissionedImplementAuditImplementationApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementAuditImplementationWf',
            workflowScene: {               
                'AuditImplementationApproval': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                'AuditImplementationApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                'BeforeCostApproval': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
                 'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedImplementAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementAuditImplementationApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-资料签收
        $stateProvider.state('directCommissionedImplementSignature', {
            url: '/directCommissionedImplementSignature',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementSignatureWf',
            workflowScene: {
                'Signature': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignature.html',
                    controller: 'directCommissionedImplementSignature_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignature-controller.js'
                },
                'SignatureReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureReadOnly.html',
                    controller: 'directCommissionedImplementSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureReadOnly.html',
                    controller: 'directCommissionedImplementSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureReadOnly.html',
                    controller: 'directCommissionedImplementSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureReadOnly.html',
                    controller: 'directCommissionedImplementSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureReadOnly-controller.js'
                },
                'StartupContract': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureReadOnly.html',
                    controller: 'directCommissionedImplementSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureReadOnly-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureReadOnly.html',
                    controller: 'directCommissionedImplementSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(项目实施类)-发起合同订立
        $stateProvider.state('directCommissionedImplementStartupContract', {
            url: '/directCommissionedImplementStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedImplementStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementStartupContract.html',
                    controller: 'directCommissionedImplementStartupContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly.html',
                    controller: 'directCommissionedImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly.html',
                    controller: 'directCommissionedImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly.html',
                    controller: 'directCommissionedImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/implement/directCommissionedImplementStartupContractReadOnly.html',
                    controller: 'directCommissionedImplementStartupContractCirculation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementStartupContractCirculation-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 查看复审结果反馈通知
        $stateProvider.state('directCommissionedImplementNotifyToCreator', {
            url: '/directCommissionedImplementNotifyToCreator',
            templateUrl: './views/directCommissioned/implement/directCommissionedImplementNotifyToCreator.html',
            controller: 'directCommissionedImplementNotifyToCreator_controller',
            controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementNotifyToCreator-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ContractV2/css/style']
        });

        // 查看复审结果反馈通知
        $stateProvider.state('directCommissionedImplementSignatureNotify', {
            url: '/directCommissionedImplementSignatureNotify',
            templateUrl: './views/directCommissioned/implement/directCommissionedImplementSignatureNotify.html',
            controller: 'directCommissionedImplementSignatureNotify_controller',
            controllerUrl: './javascript/controllers/directCommissioned/implement/directCommissionedImplementSignatureNotify-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ContractV2/css/style']
        });
    }]);
});