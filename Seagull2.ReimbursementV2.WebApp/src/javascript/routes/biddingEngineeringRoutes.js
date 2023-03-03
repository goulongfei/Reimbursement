define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(工程类)-拟单
        $stateProvider.state('biddingEngineeringApplication', {
            url: '/biddingEngineeringApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApplication.html',
                    controller: 'biddingEngineeringApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApplicationReadOnly.html',
                    controller: 'biddingEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApplicationReadOnly.html',
                    controller: 'biddingEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApplicationReadOnly.html',
                    controller: 'biddingEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApplicationReadOnly.html',
                    controller: 'biddingEngineeringApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-拟单审批
        $stateProvider.state('biddingEngineeringApproval', {
            url: '/biddingEngineeringApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringApprovalWf',
            workflowScene: {
                 'Application': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApproval.html',
                    controller: 'biddingEngineeringApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApproval-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApprovalReadOnly.html',
                    controller: 'biddingEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApprovalReadOnly-controller.js'
                }, 
                'Approval': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApproval.html',
                    controller: 'biddingEngineeringApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApprovalReadOnly.html',
                    controller: 'biddingEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApprovalReadOnly-controller.js'
                }, 
                'ApprovalEdit': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApproval.html',
                    controller: 'biddingEngineeringApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApproval-controller.js'
                },  
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApprovalReadOnly.html',
                    controller: 'biddingEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApprovalReadOnly.html',
                    controller: 'biddingEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApproval.html',
                    controller: 'biddingEngineeringApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringApprovalReadOnly.html',
                    controller: 'biddingEngineeringApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-投标邀请
        $stateProvider.state('biddingEngineeringInvite', {
            url: '/biddingEngineeringInvite',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringInviteWf',
            workflowScene: {
                'Invite': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringInvite.html',
                    controller: 'biddingEngineeringInvite_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringInvite-controller.js'
                },
                'InviteReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringInviteReadOnly.html',
                    controller: 'biddingEngineeringInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringInviteReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringInviteReadOnly.html',
                    controller: 'biddingEngineeringInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringInviteReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringInviteReadOnly.html',
                    controller: 'biddingEngineeringInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringInviteReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringInviteReadOnly.html',
                    controller: 'biddingEngineeringInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringInviteReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-发放标书
        $stateProvider.state('biddingEngineeringIssueBiddingDocument', {
            url: '/biddingEngineeringIssueBiddingDocument',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringIssueBiddingDocumentWf',
            workflowScene: {
                'IssueBiddingDocument': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocument.html',
                    controller: 'biddingEngineeringIssueBiddingDocument_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocument-controller.js'
                },
                'IssueBiddingDocumentReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingEngineeringIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingEngineeringIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingEngineeringIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingEngineeringIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly-controller.js'
                },
                'InviteReply': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingEngineeringIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly-controller.js'
                },
                'InviteReplyReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingEngineeringIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringIssueBiddingDocumentReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-答疑
        $stateProvider.state('biddingEngineeringAnswer', {
            url: '/biddingEngineeringAnswer',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringAnswerWf',
            workflowScene: {
                'Answer': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAnswer.html',
                    controller: 'biddingEngineeringAnswer_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAnswer-controller.js'
                },
                'AnswerReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAnswerReadOnly.html',
                    controller: 'biddingEngineeringAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAnswerReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAnswerReadOnly.html',
                    controller: 'biddingEngineeringAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAnswerReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAnswerReadOnly.html',
                    controller: 'biddingEngineeringAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAnswerReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAnswerReadOnly.html',
                    controller: 'biddingEngineeringAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAnswerReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-废标申请
        $stateProvider.state('biddingEngineeringNullifiedApplication', {
            url: '/biddingEngineeringNullifiedApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringNullifiedApplicationWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApplication.html',
                    controller: 'biddingEngineeringNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApplication-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly.html',
                    controller: 'biddingEngineeringNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly.html',
                    controller: 'biddingEngineeringNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly.html',
                    controller: 'biddingEngineeringNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly.html',
                    controller: 'biddingEngineeringNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-废标审批
        $stateProvider.state('biddingEngineeringNullifiedApproval', {
            url: '/biddingEngineeringNullifiedApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringNullifiedApprovalWf',
            workflowScene: {
                 'Nullified': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'NullifiedReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'NullifiedApproval': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'NullifiedApprovalReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringNullifiedApproval.html',
                    controller: 'biddingEngineeringNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringNullifiedApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-开标
        $stateProvider.state('biddingEngineeringOpenTender', {
            url: '/biddingEngineeringOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringOpenTender.html',
                    controller: 'biddingEngineeringOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringOpenTenderReadOnly.html',
                    controller: 'biddingEngineeringOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringOpenTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringOpenTenderReadOnly.html',
                    controller: 'biddingEngineeringOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringOpenTenderReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringOpenTenderReadOnly.html',
                    controller: 'biddingEngineeringOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringOpenTenderReadOnly.html',
                    controller: 'biddingEngineeringOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringOpenTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-商务清标
        $stateProvider.state('biddingEngineeringBusinessClarigy', {
            url: '/biddingEngineeringBusinessClarigy',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringBusinessClarigyWf',
            workflowScene: {
                'BusinessClarigy': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessClarigy.html',
                    controller: 'biddingEngineeringBusinessClarigy_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessClarigy-controller.js'
                },
                'BusinessClarigyReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly.html',
                    controller: 'biddingEngineeringBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly.html',
                    controller: 'biddingEngineeringBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly.html',
                    controller: 'biddingEngineeringBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly.html',
                    controller: 'biddingEngineeringBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessClarigyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-技术清标
        $stateProvider.state('biddingEngineeringTechnologyClarigy', {
            url: '/biddingEngineeringTechnologyClarigy',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringTechnologyClarigyWf',
            workflowScene: {
                'TechnologyClarigy': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyClarigy.html',
                    controller: 'biddingEngineeringTechnologyClarigy_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyClarigy-controller.js'
                },
                'TechnologyClarigyReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly.html',
                    controller: 'biddingEngineeringTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly.html',
                    controller: 'biddingEngineeringTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly.html',
                    controller: 'biddingEngineeringTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly.html',
                    controller: 'biddingEngineeringTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyClarigyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-清标汇总
        $stateProvider.state('biddingEngineeringClarigySummary', {
            url: '/biddingEngineeringClarigySummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringClarigySummaryWf',
            workflowScene: {
                'ClarigySummary': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigySummary.html',
                    controller: 'biddingEngineeringClarigySummary_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigySummary-controller.js'
                },
                'ClarigySummaryReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigySummaryReadOnly.html',
                    controller: 'biddingEngineeringClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigySummaryReadOnly-controller.js'
                },
                'ClarigyReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigySummaryReadOnly.html',
                    controller: 'biddingEngineeringClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigySummaryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigySummaryReadOnly.html',
                    controller: 'biddingEngineeringClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigySummaryReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigySummaryReadOnly.html',
                    controller: 'biddingEngineeringClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigySummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigySummaryReadOnly.html',
                    controller: 'biddingEngineeringClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigySummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-澄清答复等待
        $stateProvider.state('biddingEngineeringClarigyReply', {
            url: '/biddingEngineeringClarigyReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringClarigyReplyWf',
            workflowScene: {
                'ClarigyReply': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigyReply.html',
                    controller: 'biddingEngineeringClarigyReply_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigyReply-controller.js'
                },
                'ClarigyReplyReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigyReplyReadOnly.html',
                    controller: 'biddingEngineeringClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigyReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigyReplyReadOnly.html',
                    controller: 'biddingEngineeringClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigyReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigyReplyReadOnly.html',
                    controller: 'biddingEngineeringClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigyReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringClarigyReplyReadOnly.html',
                    controller: 'biddingEngineeringClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringClarigyReplyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-商务评标
        $stateProvider.state('biddingEngineeringBusinessEvaluate', {
            url: '/biddingEngineeringBusinessEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringBusinessEvaluateWf',
            workflowScene: {
                'BusinessEvaluate': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessEvaluate.html',
                    controller: 'biddingEngineeringBusinessEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessEvaluate-controller.js'
                },
                'BusinessEvaluateReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly.html',
                    controller: 'biddingEngineeringBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly.html',
                    controller: 'biddingEngineeringBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly.html',
                    controller: 'biddingEngineeringBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly.html',
                    controller: 'biddingEngineeringBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringBusinessEvaluateReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-技术评标
        $stateProvider.state('biddingEngineeringTechnologyEvaluate', {
            url: '/biddingEngineeringTechnologyEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringTechnologyEvaluateWf',
            workflowScene: {
                'TechnologyEvaluate': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyEvaluate.html',
                    controller: 'biddingEngineeringTechnologyEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyEvaluate-controller.js'
                },
                'TechnologyEvaluateReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly.html',
                    controller: 'biddingEngineeringTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly.html',
                    controller: 'biddingEngineeringTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly.html',
                    controller: 'biddingEngineeringTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly.html',
                    controller: 'biddingEngineeringTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringTechnologyEvaluateReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-评标汇总
        $stateProvider.state('biddingEngineeringEvaluateSummary', {
            url: '/biddingEngineeringEvaluateSummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringEvaluateSummaryWf',
            workflowScene: {
                'EvaluateSummary': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringEvaluateSummary.html',
                    controller: 'biddingEngineeringEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringEvaluateSummary-controller.js'
                },
                'EvaluateSummaryReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly.html',
                    controller: 'biddingEngineeringEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly.html',
                    controller: 'biddingEngineeringEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly.html',
                    controller: 'biddingEngineeringEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly.html',
                    controller: 'biddingEngineeringEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringEvaluateSummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-让利等待
        $stateProvider.state('biddingEngineeringProfitSharingReply', {
            url: '/biddingEngineeringProfitSharingReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringProfitSharingReplyWf',
            workflowScene: {
                'ProfitSharingReply': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringProfitSharingReply.html',
                    controller: 'biddingEngineeringProfitSharingReply_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringProfitSharingReply-controller.js'
                },
                'ProfitSharingReplyReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly.html',
                    controller: 'biddingEngineeringProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly.html',
                    controller: 'biddingEngineeringProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly.html',
                    controller: 'biddingEngineeringProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly.html',
                    controller: 'biddingEngineeringProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringProfitSharingReplyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-定标
        $stateProvider.state('biddingEngineeringAward', {
            url: '/biddingEngineeringAward',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringAwardWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAward.html',
                    controller: 'biddingEngineeringAward_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAward-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardReadOnly.html',
                    controller: 'biddingEngineeringAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardReadOnly.html',
                    controller: 'biddingEngineeringAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardReadOnly.html',
                    controller: 'biddingEngineeringAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardReadOnly.html',
                    controller: 'biddingEngineeringAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-定标审批
        $stateProvider.state('biddingEngineeringAwardApproval', {
            url: '/biddingEngineeringAwardApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringAwardApprovalWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApproval.html',
                    controller: 'biddingEngineeringAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApproval-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
                },
                'AwardApproval': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApproval.html',
                    controller: 'biddingEngineeringAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApproval-controller.js'
                },
                'AwardApprovalReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
             },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApproval.html',
                    controller: 'biddingEngineeringAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApproval.html',
                    controller: 'biddingEngineeringAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
                }, 
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApproval.html',
                    controller: 'biddingEngineeringAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringAwardApprovalReadOnly.html',
                    controller: 'biddingEngineeringAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringAwardApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-发放中标通知
        $stateProvider.state('biddingEngineeringSendAwardNotice', {
            url: '/biddingEngineeringSendAwardNotice',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringSendAwardNoticeWf',
            workflowScene: {
                'SendAwardNotice': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringSendAwardNotice.html',
                    controller: 'biddingEngineeringSendAwardNotice_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringSendAwardNotice-controller.js'
                },
                'SendAwardNoticeReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly.html',
                    controller: 'biddingEngineeringSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly.html',
                    controller: 'biddingEngineeringSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly.html',
                    controller: 'biddingEngineeringSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly.html',
                    controller: 'biddingEngineeringSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringSendAwardNoticeReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-发起合同订立
        $stateProvider.state('biddingEngineeringStartupContract', {
            url: '/biddingEngineeringStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingEngineeringStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringStartupContract.html',
                    controller: 'biddingEngineeringStartupContract_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringStartupContractReadOnly.html',
                    controller: 'biddingEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringStartupContractReadOnly.html',
                    controller: 'biddingEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringStartupContractReadOnly.html',
                    controller: 'biddingEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/engineering/biddingEngineeringStartupContractReadOnly.html',
                    controller: 'biddingEngineeringStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/engineering/biddingEngineeringStartupContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});