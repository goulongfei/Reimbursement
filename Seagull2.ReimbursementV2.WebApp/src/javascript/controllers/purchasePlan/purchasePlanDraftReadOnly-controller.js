define([
    'app',
    'purchasePlanExtend',
     'echartsUitl',
], function (app) {
    app.controller('purchasePlanDraftReadOnly_controller',
        function ($scope, sogModal, viewData, sogWfControlOperationType, sogValidator) {
            angular.extend($scope, viewData);
            $scope.mainTitle = '采购管理';
            $scope.title = "采购计划";
            $scope.readonly = true;
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
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.baseInfo = {
                selectCommodityPaging: {
                    currentPage: 1,
                    itemsPerPage: 100,
                    totalItems: $scope.viewModel.purchasePlanCaseDetailInfos.length
                }
            };
            $scope.viewModel.isFullscreen = false;
             //初审图表数据初始化
            $scope.projectPurchaseScheduleOpt ={
                   title : "项目采购进度",
                   color : ["#70AD47", "#FFC000", "#ED7D31"]
            };
            $scope.planCompleteTimeOpt ={
                   title : "计划完成情况",
                   color : ["#70AD47", "#FFC000", "#ED7D31"]
            };
             $scope.purchaseWaySortingOpt ={
                   title : "采购方式分布",
                   color : $scope.viewModel.purchaseWaySortingColor
            }; 
            //采购方式分布详情
            $scope.purchaseWaySortingDetailShow = function(){
                 var viewPath = 'htmlTemplate/controlTemplate/purchasePlan/purchaseWaySortingDetails.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '采购方式分布', ["$scope", function ($modelScope) {
                            $modelScope.model = $scope.viewModel.purchaseWaySortingList;
                        }], $scope, { containerStyle: {  } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
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


