define([
    'app',
    'commonUtilExtend',
    'dateTimePickerExtend', 'leftNavExtend', 'biddingSynthesizeExtend'
], function (app) {
    app.controller('biddingNotProjectTendersIssued_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });

            $scope.wfOperateOpts.allowRejection = true;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            //基本信息
            $scope.baseInfo = {
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
                //单选人员
                selectRadioPeople: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                // 采购时间安排信息
                purchaseDateArrangeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'Send',
                },
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false,
                    'fileNumLimit': 10
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: 'SendTender',
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                fileReady: true
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
                if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                    modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能为空");
                    isValidAdopt = false;
                }
                if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                    modelStateDictionary.addModelError("采购时间安排", "评标时间不能为空");
                    isValidAdopt = false;
                }
                if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                    modelStateDictionary.addModelError("采购时间安排", "定标时间不能为空");
                    isValidAdopt = false;
                }
                if (isValidAdopt) {
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline) < new Date()) {
                        modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                    }
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline) < new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline)) {
                        modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于回标截止时间");
                    }
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline) < new Date($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline)) {
                        modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                    }
                }
                if ($scope.viewModel.biddingReportFile == null || $scope.viewModel.biddingReportFile.length == 0) {
                    modelStateDictionary.addModelError($scope.viewModel.biddingOrEnquiry + "文件", $scope.viewModel.biddingOrEnquiry + "文件不能为空");
                } else {
                    var count = 0;
                    angular.forEach($scope.viewModel.biddingReportFile, function (file) {
                        if (!file.isDeleted) {
                            count++;
                        }
                    });
                    if (count == 0) {
                        modelStateDictionary.addModelError($scope.viewModel.biddingOrEnquiry + "文件", $scope.viewModel.biddingOrEnquiry + "文件不能为空");
                    }
                }
                if (!$scope.viewModel.linkManUser || !$scope.viewModel.linkManUser.id) {
                    modelStateDictionary.addModelError("招标人联系方式", "联系人不能为空");
                }
                if (!$scope.viewModel.purchaseOfNotProjectPEMu.linkManPhone) {
                    modelStateDictionary.addModelError("招标人联系方式", "联系方式不能为空");
                } else {
                    var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfNotProjectPEMu.linkManPhone);
                    if (validPhoneNumber === false) {
                        modelStateDictionary.addModelError("招标人联系方式", "联系方式格式不正确");
                    }
                }
                if (!$scope.viewModel.purchaseOfNotProjectPEMu.linkManEmail) {
                    modelStateDictionary.addModelError("招标人联系方式", "E-mail不能为空");
                } else {
                    var validEmail = regEmail.test($scope.viewModel.purchaseOfNotProjectPEMu.linkManEmail);
                    if (validEmail === false) {
                        modelStateDictionary.addModelError("招标人联系方式", "E-mail格式不正确");
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
                            defer.resolve($scope.viewModel);
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


