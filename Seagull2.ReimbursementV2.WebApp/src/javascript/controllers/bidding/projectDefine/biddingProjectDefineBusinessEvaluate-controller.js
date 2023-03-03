define([
    'app',
    'commonUtilExtend',
], function (app) {
    app.controller('biddingProjectDefineBusinessEvaluate_controller', [
        '$scope', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'rcTools',
        function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, rcTools) {
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
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false
                },
                numberToChinese: function (round) {
                    return rcTools.numberToChinese(round);
                }
            };
            //数据有效性的检验            
            var validData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                angular.forEach($scope.viewModel.businessEvaluateBiddingInfoList, function (item) {
                    if (item.ranking == null || item.ranking == "" || item.ranking == '' || item.ranking == 0) {
                        modelStateDictionary.addModelError("商务评标信息", "供应商【" + item.supplierName + "】排名不能为空");
                    }
                });
                // 商务评标文件
                var businessEvaluateFileUploaded = false;
                if ($scope.viewModel.businessEvaluateFile && angular.isArray($scope.viewModel.businessEvaluateFile.clientFileInformationList)) {
                    for (var i = 0; i < $scope.viewModel.businessEvaluateFile.clientFileInformationList.length; i++) {
                        var item = $scope.viewModel.businessEvaluateFile.clientFileInformationList[i];
                        if (item.uploaded === true && item.isDeleted !== true) {
                            businessEvaluateFileUploaded = true;
                        }
                    }
                }
                if (businessEvaluateFileUploaded === false) {
                    modelStateDictionary.addModelError('商务评标文件', '请上传！');
                }

                return modelStateDictionary;
            };
            //收集数据
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
                } else if (e.operationType === sogWfControlOperationType.Comment) {
                    var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                    promise.then(function () {
                        defer.resolve($scope.viewModel);
                    }, function () {
                        defer.reject($scope.viewModel);
                    });
                } else {
                    defer.resolve($scope.viewModel);
                }
            };
        }
    ]);
});