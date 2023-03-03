define(
    [
        'app',
        'commonUtilExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'biddingSynthesizeExtend',
    ],
    function (app) {
        app.controller('biddingImplementTechnologyEvaluate_controller', [
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
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.wfOperateOpts.allowCirculate = false; //传阅 

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
                        'scene': 'TechnologyEvaluate',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingImplementTechnologyEvaluate",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: "TechnologyEvaluate",
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
                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },
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

                    // 技术清标文件
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
		     if ($scope.settings.supplierScopeOpts.model.industryDomainWithLabel
                        && angular.isArray($scope.viewModel.replySupplierScopeList)) {

                        for (var i = 0; i < $scope.viewModel.replySupplierScopeList.length; i++) {
                            var item = $scope.viewModel.replySupplierScopeList[i];
                            // 招标技术文件编制质量
                            if (!item.labelLC90107OptionValue) {
                                modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90107.title, '请选择！');
                            }
                            // 前期无偿配合深化设计
                            if (!item.labelLC90108OptionValue) {
                                modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90108.title, '请选择！');
                            }
                            // 具备政府层面协调能力
                            if (item.labelLC90109 && !item.labelLC90109OptionValue) {
                                modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90109.title, '请选择！');
                            }
                            // 与考察阶段项目经理是否一致	
                            if (item.labelLC90110 && !item.labelLC90110OptionValue) {
                                modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90110.title, '请选择！');
                            }
                            // 拟派项目经理
                            if (item.labelLC90111) {
                                if (item.labelLC90111.textFloor > 0 && !item.labelLC90111.text) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90111.title, '不能为空！');
                                }
                                else {
                                    validLabelText(modelStateDictionary, item, item.labelLC90111);
                                }
                            }
                            // 项目经理从业年限	
                            if (item.labelLC90112) {
                                if (item.labelLC90112.textFloor > 0 && !item.labelLC90112.text) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90112.title, '不能为空！');
                                }
                                else {
                                    validLabelText(modelStateDictionary, item, item.labelLC90112);
                                }
                            }
                            // 本公司的从业年限
                            if (item.labelLC90113) {
                                if (item.labelLC90113.textFloor > 0 && !item.labelLC90113.text) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90113.title, '不能为空！');
                                }
                                else {
                                    validLabelText(modelStateDictionary, item, item.labelLC90113);
                                }
                            }
                            var isOP90114001 = false;
                            var isOP90114002 = false;
                            var isOther = false;
                            // 拟派项目经理优势
                            if (item.labelLC90114) {
                                for (var j = 0; j < item.labelLC90114.options.length; j++) {
                                    var op = item.labelLC90114.options[j];
                                    if (op.selected) {
                                        if (op.optionValue === "OP90114001") { isOP90114001 = true; }
                                        else if (op.optionValue === "OP90114002") { isOP90114002 = true; }
                                        else { isOther = true; }
                                    }
                                }
                                if (!isOP90114001 && !isOP90114002) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90114.title, '请选择！');
                                }
                                else if (isOP90114002 && !isOther) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90114.title + ' ', '请选择！');
                                }
                            }
                            if (isOP90114002) {
                                // 项目经理优势证明文件（业绩证明或证书） 
                                if (item.labelLC90115) {
                                    var fileUploaded = false;
                                    if (item.labelLC90115.files && angular.isArray(item.labelLC90115.files)) {
                                        for (var j = 0; j < item.labelLC90115.files.length; j++) {
                                            var file = item.labelLC90115.files[j];
                                            if (file.uploaded === true && file.isDeleted !== true) {
                                                fileUploaded = true;
                                            }
                                        }
                                    }
                                    if (fileUploaded === false) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90115.title, '请上传！');
                                    }
                                }
                                // 主要top房企业绩（不含挂证）
                                if (item.labelLC90116) {
                                    if (item.labelLC90116.textFloor > 0 && !item.labelLC90116.text) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90116.title, '不能为空！');
                                    }
                                }
                            }
                            // 主要top房企业绩（不含挂证）
                            if (item.labelLC90116) {
                                validLabelText(modelStateDictionary, item, item.labelLC90116);
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
                                validLabelText(modelStateDictionary, item, item.labelLC90111);
                                validLabelText(modelStateDictionary, item, item.labelLC90112);
                                validLabelText(modelStateDictionary, item, item.labelLC90113);
                                validLabelText(modelStateDictionary, item, item.labelLC90116);
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