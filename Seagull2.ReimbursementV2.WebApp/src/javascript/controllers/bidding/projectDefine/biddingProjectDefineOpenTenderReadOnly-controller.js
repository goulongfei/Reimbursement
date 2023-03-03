define([
    'app',
    'biddingSynthesizeExtend',
    'leftNavExtend'
], function (app) {
    app.controller('biddingProjectDefineOpenTenderReadOnly_controller', [
        '$scope', 'viewData',
        function ($scope, viewData) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = true;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

            if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowSave = false;//保存
                if ($scope.wfOperateOpts.allowMoveTo)
                    $scope.wfOperateOpts.allowComment = true; //评论
            }
            //基本信息
            $scope.settings = {
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: 'BiddingProjectDefineOpenTender',
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                    actionTypeCode: $scope.viewModel.formAction.actionTypeCode
                }
            };
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                return defer.resolve($scope.viewModel);
            };
        }
    ]);
});