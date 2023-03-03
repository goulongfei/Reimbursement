define([
    'app',
    'engineeringExtend',
    'commonUtilExtend',
    'corporationExtend',
    'dateTimePickerExtend',
    'supplierSelector',
    'supplierCategoryExtend',
    'enterpriseShowExtend',
    'leftNavExtend',
    'supplierCategory',
    'biddingSynthesizeExtend',
    'useCostCenterExtend'
], function (app) {
    app.controller('biddingNotProjectCompilingTender_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location,
            viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools, supplierSelector, $timeout, locals) {
            angular.extend($scope, viewData);
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
            //如果是观光状态则不需要作废按钮
            //if ($scope.viewModel.formAction.actionStateCode === 0) {
            //    $scope.wfOperateOpts.allowDoAbort = false;//作废      
            //} else {
            //    viewData.wfOperateOpts.allowDoAbort = true;//作废 
            //}
            viewData.wfOperateOpts.allowComment = true; //评论
            viewData.wfOperateOpts.allowCirculate = false;//传阅
            viewData.wfOperateOpts.allowRejection = false;//退回
            viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
            viewData.wfOperateOpts.allowPrint = false;//打印
            viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

            if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowComment = true; //评论
            }

            $scope.api = {
                showErrorMessage: function (error) {
                    wfWaiting.hide();
                    if (error) {
                        sogModal.openErrorDialog(error).then(function () {
                        });
                    }
                },
                urlGetChargeCompanyList: function (param) {
                    return seagull2Url.getPlatformUrl('/Purchase/GetChargeCompanyList?r=' + Math.random() + '&corporationCode=' + param.corporationCode);
                },
                urlGetCostCenterList: function (param) {
                    //return seagull2Url.getPlatformUrl('/Purchase/GetNotOperationCostControlCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&IsProject=' + param.isProject);
                    return seagull2Url.getPlatformUrl('/Purchase/GetNotOperationCostControlCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&IsProject=' + param.isProject + '&islimit=' + false);

                },
                urlGetCommissionReasonList: function () {
                    return seagull2Url.getPlatformUrl("/Purchase/LoadReasonByPartCode?isProject=false");
                },
                urlExpenditureTypeList: function (param) {
                    return seagull2Url.getPlatformUrl('/Purchase/GetExpenditureTypeList');
                },
                // 获取记账公司
                getChargeCompanyList: function (param, done) {
                    var url = $scope.api.urlGetChargeCompanyList(param);
                    if ($scope.viewModel.purchaseBasePEMu.expenditureTypeCode == 2 || $scope.viewModel.purchaseBasePEMu.expenditureTypeCode == 3) {
                        url += '&organizationType=1'
                    }
                    $http({
                        method: 'GET',
                        url: url,
                        data: param,
                    })
                        .success(function (data) { done(data); })
                        .error($scope.api.showErrorMessage);
                },
                // 获取成本中心
                getCostCenterList: function (param, done) {
                    $http({
                        method: 'GET',
                        url: $scope.api.urlGetCostCenterList(param),
                        data: param,
                    })
                        .success(function (data) { done(data); })
                        .error($scope.api.showErrorMessage);
                }
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
                spreadButtonName: "展开",
                isApproval: true
            }

            //基本信息
            $scope.baseInfo = {
                // 初始化方法
                init: function () {
                    // 人员专业线提示
                    $scope.baseInfo.banEmpStation();
                },
                //采购金额是否变化
                isAmountChange: false,
                //是否显示合计中标金额
                isAllSupplierFinalQuoteAmount: false,
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
                //默认拟单是不显示企查查
                entrpriseReadOnly: false,
                //法人公司
                corporationOpts: {
                    corporationName: '',
                    beforAppend: function (corporation) {
                        $scope.viewModel.corporationScopes = corporation;
                        $scope.baseInfo.loadChargeCompany(corporation);

                    }
                },
                //入围供应商
                supplierScopeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    scene: "Draft",
                    beforAppend: function (supplierData) {
                        $scope.viewModel.supplierScopeList.push(supplierData);
                    },
                    afterAppend: function (supplierData) {
                        $scope.viewModel.supplierScopeList = supplierData;
                    },
                    projectList: {
                        projectCode: $scope.viewModel.purchaseOfNotProjectPEMu.projectCode,
                        projectName: $scope.viewModel.purchaseOfNotProjectPEMu.projectName
                    },
                    blackList: $scope.blackList,
                },
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "Draft",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //查询记账公司
                loadChargeCompany: function (corporation) {
                    wfWaiting.show();
                    var tempList = [];
                    $scope.viewModel.option.chargeCompany = [];
                    $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode = "";
                    $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyName = "";
                    $scope.viewModel.option.costCenter = [];
                    $scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode = "";
                    $scope.viewModel.purchaseOfNotProjectPEMu.costCenterName = "";
                    for (var i = 0; i < corporation.length; i++) {
                        var param = { corporationCode: corporation[i].corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            for (var i = 0; i < data.length; i++) {
                                $scope.viewModel.option.chargeCompany.push(data[i]);
                            }
                            wfWaiting.hide();
                        });
                    }
                },
                //记账公司下拉框选中后数据变化
                chargeCompanyChange: function () {
                    angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                        if ($scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode === v.code) {
                            $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyName = v.name;
                            $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode, v.data);
                        }
                    })
                },
                //加载成本中心
                loadCostCenter: function (chargeCompanyCode, organizationType) {
                    wfWaiting.show();
                    $scope.viewModel.option.costCenter = [];
                    var isProject = 1;
                    if (organizationType == 0) {
                        isProject = 2;
                    }
                    var param = { chargeCompanyCode: chargeCompanyCode, isProject: isProject };
                    $scope.api.getCostCenterList(param, function (data) {
                        $scope.viewModel.option.costCenter = data;
                        wfWaiting.hide();
                    });
                },
                //成本中心选中下拉框数据变化
                costCenterChange: function () {
                    angular.forEach($scope.viewModel.option.costCenter, function (v) {
                        if ($scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode === v.code) {
                            $scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode = v.code;
                            $scope.viewModel.purchaseOfNotProjectPEMu.costCenterName = v.name;
                        }
                    });
                    if ($scope.viewModel.purchaseBasePEMu.expenditureTypeCode == 1) {
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode;
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode;
                    }
                },
                //采购金额变化
                perPurchaseAmountChange: function (newValue, oldValue) {
                    if ((newValue) && newValue != oldValue) {
                        $scope.baseInfo.isAmountChange = true
                    }
                },
                //采购金额变化刷新流程
                purchaseAmountChange: function () {
                    if ($scope.baseInfo.isAmountChange == true) {
                        $scope.refreshProcess();
                    }
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
                fileReady: true,
                //是否涉及项目系统建设
                isInvolveITConstruction: function (isInvolveITConstruction) {
                    $scope.viewModel.purchaseOfNotProjectPEMu.isInvolveITConstruction = isInvolveITConstruction;
                },
                //是否涉及项目
                isInvolveProject: function (isInvolveProject) {
                    $scope.viewModel.purchaseOfNotProjectPEMu.isInvolveProject = isInvolveProject;
                    if (!isInvolveProject) {
                        $scope.viewModel.purchaseOfNotProjectPEMu.projectCode = "";
                        $scope.viewModel.purchaseOfNotProjectPEMu.projectName = "";
                        $scope.baseInfo.projectOpts.projectName = "";
                        $scope.baseInfo.supplierScopeOpts.blackList = [];
                        $scope.baseInfo.supplierScopeOpts.projectList.projectCode = "";
                        $scope.baseInfo.supplierScopeOpts.projectList.projectName = "";
                    } else {
                        $scope.baseInfo.supplierScopeOpts.blackList = ['project'];
                    }
                },
                //是否法务类
                InitIsLegal: function (v) {
                    if (v) {
                        $scope.viewModel.purchaseOfNotProjectPEMu.isLegal = true;
                    } else {
                        $scope.viewModel.purchaseOfNotProjectPEMu.isLegal = false;
                    }
                    $scope.refreshProcess();
                },
                //是否重大诉讼
                InitIsGreatLawsuit: function (v) {
                    if (v) {
                        $scope.viewModel.purchaseOfNotProjectPEMu.isGreatLawsuit = true;
                    } else {
                        $scope.viewModel.purchaseOfNotProjectPEMu.isGreatLawsuit = false;
                    }
                    $scope.refreshProcess();
                },
                //项目名称
                projectOpts: {
                    projectName: $scope.viewModel.purchaseOfNotProjectPEMu.projectName,
                    beforAppend: function (project) {
                        $scope.viewModel.purchaseOfNotProjectPEMu.project = project;
                        $scope.viewModel.purchaseOfNotProjectPEMu.projectCode = project.projectCode;
                        $scope.viewModel.purchaseOfNotProjectPEMu.projectName = project.projectName;
                        //传递给控件项目编码
                        $scope.baseInfo.supplierScopeOpts.projectList.projectCode = $scope.viewModel.purchaseOfNotProjectPEMu.projectCode;
                        $scope.baseInfo.supplierScopeOpts.projectList.projectName = $scope.viewModel.purchaseOfNotProjectPEMu.projectName;
                    }
                },
                // 人员一级专业线提示
                banEmpStation: function () {
                    if ($scope.viewModel.empStation && $scope.viewModel.empStation.isBanNewStationCategorySystem === true) {
                        var stationName = $scope.viewModel.empStation.fullPath;
                        if (!stationName) { stationName = ""; }
                        sogModal.openAlertDialog('提示', '[' + stationName + '] 专业线人员不能发起非项目服务类采购流程，请核实费用类型，选择正确的采购类型发起');
                    }
                },
                //使用成本中心
                useCostCenterChange: function (newValue, oldValue) {
                    $scope.refreshProcess();
                },
                //支出类型判断
                expenditureTypeChange: function () {
                    angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                        if ($scope.viewModel.purchaseBasePEMu.expenditureTypeCode === v.code) {
                            $scope.viewModel.purchaseBasePEMu.expenditureTypeName = v.name;
                        }
                    })
                    //2022年10月11日需求优化-清空法人、记账公司、成本中心信息
                    $scope.baseInfo.corporationOpts.corporationName = "";
                    if ($scope.viewModel.corporationScopes && $scope.viewModel.corporationScopes.length > 0) {
                        $scope.viewModel.corporationScopes[0].corporationCode = "";
                        $scope.viewModel.corporationScopes[0].corporationName = "";
                    }
                    $scope.viewModel.option.chargeCompany = [];
                    $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode = "";
                    $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyName = "";
                    $scope.viewModel.option.costCenter = [];
                    $scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode = "";
                    $scope.viewModel.purchaseOfNotProjectPEMu.costCenterName = "";

                    if ($scope.viewModel.purchaseBasePEMu.expenditureTypeCode === 2 || $scope.viewModel.purchaseBasePEMu.expenditureTypeCode === 3) {
                        $scope.viewModel.isUseCostCenter = true;
                        $scope.viewModel.useCostCenterInfoList = [];
                    } else {
                        $scope.viewModel.isUseCostCenter = false;
                        $scope.viewModel.useCostCenterInfoList = [];
                        if ($scope.viewModel.purchaseBasePEMu.expenditureTypeCode === 1) {
                            $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode;
                            $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode;
                        }
                    }
                },
            };

            //添加供应商
            $scope.addDetail = function () {
                var blackList = [];
                if ($scope.viewModel.purchaseOfNotProjectPEMu.isInvolveProject) {
                    blackList.push('projectCode');
                }
                var params = {
                    projectCode: $scope.viewModel.purchaseOfNotProjectPEMu.projectCode,
                    supplierCatagoryList: [],
                    supplierName: "",
                    isMonopolyEditable: true,
                    reason: 0,
                    delegationAmount: 0,
                    blackList: blackList
                };
                var supplierSelectorResult = supplierSelector.open(params);
                if (supplierSelectorResult) {
                    supplierSelectorResult.then(function (supplier) {
                        var item = null;
                        angular.forEach($scope.viewModel.supplierScopeList, function (v) {
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
                            $http.get(seagull2Url.getPlatformUrl("/TenderSuplierExtend/GetTenderSupplierInfo?supplierCode=" + supplier.supplierCode + "&industryDomainCode=" + supplier.industryDomainCode + '&r=' + Math.random()))
                                .success(function (data) {
                                    wfWaiting.hide();
                                    $scope.viewModel.supplierScopeList.push({
                                        checked: false,
                                        supplierCode: supplier.supplierCode,
                                        supplierName: supplier.supplierName,
                                        industryDomainCode: supplier.industryDomainCode,
                                        industryDomainName: supplier.industryDomainName,
                                        industryDomainLevelCode: supplier.industryDomainLevelCode,
                                        industryDomainLevelName: supplier.industryDomainLevelName,
                                        industryDomainHistoryBiddingCount: data.industryDomainHistoryBiddingCount,
                                        industryDomainHistoryTenderCount: data.industryDomainHistoryTenderCount,
                                        supplierHistoryBiddingCount: data.supplierHistoryBiddingCount,
                                        supplierHistoryTenderCount: data.supplierHistoryTenderCount,
                                        registCapital: 0,
                                        lastYearAnnualValue: 0,
                                        performanceSituation: "",
                                        sortNo: $scope.viewModel.supplierScopeList.length + 1,
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
                for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                    if (!$scope.viewModel.supplierScopeList[i].checked) {
                        $scope.baseInfo.select_all = false;
                        return;
                    } else {
                        $scope.baseInfo.select_all = true;
                    }
                }
            };
            //全选
            $scope.selectAll = function (allChecked) {
                for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                    $scope.viewModel.supplierScopeList[i].checked = allChecked;
                }
            };
            //删除供应商
            $scope.deleteDetail = function () {
                var select = false;
                for (var i = $scope.viewModel.supplierScopeList.length - 1; i >= 0; i--) {
                    if ($scope.viewModel.supplierScopeList[i].checked) {
                        select = true;
                    }
                }
                if (!select) {
                    sogModal.openAlertDialog("提示", "请先选中需要删除的入围供应商信息")
                } else {
                    var promise = sogModal.openConfirmDialog("删除", "确认是否删除入围供应商信息?");
                    promise.then(function (v) {
                        for (var i = $scope.viewModel.supplierScopeList.length - 1; i >= 0; i--) {
                            if ($scope.viewModel.supplierScopeList[i].checked) {
                                var item = $scope.viewModel.supplierScopeList[i];
                                $scope.viewModel.supplierScopeList.splice(i, 1);
                                $scope.sortNo(item);
                            }
                        }
                        $scope.baseInfo.select_all = false;
                    })
                }
            }
            //排序
            $scope.sortNo = function (item) {
                angular.forEach($scope.viewModel.supplierScopeList, function (v) {
                    if (item.sortNo < v.sortNo) {
                        v.sortNo = v.sortNo - 1;
                    }
                });
            };
            //企查查查询关联关系
            $scope.selectenterpriseCheck = function () {
                if ($scope.viewModel.supplierScopeList.length <= 1) {
                    sogModal.openAlertDialog("提示", "最少选择两个公司");
                    return;
                } else {
                    $scope.baseInfo.entrpriseReadOnly = true;
                }
            }
            //数据有效性的检验
            var RequiredValidator = ValidateHelper.getValidator("Required");

            var validData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        key: '', attributeName: '', validator: new RequiredValidator('')
                    }
                ]);
                if ($scope.viewModel.purchaseOfNotProjectPEMu.isInvolveProject == true || $scope.viewModel.purchaseOfNotProjectPEMu.isInvolveProject == 'true') {
                    if (!$scope.viewModel.purchaseOfNotProjectPEMu.projectCode) {
                        modelStateDictionary.addModelError("采购信息", "项目不能为空");
                    }
                }
                if ($scope.viewModel.purchaseOfNotProjectPEMu.isGreatLawsuit == null) {
                    modelStateDictionary.addModelError('是否重大诉讼', '请选择！');
                } else {
                    if ($scope.viewModel.purchaseOfNotProjectPEMu.isGreatLawsuit == true) {
                        if ($scope.viewModel.purchaseOfNotProjectPEMu.isLegal != null && $scope.viewModel.purchaseOfNotProjectPEMu.isLegal == false) {
                            modelStateDictionary.addModelError('是否法务类', '重大诉讼一定是法务类！');
                        }
                    }
                }
                if ($scope.viewModel.purchaseOfNotProjectPEMu.isLegal == null) {
                    modelStateDictionary.addModelError('是否法务类', '请选择！');
                }
                if ($scope.viewModel.purchaseBasePEMu.expenditureTypeCode == null) {
                    modelStateDictionary.addModelError('支出类型', '请选择！');
                }
                if ($scope.viewModel.purchaseBasePEMu.perPurchaseAmount <= 0) {
                    modelStateDictionary.addModelError("采购信息", "预计采购金额不能为0");
                }
                if ($scope.viewModel.corporationScopes == null || $scope.viewModel.corporationScopes.length == 0) {
                    modelStateDictionary.addModelError("采购信息", "招标人不能为空");
                }
                if (!$scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode) {
                    modelStateDictionary.addModelError("采购信息", "记账公司不能为空");
                }
                if (!$scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode) {
                    modelStateDictionary.addModelError("采购信息", "成本中心不能为空");
                }
                if (!$scope.viewModel.purchaseBasePEMu.purchaseName) {
                    modelStateDictionary.addModelError("采购信息", "采购名称不能为空");
                }
                if ($scope.viewModel.purchaseBasePEMu.purchaseName && $scope.viewModel.purchaseBasePEMu.purchaseName.length > 30) {
                    modelStateDictionary.addModelError("采购信息", "采购名称不能超过30个字");
                }
                if (!$scope.viewModel.purchaseOfNotProjectPEMu.purchaseContent) {
                    modelStateDictionary.addModelError("采购信息", "本次招标范围和内容不能为空");
                }
                var isValidAdopt = true;

                if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                    modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能为空");
                    isValidAdopt = false;
                }
                if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                    modelStateDictionary.addModelError("采购时间安排", "评标时间不能为空");
                    isValidAdopt = false;
                }
                if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                    modelStateDictionary.addModelError("采购时间安排", "定标时间不能为空");
                    isValidAdopt = false;
                }
                if (isValidAdopt) {
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline) < new Date()) {
                        modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                    }
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline) < new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline)) {
                        modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于回标截止时间");
                    }
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline) < new Date($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline)) {
                        modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                    }
                }

                if (!$scope.viewModel.purchaseMainUser || !$scope.viewModel.purchaseMainUser.id) {
                    modelStateDictionary.addModelError("采购小组成员", "采购主责人不能为空");
                }
                if (!$scope.viewModel.businessMainUser || !$scope.viewModel.businessMainUser.id) {
                    modelStateDictionary.addModelError("采购小组成员", "商务负责人不能为空");
                }
                if (!$scope.viewModel.technologyMainUser || !$scope.viewModel.technologyMainUser.id) {
                    modelStateDictionary.addModelError("采购小组成员", "技术负责人不能为空");
                }
                if ($scope.viewModel.businessMainUser && $scope.viewModel.technologyMainUser && $scope.viewModel.businessMainUser.id == $scope.viewModel.technologyMainUser.id) {
                    modelStateDictionary.addModelError("采购小组成员", "商务负责人和技术负责人不能为同一个人");
                }
                //使用成本中心验证
                if ($scope.viewModel.isUseCostCenter == true && angular.isArray($scope.viewModel.useCostCenterInfoList)) {
                    // 校验是否为空
                    if ($scope.viewModel.useCostCenterInfoList.length === 0) {
                        modelStateDictionary.addModelError('使用成本中心', '不能为空!');
                    }
                    for (var i = 0; i < $scope.viewModel.useCostCenterInfoList.length; i++) {
                        var item = $scope.viewModel.useCostCenterInfoList[i];
                        var rowKey = "使用成本中心" + (i + 1) + "行";
                        var required = ValidateHelper.validateData(item, [
                            { key: rowKey + '，使用记账公司', attributeName: 'useChargeCompanyCode', validator: [new RequiredValidator("请选择！")] },
                            { key: rowKey + '，使用成本中心', attributeName: 'useCostCenterCode', validator: [new RequiredValidator("请选择！")] }
                        ]);
                        modelStateDictionary.merge(required);
                    }
                }
                if ($scope.viewModel.biddingReportFile == null || $scope.viewModel.biddingReportFile.length == 0) {
                    modelStateDictionary.addModelError("附件", $scope.viewModel.biddingOrEnquiry + "文件不能为空");
                } else {
                    var count = 0;
                    angular.forEach($scope.viewModel.biddingReportFile, function (file) {
                        if (!file.isDeleted) {
                            count++;
                        }
                    });
                    if (count == 0) {
                        modelStateDictionary.addModelError("附件", $scope.viewModel.biddingOrEnquiry + "文件不能为空");
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
                                //是否有审批人
                                if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length == 0) {
                                    sogModal.openAlertDialog('提示', '当前流程没有审批人，无法发送');
                                } else {
                                    defer.resolve($scope.viewModel)
                                }
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
                        case sogWfControlOperationType.Comment:
                            var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                            promise.then(function () {
                                defer.resolve($scope.viewModel);
                            }, function () {
                                defer.reject($scope.viewModel);
                            });
                            break;
                        default:
                            defer.resolve(null);
                            break;
                    }
                }
            };

            $scope.$watch('viewModel.purchaseBasePEMu.perPurchaseAmount', $scope.baseInfo.perPurchaseAmountChange);
            $scope.$watch('viewModel.mainCostCenterCode', $scope.baseInfo.useCostCenterChange);
            // 刷新流程
            $scope.refreshProcess = function () {
                if ($scope.viewModel.isUseCostCenter) {
                    if ($scope.viewModel.useCostCenterInfoList.length > 0) {
                        if ($scope.viewModel.useCostCenterInfoList[0].useChargeCompanyCode && $scope.viewModel.useCostCenterInfoList[0].useCostCenterCode) {
                            $scope.viewModel.mainCostCenterCode = $scope.viewModel.useCostCenterInfoList[0].useCostCenterCode;
                            $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.useCostCenterInfoList[0].useChargeCompanyCode;
                        }
                    }
                }
                var param = {
                    PurchaseAmount: $scope.viewModel.purchaseBasePEMu.perPurchaseAmount,
                    CostCenterCode: $scope.viewModel.mainCostCenterCode,
                    ChargeCompanyCode: $scope.viewModel.mainChargeCompanyCode,
                    IsGreatLawsuit: $scope.viewModel.purchaseOfNotProjectPEMu.isGreatLawsuit == null ? false : $scope.viewModel.purchaseOfNotProjectPEMu.isGreatLawsuit,
                    IsLegal: $scope.viewModel.purchaseOfNotProjectPEMu.isLegal == null ? false : $scope.viewModel.purchaseOfNotProjectPEMu.isLegal,
                    CorporationCode: $scope.viewModel.corporationScopes[0].corporationCode
                };
                if (!$scope.viewModel.isUseCostCenter) {
                    param.ChargeCompanyCode = $scope.viewModel.purchaseOfNotProjectPEMu.chargeCompanyCode;
                    param.CostCenterCode = $scope.viewModel.purchaseOfNotProjectPEMu.costCenterCode;
                }
                if (param.PurchaseAmount && param.CostCenterCode && param.ChargeCompanyCode && param.CorporationCode) {
                    $scope.baseInfo.isAmountChange = false;
                    wfOperate.refreshProcess('/BiddingNotProjectCompilingTenderWf', $scope.currentActivityId, null, param, true);
                }
            };

            window.onstorage = function () {
                var supplierList = locals.getObject('addSupplier');
                if (supplierList && supplierList.length > 0) {
                    $timeout(function () {
                        $scope.viewModel.supplierScopeList = supplierList;
                    }, 0)
                }
            }

            $rootScope.$on("$processRefreshed", function (event, data) {
                angular.extend($scope.opinionOpts, data.opinionOpts);
            });

            // 初始化
            $scope.baseInfo.init();
        });
});


