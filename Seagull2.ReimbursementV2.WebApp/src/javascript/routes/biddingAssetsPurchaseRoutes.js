define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(固定资产采购类)
        //-拟单
        $stateProvider.state('biddingAssetsPurchaseDraft', {
            url: '/biddingAssetsPurchaseDraft',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseDraftWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraft.html',
                    controller: 'biddingAssetsPurchaseDraft_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly.html',
                    controller: 'biddingAssetsPurchaseDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraft.html',
                    controller: 'biddingAssetsPurchaseDraft_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraft-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly.html',
                    controller: 'biddingAssetsPurchaseDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly.html',
                    controller: 'biddingAssetsPurchaseDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 拟单审批（入围审批）
        $stateProvider.state('biddingAssetsPurchaseDraftApproval', {
            url: '/biddingAssetsPurchaseDraftApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseDraftApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval.html',
                    controller: 'biddingAssetsPurchaseDraftApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval.html',
                    controller: 'biddingAssetsPurchaseDraftApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftApprovalReadOnly-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval.html',
                    controller: 'biddingAssetsPurchaseDraftApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval.html',
                    controller: 'biddingAssetsPurchaseDraftApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval.html',
                    controller: 'biddingAssetsPurchaseDraftApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftApproval.html',
                    controller: 'biddingAssetsPurchaseDraftApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftApprovalReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly.html',
                    controller: 'biddingAssetsPurchaseDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseDraftReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 发放标书
        $stateProvider.state('biddingAssetsPurchaseSendTender', {
            url: '/biddingAssetsPurchaseSendTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseSendTenderWf',
            workflowScene: {
                'SendTender': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseSendTender.html',
                    controller: 'biddingAssetsPurchaseSendTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseSendTender-controller.js'
                },
                'SendTenderReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseSendTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseSendTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseSendTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseSendTender.html',
                    controller: 'biddingAssetsPurchaseSendTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseSendTender-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseSendTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseSendTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseSendTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseSendTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseSendTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseSendTenderReadOnly-controller'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 开标
        $stateProvider.state('biddingAssetsPurchaseOpenTender', {
            url: '/biddingAssetsPurchaseOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseOpenTender.html',
                    controller: 'biddingAssetsPurchaseOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseOpenTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseOpenTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseOpenTender.html',
                    controller: 'biddingAssetsPurchaseOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseOpenTender-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseOpenTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseOpenTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseOpenTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 商务评标
        $stateProvider.state('biddingAssetsPurchaseBusinessEvaluateTender', {
            url: '/biddingAssetsPurchaseBusinessEvaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseBusinessEvaluateTenderWf',
            workflowScene: {
                'BusinessEvaluate': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTender.html',
                    controller: 'biddingAssetsPurchaseBusinessEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTender-controller'
                },
                'BusinessEvaluateReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseBusinessEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTender.html',
                    controller: 'biddingAssetsPurchaseBusinessEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTender-controller'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseBusinessEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseBusinessEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseBusinessEvaluateTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 技术评标
        $stateProvider.state('biddingAssetsPurchaseTechnologyEvaluateTender', {
            url: '/biddingAssetsPurchaseTechnologyEvaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseTechnologyEvaluateTenderWf',
            workflowScene: {
                'TechnologyEvaluate': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTender.html',
                    controller: 'biddingAssetsPurchaseTechnologyEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTender-controller'
                },
                'TechnologyEvaluateReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTender.html',
                    controller: 'biddingAssetsPurchaseTechnologyEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTender-controller'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseTechnologyEvaluateTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 评标汇总
        $stateProvider.state('biddingAssetsPurchaseEvaluateSummary', {
            url: '/biddingAssetsPurchaseEvaluateSummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseEvaluteSummaryWf',
            workflowScene: {
                'EvaluateSummary': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummary.html',
                    controller: 'biddingAssetsPurchaseEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummary-controller'
                },
                'EvaluateSummaryReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummaryReadOnly.html',
                    controller: 'biddingAssetsPurchaseEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummaryReadOnly-controller'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummary.html',
                    controller: 'biddingAssetsPurchaseEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummary-controller'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummaryReadOnly.html',
                    controller: 'biddingAssetsPurchaseEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummaryReadOnly-controller'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummaryReadOnly.html',
                    controller: 'biddingAssetsPurchaseEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseEvaluateSummaryReadOnly-controller'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 让利环节
        $stateProvider.state('biddingAssetsPurchaseGrantDiscountEnquiry', {
            url: '/biddingAssetsPurchaseGrantDiscountEnquiry',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseGrantDiscountEnquiryWf',
            workflowScene: {
                'ProfitSharingReply': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiry.html',
                    controller: 'biddingAssetsPurchaseGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiry-controller.js'
                },
                'ProfitSharingReplyReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiryReadOnly.html',
                    controller: 'biddingAssetsPurchaseGrantDiscountEnquiryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiryReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiry.html',
                    controller: 'biddingAssetsPurchaseGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiry-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiryReadOnly.html',
                    controller: 'biddingAssetsPurchaseGrantDiscountEnquiryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiryReadOnly.html',
                    controller: 'biddingAssetsPurchaseGrantDiscountEnquiryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseGrantDiscountEnquiryReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 定标
        $stateProvider.state('biddingAssetsPurchaseConfirmTender', {
            url: '/biddingAssetsPurchaseConfirmTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseConfirmTenderWf',
            workflowScene: {
                'ConfirmTender': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTender.html',
                    controller: 'biddingAssetsPurchaseConfirmTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTender-controller.js'
                },
                'ConfirmTenderReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTender.html',
                    controller: 'biddingAssetsPurchaseConfirmTender_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTender-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderReadOnly.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 定标审批
        $stateProvider.state('biddingAssetsPurchaseConfirmTenderApproval', {
            url: '/biddingAssetsPurchaseConfirmTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseConfirmTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTederApproval.html',
                    controller: 'biddingAssetsPurchaseConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseConfirmTenderApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 发起合同订立
        $stateProvider.state('biddingAssetsPurchaseStartContract', {
            url: '/biddingAssetsPurchaseStartContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseStartContract.html',
                    controller: 'biddingAssetsPurchaseStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseStartContractReadOnly.html',
                    controller: 'biddingAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseStartContractReadOnly-controller.js'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseStartContract.html',
                    controller: 'biddingAssetsPurchaseStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseStartContract-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/f/assetsPurchase/biddingAssetsPurchaseStartContractReadOnly.html',
                    controller: 'biddingAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseStartContractReadOnly.html',
                    controller: 'biddingAssetsPurchaseStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseStartContractReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 废标
        $stateProvider.state('biddingAssetsPurchaseNullifiedApplication', {
            url: '/biddingAssetsPurchaseNullifiedApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseNullifiedApplicationWf',
            workflowScene: {
                'NullifiedApplication': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplication.html',
                    controller: 'biddingAssetsPurchaseNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplication-controller.js'
                },
                'NullifiedApplicationReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplicationReadOnly.html',
                    controller: 'biddingAssetsPurchaseNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplicationReadOnly-controller'
                },
                'DefaultScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplication.html',
                    controller: 'biddingAssetsPurchaseNullifiedApplication_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplication-controller.js'
                },
                'DefaultReadOnlyScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplicationReadOnly.html',
                    controller: 'biddingAssetsPurchaseNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplicationReadOnly-controller'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplicationReadOnly.html',
                    controller: 'biddingAssetsPurchaseNullifiedApplicationReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApplicationReadOnly-controller'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 废标审批
        $stateProvider.state('biddingAssetsPurchaseNullifiedApproval', {
            url: '/biddingAssetsPurchaseNullifiedApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingAssetsPurchaseNullifiedApprovalWf',
            workflowScene: {
                'NullifiedApproval': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval.html',
                    controller: 'biddingAssetsPurchaseNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval-controller.js'
                },
                'NullifiedApprovalReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval.html',
                    controller: 'biddingAssetsPurchaseNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval-controller.js'
                },
                'ApprovalEdit': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval.html',
                    controller: 'biddingAssetsPurchaseNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval-controller.js'
                },
                'Approval': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval.html',
                    controller: 'biddingAssetsPurchaseNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval-controller.js'
                },
                'ApprovalReadOnly': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval.html',
                    controller: 'biddingAssetsPurchaseNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval.html',
                    controller: 'biddingAssetsPurchaseNullifiedApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/assetsPurchase/biddingAssetsPurchaseNullifiedApproval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});