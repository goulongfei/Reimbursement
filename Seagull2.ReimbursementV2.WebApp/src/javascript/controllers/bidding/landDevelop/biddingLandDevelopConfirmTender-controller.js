define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopConfirmTender_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                    viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                }
                $scope.isApproval = true;
                //基本信息
                $scope.baseInfo = {
                    //投标信息全选
                    select_add_all: false,
                    //中标全选
                    select_del_all: false,

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
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ConfirmTender',
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "ConfirmTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
                    //选择主体公司
                    selectCorporation: function (supplier) {
                        angular.forEach($scope.viewModel.corporationScopeList, function (item) {
                            if (item.corporationCode == supplier.corporationCode) {
                                supplier.corporationName = item.corporationName;
                            }
                        });
                    },
                    
                };

                //选中供应商
                $scope.selectOneAdd = function (checked) {
                    for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                        if (!$scope.viewModel.supplierScopeList[i].isWinTheBidding) {
                            if (!$scope.viewModel.supplierScopeList[i].checked) {
                                $scope.baseInfo.select_add_all = false;
                                return;
                            } else {
                                $scope.baseInfo.select_add_all = true;
                            }
                        }
                    }
                };

                //全选
                $scope.selectSupplierAddAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                        $scope.viewModel.supplierScopeList[i].checked = allChecked;
                    }
                };
                //选中中标供应商
                $scope.selectOneDelete = function (checked) {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        if (!$scope.viewModel.perSignContractInfoList[i].checked) {
                            $scope.baseInfo.select_del_all = false;
                            return;
                        } else {
                            $scope.baseInfo.select_del_all = true;
                        }
                    }
                };
                //全选中标供应商
                $scope.selectSupplierDeleteAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        $scope.viewModel.perSignContractInfoList[i].checked = allChecked;
                    }
                };

                //判断是否是首轮最低价
                $scope.isMinPriceFirstTender = function (supplierCode) {
                    var isFlage = false;
                    angular.forEach($scope.viewModel.supplierReplyBiddingInfoSubmitList, function (sup) {
                        if (sup.className === 2 && sup.supplierCode === supplierCode && sup.totalAmountWithTax === $scope.viewModel.minAmount) {
                            isFlage = true; 
                        }
                    })
                    return isFlage;
                }

                //添加中标供应商
                $scope.addSure = function () {
                    angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                        angular.forEach($scope.viewModel.businessEvaluateBiddingInfoList, function (item) {
                            if (supplier.supplierCode==item.supplierCode) {
                                if (supplier.checked && supplier.isQualified) {
                                    var item = {
                                        "resourceID": $scope.viewModel.resourceID,
                                        "supplierCode": supplier.supplierCode,
                                        "supplierName": supplier.supplierName,
                                        "industryDomainCode": supplier.industryDomainCode,
                                        "industryDomainName": supplier.industryDomainName,
                                        "corporationCode": "",
                                        "corporationName": "",
                                        "perSignContractAmount": 0,
                                        "isFirstRoundBottomPrice": $scope.isMinPriceFirstTender(supplier.supplierCode),
                                        "explain": "",
                                        "sortNo": $scope.viewModel.perSignContractInfoList.length + 1,
                                        "checked": false
                                    };
                                    $scope.viewModel.perSignContractInfoList.push(item);
                                    supplier.isWinTheBidding = true;
                                    supplier.checked = false;
                                }
                            }
                        })
                        
                    });
                    $scope.baseInfo.select_add_all = false;
                };

                //删除中标供应商
                $scope.delSure = function () {
                    var select = false;
                    for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i >= 0; i--) {
                        if ($scope.viewModel.perSignContractInfoList[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的中标供应商信息")
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除中标供应商信息?");
                        promise.then(function (v) {
                            for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i >= 0; i--) {
                                if ($scope.viewModel.perSignContractInfoList[i].checked) {
                                    var item = $scope.viewModel.perSignContractInfoList[i];
                                    $scope.viewModel.perSignContractInfoList.splice(i, 1);
                                    $scope.sortNo(item);
                                }
                            }
                            angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                                for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i >= 0; i--) {
                                    if ($scope.viewModel.perSignContractInfoList[i].supplierCode == supplier.supplierCode) {
                                        supplier.isWinTheBidding = false;
                                        break;
                                    }
                                }
                            });
                            $scope.baseInfo.select_del_all = false;
                        })
                    }
                };
                //排序
                $scope.sortNo = function (item) {
                    angular.forEach($scope.viewModel.perSignContractInfoList, function (v) {
                        if (item.sortNo < v.sortNo) {
                            v.sortNo = v.sortNo - 1;
                        }
                    });
                };
                //查看页面
                $scope.lookInfo = function (routesType) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var activityID = "";
                                switch (routesType) {
                                    case "biddingLandDevelopEvaluateSummary":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "EvaluateTenderSummary") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                break;
                                            }
                                        }
                                        break;
                                    case "biddingLandDevelopDraft":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "Draft") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                break;
                                            }
                                        }
                                        break;
                                }
                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID;

                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看评标信息异常");
                            wfWaiting.hide();
                        });
                };

                //计算采购总金额
                $scope.$watch("viewModel.perSignContractInfoList", function (newVal, oldVal) {
                    var sumAmount = 0;
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        sumAmount += $scope.viewModel.perSignContractInfoList[i].perSignContractAmount;
                    }
                    $scope.viewModel.purchaseBase.purchaseAmount = sumAmount;
                }, true);


               

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);

                    if ($scope.viewModel.perSignContractInfoList.length == 0) error.addModelError("中标情况", "中标供应商不能为空");

                    $scope.isSamillerCorporation = false;
                    $scope.isSameSupplier = false;
                    $scope.isSameAmmount = true;
                    $scope.sumContractAmount = 0;
                    $scope.sameSupplierCode = "";
                    for (var i = $scope.viewModel.perSignContractInfoList.length - 1; i > 0; i--) {
                        if ($scope.viewModel.perSignContractInfoList[i].supplierCode == $scope.viewModel.perSignContractInfoList[i - 1].supplierCode) {
                            $scope.isSameSupplier = true;
                            $scope.sumContractAmount = $scope.viewModel.perSignContractInfoList[i].perSignContractAmount + $scope.viewModel.perSignContractInfoList[i - 1].perSignContractAmount;
                            $scope.sameSupplierCode = $scope.viewModel.perSignContractInfoList[i].supplierCode;
                            if ($scope.viewModel.perSignContractInfoList[i].corporationCode == $scope.viewModel.perSignContractInfoList[i - 1].corporationCode) {
                                $scope.isSamillerCorporation = true;
                            }
                        }
                    }

                    angular.forEach($scope.viewModel.perSignContractInfoList, function (v, i) {
                        var key = '第' + (i + 1) + '行供应商';
                        if (v.corporationCode == "")
                            error.addModelError("中标情况", key + "法人主体不能为空");
                        if (v.perSignContractAmount == "" || v.perSignContractAmount == null || v.perSignContractAmount == undefined) {
                            error.addModelError("中标情况", key + "拟签订合同金额不能为空");
                        }
                    });
                    if ($scope.isSamillerCorporation == true) {
                        error.addModelError("法人主体", "同一家供应商法人主体不能相同");
                    }
                    if ($scope.viewModel.confirmTenderReportFile.length == 0) error.addModelError("定标报告", "定标报告不能为空");

                    angular.forEach($scope.viewModel.supplierScopeList, function (item) {
                        if (item.supplierCode == $scope.sameSupplierCode) {
                            if (item.afterDiscountAmount != $scope.sumContractAmount) {
                                $scope.isSameAmmount = false;
                            }
                        }
                    })
                    if ($scope.isSameSupplier == true) {
                        if ($scope.isSameAmmount == false) {
                            error.addModelError("拟签订合同金额", "同一家供应商拟签订合同金额应等于供应商最终回标价");
                        }
                    } else {
                        angular.forEach($scope.viewModel.perSignContractInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行供应商';
                            angular.forEach($scope.viewModel.supplierScopeList, function (item) {
                                if (v.supplierCode == item.supplierCode) {
                                    if (v.perSignContractAmount != item.finalQuoteAmount) {
                                        error.addModelError("中标情况", key + "拟签订合同金额应等于供应商最终回标价");
                                    }
                                }
                            })
                        })
                    }
                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }
                $scope.fileReady = true;
                var checkFileData = function () {
                    if (!$scope.fileReady) {
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
                                if (!checkData()) {
                                    defer.reject($scope.viewModel);
                                } else {
                                    defer.resolve($scope.viewModel);
                                }
                                break;
                            case sogWfControlOperationType.Comment:
                                var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                                promise.then(function () {
                                    defer.resolve($scope.viewModel);
                                }, function () {
                                    defer.reject($scope.viewModel);
                                });
                                break;
                            case sogWfControlOperationType.Save:
                                defer.resolve($scope.viewModel);
                                break;
                            case sogWfControlOperationType.CancelProcess:
                                defer.resolve($scope.viewModel);
                                break;
                            case sogWfControlOperationType.Circulate:
                                defer.resolve($scope.viewModel);
                                break;
                            default:
                                defer.resolve(null);
                                break;
                        }
                    }
                };
            }]);
    });