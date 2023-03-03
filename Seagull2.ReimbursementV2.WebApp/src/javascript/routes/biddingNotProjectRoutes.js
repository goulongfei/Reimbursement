define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";
        // 招投标（非项目服务类）-编辑招标信息
        $stateProvider.state('biddingNotProjectCompilingTender', {
            url: '/biddingNotProjectCompilingTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectCompilingTenderWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTender.html',
                    controller: 'biddingNotProjectCompilingTender_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTender-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderReadOnly-controller.js'
                },
                'ReturnTender': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderReadOnly-controller.js'
                },
                'ReturnTenderReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderReadOnly-controller.js'
                },
                'CancelTender': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderReadOnly-controller.js'
                },
                'CancelTenderReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-编辑招标信息审批
        $stateProvider.state('biddingNotProjectCompilingTenderApproval', {
            url: '/biddingNotProjectCompilingTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectCompilingTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderApproval.html',
                    controller: 'biddingNotProjectCompilingTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderApprovalReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderApproval.html',
                    controller: 'biddingNotProjectCompilingTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderApproval.html',
                    controller: 'biddingNotProjectCompilingTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderApproval-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderApprovalReadOnly.html',
                    controller: 'biddingNotProjectCompilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderApprovalReadOnly-controller.js'
                },
                  'ApprovalEdit': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCompilingTenderApproval.html',
                    controller: 'biddingNotProjectCompilingTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCompilingTenderApproval-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-发放标书
        $stateProvider.state('biddingNotProjectTendersIssued', {
            url: '/biddingNotProjectTendersIssued',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectTendersIssuedWf',
            workflowScene: {
                'TendersIssued': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectTendersIssued.html',
                    controller: 'biddingNotProjectTendersIssued_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectTendersIssued-controller.js'
                },
                'TendersIssuedReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectTendersIssuedReadOnly.html',
                    controller: 'biddingNotProjectTendersIssuedReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectTendersIssuedReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-开标
        $stateProvider.state('biddingNotProjectOpenTender', {
            url: '/biddingNotProjectOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectOpenTender.html',
                    controller: 'biddingNotProjectOpenTender_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectOpenTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectOpenTenderReadOnly.html',
                    controller: 'biddingNotProjectOpenTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectOpenTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-废标
        $stateProvider.state('biddingNotProjectCancelTender', {
            url: '/biddingNotProjectCancelTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectCancelTenderWf',
            workflowScene: {
                'CancelTender': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCancelTender.html',
                    controller: 'biddingNotProjectCancelTender_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCancelTender-controller.js'
                },
                'CancelTenderReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCancelTenderReadOnly.html',
                    controller: 'biddingNotProjectCancelTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCancelTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-废标审批
        $stateProvider.state('biddingNotProjectCancelTenderApproval', {
            url: '/biddingNotProjectCancelTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectCancelTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCancelTenderApproval.html',
                    controller: 'biddingNotProjectCancelTenderApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCancelTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectCancelTenderApprovalReadOnly.html',
                    controller: 'biddingNotProjectCancelTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectCancelTenderApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-商务评标
        $stateProvider.state('biddingNotProjectBusinessEvaluateTender', {
            url: '/biddingNotProjectBusinessEvaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectEvaluateTenderWf',
            workflowScene: {
                'BusinessEvaluateTender': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectBusinessEvaluateTender.html',
                    controller: 'biddingNotProjectBusinessEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectBusinessEvaluateTender-controller.js'
                },
                'BusinessEvaluateTenderReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectBusinessEvaluateTenderReadOnly.html',
                    controller: 'biddingNotProjectBusinessEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectBusinessEvaluateTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-技术评标
        $stateProvider.state('biddingNotProjectTechnologyEvaluateTender', {
            url: '/biddingNotProjectTechnologyEvaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectEvaluateTenderWf',
            workflowScene: {
                'TechnologyEvaluateTender': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectTechnologyEvaluateTender.html',
                    controller: 'biddingNotProjectTechnologyEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectTechnologyEvaluateTender-controller.js'
                },
                'TechnologyEvaluateTenderReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectTechnologyEvaluateTenderReadOnly.html',
                    controller: 'biddingNotProjectTechnologyEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectTechnologyEvaluateTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-评标汇总
        $stateProvider.state('biddingNotProjectEvaluateTenderGather', {
            url: '/biddingNotProjectEvaluateTenderGather',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectEvaluateTenderGatherWf',
            workflowScene: {
                'EvaluateTenderGather': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectEvaluateTenderGather.html',
                    controller: 'biddingNotProjectEvaluateTenderGather_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectEvaluateTenderGather-controller.js'
                },
                'EvaluateTenderGatherReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly.html',
                    controller: 'biddingNotProjectEvaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly.html',
                    controller: 'biddingNotProjectEvaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly.html',
                    controller: 'biddingNotProjectEvaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly.html',
                    controller: 'biddingNotProjectEvaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectEvaluateTenderGatherReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-让利
        $stateProvider.state('biddingNotProjectGrant', {
            url: '/biddingNotProjectGrant',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectGrantWf',
            workflowScene: {
                'Concession': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectGrant.html',
                    controller: 'biddingNotProjectGrant_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectGrant-controller.js'
                },
                'ConcessionReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectGrantReadOnly.html',
                    controller: 'biddingNotProjectGrantReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectGrantReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-定标
        $stateProvider.state('biddingNotProjectScaling', {
            url: '/biddingNotProjectScaling',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectScalingWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectScaling.html',
                    controller: 'biddingNotProjectScaling_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectScaling-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectScalingReadOnly.html',
                    controller: 'biddingNotProjectScalingReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectScalingReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-定标审批
        $stateProvider.state('biddingNotProjectScalingApproval', {
            url: '/biddingNotProjectScalingApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectScalingApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectScalingApproval.html',
                    controller: 'biddingNotProjectScalingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectScalingApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectScalingApprovalReadOnly.html',
                    controller: 'biddingNotProjectScalingApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectScalingApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectScalingApproval.html',
                    controller: 'biddingNotProjectScalingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectScalingApproval-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectScalingApproval.html',
                    controller: 'biddingNotProjectScalingApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectScalingApproval-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-发起合同
        $stateProvider.state('biddingNotProjectStartContract', {
            url: '/biddingNotProjectStartContract',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectStartContractWf',
            workflowScene: {
                'StartContract': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectStartContract.html',
                    controller: 'biddingNotProjectStartContract_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectStartContract-controller.js'
                },
                'StartContractReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectStartContractReadOnly.html',
                    controller: 'biddingNotProjectStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectStartContractReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/biddingNotProjectStartContractReadOnly.html',
                    controller: 'biddingNotProjectStartContractReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/biddingNotProjectStartContractReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });

        // 招投标（非项目服务类）-修改采购时间
        $stateProvider.state('biddingNotProjectModifyTime', {
            url: '/biddingNotProjectModifyTime',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectModifyTimeWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/bidding/notProject/modifyTime.html',
                    controller: 'biddingNotProjectModifyTime_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/modifyTime-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/bidding/notProject/modifyTimeReadOnly.html',
                    controller: 'biddingNotProjectModifyTimeReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/modifyTimeReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
        // 招投标（非项目服务类）-修改采购时间审批
        $stateProvider.state('biddingNotProjectModifyTimeApproval', {
            url: '/biddingNotProjectModifyTimeApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingNotProjectModifyTimeApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/bidding/notProject/modifyTimeApproval.html',
                    controller: 'biddingNotProjectModifyTimeApproval_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/modifyTimeApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/bidding/notProject/modifyTimeApprovalReadOnly.html',
                    controller: 'biddingNotProjectModifyTimeApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/bidding/notProject/modifyTimeApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8', 'css!../ReimbursementV2/css/common']
        });
    }]);
});