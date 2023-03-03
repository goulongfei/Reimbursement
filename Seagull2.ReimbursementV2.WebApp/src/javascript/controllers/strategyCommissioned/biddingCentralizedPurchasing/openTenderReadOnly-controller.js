define(['app', 'leftNavExtend'], function (app) {
    app.controller('openTenderReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            
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
                    //if ($scope.viewModel.isShowIP) {
                    //    for (var i = 0; i < $scope.viewModel.p_SupplierReplyBiddingInfoPEMus.length; i++) {
                    //        if ($scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].isReplyBidding) {
                    //            replyIP = $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].replyIP + "/" + $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].replyMAC;
                    //            break;
                    //        }
                    //    }
                    //}
                    return replyIP;
                }
            };
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


