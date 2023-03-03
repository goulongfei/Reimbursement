define(['app', 'leftNavExtend', 'commonUtilExtend',], function (app) {
    app.controller('clarificationReply_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            $scope.isOpinionsShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;
            });
            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toClarigyTransitionKey;

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
                //是否显示采购主责人信息
                isShowUser: true,
                //是否显示操作按钮
                isShowOperation: false,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "ClarificationReply",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                // 撤回清标汇总
                returnToClarigySummary: function () {
                    if ($scope.viewModel.isCancelClarigy) {
                        var responseData = $scope;
                        responseData.wfOperateOpts.transitionKey = $scope.viewModel.toClarigySummaryTransitionKey;
                        $rootScope.$broadcast('$processRefreshed', responseData);
                    }
                    else {
                        var responseData = $scope;
                        responseData.wfOperateOpts.transitionKey = $scope.viewModel.toClarigyTransitionKey;
                        $rootScope.$broadcast('$processRefreshed', responseData);
                    }
                },
                //得到澄清信息
                getClearBiddingClarifyInfo: function (supplierCode) {
                    var item = {};
                    for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                        if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode &&
                            $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                            item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                            //是否需要回复
                            if ((item.businessClarifyFileList == null || item.businessClarifyFileList.length == 0) && (item.technologyClarifyFileList == null || item.technologyClarifyFileList.length == 0)) {
                                item.isNeedReply = false;
                            } else {
                                item.isNeedReply = true;
                            }
                            break;
                        }
                    }
                    return item;
                },

            };
            if (new Date($scope.viewModel.p_StrategyPurchasePlanCase.clarifyDeadline) < new Date()) {
                $scope.baseInfo.isShowOperation = true;
            } else {
                $scope.baseInfo.isShowOperation = false;
            }
            //放弃回复
            $scope.giveUpReply = function (clarifyCode) {
                var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次澄清，是否确认该供应商放弃回复？");
                promise.then(function (v) {
                    wfWaiting.show();

                    $http.get(seagull2Url.getPlatformUrl('/BiddingCentralizedPurchasing/GiveUpReply?clarifyCode=' + clarifyCode), {
                        cache: false
                    }).success(function (response) {
                        angular.forEach($scope.viewModel.p_ClearBiddingClarifyInfoPEMus, function (item) {
                            if (item.code == clarifyCode) {
                                item.replyStateCode = 3;
                                item.replyStateName = "放弃回复";
                            }
                        });
                        wfWaiting.hide();
                    }).error(function (data, status) {
                        if (data) {
                            sogModal.openAlertDialog(status, data.message);
                        } else {
                            sogModal.openAlertDialog("提示", "放弃回复错误");
                        }
                        wfWaiting.hide();
                    });
                }, function (v) {
                    $scope.msg = "点击了取消" + v;
                    wfWaiting.hide();
                });
            };

            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");
            var validData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (item) {
                    var supplier = $scope.baseInfo.getClearBiddingClarifyInfo(item.supplierCode);
                    if ($scope.viewModel.isCancelClarigy == false) {
                        if (supplier.isNeedReply && supplier.replyStateCode == 1) {
                            modelStateDictionary.addModelError("发放澄清问卷", "供应商【" + item.supplierName + "】未回复不能发送");
                        }
                    } else {
                        if (supplier.isNeedReply && supplier.replyStateCode == 2) {
                            modelStateDictionary.addModelError("发放澄清问卷", "供应商【" + item.supplierName + "】已回复不能退回");
                        }
                    }

                });
                return modelStateDictionary;
            };

            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                switch (e.operationType) {
                    case sogWfControlOperationType.MoveTo:
                        var result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
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


