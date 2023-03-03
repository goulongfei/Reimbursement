define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";
        // 招投标（集团战采）-编辑招标信息
        $stateProvider.state('biddingStrategyGroupCompilingTender', {
            url: '/biddingStrategyGroupCompilingTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupCompilingTenderWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTender.html',
                    controller: 'compilingTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTender-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTenderReadOnly.html',
                    controller: 'compilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集团战采）-编辑招标信息审批
        $stateProvider.state('biddingStrategyGroupCompilingTenderApproval', {
            url: '/biddingStrategyGroupCompilingTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupCompilingTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTenderApproval.html',
                    controller: 'compilingTenderApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/compilingTenderApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-投标邀请
        $stateProvider.state('biddingStrategyGroupTenderInviteTender', {
            url: '/biddingStrategyGroupTenderInviteTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupInviteTenderWf',
            workflowScene: {
                'inviteTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/inviteTender.html',
                    controller: 'tendersIssued_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/inviteTender-controller.js'
                },
                'inviteTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/inviteTenderReadOnly.html',
                    controller: 'tendersIssuedReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/inviteTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-发放标书
        $stateProvider.state('biddingStrategyGroupTendersIssued', {
            url: '/biddingStrategyGroupTendersIssued',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupTendersIssuedWf',
            workflowScene: {
                'TendersIssued': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/tendersIssued.html',
                    controller: 'tendersIssued_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/tendersIssued-controller.js'
                },
                'TendersIssuedReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/tendersIssuedReadOnly.html',
                    controller: 'tendersIssuedReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/tendersIssuedReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-提问答疑
        $stateProvider.state('biddingStrategyGroupAnsweringQuestion', {
            url: '/biddingStrategyGroupAnsweringQuestion',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupAnsweringQuestionWf',
            workflowScene: {
                'AnsweringQuestion': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/answeringQuestion.html',
                    controller: 'answeringQuestion_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/answeringQuestion-controller.js'
                },
                'AnsweringQuestionReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/answeringQuestionReadOnly.html',
                    controller: 'answeringQuestionReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/answeringQuestionReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-开标
        $stateProvider.state('biddingStrategyGroupOpenTender', {
            url: '/biddingStrategyGroupOpenTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupOpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/openTender.html',
                    controller: 'openTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/openTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/openTenderReadOnly.html',
                    controller: 'openTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/openTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-废标
        $stateProvider.state('biddingStrategyGroupCancelTender', {
            url: '/biddingStrategyGroupCancelTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupCancelTenderWf',
            workflowScene: {
                'CancelTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/cancelTender.html',
                    controller: 'cancelTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/cancelTender-controller.js'
                },
                'CancelTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/cancelTenderReadOnly.html',
                    controller: 'cancelTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/cancelTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-废标审批
        $stateProvider.state('biddingStrategyGroupCancelTenderApproval', {
            url: '/biddingStrategyGroupCancelTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupCancelTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/cancelTenderApproval.html',
                    controller: 'cancelTenderApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/cancelTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/cancelTenderApprovalReadOnly.html',
                    controller: 'cancelTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/cancelTenderApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-商务清标
        $stateProvider.state('biddingStrategyGroupBusinessClearTender', {
            url: '/biddingStrategyGroupBusinessClearTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupClearTenderWf',
            workflowScene: {
                'ClearTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/businessClearTender.html',
                    controller: 'businessClearTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/businessClearTender-controller.js'
                },
                'ClearTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/businessClearTenderReadOnly.html',
                    controller: 'businessClearTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/businessClearTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/businessClearTenderReadOnly.html',
                    controller: 'businessClearTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/businessClearTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-技术清标
        $stateProvider.state('biddingStrategyGroupTechnologyClearTender', {
            url: '/biddingStrategyGroupTechnologyClearTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupClearTenderWf',
            workflowScene: {
                'ClearTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/technologyClearTender.html',
                    controller: 'technologyClearTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/technologyClearTender-controller.js'
                },
                'ClearTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/technologyClearTenderReadOnly.html',
                    controller: 'technologyClearTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/technologyClearTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/technologyClearTenderReadOnly.html',
                    controller: 'technologyClearTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/technologyClearTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-清标汇总
        $stateProvider.state('biddingStrategyGroupClearTenderGather', {
            url: '/biddingStrategyGroupClearTenderGather',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupClearTenderGatherWf',
            workflowScene: {
                'ClearTenderGather': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/clearTenderGather.html',
                    controller: 'clearTenderGather_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/clearTenderGather-controller.js'
                },
                'ClearTenderGatherReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/clearTenderGatherReadOnly.html',
                    controller: 'clearTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/clearTenderGatherReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-澄清
        $stateProvider.state('biddingStrategyGroupClarificationReply', {
            url: '/biddingStrategyGroupClarificationReply',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupClarificationReplyWf',
            workflowScene: {
                'ClarificationReply': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/clarificationReply.html',
                    controller: 'clarificationReply_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/clarificationReply-controller.js'
                },
                'ClarificationReplyReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/clarificationReplyReadOnly.html',
                    controller: 'clarificationReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/clarificationReplyReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-商务评标
        $stateProvider.state('biddingStrategyGroupBusinessEvaluateTender', {
            url: '/biddingStrategyGroupBusinessEvaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupEvaluateTenderWf',
            workflowScene: {
                'EvaluateTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/businessEvaluateTender.html',
                    controller: 'businessEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/businessEvaluateTender-controller.js'
                },
                'EvaluateTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/businessEvaluateTenderReadOnly.html',
                    controller: 'businessEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/businessEvaluateTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/businessEvaluateTenderReadOnly.html',
                    controller: 'businessEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/businessEvaluateTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-技术评标
        $stateProvider.state('biddingStrategyGroupTechnologyEvaluateTender', {
            url: '/biddingStrategyGroupTechnologyEvaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupEvaluateTenderWf',
            workflowScene: {
                'EvaluateTender': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/technologyEvaluateTender.html',
                    controller: 'technologyEvaluateTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/technologyEvaluateTender-controller.js'
                },
                'EvaluateTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/technologyEvaluateTenderReadOnly.html',
                    controller: 'technologyEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/technologyEvaluateTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/technologyEvaluateTenderReadOnly.html',
                    controller: 'technologyEvaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/technologyEvaluateTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-评标汇总
        $stateProvider.state('biddingStrategyGroupEvaluateTenderGather', {
            url: '/biddingStrategyGroupEvaluateTenderGather',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupEvaluateTenderGatherWf',
            workflowScene: {
                'EvaluateTenderGather': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/evaluateTenderGather.html',
                    controller: 'evaluateTenderGather_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/evaluateTenderGather-controller.js'
                },
                'EvaluateTenderGatherReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/evaluateTenderGatherReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集团战采）-让利
        $stateProvider.state('biddingStrategyGroupConcession', {
            url: '/biddingStrategyGroupConcession',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupConcessionWf',
            workflowScene: {
                'Concession': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/concession.html',
                    controller: 'concession_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/concession-controller.js'
                },
                'ConcessionReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/concessionReadOnly.html',
                    controller: 'concessionReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/concessionReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集团战采）-定标
        $stateProvider.state('biddingStrategyGroupScaling', {
            url: '/biddingStrategyGroupScaling',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupScalingWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scaling.html',
                    controller: 'scaling_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scaling-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scalingReadOnly.html',
                    controller: 'scalingReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scalingReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scalingReadOnly.html',
                    controller: 'scalingReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scalingReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集团战采）-定标审批
        $stateProvider.state('biddingStrategyGroupScalingApproval', {
            url: '/biddingStrategyGroupScalingApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupScalingApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scalingApproval.html',
                    controller: 'scalingApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scalingApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scalingApprovalReadOnly.html',
                    controller: 'scalingApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scalingApprovalReadOnly-controller.js'
                },
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scalingApprovalReadOnly.html',
                    controller: 'scalingApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scalingApprovalReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/scalingApprovalReadOnly.html',
                    controller: 'scalingApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/scalingApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集团战采）-录入协议编号
        $stateProvider.state('biddingStrategyGroupInputProtocolnumber', {
            url: '/biddingStrategyGroupInputProtocolnumber',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupInputProtocolnumberWf',
            workflowScene: {
                'InputProtocolnumber': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/inputProtocolnumber.html',
                    controller: 'inputProtocolnumber_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/inputProtocolnumber-controller.js'
                },
                'InputProtocolnumberReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/inputProtocolnumberReadOnly.html',
                    controller: 'inputProtocolnumberReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/inputProtocolnumberReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集团战采）-形成协议
        $stateProvider.state('biddingStrategyGroupCooperationInfo', {
            url: '/biddingStrategyGroupCooperationInfo',
            useWorkflow: true,
            workflowUrlBase: '/BiddingStrategyGroupCooperationInfoWf',
            workflowScene: {
                'CooperationInfo': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/cooperationInfo.html',
                    controller: 'cooperationInfo_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/cooperationInfo-controller.js'
                },
                'CooperationInfoReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingStrategyGroup/cooperationInfoReadOnly.html',
                    controller: 'cooperationInfoReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingStrategyGroup/cooperationInfoReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        
    }]);
});