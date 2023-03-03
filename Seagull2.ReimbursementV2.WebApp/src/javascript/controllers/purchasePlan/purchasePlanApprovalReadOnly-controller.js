define(['app','purchasePlanExtend'], function (app) {
    app.controller('purchasePlanApprovalReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "采购计划";
            $scope.readonly = true;
            $scope.isOpinionsShow = false;
            $scope.isApprovalShow = true;
            angular.forEach($scope.opinions, function (v, i) {

                //评价意见是否显示
                if (v.commentIsDelete)
                    $scope.isOpinionsShow = true;
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                selectCommodityPaging: {
                    currentPage: 1,
                    itemsPerPage: 100,
                    totalItems: $scope.viewModel.purchasePlanCaseDetailInfos.length
                },
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


