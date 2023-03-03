define(
    [
        'app',
        'supplierCategory',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'sectionNavExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsOpenTender_controller',
            function ($scope, viewData, wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator, sogWfControlOperationType,
                $http, seagull2Url, $rootScope, wfOperate) {
                
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                if ($scope.viewModel.hideRejectionButton)
                    $scope.wfOperateOpts.allowRejection = false;//退回 
                
                // 设置 
                $scope.settings = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsOpenTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function () { }); }
                        }
                    },
                    urlExtensionReplyTime: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingBusinessOperations/ExtensionReplyTime?r=' + Math.random());
                    },
                    urlAdjustBiddingDataArrange: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingBusinessOperations/AdjustBiddingDataArrange?r=' + Math.random());
                    },
                    // 延长回标截止时间
                    extensionReplyTime: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlExtensionReplyTime(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                    // 修改采购时间
                    adjustBiddingDataArrange: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlAdjustBiddingDataArrange(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    // 延长回标截止时间
                    confirmReplyDeadline: function () {
                        wfWaiting.show();
                        var param = {
                            resourceId: $scope.resourceId,
                            replyTime: $scope.viewModel.purchaseOfBusinessOperations.lastReplyDeadline,
                        }
                        $scope.api.extensionReplyTime(param, function (data) {
                            $scope.viewModel.purchaseOfBusinessOperations.lastReplyDeadline = data.deadline;
                            angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (item) {
                                if (item.className == 2) {
                                    item.replyDeadline = data.deadline;
                                }
                            });
                            wfWaiting.hide();
                            var promise = sogModal.openAlertDialog("提示", "回标截止时间修改成功");
                            promise.then(function (result) {
                                location.reload();
                            }, function (rejectData) {
                                location.reload();
                            });
                        });
                    },
                    // 废标
                    cancelBidding: function () {
                        $scope.refreshProcess();
                    },
                    //发起修改时间流程
                    modifyAdjustBiddingDataArrange: function () {
                        wfWaiting.show();
                        var param = {
                            resourceID: $scope.viewModel.resourceID
                        }
                        $scope.api.adjustBiddingDataArrange(param, function (data) {
                            $scope.viewModel.purchaseOfBusinessOperations.isAdjustBiddingDataArrange = true;
                            wfWaiting.hide();
                            //需要下面的几个参数
                            var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=biddingBusinessOperationsOpenTender" + "#/modifyPurchaseTime/";
                            window.open(t_link, self);
                        });
                    }, 
                };

                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel); 
                    model.option = null;
                    return model;
                }

                //发送验证
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    // 入围供应商
                    if (angular.isArray($scope.viewModel.supplierScopeList) === true && $scope.viewModel.supplierScopeList.length && !$scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding)
                    {
                        var isReplyBiddingCount = 0;
                        angular.forEach($scope.viewModel.supplierScopeList, function (supplier, i) {
                            if (supplier.isReplyBidding)
                                isReplyBiddingCount++;
                        });
                        //采购方式-招标
                        if ($scope.viewModel.purchaseBase.purchaseWayCode === 3 && isReplyBiddingCount < 3) {
                            modelStateDictionary.addModelError('回标情况', '有效回标供应商必须≥3家，无法开标！');
                        }
                        //采购方式-询价
                        if ($scope.viewModel.purchaseBase.purchaseWayCode === 2 && isReplyBiddingCount < 2) {
                            modelStateDictionary.addModelError('回标情况', '有效回标供应商必须≥2家，无法开标！');
                        }
                    }
                    return modelStateDictionary;
                };

                //提交数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve(getCleanModel());
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        defer.resolve(getCleanModel());
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        IsAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                    };
                    if (param) {
                        wfOperate.refreshProcess('/BiddingBusinessOperationsOpenTenderWf', $scope.currentActivityId, null, param, true);
                    }
                };
            }
        );
    });