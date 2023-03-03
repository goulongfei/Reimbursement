﻿define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
    ],
    function (app) {
        app.controller('directCommissionedMaintenanceStartupContract_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            function ($scope, viewData, $http, seagull2Url,
                wfWaiting, sogModal, ValidateHelper, sogValidator,
                sogWfControlOperationType) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（第三方维保类）';
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = true;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdraw = !!$scope.viewModel.isAdmin && !$scope.viewModel.completedCompleted;//撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

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
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 设置
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'startupContractEdit',
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
                    var RangeValidator = ValidateHelper.getValidator('Range');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "采购名称不能大于30个字符!") }
                    ]);
                    // 附件
                    //var authorizedUploaded = false;
                    //if ($scope.viewModel.authorizedFile && angular.isArray($scope.viewModel.authorizedFile.contractFileList)) {
                    //    for (var i = 0; i < $scope.viewModel.authorizedFile.contractFileList.length; i++) {
                    //        var item = $scope.viewModel.authorizedFile.contractFileList[i];
                    //        if (item.uploaded === true && item.isDeleted !=== true) {
                    //            authorizedUploaded = true;
                    //        }
                    //    }
                    //}
                    //if (authorizedUploaded === false) {
                    //    modelStateDictionary.addModelError('', '请上传！');
                    //} 

                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "采购名称不能大于30个字符!") }
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    model.purchaseOfMaintenance.cityInput = null;
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

                //更新供应商更名后最新名称
                $scope.isUpdateSupplier = true;
                function Init() {
                    wfWaiting.show();
                    $scope.isUpdateSupplier = false;
                    var suppliers = [];
                    if ($scope.viewModel.purchaseDelegationInfoList.length > 0) {
                        angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (item) {
                            var supplier = {};
                            supplier.supplierCode = item.supplierCode;
                            supplier.supplierName = item.supplierName;
                            suppliers.push(supplier);
                        });

                        var baseUrl = seagull2Url.getPlatformUrlBase() + "/SupplierChangeNameRecord/GetSupplierChangedList";
                        var url = baseUrl.replace("ReimbursementV2", "SupplierV2");
                        $http.post(url, suppliers)
                            .success(function (data) {
                                wfWaiting.hide();
                                var tip = "";
                                var supplierRecords = [];
                                angular.forEach(data.data, function (record) {
                                    angular.forEach(suppliers, function (supplier) {
                                        var supplierRecord = {};
                                        if (supplier.supplierCode == record.supplierCode && supplier.supplierName != record.supplierNewName) {
                                            supplier.isNeedUpdate = true;
                                            $scope.isUpdateSupplier = true;
                                            supplierRecord.supplierName = supplier.supplierName;
                                            supplierRecord.supplierNewName = record.supplierNewName;
                                            supplierRecords.push(supplierRecord);
                                        }
                                    });
                                });
                                var names = "";
                                var newNames = "";
                                for (var i = 0; i < supplierRecords.length; i++) {
                                    names += supplierRecords[i].supplierName + (supplierRecords.length > 1 && i < supplierRecords.length - 1 ? "," : "");
                                    newNames += supplierRecords[i].supplierNewName + (supplierRecords.length > 1 && i < supplierRecords.length - 1 ? "," : "");
                                }
                                tip = "供应商" + names + "已更名为" + newNames + "，是否更新流程中该供应商为最新名称";

                                if ($scope.isUpdateSupplier) {
                                    var promise = sogModal.openConfirmDialog("提示", tip);
                                    promise.then(function () {
                                        angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (item) {
                                            angular.forEach(data.data, function (record) {
                                                if (item.supplierCode == record.supplierCode) {
                                                    item.supplierName = record.supplierNewName;
                                                }
                                            });
                                        });
                                        $scope.isUpdateSupplier = false;
                                    }, function () {
                                    });
                                }

                            }).error(function (data, status) {
                                errorDialog.openErrorDialog("提示", "查询供应商更名信息数据异常，请稍后再试");
                                console.log(data, status);
                                wfWaiting.hide();
                            });
                    }
                }

                if ($scope.isUpdateSupplier) {
                    Init();
                }
            }
        ]);
    });