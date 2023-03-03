define(
    [
        'app',
        'tiger-balm',
        'commonUtilExtend',
    ],
    function (app) {
        app.controller('purchaseAbortDraftReadOnly_controller', [
            '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'configure', 'linq', 'rcTools', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'regionType', 'regionShowStyle',
            function ($scope, $rootScope, $http, wfOperate, viewData, wfWaiting, configure, linq, rcTools, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, regionType, regionShowStyle) {
                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowComment = false;  //评论
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.mainTitle = '采购管理';
                $scope.title = '采购作废';
                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (!v.processId == "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }

                //提交数据
                $scope.collectData = function (e, defer) {                    
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        defer.resolve($scope.viewModel);
                    }
                    else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve($scope.viewModel);
                        }, function () {
                            defer.reject(getCleanModel());
                        });
                    }
                    else if (e.operationType === sogWfControlOperationType.Save) {
                        defer.resolve($scope.viewModel);
                    }
                    else {
                        defer.resolve($scope.viewModel);
                    }
                };
            }]);
    });