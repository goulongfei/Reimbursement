define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(项目定义类)-编制招标信息
        $stateProvider.state('biddingProjectDefineApplicationState', {
            url: '/biddingProjectDefineApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApplication.html',
                    controller: 'biddingProjectDefineApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApplicationReadOnly.html',
                    controller: 'biddingProjectDefineApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApplicationReadOnly.html',
                    controller: 'biddingProjectDefineApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApplicationReadOnly.html',
                    controller: 'biddingProjectDefineApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApplicationReadOnly.html',
                    controller: 'biddingProjectDefineApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-入围审批
        $stateProvider.state('biddingProjectDefineApprovalState', {
            url: '/biddingProjectDefineApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineApproveWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApproval.html',
                    controller: 'biddingProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApproval-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApprovalReadOnly.html',
                    controller: 'biddingProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApprovalReadOnly-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApproval.html',
                    controller: 'biddingProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApproval.html',
                    controller: 'biddingProjectDefineApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApprovalReadOnly.html',
                    controller: 'biddingProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApprovalReadOnly.html',
                    controller: 'biddingProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApprovalReadOnly.html',
                    controller: 'biddingProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineApprovalReadOnly.html',
                    controller: 'biddingProjectDefineApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-发放标书
        $stateProvider.state('biddingProjectDefineIssueBiddingDocumentState', {
            url: '/biddingProjectDefineIssueBiddingDocument',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineIssueBiddingDocumentWf',
            workflowScene: {
                'IssueBiddingDocument': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineIssueBiddingDocument.html',
                    controller: 'biddingProjectDefineIssueBiddingDocument_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineIssueBiddingDocument-controller.js'
                },
                'IssueBiddingDocumentReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingProjectDefineIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingProjectDefineIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingProjectDefineIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly.html',
                    controller: 'biddingProjectDefineIssueBiddingDocumentReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineIssueBiddingDocumentReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-开标
        $stateProvider.state('biddingProjectDefineOpenTenderState', {
            url: '/biddingProjectDefineOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineOpenTender.html',
                    controller: 'biddingProjectDefineOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly.html',
                    controller: 'biddingProjectDefineOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly.html',
                    controller: 'biddingProjectDefineOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly.html',
                    controller: 'biddingProjectDefineOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly.html',
                    controller: 'biddingProjectDefineOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineOpenTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-废标申请
        $stateProvider.state('biddingProjectDefineNullifiedApplication', {
            url: '/biddingProjectDefineNullifiedApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineNullifiedApplicationWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApplication.html',
                    controller: 'biddingProjectDefineNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApplication-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly.html',
                    controller: 'biddingProjectDefineNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly.html',
                    controller: 'biddingProjectDefineNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly.html',
                    controller: 'biddingProjectDefineNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly.html',
                    controller: 'biddingProjectDefineNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApplicationReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        
        // 招投标(项目定义类)-废标审批
        $stateProvider.state('biddingProjectDefineNullifiedApproval', {
            url: '/biddingProjectDefineNullifiedApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineNullifiedApprovalWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'NullifiedApproval': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'NullifiedApprovalReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineNullifiedApproval.html',
                    controller: 'biddingProjectDefineNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineNullifiedApproval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-商务评标
        $stateProvider.state('biddingProjectDefineBusinessEvaluateState', {
            url: '/biddingProjectDefineBusinessEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineBusinessEvaluateWf',
            workflowScene: {
                'BusinessEvaluate': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineBusinessEvaluate.html',
                    controller: 'biddingProjectDefineBusinessEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineBusinessEvaluate-controller.js'
                },
                'BusinessEvaluateReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineBusinessEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineBusinessEvaluateReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-技术评标
        $stateProvider.state('biddingProjectDefineTechnologyEvaluateState', {
            url: '/biddingProjectDefineTechnologyEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineTechnologyEvaluateWf',
            workflowScene: {
                'TechnologyEvaluate': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineTechnologyEvaluate.html',
                    controller: 'biddingProjectDefineTechnologyEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineTechnologyEvaluate-controller.js'
                },
                'TechnologyEvaluateReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly.html',
                    controller: 'biddingProjectDefineTechnologyEvaluateReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineTechnologyEvaluateReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-评标汇总
        $stateProvider.state('biddingProjectDefineEvaluateSummaryState', {
            url: '/biddingProjectDefineEvaluateSummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineEvaluateSummaryWf',
            workflowScene: {
                'EvaluateSummary': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineEvaluateSummary.html',
                    controller: 'biddingProjectDefineEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineEvaluateSummary-controller.js'
                },
                'EvaluateSummaryReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly.html',
                    controller: 'biddingProjectDefineEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly.html',
                    controller: 'biddingProjectDefineEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly.html',
                    controller: 'biddingProjectDefineEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly.html',
                    controller: 'biddingProjectDefineEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineEvaluateSummaryReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-让利等待
        $stateProvider.state('biddingProjectDefineProfitSharingReplyState', {
            url: '/biddingProjectDefineProfitSharingReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineProfitSharingReplyWf',
            workflowScene: {
                'ProfitSharingReply': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineProfitSharingReply.html',
                    controller: 'biddingProjectDefineProfitSharingReply_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineProfitSharingReply-controller.js'
                },
                'ProfitSharingReplyReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly.html',
                    controller: 'biddingProjectDefineProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly.html',
                    controller: 'biddingProjectDefineProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly.html',
                    controller: 'biddingProjectDefineProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly.html',
                    controller: 'biddingProjectDefineProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineProfitSharingReplyReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-定标
        $stateProvider.state('biddingProjectDefineAwardState', {
            url: '/biddingProjectDefineAward',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineAwardWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAward.html',
                    controller: 'biddingProjectDefineAward_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAward-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardReadOnly.html',
                    controller: 'biddingProjectDefineAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardReadOnly.html',
                    controller: 'biddingProjectDefineAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardReadOnly.html',
                    controller: 'biddingProjectDefineAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardReadOnly.html',
                    controller: 'biddingProjectDefineAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-定标审批
        $stateProvider.state('biddingProjectDefineAwardApprovalState', {
            url: '/biddingProjectDefineAwardApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineAwardApprovalWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApproval.html',
                    controller: 'biddingProjectDefineAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApproval-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly.html',
                    controller: 'biddingProjectDefineAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly-controller.js'
                },
                'AwardApprove': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApproval.html',
                    controller: 'biddingProjectDefineAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApproval.html',
                    controller: 'biddingProjectDefineAwardApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApproval-controller.js'
                },
                'AwardApproveReadonly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly.html',
                    controller: 'biddingProjectDefineAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly.html',
                    controller: 'biddingProjectDefineAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly.html',
                    controller: 'biddingProjectDefineAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly.html',
                    controller: 'biddingProjectDefineAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineAwardApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(项目定义类)-发起合同订立
        $stateProvider.state('biddingProjectDefineStartupContractState', {
            url: '/biddingProjectDefineStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingProjectDefineStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineStartupContract.html',
                    controller: 'biddingProjectDefineStartupContract_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly.html',
                    controller: 'biddingProjectDefineStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly.html',
                    controller: 'biddingProjectDefineStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly.html',
                    controller: 'biddingProjectDefineStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly.html',
                    controller: 'biddingProjectDefineStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/projectDefine/biddingProjectDefineStartupContractReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});