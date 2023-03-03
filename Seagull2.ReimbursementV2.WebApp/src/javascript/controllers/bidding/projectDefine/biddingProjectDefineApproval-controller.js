define([
    'app',
    'biddingSynthesizeExtend',
    'contractAgreementExtend',
    'negativeListExtend',
    'leftNavExtend'
], function (app) {
    app.controller('biddingProjectDefineApproval_controller', [
        '$scope', 'viewData',
        function ($scope, viewData) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            //设置
            $scope.settings = {
                // 采购时间安排信息
                purchaseDateArrangeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'DraftReadOnly'
                },
                //合约规划
                contractAgreementOpts: {
                    model: 'readOnly',
                    isAdmin: $scope.viewModel.isAdmin,
                },
                // 入围供应商信息
                supplierScopeOpts: {
                    formAction: $scope.viewModel.formAction,
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'DraftReadOnly',
                    'isshowenterpriseCheck': true
                }
            };
            $scope.isApproval = true;
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        }
    ]);
});