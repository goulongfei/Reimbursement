define([
    'app',
    'commonUtilExtend',
    'dateTimePickerExtend', 'leftNavExtend'
], function (app) {
    app.controller('biddingNotProjectCancelTender_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.wfOperateOpts.allowComment = true; //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
                //单选人员
                selectRadioPeople: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                //采购时间安排
                purchaseDateArrangeInfoPEMus: function () {
                    var purchaseDateArrangeInfoPEMuList = [];
                    angular.forEach($scope.viewModel.purchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 1) {
                            purchaseDateArrangeInfoPEMuList.push(item);
                        }
                    });
                    return purchaseDateArrangeInfoPEMuList;
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "CancelTender",
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
                        defer.resolve(null);
                        break;
                }
            };
        });
});


