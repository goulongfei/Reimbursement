define(
    [
        'app',
        'biddingSynthesizeExtend',
        'dateTimePickerExtend'
    ],
    function (app) {
        app.controller('modifyPurchaseTime_controller', [
            '$scope', '$http', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'errorDialog', 'configure', '$window',
            function ($scope, $http, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "调整采购时间";
                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (!v.processId == "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回
                $scope.wfOperateOpts.allowPrint = false;//打印      
                $scope.wfOperateOpts.allowComment = true; //评论
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }

                $scope.$broadcast('viewModel', { data: $scope.viewModel });

                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    // 金额控件
                    moneyOpts: {
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    //招标比例
                    optsScale: {
                        min: 1,
                        max: 100,
                        precision: 2
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'scene': 'ModifyTime',
                        'isShowTime': $scope.viewModel.isShowTime,
                        'actionTypeCode': $scope.viewModel.purchaseFormAction.actionTypeCode,
                    },
                    isShowUpstreamProcessMarketing: false,
                    // 初始化
                    init: function () {
                        if ($scope.viewModel.purchaseFormAction.actionTypeCode === 14
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 15
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 26
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 27
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 11
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 31
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 33) {
                            $scope.baseInfo.purchaseDateArrangeOpts.actionTypeCode = $scope.viewModel.purchaseFormAction.actionTypeCode ;
                        }
                        else {
                            $scope.baseInfo.purchaseDateArrangeOpts.actionTypeCode = 16;
                        }
                    },
                };

                //过滤时间显示格式
                for (var i = 0; i < $scope.viewModel.p_PurchaseDateArrangeInfoList.length; i++) {
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].replyDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].replyDeadline;
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].evaluateBiddingDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].decideBiddingDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].decideBiddingDeadline;
                    $scope.viewModel.p_PurchaseDateArrangeInfoList[i].clearBinddingDeadline = $scope.viewModel.p_PurchaseDateArrangeInfoList[i].clearBinddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.p_PurchaseDateArrangeInfoList[i].clearBinddingDeadline;
                }

                //查看开标页面
                $scope.lookPurchaseProgress = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                url = $scope.common.webUrlBase + $scope.viewModel.p_PurchaseDataArrangeAdjustRecord.purchaseUrl;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看采购进度详情异常");
                            wfWaiting.hide();
                        });
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);

                    if ($scope.viewModel.p_PurchaseDateArrangeInfoList.length) {
                        if ($scope.viewModel.purchaseFormAction.actionTypeCode === 14
                            || $scope.viewModel.purchaseFormAction.actionTypeCode === 15) {
                            angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoList, function (v, i) {
                                if (v.classActiveName == '最新时间安排') {
                                    var key = '第' + (i + 1) + '行采购时间安排';
                                    if (v.inviteReplyDeadline == null || v.inviteReplyDeadline == "0001-01-01T00:00:00" || v.inviteReplyDeadline == "") {
                                        error.addModelError("供应商回复截止时间", key + "供应商回复截止时间不能为空");
                                    }
                                    if (v.questionDeadline == null || v.questionDeadline == "0001-01-01T00:00:00" || v.questionDeadline == "") {
                                        error.addModelError("供应商提问截止时间", key + "供应商提问截止时间不能为空");
                                    }
                                    if (v.replyDeadline == null || v.replyDeadline == "0001-01-01T00:00:00" || v.replyDeadline == "") {
                                        error.addModelError("回标截止时间", key + "回标截止时间不能为空");
                                    }
                                    if (v.clearBinddingDeadline == null || v.clearBinddingDeadline == "0001-01-01T00:00:00" || v.clearBinddingDeadline == "") {
                                        error.addModelError("清标时间	", key + "清标时间	不能为空");
                                    }
                                    if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "0001-01-01T00:00:00" || v.evaluateBiddingDeadline == "") {
                                        error.addModelError("评标时间", key + "评标时间不能为空");
                                    }
                                    if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "0001-01-01T00:00:00" || v.decideBiddingDeadline == "") {
                                        error.addModelError("定标时间", key + "定标时间不能为空");
                                    }

                                    var inviteReplyDeadline = new Date(Date.parse(v.inviteReplyDeadline));
                                    var questionDeadline = new Date(Date.parse(v.questionDeadline));
                                    var replyDeadline = new Date(Date.parse(v.replyDeadline));
                                    var clearBinddingDeadline = new Date(Date.parse(v.clearBinddingDeadline));
                                    var evaluateBiddingDeadline = new Date(Date.parse(v.evaluateBiddingDeadline));
                                    var decideBiddingDeadline = new Date(Date.parse(v.decideBiddingDeadline));
                                     
                                    if (questionDeadline <= inviteReplyDeadline) {
                                        error.addModelError("供应商提问截止时间", key + "必须大于回复截止时间");
                                    }
                                    if (replyDeadline <= questionDeadline) {
                                        error.addModelError("回标截止时间", key + "必须大于回标截止时间");
                                    }
                                    if (clearBinddingDeadline <= replyDeadline) {
                                        error.addModelError("清标时间", key + "必须大于回标截止时间");
                                    }
                                    if (evaluateBiddingDeadline <= clearBinddingDeadline) {
                                        error.addModelError("评标时间", key + "必须大于清标时间");
                                    }
                                    if (decideBiddingDeadline <= evaluateBiddingDeadline) {
                                        error.addModelError("定标时间", key + "必须大于评标时间");
                                    }
                                }
                            });
                        }
                        else {
                            angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoList, function (v, i) {
                                if (v.classActiveName == '最新时间安排') {
                                    var key = '第' + (i + 1) + '行采购时间安排';
                                    if (v.replyDeadline == null || v.replyDeadline == "0001-01-01T00:00:00" || v.replyDeadline == "") {
                                        error.addModelError("回标截止时间", key + "回标截止时间不能为空");
                                    }
                                    if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "0001-01-01T00:00:00" || v.evaluateBiddingDeadline == "") {
                                        error.addModelError("评标时间", key + "评标时间不能为空");
                                    }
                                    if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "0001-01-01T00:00:00" || v.decideBiddingDeadline == "") {
                                        error.addModelError("定标时间", key + "定标时间不能为空");
                                    }
                                    //if (v.clearBinddingDeadline == null || v.clearBinddingDeadline == "0001-01-01T00:00:00" || v.clearBinddingDeadline == "") {
                                    //    error.addModelError("清标完结时间", key + "清标完结时间不能为空");
                                    //}
                                    var replyTime = new Date(Date.parse(v.replyDeadline));
                                    if (replyTime < new Date()) {
                                        error.addModelError("回标截止时间", "回标截止时间不能小于当前时间");
                                    }
                                    if (v.evaluateBiddingDeadline <= replyTime) {
                                        error.addModelError("评标时间", key + "评标时间必须大于回标截止时间");
                                    }
                                    if (v.decideBiddingDeadline <= v.evaluateBiddingDeadline) {
                                        error.addModelError("定标时间", key + "定标时间必须大于评标时间");
                                    }
                                }
                            });
                        }
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
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        if ($scope.viewModel.p_PurchaseDateArrangeInfoList.length) {
                            angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoList, function (v, i) {
                                if (v.replyDeadline == null || v.replyDeadline == "" || v.replyDeadline.search("NaN") != -1) {
                                    v.replyDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "") {
                                    v.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "") {
                                    v.decideBiddingDeadline = "0001-01-01T00:00:00";
                                }
                            });
                        }
                        defer.resolve($scope.viewModel);
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!");
                        promise.then(function () {
                            defer.resolve($scope.viewModel);
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    } else {
                        defer.resolve($scope.viewModel);
                    }
                }
                $scope.baseInfo.init();
            }]);
    });