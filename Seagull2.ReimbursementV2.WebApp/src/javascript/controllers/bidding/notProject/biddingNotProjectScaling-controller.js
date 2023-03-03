define([
    'app',
    'commonUtilExtend', 'leftNavExtend', 'biddingSynthesizeExtend', 'useCostCenterExtend'], function (app) {
        app.controller('biddingNotProjectScaling_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                $scope.isOpinionsShow = false;
                $scope.isApprovalShow = false;
                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.commentIsDelete)
                        $scope.isOpinionsShow = true;
                    //审批意见是否显示
                    if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                        $scope.isApprovalShow = true;
                });
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底   
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                //基本信息
                $scope.baseInfo = {
                    //是否显示合计中标金额
                    isAllSupplierFinalQuoteAmount: true,
                    //投标信息全选
                    select_all: false,
                    //中标全选
                    winningBid_all: false,
                    // 金额控件
                    moneyOpts: {
                        min: 1,
                        max: 999999999,
                        precision: 2
                    },
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'ConfirmTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    fileReady: true,
                    //选择主体公司
                    selectCorporation: function (supplier) {
                        angular.forEach($scope.viewModel.corporationScopes, function (item) {
                            if (item.corporationCode == supplier.corporationCode) {
                                supplier.corporationName = item.corporationName;
                            }
                        });
                        for (var i = 0; i < $scope.viewModel.perSignContractInfoPEMus.length; i++) {
                            if ($scope.viewModel.perSignContractInfoPEMus[i].sortNo != supplier.sortNo &&
                                $scope.viewModel.perSignContractInfoPEMus[i].supplierCode == supplier.supplierCode &&
                                $scope.viewModel.perSignContractInfoPEMus[i].corporationCode == supplier.corporationCode) {
                                sogModal.openAlertDialog("提示", "第" + (i + 1) + "行供应商【" + $scope.viewModel.perSignContractInfoPEMus[i].supplierName + "】已经选择了【" + supplier.corporationName + "】法人主体，请重新选择");
                                supplier.corporationCode = "";
                                supplier.corporationName = "";
                                return;
                            }
                        }
                    },
                };

                $scope.settings = {
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
                    },
                    isSpreadInfo: true,
                    isDraftReadOnly: false,
                    spreadButtonName: "展开",
                    isApproval: true,
                    linkName: "定标"
                }

                //计算采购总金额
                $scope.$watch("viewModel.perSignContractInfoPEMus", function (newVal, oldVal) {
                    var sumAmount = 0;
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoPEMus.length; i++) {
                        sumAmount += $scope.viewModel.perSignContractInfoPEMus[i].perSignContractAmount;
                    }
                    $scope.viewModel.purchaseBasePEMu.purchaseAmount = sumAmount;
                }, true);

                //选中供应商
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                        if ($scope.viewModel.supplierScopeList[i].isQualified) {
                            if (!$scope.viewModel.supplierScopeList[i].checked) {
                                $scope.baseInfo.select_all = false;
                                return;
                            } else {
                                $scope.baseInfo.select_all = true;
                            }
                        }
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                        if ($scope.viewModel.supplierScopeList[i].isQualified) {
                            $scope.viewModel.supplierScopeList[i].checked = allChecked;
                        }
                    }
                };
                //选中中标供应商
                $scope.winningBidSelectOne = function (checked) {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoPEMus.length; i++) {
                        if (!$scope.viewModel.perSignContractInfoPEMus[i].checked) {
                            $scope.baseInfo.winningBid_all = false;
                            return;
                        } else {
                            $scope.baseInfo.winningBid_all = true;
                        }
                    }
                };
                //全选中标供应商
                $scope.winningBidSelectAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoPEMus.length; i++) {
                        $scope.viewModel.perSignContractInfoPEMus[i].checked = allChecked;
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
                $scope.addWinningBidSupplier = function () {
                    angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                        angular.forEach($scope.viewModel.businessEvaluateBiddingInfoPEMus, function (item) {
                            if (supplier.supplierCode == item.supplierCode) {
                                if (supplier.checked) {
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
                                        "sortNo": $scope.viewModel.perSignContractInfoPEMus.length + 1,
                                        "checked": false
                                    };
                                    $scope.viewModel.perSignContractInfoPEMus.push(item);
                                    supplier.isWinTheBidding = true;
                                    supplier.checked = false;
                                }
                            }
                           
                        })  
                    });
                    $scope.baseInfo.select_all = false;
                    $scope.baseInfo.winningBid_all = false;
                };
                //删除中标供应商
                $scope.deleteWinningBidSupplier = function () {
                    var select = false;
                    for (var i = $scope.viewModel.perSignContractInfoPEMus.length - 1; i >= 0; i--) {
                        if ($scope.viewModel.perSignContractInfoPEMus[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的中标供应商信息");
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除中标供应商信息?");
                        promise.then(function (v) {
                            for (var i = $scope.viewModel.perSignContractInfoPEMus.length - 1; i >= 0; i--) {
                                if ($scope.viewModel.perSignContractInfoPEMus[i].checked) {
                                    var item = $scope.viewModel.perSignContractInfoPEMus[i];
                                    $scope.viewModel.perSignContractInfoPEMus.splice(i, 1);
                                    $scope.sortNo(item);
                                }
                            }
                            angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                                var count = 0;
                                for (var i = $scope.viewModel.perSignContractInfoPEMus.length - 1; i >= 0; i--) {
                                    if ($scope.viewModel.perSignContractInfoPEMus[i].supplierCode === supplier.supplierCode) {
                                        count++;
                                    }
                                }
                                if (count === 0) {
                                    supplier.isWinTheBidding = false;
                                }
                            });
                            $scope.baseInfo.winningBid_all = false;
                        });
                    }
                };
                //排序
                $scope.sortNo = function (item) {
                    angular.forEach($scope.viewModel.perSignContractInfoPEMus, function (v) {
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
                                    case "biddingNotProjectEvaluateTenderGather":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "EvaluateTenderSummary") {
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
                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if ($scope.viewModel.perSignContractInfoPEMus === null || $scope.viewModel.perSignContractInfoPEMus.length === 0) {
                        modelStateDictionary.addModelError("中标情况", "请选择中标供应商");
                    } else {
                        angular.forEach($scope.viewModel.perSignContractInfoPEMus, function (item, v) {
                            if (!item.corporationCode || !item.corporationName) {
                                modelStateDictionary.addModelError("中标情况", "第" + (v + 1) + "行中标供应商【" + item.supplierName + "】请选择法人主体");
                            }
                        });
                        angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                            if (supplier.isWinTheBidding) {
                                var amount = 0;
                                angular.forEach($scope.viewModel.perSignContractInfoPEMus, function (item) {
                                    if (item.supplierCode === supplier.supplierCode) {
                                        amount += item.perSignContractAmount;
                                    }
                                });
                                if (amount !== supplier.finalQuoteAmount) {
                                    modelStateDictionary.addModelError("中标情况", "中标供应商【" + supplier.supplierName + "】拟签订合同金额之和必须和最终回标价相等");
                                }
                            }
                        });
                    }
                    if ($scope.viewModel.scalingFile === null || $scope.viewModel.scalingFile.length === 0) {
                        modelStateDictionary.addModelError("附件", "定标报告不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.scalingFile, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "定标报告不能为空");
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
                                defer.resolve($scope.viewModel);
                                break;
                            case sogWfControlOperationType.CancelProcess:
                                defer.resolve($scope.viewModel);
                                break;
                            case sogWfControlOperationType.Withdraw:
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


