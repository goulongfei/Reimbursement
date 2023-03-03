define([
    'app',
    'commonUtilExtend',
    'dateTimePickerExtend', 'leftNavExtend', 'biddingSynthesizeExtend'
], function (app) {
    app.controller('biddingNotProjectOpenTenderReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
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
            //判断是都显示修改采购时间
            if (new Date($scope.viewModel.replyDeadline) < new Date()) {
                $scope.baseInfo.isShowPurchaseDateArrange = true;
            }
            //收集数据
            $scope.collectData = function (e, defer) {
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


