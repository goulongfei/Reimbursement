define(
    [
        'app',
        'supplierCategory',
        'commonUtilExtend',
        'supplierCategoryExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        'projectExtend',
        'stageAreaExtend',
        'corporationExtend',
        'dateTimePickerExtend',
        'biddingSynthesizeExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'engineeringExtend',
        'directCommissionedSynthesizeExtend',
    ],
    function (app) {
        app.controller('biddingImplementApplication_controller', [
            '$scope', 'viewData', '$rootScope', '$http',
            'wfOperate', 'seagull2Url',
            'wfWaiting', 'sogModal', 'sogOguType', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            'regionType', 'regionShowStyle', 'configure', 'locals', '$timeout',
            function ($scope, viewData, $rootScope, $http,
                wfOperate, seagull2Url,
                wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator,
                sogWfControlOperationType,
                regionType, regionShowStyle, configure, locals, $timeout) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                //初始化期区集合-上游发起
                if ($scope.viewModel.purchaseOfImplement.stageAreaCode) {
                    $scope.viewModel.stageAreaScopeList = [{
                        stageAreaCode: $scope.viewModel.purchaseOfImplement.stageAreaCode,
                        stageAreaName: $scope.viewModel.purchaseOfImplement.stageAreaName,
                        projectCode: $scope.viewModel.purchaseOfImplement.projectCode,
                        projectName: $scope.viewModel.purchaseOfImplement.projectName
                    }]
                }
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100000000000,
                    precision: 2
                };
                //是否显示招标清单
                $scope.isShowTenderFile = false;

                // 设置
                $scope.settings = {
                    // 日期控件选项
                    dateOpts: {
                        format: 'yyyy-mm-dd',
                        selectYears: true
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    multiplePeopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0) ?
                            $scope.viewModel.corporationScopeList[0].corporationName : null,
                        beforAppend: function (corporation) {
                            if (angular.isArray(corporation) === false) { return; }
                            $scope.viewModel.corporationScopeList = [];
                            for (var i = 0; i < corporation.length; i++) {
                                $scope.viewModel.corporationScopeList.push({
                                    corporationCode: corporation[i].corporationCode,
                                    corporationName: corporation[i].corporationName,
                                });
                            }
                            $scope.baseInfo.loadChargeCompany(corporation);
                        }
                    },
                    //项目
                    projectOpts: {
                        readOnly: false,
                        beforAppend: function (projectList) {
                            $scope.viewModel.projectScopeList = projectList;
                            $scope.viewModel.stageAreaScopeList = [];
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = 0;

                            $scope.settings.contractAgreementOpts.projectList = projectList;
                            $scope.settings.contractAgreementOpts.stageAreaList = [];

                            $scope.settings.bidSectionInfoOpts.projectList = projectList;
                            $scope.settings.bidSectionInfoOpts.stageAreaList = [];

                            $scope.settings.stageAreaOpts.projectList = projectList;
                            $scope.settings.stageAreaOpts.stageAreaName = "";

                            $scope.settings.supplierScopeOpts.projectList = projectList;
                            $scope.viewModel.supplierScopeList = [];

                            var catagory = $scope.settings.supplierScopeOpts.supplierCatagory;
                            if (angular.isArray(catagory) && catagory.length > 0) {
                                var catagoryVal = catagory[0];
                                $scope.settings.supplierScopeOpts.supplierCatagory = [];
                                $scope.settings.supplierScopeOpts.supplierCatagory.push(catagoryVal);
                            }
                            $scope.refreshProcess();
                        }
                    },
                    // 期区
                    stageAreaOpts: {
                        readOnly: false,
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaName: "",
                        beforAppend: function (stageAreaList) {
                            $scope.viewModel.stageAreaScopeList = stageAreaList;
                            $scope.settings.contractAgreementOpts.stageAreaList = stageAreaList;
                            $scope.settings.bidSectionInfoOpts.stageAreaList = stageAreaList;
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = 0;
                            $scope.refreshProcess();
                        }
                    },
                    // 行业领域
                    tradeCatagoryOpts: {
                        beforAppend: function (tradeCatagory) {
                            var newVal = null;
                            var oldVal = null;
                            if (angular.isArray($scope.settings.supplierScopeOpts.supplierCatagory)
                                && $scope.settings.supplierScopeOpts.supplierCatagory.length > 0) {
                                oldVal = $scope.settings.supplierScopeOpts.supplierCatagory[0];
                            }
                            if (angular.isArray(tradeCatagory) && tradeCatagory.length > 0) {
                                newVal = tradeCatagory[0];
                            }
                            $scope.settings.supplierScopeOpts.supplierCatagory = [];
                            if (newVal) {
                                $scope.settings.supplierScopeOpts.supplierCatagory.push({
                                    industryDomainCode: newVal.code,
                                    industryDomainName: newVal.name,
                                    summaryCategoryCode: newVal.summaryCategoryCode,
                                    summaryCategoryName: newVal.summaryCategoryName,
                                    detailsCategoryCode: newVal.detailsCategoryCode,
                                    detailsCategoryName: newVal.detailsCategoryName,
                                    isEmphasis: newVal.isEmphasis,
                                });
                            }
                            if (newVal && oldVal && newVal.code != oldVal.code) {
                                $scope.viewModel.supplierScopeList = [];
                            }
                        }
                    },
                    // 地区
                    regionOpts: {
                        root: {
                            id: 'CHN',
                            //子级的类型
                            childrenClass: regionType.province
                        },
                        rootName: '中国',
                        selectMask: [regionType.county],
                        multiple: false,
                        showStyle: regionShowStyle.fullName,
                    },

                    //合约规划
                    contractAgreementOpts: {
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaList: $scope.viewModel.stageAreaScopeList,
                        projectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        projectName: $scope.viewModel.purchaseBase.useProjectName,
                        stageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        stageAreaName: $scope.viewModel.purchaseBase.useStageAreaName,
                        useProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        useStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        useChargeCompanyCode: $scope.viewModel.purchaseBase.useChargeCompanyCode,
                        useCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                        expenditureTypeCode: $scope.viewModel.purchaseBase.expenditureTypeCode,
                        multipleSelect: true,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        beforAppend: function (v) {
                            var myContract = $scope.agreement.dataFormat(v); // 格式化到视图  
                            var isSelected = false;
                            if ($scope.viewModel.contractAgreementScopeList && $scope.viewModel.contractAgreementScopeList.length > 0) {
                                angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                    if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                        var message = "合约[" + myContract.contractAgreementName + "]已选择！";
                                        sogModal.openAlertDialog("提示", message);
                                        isSelected = true;
                                        return;
                                    }
                                });
                            };
                            if (!isSelected) {
                                $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount += myContract.costTargetAmount;
                                if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                    $scope.viewModel.contractAgreementScopeList = [];
                                }
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                            };
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = 0;
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList)) {
                                for (var i = 0; i < $scope.viewModel.contractAgreementScopeList.length; i++) {
                                    var agreement = $scope.viewModel.contractAgreementScopeList[i];
                                    $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount += agreement.costTargetAmount;
                                }
                            };
                            $scope.refreshProcess();
                        },
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        scene: "Draft",
                        bidSection: $scope.viewModel.biddingSectionInfoList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        blackList: ['supplierCatagory'],
                        projectList: $scope.viewModel.projectScopeList,
                        beforAppend: function (supplierData) {
                            supplierData.biddingSectionScopeList = [];
                            for (var i = 0; i < $scope.viewModel.biddingSectionInfoList.length; i++) {
                                var item = $scope.viewModel.biddingSectionInfoList[i];
                                supplierData.biddingSectionScopeList.push({
                                    supplierCode: item.supplierCode,
                                    supplierName: item.supplierName,
                                    biddingSectionCode: item.code ? item.code : item.$$hashKey,
                                    biddingSectionName: item.biddingSectionName,
                                });
                            }
                            $scope.viewModel.supplierScopeList.push(supplierData);
                        },
                        afterAppend: function (supplierScopeList) {
                            $scope.viewModel.supplierScopeList = supplierScopeList;
                        },
                        isMonopolyEditable: false,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                    // 标段信息 
                    bidSectionInfoOpts: {
                        'scene': 'Draft',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaList: $scope.viewModel.stageAreaScopeList, 
                        resourceID: $scope.viewModel.resourceID,
                        //采购类别
                        catalogId: $scope.viewModel.purchaseOfImplement.purchaseCategoryCode,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingImplementApplication",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //使用项目
                    useProjectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseBase.useProjectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseBase.useProjectCode = project.projectCode;
                            $scope.viewModel.purchaseBase.useProjectName = project.projectName;
                            $scope.baseInfo.loadUseStageAreas(project.projectCode);
                        }
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message);
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error); }
                        }
                    },
                    urlGetChargeCompanyList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetChargeCompanyList?r=' + Math.random() + '&corporationCode=' + param.corporationCode);
                    },
                    urlGetCostCenterList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode);
                    },
                    urlGetStageAreasByProjectCode: function (param) {
                        return seagull2Url.getPlatformUrl('/ProjectInfo/GetStageAreasByProjectCode?r=' + Math.random() + '&projectCode=' + param.projectCode);
                    },
                    urlSaveSupplierLabelOptions: function () {
                        return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/PurchaseSaveSupplierLabelOptions?r=' + Math.random();
                    },
                    // 获取记账公司
                    getChargeCompanyList: function (param, done) {
                        $http({
                            method: 'GET',
                            url: $scope.api.urlGetChargeCompanyList(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                    // 获取成本中心
                    getCostCenterList: function (param, done) {
                        $http({
                            method: 'GET',
                            url: $scope.api.urlGetCostCenterList(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                    // 获取期区
                    getStageAreasByProjectCode: function (param, done) {
                        $http({
                            method: 'GET',
                            url: $scope.api.urlGetStageAreasByProjectCode(param),
                            data: param,
                        })
                            .success(function (data) { done(data); })
                            .error($scope.api.showErrorMessage);
                    },
                    // 保存标签
                    saveSupplierLabelOptions: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlSaveSupplierLabelOptions(),
                            data: param,
                        }).success(function (data) {
                            done(data);
                        }).error($scope.api.showErrorMessage);
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        $scope.viewModel.negativeList = {
                            confirm: $scope.viewModel.purchaseOfImplement.isReadAndAgree
                        };
                        this.setOpinionOpts($scope.opinionOpts.options);
                        // 显示审批
                        angular.forEach($scope.opinions, function (item, index) {
                            if (item.processId !== "InputOpinion") {
                                $scope.baseInfo.notAllOfInputOpinion = true;
                            }
                        });
                        // 开标要素
                        angular.forEach($scope.viewModel.openBiddingElementScopeList, function (item) {
                            angular.forEach($scope.viewModel.option.openBiddingElement, function (element) {
                                if (item.openBiddingElementCode === element.code) {
                                    element.checked = true;
                                }
                            });
                        });
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporation) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfImplement.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfImplement.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfImplement.costCenterCode = "";
                        $scope.viewModel.purchaseOfImplement.costCenterName = "";
                        var param = {
                            corporationCode: ''
                        };
                        for (var i = 0; i < corporation.length; i++) {
                            if (i === 0) { param.corporationCode = corporation[i].corporationCode; }
                            else { param.corporationCode += ',' + corporation[i].corporationCode; }
                        }
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        $scope.costCenter = [];
                        angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfImplement.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfImplement.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfImplement.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfImplement.chargeCompanyCode);
                            }
                        })
                    },
                    //加载成本中心
                    loadCostCenter: function (chargeCompanyCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.costCenter = [];
                        var param = {
                            chargeCompanyCode: chargeCompanyCode
                        };
                        $scope.api.getCostCenterList(param, function (data) {
                            $scope.viewModel.option.costCenter = data;
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.option.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfImplement.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfImplement.costCenterName = v.name;
                            }
                        })
                        $scope.refreshProcess();
                    },
                    // 设置是否需要缴纳保证金
                    setIsNeedPaymentDeposit: function (value) {
                        $scope.viewModel.purchaseOfImplement.isNeedPaymentDeposit = value;
                    },
                    // 设置是否示范区采购
                    setIsExampleArea: function (value) {
                        $scope.viewModel.purchaseOfImplement.isExampleArea = value;
                    },
                    // 设置是否使用招标清单
                    setIsUsedTenderFile: function (value) {
                        $scope.viewModel.purchaseBase.isUsedTenderFile = value;
                        $scope.settings.bidSectionInfoOpts.isUsedTenderFile = value;
                    },
                    // 开标要素
                    selectOpenBiddingElement: function (openBiddingElementItem) {
                        if (angular.isArray($scope.viewModel.option.openBiddingElement)) {
                            if (openBiddingElementItem.checked) {
                                var has = false;
                                for (var i = 0; i < $scope.viewModel.openBiddingElementScopeList.length; i++) {
                                    var item = $scope.viewModel.openBiddingElementScopeList[i];
                                    if (item.openBiddingElementCode === openBiddingElementItem.code) {
                                        has = true;
                                    }
                                }
                                if (has === false) {
                                    $scope.viewModel.openBiddingElementScopeList.push({
                                        openBiddingElementCode: openBiddingElementItem.code,
                                        openBiddingElementName: openBiddingElementItem.name
                                    });
                                }
                            }
                            else {
                                for (var i = $scope.viewModel.openBiddingElementScopeList.length - 1; i >= 0; i--) {
                                    if ($scope.viewModel.openBiddingElementScopeList[i].openBiddingElementCode === openBiddingElementItem.code) {
                                        $scope.viewModel.openBiddingElementScopeList.splice(i, 1);
                                    }
                                }
                            }
                        }
                    },
                    // 更新标段名称
                    biddingSectionInfoChange: function (newVal) {
                        angular.forEach(newVal, function (item) {
                            angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                                angular.forEach(supplier.biddingSectionScopeList, function (bid) {
                                    if (bid.biddingSectionCode === item.code || bid.biddingSectionCode === item.$$hashKey)
                                        bid.biddingSectionName = item.biddingSectionName;
                                });
                            });
                        });
                    },
                    // 采购类别选中下拉框数据变化
                    projectPurchaseCategoryChange: function () {
                        angular.forEach($scope.viewModel.option.projectPurchaseCategory, function (v) {
                            if ($scope.viewModel.purchaseOfImplement.purchaseCategoryCode === v.code) {
                                $scope.viewModel.purchaseOfImplement.purchaseCategoryName = v.name;
                                $scope.settings.bidSectionInfoOpts.catalogId = v.code;
                            }
                        });
                        $scope.refreshProcess();
                        $scope.baseInfo.setIsShowTenderFile();
                    }, 
                    // 合同价格形式选中下拉框数据变化
                    contractPriceTypeChange: function () {
                        angular.forEach($scope.viewModel.option.contractPriceType, function (v) {
                            if ($scope.viewModel.purchaseOfImplement.contractPriceTypeCode === v.code) {
                                $scope.viewModel.purchaseOfImplement.contractPriceTypeName = v.name;
                            }
                        });
                    },
                    // 计价方式选中下拉框数据变化
                    valuationWayChange: function () {
                        angular.forEach($scope.viewModel.option.valuationWay, function (v) {
                            if ($scope.viewModel.purchaseOfImplement.valuationWayCode === v.code) {
                                $scope.viewModel.purchaseOfImplement.valuationWayName = v.name;
                            }
                        })
                    },
                    // 本次采购成本目标变化
                    purchaseCostTargetAmountChange: function () {
                        $scope.refreshProcess();
                    },
                    // 加载使用期区
                    loadUseStageAreas: function (projectCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.useStageArea = [];
                        $scope.settings.contractAgreementOpts.useProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                        $scope.settings.contractAgreementOpts.useStageAreaCode = null;
                        $scope.viewModel.purchaseBase.useStageAreaCode = null;
                        $scope.viewModel.purchaseBase.useStageAreaName = null;
                        var param = {
                            projectCode: projectCode
                        };
                        $scope.api.getStageAreasByProjectCode(param, function (data) {
                            wfWaiting.hide();
                            if (data.error.length === 0) {
                                $scope.viewModel.option.useStageArea = data.areaList;
                            } else {
                                sogModal.openAlertDialog("提示信息", data.error);
                            }
                        });
                    },
                    // 使用期区选中下拉框数据变化
                    useStageAreaChange: function () {
                        $scope.viewModel.purchaseBase.useStageAreaName = '';
                        if (angular.isArray($scope.viewModel.option.useStageArea)) {
                            for (var i = 0; i < $scope.viewModel.option.useStageArea.length; i++) {
                                var v = $scope.viewModel.option.useStageArea[i];
                                if ($scope.viewModel.purchaseBase.useStageAreaCode === v.code) {
                                    $scope.viewModel.purchaseBase.useStageAreaName = v.name;
                                }
                            }
                        }
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.settings.contractAgreementOpts.useProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                        $scope.settings.contractAgreementOpts.useStageAreaCode = $scope.viewModel.purchaseBase.useStageAreaCode;
                        $scope.refreshProcess();
                    },
                    //记账公司
                    useChargeCompanyOpts: {
                        corporationName: $scope.viewModel.purchaseBase.useChargeCompanyName,
                        beforAppend: function (corporation) {
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = corporation.corporationCode;
                            $scope.viewModel.purchaseBase.useChargeCompanyName = corporation.corporationName;
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                            $scope.baseInfo.loadUseCostCenter($scope.viewModel.purchaseBase.useChargeCompanyCode);
                        }
                    },
                    //使用成本中心
                    loadUseCostCenter: function (chargeCompanyCode) {
                        if (chargeCompanyCode) {
                            $http.get(seagull2Url.getPlatformUrl("/Purchase/GetCostCenterList?chargeCompanyCode=" + chargeCompanyCode + "&isUseCostCenter=true"))
                                .success(function (data) {
                                    $scope.viewModel.option.useCostCenterList = data;
                                })
                        }
                    },
                    useCostCenterChange: function () {
                        angular.forEach($scope.viewModel.option.useCostCenterList, function (v) {
                            if ($scope.viewModel.purchaseBase.useCostCenterCode == v.code) {
                                $scope.viewModel.purchaseBase.useCostCenterCode = v.code;
                                $scope.viewModel.purchaseBase.useCostCenterName = v.name;
                            }
                        });
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.settings.contractAgreementOpts.useChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                        $scope.settings.contractAgreementOpts.useCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 3) {
                            $scope.refreshProcess();
                        }
                    },
                    //支出类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.settings.contractAgreementOpts.useProjectCode = null;
                        $scope.settings.contractAgreementOpts.useStageAreaCode = null;
                        $scope.settings.contractAgreementOpts.useChargeCompanyCode = null;
                        $scope.settings.contractAgreementOpts.useCostCenterCode = null;
                        $scope.settings.contractAgreementOpts.expenditureTypeCode = $scope.viewModel.purchaseBase.expenditureTypeCode;
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            sogModal.openAlertDialog("消息", "根据最新管理要求，事业部平台发生的四项类合同需要受预算管理与合约规划双控，请提前确认是否已编制相关预算事项，谢谢");
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.viewModel.purchaseBase.useStageAreaCode = "";
                            $scope.viewModel.purchaseBase.useStageAreaName = "";
                            $scope.settings.useProjectOpts.projectName = "";
                            $scope.viewModel.option.useStageArea = [];
                        } else if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = true;
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                            $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                            $scope.baseInfo.useChargeCompanyOpts.corporationName = "";
                            $scope.viewModel.option.useCostCenterList = [];
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                            $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.viewModel.purchaseBase.useStageAreaCode = null;
                            $scope.viewModel.purchaseBase.useStageAreaName = null;
                            $scope.settings.useProjectOpts.projectName = "";
                            $scope.baseInfo.useChargeCompanyOpts.corporationName = "";
                            $scope.viewModel.option.useCostCenterList = [];
                            $scope.viewModel.option.useStageArea = [];
                            $scope.refreshProcess();
                        }
                    },
                    //根据采购类别判断是否显示招标清单，显示-总包
                    setIsShowTenderFile: function () {
                        if ($scope.viewModel.purchaseOfImplement.purchaseCategoryCode == 1) {
                            $scope.isShowTenderFile = true;
                        } else {
                            $scope.isShowTenderFile = false;
                        }
                    }
                };
                $scope.baseInfo.setIsShowTenderFile();

                // 合约规划
                $scope.agreement = {
                    // 获取的合约数据格式化
                    dataFormat: function (data) {
                        var contractAgreementScope = {
                            projectCode: data.projectCode,
                            projectName: data.projectName,
                            stageAreaCode: data.stageAreaCode,
                            stageAreaName: data.stageAreaName,
                            contractAgreementCode: data.planContractCode,
                            contractAgreementName: data.planContractName,
                            contractAgreementTypeCode: data.contractPlanTypeCode,
                            contractAgreementTypeName: data.contractPlanTypeCnName,
                            costTargetAmount: data.costTarget,
                            costCourseName: "",
                            contractAgreementSplitInfoList: [],
                            isCostBelongStageArea: data.isCostBelongStageArea,
                            validStatus: true,
                        };
                        // 合约成本科目明细
                        if (angular.isArray(data.costCourseInfoController)) {
                            for (var i = 0; i < data.costCourseInfoController.length; i++) {
                                var item = data.costCourseInfoController[i];
                                var contractAgreementSplitInfo = {
                                    projectCode: data.projectCode,
                                    projectName: data.projectName,
                                    stageAreaCode: data.stageAreaCode,
                                    stageAreaName: data.stageAreaName,
                                    contractAgreementCode: data.planContractCode,
                                    contractAgreementName: data.planContractName,
                                    costCourseCode: item.costCourseCode,
                                    costCourseName: item.costCourseName,
                                    costCourseLevelCode: item.costCourseLevelCode,
                                    costTargetAmount: item.costTargetAmountWithTax,
                                };
                                contractAgreementScope.costCourseName += item.costCourseName + ";";
                                contractAgreementScope.contractAgreementSplitInfoList.push(contractAgreementSplitInfo);
                            }
                        }
                        // 被占用的合约
                        return contractAgreementScope;
                    },
                };

                // 自定义校验器-判断字符长度
                var stringMaxLengthValidator = (function () {
                    return function (maxlength, message) {
                        this.validateData = function (value, name, validationContext) {
                            if (value && value.length > maxlength) {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                // 自定义校验器-判断下拉框必填
                var RequiredSelectValidator = (function () {
                    return function (message) {
                        this.validateData = function (value, name, validationContext) {
                            if ((!value) || value.length === 0 || value === 0 || value === '0') {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    // var RangeValidator = ValidateHelper.getValidator('Range'); 
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '项目名称', attributeName: 'projectScopeList', validator: new RequiredValidator('请选择！') },
                        { key: '期区', attributeName: 'stageAreaScopeList', validator: new RequiredValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfImplement.chargeCompanyCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfImplement.costCenterCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '采购类别', attributeName: 'purchaseOfImplement.purchaseCategoryCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '地区', attributeName: 'purchaseOfImplement.cityInput', validator: new RequiredValidator('请选择！') },
                        { key: '建设地点', attributeName: 'purchaseOfImplement.buildDetailAddress', validator: new RequiredValidator('不能为空！') },
                        { key: '是否需要缴纳保证金', attributeName: 'purchaseOfImplement.isNeedPaymentDeposit', validator: new RequiredValidator('不能为空！') },
                        { key: '是否示范区采购', attributeName: 'purchaseOfImplement.isExampleArea', validator: new RequiredValidator('请选择！') },
                        { key: '合同价格形式', attributeName: 'purchaseOfImplement.contractPriceTypeCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '计价方式', attributeName: 'purchaseOfImplement.valuationWayCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '建筑面积', attributeName: 'purchaseOfImplement.buildingArea', validator: new RequiredValidator('不能为空！') },
                        { key: '本次招标范围和内容', attributeName: 'purchaseOfImplement.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次招标范围和内容', attributeName: 'purchaseOfImplement.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
                        { key: '付款方式', attributeName: 'purchaseOfImplement.paymentWayDescribe', validator: new RequiredValidator('不能为空！') },
                        { key: '付款方式', attributeName: 'purchaseOfImplement.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购负责人', attributeName: 'purchaseOfImplement.purchaseMainUser', validator: new RequiredSelectValidator('请选择！') },
                        { key: '商务负责人', attributeName: 'purchaseOfImplement.businessMainUser', validator: new RequiredSelectValidator('请选择！') },
                        { key: '技术负责人', attributeName: 'purchaseOfImplement.technologyMainUser', validator: new RequiredSelectValidator('请选择！') }

                    ]);
                    //   项目名称
                    if (angular.isArray($scope.viewModel.projectScopeList) === false
                        || $scope.viewModel.projectScopeList.length === 0) {
                        modelStateDictionary.addModelError('项目名称', '请选择！');
                    }
                    //  期区
                    if (angular.isArray($scope.viewModel.stageAreaScopeList) === false
                        || $scope.viewModel.stageAreaScopeList.length === 0) {
                        modelStateDictionary.addModelError('期区', '请选择！');
                    }
                    //  招标人
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0) {
                        modelStateDictionary.addModelError('招标人', '请选择！');
                    }
                    //  供应商类别
                    if (angular.isArray($scope.viewModel.industryDomainScope) === false
                        || $scope.viewModel.industryDomainScope.length === 0) {
                        modelStateDictionary.addModelError('供应商类别', '请选择！');
                    }
                    //  各供应商应缴纳保证金金额
                    if ($scope.viewModel.purchaseOfImplement.isNeedPaymentDeposit === true
                        && !$scope.viewModel.purchaseOfImplement.needPaymentDepositAmount) {
                        modelStateDictionary.addModelError('各供应商应缴纳保证金金额', '不能为空！');
                    }
                    //支出类型
                    if ($scope.viewModel.purchaseBase.expenditureTypeCode == null) {
                        modelStateDictionary.addModelError('支出类型', '请选择！');
                    }
                    if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                        if (!$scope.viewModel.purchaseBase.useProjectCode) {
                            modelStateDictionary.addModelError('使用项目', '请选择！');
                        }
                        if ($scope.viewModel.purchaseBase.useStageAreaCode === undefined || $scope.viewModel.purchaseBase.useStageAreaCode == null) {
                            modelStateDictionary.addModelError('使用期区', '请选择！');
                        }
                    }
                    if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                        if (!$scope.viewModel.purchaseBase.useChargeCompanyCode) {
                            modelStateDictionary.addModelError('使用记账公司', '请选择！');
                        }
                        if (!$scope.viewModel.purchaseBase.useCostCenterCode) {
                            modelStateDictionary.addModelError('使用成本中心', '请选择！');
                        }
                    }
                    // 采购时间安排
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行采购时间安排';
                            if (!v.inviteReplyDeadline) {
                                modelStateDictionary.addModelError("供应商回复截止时间", key + "不能为空!");
                            }
                            if (!v.questionDeadline) {
                                modelStateDictionary.addModelError("供应商提问截止时间", key + "不能为空!");
                            }
                            if (!v.replyDeadline) {
                                modelStateDictionary.addModelError("回标截止时间", key + "不能为空!");
                            }
                            if (!v.clearBinddingDeadline) {
                                modelStateDictionary.addModelError("清标时间", key + "不能为空!");
                            }
                            if (!v.evaluateBiddingDeadline) {
                                modelStateDictionary.addModelError("评标时间", key + "不能为空!");
                            }
                            if (!v.decideBiddingDeadline) {
                                modelStateDictionary.addModelError("定标时间", key + "不能为空!");
                            }
                        });
                    }
                    // 合约信息
                    if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false
                        || $scope.viewModel.contractAgreementScopeList.length === 0) {
                        modelStateDictionary.addModelError('合约规划', '请添加！');
                    }
                    //  标段信息
                    if (angular.isArray($scope.viewModel.biddingSectionInfoList) === false
                        || $scope.viewModel.biddingSectionInfoList.length === 0) {
                        modelStateDictionary.addModelError('标段信息', '请添加！');
                    }
                    // 入围供应商
                    if (angular.isArray($scope.viewModel.supplierScopeList) === false
                        || $scope.viewModel.supplierScopeList.length === 0) {
                        modelStateDictionary.addModelError('入围供应商', '请添加！');
                    }
		    
		            if ($scope.settings.supplierScopeOpts.model.industryDomainWithLabel) {
                        if (angular.isArray($scope.viewModel.supplierScopeList)) {
                            if ($scope.settings.supplierScopeOpts.model.emphasisIndustryDomainByLabel) {
                                for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                                    var item = $scope.viewModel.supplierScopeList[i];
                                    // 行业内档次
                                    if (!item.labelLC90037.labelText) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90037.labelTitle, '不能为空！');
                                    }
                                    // 经营模式
                                    if (!item.labelLC90024.labelText) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90024.labelTitle, '不能为空！');
                                    }
                                    // 公司直营
                                    if (item.labelLC90024OptionValue === 'OP90024001') {
                                        if (!item.labelLC90003.labelText) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90003.labelTitle, '不能为空！');
                                        }
                                    }
                                    // 经营承包（集体）
                                    else if (item.labelLC90024OptionValue === 'OP90024002') {
                                        if (!item.labelLC90019.labelText) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90019.labelTitle, '不能为空！');
                                        }
                                    }
                                    // 经营承包（个人）
                                    else if (item.labelLC90024OptionValue === 'OP90024003') {
                                        if (!item.labelLC90021.labelText) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90021.labelTitle, '不能为空！');
                                        }
                                    }
                                    // 代理商
                                    else if (item.labelLC90024OptionValue === 'OP90024004') {
                                        if (!item.labelLC90062.labelText) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90062.labelTitle, '不能为空！');
                                        }
                                    }
                                }
                            }
                            else {

                                for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                                    var item = $scope.viewModel.supplierScopeList[i];
                                    // 行业内档次
                                    if (!item.labelLC90037OptionValue) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90037.title, '请选择！');
                                    }
                                    // 经营模式
                                    if (!item.labelLC90024OptionValue) {
                                        modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90024.title, '请选择！');
                                    }
                                    // 公司直营
                                    if (item.labelLC90024OptionValue === 'OP90024001') {
                                        if (!item.labelLC90003.text) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90003.title, '不能为空！');
                                        }
                                    }
                                    // 经营承包（集体）
                                    else if (item.labelLC90024OptionValue === 'OP90024002') {
                                        if (!item.labelLC90019.text) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90019.title, '不能为空！');
                                        }
                                    }
                                    // 经营承包（个人）
                                    else if (item.labelLC90024OptionValue === 'OP90024003') {
                                        if (!item.labelLC90021.text) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90021.title, '不能为空！');
                                        }
                                    }
                                    // 代理商
                                    else if (item.labelLC90024OptionValue === 'OP90024004') {
                                        if (!item.labelLC90062.text) {
                                            modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90062.title, '不能为空！');
                                        }
                                    }
                                }
                            }
                        }
                    }
		    
                    // 负面清单
                    if ($scope.viewModel.negativeList.confirm !== true) {
                        modelStateDictionary.addModelError('负面清单-我已阅读并知悉相关要求', '请确认！');
                    }
                    // 审批流
                    if (angular.isArray($scope.opinionOpts.options) === false
                        || $scope.opinionOpts.options.length === 0) {
                        modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次招标范围和内容', attributeName: 'purchaseOfImplement.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
                        { key: '付款方式', attributeName: 'purchaseOfImplement.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);
                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    if ($scope.viewModel.purchaseOfImplement.cityInput) {
                        model.purchaseOfImplement.fullPathId = $scope.viewModel.purchaseOfImplement.cityInput.fullPathId;
                        model.purchaseOfImplement.fullPathName = $scope.viewModel.purchaseOfImplement.cityInput.fullPathName;
                    }
                    if ($scope.viewModel.negativeList) {
                        model.purchaseOfImplement.isReadAndAgree = $scope.viewModel.negativeList.confirm;
                    }
                    model.option = null;
                    return model;
                }
		
		      // 保存标签
                function saveLabel(func) {
                    if (!$scope.settings.supplierScopeOpts.model.industryDomainWithLabel) {
                        func();
                        return;
                    }
                    if ($scope.settings.supplierScopeOpts.model.emphasisIndustryDomainByLabel === true) {
                        func();
                        return;
                    }
                    wfWaiting.show();
                    if (angular.isArray($scope.viewModel.supplierScopeList) === false) { return; }
                    var saveData = [];
                    for (var i = 0; i < $scope.viewModel.supplierScopeList.length; i++) {
                        var item = $scope.viewModel.supplierScopeList[i];
                        if (item.labelTemplate) {

                            // 公司直营 
                            if (item.labelLC90024Value === 'OP90024001') {
                                // item.labelLC90003.text = null;
                                item.labelLC90019.text = null;
                                item.labelLC90021.text = null;
                                item.labelLC90062.text = null;
                            }
                            // 经营承包（集体） 
                            else if (item.labelLC90024Value === 'OP90024002') {
                                item.labelLC90003.text = null;
                                // item.labelLC90019.text = null;
                                item.labelLC90021.text = null;
                                item.labelLC90062.text = null;
                            }
                            // 经营承包（个人）
                            else if (item.labelLC90024Value === 'OP90024003') {
                                item.labelLC90003.text = null;
                                item.labelLC90019.text = null;
                                //item.labelLC90021.text = null;
                                item.labelLC90062.text = null;
                            }
                            // 代理商
                            else if (item.labelLC90024Value === 'OP90024004') {
                                item.labelLC90003.text = null;
                                item.labelLC90019.text = null;
                                item.labelLC90021.text = null;
                                //item.labelLC90062.text = null;
                            }
                            saveData.push(item.labelTemplate);
                        }
                    }
                    if (saveData.length === 0) {
                        func();
                        return;
                    }
                    $scope.api.saveSupplierLabelOptions(saveData, function (saveResult) {
                        if (!saveResult) {
                            sogModal.openAlertDialog("保存提示", "保存标签失败！");
                            return;
                        }
                        wfWaiting.hide();
                        if (saveResult.result === true) {
                            func();
                        }
                        // 保存失败
                        else {
                            $scope.opts.saved = false;
                            // 发生错误
                            if (saveResult.error) {
                                sogModal.openErrorDialog(saveResult.error);
                            }
                            // 后台验证不通过
                            else {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', saveResult.validInfo)
                                sogValidator.broadcastResult(saveResult.validInfo);
                            }
                        }
                    });
                };
		
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
                            saveLabel(function () { defer.resolve(getCleanModel()); });
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
                            saveLabel(function () { defer.resolve(getCleanModel()); });
                        }
                    } else {
                            saveLabel(function () { defer.resolve(getCleanModel()); });
                    }
                };
                $scope.$watch('viewModel.biddingSectionInfoList', $scope.baseInfo.biddingSectionInfoChange, true);
                window.onstorage = function () {
                    var supplierList = locals.getObject('addSupplier');
                    if (supplierList && supplierList.length > 0) {
                        $timeout(function () {
                            $scope.viewModel.supplierScopeList = supplierList;
                        }, 0)
                    }
                }
                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        ProjectScopeList: $scope.viewModel.projectScopeList,
                        StageAreaScopeList: $scope.viewModel.stageAreaScopeList,
                        PurchaseCostTargetAmount: $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount,
                        CostCenterCode: $scope.viewModel.purchaseOfImplement.costCenterCode,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                        IsUseProject: $scope.viewModel.isUseProject,
                        UseProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        UseStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        UseCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                    };
                    if ((param.ProjectScopeList && param.CostCenterCode) || param.UseProjectCode || param.UseCostCenterCode) {
                        //改成传页面对象
                        $scope.sendPefreshRequest($scope.viewModel);
                    }
                };
                $scope.sendPefreshRequest = function (param) {
                    if ($scope.baseInfo.refreshCount > 200) { return; }
                    if ($scope.baseInfo.refreshing === true) {
                        $scope.baseInfo.refreshCount++;
                        setTimeout(function () { $scope.sendPefreshRequest(param); }, 500);
                    }
                    else {
                        $scope.baseInfo.refreshCount = 0;
                        $scope.baseInfo.refreshing = true;
                        wfOperate.refreshProcess('/BiddingImplementApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                }

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                    $scope.viewModel.isNeedContract = data.viewModel.isNeedContract;
                    // 从合约汇总成本目标切换到填写成本目标时，需要把合约汇总数清空
                    if ($scope.viewModel.isNeedAgreement === true
                        && data.viewModel.isNeedAgreement === false) {
                        $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = 0;
                    }
                    else if ($scope.viewModel.isNeedAgreement === false
                        && data.viewModel.isNeedAgreement === true) {
                        $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = 0;
                        angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                            $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount += agreement.costTargetAmount;
                        });
                    }
                    $scope.viewModel.isNeedAgreement = data.viewModel.isNeedAgreement;


                    $scope.baseInfo.refreshing = false;
                    if ($scope.baseInfo.refreshCount > 0) { wfWaiting.show(); }
                });

                $scope.baseInfo.init();
            }
        ]);
    });