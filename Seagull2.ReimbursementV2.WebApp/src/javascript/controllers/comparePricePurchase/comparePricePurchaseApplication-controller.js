define([
    'app',
    'commonUtilExtend',
    'engineeringExtend',
    'comparePriceSynthesizeExtend'
], function (app) {
    app.controller('comparePricePurchaseApplication_controller', [
        '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator',
        function ($scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "比价采购";
            console.log($scope.viewModel);
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = true;//作废 
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = true;  //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
           
            // 基本信息
            $scope.baseInfo = {
                init: function () {
                    angular.forEach($scope.viewModel.supplierScopeList, function (item) {
                        if (item.isInstock == true)
                            item.isInstock = "true";
                        if (item.isInstock == false)
                            item.isInstock = "false";
                    });
                },
                // 附件设置项
                fileopts: {
                    'resourceId': $scope.viewModel.resourceID,
                },           
       
                //采购金额变化
                purchaseAmountChange: function (newValue, oldValue) {
                    if ((newValue) && newValue != oldValue) {
                        $scope.refreshProcess();
                    }
                },             
            };

            $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);
            $scope.$watch('viewModel.purchaseOfComparePrice.project', $scope.baseInfo.projectChange);
            $scope.$watch('viewModel.corporationScopeList', $scope.baseInfo.corporationChange);
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
            
            // 自定义校验器-判断下拉框必填
            var RequiredSelectValidator = (function () {
                return function (message) {
                    this.validateData = function (value, name, validationContext) {
                        if ((!value) || value.length === 0 || value === 0 || value === '0') {
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
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                    { key: '记账公司', attributeName: 'purchaseOfComparePrice.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                    { key: '成本中心', attributeName: 'purchaseOfComparePrice.costCenterCode', validator: new RequiredValidator('请选择！') },
                    { key: '业务类别', attributeName: 'purchaseOfComparePrice.comparePriceBusinessTypeName', validator: new RequiredSelectValidator('请选择！') },
                    { key: '本次采购范围和内容', attributeName: 'purchaseOfComparePrice.purchaseContent', validator: new RequiredValidator('不能为空！') },
                    { key: '本次采购范围和内容', attributeName: 'purchaseOfComparePrice.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                ]);
                // 项目名称
                if ($scope.viewModel.purchaseOfComparePrice.isInvolveProject) {
                    if (!$scope.viewModel.purchaseOfComparePrice.projectCode) {
                        modelStateDictionary.addModelError('项目名称', '请选择！');
                    }
                }
                // 招标人
                if (angular.isArray($scope.viewModel.corporationScopeList) === false || $scope.viewModel.corporationScopeList.length === 0) {
                    modelStateDictionary.addModelError('法人公司', '请选择！');
                }
                // 入围供应商
                if (angular.isArray($scope.viewModel.supplierScopeList) === false
                    || $scope.viewModel.supplierScopeList.length === 0) {
                    modelStateDictionary.addModelError('入围供应商', '请添加！');
                } else {
                    if ($scope.viewModel.supplierScopeList.length < 2) {
                        modelStateDictionary.addModelError("入围供应商", "入围供应商不能小于两家");
                    }
                }
                // 邮箱验证
                var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                if ($scope.viewModel.supplierScopeList.length) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                        var key = '第' + (i + 1) + '行供应商';
                        if (v.isInstock == "")
                            modelStateDictionary.addModelError("是否入库", key + "请选择");
                        if (!v.supplierCode)
                            modelStateDictionary.addModelError("供应商名称", key + "请选择");
                        if (v.finalQuoteAmount == 0)
                            modelStateDictionary.addModelError("最终报价", key + "最终报价不能为0");
                        if (v.finalQuoteAmount == null || v.finalQuoteAmount == "")
                            modelStateDictionary.addModelError("最终报价", key + "最终报价不能为空");
                        if (v.isTinySupplier && v.finalQuoteAmount > 50000) {
                            modelStateDictionary.addModelError("小微供应商", key + "为小微供应商,小微供应商的合同金额需≤五万元");
                        }
                        if (v.quotationFile == null || v.quotationFile.length == 0)
                            modelStateDictionary.addModelError("报价单", key + "报价单不能为空");
                        if (!v.linkManName)
                            modelStateDictionary.addModelError("供应商联系人", key + "供应商联系人不能为空");
                        if (!v.linkEmail)
                            modelStateDictionary.addModelError("邮箱", key + "邮箱不能为空");
                        else {
                            if (regEmail.test(v.linkEmail) === false) {
                                modelStateDictionary.addModelError('邮箱', key + '邮箱格式不正确');
                            }
                        }
                    });
                }
                // 拟定中标供应商
                if (angular.isArray($scope.viewModel.perSignContractInfoList) === false || $scope.viewModel.perSignContractInfoList.length === 0) {
                    modelStateDictionary.addModelError('拟定中标供应商', '拟定中标供应商不能为空！');
                } else {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        var item = $scope.viewModel.perSignContractInfoList[i];
                        if (!item.supplierCode) {
                            modelStateDictionary.addModelError('拟定中标供应商第' + (i + 1) + '行，供应商名称', '请选择！');
                        }
                        if (!item.corporationCode) {
                            modelStateDictionary.addModelError('拟定中标供应商第' + (i + 1) + '行，法人公司', '请选择！');
                        }
                        if (!item.explain) {
                            modelStateDictionary.addModelError('拟定中标供应商第' + (i + 1) + '行，中标说明', '不能为空！');
                        }
                        if (!item.operatorUser && $scope.viewModel.purchaseOfComparePrice.isSignContract) {
                            modelStateDictionary.addModelError('拟定中标供应商第' + (i + 1) + '行，合同经办人', '请选择！');
                        }
                    }
                }
                // 审批流
                if (angular.isArray($scope.opinionOpts.options) === false || $scope.opinionOpts.options.length === 0) {
                    modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
                }
                return modelStateDictionary;
            };
            // 保存验证
            var saveValidData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                    { key: '本次采购范围和内容', attributeName: 'purchaseOfComparePrice.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                ]);
                return modelStateDictionary;
            };
            // 附件是否上传完成
            var checkFileData = function () {
                var retrunFlag = true;
                if ($scope.viewModel.supplierScopeList.length) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                        if (v.quotationFile != null && v.quotationFile.length > 0) {
                            angular.forEach($scope.viewModel.otherFile, function (item) {
                                if (!item.uploaded) {
                                    retrunFlag = false;
                                }
                            });
                        }
                    });
                }
                if ($scope.viewModel.otherFile != null && $scope.viewModel.otherFile.length > 0) {
                    angular.forEach($scope.viewModel.otherFile, function (item) {
                        if (!item.uploaded) {
                            retrunFlag = false;
                        }
                    });
                }
                if (!retrunFlag) {
                    sogModal.openAlertDialog('提示', '附件未上传完毕');
                }
                return retrunFlag;
            };
            // 复制viewModel
            function getCleanModel() {
                var model = {};
                angular.extend(model, $scope.viewModel);
                angular.forEach(model.supplierScopeList, function (v, i) {
                    if (v.finalQuoteAmount === null || v.finalQuoteAmount === "")
                        v.finalQuoteAmount = 0;
                });
                return model;
            };
            //提交数据
            $scope.collectData = function (e, defer) {
                sogValidator.clear();
                var result;
                if (checkFileData()) {
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
                }
            };
            // 刷新流程
            $scope.refreshProcess = function () {
                var param = {
                    PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,           //本次采购金额
                    ChargeCompanyCode: $scope.viewModel.purchaseOfComparePrice.chargeCompanyCode,     //记账公司编码
                    CostCenterCode: $scope.viewModel.purchaseOfComparePrice.costCenterCode,   //成本中心
                };
                if (!param.PurchaseAmount) { param.PurchaseAmount = 0; }
                if (param.PurchaseAmount != 0 && param.CostCenterCode != "") {
                    wfOperate.refreshProcess('/ComparePricePurchaseApplicationWf', $scope.currentActivityId, null, param, true);
                }
            };
            $rootScope.$on("$processRefreshed", function (event, data) {
                angular.extend($scope.opinionOpts, data.opinionOpts);
            });
            $scope.baseInfo.init();
        }
    ]);
});
