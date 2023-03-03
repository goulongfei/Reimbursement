define(
    [
        'app',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseTechnologyEvaluateTender_controller', [
            '$scope', 'viewData', 'sogModal',
            'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
            function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态 
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.wfOperateOpts.allowCirculate = false;//传阅
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存 
                }

                // 设置
                $scope.settings = {
                    // 附件设置项
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0,
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "TechnologyEvaluteTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                    },
                };

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                };
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    // 商务评标文件
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
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    return modelStateDictionary;
                };
                //加载收集数据的名称
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
                    }
                    else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                    } else {
                        defer.resolve($scope.viewModel);
                    }
                };

                $scope.baseInfo.init();
            }]);
    });