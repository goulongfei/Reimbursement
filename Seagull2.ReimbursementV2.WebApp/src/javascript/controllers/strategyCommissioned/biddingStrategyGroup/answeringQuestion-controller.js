define([
    'app',
    'commonUtilExtend',
    'leftNavExtend',
    'dateTimePickerExtend'], function (app) {
        app.controller('answeringQuestion_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集团战采）";
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                //判断发送按钮是否显示
                if ($injector.get('configure').getConfig('pageCommonConfig').isValidMoveTo) {
                    var newest = $scope.viewModel.p_AnswerInfoPEMus.length - 1;
                    if (new Date($scope.viewModel.p_AnswerInfoPEMus[newest].lastQuestionDeadline) < new Date()) {
                        var isMoveTo = true;
                        var questionCount = 0;
                        angular.forEach($scope.viewModel.p_QuestionInfoPEMus, function (question) {
                            if (question.round == $scope.viewModel.p_AnswerInfoPEMus[newest].round) {
                                if (question.clientFileInformationList != null && question.clientFileInformationList.length > 0) {
                                    if ($scope.viewModel.p_AnswerInfoPEMus[newest].clientFileInformationList == null || $scope.viewModel.p_AnswerInfoPEMus[newest].clientFileInformationList.length == 0) {
                                        questionCount++;
                                    } else {
                                        angular.forEach($scope.viewModel.p_AnswerInfoPEMus[newest].clientFileInformationList, function (file) {
                                            if (file.isDeleted) {
                                                questionCount++;
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        if (questionCount > 0) {
                            isMoveTo = false;
                        }
                        $scope.wfOperateOpts.allowMoveTo = isMoveTo;
                    } else {
                        $scope.wfOperateOpts.allowMoveTo = false;
                    }
                }

                //基本信息
                $scope.baseInfo = {
                    //采购信息是否显示招标附件
                    isShowbiddingReportFile: true,
                    //采购信息是否编辑招标附件
                    isEditbiddingReportFile: false,
                    isShowUser: false,
                    select_all: false,
                    isShowAnswer: new Date($scope.viewModel.p_AnswerInfoPEMus[$scope.viewModel.p_AnswerInfoPEMus.length - 1].lastQuestionDeadline) < new Date(),
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "QuestionAndAnswer",
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
                    //绑定供应商提问集合
                    searchQuestionInfos: function (supplierCode) {
                        var list = [];
                        angular.forEach($scope.viewModel.p_AnswerInfoPEMus, function (answer) {
                            angular.forEach($scope.viewModel.p_QuestionInfoPEMus, function (item) {
                                if (item.round == answer.round && item.supplierCode == supplierCode) {
                                    list.push(item);
                                }
                            });
                        });
                        return list;
                    },
                    //得到提问轮次
                    questionTimes: function () {
                        var list = [];
                        var i = 1;
                        angular.forEach($scope.viewModel.p_AnswerInfoPEMus, function (answer) {
                            list.push("第" + rcTools.numberToChinese(i) + "轮");
                            i++;
                        });
                        return list;
                    },
                    //得到本轮最新提问截止时间
                    getLastQuestionDeadline: function (index) {
                        var lastQuestionDeadline;
                        for (var j = 0; j < $scope.viewModel.p_AnswerInfoPEMus.length; j++) {
                            if ((index + 1) == $scope.viewModel.p_AnswerInfoPEMus[j].round) {
                                lastQuestionDeadline = $scope.viewModel.p_AnswerInfoPEMus[j].lastQuestionDeadline;
                                break;
                            }
                        }
                        return lastQuestionDeadline;
                    },
                    //延长纸截止提问时间
                    extendTime: $scope.viewModel.p_StrategyPurchasePlanCase.lastQuestionDeadline
                };
                //添加招标文件
                $scope.addDetail = function () {
                    var detail = {
                        sortNo: $scope.viewModel.biddingReportFileList.length + 1,
                        clientFileInformationList: [],
                        checked: false
                    };
                    $scope.viewModel.biddingReportFileList.push(detail);
                };
                //选中
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.viewModel.biddingReportFileList.length; i++) {
                        if (!$scope.viewModel.biddingReportFileList[i].checked) {
                            $scope.baseInfo.select_all = false;
                            return;
                        } else {
                            $scope.baseInfo.select_all = true;
                        }
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.biddingReportFileList.length; i++) {
                        $scope.viewModel.biddingReportFileList[i].checked = allChecked;
                    }
                };
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.viewModel.biddingReportFileList.length - 1; i >= 0; i--) {
                        if ($scope.viewModel.biddingReportFileList[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的招标文件")
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除招标文件?");
                        promise.then(function (v) {
                            for (var i = $scope.viewModel.biddingReportFileList.length - 1; i >= 0; i--) {
                                if ($scope.viewModel.biddingReportFileList[i].checked) {
                                    var item = $scope.viewModel.biddingReportFileList[i];
                                    $scope.viewModel.biddingReportFileList.splice(i, 1);
                                    $scope.sortNo(item);
                                }
                            }
                            $scope.baseInfo.select_all = false;
                        })
                    }
                }
                //排序
                $scope.sortNo = function (item) {
                    angular.forEach($scope.viewModel.biddingReportFileList, function (v) {
                        if (item.sortNo < v.sortNo) {
                            v.sortNo = v.sortNo - 1;
                        }
                    });
                };
                //提交到供应商
                $scope.commitSupplier = function () {
                    var newest = $scope.viewModel.p_AnswerInfoPEMus.length - 1;
                    if ($scope.viewModel.p_AnswerInfoPEMus[newest].clientFileInformationList == null || $scope.viewModel.p_AnswerInfoPEMus[newest].clientFileInformationList.length == 0) {
                        sogModal.openAlertDialog("提示", "请先上传答疑文件");
                        return false;
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.p_AnswerInfoPEMus[newest].clientFileInformationList, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            sogModal.openAlertDialog("提示", "请先上传答疑文件");
                            return false;
                        }
                    }
                    if (!$scope.baseInfo.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    if ($scope.viewModel.p_AnswerInfoPEMus[newest].questionDeadline == null || $scope.viewModel.p_AnswerInfoPEMus[newest].questionDeadline == "0001-01-01T00:00:00" || $scope.viewModel.p_AnswerInfoPEMus[0].questionDeadline == "" || $scope.viewModel.p_AnswerInfoPEMus[0].questionDeadline == undefined) {
                        sogModal.openAlertDialog("提示", "请先选择最新提问截止时间！");
                        return;
                    }

                    if (new Date($scope.viewModel.p_AnswerInfoPEMus[newest].questionDeadline) < new Date()) {
                        sogModal.openAlertDialog("提示", "最新提问截止时间不能小于当前时间！");
                        return;
                    }
                    wfWaiting.show();
                    $http.post(seagull2Url.getPlatformUrl('/BiddingStrategyGroup/CommitSupplier'), $scope.viewModel.p_AnswerInfoPEMus[newest])
                        .success(function (data) {
                            $scope.viewModel.p_StrategyPurchasePlanCase.lastQuestionDeadline = $scope.viewModel.p_AnswerInfoPEMus[newest].questionDeadline;
                            $scope.viewModel.p_AnswerInfoPEMus[newest].lastQuestionDeadline = $scope.viewModel.p_AnswerInfoPEMus[newest].questionDeadline;
                            $scope.baseInfo.isShowAnswer = new Date($scope.viewModel.p_AnswerInfoPEMus[newest].lastQuestionDeadline) < new Date();
                            $scope.baseInfo.extendTime = $scope.viewModel.p_StrategyPurchasePlanCase.lastQuestionDeadline;
                            wfWaiting.hide();
                        }).error(function (data, status) {
                            if (data) {
                                sogModal.openAlertDialog(status, data.message);
                            } else {
                                sogModal.openAlertDialog("提示", "提交到供应商错误");
                            }
                            wfWaiting.hide();
                        });
                };
                //提交最新截止提问时间
                $scope.commit = function () {
                    if ($scope.baseInfo.extendTime == null || $scope.baseInfo.extendTime == "0001-01-01T00:00:00" || $scope.baseInfo.extendTime == "" || $scope.baseInfo.extendTime == undefined) {
                        sogModal.openAlertDialog("提示", "请先选择最新提问截止时间！");
                        return;
                    }

                    if (new Date($scope.baseInfo.extendTime) < new Date()) {
                        sogModal.openAlertDialog("提示", "最新提问截止时间不能小于当前时间！");
                        return;
                    }
                    $scope.viewModel.p_StrategyPurchasePlanCase.lastQuestionDeadline = $scope.baseInfo.extendTime;
                    $scope.viewModel.p_AnswerInfoPEMus[$scope.viewModel.p_AnswerInfoPEMus.length - 1].lastQuestionDeadline = $scope.baseInfo.extendTime;
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl('/BiddingStrategyGroup/CommitTime?resourceID=' + $scope.viewModel.p_StrategyPurchasePlanCase.resourceID + '&extendTime=' + $scope.baseInfo.extendTime), {
                        cache: false
                    }).success(function (response) {
                        wfWaiting.hide();
                        var promise = sogModal.openAlertDialog("提示", "提交最新提问截止时间成功");
                        promise.then(function (result) {
                            location.reload();
                        }, function (rejectData) {
                            location.reload();
                        });
                    }).error(function (data, status) {
                        if (data) {
                            sogModal.openAlertDialog(status, data.message);
                        } else {
                            sogModal.openAlertDialog("提示", "提交最新截止提问时间错误");
                        }
                        wfWaiting.hide();
                    });
                };

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    var isValidAdopt = true;
                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 5) {
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
                                if (new Date(item.replyDeadline) < new Date()) {
                                    modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                                }
                                if (item.clearBinddingDeadline < item.replyDeadline) {
                                    modelStateDictionary.addModelError("采购时间安排", "清标时间不能小于回标截止时间");
                                }
                                if (item.evaluateBiddingDeadline < item.clearBinddingDeadline) {
                                    modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于清标时间");
                                }
                                if (item.decideBiddingDeadline < item.evaluateBiddingDeadline) {
                                    modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                                }
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


