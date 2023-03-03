define([
    'app',
    'leftNavExtend',
    'dateTimePickerExtend'], function (app) {
        app.controller('openTender_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集中采购）";
                $scope.wfOperateOpts.allowRejection = true;//退回
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
                    //是否显示采购时间安排
                    isShowPurchaseDateArrange: false,
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "OpenTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //获取供应商回标IP
                    getReplyBiddingReplyIP: function (supplierCode) {
                        var replyIP = "";
                        return replyIP;
                    }
                };
                //判断发送按钮是否显示
                if ($scope.viewModel.p_StrategyPurchasePlanCase.isAbandonBidding == false && $injector.get('configure').getConfig('pageCommonConfig').isValidMoveTo) {
                    if (new Date($scope.viewModel.replyDeadline) < new Date()) {
                        $scope.wfOperateOpts.allowMoveTo = true;
                    } else {
                        $scope.wfOperateOpts.allowMoveTo = false;
                    }
                }
                //判断是都显示修改采购时间
                if (new Date($scope.viewModel.replyDeadline) < new Date()) {
                    $scope.baseInfo.isShowPurchaseDateArrange = true;
                }
                //修改最新回标截止时间
                $scope.updateReplyDeadline = function () {
                    if ($scope.viewModel.replyDeadline == null || $scope.viewModel.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.replyDeadline == "" || $scope.viewModel.replyDeadline == undefined) {
                        sogModal.openAlertDialog("提示", "请先选择最新回标截止时间！");
                        return;
                    }
                    if (new Date($scope.viewModel.replyDeadline) < new Date()) {
                        sogModal.openAlertDialog("提示", "最新回标截止时间不能小于当前时间！");
                        return;
                    }
                    $scope.viewModel.p_StrategyPurchasePlanCase.lastReplyDeadline = $scope.viewModel.replyDeadline;
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl('/BiddingCentralizedPurchasing/CommitReplyDeadlineTime?resourceID=' + $scope.viewModel.resourceID + '&replyDeadline=' + $scope.viewModel.replyDeadline), {
                        cache: false
                    }).success(function (response) {
                        wfWaiting.hide();
                        var promise = sogModal.openAlertDialog("提示", "提交最新回标截止时间成功");
                        promise.then(function (result) {
                            location.reload();
                        }, function (rejectData) {
                            location.reload();
                        });
                    }).error(function (data, status) {
                        if (data) {
                            sogModal.openAlertDialog(status, data.message);
                        } else {
                            sogModal.openAlertDialog("提示", "提交最新回标截止时间错误");
                        }
                        wfWaiting.hide();
                    });
                };
                //废标
                $scope.cancelTender = function () {
                    wfOperate.refreshProcess('/OpenTenderWf', $scope.currentActivityId, null, {
                        isAbandonBidding: $scope.viewModel.p_StrategyPurchasePlanCase.isAbandonBidding
                    }).success(function (d) {
                        window.location.reload();
                    }).error(function (data, status) { });
                };

                //发起修改时间流程
                $scope.editpurchaseDatearrange = function () {
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl("/BiddingCentralizedPurchasing/AdjustBiddingDataArrange?resourceID=" +
                        $scope.viewModel.resourceID +
                        "&isAdjustBiddingDataArrange=true"))
                        .success(function () {
                            $scope.viewModel.p_StrategyPurchasePlanCase.isAdjustBiddingDataArrange = true;
                            wfWaiting.hide();
                            var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=openTender" + "#/modifyPurchaseTime/";
                            window.open(t_link, self);
                        }).error(function (data, status) {
                            if (data) {
                                sogModal.openAlertDialog(status, data.message);
                            } else {
                                sogModal.openAlertDialog("提示", "发起修改时间流程错误");
                            }
                            wfWaiting.hide();
                        });
                }

                var RequiredValidator = ValidateHelper.getValidator("Required");

                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if (($scope.viewModel.p_StrategyPurchasePlanCase.isAbandonBidding == true || $scope.viewModel.p_StrategyPurchasePlanCase.isAbandonBidding == 'true') && !$scope.viewModel.p_StrategyPurchasePlanCase.abandonBiddingReason)
                        modelStateDictionary.addModelError("废标", "废标原因不能为空");
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.isAbandonBidding == false || $scope.viewModel.p_StrategyPurchasePlanCase.isAbandonBidding == 'false') {
                        var count = 0;
                        angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (supplier) {
                            if (supplier.isReplyBidding) {
                                count++;
                            }
                        });
                        if (count < 3) {
                            modelStateDictionary.addModelError("回标情况", "回标供应商不能少于3家");
                        }
                    }
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
                        case sogWfControlOperationType.Withdraw:
                            defer.resolve($scope.viewModel);
                            break;
                        default:
                            defer.resolve(null);
                            break;
                    }
                };
            });
    });


