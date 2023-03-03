define(['app', 'leftNavExtend', 'commonUtilExtend'], function (app) {
    app.controller('tendersIssuedReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            $scope.isOpinionsShow = false;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;

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
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "SendTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //采购时间安排
                purchaseDateArrangeInfoPEMus: function () {
                    var purchaseDateArrangeInfoPEMuList = [];
                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 5) {
                            purchaseDateArrangeInfoPEMuList.push(item);
                        }
                    });
                    return purchaseDateArrangeInfoPEMuList;
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


