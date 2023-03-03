define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";

        // 招投标(第三方维保类)-拟单
        $stateProvider.state('biddingMaintenanceApplicationState', {
            url: '/biddingMaintenanceApplication',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceApplicationWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceDraft.html',
                    controller: 'biddingMaintenanceDraft_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceDraft-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceDraftReadOnly.html',
                    controller: 'biddingMaintenanceDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceDraftReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceDraftReadOnly.html',
                    controller: 'biddingMaintenanceDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceDraftReadOnly-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceDraftReadOnly.html',
                    controller: 'biddingMaintenanceDraftReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceDraftReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });


        // 招投标(第三方维保类)-审批
        $stateProvider.state('biddingMaintenanceApprovalState', {
            url: '/biddingMaintenanceApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceApproval.html',
                    controller: 'biddingMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceApprovalReadOnly.html',
                    controller: 'biddingMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceApprovalReadOnly.html',
                    controller: 'biddingMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceApproval-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceApproval.html',
                    controller: 'biddingMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceApprovalReadOnly.html',
                    controller: 'biddingMaintenanceApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-发送标书
        $stateProvider.state('biddingMaintenanceSendState', {
            url: '/biddingMaintenanceSend',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceSendWf',
            workflowScene: {
                'Send': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSend.html',
                    controller: 'biddingMaintenanceSend_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSend-controller.js'
                },
                'SendReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSendReadOnly.html',
                    controller: 'biddingMaintenanceSend_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSend-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });


        // 招投标(第三方维保类)-开标
        $stateProvider.state('biddingMaintenanceStartState', {
            url: '/biddingMaintenanceStart',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceStartWf',
            workflowScene: {
                'Start': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStart.html',
                    controller: 'biddingMaintenanceStart_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStart-controller.js'
                },
                'StartReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartReadOnly.html',
                    controller: 'biddingMaintenanceStart_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStart-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartReadOnly.html',
                    controller: 'biddingMaintenanceStart_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStart-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartReadOnly.html',
                    controller: 'biddingMaintenanceStart_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStart-controller.js'
                },
                'Cancel': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceCancelReadOnly.html',
                    controller: 'biddingMaintenanceStart_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStart-controller.js'
                },
                'CancelReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceCancelReadOnly.html',
                    controller: 'biddingMaintenanceStart_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStart-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-（废标审批）
        $stateProvider.state('biddingMaintenanceCancelState', {
            url: '/biddingMaintenanceCancel',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceCancelWf',
            workflowScene: {
                'Cancel': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceCancel.html',
                    controller: 'biddingMaintenanceCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceCancel-controller.js'
                },
                'CancelReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceCancelReadOnly.html',
                    controller: 'biddingMaintenanceCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceCancel-controller.js'
                },
                'CancelApproval': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceCancelReadOnly.html',
                    controller: 'biddingMaintenanceCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceCancel-controller.js'
                },
                'CancelApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceCancelReadOnly.html',
                    controller: 'biddingMaintenanceCancel_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceCancel-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-相关流程-修改时间
        $stateProvider.state('biddingMaintenanceModifyTimeState', {
            url: '/biddingMaintenanceModifyTime',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceModifyTimeWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTime.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-相关流程-修改时间审批
        $stateProvider.state('biddingMaintenanceModifyTimeApprovalState', {
            url: '/biddingMaintenanceModifyTimeApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceModifyTimeWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceModifyTimeReadOnly.html',
                    controller: 'biddingMaintenanceModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceModifyTime-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-商务评标
        $stateProvider.state('biddingMaintenanceBusinessEvaluteState', {
            url: '/biddingMaintenanceBusinessEvaluteTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceEvaluateWf',
            workflowScene: {
                'BusinessEvalute': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceBusinessEvalute.html',
                    controller: 'biddingMaintenanceBusinessEvalute_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceBusinessEvalute-controller.js'
                },
                'BusinessEvaluteReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceBusinessEvaluteReadOnly.html',
                    controller: 'biddingMaintenanceBusinessEvalute_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceBusinessEvalute-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-技术评标
        $stateProvider.state('biddingMaintenanceTechnologyEvaluteState', {
            url: '/biddingMaintenanceTechnologyEvaluteTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceEvaluateWf',
            workflowScene: {
                'TechnologyEvalute': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceTechnologyEvalute.html',
                    controller: 'biddingMaintenanceTechnologyEvalute_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceTechnologyEvalute-controller.js'
                },
                'TechnologyEvaluteReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceTechnologyEvaluteReadOnly.html',
                    controller: 'biddingMaintenanceTechnologyEvalute_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceTechnologyEvalute-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-评标汇总
        $stateProvider.state('biddingMaintenanceSummerState', {
            url: '/biddingMaintenanceSummer',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceSummerWf',
            workflowScene: {
                'Summer': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSummer.html',
                    controller: 'biddingMaintenanceSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSummer-controller.js'
                },
                'SummerReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSummerReadOnly.html',
                    controller: 'biddingMaintenanceSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSummer-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSummerReadOnly.html',
                    controller: 'biddingMaintenanceSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSummer-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSummerReadOnly.html',
                    controller: 'biddingMaintenanceSummer_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSummer-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-让利
        $stateProvider.state('biddingMaintenanceGrantDiscountEnquiryState', {
            url: '/biddingMaintenanceGrantDiscountEnquiry',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceGrantDiscountEnquiryWf',
            workflowScene: {
                'Grant': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceGrantDiscountEnquiry.html',
                    controller: 'biddingMaintenanceGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceGrantDiscountEnquiry-controller.js'
                },
                'GrantReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceGrantDiscountEnquiryReadOnly.html',
                    controller: 'biddingMaintenanceGrantDiscountEnquiry_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceGrantDiscountEnquiry-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });


        // 招投标(第三方维保类)-定标
        $stateProvider.state('biddingMaintenanceSureState', {
            url: '/biddingMaintenanceSure',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceSureWf',
            workflowScene: {
                'Sure': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSure.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                },
                'SureReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureReadOnly.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                },
                'PurchaseApproval': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureReadOnly.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureReadOnly.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSure.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureReadOnly.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureReadOnly.html',
                    controller: 'biddingMaintenanceSure_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSure-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-定标审批
        $stateProvider.state('biddingMaintenanceSureApprovalState', {
            url: '/biddingMaintenanceSureApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceSureApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApproval.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApprovalReadOnly.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                },
                'Sure': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApproval.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                },
                'SureReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApprovalReadOnly.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApproval.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApprovalReadOnly.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceSureApprovalReadOnly.html',
                    controller: 'biddingMaintenanceSureApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceSureApproval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标(第三方维保类)-发起合同订立
        $stateProvider.state('biddingMaintenanceStartContractState', {
            url: '/biddingMaintenanceStartContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingMaintenanceStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartContract.html',
                    controller: 'biddingMaintenanceStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartContractReadOnly.html',
                    controller: 'biddingMaintenanceStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStartContract-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartContractReadOnly.html',
                    controller: 'biddingMaintenanceStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStartContract-controller.js'
                },
                'ReturnReadOnly': {
                    templateUrl: './views/bidding/maintenance/biddingMaintenanceStartContractReadOnly.html',
                    controller: 'biddingMaintenanceStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/maintenance/biddingMaintenanceStartContract-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});