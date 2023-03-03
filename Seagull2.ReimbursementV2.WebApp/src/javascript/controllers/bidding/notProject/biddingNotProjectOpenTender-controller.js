define([
    'app',
    'commonUtilExtend',
    'dateTimePickerExtend', 'leftNavExtend', 'biddingSynthesizeExtend'
], function (app) {
    app.controller('biddingNotProjectOpenTender_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools, $filter) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });

            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印

            $scope.firstDate = $filter('date')($scope.viewModel.purchaseOfNotProjectPEMu.lastReplyDeadline, 'yyyy-MM-dd HH:mm:00.000');
            $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:00.000');

            //回标截止时间到，页面左上方会出现发送按钮，您可以发送至评标环节
            if ($scope.nowDate < $scope.firstDate && !$scope.viewModel.purchaseOfNotProjectPEMu.isAbandonBidding) {
                $scope.wfOperateOpts.allowMoveTo = false;
            } else {
                $scope.wfOperateOpts.allowMoveTo = true;
            }
            //基本信息
            $scope.baseInfo = {
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
                //是否显示采购时间安排
                isShowPurchaseDateArrange: false,
                //单选人员
                selectRadioPeople: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                // 采购时间安排信息
                purchaseDateArrangeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'DraftReadOnly',
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: 'OpenTender',
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false,
                    'fileNumLimit': 10
                },
                fileReady: true,
                //获取供应商回标IP
                getReplyBiddingReplyIP: function (supplierCode) {
                    var replyIP = "";
                    if ($scope.viewModel.isShowIP) {
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSubmits.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSubmits[i].supplierCode == supplierCode && $scope.viewModel.supplierReplyBiddingInfoSubmits[i].isReplyBidding) {
                                replyIP = $scope.viewModel.supplierReplyBiddingInfoSubmits[i].replyIP + "/" + $scope.viewModel.supplierReplyBiddingInfoSubmits[i].replyMAC;
                                break;
                            }
                        }
                    }
                    return replyIP;
                }
            };

            //修改最新回标截止时间
            $scope.updateReplyDeadline = function () {
                if (new Date($scope.viewModel.purchaseOfNotProjectPEMu.lastReplyDeadline) < new Date()) {
                    sogModal.openAlertDialog("提示", "最新回标截止时间不能小于当前时间！");
                    return;
                }
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl("/BiddingNotProject/UpdateLastReplyDeadline?resourceID=" +
                    $scope.viewModel.resourceID +
                    "&lastReplyDeadline=" +
                    $scope.viewModel.purchaseOfNotProjectPEMu.lastReplyDeadline.replace('T', ' ')))
                    .success(function () {
                        wfWaiting.hide();
                        var promise = sogModal.openAlertDialog("提示", "提交最新回标截止时间成功");
                        promise.then(function (result) {
                            location.reload();
                        }, function (rejectData) {
                            location.reload();
                        });
                    });
            };
            //废标
            $scope.cancelTender = function () {
                wfOperate.refreshProcess('/BiddingNotProjectOpenTenderWf', $scope.currentActivityId, null, {
                    isAbandonBidding: $scope.viewModel.purchaseOfNotProjectPEMu.isAbandonBidding
                }).success(function (d) {
                    window.location.reload();
                }).error(function (data, status) { });
            };

            //发起修改时间流程
            $scope.editpurchaseDatearrange = function () {
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl("/BiddingNotProject/AdjustBiddingDataArrange?resourceID=" +
                    $scope.viewModel.resourceID +
                    "&isAdjustBiddingDataArrange=true"))
                    .success(function () {
                        $scope.viewModel.purchaseOfNotProjectPEMu.isAdjustBiddingDataArrange = true;
                        wfWaiting.hide();
                        var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=biddingNotProjectOpenTender" + "#/modifyPurchaseTime/";
                        window.open(t_link, self);
                    }).error(function (data, status) {
                        if (data) {
                            sogModal.openAlertDialog(status, data.message);
                        } else {
                            sogModal.openAlertDialog("提示", "发起修改时间流程错误");
                        }
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
                if (($scope.viewModel.purchaseOfNotProjectPEMu.isAbandonBidding || $scope.viewModel.purchaseOfNotProjectPEMu.isAbandonBidding == 'true') && !$scope.viewModel.purchaseOfNotProjectPEMu.abandonBiddingReason)
                    modelStateDictionary.addModelError("废标", "废标原因不能为空");
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
                        defer.resolve($scope.viewModel);
                        break;
                }
            };
        });
});


