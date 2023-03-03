define(
    [
        'app',
        'biddingSynthesizeExtend',
        'dateTimePickerExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseSendTender_controller', [
            '$scope', 'viewData', 'sogModal',
            'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'sogOguType', 'regex',
            function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, sogOguType, regex) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态 
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = true;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
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
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Send',
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': "Send",
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "SendTender",
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
                    //验证邮箱
                    validEmail: function () {
                        var validEmail = regex.email.test($scope.viewModel.purchaseOfFixedAssets.linkManEmail);
                        if ($scope.viewModel.purchaseOfFixedAssets.linkManEmail && validEmail === false) {
                            sogModal.openAlertDialog("E-mail", "E-mail格式不正确!")
                        }
                    },
                    //验证邮箱
                    validPhone: function () {
                        var validPhoneNumber = regex.phoneNumber.test($scope.viewModel.purchaseOfFixedAssets.linkManPhone);
                        if ($scope.viewModel.purchaseOfFixedAssets.linkManPhone && validPhoneNumber === false) {
                            sogModal.openAlertDialog('联系电话', '联系电话格式不正确!');
                        }
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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '招投标联系人', attributeName: 'purchaseOfFixedAssets.linkMan', validator: new RequiredValidator("不能为空！") },
                        { key: '联系电话', attributeName: 'purchaseOfFixedAssets.linkManPhone', validator: new RequiredValidator("不能为空！") },
                        { key: 'E-mail', attributeName: 'purchaseOfFixedAssets.linkManEmail', validator: new RequiredValidator("不能为空！") }
                    ]);

                    // 采购时间安排
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行采购时间安排';
                            if (!v.replyDeadline) {
                                modelStateDictionary.addModelError("回标截止时间", key + "不能为空！");
                            }
                            if (!v.evaluateBiddingDeadline) {
                                modelStateDictionary.addModelError("评标时间", key + "不能为空！");
                            }
                            if (!v.decideBiddingDeadline) {
                                modelStateDictionary.addModelError("定标时间", key + "不能为空！");
                            }
                        });
                    }


                    //联系人电话与邮箱验证 
                    var validPhoneNumber = regex.phoneNumber.test($scope.viewModel.purchaseOfFixedAssets.linkManPhone);
                    var validEmail = regex.email.test($scope.viewModel.purchaseOfFixedAssets.linkManEmail);
                    if (validPhoneNumber === false) {
                        modelStateDictionary.addModelError('联系电话', '请正确填写联系电话！');
                    }

                    if (validEmail === false) {
                        modelStateDictionary.addModelError('E-mail', '请正确填写E-mail地址！');
                    }
                    //供应商信息验证
                    if ($scope.viewModel.supplierScopeList.length) {
                        angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                            var key = '第' + (i + 1) + '行供应商';
                            if (!v.linkManName) { modelStateDictionary.addModelError("联系人", key + "联系人不能为空！"); }
                            else if (v.linkManName.length > 50) { modelStateDictionary.addModelError("联系人", key + "联系人不能大于50个字符！"); }

                            if (!v.linkPhone)
                                modelStateDictionary.addModelError("联系人电话", key + "联系人电话不能为空！");
                            else {
                                if (regex.phoneNumber.test(v.linkPhone) === false) {
                                    modelStateDictionary.addModelError('联系人电话', key + '联系人电话格式不正确！');
                                }
                            }
                            if (!v.linkEmail)
                                modelStateDictionary.addModelError("联系人邮箱", key + "联系人邮箱不能为空！");
                            else {
                                if (regex.email.test(v.linkEmail) === false) {
                                    modelStateDictionary.addModelError('联系人邮箱', key + '联系人邮箱格式不正确！');
                                }
                            }
                        });
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '联系电话', attributeName: 'purchaseOfFixedAssets.linkManPhone', validator: new stringMaxLengthValidator(50, "不能大于50个字符！") },
                        { key: 'E-mail', attributeName: 'purchaseOfFixedAssets.linkManEmail', validator: new stringMaxLengthValidator(50, "不能大于50个字符！") }
                    ]);
                    //供应商信息验证
                    if ($scope.viewModel.supplierScopeList.length) {
                        angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                            var key = '第' + (i + 1) + '行供应商';
                            if (v.linkManName && v.linkManName.length > 50) {
                                modelStateDictionary.addModelError("联系人", key + "联系人不能大于50个字符！");
                            }
                            if (v.linkPhone && v.linkPhone.length > 50) {
                                modelStateDictionary.addModelError('联系人电话', key + '联系人电话不能大于50个字符！');
                            }
                            if (v.linkEmail && v.linkEmail.length > 50) {
                                modelStateDictionary.addModelError('联系人邮箱', key + '联系人邮箱不能大于50个字符！');
                            }
                        });
                    }
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