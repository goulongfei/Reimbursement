define(['app', 'leftNavExtend', 'commonUtilExtend',], function(app) {
    app.controller('answeringQuestionReadOnly_controller',
        function($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            $scope.isOpinionsShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;
            });
            
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: false,
                isShowAnswer: new Date($scope.viewModel.p_AnswerInfoPEMus[0].lastQuestionDeadline) < new Date(),
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "QuestionAndAnswer",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //采购时间安排
                purchaseDateArrangeInfoPEMus: function() {
                    var purchaseDateArrangeInfoPEMuList = [];
                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function(item) {
                        if (item.className == 5) {
                            purchaseDateArrangeInfoPEMuList.push(item);
                        }
                    });
                    return purchaseDateArrangeInfoPEMuList;
                },
                //绑定供应商提问集合
                searchQuestionInfos: function(supplierCode) {
                    var list = [];
                    angular.forEach($scope.viewModel.p_QuestionInfoPEMus, function(item) {
                        if (item.supplierCode == supplierCode) {
                            angular.forEach($scope.viewModel.p_AnswerInfoPEMus, function(answer) {
                                if (item.round == answer.round && new Date(answer.lastQuestionDeadline) < new Date()) {
                                    list.push(item);
                                }
                            });
                        }
                    });
                    return list;
                },
                //得到提问轮次
                questionTimes: function() {
                    var list = [];
                    var i = 1;
                    angular.forEach($scope.viewModel.p_AnswerInfoPEMus, function(answer) {
                        if (new Date(answer.lastQuestionDeadline) < new Date()) {
                            list.push("第" + i + "轮");
                            i++;
                        }
                    });
                    return list;
                },
                //得到本轮最新提问截止时间
                getLastQuestionDeadline: function(index) {
                    var lastQuestionDeadline;
                    for (var j = 0; j < $scope.viewModel.p_AnswerInfoPEMus.length; j++) {
                        if ((index + 1) == $scope.viewModel.p_AnswerInfoPEMus[j].round) {
                            lastQuestionDeadline = $scope.viewModel.p_AnswerInfoPEMus[j].lastQuestionDeadline;
                            break;
                        }
                    }
                    return lastQuestionDeadline;
                },
                //延长纸截止提问时间
                extendTime: $scope.viewModel.p_StrategyPurchasePlanCase.lastQuestionDeadline
            };
            //收集数据
            $scope.collectData = function(e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.Save:
                        defer.resolve($scope.viewModel);
                        break;
                    case sogWfControlOperationType.CancelProcess:
                        defer.resolve($scope.viewModel);
                        break;
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


