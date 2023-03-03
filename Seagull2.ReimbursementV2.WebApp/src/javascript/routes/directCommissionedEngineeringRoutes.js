define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 直接委托(工程采购类)-拟单
        $stateProvider.state('directCommissionedEngineeringApplication', {
            url: '/directCommissionedEngineeringApplication',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApplication.html',
                    controller: 'directCommissionedEngineeringApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-预算初审
        $stateProvider.state('directCommissionedEngineeringInitialAudit', {
            url: '/directCommissionedEngineeringInitialAudit',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringInitialAuditWf',
            workflowScene: {
                'InitialAudit': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAudit.html',
                    controller: 'directCommissionedEngineeringInitialAudit_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAudit-controller.js'
                },
                'InitialAuditReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly.html',
                    controller: 'directCommissionedEngineeringInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly.html',
                    controller: 'directCommissionedEngineeringInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly.html',
                    controller: 'directCommissionedEngineeringInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly.html',
                    controller: 'directCommissionedEngineeringInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly-controller.js'
                },
                'StartupContract': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly.html',
                    controller: 'directCommissionedEngineeringInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly.html',
                    controller: 'directCommissionedEngineeringInitialAuditReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringInitialAuditReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-审批
        $stateProvider.state('directCommissionedEngineeringApproval', {
            url: '/directCommissionedEngineeringApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringApprovalWf',
            workflowScene: {
                'Approval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApproval.html',
                    controller: 'directCommissionedEngineeringApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApproval.html',
                    controller: 'directCommissionedEngineeringApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });


        // 直接委托(工程采购类)-预算审计
        $stateProvider.state('directCommissionedEngineeringAudit', {
            url: '/directCommissionedEngineeringAudit',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringAuditApplicationWf',
            workflowScene: {
                'Audit': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplication.html',
                    controller: 'directCommissionedEngineeringAuditApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplication-controller.js'
                },
                'AuditReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-预算审计申请
        $stateProvider.state('directCommissionedEngineeringAuditApplication', {
            url: '/directCommissionedEngineeringAuditApplication',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringAuditApplicationWf',
            workflowScene: {
                'AuditApplication': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplication.html',
                    controller: 'directCommissionedEngineeringAuditApplication_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplication-controller.js'
                },
                'AuditApplicationReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'Audit': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'AuditReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'AuditApproval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'AuditApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-预算审计-资料复合
        $stateProvider.state('directCommissionedEngineeringAuditApplicationApproval', {
            url: '/directCommissionedEngineeringAuditApplicationApproval',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringAuditApplicationWf',
            workflowScene: {
                'AuditApproval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApproval.html',
                    controller: 'directCommissionedEngineeringAuditApplicationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApproval-controller.js'
                },
                'AuditApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApproval.html',
                    controller: 'directCommissionedEngineeringAuditApplicationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditApplicationApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApproval.html',
                    controller: 'directCommissionedEngineeringAuditApplicationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditApplicationApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-预算审计-审计实施
        $stateProvider.state('directCommissionedEngineeringAuditImplementation', {
            url: '/directCommissionedEngineeringAuditImplementation',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringAuditImplementationWf',
            workflowScene: {
                'AuditImplementation': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementation.html',
                    controller: 'directCommissionedEngineeringAuditImplementation_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementation-controller.js'
                },
                'AuditImplementationReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'AuditImplementationApproval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'AuditImplementationApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'StartupContract': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });


        // 直接委托(工程采购类)-预算审计-审计实施-审批
        $stateProvider.state('directCommissionedEngineeringAuditImplementationApproval', {
            url: '/directCommissionedEngineeringAuditImplementationApproval',
            useWorkflow: true,
            workflowUrlBase: '/directCommissionedEngineeringAuditImplementationWf',
            workflowScene: {
                'AuditImplementationApproval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'AuditImplementationApprovalReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'BeforeCostApproval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApprovalReadOnly.html',
                    controller: 'directCommissionedEngineeringAuditImplementationApproval_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringAuditImplementationApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-资料签收
        $stateProvider.state('directCommissionedEngineeringSignature', {
            url: '/directCommissionedEngineeringSignature',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringSignatureWf',
            workflowScene: {
                'Signature': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignature.html',
                    controller: 'directCommissionedEngineeringSignature_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignature-controller.js'
                },
                'SignatureReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly.html',
                    controller: 'directCommissionedEngineeringSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly.html',
                    controller: 'directCommissionedEngineeringSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly.html',
                    controller: 'directCommissionedEngineeringSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly.html',
                    controller: 'directCommissionedEngineeringSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly-controller.js'
                },
                'StartupContract': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly.html',
                    controller: 'directCommissionedEngineeringSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly.html',
                    controller: 'directCommissionedEngineeringSignatureReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 直接委托(工程采购类)-发起合同订立
        $stateProvider.state('directCommissionedEngineeringStartupContract', {
            url: '/directCommissionedEngineeringStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/DirectCommissionedEngineeringStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringStartupContract.html',
                    controller: 'directCommissionedEngineeringStartupContract_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly.html',
                    controller: 'directCommissionedEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly.html',
                    controller: 'directCommissionedEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly.html',
                    controller: 'directCommissionedEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly.html',
                    controller: 'directCommissionedEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringStartupContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 查看复审结果反馈通知
        $stateProvider.state('directCommissionedEngineeringNotifyToCreator', {
            url: '/directCommissionedEngineeringNotifyToCreator',
            templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringNotifyToCreator.html',
            controller: 'directCommissionedEngineeringNotifyToCreator_controller',
            controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringNotifyToCreator-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ContractV2/css/style']
        });

        // 查看资料签收反馈通知
        $stateProvider.state('directCommissionedEngineeringSignatureNotify', {
            url: '/directCommissionedEngineeringSignatureNotify',
            templateUrl: './views/directCommissioned/engineering/directCommissionedEngineeringSignatureNotify.html',
            controller: 'directCommissionedEngineeringSignatureNotify_controller',
            controllerUrl: './javascript/controllers/directCommissioned/engineering/directCommissionedEngineeringSignatureNotify-controller.js',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ContractV2/css/style']
        });
    }]);
});