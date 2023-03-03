define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(非开发运营类)-拟单
        $stateProvider.state('biddingBusinessOperationsApplication', {
            url: '/biddingBusinessOperationsApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApplication.html',
                    controller: 'biddingBusinessOperationsApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-拟单审批
        $stateProvider.state('biddingBusinessOperationsApproval', {
            url: '/biddingBusinessOperationsApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsApprovalWf',
            workflowScene: {
                 'Application': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApproval.html',
                    controller: 'biddingBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApproval-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly-controller.js'
                }, 
                'Approval': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApproval.html',
                    controller: 'biddingBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly-controller.js'
                }, 
                'ApprovalEdit': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApproval.html',
                    controller: 'biddingBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApproval-controller.js'
                },  
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApproval.html',
                    controller: 'biddingBusinessOperationsApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-发放标书
        $stateProvider.state('biddingBusinessOperationsIssueBiddingDocument', {
            url: '/biddingBusinessOperationsIssueBiddingDocument',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsIssueBiddingDocumentWf',
            workflowScene: {
                'IssueBiddingDocument': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocument.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocument_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocument-controller.js'
                },
                'IssueBiddingDocumentReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly-controller.js'
                },
                'InviteReply': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly-controller.js'
                },
                'InviteReplyReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingBusinessOperationsIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsIssueBiddingDocumentReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-废标申请
        $stateProvider.state('biddingBusinessOperationsNullifiedApplication', {
            url: '/biddingBusinessOperationsNullifiedApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsNullifiedApplicationWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApplication.html',
                    controller: 'biddingBusinessOperationsNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApplication-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly.html',
                    controller: 'biddingBusinessOperationsNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-废标审批
        $stateProvider.state('biddingBusinessOperationsNullifiedApproval', {
            url: '/biddingBusinessOperationsNullifiedApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsNullifiedApprovalWf',
            workflowScene: {
                 'Nullified': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'NullifiedReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'NullifiedApproval': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'NullifiedApprovalReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval.html',
                    controller: 'biddingBusinessOperationsNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsNullifiedApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-开标
        $stateProvider.state('biddingBusinessOperationsOpenTender', {
            url: '/biddingBusinessOperationsOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsOpenTender.html',
                    controller: 'biddingBusinessOperationsOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly.html',
                    controller: 'biddingBusinessOperationsOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly.html',
                    controller: 'biddingBusinessOperationsOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly.html',
                    controller: 'biddingBusinessOperationsOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly.html',
                    controller: 'biddingBusinessOperationsOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsOpenTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-商务清标
        $stateProvider.state('biddingBusinessOperationsBusinessClarigy', {
            url: '/biddingBusinessOperationsBusinessClarigy',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsBusinessClarigyWf',
            workflowScene: {
                'BusinessClarigy': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessClarigy.html',
                    controller: 'biddingBusinessOperationsBusinessClarigy_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessClarigy-controller.js'
                },
                'BusinessClarigyReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessClarigyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-技术清标
        $stateProvider.state('biddingBusinessOperationsTechnologyClarigy', {
            url: '/biddingBusinessOperationsTechnologyClarigy',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsTechnologyClarigyWf',
            workflowScene: {
                'TechnologyClarigy': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigy.html',
                    controller: 'biddingBusinessOperationsTechnologyClarigy_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigy-controller.js'
                },
                'TechnologyClarigyReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyClarigyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-清标汇总
        $stateProvider.state('biddingBusinessOperationsClarigySummary', {
            url: '/biddingBusinessOperationsClarigySummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsClarigySummaryWf',
            workflowScene: {
                'ClarigySummary': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigySummary.html',
                    controller: 'biddingBusinessOperationsClarigySummary_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigySummary-controller.js'
                },
                'ClarigySummaryReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly-controller.js'
                },
                'ClarigyReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigySummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-澄清答复等待
        $stateProvider.state('biddingBusinessOperationsClarigyReply', {
            url: '/biddingBusinessOperationsClarigyReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsClarigyReplyWf',
            workflowScene: {
                'ClarigyReply': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigyReply.html',
                    controller: 'biddingBusinessOperationsClarigyReply_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigyReply-controller.js'
                },
                'ClarigyReplyReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsClarigyReplyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-商务评标
        $stateProvider.state('biddingBusinessOperationsBusinessEvaluate', {
            url: '/biddingBusinessOperationsBusinessEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsBusinessEvaluateWf',
            workflowScene: {
                'BusinessEvaluate': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluate.html',
                    controller: 'biddingBusinessOperationsBusinessEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluate-controller.js'
                },
                'BusinessEvaluateReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsBusinessEvaluateReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-技术评标
        $stateProvider.state('biddingBusinessOperationsTechnologyEvaluate', {
            url: '/biddingBusinessOperationsTechnologyEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsTechnologyEvaluateWf',
            workflowScene: {
                'TechnologyEvaluate': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluate.html',
                    controller: 'biddingBusinessOperationsTechnologyEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluate-controller.js'
                },
                'TechnologyEvaluateReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly.html',
                    controller: 'biddingBusinessOperationsTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsTechnologyEvaluateReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-评标汇总
        $stateProvider.state('biddingBusinessOperationsEvaluateSummary', {
            url: '/biddingBusinessOperationsEvaluateSummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsEvaluateSummaryWf',
            workflowScene: {
                'EvaluateSummary': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsEvaluateSummary.html',
                    controller: 'biddingBusinessOperationsEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsEvaluateSummary-controller.js'
                },
                'EvaluateSummaryReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly.html',
                    controller: 'biddingBusinessOperationsEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsEvaluateSummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-让利等待
        $stateProvider.state('biddingBusinessOperationsProfitSharingReply', {
            url: '/biddingBusinessOperationsProfitSharingReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsProfitSharingReplyWf',
            workflowScene: {
                'ProfitSharingReply': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsProfitSharingReply.html',
                    controller: 'biddingBusinessOperationsProfitSharingReply_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsProfitSharingReply-controller.js'
                },
                'ProfitSharingReplyReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly.html',
                    controller: 'biddingBusinessOperationsProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsProfitSharingReplyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-定标
        $stateProvider.state('biddingBusinessOperationsAward', {
            url: '/biddingBusinessOperationsAward',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsAwardWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAward.html',
                    controller: 'biddingBusinessOperationsAward_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAward-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-定标审批
        $stateProvider.state('biddingBusinessOperationsAwardApproval', {
            url: '/biddingBusinessOperationsAwardApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsAwardApprovalWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApproval.html',
                    controller: 'biddingBusinessOperationsAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApproval-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
                },
                'AwardApproval': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApproval.html',
                    controller: 'biddingBusinessOperationsAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApproval-controller.js'
                },
                'AwardApprovalReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
             },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApproval.html',
                    controller: 'biddingBusinessOperationsAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApproval.html',
                    controller: 'biddingBusinessOperationsAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
                }, 
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApproval.html',
                    controller: 'biddingBusinessOperationsAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly.html',
                    controller: 'biddingBusinessOperationsAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsAwardApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(非开发运营类)-发起合同订立
        $stateProvider.state('biddingBusinessOperationsStartupContract', {
            url: '/biddingBusinessOperationsStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingBusinessOperationsStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsStartupContract.html',
                    controller: 'biddingBusinessOperationsStartupContract_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly.html',
                    controller: 'biddingBusinessOperationsStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly.html',
                    controller: 'biddingBusinessOperationsStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly.html',
                    controller: 'biddingBusinessOperationsStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly.html',
                    controller: 'biddingBusinessOperationsStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/businessOperations/biddingBusinessOperationsStartupContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});