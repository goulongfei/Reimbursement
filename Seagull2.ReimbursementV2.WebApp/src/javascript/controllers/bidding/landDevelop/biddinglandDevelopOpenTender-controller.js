define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddinglandDevelopStart_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', '$injector', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, $injector, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";


                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                $scope.firstDate = $filter('date')($scope.viewModel.purchaseOfLandDevelop.lastReplyDeadline, 'yyyy-MM-dd HH:mm:00.000');
                $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:00.000');
                //回标截止时间到，页面左上方会出现发送按钮，您可以发送至评标环节
                if ($scope.nowDate < $scope.firstDate) {
                    $scope.wfOperateOpts.allowMoveTo = false;
                } else {
                    $scope.wfOperateOpts.allowMoveTo = true;
                }
                if ($scope.viewModel.purchaseOfLandDevelop.isAbandonBidding) {
                    $scope.wfOperateOpts.allowMoveTo = true;
                }
                //显示验证码
                angular.forEach($scope.viewModel.supplierReplyBiddingInfoSubmitList, function (v) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (s) {
                        if (s.supplierCode == v.supplierCode)
                            v.verificationCode = s.verificationCode;
                    });
                });

                $scope.baseInfo = {
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'OpenTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'DraftReadOnly',
                    },
                }

                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }

                //更新最新回标截止时间
                $scope.updateReplyDeadline = function () {
                    wfWaiting.show();
                    var lastTime = new Date($scope.viewModel.purchaseOfLandDevelop.lastReplyDeadline);
                    var nowDate = new Date();
                    if (lastTime) {
                        if (lastTime < nowDate) {
                            sogModal.openAlertDialog("提示", "最新回标截止时间不能小于当前时间");
                            return;
                        }

                        $http.get(seagull2Url.getPlatformUrl("/BiddingLandDevelop/UpdateLastReplyDeadline?resourceID=" +
                            $scope.viewModel.resourceID +
                            "&lastReplyDeadline=" +
                            $scope.viewModel.purchaseOfLandDevelop.lastReplyDeadline.replace('T', ' ')))
                            .success(function () {
                                wfWaiting.hide();
                                var promise = sogModal.openAlertDialog('提示', "最新回标截止时间修改成功！");
                                promise.then(function (result) {
                                    location.reload();
                                }, function (rejectData) {
                                    location.reload();
                                });
                            })
                    } else {
                        sogModal.openAlertDialog("提示", "最新回标截止时间不能为空");
                    }
                }

                //废标
                $scope.cancelTender = function () {
                    wfOperate.refreshProcess('/BiddingLandDevelopOpenTenderWf', $scope.currentActivityId, null, {
                        IsAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding
                    }).success(function (d) {
                        window.location.reload();
                    });
                }; 
                //发起修改时间流程
                $scope.editpurchaseDatearrange = function () {
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl("/BiddingLandDevelop/AdjustBiddingDataArrange?resourceID=" +
                        $scope.viewModel.resourceID +
                        "&isAdjustBiddingDataArrange=true"))
                        .success(function () {
                            $scope.viewModel.purchaseOfLandDevelop.isAdjustBiddingDataArrange = true;
                            wfWaiting.hide();
                            var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=biddingLandDevelopOpenTender" + "#/modifyPurchaseTime/";
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

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                // 保存验证
                var saveValidData = function () {
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);
                    var lastTime = new Date($scope.viewModel.purchaseOfLandDevelop.lastReplyDeadline);
                    var nowDate = new Date();
                    if (lastTime < nowDate) {
                        error.addModelError("最新回标截止时间", "最新回标截止时间不能小于当前时间");
                    }
                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                };
                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);
                    //如果废标，还得更新废标理由
                    if ($scope.viewModel.purchaseOfLandDevelop.isAbandonBidding) {
                        if (!$scope.viewModel.purchaseOfLandDevelop.abandonBiddingReason) {
                            error.addModelError("废标", "废标原因不能为空");
                        }
                    }
                    else {
                        var replyRound = 0;
                        angular.forEach($scope.viewModel.supplierReplyBiddingInfoSubmitList, function (v, i) {

                            if (v.isReplyBidding) {
                                replyRound++;
                            }
                        });

                        if (replyRound < 3)
                            error.addModelError("回标供应商个数", "回标供应商个数不能小于3家");
                    }

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {

                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        if (checkData(e)) {
                            defer.resolve($scope.viewModel);
                        } else {
                            defer.reject($scope.viewModel);
                        }
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        if (saveValidData()) {
                            defer.resolve($scope.viewModel);
                        } else {
                            defer.reject($scope.viewModel);
                        }
                    }
                    return defer.resolve($scope.viewModel);
                }
            }]);
    });