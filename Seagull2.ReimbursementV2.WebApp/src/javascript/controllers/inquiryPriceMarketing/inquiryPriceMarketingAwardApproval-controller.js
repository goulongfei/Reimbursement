define([
    'app',
    'biddingSynthesizeExtend',
    'signContractExtend'
], function (app) {
    app.controller('cinquiryPriceMarketingAwardApproval_controller', [
        '$scope', 'viewData',
        function ($scope, viewData) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "询价(营销类)";          
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowComment = false;  //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            //设置
            $scope.settings = {
                //中标情况
                signContractOpts: {
                    scene: 'Award',
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                }
            }
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                return defer.resolve($scope.viewModel);
            }
        }
    ]);
})