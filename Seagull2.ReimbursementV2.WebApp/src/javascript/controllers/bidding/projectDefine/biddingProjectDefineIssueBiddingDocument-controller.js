define([
    'app',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend'
], function (app) {
    app.controller('biddingProjectDefineIssueBiddingDocument_controller', [
        '$scope', 'viewData', 'sogModal', 'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'sogOguType',
        function ($scope, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, sogOguType) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowRejection = true;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            //设置
            $scope.settings = {
                //附件设置项
                fileopts: {
                    'resourceId': $scope.viewModel.resourceID,
                },
                //单选人员
                peopleSelectOpts: {
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
                }
            }
            //基本信息
            $scope.baseInfo = {
                //验证手机
                validPhone: function () {
                    var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                    var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfProjectDefine.linkManPhone);
                    if ($scope.viewModel.purchaseOfProjectDefine.linkManPhone && validPhoneNumber === false) {
                        sogModal.openAlertDialog('招标联系电话', '招标联系电话格式不正确!');
                    }
                },
                //验证邮箱
                validEmail: function () {
                    var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                    var validEmail = regEmail.test($scope.viewModel.purchaseOfProjectDefine.linkManEmail);
                    if ($scope.viewModel.purchaseOfProjectDefine.linkManEmail && validEmail === false) {
                        sogModal.openAlertDialog("招标邮箱", "招标邮箱格式不正确!")
                    }
                }
            };
            //验证
            var validData = function () {
                var RequiredValidator = ValidateHelper.getValidator('Required');
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    { key: '招标联系人', attributeName: 'purchaseOfProjectDefine.linkManUser', validator: new RequiredValidator("不能为空！") },
                    { key: '招标联系电话', attributeName: 'purchaseOfProjectDefine.linkManPhone', validator: new RequiredValidator("不能为空！") },
                    { key: '招标邮箱', attributeName: 'purchaseOfProjectDefine.linkManEmail', validator: new RequiredValidator("不能为空！") },
                ]);
                //采购时间安排验证
                if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                    var purchaseDateArrangeInfo = $scope.viewModel.purchaseDateArrangeInfoList[0];
                    if (purchaseDateArrangeInfo.replyDeadline == null || purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || purchaseDateArrangeInfo.replyDeadline == "") {
                        modelStateDictionary.addModelError("回标截止时间", key + "回标截止时间不能为空");
                    }
                    if (purchaseDateArrangeInfo.evaluateBiddingDeadline == null || purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                        modelStateDictionary.addModelError("评标时间", key + "评标时间不能为空");
                    }
                    if (purchaseDateArrangeInfo.decideBiddingDeadline == null || purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                        modelStateDictionary.addModelError("定标时间", key + "定标时间不能为空");
                    }
                    if (new Date(purchaseDateArrangeInfo.replyDeadline) < new Date()) {
                        modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                    }
                    if (new Date(purchaseDateArrangeInfo.evaluateBiddingDeadline) < new Date(purchaseDateArrangeInfo.replyDeadline)) {
                        modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于回标截止时间");
                    }
                    if (new Date(purchaseDateArrangeInfo.decideBiddingDeadline) < new Date(purchaseDateArrangeInfo.evaluateBiddingDeadline)) {
                        modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                    }
                }
                //联系人电话与邮箱验证
                var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                if ($scope.viewModel.purchaseOfProjectDefine.linkManPhone && !regPhoneNumber.test($scope.viewModel.purchaseOfProjectDefine.linkManPhone))
                    modelStateDictionary.addModelError('招标联系电话', '请正确填写招标联系电话');
                if ($scope.viewModel.purchaseOfProjectDefine.linkManPhone && !regEmail.test($scope.viewModel.purchaseOfProjectDefine.linkManEmail))
                    modelStateDictionary.addModelError('招标邮箱', '请正确填写招标邮箱地址');
                //供应商信息验证
                if ($scope.viewModel.supplierScopeList.length) {
                    angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                        var key = '第' + (i + 1) + '行供应商';
                        if (!v.linkManName)
                            modelStateDictionary.addModelError("联系人", key + "联系人不能为空");
                        if (!v.linkPhone)
                            modelStateDictionary.addModelError("联系人电话", key + "联系人电话不能为空");
                        else {
                            if (regPhoneNumber.test(v.linkPhone) === false) {
                                modelStateDictionary.addModelError('联系人电话', key + '联系人电话格式不正确');
                            }
                        }
                        if (!v.linkEmail)
                            modelStateDictionary.addModelError("联系人邮箱", key + "联系人邮箱不能为空");
                        else {
                            if (regEmail.test(v.linkEmail) === false) {
                                modelStateDictionary.addModelError('联系人邮箱', key + '联系人邮箱格式不正确');
                            }
                        }
                    });
                }
                //招标文件
                if (!$scope.viewModel.purchaseOfProjectDefine.biddingFile || $scope.viewModel.purchaseOfProjectDefine.biddingFile.length === 0) {
                    modelStateDictionary.addModelError('招标文件', '招标文件不能为空！');
                } else {
                    var count = 0;
                    angular.forEach($scope.viewModel.purchaseOfProjectDefine.biddingFile, function (file) {
                        if (!file.isDeleted) {
                            count++;
                        }
                    });
                    if (count == 0) {
                        modelStateDictionary.addModelError("招标文件", "招标文件不能为空！");
                    }
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
                } else {
                    defer.resolve($scope.viewModel);
                }
            };
        }
    ]);
});