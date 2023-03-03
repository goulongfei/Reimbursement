define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/";

        // 询价(营销类)-编制询价信息
        $stateProvider.state('inquiryPriceMarketingApplicationState', {
            url: '/inquiryPriceMarketingApplication',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingApplicationWf',
            workflowScene: {
                'Application': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingApplication.html',
                    controller: 'inquiryPriceMarketingApplication_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingApplication-controller.js'
                },
                'ApplicationReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 询价(营销类)-开标
        $stateProvider.state('inquiryPriceMarketingOpenTenderState', {
            url: '/inquiryPriceMarketingOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingOpenTender.html',
                    controller: 'inquiryPriceMarketingOpenTender_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly.html',
                    controller: 'inquiryPriceMarketingOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly.html',
                    controller: 'inquiryPriceMarketingOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly.html',
                    controller: 'inquiryPriceMarketingOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly.html',
                    controller: 'inquiryPriceMarketingOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingOpenTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 询价(营销类)-废标申请
        $stateProvider.state('inquiryPriceMarketingNullifiedApplicationState', {
            url: '/inquiryPriceMarketingNullifiedApplication',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingNullifiedApplicationWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplication.html',
                    controller: 'inquiryPriceMarketingNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplication-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly.html',
                    controller: 'inquiryPriceMarketingNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApplicationReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 询价(营销类)-废标审批
        $stateProvider.state('inquiryPriceMarketingNullifiedApprovalState', {
            url: '/inquiryPriceMarketingNullifiedApproval',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingNullifiedApprovalWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'NullifiedApproval': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'NullifiedApprovalReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval.html',
                    controller: 'inquiryPriceMarketingNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingNullifiedApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 询价(营销类)-评标让利
        $stateProvider.state('inquiryPriceMarketingEvaluateGrantState', {
            url: '/inquiryPriceMarketingEvaluateGrant',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingEvaluateGrantWf',
            workflowScene: {
                'EvaluateGrant': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrant.html',
                    controller: 'inquiryPriceMarketingEvaluateGrant_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrant-controller.js'
                },
                'EvaluateGrantReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly.html',
                    controller: 'inquiryPriceMarketingEvaluateGrantReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly.html',
                    controller: 'inquiryPriceMarketingEvaluateGrantReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly.html',
                    controller: 'inquiryPriceMarketingEvaluateGrantReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly.html',
                    controller: 'inquiryPriceMarketingEvaluateGrantReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingEvaluateGrantReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 询价(营销类)-让利等待
        $stateProvider.state('inquiryPriceMarketingProfitSharingReplyState', {
            url: '/inquiryPriceMarketingProfitSharingReply',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingProfitSharingReplyWf',
            workflowScene: {
                'ProfitSharingReply': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReply.html',
                    controller: 'inquiryPriceMarketingProfitSharingReply_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReply-controller.js'
                },
                'ProfitSharingReplyReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly.html',
                    controller: 'inquiryPriceMarketingProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly.html',
                    controller: 'inquiryPriceMarketingProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly.html',
                    controller: 'inquiryPriceMarketingProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly.html',
                    controller: 'inquiryPriceMarketingProfitSharingReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingProfitSharingReplyReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 询价(营销类)-定标
        $stateProvider.state('inquiryPriceMarketingAwardState', {
            url: '/inquiryPriceMarketingAward',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingAwardWf',
            workflowScene: {
                'Award': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAward.html',
                    controller: 'inquiryPriceMarketingAward_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAward-controller.js'
                },
                'AwardReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 询价(营销类)-定标审批
        $stateProvider.state('inquiryPriceMarketingAwardApprovalState', {
            url: '/inquiryPriceMarketingAwardApproval',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingAwardApprovalWf',
            workflowScene: {
                'ApprovalEdit': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardApproval.html',
                    controller: 'cinquiryPriceMarketingAwardApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardApproval-controller.js'
                },
                'AwardApprove': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardApproval.html',
                    controller: 'cinquiryPriceMarketingAwardApproval_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardApproval-controller.js'
                },
                'AwardApproveReadonly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly.html',
                    controller: 'inquiryPriceMarketingAwardApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingAwardApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });

        // 询价(营销类)-发起合同订立
        $stateProvider.state('inquiryPriceMarketingStartupContractState', {
            url: '/inquiryPriceMarketingStartupContract',
            useWorkflow: true,
            workflowUrlBase: '/InquiryPriceMarketingStartupContractWf',
            workflowScene: {
                'StartupContract': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingStartupContract.html',
                    controller: 'inquiryPriceMarketingStartupContract_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingStartupContract-controller.js'
                },
                'StartupContractReadOnly': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly.html',
                    controller: 'inquiryPriceMarketingStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly.html',
                    controller: 'inquiryPriceMarketingStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly.html',
                    controller: 'inquiryPriceMarketingStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly.html',
                    controller: 'inquiryPriceMarketingStartupContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/inquiryPriceMarketing/inquiryPriceMarketingStartupContractReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});