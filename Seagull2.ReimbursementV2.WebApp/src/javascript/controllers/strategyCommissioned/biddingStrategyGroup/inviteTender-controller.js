define([
    'app',
    'commonUtilExtend',
    'leftNavExtend',
    'dateTimePickerExtend'], function (app) {
        app.controller('tendersIssued_controller',
            function ($scope, sogModal, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集团战采）";
                $scope.wfOperateOpts.allowRejection = true;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                //基本信息
                $scope.baseInfo = {
                    //采购信息是否显示招标附件
                    isShowbiddingReportFile: true,
                    //采购信息是否编辑招标附件
                    isEditbiddingReportFile: true,
                    isShowUser: true,
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "InviteTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //采购时间安排
                    purchaseDateArrangeInfoPEMus: function () {
                        var purchaseDateArrangeInfoPEMuList = [];
                        angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                            if (item.className == 5) {
                                purchaseDateArrangeInfoPEMuList.push(item);
                            }
                        });
                        return purchaseDateArrangeInfoPEMuList;
                    },
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    fileReady: true,
                };

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    var isValidAdopt = true;
                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 5) {
                            if (item.questionDeadline == null || item.questionDeadline == "0001-01-01T00:00:00" || item.questionDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "供应商提问截止时间不能为空");
                                isValidAdopt = false;
                            }
                            if (item.replyDeadline == null || item.replyDeadline == "0001-01-01T00:00:00" || item.replyDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能为空");
                                isValidAdopt = false;
                            }
                            if (item.clearBinddingDeadline == null || item.clearBinddingDeadline == "0001-01-01T00:00:00" || item.clearBinddingDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "清标时间不能为空");
                                isValidAdopt = false;
                            }
                            if (item.evaluateBiddingDeadline == null || item.evaluateBiddingDeadline == "0001-01-01T00:00:00" || item.evaluateBiddingDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "评标时间不能为空");
                                isValidAdopt = false;
                            }
                            if (item.decideBiddingDeadline == null || item.decideBiddingDeadline == "0001-01-01T00:00:00" || item.decideBiddingDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "定标时间不能为空");
                                isValidAdopt = false;
                            }
                            if (isValidAdopt) {
                                if (new Date(item.questionDeadline) < new Date()) {
                                    modelStateDictionary.addModelError("采购时间安排", "供应商提问截止时间不能小于当前时间");
                                }
                                if (new Date(item.replyDeadline) < new Date(item.questionDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于供应商提问截止时间");
                                }
                                if (new Date(item.clearBinddingDeadline) < new Date(item.replyDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "清标时间不能小于回标截止时间");
                                }
                                if (new Date(item.evaluateBiddingDeadline) < new Date(item.clearBinddingDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于清标时间");
                                }
                                if (new Date(item.decideBiddingDeadline) < new Date(item.evaluateBiddingDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                                }
                            }
                        }
                    });
                    if (!$scope.viewModel.linkManUser) modelStateDictionary.addModelError("招标主责人", "招标主责人不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.linkManPhone) {
                        modelStateDictionary.addModelError("招标主责人", "联系方式不能为空");
                    } else {
                        var validPhoneNumber = regPhoneNumber.test($scope.viewModel.p_StrategyPurchasePlanCase.linkManPhone);
                        if (validPhoneNumber === false) {
                            modelStateDictionary.addModelError("招标主责人", "联系方式格式不正确");
                        }
                    }
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.linkManEmail) {
                        modelStateDictionary.addModelError("招标主责人", "E-mail不能为空");
                    } else {
                        var validEmail = regEmail.test($scope.viewModel.p_StrategyPurchasePlanCase.linkManEmail);
                        if (validEmail === false) {
                            modelStateDictionary.addModelError("招标主责人", "E-mail格式不正确");
                        }
                    }
                    angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (item, i) {
                        if (!item.linkManName) modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人不能为空");
                        if (!item.linkEmail) {
                            modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人邮箱不能为空");
                        } else {
                            var validEmail = regEmail.test(item.linkEmail);
                            if (validEmail === false) {
                                modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人邮箱格式不正确");
                            }
                        }
                        if (!item.linkPhone) {
                            modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人电话不能为空");
                        } else {
                            var validPhoneNumber = regPhoneNumber.test(item.linkPhone);
                            if (validPhoneNumber === false) {
                                modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人电话格式不正确");
                            }
                        }
                    });
                    if ($scope.viewModel.biddingReportFile == null || $scope.viewModel.biddingReportFile.length == 0) {
                        modelStateDictionary.addModelError("附件", "招标文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.biddingReportFile, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "招标文件不能为空");
                        }
                    }
                    return modelStateDictionary;
                };
                var checkFileData = function () {
                    if (!$scope.baseInfo.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    return true;
                };
                //收集数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    if (checkFileData()) {
                        switch (e.operationType) {
                            case sogWfControlOperationType.MoveTo:
                                var result = validData();
                                if (!result.isValid()) {
                                    sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                    sogValidator.broadcastResult(result.get());
                                    defer.reject($scope.viewModel);
                                } else {
                                    defer.resolve($scope.viewModel);
                                }
                                break;
                            case sogWfControlOperationType.Save:
                                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                                    {
                                        key: '', attributeName: '', validator: new RequiredValidator('')
                                    }
                                ]);
                                var validPhoneNumber = regPhoneNumber.test($scope.viewModel.p_StrategyPurchasePlanCase.linkManPhone);
                                if ($scope.viewModel.p_StrategyPurchasePlanCase.linkManPhone && validPhoneNumber === false) {
                                    modelStateDictionary.addModelError("招标主责人", "联系方式格式不正确");
                                }
                                var validEmail = regEmail.test($scope.viewModel.p_StrategyPurchasePlanCase.linkManEmail);
                                if ($scope.viewModel.p_StrategyPurchasePlanCase.linkManEmail && validEmail === false) {
                                    modelStateDictionary.addModelError("招标主责人", "E-mail格式不正确");
                                }
                                angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (item, i) {
                                    var validEmail = regEmail.test(item.linkEmail);
                                    if (item.linkEmail && validEmail === false) {
                                        modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人邮箱格式不正确");
                                    }
                                    var validPhoneNumber = regPhoneNumber.test(item.linkPhone);
                                    if (item.linkPhone && validPhoneNumber === false) {
                                        modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人电话格式不正确");
                                    }
                                });
                                if (!modelStateDictionary.isValid()) {
                                    sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                    sogValidator.broadcastResult(modelStateDictionary.get());
                                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                                        if (item.className == 5) {
                                            if (item.questionDeadline == null || item.questionDeadline == "") {
                                                item.questionDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.questionDeadline == null || item.questionDeadline == "") {
                                                item.questionDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.replyDeadline == null || item.replyDeadline == "") {
                                                item.replyDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.clearBinddingDeadline == null || item.clearBinddingDeadline == "") {
                                                item.clearBinddingDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.evaluateBiddingDeadline == null || item.evaluateBiddingDeadline == "") {
                                                item.evaluateBiddingDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.decideBiddingDeadline == null || item.decideBiddingDeadline == "") {
                                                item.decideBiddingDeadline == "0001-01-01T00:00:00";
                                            }
                                        }
                                    });
                                    defer.reject($scope.viewModel);
                                } else {
                                    defer.resolve($scope.viewModel);
                                }
                                break;
                            case sogWfControlOperationType.CancelProcess:
                                defer.resolve($scope.viewModel);
                                break;
                            default:
                                defer.resolve(null);
                                break;
                        }
                    }

                };
            });
    });


