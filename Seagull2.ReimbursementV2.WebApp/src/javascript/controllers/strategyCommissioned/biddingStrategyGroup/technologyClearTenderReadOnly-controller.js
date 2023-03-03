define([
    'app',
    'leftNavExtend',
    'commonUtilExtend'], function (app) {
    app.controller('technologyClearTenderReadOnly_controller',
        function ($scope, viewData, sogWfControlOperationType, sogValidator, rcTools) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集团战采）";
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                //是否显示采购主责人信息
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "TechnologyClearTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                clearBiddingClarifyRunds: [],
                //查找回标信息
                getReplyBidding: function (supplierCode) {
                    var p_SupplierReplyBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_SupplierReplyBiddingInfoPEMus.length; i++) {
                        if ($scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].className == 2) {
                            p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i];
                            break;
                        }
                    }
                    return p_SupplierReplyBiddingInfo;
                },
                //得到澄清信息
                getClearBiddingClarifyInfo: function (supplierCode, round) {
                    var item = {};
                    for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                        if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode && round == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                            item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                            break;
                        }
                    }
                    return item;
                },
                //得到清标回标信息
                getClearBiddingReplyBidding: function (supplierCode, round) {
                    var p_SupplierReplyBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos.length; i++) {
                        if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == round) {
                            p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                            break;
                        }
                    }
                    return p_SupplierReplyBiddingInfo;
                }
            };
            if ($scope.viewModel.isNoShowAllReplyBiddingInfo) {
                if ($scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes > 1) {
                    for (var i = 0; i < $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes -1; i++) {
                        $scope.baseInfo.clearBiddingClarifyRunds.push({ "code": (i + 1), "name": "第" + rcTools.numberToChinese(i + 1) + "轮澄清" });
                    }
                }
            } else {
                for (var i = 0; i < $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes; i++) {
                    $scope.baseInfo.clearBiddingClarifyRunds.push({ "code": (i + 1), "name": "第" + rcTools.numberToChinese(i + 1) + "轮澄清" });
                }
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
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


