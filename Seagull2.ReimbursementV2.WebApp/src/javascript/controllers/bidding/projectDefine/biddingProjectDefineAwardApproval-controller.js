define([
    'app',
    'commonUtilExtend',
    'biddingSynthesizeExtend',
    'contractAgreementExtend',
    'signContractExtend'
], function (app) {
    app.controller('biddingProjectDefineAwardApproval_controller', [
        '$scope', 'viewData', 'rcTools',
        function ($scope, viewData, rcTools) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            //设置
            $scope.settings = {
                numberToChinese: function (round) {
                    return rcTools.numberToChinese(round);
                },
                //合约规划
                contractAgreementOpts: {
                    model: 'readOnly',
                    isAdmin: $scope.viewModel.isAdmin,
                },
                //中标情况
                signContractOpts: {
                    scene: 'Award',
                    contractAgreementScopeList: $scope.viewModel.contractAgreementScopeList
                }
            };
            $scope.isApproval = true;
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                return defer.resolve($scope.viewModel);
            }
        }
    ]);
});