define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
         'commonUtilExtend',
    ],
    function (app) {
        app.controller('directCommissionedMarketingStartContractReadOnly_controller', [
            '$scope', 'viewData',
            function ($scope, viewData) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "直接委托(营销类)";
                
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    if (viewData.wfOperateOpts.allowMoveTo)
                        viewData.wfOperateOpts.allowComment = true; //评论
                }

                //基本信息
                $scope.baseInfo = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'startupContract',
                        'reasonCode': $scope.viewModel.purchaseOfMarketing.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                        actionStateCode: $scope.viewModel.formAction.actionStateCode
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

            }]);
    });