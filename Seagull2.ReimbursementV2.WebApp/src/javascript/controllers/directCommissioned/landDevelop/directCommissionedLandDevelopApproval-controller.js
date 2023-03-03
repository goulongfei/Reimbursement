define(
    [
         'app',
        'directCommissionedSynthesizeExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('directCommissionedLandDevelopApproval_controller', [
            '$scope', '$http', 'viewData','wfWaiting', 'sogModal','seagull2Url','errorDialog',
            function ($scope, $http, viewData, wfWaiting, sogModal, seagull2Url, errorDialog) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(土地开发类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                viewData.wfOperateOpts.allowAdminMoveTo = false;//超级发送

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                if (viewData.sceneId == "DefaultCirculationScene") {
                    viewData.wfOperateOpts.allowDoWithdraw = false; //撤回
                }

                //基本信息
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'reason': $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfLandDevelop.projectCode,
                            projectName: $scope.viewModel.purchaseOfLandDevelop.projectName
                        },
                        'blackList': ['delegationAmount', 'reason', 'project'],
                    },
                };
                $scope.isApproval = true;
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });