define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'negativeListExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('directCommissionedImplementAuditApplication_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            function ($scope, viewData, $http, seagull2Url,
                wfWaiting, sogModal, ValidateHelper, sogValidator,
                sogWfControlOperationType) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                $scope.isApproval = true;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                // 设置审批栏权限
                angular.forEach($scope.opinionOpts.options, function (item) {
                    item.allowToBeAppended = false;
                    item.allowToBeDeleted = false;
                    item.allowToBeModified = false;
                });
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 直接委托说明 附件设置项
                $scope.manualFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 预算初审报告 附件设置项
                $scope.budgetReportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 预算定案表 附件设置项
                $scope.budgetFinalFormFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 资料清单 附件设置项
                $scope.materialMediaFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 1
                };
                // 设置
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 5,
                        'scene': 'application',
                        'isNeedContract': true,
                    },
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                }

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

                // 预算资料
                $scope.materialMedia = {
                    isCheckAll: false,
                    checkAll: function () {
                        for (var i = 0; i < $scope.viewModel.materialMediumFileList.length; i++) {
                            var item = $scope.viewModel.materialMediumFileList[i];
                            item.checked = !$scope.materialMedia.isCheckAll;
                        }
                    },
                    addItem: function () {
                        $scope.viewModel.materialMediumFileList.push({
                            canDelete: true,
                            canEditFileName: true
                        });
                    },
                    deleteItem: function () {
                        var selected = false;
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除预算资料?");
                        promise.then(function (v) {
                            for (var i = $scope.viewModel.materialMediumFileList.length - 1; i >= 0; i--) {
                                var item = $scope.viewModel.materialMediumFileList[i];
                                if (item.checked) {
                                    selected = true;
                                    $scope.viewModel.materialMediumFileList.splice(i, 1);
                                }
                            }

                            if (selected === false) {
                                sogModal.openAlertDialog('提示', "请选择需要删除的预算资料。");
                            }
                            $scope.materialMedia.isCheckAll = false;
                        });
                    }
                };

                // 自定义校验器-判断字符长度
                var stringMaxLengthValidator = (function () {
                    return function (maxlength, message) {
                        this.validateData = function (value, name, validationContext) {
                            if (value && value.length > maxlength) {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '预算资料', attributeName: 'materialMediumFileList', validator: new RequiredValidator('不能为空！') }
                    ]);
                    if (angular.isArray($scope.viewModel.materialMediumFileList)) {
                        //校验预算资料是否为空
                        if ($scope.viewModel.materialMediumFileList.length === 0) {
                            modelStateDictionary.addModelError('预算资料', '不能为空!');
                        }
                        for (var i = 0; i < $scope.viewModel.materialMediumFileList.length; i++) {
                            var item = $scope.viewModel.materialMediumFileList[i];
                            var rowKey = "预算资料第" + (i + 1) + "行";
                            var required = ValidateHelper.validateData(item, [
                                { key: rowKey + '，资料名称', attributeName: 'materialName', validator: [new RequiredValidator("资料名称不能为空！")] }
                            ]);
                            modelStateDictionary.merge(required);

                            if (!item.materialMediumTypeCode
                                || item.materialMediumTypeCode === ''
                                || item.materialMediumTypeCode === '0') {
                                // 资料类型 
                                modelStateDictionary.addModelError(rowKey + '，资料类型', '请选择资料类型!');
                            }

                            if (item.materialMediumTypeCode === 1 || item.materialMediumTypeCode === 3) {
                                var uploaded = false;
                                if (angular.isArray(item.clientFileInformationList)) {
                                    for (var y = 0; y < item.clientFileInformationList.length; y++) {
                                        var file = item.clientFileInformationList[y];
                                        if (file.uploaded === true && file.isDeleted !== true) {
                                            uploaded = true;
                                        }
                                    }
                                }
                                if (uploaded === false) {
                                    // 需上传 
                                    modelStateDictionary.addModelError(rowKey + '，详细文件', '请上传文件!');
                                }

                            }
                        }
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') }
                    ]);
                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    model.option = null;
                    return model;
                }
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
                            defer.resolve(getCleanModel());
                        }
                    }
                    else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve(getCleanModel());
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
                            defer.resolve(getCleanModel());
                        }
                    }
                    else {
                        defer.resolve(getCleanModel());
                    }
                };

                $scope.baseInfo.init();
            }
        ]);
    });