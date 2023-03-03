define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(工程类)-拟单
        $stateProvider.state('biddingImplementApplication', {
            url: '/biddingImplementApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/bidding/implement/biddingImplementApplication.html',
                    controller: 'biddingImplementApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementApplicationReadOnly.html',
                    controller: 'biddingImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementApplicationReadOnly.html',
                    controller: 'biddingImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementApplicationReadOnly.html',
                    controller: 'biddingImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementApplicationReadOnly.html',
                    controller: 'biddingImplementApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-拟单审批
        $stateProvider.state('biddingImplementApproval', {
            url: '/biddingImplementApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementApprovalWf',
            workflowScene: {
                 'Application': {
                    templateUrl: './views/bidding/implement/biddingImplementApproval.html',
                    controller: 'biddingImplementApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApproval-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementApprovalReadOnly.html',
                    controller: 'biddingImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApprovalReadOnly-controller.js'
                }, 
                'Approval': {
                    templateUrl: './views/bidding/implement/biddingImplementApproval.html',
                    controller: 'biddingImplementApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementApprovalReadOnly.html',
                    controller: 'biddingImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApprovalReadOnly-controller.js'
                }, 
                'ApprovalEdit': {
                    templateUrl: './views/bidding/implement/biddingImplementApproval.html',
                    controller: 'biddingImplementApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApproval-controller.js'
                },  
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementApprovalReadOnly.html',
                    controller: 'biddingImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementApprovalReadOnly.html',
                    controller: 'biddingImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementApprovalReadOnly.html',
                    controller: 'biddingImplementApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-投标邀请
        $stateProvider.state('biddingImplementInvite', {
            url: '/biddingImplementInvite',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementInviteWf',
            workflowScene: {
                'Invite': {
                    templateUrl: './views/bidding/implement/biddingImplementInvite.html',
                    controller: 'biddingImplementInvite_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementInvite-controller.js'
                },
                'InviteReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementInviteReadOnly.html',
                    controller: 'biddingImplementInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementInviteReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementInviteReadOnly.html',
                    controller: 'biddingImplementInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementInviteReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementInviteReadOnly.html',
                    controller: 'biddingImplementInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementInviteReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementInviteReadOnly.html',
                    controller: 'biddingImplementInviteReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementInviteReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-发放标书
        $stateProvider.state('biddingImplementIssueBiddingDocument', {
            url: '/biddingImplementIssueBiddingDocument',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementIssueBiddingDocumentWf',
            workflowScene: {
                'IssueBiddingDocument': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocument.html',
                    controller: 'biddingImplementIssueBiddingDocument_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocument-controller.js'
                },
                'IssueBiddingDocumentReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingImplementIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingImplementIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingImplementIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingImplementIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly-controller.js'
                },
                'InviteReply': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingImplementIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly-controller.js'
                },
                'InviteReplyReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingImplementIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementIssueBiddingDocumentReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-答疑
        $stateProvider.state('biddingImplementAnswer', {
            url: '/biddingImplementAnswer',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementAnswerWf',
            workflowScene: {
                'Answer': {
                    templateUrl: './views/bidding/implement/biddingImplementAnswer.html',
                    controller: 'biddingImplementAnswer_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAnswer-controller.js'
                },
                'AnswerReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementAnswerReadOnly.html',
                    controller: 'biddingImplementAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAnswerReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAnswerReadOnly.html',
                    controller: 'biddingImplementAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAnswerReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAnswerReadOnly.html',
                    controller: 'biddingImplementAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAnswerReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAnswerReadOnly.html',
                    controller: 'biddingImplementAnswerReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAnswerReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-废标申请
        $stateProvider.state('biddingImplementNullifiedApplication', {
            url: '/biddingImplementNullifiedApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementNullifiedApplicationWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApplication.html',
                    controller: 'biddingImplementNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApplication-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApplicationReadOnly.html',
                    controller: 'biddingImplementNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApplicationReadOnly.html',
                    controller: 'biddingImplementNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApplicationReadOnly.html',
                    controller: 'biddingImplementNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApplicationReadOnly.html',
                    controller: 'biddingImplementNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-废标审批
        $stateProvider.state('biddingImplementNullifiedApproval', {
            url: '/biddingImplementNullifiedApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementNullifiedApprovalWf',
            workflowScene: {
                 'Nullified': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'NullifiedReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'NullifiedApproval': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'NullifiedApprovalReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementNullifiedApproval.html',
                    controller: 'biddingImplementNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementNullifiedApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-开标
        $stateProvider.state('biddingImplementOpenTender', {
            url: '/biddingImplementOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/bidding/implement/biddingImplementOpenTender.html',
                    controller: 'biddingImplementOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementOpenTenderReadOnly.html',
                    controller: 'biddingImplementOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementOpenTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementOpenTenderReadOnly.html',
                    controller: 'biddingImplementOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementOpenTenderReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementOpenTenderReadOnly.html',
                    controller: 'biddingImplementOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementOpenTenderReadOnly.html',
                    controller: 'biddingImplementOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementOpenTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-商务清标
        $stateProvider.state('biddingImplementBusinessClarigy', {
            url: '/biddingImplementBusinessClarigy',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementBusinessClarigyWf',
            workflowScene: {
                'BusinessClarigy': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessClarigy.html',
                    controller: 'biddingImplementBusinessClarigy_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessClarigy-controller.js'
                },
                'BusinessClarigyReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessClarigyReadOnly.html',
                    controller: 'biddingImplementBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessClarigyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessClarigyReadOnly.html',
                    controller: 'biddingImplementBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessClarigyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessClarigyReadOnly.html',
                    controller: 'biddingImplementBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessClarigyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessClarigyReadOnly.html',
                    controller: 'biddingImplementBusinessClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessClarigyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-技术清标
        $stateProvider.state('biddingImplementTechnologyClarigy', {
            url: '/biddingImplementTechnologyClarigy',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementTechnologyClarigyWf',
            workflowScene: {
                'TechnologyClarigy': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyClarigy.html',
                    controller: 'biddingImplementTechnologyClarigy_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyClarigy-controller.js'
                },
                'TechnologyClarigyReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyClarigyReadOnly.html',
                    controller: 'biddingImplementTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyClarigyReadOnly.html',
                    controller: 'biddingImplementTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyClarigyReadOnly.html',
                    controller: 'biddingImplementTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyClarigyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyClarigyReadOnly.html',
                    controller: 'biddingImplementTechnologyClarigyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyClarigyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-清标汇总
        $stateProvider.state('biddingImplementClarigySummary', {
            url: '/biddingImplementClarigySummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementClarigySummaryWf',
            workflowScene: {
                'ClarigySummary': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigySummary.html',
                    controller: 'biddingImplementClarigySummary_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigySummary-controller.js'
                },
                'ClarigySummaryReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigySummaryReadOnly.html',
                    controller: 'biddingImplementClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigySummaryReadOnly-controller.js'
                },
                'ClarigyReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigySummaryReadOnly.html',
                    controller: 'biddingImplementClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigySummaryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigySummaryReadOnly.html',
                    controller: 'biddingImplementClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigySummaryReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigySummaryReadOnly.html',
                    controller: 'biddingImplementClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigySummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigySummaryReadOnly.html',
                    controller: 'biddingImplementClarigySummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigySummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-澄清答复等待
        $stateProvider.state('biddingImplementClarigyReply', {
            url: '/biddingImplementClarigyReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementClarigyReplyWf',
            workflowScene: {
                'ClarigyReply': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigyReply.html',
                    controller: 'biddingImplementClarigyReply_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigyReply-controller.js'
                },
                'ClarigyReplyReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigyReplyReadOnly.html',
                    controller: 'biddingImplementClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigyReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigyReplyReadOnly.html',
                    controller: 'biddingImplementClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigyReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigyReplyReadOnly.html',
                    controller: 'biddingImplementClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigyReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementClarigyReplyReadOnly.html',
                    controller: 'biddingImplementClarigyReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementClarigyReplyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-商务评标
        $stateProvider.state('biddingImplementBusinessEvaluate', {
            url: '/biddingImplementBusinessEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementBusinessEvaluateWf',
            workflowScene: {
                'BusinessEvaluate': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessEvaluate.html',
                    controller: 'biddingImplementBusinessEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessEvaluate-controller.js'
                },
                'BusinessEvaluateReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessEvaluateReadOnly.html',
                    controller: 'biddingImplementBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessEvaluateReadOnly.html',
                    controller: 'biddingImplementBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessEvaluateReadOnly.html',
                    controller: 'biddingImplementBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementBusinessEvaluateReadOnly.html',
                    controller: 'biddingImplementBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementBusinessEvaluateReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-技术评标
        $stateProvider.state('biddingImplementTechnologyEvaluate', {
            url: '/biddingImplementTechnologyEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementTechnologyEvaluateWf',
            workflowScene: {
                'TechnologyEvaluate': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyEvaluate.html',
                    controller: 'biddingImplementTechnologyEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyEvaluate-controller.js'
                },
                'TechnologyEvaluateReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyEvaluateReadOnly.html',
                    controller: 'biddingImplementTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyEvaluateReadOnly.html',
                    controller: 'biddingImplementTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyEvaluateReadOnly.html',
                    controller: 'biddingImplementTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementTechnologyEvaluateReadOnly.html',
                    controller: 'biddingImplementTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementTechnologyEvaluateReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-评标汇总
        $stateProvider.state('biddingImplementEvaluateSummary', {
            url: '/biddingImplementEvaluateSummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementEvaluateSummaryWf',
            workflowScene: {
                'EvaluateSummary': {
                    templateUrl: './views/bidding/implement/biddingImplementEvaluateSummary.html',
                    controller: 'biddingImplementEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementEvaluateSummary-controller.js'
                },
                'EvaluateSummaryReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementEvaluateSummaryReadOnly.html',
                    controller: 'biddingImplementEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementEvaluateSummaryReadOnly.html',
                    controller: 'biddingImplementEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementEvaluateSummaryReadOnly.html',
                    controller: 'biddingImplementEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementEvaluateSummaryReadOnly.html',
                    controller: 'biddingImplementEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementEvaluateSummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-让利等待
        $stateProvider.state('biddingImplementProfitSharingReply', {
            url: '/biddingImplementProfitSharingReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementProfitSharingReplyWf',
            workflowScene: {
                'ProfitSharingReply': {
                    templateUrl: './views/bidding/implement/biddingImplementProfitSharingReply.html',
                    controller: 'biddingImplementProfitSharingReply_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementProfitSharingReply-controller.js'
                },
                'ProfitSharingReplyReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementProfitSharingReplyReadOnly.html',
                    controller: 'biddingImplementProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementProfitSharingReplyReadOnly.html',
                    controller: 'biddingImplementProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementProfitSharingReplyReadOnly.html',
                    controller: 'biddingImplementProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementProfitSharingReplyReadOnly.html',
                    controller: 'biddingImplementProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementProfitSharingReplyReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-定标
        $stateProvider.state('biddingImplementAward', {
            url: '/biddingImplementAward',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementAwardWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/implement/biddingImplementAward.html',
                    controller: 'biddingImplementAward_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAward-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardReadOnly.html',
                    controller: 'biddingImplementAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardReadOnly.html',
                    controller: 'biddingImplementAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardReadOnly.html',
                    controller: 'biddingImplementAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardReadOnly.html',
                    controller: 'biddingImplementAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-定标审批
        $stateProvider.state('biddingImplementAwardApproval', {
            url: '/biddingImplementAwardApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementAwardApprovalWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApproval.html',
                    controller: 'biddingImplementAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApproval-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
                },
                'AwardApproval': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApproval.html',
                    controller: 'biddingImplementAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApproval-controller.js'
                },
                'AwardApprovalReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
             },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApproval.html',
                    controller: 'biddingImplementAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApproval.html',
                    controller: 'biddingImplementAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
                }, 
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementAwardApprovalReadOnly.html',
                    controller: 'biddingImplementAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementAwardApprovalReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-发放中标通知
        $stateProvider.state('biddingImplementSendAwardNotice', {
            url: '/biddingImplementSendAwardNotice',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementSendAwardNoticeWf',
            workflowScene: {
                'SendAwardNotice': {
                    templateUrl: './views/bidding/implement/biddingImplementSendAwardNotice.html',
                    controller: 'biddingImplementSendAwardNotice_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementSendAwardNotice-controller.js'
                },
                'SendAwardNoticeReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementSendAwardNoticeReadOnly.html',
                    controller: 'biddingImplementSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementSendAwardNoticeReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementSendAwardNoticeReadOnly.html',
                    controller: 'biddingImplementSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementSendAwardNoticeReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementSendAwardNoticeReadOnly.html',
                    controller: 'biddingImplementSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementSendAwardNoticeReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementSendAwardNoticeReadOnly.html',
                    controller: 'biddingImplementSendAwardNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementSendAwardNoticeReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(工程类)-发起合同订立
        $stateProvider.state('biddingImplementStartupContract', {
            url: '/biddingImplementStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingImplementStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/bidding/implement/biddingImplementStartupContract.html',
                    controller: 'biddingImplementStartupContract_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/bidding/implement/biddingImplementStartupContractReadOnly.html',
                    controller: 'biddingImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/implement/biddingImplementStartupContractReadOnly.html',
                    controller: 'biddingImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/implement/biddingImplementStartupContractReadOnly.html',
                    controller: 'biddingImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/implement/biddingImplementStartupContractReadOnly.html',
                    controller: 'biddingImplementStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/implement/biddingImplementStartupContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});