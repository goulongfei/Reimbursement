define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'negativeListExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('directCommissionedImplementSignatureReadOnly_controller', [
            '$scope', 'viewData',
            'wfWaiting', 'sogModal',
            function ($scope, viewData,
                wfWaiting, sogModal) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowRejection = false;//退回

                //超管权限
                if ($scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                }                
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }
        ]);
    });