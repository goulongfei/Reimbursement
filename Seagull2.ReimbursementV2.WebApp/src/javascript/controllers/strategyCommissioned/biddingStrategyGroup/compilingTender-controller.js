define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'supplierSelector',
        'enterpriseShowExtend',
        'leftNavExtend',
        'supplierSelectorV2',
    ], function (app) {
        app.controller('compilingTender_controller',
            function ($scope, $http, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, $window, configure, supplierSelectorV2, locals, $timeout, configure,exception) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集团战采）";
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
                //如果是观光状态则不需要作废按钮
                if ($scope.viewModel.formAction.actionStateCode === 0) {
                    $scope.wfOperateOpts.allowDoAbort = false;//作废      
                }
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印

                //页面权限加载--对接统一权限资源权限
                function CheckPermission() {
                    var command = {
                        permissionValue: "strategyPurchaseFontOaportal",
                        permissionName: "战略采购"
                    };
                    var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
                    wfWaiting.show();
                    $http.post(url, command)
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data.success) {
                                if (!data.data) {
                                    exception.throwException(500, { message: "您没有战略采购相关权限，请联系管理员!" });
                                }
                            } else {
                                exception.throwException(500, { message: data.message });
                            }
                        });
                }
                CheckPermission();

                //基本信息
                $scope.baseInfo = {
                    //入围供应商全选
                    select_all: false,
                    //单选人员
                    selectRadioPeople: {
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
                    //数字控件
                    digitalOpts: {
                        min: 1,
                        max: 999999999,
                        precision: 0
                    },
                    //默认拟单是不显示企查查
                    entrpriseReadOnly: false,
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "Draft",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //招标人
                    companySelected: function () {
                        //每次重新选择招标人将之前选择的清空
                        $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = "";
                        $scope.viewModel.p_StrategyPurchasePlanCase.bidderName = "";
                        var viewpath = './htmlTemplate/dialogTemplate/common/corporationRadioSelector.html';
                        var projectDetailResult = sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                            '选择招标人', "corporationRadioSelector_controller", $scope, { containerStyle: { width: '40%' } });
                        projectDetailResult.then(function (resultData) {
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = resultData.code;
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderName = resultData.cnName;
                        });
                    },
                    //选择供应商类别
                    supplierTypeSelected: function () {
                        //清空数据
                        $scope.viewModel.p_IndustryDomainScopes = [];
                        $scope.viewModel.industryDomainName = "";
                        var tempUrl = './htmlTemplate/dialogTemplate/common/supplierCategory.html';
                        var supplierTypeDialogUrl = '<div style="height:75%;" ng-include="\'' + tempUrl + '\'"></div>';
                        var promise = sogModal.openDialog(supplierTypeDialogUrl, "选择行业领域", "supplierCategory_controller", $scope);
                        promise.then(function (result) {
                            angular.forEach(result, function (v) {
                                var obj = {
                                    industryDomainCode: v.id,
                                    industryDomainName: v.title
                                };
                                $scope.viewModel.p_IndustryDomainScopes.push(obj);
                            });
                            $scope.baseInfo.supplierTypeInit();
                        });
                    },
                    supplierTypeInit: function () {
                        $scope.viewModel.industryDomainName = "";
                        angular.forEach($scope.viewModel.p_IndustryDomainScopes, function (v) {
                            $scope.viewModel.industryDomainName += v.industryDomainName + ';';
                        });
                    },
                    //选择合作期限
                    cooperationDeadlineType: function () {
                        angular.forEach($scope.viewModel.cooperationDeadlineTypeList, function (v) {
                            if (v.code == $scope.viewModel.p_StrategyPurchasePlanCase.cooperationDeadlineTypeCode) {
                                $scope.viewModel.p_StrategyPurchasePlanCase.cooperationDeadlineTypeName = v.name;
                            }
                        });
                    },
                    //采购时间安排
                    purchaseDateArrangeInfoPEMus: function () {
                        var purchaseDateArrangeInfoPEMuList = [];
                        angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                            if (item.className === 4) {
                                purchaseDateArrangeInfoPEMuList.push(item);
                            }
                        });
                        return purchaseDateArrangeInfoPEMuList;
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                    },
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    fileReady: true
                };

                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }

                //添加供应商
                $scope.addDetail = function () {
                    var params = {
                        actionTypeCode: 11,
                        projectCode: "",
                        supplierCatagoryList: $scope.viewModel.p_IndustryDomainScopes,
                        supplierName: "",
                        isMonopolyEditable: true,
                        reason: 0,
                        delegationAmount: 0,
                        blackList: ["supplierCatagory"],
                        isDirectCommissioned: false
                    };
                    var supplierSelectorResult = supplierSelectorV2.open(params);
                    if (supplierSelectorResult) {
                        supplierSelectorResult.then(function (supplier) {
                            var item = null;
                            angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (v) {
                                if (v.supplierCode == supplier.supplierCode) {
                                    v.supplierName = supplier.supplierName;
                                    v.industryDomainCode = supplier.industryDomainCode;
                                    v.industryDomainName = supplier.industryDomainName;
                                    item = v;
                                }
                            });
                            if (!item) {
                                //需要查询下当前供应商的中标次数和入围次数
                                wfWaiting.show();
                                $http.get(seagull2Url.getPlatformUrl("/TenderSuplierExtend/GetTenderSupplierInfo?supplierCode=" + supplier.supplierCode + "&industryDomainCode=" + supplier.industryDomainCode  + '&r=' + Math.random()))
                                .success(function (data) {
                                    wfWaiting.hide();
                                    $scope.viewModel.p_SupplierScopePEMus.push({
                                        checked: false,
                                        supplierCode: supplier.supplierCode,
                                        supplierName: supplier.supplierName,
                                        industryDomainCode: supplier.industryDomainCode,
                                        industryDomainName: supplier.industryDomainName,
                                        industryDomainHistoryBiddingCount: data.industryDomainHistoryBiddingCount,
                                        industryDomainHistoryTenderCount: data.industryDomainHistoryTenderCount,
                                        supplierHistoryBiddingCount: data.supplierHistoryBiddingCount,
                                        supplierHistoryTenderCount: data.supplierHistoryTenderCount,
                                        industryDomainLevelCode: supplier.industryDomainLevelCode,
                                        industryDomainLevelName: supplier.industryDomainLevelName,
                                        qualificationLevelNames: supplier.qualificationLevelNames,
                                        registCapital: supplier.registCapital != null ? supplier.registCapital : 0,
                                        lastYearAnnualValue: 0,
                                        performanceSituation: "",
                                        sortNo: $scope.viewModel.p_SupplierScopePEMus.length + 1,
                                        IsTinySupplier: supplier.isTiny
                                    });
                                })
                                .error(function (err) {
                                    wfWaiting.hide();
                                    sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                                });
                            }
                        });
                    }
                };
                //选中供应商
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.viewModel.p_SupplierScopePEMus.length; i++) {
                        if (!$scope.viewModel.p_SupplierScopePEMus[i].checked) {
                            $scope.baseInfo.select_all = false;
                            return;
                        } else {
                            $scope.baseInfo.select_all = true;
                        }
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.viewModel.p_SupplierScopePEMus.length; i++) {
                        $scope.viewModel.p_SupplierScopePEMus[i].checked = allChecked;
                    }
                };
                //按供应商标签维度筛选
                $scope.addSupplierByLabel = function () {
                    var isValid = true;
                    if (!$scope.viewModel.industryDomainName) {
                        sogModal.openAlertDialog("提示", "请先选择供应商类别，再添加供应商!");
                        isValid = false;
                        return;
                    }
                    if ($scope.viewModel.p_IndustryDomainScopes) {
                        locals.setObject('supplierCatagoryList', $scope.viewModel.p_IndustryDomainScopes);
                    } else {
                        locals.setObject('supplierCatagoryList', []);
                    }
                    if (isValid) {
                        var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierLabelInfoReport?value=1&type=2";
                        $window.open(url);
                    }
                   
                }
                //删除供应商
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.viewModel.p_SupplierScopePEMus.length - 1; i >= 0; i--) {
                        if ($scope.viewModel.p_SupplierScopePEMus[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的入围供应商信息")
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除入围供应商信息?");
                        promise.then(function (v) {
                            for (var i = $scope.viewModel.p_SupplierScopePEMus.length - 1; i >= 0; i--) {
                                if ($scope.viewModel.p_SupplierScopePEMus[i].checked) {
                                    var item = $scope.viewModel.p_SupplierScopePEMus[i];
                                    $scope.viewModel.p_SupplierScopePEMus.splice(i, 1);
                                    $scope.sortNo(item);
                                }
                            }
                            $scope.baseInfo.select_all = false;
                        });
                    }
                };
                //排序
                $scope.sortNo = function (item) {
                    angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (v) {
                        if (item.sortNo < v.sortNo) {
                            v.sortNo = v.sortNo - 1;
                        }
                    });
                };

                $scope.$watch('viewModel.strategyPurchasePlanPersonList', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    $scope.refreshProcess();
                }, true);

                window.onstorage = function () {
                    var supplierList = locals.getObject('addSupplier');
                    if (supplierList && supplierList.length > 0) {
                        $timeout(function () {
                            $scope.viewModel.p_SupplierScopePEMus = supplierList;
                        }, 0)
                    }
                }

                //刷新流程
                $scope.refreshProcess = function () {
                    var strategyPurchasePlanPersonIDList = "";
                    angular.forEach($scope.viewModel.strategyPurchasePlanPersonList, function (user) {
                        strategyPurchasePlanPersonIDList += user.id + ",";
                    });
                    wfOperate.refreshProcess('/BiddingStrategyGroupCompilingTenderWf', $scope.currentActivityId, null, {
                        strategyPurchasePlanPersonIDList: strategyPurchasePlanPersonIDList,
                    }).success(function (d) {
                    }).error(function (data, status) { });
                }; 

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.purchasePlanName) modelStateDictionary.addModelError("采购信息", "采购名称不能为空");
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.purchasePlanName && $scope.viewModel.p_StrategyPurchasePlanCase.purchasePlanName.length > 30) modelStateDictionary.addModelError("采购信息", "采购名称不能超过30个字");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.bidderCode) modelStateDictionary.addModelError("采购信息", "招标人不能为空");
                    if ($scope.viewModel.p_IndustryDomainScopes == null || $scope.viewModel.p_IndustryDomainScopes.length == 0) modelStateDictionary.addModelError("采购信息", "采购类别不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.cooperationDeadlineTypeCode) modelStateDictionary.addModelError("采购信息", "合作期限不能为空");
                    if ($scope.viewModel.strategyPurchasePlanPersonList == null || $scope.viewModel.strategyPurchasePlanPersonList.length == 0) modelStateDictionary.addModelError("采购信息", "采购小组其他成员不能为空");
                    if (!$scope.viewModel.purchaseMainUser) modelStateDictionary.addModelError("采购信息", "采购主责人不能为空");
                    if (!$scope.viewModel.businessMainUser) modelStateDictionary.addModelError("采购信息", "商务负责人不能为空");
                    if (!$scope.viewModel.technologyMainUser) modelStateDictionary.addModelError("采购信息", "技术负责人不能为空");
                    if ($scope.viewModel.businessMainUser && $scope.viewModel.technologyMainUser && $scope.viewModel.businessMainUser.id == $scope.viewModel.technologyMainUser.id) {
                        modelStateDictionary.addModelError("采购信息", "商务负责人和技术负责人不能为同一个人");
                    }
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.timeLimitDescribe) modelStateDictionary.addModelError("采购信息", "工期/供货期不能为空");
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.enterStandardExplain && $scope.viewModel.p_StrategyPurchasePlanCase.enterStandardExplain.length > 4000) modelStateDictionary.addModelError("采购信息", "入围标准（资质、业绩等）不能超过4000个字");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.purchaseContentDescribe) modelStateDictionary.addModelError("采购信息", "本次招标范围和内容不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.payWayDescribe) modelStateDictionary.addModelError("采购信息", "付款方式标书不能为空");
                    var isValidAdopt = true;
                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                        if (item.className == 4) {
                            if (item.inviteReplyDeadline == null || item.inviteReplyDeadline == "0001-01-01T00:00:00" || item.inviteReplyDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "供应商回复截止时间不能为空");
                                isValidAdopt = false;
                            }
                            if (item.questionDeadline == null || item.questionDeadline == "0001-01-01T00:00:00" || item.questionDeadline == "") {
                                modelStateDictionary.addModelError("采购时间安排", "供应商提问截止时间不能为空");
                                isValidAdopt = false;
                            }
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
                                if (new Date(item.inviteReplyDeadline) < new Date()) {
                                    modelStateDictionary.addModelError("采购时间安排", "供应商回复截止时间不能小于当前时间");
                                }
                                if (new Date(item.questionDeadline) < new Date(item.inviteReplyDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "供应商提问截止时间不能小于供应商回复截止时间");
                                }
                                if (new Date(item.replyDeadline) < new Date(item.questionDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于供应商提问截止时间");
                                }
                                if (new Date(item.clearBinddingDeadline) < new Date(item.replyDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "清标时间不能小于回标截止时间");
                                }
                                if (new Date(item.evaluateBiddingDeadline) < new Date(item.clearBinddingDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于清标时间");
                                }
                                if (new Date(item.decideBiddingDeadline) < new Date(item.evaluateBiddingDeadline)) {
                                    modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                                }
                            }
                        }
                    });
                    if ($scope.viewModel.p_SupplierScopePEMus.length < 3) {
                        modelStateDictionary.addModelError("入围供应商", "入围供应商不能小于三家");
                    }
                    if ($scope.viewModel.biddingReportFile == null || $scope.viewModel.biddingReportFile.length == 0) {
                        modelStateDictionary.addModelError("附件", "招标文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.biddingReportFile, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "招标文件不能为空");
                        }
                    }
                    if ($scope.viewModel.requestForInstructionsFile == null || $scope.viewModel.requestForInstructionsFile.length == 0) {
                        modelStateDictionary.addModelError("附件", "请示报告不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.requestForInstructionsFile, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "请示报告不能为空");
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

                //企查查查询关联关系
                $scope.selectenterpriseCheck = function () {
                    if ($scope.viewModel.p_SupplierScopePEMus.length <= 1) {
                        sogModal.openAlertDialog("提示", "最少选择两个公司");
                        return;
                    } else {
                        $scope.baseInfo.entrpriseReadOnly = true;
                    }
                }

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
                                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                                    {
                                        key: '', attributeName: '', validator: new RequiredValidator('')
                                    }
                                ]);
                                if ($scope.viewModel.p_StrategyPurchasePlanCase.bidderName && $scope.viewModel.p_StrategyPurchasePlanCase.bidderName.length > 50)
                                    modelStateDictionary.addModelError("采购信息", "采购名称不能超过50个字");
                                if ($scope.viewModel.p_StrategyPurchasePlanCase.enterStandardExplain && $scope.viewModel.p_StrategyPurchasePlanCase.enterStandardExplain.length > 4000)
                                    modelStateDictionary.addModelError("采购信息", "入围标准（资质、业绩等）不能超过4000个字");
                                if (!modelStateDictionary.isValid()) {
                                    sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                    sogValidator.broadcastResult(modelStateDictionary.get());
                                    angular.forEach($scope.viewModel.p_PurchaseDateArrangeInfoPEMus, function (item) {
                                        if (item.className == 4) {
                                            if (item.inviteReplyDeadline == null || item.inviteReplyDeadline == "") {
                                                item.inviteReplyDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.questionDeadline == null || item.questionDeadline == "") {
                                                item.questionDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.replyDeadline == null || item.replyDeadline == "") {
                                                item.replyDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.clearBinddingDeadline == null || item.clearBinddingDeadline == "") {
                                                item.clearBinddingDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.evaluateBiddingDeadline == null || item.evaluateBiddingDeadline == "") {
                                                item.evaluateBiddingDeadline == "0001-01-01T00:00:00";
                                            }
                                            if (item.decideBiddingDeadline == null || item.decideBiddingDeadline == "") {
                                                item.decideBiddingDeadline == "0001-01-01T00:00:00";
                                            }
                                        }
                                    });
                                    defer.reject($scope.viewModel);
                                } else {
                                    defer.resolve($scope.viewModel);
                                }
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


