define([
    'app'
], function (app) {
    app.controller('biddingProjectDefineTechnologyEvaluate_controller', [
        '$scope', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
        function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
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
                angular.forEach($scope.viewModel.technologyEvaluateBiddingInfoList, function (item) {
                    if (item.isQualified === "" || item.isQualified === null || item.isQualified === "null" || item.isQualified === undefined || item.isQualified === "undefined") {
                        modelStateDictionary.addModelError("技术评标信息", "供应商【" + item.supplierName + "】请选择是否合格");
                    }
                });
                // 技术评标文件
                var technologyEvaluateFileUploaded = false;
                if ($scope.viewModel.technologyEvaluateFile && angular.isArray($scope.viewModel.technologyEvaluateFile.clientFileInformationList)) {
                    for (var i = 0; i < $scope.viewModel.technologyEvaluateFile.clientFileInformationList.length; i++) {
                        var item = $scope.viewModel.technologyEvaluateFile.clientFileInformationList[i];
                        if (item.uploaded === true && item.isDeleted !== true) {
                            technologyEvaluateFileUploaded = true;
                        }
                    }
                }
                if (technologyEvaluateFileUploaded === false) {
                    modelStateDictionary.addModelError('技术评标文件', '请上传！');
                }
                return modelStateDictionary;
            }
            //收集数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                var result;
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    var result = validData();
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