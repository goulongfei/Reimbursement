define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.3/";
        // 招投标（集中采购）-编辑招标信息
        $stateProvider.state('compilingTender', {
            url: '/compilingTender',
            useWorkflow: true,
            workflowUrlBase: '/CompilingTenderWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/compilingTender.html',
                    controller: 'compilingTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTender-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderReadOnly.html',
                    controller: 'compilingTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-编辑招标信息审批
        $stateProvider.state('compilingTenderApproval', {
            url: '/compilingTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/CompilingTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApproval.html',
                    controller: 'compilingTenderApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApprovalReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApprovalReadOnly-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApprovalReadOnly.html',
                    controller: 'compilingTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/compilingTenderApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-发放标书
        $stateProvider.state('tendersIssued', {
            url: '/tendersIssued',
            useWorkflow: true,
            workflowUrlBase: '/TendersIssuedWf',
            workflowScene: {
                'TendersIssued': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/tendersIssued.html',
                    controller: 'tendersIssued_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/tendersIssued-controller.js'
                },
                'TendersIssuedReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/tendersIssuedReadOnly.html',
                    controller: 'tendersIssuedReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/tendersIssuedReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-提问答疑
        $stateProvider.state('answeringQuestion', {
            url: '/answeringQuestion',
            useWorkflow: true,
            workflowUrlBase: '/AnsweringQuestionWf',
            workflowScene: {
                'AnsweringQuestion': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/answeringQuestion.html',
                    controller: 'answeringQuestion_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/answeringQuestion-controller.js'
                },
                'AnsweringQuestionReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/answeringQuestionReadOnly.html',
                    controller: 'answeringQuestionReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/answeringQuestionReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-开标
        $stateProvider.state('openTender', {
            url: '/openTender',
            useWorkflow: true,
            workflowUrlBase: '/OpenTenderWf',
            workflowScene: {
                'OpenTender': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/openTender.html',
                    controller: 'openTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/openTender-controller.js'
                },
                'OpenTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/openTenderReadOnly.html',
                    controller: 'openTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/openTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-废标
        $stateProvider.state('cancelTender', {
            url: '/cancelTender',
            useWorkflow: true,
            workflowUrlBase: '/CancelTenderWf',
            workflowScene: {
                'CancelTender': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/cancelTender.html',
                    controller: 'cancelTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/cancelTender-controller.js'
                },
                'CancelTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/cancelTenderReadOnly.html',
                    controller: 'cancelTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/cancelTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-废标审批
        $stateProvider.state('cancelTenderApproval', {
            url: '/cancelTenderApproval',
            useWorkflow: true,
            workflowUrlBase: '/CancelTenderApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/cancelTenderApproval.html',
                    controller: 'cancelTenderApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/cancelTenderApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/cancelTenderApprovalReadOnly.html',
                    controller: 'cancelTenderApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/cancelTenderApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-清标
        $stateProvider.state('clearTender', {
            url: '/clearTender',
            useWorkflow: true,
            workflowUrlBase: '/ClearTenderWf',
            workflowScene: {
                'ClearTender': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clearTender.html',
                    controller: 'clearTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clearTender-controller.js'
                },
                'ClearTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clearTenderReadOnly.html',
                    controller: 'clearTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clearTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clearTenderReadOnly.html',
                    controller: 'clearTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clearTenderReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-清标汇总
        $stateProvider.state('clearTenderGather', {
            url: '/clearTenderGather',
            useWorkflow: true,
            workflowUrlBase: '/ClearTenderGatherWf',
            workflowScene: {
                'ClearTenderGather': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clearTenderGather.html',
                    controller: 'clearTenderGather_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clearTenderGather-controller.js'
                },
                'ClearTenderGatherReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clearTenderGatherReadOnly.html',
                    controller: 'clearTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clearTenderGatherReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-澄清
        $stateProvider.state('clarificationReply', {
            url: '/clarificationReply',
            useWorkflow: true,
            workflowUrlBase: '/ClarificationReplyWf',
            workflowScene: {
                'ClarificationReply': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clarificationReply.html',
                    controller: 'clarificationReply_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clarificationReply-controller.js'
                },
                'ClarificationReplyReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/clarificationReplyReadOnly.html',
                    controller: 'clarificationReplyReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/clarificationReplyReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-评标
        $stateProvider.state('evaluateTender', {
            url: '/evaluateTender',
            useWorkflow: true,
            workflowUrlBase: '/EvaluateTenderWf',
            workflowScene: {
                'EvaluateTender': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTender.html',
                    controller: 'evaluateTender_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTender-controller.js'
                },
                'EvaluateTenderReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderReadOnly.html',
                    controller: 'evaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderReadOnly-controller.js'
                },
                'DefaultCirculationScene': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderReadOnly.html',
                    controller: 'evaluateTenderReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderReadOnly-controller.js'
                },
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-评标汇总
        $stateProvider.state('evaluateTenderGather', {
            url: '/evaluateTenderGather',
            useWorkflow: true,
            workflowUrlBase: '/EvaluateTenderGatherWf',
            workflowScene: {
                'EvaluateTenderGather': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGather.html',
                    controller: 'evaluateTenderGather_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGather-controller.js'
                },
                'EvaluateTenderGatherReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly-controller.js'
                },
                'ReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly.html',
                    controller: 'evaluateTenderGatherReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/evaluateTenderGatherReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        //招投标（集中采购）-让利
        $stateProvider.state('concession', {
            url: '/concession',
            useWorkflow: true,
            workflowUrlBase: '/ConcessionWf',
            workflowScene: {
                'Concession': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/concession.html',
                    controller: 'concession_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/concession-controller.js'
                },
                'ConcessionReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/concessionReadOnly.html',
                    controller: 'concessionReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/concessionReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-定标
        $stateProvider.state('scaling', {
            url: '/scaling',
            useWorkflow: true,
            workflowUrlBase: '/ScalingWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/scaling.html',
                    controller: 'scaling_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/scaling-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/scalingReadOnly.html',
                    controller: 'scalingReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/scalingReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-定标审批
        $stateProvider.state('scalingApproval', {
            url: '/scalingApproval',
            useWorkflow: true,
            workflowUrlBase: '/ScalingApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/scalingApproval.html',
                    controller: 'scalingApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/scalingApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/scalingApprovalReadOnly.html',
                    controller: 'scalingApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/scalingApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-发放中标通知书
        $stateProvider.state('issuanceNotice', {
            url: '/issuanceNotice',
            useWorkflow: true,
            workflowUrlBase: '/IssuanceNoticeWf',
            workflowScene: {
                'IssuanceNotice': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/issuanceNotice.html',
                    controller: 'issuanceNotice_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/issuanceNotice-controller.js'
                },
                'IssuanceNoticeReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/issuanceNoticeReadOnly.html',
                    controller: 'issuanceNoticeReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/issuanceNoticeReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-录入协议编号
        $stateProvider.state('inputProtocolnumber', {
            url: '/inputProtocolnumber',
            useWorkflow: true,
            workflowUrlBase: '/InputProtocolnumberWf',
            workflowScene: {
                'InputProtocolnumber': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/inputProtocolnumber.html',
                    controller: 'inputProtocolnumber_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/inputProtocolnumber-controller.js'
                },
                'InputProtocolnumberReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/inputProtocolnumberReadOnly.html',
                    controller: 'inputProtocolnumberReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/inputProtocolnumberReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-形成协议
        $stateProvider.state('cooperationInfo', {
            url: '/cooperationInfo',
            useWorkflow: true,
            workflowUrlBase: '/CooperationInfoWf',
            workflowScene: {
                'CooperationInfo': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/cooperationInfo.html',
                    controller: 'cooperationInfo_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/cooperationInfo-controller.js'
                },
                'CooperationInfoReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/cooperationInfoReadOnly.html',
                    controller: 'cooperationInfoReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/cooperationInfoReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-修改采购时间
        $stateProvider.state('biddingCentralizedPurchasingModifyTime', {
            url: '/biddingCentralizedPurchasingModifyTime',
            useWorkflow: true,
            workflowUrlBase: '/BiddingCentralizedPurchasingModifyTimeWf',
            workflowScene: {
                'Draft': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/modifyTime.html',
                    controller: 'modifyTime_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/modifyTime-controller.js'
                },
                'DraftReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/modifyTimeReadOnly.html',
                    controller: 'modifyTimeReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/modifyTimeReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
        // 招投标（集中采购）-修改采购时间审批
        $stateProvider.state('biddingCentralizedPurchasingModifyTimeApproval', {
            url: '/biddingCentralizedPurchasingModifyTimeApproval',
            useWorkflow: true,
            workflowUrlBase: '/BiddingCentralizedPurchasingModifyTimeApprovalWf',
            workflowScene: {
                'PurchaseApproval': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/modifyTimeApproval.html',
                    controller: 'modifyTimeApproval_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/modifyTimeApproval-controller.js'
                },
                'PurchaseApprovalReadOnly': {
                    templateUrl: './views/strategyCommissioned/biddingCentralizedPurchasing/modifyTimeApprovalReadOnly.html',
                    controller: 'modifyTimeApprovalReadOnly_controller',
                    controllerUrl: './javascript/controllers/strategyCommissioned/biddingCentralizedPurchasing/modifyTimeApprovalReadOnly-controller.js'
                }
            },
            startupWorkflow: true,
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });
    }]);
});