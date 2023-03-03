define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopSendTender_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = true;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                //设置
                $scope.settings = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                }

                //基本信息
                $scope.baseInfo = {
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
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
                    //验证邮箱
                    validEmail: function () {
                        var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                        var validEmail = regEmail.test($scope.viewModel.purchaseOfLandDevelop.linkManEmail);
                        if ($scope.viewModel.purchaseOfLandDevelop.linkManEmail && validEmail === false) {
                            sogModal.openAlertDialog("E-mail", "E-mail格式不正确!")
                        }
                    },
                    //验证邮箱
                    validPhone: function () {
                        var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                        var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfLandDevelop.linkManPhone);
                        if ($scope.viewModel.purchaseOfLandDevelop.linkManPhone && validPhoneNumber === false) {
                            sogModal.openAlertDialog('联系电话', '联系电话格式不正确!');
                        }
                    }
                };

                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        { key: '招投标联系人', attributeName: 'purchaseOfLandDevelop.linkManUser', validator: new RequiredValidator("不能为空！") },
                        { key: '联系电话', attributeName: 'purchaseOfLandDevelop.linkManPhone', validator: new RequiredValidator("不能为空！") },
                        { key: 'E-mail', attributeName: 'purchaseOfLandDevelop.linkManEmail', validator: new RequiredValidator("不能为空！") },
                    ]);

                    if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                        error.addModelError("回标截止时间", key + "回标截止时间不能为空");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                        error.addModelError("评标时间", key + "评标时间不能为空");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                        error.addModelError("定标时间", key + "定标时间不能为空");
                    }

                    if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline < new Date()) {
                        error.addModelError("回标截止时间", key + "回标截止时间不能小于当前时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline < new Date()) {
                        error.addModelError("评标时间", key + "评标时间不能小于当前时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline < new Date()) {
                        error.addModelError("定标时间", key + "定标时间不能小于当前时间");
                    }

                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline < $scope.viewModel.purchaseDateArrangeInfo.replyDeadline) {
                        error.addModelError("评标时间", key + "评标时间不能小于回标截止时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline < $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline) {
                        error.addModelError("定标时间", key + "定标时间不能小于评标时间");
                    }


                    //联系人电话与邮箱验证
                    var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                    var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                    var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfLandDevelop.linkManPhone);
                    var validEmail = regEmail.test($scope.viewModel.purchaseOfLandDevelop.linkManEmail);
                    if (validPhoneNumber === false) {
                        error.addModelError('联系电话', '请正确填写联系电话');
                    }

                    if (validEmail === false) {
                        error.addModelError('E-mail', '请正确填写E-mail地址');
                    }
                    //供应商信息验证
                    if ($scope.viewModel.supplierScopeList.length) {
                        angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                            var key = '第' + (i + 1) + '行供应商';
                            if (!v.linkManName) error.addModelError("联系人", key + "联系人不能为空");


                            if (!v.linkPhone)
                                error.addModelError("联系人电话", key + "联系人电话不能为空");
                            else {
                                if (regPhoneNumber.test(v.linkPhone) === false) {
                                    error.addModelError('联系人电话', key + '联系人电话格式不正确');
                                }
                            }
                            if (!v.linkEmail)
                                error.addModelError("联系人邮箱", key + "联系人邮箱不能为空");
                            else {
                                if (regEmail.test(v.linkEmail) === false) {
                                    error.addModelError('联系人邮箱', key + '联系人邮箱格式不正确');
                                }
                            }
                        });
                    }
                    return error;
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
            }]);
    });