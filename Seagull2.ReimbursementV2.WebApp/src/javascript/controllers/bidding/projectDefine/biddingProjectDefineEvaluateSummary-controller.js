define([
    'app',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend'
], function (app) {
    app.controller('biddingProjectDefineEvaluateSummary_controller', [
        '$scope', 'wfOperate', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
        function ($scope, wfOperate, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
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
            $scope.setting = {
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false
                }
            };
            // 基本信息 
            $scope.baseInfo = {
                // 设置是否发放让利询价
                setIsGrantDiscountEnquiry: function (val) {
                    $scope.refreshProcess();
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
                if ($scope.viewModel.purchaseOfProjectDefine.isGrantDiscountEnquiry === null || $scope.viewModel.purchaseOfProjectDefine.isGrantDiscountEnquiry === "null") {
                    modelStateDictionary.addModelError("发放让利询价", "请选择是否发放让利询价");
                }
                if ($scope.viewModel.purchaseOfProjectDefine.isGrantDiscountEnquiry === true) {
                    var isEmpty = true;
                    angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList, function (v, i) {
                        if (v.businessGrantDiscountEnquiryFileList && angular.isArray(v.businessGrantDiscountEnquiryFileList)) {
                            var fileCount = 0;
                            angular.forEach(v.businessGrantDiscountEnquiryFileList,
                                function (v, i) {
                                    if (v.isDeleted) {
                                        fileCount++;
                                    }
                                });
                            if (fileCount != v.businessGrantDiscountEnquiryFileList.length) {
                                isEmpty = false;
                            }
                        }

                    });
                    if (isEmpty)
                        modelStateDictionary.addModelError("发放让利询价", "若选择了需要发放让利，至少要添加一条让利信息。");
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
            // 刷新流程
            $scope.refreshProcess = function () {
                var param = {
                    IsGrantDiscountEnquiry: $scope.viewModel.purchaseOfProjectDefine.isGrantDiscountEnquiry,
                };
                if (param) {
                    wfOperate.refreshProcess('/BiddingProjectDefineEvaluateSummaryWf', $scope.currentActivityId, null, param, true);
                }
            };
        }
    ]);
});