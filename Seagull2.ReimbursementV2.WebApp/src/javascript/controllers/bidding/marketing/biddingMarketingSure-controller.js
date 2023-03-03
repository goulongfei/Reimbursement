define(
    [
        'app',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'commonUtilExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingMarketingSure_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";

                $scope.isOpinionsShow = false;
                $scope.isApprovalShow = false;
                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.processId == 'InputOpinion')
                        $scope.isOpinionsShow = true;

                    //审批意见是否显示
                    if (v.processId != 'InputOpinion')
                        $scope.isApprovalShow = true;
                });

                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送  
                $scope.wfOperateOpts.allowCirculate = true;//传阅
                $scope.wfOperateOpts.allowRejection = viewData.sceneId == "PurchaseApproval" ? true : false;//退回
                $scope.wfOperateOpts.allowDoAbort = false;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = viewData.sceneId.indexOf("ReadOnly") > -1 ? true : false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回
                $scope.wfOperateOpts.allowPrint = false;//打印      
                if ($scope.wfOperateOpts.sendButtonName == "已阅") {
                    $scope.wfOperateOpts.allowSave = false;//保存
                }
                if ($scope.viewModel.isShowTopButton) {
                    $scope.wfOperateOpts.allowRejection = false;//退回
                    $scope.wfOperateOpts.allowDoWithdraw = false;//退回
                }
                if ($scope.sceneId == 'Draft' || $scope.sceneId == 'PurchaseApproval' || $scope.sceneId == 'DefaultCirculationScene' || $scope.sceneId == 'ApprovalEdit' || $scope.sceneId == 'Approval' || $scope.viewModel.isAdmin) {
                    $scope.isApproval = true;
                } else {
                    $scope.isApproval = false;
                }

                //定标审批字样修改
                if ($scope.opinionOpts.options.length > 0) {

                    angular.forEach($scope.opinionOpts.options, function (v) {
                        if (v.nextStepCollection != undefined) {
                            if (v.nextStepCollection.length > 0) {
                                angular.forEach(v.nextStepCollection, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回定标环节";
                                    }
                                });
                            }
                        }
                    });
                }

                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.nextStepSnapshot != undefined) {
                            if (v.nextStepSnapshot.length > 0) {
                                angular.forEach(v.nextStepSnapshot, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回定标环节";
                                    }
                                });
                            }
                        }
                    });
                }

                //监控选择同意不同意按钮，实时改变文字显示
                $scope.$watch("opinionOpts", function (newVal, oldVal) {
                    angular.forEach(newVal.options, function (v) {
                        if (v.nextStepCollection != undefined) {
                            if (v.nextStepCollection.length > 0) {
                                angular.forEach(v.nextStepCollection, function (n) {
                                    if (n.name.indexOf('不同意') > -1) {
                                        n.name = "不同意，且退回定标环节";
                                    }
                                });
                            }
                        }
                    });
                });

                $scope.select_add_all = false;
                $scope.select_del_all = false;
                $scope.sumAmount = 0;//合计中标金额

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
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "ConfirmTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                    },

                    isShowUpstreamProcessMarketing: false
                };

                //页面所用函数
                $scope.api = {
                    // 入围供应商信息
                    supplierScopeOpts: {
                        'isshowenterpriseCheck': viewData.sceneId == "PurchaseApproval" ? 'true' : 'false',
                    },
                };

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }

                //全选供应商投标信息
                $scope.selectSupplierAddAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.summerEvaluateBiddingInfoList.length; i++) {
                        $scope.viewModel.summerEvaluateBiddingInfoList[i].checked = allChecked;
                    }
                }

                //全选中标信息
                $scope.selectSupplierDeleteAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        $scope.viewModel.perSignContractInfoList[i].checked = allChecked;
                    }
                }

                //单选-如全部选择则将全部选中
                $scope.selectOneAdd = function () {
                    for (var i = 0; i < $scope.viewModel.summerEvaluateBiddingInfoList.length; i++) {
                        if (!$scope.viewModel.summerEvaluateBiddingInfoList[i].checked) {
                            $scope.select_add_all = false;
                            return;
                        } else {
                            $scope.select_add_all = true;
                        }
                    }
                }

                //单选-如全部选择则将全部选中
                $scope.selectOneDelete = function () {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        if (!$scope.viewModel.perSignContractInfoList[i].checked) {
                            $scope.select_del_all = false;
                            return;
                        } else {
                            $scope.select_del_all = true;
                        }
                    }
                }

                //添加到中标
                $scope.addSure = function () {
                    var summerlist = $scope.viewModel.summerEvaluateBiddingInfoList;
                    var supplierCodes = [];
                    for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i >= 0; i--) {
                        supplierCodes.push($scope.viewModel.perSignContractInfoList[i].supplierCode);
                    }
                    for (var i = 0; i < summerlist.length; i++) {
                        if (summerlist[i].checked) {
                            if (supplierCodes.indexOf(summerlist[i].supplierCode) == -1) {
                                $scope.viewModel.perSignContractInfoList.push({
                                    supplierCode: summerlist[i].supplierCode,
                                    supplierName: summerlist[i].supplierName,
                                    industryDomainCode: summerlist[i].industryDomainCode,
                                    industryDomainName: summerlist[i].industryDomainName,
                                    perSignContractAmount: summerlist[i].afterDiscountAmount,
                                    isFirstRoundBottomPrice: summerlist[i].isMinAmount,
                                    isHighestScore: summerlist[i].isMaxScore,
                                });
                            }
                        }
                    }
                    $scope.perSignContractSort();
                }

                //移除中标
                $scope.delSure = function () {
                    var selected = false;
                    for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i >= 0; i--) {
                        if ($scope.viewModel.perSignContractInfoList[i].checked) {
                            selected = true;
                            $scope.viewModel.perSignContractInfoList.splice(i, 1);
                        }
                    }
                    if (!selected) {
                        sogModal.openAlertDialog('提示', "请选择需要删除的项！");
                    }

                    $scope.perSignContractSort();
                }

                //计算采购总金额
                $scope.$watch("viewModel.perSignContractInfoList", function (newVal, oldVal) {
                    var sumAmount = 0;
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        sumAmount += $scope.viewModel.perSignContractInfoList[i].perSignContractAmount;
                    }
                    $scope.viewModel.purchaseBase.purchaseAmount = sumAmount;
                }, true);

                //得分排序
                $scope.perSignContractSort = function () {
                    var maxScore = [];
                    var minperSignContractAmount = [];
                    var summerlist = $scope.viewModel.summerEvaluateBiddingInfoList;
                    for (var i = 0; i < summerlist.length; i++) {
                        maxScore.push(summerlist[i].totalAmountWithTax);
                        minperSignContractAmount.push(summerlist[i].sumScore);
                    }
                }

                //查看页面
                $scope.lookbiddingMarketingInfo = function (routesType, title) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";

                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID;

                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, title + "异常");
                            wfWaiting.hide();
                        });
                }

                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }

                //是否显示IP/Mac
                $scope.isMac = false;
                var replyIpMacs = [];
                $scope.supplierRemark = "";
                angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                    if (v.replyIP != "")
                        replyIpMacs.push(v.replyIP + v.replyMAC);
                });

                //去重
                $scope.uniq = function (array) {
                    var temp = []; //一个新的临时数组
                    var tempMore = [];//返回重复的数
                    for (var i = 0; i < array.length; i++) {
                        if (temp.indexOf(array[i]) == -1) {
                            temp.push(array[i]);
                        }
                        else {
                            if (tempMore.indexOf(array[i]) == -1) {
                                tempMore.push(array[i]);
                            }
                        }
                    }
                    return tempMore;
                }

                if ($scope.uniq(replyIpMacs).length > 0) {
                    var temp = $scope.uniq(replyIpMacs);
                    $scope.isMac = true;
                    angular.forEach($scope.viewModel.supplierReplyBiddingInfoForSubmitList, function (v) {
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i] == v.replyIP + v.replyMAC) {
                                $scope.supplierRemark += v.supplierName + "、";
                            }
                        }
                    });
                    $scope.supplierRemark = $scope.supplierRemark.substring(0, $scope.supplierRemark.length - 1);
                }

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);
                    if ($scope.viewModel.perSignContractInfoList.length == 0) error.addModelError("中标情况", "中标供应商不能为空");
                    if ($scope.viewModel.purchaseOfMarketing.sureReportFile.length == 0) error.addModelError("定标报告", "定标报告不能为空");
                    if ($scope.viewModel.purchaseBase.purchaseAmount > $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount) {
                        error.addModelError("中标金额", "中标金额不能超过营销费用预算金额");
                    }
                    if ($scope.viewModel.perSignContractInfoList.length > 0) {
                        var msg = "";
                        angular.forEach($scope.viewModel.perSignContractInfoList, function (itemPer) {
                            angular.forEach($scope.viewModel.summerEvaluateBiddingInfoList, function (itemSum) {
                                if (itemPer.supplierCode == itemSum.supplierCode && itemPer.perSignContractAmount != itemSum.afterDiscountAmount) {
                                    msg += itemPer.supplierName + "金额已更改，请重新选择；";
                                }
                            });
                        });
                        if (msg != "") {
                            error.addModelError("中标金额", msg);
                        }
                    }

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }
                var checkFileData = function () {
                    var retrunFlag = true;
                    if ($scope.viewModel.purchaseOfMarketing.sureReportFile != null && $scope.viewModel.purchaseOfMarketing.sureReportFile.length > 0) {
                        angular.forEach($scope.viewModel.purchaseOfMarketing.sureReportFile, function (item) {
                            if (!item.uploaded) {
                                retrunFlag = false;
                            }
                        });
                    }
                    if ($scope.viewModel.purchaseOfMarketing.sureOtherFile != null && $scope.viewModel.purchaseOfMarketing.sureOtherFile.length > 0) {
                        angular.forEach($scope.viewModel.purchaseOfMarketing.sureOtherFile, function (item) {
                            if (!item.uploaded) {
                                retrunFlag = false;
                            }
                        });
                    }
                    if (!retrunFlag) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                    }
                    return retrunFlag;
                };
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                defer.resolve($scope.viewModel);
                            } else {
                                defer.reject($scope.viewModel);
                            }
                        }
                        return defer.resolve($scope.viewModel);
                    }
                }
            }]);
    });