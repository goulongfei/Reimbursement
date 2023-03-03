define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(土地开发类)-拟单
        $stateProvider.state('biddingLandDevelopDraftState', {
            url: '/biddingLandDevelopDraft',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopDraftWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraft.html',
                    controller: 'biddingLandDevelopDraft_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                'Evaluate': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                'EvaluateReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                'SendTender': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                },
                "SendTenderReadOnly": {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopDraftReadOnly.html',
                    controller: 'biddingLandDevelopDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopDraftReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-入围审批
        $stateProvider.state('biddingLandDevelopApprovalState', {
            url: '/biddingLandDevelopApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopApproveWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopApproval.html',
                    controller: 'biddingLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopApprovalReadOnly.html',
                    controller: 'biddingLandDevelopApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopApproval.html',
                    controller: 'biddingLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopApproval-controller.js'
                },
                'DefaultCirculationSceneReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopApprovalReadOnly.html',
                    controller: 'biddingLandDevelopApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopApproval.html',
                    controller: 'biddingLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopApproval.html',
                    controller: 'biddingLandDevelopApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-发放标书
        $stateProvider.state('biddingLandDevelopSendTenderState', {
            url: '/biddingLandDevelopSendTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopSendTenderWf',
            workflowScene: {
                'SendTender': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopSendTender.html',
                    controller: 'biddingLandDevelopSendTender_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopSendTender-controller.js'
                },
                'SendTenderReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopSendTenderReadOnly.html',
                    controller: 'biddingLandDevelopSendTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopSendTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopSendTenderReadOnly.html',
                    controller: 'biddingLandDevelopSendTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopSendTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-开标
        $stateProvider.state('biddingLandDevelopOpenTenderState', {
            url: '/biddingLandDevelopOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopOpenTenderWf',
            workflowScene: {
                'Start': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopOpenTender.html',
                    controller: 'biddinglandDevelopStart_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopOpenTender-controller.js'
                },
                'StartReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopOpenTenderReadOnly.html',
                    controller: 'biddinglandDevelopStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopOpenTenderReadOnly-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopOpenTenderReadOnly.html',
                    controller: 'biddinglandDevelopStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopOpenTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopOpenTenderReadOnly.html',
                    controller: 'biddinglandDevelopStartReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopOpenTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标（土地开发类）-废标
        $stateProvider.state('biddingLandDevelopCancelTenderState', {
            url: '/biddingLandDevelopCancelTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopCancelTenderWf',
            workflowScene: {
                'Cancel': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopCancelTender.html',
                    controller: 'biddingLandDevelopCancelTender_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopCancelTender-controller.js'
                },
                'CancelReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopCancelTenderReadOnly.html',
                    controller: 'biddingLandDevelopCancelTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopCancelTenderReadOnly-controller.js'
                },
                'CancelApproval': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopCancelTenderReadOnly.html',
                    controller: 'biddingLandDevelopCancelTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopCancelTenderApproval-controller.js'
                },
                'CancelApprovalReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopCancelTenderReadOnly.html',
                    controller: 'biddingLandDevelopCancelTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopCancelTenderApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopCancelTenderReadOnly.html',
                    controller: 'biddingLandDevelopCancelTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopCancelTenderReadOnly-controller.js'
                },

            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-商务评标
        $stateProvider.state('biddingLandDevelopBusinessEvaluteTenderState', {
            url: '/biddingLandDevelopBusinessEvaluteTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopEvaluateTenderWf',
            workflowScene: {
                'BusinessEvalute': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTender.html',
                    controller: 'biddingLandDevelopBusinessEvaluteTender_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTender-controller.js'
                },
                'BusinessEvaluteReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTenderReadOnly.html',
                    controller: 'biddingLandDevelopBusinessEvaluteTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTenderReadOnly-controller.js'
                },
                'DefaultBusinessEvaluteCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTenderReadOnly.html',
                    controller: 'biddingLandDevelopBusinessEvaluteTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTenderReadOnly-controller.js'
                },
                'DefaultTechnologyEvaluteCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTenderReadOnly.html',
                    controller: 'biddingLandDevelopBusinessEvaluteTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopBusinessEvaluteTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-技术评标
        $stateProvider.state('biddingLandDevelopTechnologyEvaluteTenderState', {
            url: '/biddingLandDevelopTechnologyEvaluteTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopEvaluateTenderWf',
            workflowScene: {
                'TechnologyEvalute': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTender.html',
                    controller: 'biddingLandDevelopTechnologyEvaluteTender_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTender-controller.js'
                },
                'TechnologyEvaluteReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTenderReadOnly.html',
                    controller: 'biddingLandDevelopTechnologyEvaluteTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTenderReadOnly-controller.js'
                },
                'DefaultTechnologyEvaluteCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTenderReadOnly.html',
                    controller: 'biddingLandDevelopTechnologyEvaluteTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTenderReadOnly-controller.js'
                },
                 'DefaultBusinessEvaluteCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTenderReadOnly.html',
                    controller: 'biddingLandDevelopTechnologyEvaluteTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopTechnologyEvaluteTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-评标汇总
        $stateProvider.state('biddingLandDevelopEvaluateSummaryState', {
            url: '/biddingLandDevelopEvaluateSummary',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopEvaluteSummaryWf',
            workflowScene: {
                'Summer': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummary.html',
                    controller: 'biddingLandDevelopEvaluateSummary_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummary-controller.js'
                },
                'SummerReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'Evaluate': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'EvaluateReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'Sure': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'SureReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'SureApprove': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
                'SureApproveReadonly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly.html',
                    controller: 'biddingLandDevelopEvaluateSummaryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopEvaluateSummaryReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发)-让利
        $stateProvider.state('biddingLandDevelopGrantDiscountEnquiryState', {
            url: '/biddingLandDevelopGrantDiscountEnquiry',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopGrantDiscountEnquiryWf',
            workflowScene: {
                'Grant': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopGrant.html',
                    controller: 'biddinglandDevelopGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopGrant-controller.js'
                },
                'GrantReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopGrantReadOnly.html',
                    controller: 'biddinglandDevelopGrantDiscountEnquiryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopGrantReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopGrantReadOnly.html',
                    controller: 'biddinglandDevelopGrantDiscountEnquiryReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopGrantReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-定标
        $stateProvider.state('biddingLandDevelopConfirmTenderState', {
            url: '/biddingLandDevelopConfirmTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopConfirmTenderWf',
            workflowScene: {
                'Sure': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTender.html',
                    controller: 'biddingLandDevelopConfirmTender_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTender-controller.js'
                },
                'SureReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderReadOnly.html',
                    controller: 'biddingLandDevelopConfirmTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderReadOnly.html',
                    controller: 'biddingLandDevelopConfirmTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

          // 招投标(土地开发类)-定标审批
        $stateProvider.state('biddingLandDevelopConfirmTenderApprovalState', {
            url: '/biddingLandDevelopConfirmTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopConfirmTenderApprovalWf',
            workflowScene: {
                'SureApprove': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderApproval.html',
                    controller: 'biddingLandDevelopConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderApproval-controller.js'
                },
                'SureApproveReadonly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly.html',
                    controller: 'biddingLandDevelopConfirmTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderApproval.html',
                    controller: 'biddingLandDevelopConfirmTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderApproval-controller.js'
                },
                'DefaultCirculationSceneReadonly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly.html',
                    controller: 'biddingLandDevelopConfirmTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly-controller.js'
                },
                'Sure': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly.html',
                    controller: 'biddingLandDevelopConfirmTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly-controller.js'
                },
                'SureReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddingLandDevelopConfirmTenderApprovalReadOnly.html',
                    controller: 'biddingLandDevelopConfirmTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddingLandDevelopConfirmTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(土地开发类)-发起合同订立
        $stateProvider.state('biddingLandDevelopStartContractState', {
            url: '/biddingLandDevelopStartContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingLandDevelopStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopStartContract.html',
                    controller: 'biddinglandDevelopStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopStartContractReadOnly.html',
                    controller: 'biddinglandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopStartContractReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/landDevelop/biddinglandDevelopStartContractReadOnly.html',
                    controller: 'biddinglandDevelopStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/landDevelop/biddinglandDevelopStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

    }]);
});