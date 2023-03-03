define(
    [
        'app',
         'directCommissionedSynthesizeExtend',
          'commonUtilExtend',
    ],
    function (app) {
        app.controller('directCommissionedMarketingApproval_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url', 'wfWaiting','sogModal',
            function ($scope, viewData, $http, seagull2Url, wfWaiting, sogModal) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "直接委托(营销类)";
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowAdminMoveTo = false;//超级发送
             
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                if ($scope.sceneId == "PurchaseApprovalReadOnly" || $scope.sceneId == "ApprovalReadOnly") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                }
                if (viewData.sceneId == "DefaultCirculationScene") {
                    viewData.wfOperateOpts.allowDoWithdraw = false; //撤回
                }

                //基本信息
                $scope.baseInfo = { 
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                    },
                };
                if ($scope.sceneId == 'Draft' || $scope.sceneId == 'PurchaseApproval' || $scope.sceneId == 'DefaultCirculationScene' || $scope.sceneId == 'ApprovalEdit' || $scope.sceneId == 'Approval' || $scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                } else {
                    $scope.isApproval = false;
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });