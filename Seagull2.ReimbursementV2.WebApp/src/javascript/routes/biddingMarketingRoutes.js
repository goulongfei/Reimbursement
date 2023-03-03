define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(营销类)-拟单
        $stateProvider.state('biddingMarketingDraftState', {
            url: '/biddingMarketingDraft',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingDraftWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/marketing/biddingMarketingDraft.html',
                    controller: 'biddingMarketingDraft_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingDraftReadOnly.html',
                    controller: 'biddingMarketingDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingDraftReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingDraftReadOnly.html',
                    controller: 'biddingMarketingDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingDraftReadOnly-controller.js'
                },
                'GrantReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingDraftReadOnly.html',
                    controller: 'biddingMarketingDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingDraftReadOnly-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingDraftReadOnly.html',
                    controller: 'biddingMarketingDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingDraftReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-审批
        $stateProvider.state('biddingMarketingApprovalState', {
            url: '/biddingMarketingApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingApproveWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/marketing/biddingMarketingApproval.html',
                    controller: 'biddingMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingApprovalReadOnly.html',
                    controller: 'biddingMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/marketing/biddingMarketingApproval.html',
                    controller: 'biddingMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/marketing/biddingMarketingApproval.html',
                    controller: 'biddingMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingApprovalReadOnly.html',
                    controller: 'biddingMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/marketing/biddingMarketingApprovalReadOnly.html',
                    controller: 'biddingMarketingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-发送标书
        $stateProvider.state('biddingMarketingSendState', {
            url: '/biddingMarketingSend',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingSendWf',
            workflowScene: {
                'Send': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSend.html',
                    controller: 'biddingMarketingSend_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSend-controller.js'
                },
                'SendReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSendReadOnly.html',
                    controller: 'biddingMarketingSendReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSendReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-开标
        $stateProvider.state('biddingMarketingStartState', {
            url: '/biddingMarketingStart',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingStartWf',
            workflowScene: {
                'Start': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStart.html',
                    controller: 'biddingMarketingStart_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStart-controller.js'
                },
                'StartReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartReadOnly.html',
                    controller: 'biddingMarketingStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartReadOnly-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartReadOnly.html',
                    controller: 'biddingMarketingStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartReadOnly-controller.js'
                },
                'Cancel': {
                    templateUrl: './views/bidding/marketing/biddingMarketingCancelReadOnly.html',
                    controller: 'biddingMarketingStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartReadOnly-controller.js'
                },
                'CancelReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingCancelReadOnly.html',
                    controller: 'biddingMarketingStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartReadOnly.html',
                    controller: 'biddingMarketingStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartReadOnly.html',
                    controller: 'biddingMarketingStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-（废标审批）
        $stateProvider.state('biddingMarketingCancelState', {
            url: '/biddingMarketingCancel',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingCancelWf',
            workflowScene: {
                'Cancel': {
                    templateUrl: './views/bidding/marketing/biddingMarketingCancel.html',
                    controller: 'biddingMarketingCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingCancel-controller.js'
                },
                'CancelReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingCancelReadOnly.html',
                    controller: 'biddingMarketingCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingCancel-controller.js'
                },
                'CancelApproval': {
                    templateUrl: './views/bidding/marketing/biddingMarketingCancelReadOnly.html',
                    controller: 'biddingMarketingCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingCancel-controller.js'
                },
                'CancelApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingCancelReadOnly.html',
                    controller: 'biddingMarketingCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingCancel-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-相关流程-修改时间
        $stateProvider.state('biddingMarketingModifyTimeState', {
            url: '/biddingMarketingModifyTime',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingModifyTimeWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/marketing/biddingMarketingModifyTime.html',
                    controller: 'biddingMarketingModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingModifyTime-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingModifyTimeReadOnly.html',
                    controller: 'biddingMarketingModifyTimeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingModifyTimeReadOnly-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/bidding/marketing/biddingMarketingModifyTimeReadOnly.html',
                    controller: 'biddingMarketingModifyTimeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingModifyTimeReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingModifyTimeReadOnly.html',
                    controller: 'biddingMarketingModifyTimeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingModifyTimeReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-评标
        $stateProvider.state('biddingMarketingEvaluateState', {
            url: '/biddingMarketingEvaluate',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingEvaluateWf',
            workflowScene: {
                'Evaluate': {
                    templateUrl: './views/bidding/marketing/biddingMarketingEvaluate.html',
                    controller: 'biddingMarketingEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingEvaluate-controller.js'
                },
                'EvaluateReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingEvaluateReadOnly.html',
                    controller: 'biddingMarketingEvaluate_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingEvaluate-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-评标汇总
        $stateProvider.state('biddingMarketingSummerState', {
            url: '/biddingMarketingSummer',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingSummerWf',
            workflowScene: {
                'Summer': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSummer.html',
                    controller: 'biddingMarketingSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSummer-controller.js'
                },
                'SummerReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSummerReadOnly.html',
                    controller: 'biddingMarketingSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSummer-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSummerReadOnly.html',
                    controller: 'biddingMarketingSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSummer-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSummerReadOnly.html',
                    controller: 'biddingMarketingSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSummer-controller.js'
                },
                'GrantReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSummerReadOnly.html',
                    controller: 'biddingMarketingSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSummer-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSummerReadOnly.html',
                    controller: 'biddingMarketingSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSummer-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-让利
        $stateProvider.state('biddingMarketingGrantDiscountEnquiryState', {
            url: '/biddingMarketingGrantDiscountEnquiry',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingGrantDiscountEnquiryWf',
            workflowScene: {
                'Grant': {
                    templateUrl: './views/bidding/marketing/biddingMarketingGrantDiscountEnquiry.html',
                    controller: 'biddingMarketingGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingGrantDiscountEnquiry-controller.js'
                },
                'GrantReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingGrantDiscountEnquiryReadOnly.html',
                    controller: 'biddingMarketingGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingGrantDiscountEnquiry-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-定标
        $stateProvider.state('biddingMarketingSureState', {
            url: '/biddingMarketingSure',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingSureWf',
            workflowScene: {
                'Sure': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSure.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                },
                'SureReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSureReadOnly.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSureReadOnly.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSureReadOnly.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSure.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSureReadOnly.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/marketing/biddingMarketingSureReadOnly.html',
                    controller: 'biddingMarketingSure_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingSure-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(营销类)-发起合同订立
        $stateProvider.state('biddingMarketingStartContractState', {
            url: '/biddingMarketingStartContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMarketingStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartContract.html',
                    controller: 'biddingMarketingStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartContractReadOnly.html',
                    controller: 'biddingMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartContractReadOnly.html',
                    controller: 'biddingMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartContractReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/marketing/biddingMarketingStartContractReadOnly.html',
                    controller: 'biddingMarketingStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/marketing/biddingMarketingStartContractReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});