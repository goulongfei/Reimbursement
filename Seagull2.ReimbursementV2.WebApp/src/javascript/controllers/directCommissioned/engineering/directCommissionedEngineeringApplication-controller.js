define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierCategoryExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        'contractExtend',
        'supplierInfoExtendV4',
        'stageAreaExtend',
    ],
    function (app) {
        app.controller('directCommissionedEngineeringApplication_controller', [
            '$scope', 'viewData', '$rootScope', '$http',
            'wfOperate', 'seagull2Url',
            'wfWaiting', 'sogModal', 'sogOguType', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            'regionType', 'regionShowStyle',
            function ($scope, viewData, $rootScope, $http,
                wfOperate, seagull2Url,
                wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator,
                sogWfControlOperationType,
                regionType, regionShowStyle) {
                angular.extend($scope, viewData);
                $scope.sceneId = 'Draft';
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（工程采购类）';
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                $scope.tradeCatagoryCodeList = [];
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 直接委托说明 附件设置项
                $scope.manualFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
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
                // 设置 
                $scope.settings = {
                    manualFileRequiredState: true,
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
                            if (angular.isArray($scope.viewModel.corporationScopeList) === false || $scope.viewModel.corporationScopeList.length === 0) {
                                $scope.viewModel.corporationScopeList = [{}];
                            }
                            $scope.viewModel.corporationScopeList[0].corporationCode = corporation.corporationCode;
                            $scope.viewModel.corporationScopeList[0].corporationName = corporation.corporationName;
                            $scope.baseInfo.loadChargeCompany(corporation.corporationCode);
                        }
                    },
                    //项目
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfEngineering.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfEngineering.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfEngineering.projectName = project.projectName;
                            $scope.viewModel.purchaseOfEngineering.stageAreaCode = null;
                            $scope.viewModel.purchaseOfEngineering.stageAreaName = null;
                            $scope.viewModel.stageAreaScopeList = [];
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount = 0;
                            $scope.viewModel.purchaseDelegationInfoList[0].supplierCode = null;
                            $scope.viewModel.purchaseDelegationInfoList[0].supplierName = null;
                            $scope.viewModel.purchaseDelegationInfoList[0].industryDomainCode = null;
                            $scope.viewModel.purchaseDelegationInfoList[0].industryDomainName = null;
                            $scope.viewModel.purchaseDelegationInfoList[0].strategyPurchaseAgreementInfoCode = null;
                            $scope.viewModel.purchaseDelegationInfoList[0].strategyPurchaseAgreementInfoName = null;

                            $scope.settings.contractAgreementOpts.projectList = [{ projectCode: project.projectCode, projectName: project.projectName }];
                            $scope.settings.contractAgreementOpts.projectCode = project.projectCode;
                            $scope.settings.contractAgreementOpts.projectName = project.projectName;
                            $scope.settings.contractAgreementOpts.stageAreaCode = null;
                            $scope.settings.contractAgreementOpts.stageAreaName = null;
                            $scope.settings.contractAgreementOpts.stageAreaList = [];

                            $scope.settings.stageAreaOpts.projectList = [{ projectCode: project.projectCode, projectName: project.projectName }];
                            $scope.settings.stageAreaOpts.stageAreaName = "";

                            $scope.settings.delegationOpts.project = {
                                projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                                projectName: $scope.viewModel.purchaseOfEngineering.projectName
                            };

                            wfWaiting.show();
                            var param = [project.projectCode];
                            $scope.api.projectIsAllowMultipleAreaAgreement(param, function (data) {
                                wfWaiting.hide();
                                $scope.viewModel.isAllowMultipleAreaAgreement = data.isAllowMultipleAreaAgreement;
                                $scope.settings.contractAgreementOpts.multipleSelect = data.isAllowMultipleAreaAgreement;
                                if ($scope.viewModel.isAllowMultipleAreaAgreement === false) {
                                    $scope.baseInfo.loadStageAreas(project.projectCode);
                                }
                            });

                            $scope.viewModel.purchaseOfEngineering.project = project;
                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                                && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                $scope.viewModel.purchaseDelegationInfoList[0].project = project;
                            }
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
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount = 0;
                            $scope.refreshProcess();
                        }
                    },
                    // 行业领域
                    tradeCatagoryOpts: {
                        beforAppend: function (tradeCatagory) {
                            for (var i = 0; i < tradeCatagory.length; i++) {
                                var item = tradeCatagory[i];
                                $scope.tradeCatagoryCodeList.push(item.code)
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
                    // 委托信息  
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'isNeedContract': $scope.viewModel.isNeedContract,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'contractAgreementScopeForPurchaseDelegation': [],
                        'industryDomainScopeList': $scope.viewModel.industryDomainScope,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                            projectName: $scope.viewModel.purchaseOfEngineering.projectName
                        },
                        'blackList': ['reason', 'project', 'supplierCatagory', 'delegationAmount'],
                        'tinyAmount': 100000,
                        'reason': $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode,
                        'supplierCatagory': $scope.viewModel.purchaseOfEngineering.industryDomainScope,
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                        projectName: $scope.viewModel.purchaseOfEngineering.projectName,
                        stageAreaCode: $scope.viewModel.purchaseOfEngineering.stageAreaCode,
                        stageAreaName: $scope.viewModel.purchaseOfEngineering.stageAreaName,
                        useProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        useStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        useChargeCompanyCode: $scope.viewModel.purchaseBase.useChargeCompanyCode,
                        useCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                        expenditureTypeCode: $scope.viewModel.purchaseBase.expenditureTypeCode,
                        isShowExpenditureType: $scope.viewModel.isShowExpenditureType,
                        businessType : "工程采购类",
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaList: $scope.viewModel.stageAreaScopeList,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        beforAppend: function (v) {
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                $scope.viewModel.contractAgreementScopeList = [];
                            }
                            var myContract = $scope.agreement.dataFormat(v); // 格式化到视图 
                            var isSelected = false;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                    var message = "合约[" + myContract.contractAgreementName + "]已选择！";
                                    sogModal.openAlertDialog("提示", message);
                                    isSelected = true;
                                    return;
                                }
                                if ((myContract.contractAgreementTypeCode == "7" || c.contractAgreementTypeCode == "7") && c.contractAgreementTypeCode != myContract.contractAgreementTypeCode) {
                                    var message = "一个采购单据不可同时选择营销合约与四项合约，可选择多条营销合约或多条四项合约！";
                                    sogModal.openAlertDialog("提示", message);
                                    isSelected = true;
                                    return;
                                }
                            });
                            if (!isSelected) {
                                $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount += myContract.costTargetAmount;
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                            };
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount = 0;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount += agreement.costTargetAmount;
                            });
                        },
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
                //判断如果选战采、集采时，直接委托说明附件为非必填
                if ($scope.viewModel.purchaseOfEngineering.directDelegationReasonCode == 4 || $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode == 5 || $scope.viewModel.isStrategyIndustryDomain) {
                    $scope.settings.manualFileRequiredState = false;
                }

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () { });
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
                    urlProjectIsAllowMultipleAreaAgreement: function (param) {
                        return seagull2Url.getPlatformUrl('/ProjectInfo/ProjectIsAllowMultipleAreaAgreement?r=' + Math.random());
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
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
                    },
                    // 项目是否允许跨期区合约签订合同
                    projectIsAllowMultipleAreaAgreement: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlProjectIsAllowMultipleAreaAgreement(param),
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
                    init: function () {

                        $scope.viewModel.negativeList = {
                            confirm: $scope.viewModel.purchaseOfEngineering.isReadAndAgree
                        };
                        this.setOpinionOpts($scope.opinionOpts.options);
                        $scope.viewModel.purchaseOfEngineering.project = {
                            projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                            projectName: $scope.viewModel.purchaseOfEngineering.projectName
                        };
                        if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                            && $scope.viewModel.purchaseDelegationInfoList.length > 0
                            && $scope.viewModel.purchaseOfEngineering.projectCode) {
                            $scope.viewModel.purchaseDelegationInfoList[0].project = $scope.viewModel.purchaseOfEngineering.project;
                        }
                        angular.forEach($scope.opinions, function (item, index) {
                            if (item.processId !== "InputOpinion") {
                                $scope.baseInfo.notAllOfInputOpinion = true;
                            }
                        });
                        if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                            && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                            $scope.viewModel.purchaseDelegationInfoList[0].priceFile = $scope.viewModel.priceFile;
                            $scope.viewModel.purchaseDelegationInfoList[0].project = $scope.viewModel.purchaseOfEngineering.project;
                        }
                        // 可以跨期区合约签订合同
                        if ($scope.viewModel.purchaseOfEngineering.projectCode) {
                            wfWaiting.show();
                            var param = [$scope.viewModel.purchaseOfEngineering.projectCode];
                            $scope.api.projectIsAllowMultipleAreaAgreement(param, function (data) {
                                wfWaiting.hide();
                                $scope.viewModel.isAllowMultipleAreaAgreement = data.isAllowMultipleAreaAgreement;
                                $scope.settings.contractAgreementOpts.multipleSelect = data.isAllowMultipleAreaAgreement;
                            });
                        }
                        $scope.refreshProcess();
                    },
                    notAllOfInputOpinion: false,
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfEngineering.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfEngineering.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfEngineering.costCenterCode = "";
                        $scope.viewModel.purchaseOfEngineering.costCenterName = "";
                        var param = {
                            corporationCode: corporationCode
                        };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        $scope.costCenter = [];
                        angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfEngineering.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfEngineering.chargeCompanyCode);
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
                            if ($scope.viewModel.purchaseOfEngineering.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.costCenterName = v.name;
                            }
                        })
                    },
                    // 加载期区
                    loadStageAreas: function (projectCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.stageArea = [];
                        var param = {
                            projectCode: projectCode
                        };
                        $scope.api.getStageAreasByProjectCode(param, function (data) {
                            wfWaiting.hide();
                            if (data.error.length === 0) {
                                $scope.viewModel.option.stageArea = data.areaList;
                            } else {
                                sogModal.openAlertDialog("提示信息", data.error);
                            }
                        });
                    },
                    // 期区选中下拉框数据变化
                    stageAreaChange: function () {
                        $scope.viewModel.purchaseOfEngineering.stageAreaName = '';
                        if (angular.isArray($scope.viewModel.option.stageArea)) {
                            for (var i = 0; i < $scope.viewModel.option.stageArea.length; i++) {
                                var v = $scope.viewModel.option.stageArea[i];
                                if ($scope.viewModel.purchaseOfEngineering.stageAreaCode === v.code) {
                                    $scope.viewModel.purchaseOfEngineering.stageAreaName = v.name;
                                }
                            }
                        }
                        $scope.settings.contractAgreementOpts.stageAreaCode = $scope.viewModel.purchaseOfEngineering.stageAreaCode;
                        $scope.settings.contractAgreementOpts.stageAreaName = $scope.viewModel.purchaseOfEngineering.stageAreaName;
                        $scope.viewModel.contractAgreementScopeList = [];
                        var stageAreaList = [{
                            projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                            projectName: $scope.viewModel.purchaseOfEngineering.projectName,
                            stageAreaCode: $scope.viewModel.purchaseOfEngineering.stageAreaCode,
                            stageAreaName: $scope.viewModel.purchaseOfEngineering.stageAreaName,
                        }];
                        //给期区表同步
                        $scope.viewModel.stageAreaScopeList = stageAreaList;
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount = 0;

                        $scope.refreshProcess();
                    },
                    // 采购类别选中下拉框数据变化
                    projectPurchaseCategoryChange: function () {
                        angular.forEach($scope.viewModel.option.projectPurchaseCategory, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.purchaseCategoryCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.purchaseCategoryName = v.name;
                            }
                        });
                        $scope.refreshProcess();
                    },
                    // 直接委托理由选中下拉框数据变化
                    directDelegationReasonChange: function (newVal, oldVal) {
                        if (newVal == oldVal) { return; }
                        angular.forEach($scope.viewModel.option.directDelegationReason, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.directDelegationReasonCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.directDelegationReasonName = v.name;
                            }
                        });
                        //判断如果选战采、集采时，直接委托说明附件为非必填
                        if ($scope.viewModel.purchaseOfEngineering.directDelegationReasonCode == 4 || $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode == 5 || $scope.viewModel.isStrategyIndustryDomain) {
                            $scope.settings.manualFileRequiredState = false;
                        } else {
                            $scope.settings.manualFileRequiredState = true;
                        }
                        if ($scope.viewModel.purchaseOfEngineering.directDelegationReasonCode) {
                            $scope.settings.delegationOpts.reason = $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode;
                        } else {
                            $scope.settings.delegationOpts.reason = null;
                        }
                        if (newVal !== oldVal && newVal === 1) {
                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                                && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                $scope.viewModel.purchaseDelegationInfoList[0].supplierCode = '';
                                $scope.viewModel.purchaseDelegationInfoList[0].supplierName = '';
                                $scope.viewModel.purchaseDelegationInfoList[0].industryDomainCode = '';
                                $scope.viewModel.purchaseDelegationInfoList[0].industryDomainName = '';
                                $scope.viewModel.purchaseDelegationInfoList[0].strategyPurchaseAgreementInfoCode = '';
                                $scope.viewModel.purchaseDelegationInfoList[0].strategyPurchaseAgreementInfoName = '';
                            }
                        }
                        $scope.refreshProcess();
                    },
                    // 供应商类别选中数据变化
                    industryDomainScopeReasonChange: function (newVal, oldVal) {
                        if (newVal == oldVal) { return; }
                        $scope.refreshProcess();
                    },
                    // 质量标准选中下拉框数据变化
                    qualityStandardChange: function () {
                        angular.forEach($scope.viewModel.option.qualityStandard, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.qualityStandardCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.qualityStandardName = v.name;
                            }
                        })
                    },
                    // 合约分类选中下拉框数据变化
                    contractAgreementTypeChange: function () {
                        angular.forEach($scope.viewModel.option.contractAgreementType, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.contractAgreementTypeName = v.name;
                            }
                        });
                        if ($scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 1 || $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 2 || $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 3) {
                            $scope.viewModel.isNeedAgreement = true;
                        } else {
                            $scope.viewModel.isNeedAgreement = false;
                        }
                        if ($scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 1 || $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 2 || $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 3 || $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode == 7) {
                            $scope.viewModel.isShowExpenditureType = true;
                            $scope.settings.contractAgreementOpts.isShowExpenditureType = true;
                        } else {
                            $scope.viewModel.isShowExpenditureType = false;
                            $scope.settings.contractAgreementOpts.isShowExpenditureType = false;
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.purchaseBase.expenditureTypeCode = null;
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
                        }
                        $scope.refreshProcess();
                    },
                    // 合同价格形式选中下拉框数据变化
                    contractPriceTypeChange: function () {
                        angular.forEach($scope.viewModel.option.contractPriceType, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.contractPriceTypeCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.contractPriceTypeName = v.name;
                            }
                        });
                        $scope.refreshProcess();
                    },
                    // 计价方式选中下拉框数据变化
                    valuationWayChange: function () {
                        angular.forEach($scope.viewModel.option.valuationWay, function (v) {
                            if ($scope.viewModel.purchaseOfEngineering.valuationWayCode === v.code) {
                                $scope.viewModel.purchaseOfEngineering.valuationWayName = v.name;
                            }
                        })
                    },
                    // 设置是否示范区采购
                    setIsExampleArea: function (value) {
                        $scope.viewModel.purchaseOfEngineering.isExampleArea = value;
                    },
                    // 本次直接委托金额变更
                    purchaseAmountChange: function (newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }
                        $scope.refreshProcess();
                    },
                    // 合约负责人
                    businessMainUserChange: function (newValue, oldValue) {
                        if ((newValue) && newValue != oldValue) {
                            $scope.viewModel.purchaseOfEngineering.businessMainUserCode = newValue.id;
                            $scope.viewModel.purchaseOfEngineering.businessMainUserName = newValue.displayName;
                            $scope.refreshProcess();
                        }
                    },
                    // 供应商类别变更
                    industryDomainChange: function (newVal, oldVal) {
                        if (newVal) {
                            $scope.settings.delegationOpts.supplierCatagory = newVal;
                        } else {
                            $scope.settings.delegationOpts.supplierCatagory = null;
                        }
                        if (newVal !== oldVal) {
                            $scope.refreshProcess();
                            if (angular.isArray(newVal)
                                && angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                                && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                var isInclude = false;
                                for (var i = 0; i < newVal.length; i++) {
                                    if ($scope.viewModel.purchaseDelegationInfoList[0].industryDomainCode === newVal[i].industryDomainCode) {
                                        isInclude = true;
                                    }
                                }
                                if (isInclude === false) {
                                    $scope.viewModel.purchaseDelegationInfoList[0].supplierCode = '';
                                    $scope.viewModel.purchaseDelegationInfoList[0].supplierName = '';
                                    $scope.viewModel.purchaseDelegationInfoList[0].industryDomainCode = '';
                                    $scope.viewModel.purchaseDelegationInfoList[0].industryDomainName = '';
                                    $scope.viewModel.purchaseDelegationInfoList[0].strategyPurchaseAgreementInfoCode = '';
                                    $scope.viewModel.purchaseDelegationInfoList[0].strategyPurchaseAgreementInfoName = '';
                                }
                            }
                        }
                    },
                    // 加载使用期区
                    loadUseStageAreas: function (projectCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.useStageArea = [];
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
                        $scope.settings.contractAgreementOpts.useProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                        $scope.settings.contractAgreementOpts.useStageAreaCode = $scope.viewModel.purchaseBase.useStageAreaCode;
                        $scope.viewModel.contractAgreementScopeList = [];
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
                };

                // 合约规划
                $scope.agreement = {
                    // 获取的合约数据格式化
                    dataFormat: function (data) {
                        var contractAgreementSplitInfos = [];
                        // 合约成本科目明细
                        if (angular.isArray(data.costCourseInfoController)) {
                            for (var i = 0; i < data.costCourseInfoController.length; i++) {
                                var item = data.costCourseInfoController[i];
                                var contractAgreementSplitInfo = {
                                    projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                                    projectName: $scope.viewModel.purchaseOfEngineering.projectName,
                                    stageAreaCode: data.stageAreaCode,
                                    stageAreaName: data.stageAreaName,
                                    contractAgreementCode: data.planContractCode,
                                    contractAgreementName: data.planContractName,
                                    costCourseCode: item.costCourseCode,
                                    costCourseName: item.costCourseName,
                                    costCourseLevelCode: item.costCourseLevelCode,
                                    costTargetAmount: item.costTargetAmountWithTax,
                                };
                                contractAgreementSplitInfos.push(contractAgreementSplitInfo);
                            }
                        }
                        // 被占用的合约
                        return contractAgreementScope = {
                            projectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                            projectName: $scope.viewModel.purchaseOfEngineering.projectName,
                            stageAreaCode: data.stageAreaCode,
                            stageAreaName: data.stageAreaName,
                            contractAgreementCode: data.planContractCode,
                            contractAgreementName: data.planContractName,
                            contractAgreementTypeCode: data.contractPlanTypeCode,
                            contractAgreementTypeName: data.contractPlanTypeCnName,
                            costTargetAmount: data.costTarget,
                            contractAgreementSplitInfoList: contractAgreementSplitInfos,
                            isCostBelongStageArea: data.isCostBelongStageArea,
                            validStatus: true,
                        };
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
                        { key: '记账公司', attributeName: 'purchaseOfEngineering.chargeCompanyCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfEngineering.costCenterCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '项目名称', attributeName: 'purchaseOfEngineering.projectCode', validator: new RequiredValidator('请选择！') },
                        { key: '采购类别', attributeName: 'purchaseOfEngineering.purchaseCategoryCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '是否示范区采购', attributeName: 'purchaseOfEngineering.isExampleArea', validator: new RequiredValidator('请选择！') },
                        { key: '地区', attributeName: 'purchaseOfEngineering.cityInput', validator: new RequiredValidator('请选择！') },
                        { key: '建设地点', attributeName: 'purchaseOfEngineering.buildDetailAddress', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfEngineering.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfEngineering.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
                        { key: '本次直接委托金额', attributeName: 'purchaseBase.purchaseAmount', validator: new RequiredValidator('不能为空！') },
                        { key: '直接委托理由', attributeName: 'purchaseOfEngineering.directDelegationReasonCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '建筑面积', attributeName: 'purchaseOfEngineering.buildingArea', validator: new RequiredValidator('不能为空！') },
                        { key: '拟开工日期', attributeName: 'purchaseOfEngineering.preOpenDate', validator: new RequiredValidator('不能为空！') },
                        { key: '拟竣工日期', attributeName: 'purchaseOfEngineering.preCompletedDate', validator: new RequiredValidator('不能为空！') },
                        { key: '质量标准', attributeName: 'purchaseOfEngineering.qualityStandardCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '合约分类', attributeName: 'purchaseOfEngineering.contractAgreementTypeCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '合同价格形式', attributeName: 'purchaseOfEngineering.contractPriceTypeCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '计价方式', attributeName: 'purchaseOfEngineering.valuationWayCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '付款方式描述', attributeName: 'purchaseOfEngineering.paymentWayDescribe', validator: new RequiredValidator('不能为空！') },
                        { key: '付款方式描述', attributeName: 'purchaseOfEngineering.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '合约负责人', attributeName: 'purchaseOfEngineering.businessMainUser', validator: new RequiredValidator('不能为空！') },
                        { key: '合约规划', attributeName: 'contractAgreementScopeList', validator: new RequiredValidator('请选择！') }
                    ]);
                    if ($scope.viewModel.isAllowMultipleAreaAgreement === true) {
                        if (angular.isArray($scope.viewModel.stageAreaScopeList) === false
                            || $scope.viewModel.stageAreaScopeList.length === 0) {
                            modelStateDictionary.addModelError('期区', '请选择！');
                        }
                    }
                    else {
                        var stageAreaCode = $scope.viewModel.purchaseOfEngineering.stageAreaCode;
                        if (stageAreaCode === undefined || stageAreaCode === null || stageAreaCode === '0') {
                            modelStateDictionary.addModelError('期区', '请选择！');
                        }
                    }
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '请选择！');
                    }
                    //支出类型
                    if ($scope.viewModel.isShowExpenditureType) {
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
                    }
                    // 供应商类别
                    if (angular.isArray($scope.viewModel.industryDomainScope) === false || $scope.viewModel.industryDomainScope.length === 0) {
                        modelStateDictionary.addModelError('供应商类别', '请选择！');
                    }
                    if (($scope.viewModel.purchaseOfEngineering.preOpenDate)
                        && ($scope.viewModel.purchaseOfEngineering.preCompletedDate)) {
                        if ($scope.viewModel.purchaseOfEngineering.preCompletedDate <= $scope.viewModel.purchaseOfEngineering.preOpenDate) {
                            modelStateDictionary.addModelError('拟竣工日期', '拟竣工日期必须大于拟开工日期！');
                        }
                    }
                    if ($scope.viewModel.isStrategyIndustryDomain === true
                        && $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode !== 4) {
                        modelStateDictionary.addModelError('直接委托理由', '因供应商类别中包含战采限定类别，必须选择战略采购!');
                    }
                    if ($scope.viewModel.isNeedAgreement === true) {
                        // 合约信息
                        if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false
                            || $scope.viewModel.contractAgreementScopeList.length === 0) {
                            modelStateDictionary.addModelError('合约规划', '请选择！');
                        }
                    }
                    if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                        && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                        $scope.viewModel.priceFile = $scope.viewModel.purchaseDelegationInfoList[0].priceFile;
                    }
                    // 委托信息
                    if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)) {
                        // 校验合同经办人是否为空
                        if ($scope.viewModel.purchaseDelegationInfoList.length === 0) {
                            modelStateDictionary.addModelError('委托信息', '不能为空!');
                        }
                        for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                            var item = $scope.viewModel.purchaseDelegationInfoList[i];
                            var rowKey = "委托信息第" + (i + 1) + "行";
                            if (!item.delegationAmount || item.delegationAmount <= 0) {
                                modelStateDictionary.addModelError(rowKey + '，直接委托金额(元)', '直接委托金额(元)必须大于零!');
                            }
                            var required = ValidateHelper.validateData(item, [
                                { key: rowKey + '，直接委托供应商', attributeName: 'supplierCode', validator: [new RequiredValidator("请选择！")] }
                            ]);
                            modelStateDictionary.merge(required);
                            if ($scope.viewModel.purchaseOfEngineering.directDelegationReasonCode === 4) {
                                var required = ValidateHelper.validateData(item, [
                                    { key: rowKey + '，关联的战采协议', attributeName: 'strategyPurchaseAgreementInfoCode', validator: [new RequiredValidator("请选择！")] }
                                ]);
                                modelStateDictionary.merge(required);
                            }
                            if ($scope.viewModel.isNeedAgreement === false
                                && $scope.viewModel.isNeedContract === false) {
                                if (!item.flagContract || !item.flagContract.contractCode) {
                                    modelStateDictionary.addModelError(rowKey + '，所属合同', '请选择!');
                                }
                                // 认价单
                                var priceFileUploaded = false;
                                if ($scope.viewModel.priceFile && angular.isArray($scope.viewModel.priceFile)) {
                                    for (var i = 0; i < $scope.viewModel.priceFile.length; i++) {
                                        var item = $scope.viewModel.priceFile[i];
                                        if (item.uploaded === true && item.isDeleted !== true) {
                                            priceFileUploaded = true;
                                        }
                                    }
                                }
                                if (priceFileUploaded === false) {
                                    modelStateDictionary.addModelError(rowKey + '，认价单', '请上传！');
                                }
                            }
                        }
                    }
                    else {
                        modelStateDictionary.addModelError('委托信息', '不能为空!');
                    }
                    // 负面清单
                    if ($scope.viewModel.negativeList.confirm !== true) {
                        modelStateDictionary.addModelError('负面清单-我已阅读并知悉相关要求', '请确认！');
                    }
                    // 直接委托报告
                    var reportFileUploaded = false;
                    if ($scope.viewModel.reportFile && angular.isArray($scope.viewModel.reportFile)) {
                        for (var i = 0; i < $scope.viewModel.reportFile.length; i++) {
                            var item = $scope.viewModel.reportFile[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                reportFileUploaded = true;
                            }
                        }
                    }
                    if (reportFileUploaded === false) {
                        modelStateDictionary.addModelError('直接委托报告', '请上传！');
                    }
                    // 直接委托说明
                    var manualFileUploaded = false;
                    if ($scope.viewModel.manualFile && angular.isArray($scope.viewModel.manualFile)) {
                        for (var i = 0; i < $scope.viewModel.manualFile.length; i++) {
                            var item = $scope.viewModel.manualFile[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                manualFileUploaded = true;
                            }
                        }
                    }
                    if (manualFileUploaded === false && $scope.settings.manualFileRequiredState) {
                        modelStateDictionary.addModelError('直接委托说明', '请上传！');
                    }

                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfEngineering.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '付款方式描述', attributeName: 'purchaseOfEngineering.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") }
                    ]);
                    if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                        && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                        $scope.viewModel.priceFile = $scope.viewModel.purchaseDelegationInfoList[0].priceFile;
                    }
                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    if ($scope.viewModel.purchaseOfEngineering.cityInput) {
                        model.purchaseOfEngineering.fullPathId = $scope.viewModel.purchaseOfEngineering.cityInput.fullPathId;
                        model.purchaseOfEngineering.fullPathName = $scope.viewModel.purchaseOfEngineering.cityInput.fullPathName;
                    }
                    if ($scope.viewModel.negativeList) {
                        model.purchaseOfEngineering.isReadAndAgree = $scope.viewModel.negativeList.confirm;
                    }
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
                $scope.$watch('viewModel.purchaseOfEngineering.businessMainUser', $scope.baseInfo.businessMainUserChange);
                //$scope.$watch('viewModel.purchaseOfEngineering.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.industryDomainScope', $scope.baseInfo.industryDomainChange, true);
                $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);
                $scope.$watch('viewModel.purchaseOfEngineering.directDelegationReasonCode', $scope.baseInfo.directDelegationReasonChange);
                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,
                        ContractPriceTypeCode: $scope.viewModel.purchaseOfEngineering.contractPriceTypeCode,
                        ContractAgreementTypeCode: $scope.viewModel.purchaseOfEngineering.contractAgreementTypeCode,
                        ProjectCode: $scope.viewModel.purchaseOfEngineering.projectCode,
                        PurchaseCategoryCode: $scope.viewModel.purchaseOfEngineering.purchaseCategoryCode,
                        DirectDelegationReasonCode: $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                        IsUseProject: $scope.viewModel.isUseProject,
                        UseProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        UseStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        UseCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                    };
                    if (!param.ContractPriceTypeCode) { param.ContractPriceTypeCode = 0; }
                    if (param.DirectDelegationReasonCode && param.PurchaseAmount && (param.ProjectCode || param.UseProjectCode)) {
                        //改成传页面对象
                        wfOperate.refreshProcess('/DirectCommissionedEngineeringApplicationWf', $scope.currentActivityId, null, $scope.viewModel, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    $scope.viewModel.isNeedInitialAudit = data.viewModel.isNeedInitialAudit;
                    $scope.viewModel.isNeedAudit = data.viewModel.isNeedAudit;
                    $scope.viewModel.isNeedContract = data.viewModel.isNeedContract;
                    // 从合约汇总成本目标切换到填写成本目标时，需要把合约汇总数清空
                    if ($scope.viewModel.isNeedAgreement === true
                        && data.viewModel.isNeedAgreement === false) {
                        $scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount = 0;
                    }
                    $scope.viewModel.isNeedAgreement = data.viewModel.isNeedAgreement;
                    $scope.viewModel.isStrategyIndustryDomain = data.viewModel.isStrategyIndustryDomain;
                    if ($scope.viewModel.isStrategyIndustryDomain === true) { $scope.viewModel.purchaseOfEngineering.directDelegationReasonCode = 4; }
                    $scope.settings.delegationOpts.isNeedContract = $scope.viewModel.isNeedContract;
                });

                $scope.baseInfo.init();
            }
        ]);
    });