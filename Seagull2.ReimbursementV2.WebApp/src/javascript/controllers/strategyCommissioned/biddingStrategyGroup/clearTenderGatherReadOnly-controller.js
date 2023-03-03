define(['app', 'leftNavExtend', 'commonUtilExtend'], function (app) {
    app.controller('clearTenderGatherReadOnly_controller',
        function ($scope, viewData) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集团战采）";
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
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
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false,
                    'fileNumLimit': 10
                },
                fileReady: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "ClearSummary",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //得到澄清信息
                getClearBiddingClarifyInfo: function (supplierCode) {
                    var item = {};
                    for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                        if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode &&
                            $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                            item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                            break;
                        }
                    }
                    return item;
                }
            };

            //收集数据
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        });
});


