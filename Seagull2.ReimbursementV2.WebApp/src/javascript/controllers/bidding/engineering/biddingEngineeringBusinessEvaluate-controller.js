define(
    [
        'app',
        'commonUtilExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'biddingSynthesizeExtend',
    ],
    function (app) {
        app.controller('biddingEngineeringBusinessEvaluate_controller', [
            '$scope', 'viewData',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator', 'rcTools',
            'sogWfControlOperationType', '$http', 'configure',
            function ($scope, viewData,
                wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
                sogWfControlOperationType, $http, configure) {

                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');

                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.wfOperateOpts.allowCirculate = false;//传阅

                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 设置 
                $scope.settings = {
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'BusinessEvaluate',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingEngineeringBusinessEvaluate",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfEngineering.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: "BusinessEvaluate",
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function () { }); }
                        }
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },

                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message);
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error); }
                        }
                    },
                    urlSaveSupplierLabelOptions: function () {
                        return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/PurchaseSaveSupplierLabelOptions?r=' + Math.random();
                    },
                    // 保存标签
                    saveSupplierLabelOptions: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlSaveSupplierLabelOptions(),
                            data: param,
                        }).success(function (data) {
                            done(data);
                        }).error($scope.api.showErrorMessage);
                    },
                }

                // 保存标签
                function saveLabel(func) {
                    if (!$scope.settings.supplierScopeOpts.model.industryDomainWithLabel) {
                        func();
                        return;
                    }
                    wfWaiting.show();
                    if (angular.isArray($scope.viewModel.replySupplierScopeList) === false) { return; }
                    var saveData = [];
                    for (var i = 0; i < $scope.viewModel.replySupplierScopeList.length; i++) {
                        var item = $scope.viewModel.replySupplierScopeList[i];
                        if (item.labelTemplate) {
                            saveData.push(item.labelTemplate);
                        }
                    }
                    if (saveData.length === 0) { return; }
                    $scope.api.saveSupplierLabelOptions(saveData, function (saveResult) {
                        if (!saveResult) {
                            sogModal.openAlertDialog("保存提示", "保存标签失败！");
                            return;
                        }
                        wfWaiting.hide();
                        if (saveResult.result === true) {
                            func();
                        }
                        // 保存失败
                        else {
                            $scope.opts.saved = false;
                            // 发生错误
                            if (saveResult.error) {
                                sogModal.openErrorDialog(saveResult.error);
                            }
                            // 后台验证不通过
                            else {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', saveResult.validInfo)
                                sogValidator.broadcastResult(saveResult.validInfo);
                            }
                        }
                    });
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
                    // var RangeValidator = ValidateHelper.getValidator('Range'); 
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') }
                    ]);
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

                    if ($scope.settings.supplierScopeOpts.model.industryDomainWithLabel) {
                        if (angular.isArray($scope.viewModel.replySupplierScopeList)) {
                            for (var i = 0; i < $scope.viewModel.replySupplierScopeList.length; i++) {
                                var item = $scope.viewModel.replySupplierScopeList[i];
                                // 是否存在核心风险 
                                if (!item.labelLC90096OptionValue) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90096.title, '请选择！');
                                }
                                // 核心风险
                                if (item.labelLC90096OptionValue === 'OP90096001' && item.labelLC90097.textFloor > 0 && !item.labelLC90097.text) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90097.title, '不能为空！');
                                }
                                else {
                                    validLabelText(modelStateDictionary, item, item.labelLC90097);
                                }
                                // 是否存在不良投标行为
                                if (!item.labelLC90098OptionValue) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90098.title, '请选择！');
                                }
                                // 存在不良投标行为
                                if (item.labelLC90098OptionValue === 'OP90098001') {
                                    var selected = false;
                                    for (var j = 0; j < item.labelLC90099.options.length; j++) {
                                        if (item.labelLC90099.options[j].selected) { selected = true; }
                                    }
                                    if (selected === false) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90099.title, '请选择！');
                                    }
                                }
                                // 是否有效投标
                                if (!item.labelLC90100OptionValue) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90100.title, '请选择！');
                                }
                                if (item.labelLC90100OptionValue === 'OP90100001') {
                                    // 是否响应工抵房
                                    if (!item.labelLC90101OptionValue) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90101.title, '请选择！');
                                    }
                                    if (item.labelLC90101OptionValue === 'OP90101001') {
                                        // 抵房比例
                                        if (!item.labelLC90102.figure && item.labelLC90102.figure!==0) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90102.title, '不能为空！');
                                        }
                                        // 抵房增加的费率
                                        if (!item.labelLC90103.figure && item.labelLC90103.figure !== 0) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90103.title, '不能为空！');
                                        }
                                    }
                                    // 措施费单方
                                    if (!item.labelLC90104.figure && item.labelLC90104.figure !== 0) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90104.title, '不能为空！');
                                    }

                                    if ($scope.settings.supplierScopeOpts.model.industryDomainForUnbalancedBid) {
                                        // 首次回标是否存在不平衡报价  	
                                        if (!item.labelLC90105OptionValue) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90105.title, '请选择！');
                                        }
                                    }
                                    // 首次回标商务条款偏离
                                    if (!item.labelLC90106OptionValue) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90106.title, '请选择！');
                                    }
                                }
                            }
                        }
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") }
                    ]);
                    if ($scope.settings.supplierScopeOpts.model.industryDomainWithLabel) {
                        if (angular.isArray($scope.viewModel.replySupplierScopeList)) {
                            for (var i = 0; i < $scope.viewModel.replySupplierScopeList.length; i++) {
                                var item = $scope.viewModel.replySupplierScopeList[i];
                                validLabelText(modelStateDictionary, item, item.labelLC90097);
                            }
                        }
                    }
                    return modelStateDictionary;
                };

                function validLabelText(modelStateDictionary, item, label) {
                    if (label && label.text && label.text.length > label.textCeiling) {
                        modelStateDictionary.addModelError(item.supplierName + '-' + label.title, '不能大于' + label.textCeiling + '个字符！');
                    }
                }

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
                            saveLabel(function () { defer.resolve(getCleanModel()); });
                        }
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            saveLabel(function () { defer.resolve(getCleanModel()); });
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            saveLabel(function () { defer.resolve(getCleanModel()); });
                        }
                    } else {
                        saveLabel(function () { defer.resolve(getCleanModel()); });
                    }
                };
                $scope.baseInfo.init();
            }
        ]);
    });