define(['app', 'commonUtilExtend', 'leftNavExtend', 'enterpriseShowExtend', 'biddingSynthesizeExtend'], function (app) {
    app.controller('scaling_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, configure, $window, rcTools) {
            angular.extend($scope, viewData);
            $scope.common = {};
            configure.getConfig($scope.common, 'common');
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            $scope.isOpinionsShow = true;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //投标信息全选
                select_all: false,
                //中标全选
                winningBid_all: false,
                //数字控件
                digitalOpts: {
                    min: 1,
                    max: 999999999,
                    precision: 0
                },
                //多选人员
                selectCheckBoxPeople: {
                    selectMask: sogOguType.User,
                    multiple: true
                },
                //附件
                fileopts: {
                    'auto': true,
                    'resourceId': $scope.viewModel.resourceID,
                    'preview': false,
                    'fileNumLimit': 10
                },
                fileReady: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "ConfirmTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //查找回标信息
                getReplyBidding: function (supplierCode) {
                    var p_SupplierReplyBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_SupplierReplyBiddingInfoPEMus.length; i++) {
                        if ($scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].className == 2) {
                            p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i];
                            break;
                        }
                    }
                    return p_SupplierReplyBiddingInfo;
                },
                //得到清标回标信息
                getClearBiddingReplyBidding: function (supplierCode) {
                    var p_SupplierReplyBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos.length; i++) {
                        if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].supplierCode == supplierCode) {
                            if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes
                                && $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].isReplyBidding) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                                break;
                            } else if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == ($scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes - 1)) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                                break;
                            }
                        }
                    }
                    return p_SupplierReplyBiddingInfo;
                },
                //得到商务评标信息
                getBusinessEvaluateBiddingInfo: function (supplierCode, round) {
                    var businessEvaluateBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus.length; i++) {
                        if ($scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i].supplierCode == supplierCode
                            && $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i].round == round) {
                            businessEvaluateBiddingInfo = $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i];
                            break;
                        }
                    }
                    return businessEvaluateBiddingInfo;
                }
            };
            //初始化每个供应商是否合格
            angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (supplier) {
                supplier.isQualified = false;
                for (var i = 0; i < $scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus.length; i++) {
                    if ($scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus[i].supplierCode == supplier.supplierCode) {
                        supplier.isQualified = $scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus[i].isQualified;
                        break;
                    }
                }
            });
            //选中供应商
            $scope.selectOne = function (checked) {
                for (var i = 0; i < $scope.viewModel.p_SupplierScopePEMus.length; i++) {
                    if (!$scope.viewModel.p_SupplierScopePEMus[i].isWinTheBidding) {
                        if (!$scope.viewModel.p_SupplierScopePEMus[i].checked) {
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
                for (var i = 0; i < $scope.viewModel.p_SupplierScopePEMus.length; i++) {
                    if (!$scope.viewModel.p_SupplierScopePEMus[i].isWinTheBidding && $scope.viewModel.p_SupplierScopePEMus[i].isQualified) {
                        $scope.viewModel.p_SupplierScopePEMus[i].checked = allChecked;
                    }
                }
            };
            //选中中标供应商
            $scope.winningBidSelectOne = function (checked) {
                for (var i = 0; i < $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.length; i++) {
                    if (!$scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus[i].checked) {
                        $scope.baseInfo.winningBid_all = false;
                        return;
                    } else {
                        $scope.baseInfo.winningBid_all = true;
                    }
                }
            };
            //全选中标供应商
            $scope.winningBidSelectAll = function (allChecked) {
                for (var i = 0; i < $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.length; i++) {
                    $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus[i].checked = allChecked;
                }
            };
            //添加中标供应商
            $scope.addWinningBidSupplier = function () {
                angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (supplier) {
                    if (supplier.checked) {
                        var item = {
                            "resourceID": $scope.viewModel.resourceID,
                            "supplierCode": supplier.supplierCode,
                            "supplierName": supplier.supplierName,
                            "industryDomainCode": supplier.industryDomainCode,
                            "industryDomainName": supplier.industryDomainName,
                            "agreementName": "",
                            "agreementCopies": 6,
                            "linkManName": supplier.linkManName,
                            "linkManPhone": supplier.linkManPhone,
                            "linkManEmail": supplier.linkManEmail,
                            "biddingScopeDescribe": "",
                            "sortNo": $scope.viewModel.p_SupplierScopePEMus.length + 1,
                            "checked": false,
                            "agreementFile": []
                        };
                        $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.push(item);
                        supplier.isWinTheBidding = true;
                        supplier.checked = false;
                    }
                });
                $scope.baseInfo.select_all = false;
            };
            //删除中标供应商
            $scope.deleteWinningBidSupplier = function () {
                var select = false;
                for (var i = $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.length - 1; i >= 0; i--) {
                    if ($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus[i].checked) {
                        select = true;
                    }
                }
                if (!select) {
                    sogModal.openAlertDialog("提示", "请先选中需要删除的中标供应商信息")
                } else {
                    var promise = sogModal.openConfirmDialog("删除", "确认是否删除中标供应商信息?");
                    promise.then(function (v) {
                        for (var i = $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.length - 1; i >= 0; i--) {
                            if ($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus[i].checked) {
                                var item = $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus[i];
                                $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.splice(i, 1);
                                $scope.sortNo(item);
                                for (var si = 0; si < $scope.viewModel.p_SupplierScopePEMus.length; si++) {
                                    if ($scope.viewModel.p_SupplierScopePEMus[si].supplierCode == item.supplierCode) {
                                        $scope.viewModel.p_SupplierScopePEMus[si].isWinTheBidding = false;
                                        break;
                                    }
                                }
                            }
                        }
                        $scope.baseInfo.winningBid_all = false;
                    })
                }
            };
            //排序
            $scope.sortNo = function (item) {
                angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus, function (v) {
                    if (item.sortNo < v.sortNo) {
                        v.sortNo = v.sortNo - 1;
                    }
                });
            };
            //刷新流程
            $scope.refreshProcess = function () {
                wfOperate.refreshProcess('/ScalingWf', $scope.currentActivityId, null, {
                    issuanceNotice: $scope.viewModel.p_StrategyPurchasePlanCase.isGrantWinBiddingNotice,
                    corporationCode: $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode
                }).success(function (d) {
                }).error(function (data, status) { });
            };
            //查看页面
            $scope.lookInfo = function (routesType, title) {
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = "";
                            var activityID = "";
                            switch (routesType) {
                                case "evaluateTenderGather":
                                    for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                        if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "BiddingCentralizedEvaluateSummary") {
                                            activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                            break;
                                        }
                                    }
                                    break;
                                case "compilingTenderApproval":
                                    for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                        if ($scope.viewModel.processActivityInfoList[i].activityCodeName == "BiddingCentralizedDraft") {
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
                        errorDialog.openErrorDialog(data, status, title + "异常");
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
                if ($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus == null || $scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus.length < 1) {
                    modelStateDictionary.addModelError("中标情况", "中标供应商不能少于1家");
                } else {
                    angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfoPEMus, function (item, i) {
                        if (!item.agreementName) {
                            modelStateDictionary.addModelError("中标情况", "中标供应商【" + item.supplierName + "】拟定协议名称不能为空");
                        }
                        if (item.agreementFile == null || item.agreementFile.length == 0) {
                            modelStateDictionary.addModelError("中标情况", "中标供应商【" + item.supplierName + "】合作协议不能为空");
                        } else {
                            var count = 0;
                            angular.forEach(item.agreementFile, function (file) {
                                if (!file.isDeleted) {
                                    count++;
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("中标情况", "中标供应商【" + item.supplierName + "】合作协议不能为空");
                            }
                        }
                        if (item.agreementCopies < 1) {
                            modelStateDictionary.addModelError("中标情况", "中标供应商【" + item.supplierName + "】协议份数不能为0");
                        }
                        if (!item.biddingScopeDescribe) {
                            modelStateDictionary.addModelError("中标情况", "中标供应商【" + item.supplierName + "】中标范围不能为空");
                        }
                    });
                }

                if ($scope.viewModel.scalingFile == null || $scope.viewModel.scalingFile.length == 0) {
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


