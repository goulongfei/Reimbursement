define(['app','tiger-balm','commonUtilExtend'],
    function (app) {
        app.controller('purchaseAbortDraft_controller', 
            function ($scope, $rootScope, $http, wfOperate, viewData, sogModal, sogWfControlOperationType, sogOguType, ValidateHelper, sogValidator) {
                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = true;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowComment = true;  //评论
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.mainTitle = '采购管理';
                $scope.title = '采购作废';
                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    $scope.isOpinionsShow = true;
                }
                // 设置 
                $scope.settings = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                }

                $scope.$watch("viewModel.approvalUser", function (newVal, oldVal) {
                    var dataModel = { Data: $scope.viewModel };
                    wfOperate.refreshProcess('/PurchaseAbortDraftWf', viewData.currentActivityId, undefined, angular.toJson(dataModel), true)
                        .success(function (data) {
                    });
                }, true);

                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '作废原因', attributeName: 'purchaseAbortRecord.abortReason', validator: new RequiredValidator("不能为空！") },
                    ]);
                    if ($scope.viewModel.approvalUser == null) {
                        modelStateDictionary.addModelError('审批人', '审批人不能为空！');
                    }
                    return modelStateDictionary;
                };

                //提交数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                       
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
            });
    });