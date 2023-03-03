define(
    [
        'app',
        'biddingSynthesizeExtend',
        'dateTimePickerExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseOpenTender_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态 
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存 
                }
                // 设置
                $scope.settings = {
                    // 附件设置项
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0,
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': "Start",
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "OpenTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
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
                    urlExtensionInviteReplyTime: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingAssetsPurchase/ExtensionReplyTime?r=' + Math.random());
                    },
                    urlAdjustBiddingDataArrange: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingAssetsPurchase/AdjustBiddingDataArrange?r=' + Math.random());
                    },
                    // 延长提问截止时间
                    extensionInviteReplyTime: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlExtensionInviteReplyTime(param),
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
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                        $scope.refreshProcess();
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    // 延长邀请回标截止时间
                    confirmReplyDeadline: function () {
                        wfWaiting.show();
                        var param = {
                            resourceId: $scope.resourceId,
                            replyTime: $scope.viewModel.purchaseOfFixedAssets.lastReplyDeadline,
                        }
                        $scope.api.extensionInviteReplyTime(param, function (data) {
                            angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (item) {
                                item.replyDeadline = data.deadline;
                                wfWaiting.hide();
                                sogModal.openAlertDialog('提示', "回标截止时间修改成功！");
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
                            $scope.viewModel.purchaseOfFixedAssets.isAdjustBiddingDataArrange = true;
                            wfWaiting.hide();
                            //需要下面的几个参数
                            var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=biddingAssetsPurchaseOpenTender" + "#/modifyPurchaseTime/";
                            window.open(t_link, self);
                        });
                    },
                };
                // 自定义校验器-判断字符长度
                var stringMaxLengthValidator = (function () {
                    return function (maxlength, message) {
                        this.validateData = function (value, name, validationContext) {
                            if (value && value.length > maxlength) {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '招投标联系人', attributeName: 'purchaseOfFixedAssets.linkMan', validator: new RequiredValidator("不能为空！") },
                        { key: '联系电话', attributeName: 'purchaseOfFixedAssets.linkManPhone', validator: new RequiredValidator("不能为空！") },
                        { key: 'E-mail', attributeName: 'purchaseOfFixedAssets.linkManEmail', validator: new RequiredValidator("不能为空！") }
                    ]);
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '联系电话', attributeName: 'purchaseOfFixedAssets.linkManPhone', validator: new stringMaxLengthValidator(50, "不能大于50个字符！") },
                        { key: 'E-mail', attributeName: 'purchaseOfFixedAssets.linkManEmail', validator: new stringMaxLengthValidator(50, "不能大于50个字符！") }
                    ]);
                    return modelStateDictionary;
                };
                //加载收集数据的名称
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
                            defer.resolve($scope.viewModel);
                        }
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve($scope.viewModel);
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    }
                    else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                    } else {
                        defer.resolve($scope.viewModel);
                    }
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        IsAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                    };
                    if (param) {
                        wfOperate.refreshProcess('/BiddingAssetsPurchaseOpenTenderWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                });

                $scope.baseInfo.init();
            }]);
    });