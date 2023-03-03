define([
    'app',
    'purchasePlanChoose',
], function (app) {
    app.controller('purchaseSchemeApplication_controller',
        function ($scope, wfOperate, $rootScope, sogModal, seagull2Url, viewData, ValidateHelper, sogWfControlOperationType, sogOguType, sogValidator) {
            angular.extend($scope, viewData);
            $scope.wfOperateOpts.allowComment = false; //评论
            $scope.mainTitle = '采购前置流程';
            $scope.title = '采购前置流程';
            //基本信息
            $scope.baseInfo = {
                purchasePlanList: [],

                //采购计划选择后数据变化
                purchasePlanSelected: function () {
                    var viewpath = './htmlTemplate/dialogTemplate/purchaseScheme/purchasePlanChooseView.html';
                    var result = sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                        '选择采购计划', "purchasePlanChoose_controller", $scope, {
                        containerStyle: {
                            width: '60%'
                        }
                    });
                    result.then(function (resultData) {
                        $scope.viewModel.purchaseSchemeRecordActionEx.purchasePlanItemCode = resultData.code;
                        $scope.viewModel.purchaseSchemeRecordActionEx.purchasePlanItemName = resultData.purchaseName;
                        $scope.viewModel.purchaseSchemeRecordActionEx.purchaseName = resultData.purchaseName;
                        if (resultData.preEnterSupplyDate != null) {
                            $scope.viewModel.purchaseSchemeRecordActionEx.preEnterSupplyDate = resultData.preEnterSupplyDate;
                            var pageTime = resultData.preEnterSupplyDate.substring(0, resultData.preEnterSupplyDate.indexOf('T'));
                            $("#preEnterSupplyDateInput").val(pageTime);
                        }
                        if (resultData.preSupplierPutInDate != null) {
                            $scope.viewModel.purchaseSchemeRecordActionEx.supplierStorageStartDate = resultData.preSupplierPutInDate;
                            var pageTime = resultData.preSupplierPutInDate.substring(0, resultData.preSupplierPutInDate.indexOf('T'));
                            $("#supplierStorageStartDateInput").val(pageTime);
                        }
                        if (resultData.preStartDate != null) {
                            $scope.viewModel.purchaseSchemeRecordActionEx.preStartDate = resultData.preStartDate;
                            var pageTime = resultData.preStartDate.substring(0, resultData.preStartDate.indexOf('T'));
                            $("#preStartDateInput").val(pageTime);
                        }
                        if (resultData.preEndDate != null) {
                            $scope.viewModel.purchaseSchemeRecordActionEx.preEndDate = resultData.preEndDate;
                            var pageTime = resultData.preEndDate.substring(0, resultData.preEndDate.indexOf('T'));
                            $("#preEndDateInput").val(pageTime);
                        }
                        if (resultData.preContractSignDate != null) {
                            $scope.viewModel.purchaseSchemeRecordActionEx.preContractSignDate = resultData.preContractSignDate;
                            var pageTime = resultData.preContractSignDate.substring(0, resultData.preContractSignDate.indexOf('T'));
                            $("#preContractSignDateInput").val(pageTime);
                        }
                    });
                },
                inint: function () {
                    angular.forEach($scope.viewModel.option.specialtyList, function (item) {
                        item.code = parseInt(item.code);
                    });
                }
            }
            $scope.baseInfo.inint();

            $scope.settings = {
                //选采购计划配置
                purchasePlanOpts: {
                    'resourceId': $scope.viewModel.resourceID,
                },
                amountOpts: {
                    min: 1,
                    max: 1000,
                    precision: -1
                },
                peopleSelect: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                editSate: false
            }

            //资料提供
            $scope.fileInfoPro = {
                //是否全选
                isCheckAll: false,
                //添加
                addItem: function () {
                    $scope.viewModel.materialFeedbackInfoList.push({
                        canDelete: true,
                        canEditFileName: true
                    });
                },
                //删除
                deleteItem: function () {
                    var selected = false;
                    if ($scope.viewModel.materialFeedbackInfoList !== null || $scope.viewModel.materialFeedbackInfoList.length > 0) {
                        angular.forEach($scope.viewModel.materialFeedbackInfoList, function (item) {
                            if (item.checked)
                                selected = true;
                        });
                    }
                    if (selected === false) {
                        sogModal.openAlertDialog('提示', "请选择需要删除行!");
                        return;
                    }
                    var promise = sogModal.openConfirmDialog("提示", "确认是否删除?");
                    promise.then(function (v) {
                        for (var i = $scope.viewModel.materialFeedbackInfoList.length - 1; i >= 0; i--) {
                            var item = $scope.viewModel.materialFeedbackInfoList[i];
                            if (item.checked) {
                                $scope.viewModel.materialFeedbackInfoList.splice(i, 1);
                            }
                        }
                        $scope.fileInfoPro.isCheckAll = false;
                    });
                },
                //全选
                checkAll: function () {
                    for (var i = 0; i < $scope.viewModel.materialFeedbackInfoList.length; i++) {
                        var item = $scope.viewModel.materialFeedbackInfoList[i];
                        item.checked = !$scope.fileInfoPro.isCheckAll;
                    }
                },
                //选择职能
                specialtyChange: function (item) {
                    angular.forEach($scope.viewModel.option.specialtyList, function (v) {
                        if (v.code === item.specialtyCode) {
                            item.specialtyName = v.name;
                            item.specialtyCode = v.code;
                        }
                    });
                },

            }

            $rootScope.$on("$processRefreshed", function (event, data) {
                $scope.viewModel.purchaseSchemeRecordActionEx.preStartDate = "2019-11-06T01:43:23.833+08:00";
            });

            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");
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

            var checkData = function () {
                sogValidator.clear();
                var error = ValidateHelper.validateData($scope.viewModel, [
                    { key: '关联采购计划', attributeName: 'purchaseSchemeRecordActionEx.purchasePlanItemName', validator: new RequiredValidator('不能为空！') },
                    { key: '采购名称', attributeName: 'purchaseSchemeRecordActionEx.purchaseName', validator: new RequiredValidator('不能为空！') },
                    { key: '供应商入围标准', attributeName: 'purchaseSchemeRecordActionEx.supplierFinalistStandard', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    { key: '本次采购范围和内容', attributeName: 'purchaseSchemeRecordActionEx.purchaseContent', validator: new RequiredValidator('不能为空！') },
                    { key: '本次采购范围和内容', attributeName: 'purchaseSchemeRecordActionEx.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                ]);

                if ($scope.viewModel.purchaseSchemeRecordActionEx.preEnterSupplyDate == null || $scope.viewModel.purchaseSchemeRecordActionEx.preEnterSupplyDate == "0001-01-01T00:00:00" || $scope.viewModel.purchaseSchemeRecordActionEx.preEnterSupplyDate == "") {
                    error.addModelError("预计进场/供货日期", "预计进场/供货日期不能为空");
                }
                if ($scope.viewModel.purchaseSchemeRecordActionEx.supplierStorageStartDate == null || $scope.viewModel.purchaseSchemeRecordActionEx.supplierStorageStartDate == "0001-01-01T00:00:00" || $scope.viewModel.purchaseSchemeRecordActionEx.supplierStorageStartDate == "") {
                    error.addModelError("供应商入库开始时间", "供应商入库开始时间不能为空");
                }
                if ($scope.viewModel.purchaseSchemeRecordActionEx.preStartDate == null || $scope.viewModel.purchaseSchemeRecordActionEx.preStartDate == "0001-01-01T00:00:00" || $scope.viewModel.purchaseSchemeRecordActionEx.preStartDate == "") {
                    error.addModelError("计划采购开始日期", "计划采购开始日期不能为空");
                }
                if ($scope.viewModel.purchaseSchemeRecordActionEx.preEndDate == null || $scope.viewModel.purchaseSchemeRecordActionEx.preEndDate == "0001-01-01T00:00:00" || $scope.viewModel.purchaseSchemeRecordActionEx.preEndDate == "") {
                    error.addModelError("计划采购结束日期", "计划采购结束日期不能为空");
                }
                if ($scope.viewModel.purchaseSchemeRecordActionEx.preContractSignDate == null || $scope.viewModel.purchaseSchemeRecordActionEx.preEndDate == "0001-01-01T00:00:00" || $scope.viewModel.purchaseSchemeRecordActionEx.preEndDate == "") {
                    error.addModelError("合同订立日期", "合同订立日期不能为空");
                }
                if ($scope.viewModel.materialFeedbackInfoList != null && $scope.viewModel.materialFeedbackInfoList.length > 0) {
                    angular.forEach($scope.viewModel.materialFeedbackInfoList, function (v, i) {
                        var key = '第' + (i + 1) + '行资料反馈信息';
                        if (v.specialtyCode == null || v.specialtyCode == "") {
                            error.addModelError("职能", key + "职能不能为空");
                        }
                        if (v.feedbackUser == null || v.feedbackUser == "") {
                            error.addModelError("反馈人员", key + "反馈人员不能为空");
                        }
                        if (v.feedbackContent == null || v.feedbackContent == "") {
                            error.addModelError("反馈内容与要求", key + "反馈内容与要求不能为空");
                        }
                        if (v.feedbackDeadline == null || v.feedbackDeadline == "0001-01-01T00:00:00" || v.feedbackDeadline == "") {
                            error.addModelError("反馈期限", key + "反馈期限不能为空");
                        }
                    });
                } else {
                    error.addModelError("资料反馈", "资料反馈信息至少添加一行数据");
                }

                if (!error.isValid()) {
                    sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                    sogValidator.broadcastResult(error.get());
                    return false;
                }
                return true;
            }

            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    if (checkData(e)) {
                        defer.resolve($scope.viewModel);
                    } else {
                        defer.reject($scope.viewModel);
                    }
                } else {
                    defer.resolve($scope.viewModel);
                }
            }

        });
});

