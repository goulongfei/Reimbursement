define(
    [
        'app',
        'biddingSynthesizeExtend',
        'commonUtilExtend',
        'fixedAssetsExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseConfirmTender_controller', [
            '$scope', '$rootScope', 'wfOperate', 'viewData', 'sogModal',
            'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'rcTools', 'wfWaiting', '$http', 'seagull2Url', 'sogOguType', 'errorDialog', 'configure', '$window',
            function ($scope, $rootScope, wfOperate, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, rcTools, wfWaiting, $http, seagull2Url, sogOguType, errorDialog, configure, $window) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
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

                // 设置 
                $scope.settings = {
                    // 附件设置项
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
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
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "ConfirmTender",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //固定资产清单
                    fixedAssetsOpts: {
                        fixedAssetsList: [],
                        beforAppend: function (index) {
                            var item = $scope.viewModel.perSignContractInfoList[index];
                            var goodsNames = "";
                            var fixedAssetsPurchaseGoodsDetailInfoList = [];
                            if (this.fixedAssetsList.length > 0) {
                                angular.forEach(this.fixedAssetsList, function (fixedAssets) {
                                    if (fixedAssets.checked) {
                                        goodsNames += fixedAssets.goodsName + "；";
                                        var fixedAssetsPurchaseGoodsDetailInfo = {
                                            fixedAssetsPurchaseGoodsInfoCode: fixedAssets.code,
                                            assetsTypeCode: fixedAssets.assetsTypeCode,
                                            assetsTypeCnName: fixedAssets.assetsTypeCnName,
                                            goodsName: fixedAssets.goodsName,
                                            perPrice: fixedAssets.perPrice,
                                            count: fixedAssets.count,
                                        };
                                        fixedAssetsPurchaseGoodsDetailInfoList.push(fixedAssetsPurchaseGoodsDetailInfo);
                                        fixedAssets.checked = false;
                                    }
                                });
                                goodsNames = goodsNames.substring(0, goodsNames.length - 1);
                            }
                            item.fixedAssetsGoodsNames = goodsNames;
                            item.fixedAssetsPurchaseGoodsDetailInfoList = fixedAssetsPurchaseGoodsDetailInfoList;
                        },
                        beforClear: function (index) {
                            var item = $scope.viewModel.perSignContractInfoList[index];
                            item.fixedAssetsGoodsNames = null;
                            item.fixedAssetsPurchaseGoodsDetailInfoList = [];

                        },
                    },
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
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function () { }); }
                        }
                    },
                    urlAbandonProfitSharingReply: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingAssetsPurchase/abandonProfitSharingReply?r=' + Math.random());
                    },
                    // 延长提问截止时间
                    abandonProfitSharingReply: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlAbandonProfitSharingReply(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                }
                // 基本信息                
                $scope.baseInfo = {
                    //投标信息全选
                    select_add_all: false,
                    //中标全选
                    select_del_all: false,
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                        $scope.settings.fixedAssetsOpts.fixedAssetsList = $scope.baseInfo.getFixedAssetsList();
                        //$scope.refreshProcess();
                    },
                    //选择主体公司
                    selectCorporation: function (supplier) {
                        angular.forEach($scope.viewModel.corporationScopeList, function (item) {
                            if (item.corporationCode == supplier.corporationCode) {
                                supplier.corporationName = item.corporationName;
                            }
                        });
                    },
                    //获取供应商
                    getFixedAssetsList: function () {
                        fixedAssetsList = [];
                        // 固定资产明细
                        angular.forEach($scope.viewModel.fixedAssetsList, function (fixedAssets) {
                            var item = {
                                goodsName: fixedAssets.goodsName,
                                perPrice: fixedAssets.perPrice,
                                count: fixedAssets.count,
                                measurementUnitName: "",
                                assetsTypeCode: fixedAssets.assetsTypeCode,
                                assetsTypeCnName: fixedAssets.assetsTypeCnName,
                                code: fixedAssets.code,
                            };
                            fixedAssetsList.push(item);
                        });
                        return fixedAssetsList;
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

                //添加中标供应商
                $scope.addSure = function () {
                    angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                        angular.forEach($scope.viewModel.businessEvaluateBiddingInfoList, function (item) {
                            if (supplier.supplierCode == item.supplierCode) {
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
                                        "isFirstRoundBottomPrice": item.totalAmountWithTax === $scope.viewModel.minAmount,
                                        "explain": null,
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
                                var route = "";
                                switch (routesType) {
                                    case "evaluateTenderSummary":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "EvaluateTenderSummary") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                route = $scope.viewModel.processActivityInfoList[i].activityStateName;
                                                break;
                                            }
                                        }
                                        break;
                                    case "draft":
                                        for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                            if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "Draft") {
                                                activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                                route = $scope.viewModel.processActivityInfoList[i].activityStateName;
                                                break;
                                            }
                                        }
                                        break;
                                }
                                url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + route + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID;

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
                //验证 
                var validData = function () {
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
                    });
                    if ($scope.isSamillerCorporation == true) {
                        error.addModelError("法人主体", "同一家供应商法人主体不能相同");
                    }
                    if ($scope.sumAmount > $scope.viewModel.purchaseBase.perPurchaseAmount)
                        error.addModelError("中标金额", "中标金额不能超过预计采购金额");

                    if ($scope.viewModel.sureReportFile.length == 0) error.addModelError("定标报告", "定标报告不能为空");




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
                    return error;
                }
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    return modelStateDictionary;
                };

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
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {};
                    if (param) {
                        wfOperate.refreshProcess('/BiddingAssetsPurchaseConfirmTenderWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    rcTools.setOpinionOpts(data.opinionOpts.options);
                    rcTools.setProcessNavigator(data.processNavigator);
                });

                $scope.baseInfo.init();

            }]);
    });

