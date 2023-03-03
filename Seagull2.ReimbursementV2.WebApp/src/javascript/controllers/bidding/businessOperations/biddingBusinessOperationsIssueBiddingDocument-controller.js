define(
    [
        'app',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'biddingSynthesizeExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsIssueBiddingDocument_controller',
            function ($scope, viewData,
                wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator,
                sogWfControlOperationType,
                regionType, regionShowStyle, $injector, $http, seagull2Url, $rootScope, wfOperate) {
         
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100000000000,
                    precision: -1
                };

                // 设置 
                $scope.settings = {
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                        'firstLink': false
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsIssueBiddingDocument",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                };

                // 基本信息 
                $scope.baseInfo = {
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    // 联系人变更事件
                    linkManChange: function (newVal, oldVal) {
                        if (newVal == null && oldVal != null) {
                            $scope.viewModel.purchaseOfBusinessOperations.linkManUserCode = null;
                            $scope.viewModel.purchaseOfBusinessOperations.linkManUserName = null;
                        }
                    },
                };

                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                    var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            if (!v.replyDeadline) {
                                modelStateDictionary.addModelError("回标截止时间", "回标截止时间不能为空!");
                            }
                            if (!v.clearBinddingDeadline) {
                                modelStateDictionary.addModelError("清标时间", "清标时间不能为空!");
                            }
                            if (!v.evaluateBiddingDeadline) {
                                modelStateDictionary.addModelError("评标时间", "评标时间不能为空!");
                            }
                            if (!v.decideBiddingDeadline) {
                                modelStateDictionary.addModelError("定标时间", "定标时间不能为空!");
                            }
                        });
                    }
                    
                    if (!$scope.viewModel.purchaseOfBusinessOperations.linkMan || !$scope.viewModel.purchaseOfBusinessOperations.linkMan.id) {
                        modelStateDictionary.addModelError("招标人联系方式", "联系人不能为空");
                    }
                    if (!$scope.viewModel.purchaseOfBusinessOperations.linkManPhone) {
                        modelStateDictionary.addModelError("招标人联系方式", "联系电话不能为空");
                    } else {
                        var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfBusinessOperations.linkManPhone);
                        if (validPhoneNumber === false) {
                            modelStateDictionary.addModelError("招标人联系方式", "联系电话格式不正确");
                        }
                    }
                    if (!$scope.viewModel.purchaseOfBusinessOperations.linkManEmail) {
                        modelStateDictionary.addModelError("招标人联系方式", "邮箱不能为空");
                    } else {
                        var validEmail = regEmail.test($scope.viewModel.purchaseOfBusinessOperations.linkManEmail);
                        if (validEmail === false) {
                            modelStateDictionary.addModelError("招标人联系方式", "邮箱格式不正确");
                        }
                    }
                    angular.forEach($scope.viewModel.supplierScopeList, function (item, i) {
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
                            var validPhone = regPhoneNumber.test(item.linkPhone);
                            if (validPhone === false) {
                                modelStateDictionary.addModelError("入围供应商", "第" + (i + 1) + "行联系人电话格式不正确");
                            }
                        }
                    });
                    if ($scope.viewModel.biddingFile == null || $scope.viewModel.biddingFile.length == 0) {
                        modelStateDictionary.addModelError("标书", "标书附件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.biddingFile, function (file) {
                            if (!file.isDeleted)
                                count++;
                        });
                        if (count == 0)
                            modelStateDictionary.addModelError("标书", "标书附件不能为空");
                    }
                    return modelStateDictionary;
                };

                $scope.$watch('viewModel.purchaseOfBusinessOperations.linkMan', $scope.baseInfo.linkManChange, true); 

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
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve(getCleanModel());
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        defer.resolve(getCleanModel());
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };
            }
        );
    });