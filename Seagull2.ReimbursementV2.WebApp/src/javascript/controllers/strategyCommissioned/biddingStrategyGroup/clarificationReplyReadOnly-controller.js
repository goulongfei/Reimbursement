define(['app', 'leftNavExtend', 'commonUtilExtend',], function (app) {
    app.controller('clarificationReplyReadOnly_controller',
        function ($scope, viewData, sogWfControlOperationType, sogOguType, sogValidator) {
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
                    scene: "ClarificationReply",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },

                //得到澄清信息
                getClearBiddingClarifyInfo: function (supplierCode) {
                    var item = {};
                    for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                        if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode &&
                            $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                            item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                            //是否需要回复
                            if ((item.businessClarifyFileList == null || item.businessClarifyFileList.length == 0) && (item.technologyClarifyFileList == null || item.technologyClarifyFileList.length == 0)) {
                                item.isNeedReply = false;
                            } else {
                                item.isNeedReply = true;
                            }
                            break;
                        }
                    }
                    return item;
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
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


