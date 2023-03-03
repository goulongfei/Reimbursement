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
        'supplierInfoExtendV4',
        'stageAreaExtend',
    ],
    function (app) {

        app.controller('directCommissionedProjectDefineApplication_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData',
            '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType',
            'seagull2Url',
            'ValidateHelper', 'sogValidator',
            'sogOguType',
            '$filter', 'regionType', 'regionShowStyle',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, regionType, regionShowStyle) {

                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = true;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印

                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                $scope.tradeCatagoryCodeList = [];
                $scope.isSeletProject = false;//是否选择项目
                $scope.mainTitle = '直接委托';
                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }

                //委托信息选择用的合约规划内容
                $scope.viewModel.contractAgreementScopeForPurchaseDelegation = [];
                angular.extend($scope.viewModel.contractAgreementScopeForPurchaseDelegation, $scope.viewModel.contractAgreementScopeList);

                //基本信息
                $scope.baseInfo = {
                    init: function () {
                        //直接委托理由
                        $scope.viewModel.commissionReason = {
                            reasonCode: $scope.viewModel.purchaseOfProDefine.directDelegationReasonCode,
                            reasonName: $scope.viewModel.purchaseOfProDefine.directDelegationReasonName,
                        };
                        $scope.viewModel.negativeList = {
                            confirm: $scope.viewModel.purchaseOfProDefine.isReadAndAgree
                        };
                        $scope.viewModel.purchaseOfProDefine.project = {
                            projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                            projectName: $scope.viewModel.purchaseOfProDefine.projectName
                        };
                        this.setOpinionOpts($scope.opinionOpts.options);

                        angular.forEach($scope.viewModel.contractAgreementScopeForPurchaseDelegation, function (item) {
                            for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                                var purchaseDelegationInfo = $scope.viewModel.purchaseDelegationInfoList[i];
                                for (var j = 0; j < purchaseDelegationInfo.perSignContractAgreementScopeInfoList.length; j++) {
                                    var perSignContractAgreementScopeInfo = purchaseDelegationInfo.perSignContractAgreementScopeInfoList[j];
                                    if (perSignContractAgreementScopeInfo.contractAgreementCode === item.contractAgreementCode) {
                                        item.disabled = true;
                                        item.selected = true;
                                        return;
                                    }
                                }
                            }
                        });

                        // 可以跨期区合约签订合同
                        if ($scope.viewModel.purchaseOfProDefine.projectCode) {
                            wfWaiting.show();
                            var param = [$scope.viewModel.purchaseOfProDefine.projectCode];
                            $scope.api.projectIsAllowMultipleAreaAgreement(param, function (data) {
                                wfWaiting.hide();
                                $scope.viewModel.isAllowMultipleAreaAgreement = data.isAllowMultipleAreaAgreement;
                                $scope.baseInfo.contractAgreementOpts.multipleSelect = data.isAllowMultipleAreaAgreement;
                            });
                        }
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    moneyopts: {
                        min: 0,
                        max: 100000000000,
                        precision: 2
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
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
                    //项目
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfProDefine.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfProDefine.project = project;
                            $scope.viewModel.purchaseOfProDefine.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfProDefine.projectName = project.projectName;
                            $scope.viewModel.purchaseOfProDefine.stageAreaCode = null;
                            $scope.viewModel.purchaseOfProDefine.stageAreaName = null;
                            $scope.viewModel.stageAreaScopeList = [];

                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.baseInfo.contractAgreementOpts.projectList = [{ projectCode: project.projectCode, projectName: project.projectName }];
                            $scope.baseInfo.contractAgreementOpts.projectCode = project.projectCode;
                            $scope.baseInfo.contractAgreementOpts.projectName = project.projectName;
                            $scope.baseInfo.contractAgreementOpts.stageAreaCode = null
                            $scope.baseInfo.contractAgreementOpts.stageAreaName = null
                            $scope.baseInfo.contractAgreementOpts.stageAreaList = [];

                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList) && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                    purchaseDelegationInfo.supplierCode = '';
                                    purchaseDelegationInfo.supplierName = '';
                                    purchaseDelegationInfo.industryDomainCode = '';
                                    purchaseDelegationInfo.industryDomainName = '';
                                })
                            }
                            $scope.baseInfo.delegationOpts.project = {
                                projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                                projectName: $scope.viewModel.purchaseOfProDefine.projectName
                            };
                            $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation = [];

                            $scope.baseInfo.stageAreaOpts.projectList = [{ projectCode: project.projectCode, projectName: project.projectName }];
                            $scope.baseInfo.stageAreaOpts.stageAreaName = "";

                            wfWaiting.show();
                            var param = [project.projectCode];
                            $scope.api.projectIsAllowMultipleAreaAgreement(param, function (data) {
                                wfWaiting.hide();
                                $scope.viewModel.isAllowMultipleAreaAgreement = data.isAllowMultipleAreaAgreement;
                                $scope.baseInfo.contractAgreementOpts.multipleSelect = data.isAllowMultipleAreaAgreement;
                                if ($scope.viewModel.isAllowMultipleAreaAgreement === false) {
                                    $scope.baseInfo.loadStageAreas(project.projectCode);
                                }
                            });
                            $scope.api.deletePerSignContractAgreementScopeInfoList();

                            angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (item) {
                                item.project = project;
                            });
                        }
                    },
                    // 期区
                    stageAreaOpts: {
                        readOnly: false,
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaName: "",
                        beforAppend: function (stageAreaList) {
                            $scope.viewModel.stageAreaScopeList = stageAreaList;
                            $scope.baseInfo.contractAgreementOpts.stageAreaList = stageAreaList;
                            $scope.baseInfo.delegationOpts.stageAreaList = stageAreaList;
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation = [];
                            $scope.api.deletePerSignContractAgreementScopeInfoList();
                            $scope.refreshProcess();
                        }
                    },
                    //采购金额变化
                    purchaseAmountChange: function (newValue, oldValue) {
                        if ((newValue) && newValue != oldValue) {
                            $scope.refreshProcess();
                        }
                    },
                    // 加载期区
                    loadStageAreas: function (projectCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.stageArea = [];
                        var param = { projectCode: projectCode };
                        $scope.api.getStageAreasByProjectCode(param, function (data) {
                            wfWaiting.hide();
                            if (data.error.length == 0) {
                                $scope.viewModel.option.stageArea = data.areaList;
                            } else {
                                sogModal.openAlertDialog("提示信息", data.error);
                            }
                        });
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0)
                            ? $scope.viewModel.corporationScopeList[0].corporationName
                            : null,
                        beforAppend: function (corporation) {
                            if (angular.isArray($scope.viewModel.corporationScopeList) === false || $scope.viewModel.corporationScopeList.length === 0) {
                                $scope.viewModel.corporationScopeList.push({});
                            }
                            $scope.viewModel.corporationScopeList[0].corporationCode = corporation.corporationCode;
                            $scope.viewModel.corporationScopeList[0].corporationName = corporation.corporationName;
                            $scope.baseInfo.loadChargeCompany(corporation.corporationCode);
                        }
                    },
                    tradeCatagoryOpts: {
                        beforAppend: function (tradeCatagory) {
                            for (var i = 0; i < tradeCatagory.length; i++) {
                                var item = tradeCatagory[i];
                                $scope.tradeCatagoryCodeList.push(item.code)
                            }
                        }
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                        projectName: $scope.viewModel.purchaseOfProDefine.projectName,
                        stageAreaCode: $scope.viewModel.purchaseOfProDefine.stageAreaCode,
                        stageAreaName: $scope.viewModel.purchaseOfProDefine.stageAreaName,
                        useProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        useStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        useChargeCompanyCode: $scope.viewModel.purchaseBase.useChargeCompanyCode,
                        useCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                        expenditureTypeCode: $scope.viewModel.purchaseBase.expenditureTypeCode,
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaList: $scope.viewModel.stageAreaScopeList,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        beforAppend: function (v) {
                            var myContract = dataFormat(v);// 格式化到视图
                            if (!angular.isArray($scope.viewModel.contractAgreementScopeList)) { $scope.viewModel.contractAgreementScopeList = []; }
                            var delegationContract = [];
                            var isSelected = false;
                            angular.extend(delegationContract, myContract);  //复制一份合约列表，用于委托信息选择
                            delegationContract.disabled = false;
                            if ($scope.viewModel.contractAgreementScopeList.length > 0) {
                                angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                    if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                        var message = "合约已选择！";
                                        sogModal.openAlertDialog("提示", message);
                                        isSelected = true;
                                        return;
                                    }
                                });
                            };
                            if (!isSelected) {
                                $scope.viewModel.purchaseOfProDefine.purchaseCostTargetAmount += myContract.costTargetAmount;
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                                $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation.push(delegationContract);
                            };
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseOfProDefine.purchaseCostTargetAmount = 0,
                                angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                    $scope.viewModel.purchaseOfProDefine.purchaseCostTargetAmount += agreement.costTargetAmount;
                                }),
                                $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation = [],
                                angular.extend($scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation, $scope.viewModel.contractAgreementScopeList);
                            $scope.api.deletePerSignContractAgreementScopeInfoList();
                        },
                    },
                    // 期区选中下拉框数据变化
                    stageAreaChange: function () {
                        angular.forEach($scope.viewModel.option.stageArea, function (v) {
                            if ($scope.viewModel.purchaseOfProDefine.stageAreaCode === v.code) {
                                $scope.viewModel.purchaseOfProDefine.stageAreaName = v.name;
                            }
                        });
                        $scope.baseInfo.contractAgreementOpts.stageAreaCode = $scope.viewModel.purchaseOfProDefine.stageAreaCode;
                        $scope.baseInfo.contractAgreementOpts.stageAreaName = $scope.viewModel.purchaseOfProDefine.stageAreaName;
                        $scope.baseInfo.delegationOpts.stageAreaCode = $scope.viewModel.purchaseOfProDefine.stageAreaCode;
                        $scope.baseInfo.delegationOpts.stageAreaName = $scope.viewModel.purchaseOfProDefine.stageAreaName;

                        var stageAreaList = [{
                            projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                            projectName: $scope.viewModel.purchaseOfProDefine.projectName,
                            stageAreaCode: $scope.viewModel.purchaseOfProDefine.stageAreaCode,
                            stageAreaName: $scope.viewModel.purchaseOfProDefine.stageAreaName,
                        }];
                        //给期区表同步
                        $scope.viewModel.stageAreaScopeList = stageAreaList;
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.viewModel.purchaseOfProDefine.purchaseCostTargetAmount = 0;

                        $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation = [];
                        $scope.api.deletePerSignContractAgreementScopeInfoList();
                        $scope.refreshProcess();
                    },
                    //招标人
                    corporationSelected: function () {
                        //每次重新选择招标人将之前选择的清空
                        $scope.viewModel.purchaseOfProDefine.corporationCode = "";
                        $scope.viewModel.purchaseOfProDefine.corporationName = "";
                        var viewpath = './htmlTemplate/dialogTemplate/common/corporationRadioSelector.html';
                        var projectDetailResult = sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                            '选择招标人', "corporationRadioSelector_controller", $scope, {
                            containerStyle: {
                                width: '60%'
                            }
                        });
                        projectDetailResult.then(function (resultData) {
                            $scope.viewModel.purchaseOfProDefine.corporationCode = resultData.code;
                            $scope.viewModel.purchaseOfProDefine.corporationName = resultData.cnName;
                            $scope.baseInfo.loadChargeCompany($scope.viewModel.purchaseOfProDefine.corporationCode);
                        });
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfProDefine.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfProDefine.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfProDefine.costCenterCode = "";
                        $scope.viewModel.purchaseOfProDefine.costCenterName = "";
                        var param = { corporationCode: corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        $scope.costCenter = [];
                        angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfProDefine.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfProDefine.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfProDefine.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfProDefine.chargeCompanyCode);
                            }
                        })
                    },
                    //加载成本中心    
                    loadCostCenter: function (chargeCompanyCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.costCenter = [];
                        var param = { chargeCompanyCode: chargeCompanyCode };
                        $scope.api.getCostCenterList(param, function (data) {
                            $scope.viewModel.option.costCenter = data;
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.option.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfProDefine.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfProDefine.costCenterCode = v.code;
                                $scope.viewModel.purchaseOfProDefine.costCenterName = v.name;
                            }
                        })
                        $scope.refreshProcess();
                    },
                    // 采购类别选中下拉框数据变化
                    projectPurchaseCategoryChange: function () {
                        angular.forEach($scope.viewModel.option.projectPurchaseCategory, function (v) {
                            if ($scope.viewModel.purchaseOfProDefine.purchaseCategoryCode === v.code) {
                                $scope.viewModel.purchaseOfProDefine.purchaseCategoryName = v.name;
                            }
                        })
                    },
                    // 直接委托理由选中下拉框数据变化
                    directDelegationReasonChange: function () {
                        var isChange = true;
                        if ($scope.viewModel.purchaseDelegationInfoList.length > 0 && $scope.viewModel.purchaseDelegationInfoList[0].supplierName) {
                            var promise = sogModal.openConfirmDialog("提示", "是否重新选择供应商?");
                            promise.then(function () {
                                for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                                    $scope.viewModel.purchaseDelegationInfoList[i].supplierCode = "";
                                    $scope.viewModel.purchaseDelegationInfoList[i].supplierName = "";
                                    $scope.viewModel.purchaseDelegationInfoList[i].industryDomainCode = "";
                                    $scope.viewModel.purchaseDelegationInfoList[i].industryDomainName = "";
                                }
                            }, function (data) {
                                var isChange = false;
                                $scope.viewModel.purchaseOfProDefine.directDelegationReasonCode = $scope.viewModel.commissionReason.reasonCode;
                                $scope.viewModel.purchaseOfProDefine.directDelegationReasonName = $scope.viewModel.commissionReason.reasonName;
                            })
                        }
                        if (isChange) {
                            angular.forEach($scope.viewModel.option.directDelegationReason, function (v) {
                                if ($scope.viewModel.purchaseOfProDefine.directDelegationReasonCode == v.code) {
                                    $scope.viewModel.purchaseOfProDefine.directDelegationReasonCode = v.code;
                                    $scope.viewModel.purchaseOfProDefine.directDelegationReasonName = v.name;
                                    $scope.viewModel.commissionReason.reasonCode = v.directDelegationReasonCode;
                                    $scope.viewModel.commissionReason.reasonName = v.directDelegationReasonName;
                                }
                            })
                        }
                        $scope.baseInfo.delegationOpts.reason = $scope.viewModel.purchaseOfProDefine.directDelegationReasonCode;
                        $scope.refreshProcess();
                    },
                    // 直接委托理由变更  
                    directDelegationReasonCodeChange: function (newVal) {
                        if (newVal) {
                            $scope.baseInfo.delegationOpts.reason = newVal;
                        }
                        else {
                            $scope.baseInfo.delegationOpts.reason = null;
                        }
                    },
                    // 计价方式选中下拉框数据变化
                    valuationWayChange: function () {
                        angular.forEach($scope.viewModel.option.valuationWay, function (v) {
                            if ($scope.viewModel.purchaseOfProDefine.valuationWayCode === v.code) {
                                $scope.viewModel.purchaseOfProDefine.valuationWayName = v.name;
                            }
                        })
                    },
                    // 合同价格形式选中下拉框数据变化
                    contractPriceTypeChange: function () {
                        angular.forEach($scope.viewModel.option.contractPriceType, function (v) {
                            if ($scope.viewModel.purchaseOfProDefine.contractPriceTypeCode === v.code) {
                                $scope.viewModel.purchaseOfProDefine.contractPriceTypeName = v.name;
                            }
                        });
                    },
                    // 本次直接委托金额变更
                    purchaseAmountChack: function (newValue, oldValue) {
                        if ((oldValue) && (newValue)) {
                            $scope.viewModel.purchaseBase.purchaseAmount = newValue;
                            $scope.refreshProcess();
                        }
                    },
                    // 供应商类别变更  
                    industryDomainChange: function (newVal, oldVal) {
                        if (newVal) {
                            $scope.baseInfo.delegationOpts.supplierCatagory = newVal;
                        }
                        else {
                            $scope.baseInfo.delegationOpts.supplierCatagory = null;
                        }

                        if (newVal !== oldVal) {
                            if (angular.isArray(newVal)
                                && angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                                && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                var isInclude = false;
                                angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                    for (var i = 0; i < newVal.length; i++) {
                                        if (purchaseDelegationInfo.industryDomainCode === newVal[i].industryDomainCode) {
                                            isInclude = true;
                                        }
                                    }
                                    if (isInclude === false) {
                                        purchaseDelegationInfo.supplierCode = '';
                                        purchaseDelegationInfo.supplierName = '';
                                        purchaseDelegationInfo.industryDomainCode = '';
                                        purchaseDelegationInfo.industryDomainName = '';
                                    }
                                })
                            }
                        }
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 4,
                        'scene': 'application',
                        'contractAgreementScopeForPurchaseDelegation': $scope.viewModel.contractAgreementScopeForPurchaseDelegation,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        //直接委托理由
                        'reason': $scope.viewModel.purchaseOfProDefine.directDelegationReasonCode,
                        //项目
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                            projectName: $scope.viewModel.purchaseOfProDefine.projectName
                        },
                        'stageAreaCode': $scope.viewModel.purchaseOfProDefine.stageAreaCode,
                        'stageAreaName': $scope.viewModel.purchaseOfProDefine.stageAreaName,
                        'stageAreaList': $scope.viewModel.stageAreaScopeList,
                        //供应商类别
                        'supplierCatagory': $scope.viewModel.p_IndustryDomainScopes,
                        //小微供应商限定金额,-1表示不可以选择小微供应商
                        'tinyAmount': -1,
                        'blackList': ['reason', 'project', 'supplierCatagory', 'delegationAmount'],
                    },
                    // 直接委托报告
                    reportFileOpts: {
                        'auto': true,
                        'preview': false,
                    },
                    // 其他文件
                    otherFileOpts: {
                        'auto': true,
                        'preview': false,
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
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.baseInfo.contractAgreementOpts.useProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                        $scope.baseInfo.contractAgreementOpts.useStageAreaCode = $scope.viewModel.purchaseBase.useStageAreaCode;
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
                        $scope.baseInfo.contractAgreementOpts.useChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                        $scope.baseInfo.contractAgreementOpts.useCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
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
                        $scope.baseInfo.contractAgreementOpts.useProjectCode = null;
                        $scope.baseInfo.contractAgreementOpts.useStageAreaCode = null;
                        $scope.baseInfo.contractAgreementOpts.useChargeCompanyCode = null;
                        $scope.baseInfo.contractAgreementOpts.useCostCenterCode = null;
                        $scope.baseInfo.contractAgreementOpts.expenditureTypeCode = $scope.viewModel.purchaseBase.expenditureTypeCode;
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            sogModal.openAlertDialog("消息", "根据最新管理要求，事业部平台发生的四项类合同需要受预算管理与合约规划双控，请提前确认是否已编制相关预算事项，谢谢");
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.viewModel.purchaseBase.useStageAreaCode = null;
                            $scope.viewModel.purchaseBase.useStageAreaName = null;
                            $scope.baseInfo.useProjectOpts.projectName = "";
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
                            $scope.baseInfo.useProjectOpts.projectName = "";
                            $scope.baseInfo.useChargeCompanyOpts.corporationName = "";
                            $scope.viewModel.option.useCostCenterList = [];
                            $scope.viewModel.option.useStageArea = [];
                            $scope.baseInfo.stageAreaChange();
                        }
                    },
                };

                //页面所用函数
                $scope.api = {
                    //自定义指令回调函数
                    urlGetStageAreasByProjectCode: function (param) {
                        return seagull2Url.getPlatformUrl('/ProjectInfo/GetStageAreasByProjectCode?r=' + Math.random() + '&projectCode=' + param.projectCode);
                    },
                    urlGetChargeCompanyList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetChargeCompanyList?r=' + Math.random() + '&corporationCode=' + param.corporationCode);
                    },
                    urlGetCostCenterList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode);
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
                    // 删除委托信息所属的合约规划
                    deletePerSignContractAgreementScopeInfoList: function () {
                        if ($scope.viewModel.purchaseDelegationInfoList !== undefined && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                            angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                purchaseDelegationInfo.perSignContractAgreementScopeInfoList = [];
                            })
                        };
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
                };

                // 获取的合约数据格式化
                var dataFormat = (function (data) {
                    var contractAgreementSplitInfos = [];
                    // 合约成本科目明细 
                    if (angular.isArray(data.costCourseInfoController)) {
                        for (var i = 0; i < data.costCourseInfoController.length; i++) {
                            var item = data.costCourseInfoController[i];
                            var contractAgreementSplitInfo = {
                                projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                                projectName: $scope.viewModel.purchaseOfProDefine.projectName,
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
                        projectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                        projectName: $scope.viewModel.purchaseOfProDefine.projectName,
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
                    }
                });
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
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    // var RangeValidator = ValidateHelper.getValidator('Range');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '项目名称', attributeName: 'purchaseOfProDefine.projectCode', validator: new RequiredValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfProDefine.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfProDefine.costCenterCode', validator: new RequiredValidator('请选择！') },
                        { key: '地区', attributeName: 'purchaseOfProDefine.cityInput', validator: new RequiredValidator('请选择！') },
                        { key: '建设地点', attributeName: 'purchaseOfProDefine.buildDetailAddress', validator: new RequiredValidator('不能为空！') },
                        { key: '直接委托理由', attributeName: 'purchaseOfProDefine.directDelegationReasonCode', validator: new RequiredValidator('请选择！') },
                        { key: '合同价格形式', attributeName: 'purchaseOfProDefine.contractPriceTypeCode', validator: new RequiredValidator('请选择！') },
                        { key: '计价方式', attributeName: 'purchaseOfProDefine.valuationWayCode', validator: new RequiredValidator('请选择！') },
                        { key: '建筑面积', attributeName: 'purchaseOfProDefine.buildingArea', validator: new RequiredValidator('不能为空！') },
                        { key: '建设单方成本目标', attributeName: 'purchaseOfProDefine.buildingCostTargetPerArea', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfProDefine.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfProDefine.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '付款方式描述', attributeName: 'purchaseOfProDefine.paymentWayDescribe', validator: new RequiredValidator('不能为空！') },
                        { key: '付款方式描述', attributeName: 'purchaseOfProDefine.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);
                    // 期区 
                    if ($scope.viewModel.isAllowMultipleAreaAgreement === true) {
                        if (angular.isArray($scope.viewModel.stageAreaScopeList) === false
                            || $scope.viewModel.stageAreaScopeList.length === 0) {
                            modelStateDictionary.addModelError('期区', '请选择！');
                        }
                    }
                    else {
                        var stageAreaCode = $scope.viewModel.purchaseOfProDefine.stageAreaCode;
                        if (stageAreaCode === undefined || stageAreaCode === null || stageAreaCode === '0') {
                            modelStateDictionary.addModelError('期区', '请选择！');
                        }
                    }
                    // 法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
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
                    // 供应商类别
                    if (angular.isArray($scope.viewModel.industryDomainScopeList) === false || $scope.viewModel.industryDomainScopeList.length === 0) {
                        modelStateDictionary.addModelError('供应商类别', '请选择！');
                    }
                    // 直接委托理由
                    if ($scope.viewModel.purchaseOfProDefine.directDelegationReasonCode === 0) {
                        modelStateDictionary.addModelError('直接委托理由', '请选择！');
                    }
                    // 计价方式
                    if ($scope.viewModel.purchaseOfProDefine.valuationWayCode === 0) {
                        modelStateDictionary.addModelError('计价方式', '请选择！');
                    }
                    // 合同价格形式
                    if ($scope.viewModel.purchaseOfProDefine.contractPriceTypeCode === 0) {
                        modelStateDictionary.addModelError('合同价格形式', '请选择！');
                    }
                    // 建筑面积
                    if ($scope.viewModel.purchaseOfProDefine.buildingArea === 0) {
                        modelStateDictionary.addModelError('建筑面积', '不能为0！');
                    }
                    // 建设单方成本目标
                    if ($scope.viewModel.purchaseOfProDefine.buildingCostTargetPerArea === 0) {
                        modelStateDictionary.addModelError('建设单方成本目标', '不能为0！');
                    }
                    // 负面清单
                    if ($scope.viewModel.negativeList.confirm !== true) {
                        modelStateDictionary.addModelError('负面清单-我已阅读并知悉相关要求', '请确认！');
                    }
                    if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)) {
                        // 校验委托信息是否为空
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
                                { key: rowKey + '，直接委托供应商', attributeName: 'supplierCode', validator: [new RequiredValidator("请选择！")] },
                                { key: rowKey + '，合同经办人', attributeName: 'operatorUser', validator: [new RequiredValidator("请选择！")] }
                            ]);
                            modelStateDictionary.merge(required);
                        }
                    }
                    // 合约规划列表验证
                    if (angular.isArray($scope.viewModel.contractAgreementScopeList)) {
                        if ($scope.viewModel.contractAgreementScopeList.length === 0) {
                            modelStateDictionary.addModelError('合约规划', '不能为空!');
                        }
                    }
                    //合约规划
                    if ($scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation !== null && $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation.length > 0) {
                        for (var i = 0; i < $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation.length; i++) {
                            var contractAgreement = $scope.baseInfo.delegationOpts.contractAgreementScopeForPurchaseDelegation[i];
                            if (!contractAgreement.disabled) {
                                modelStateDictionary.addModelError("合约规划	", "合约【" + contractAgreement.contractAgreementName + "】还未关联至委托信息！");
                            }
                        }
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
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfProDefine.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '付款方式描述', attributeName: 'purchaseOfProDefine.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") }
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    if ($scope.viewModel.purchaseOfProDefine.cityInput) {
                        model.purchaseOfProDefine.fullPathId = $scope.viewModel.purchaseOfProDefine.cityInput.fullPathId;
                        model.purchaseOfProDefine.fullPathName = $scope.viewModel.purchaseOfProDefine.cityInput.fullPathName;
                    }
                    if ($scope.viewModel.negativeList) {
                        model.purchaseOfProDefine.isReadAndAgree = $scope.viewModel.negativeList.confirm;
                    }
                    if (model.purchaseOfProDefine.price === null || model.purchaseOfProDefine.price === "") {
                        model.purchaseOfProDefine.price = 0;
                    }
                    if (model.purchaseOfProDefine.buildingArea === null || model.purchaseOfProDefine.buildingArea === "") {
                        model.purchaseOfProDefine.buildingArea = 0;
                    }
                    if (model.purchaseOfProDefine.buildingCostTargetPerArea === null || model.purchaseOfProDefine.buildingCostTargetPerArea === "") {
                        model.purchaseOfProDefine.buildingCostTargetPerArea = 0;
                    }
                    //model.purchaseOfProDefine.cityInput = null;
                    model.option = null;
                    return model;
                };
                $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);
                $scope.$watch('viewModel.industryDomainScopeList', $scope.baseInfo.industryDomainChange, true);
                $scope.$watch('viewModel.purchaseOfProDefine.directDelegationReasonCode', $scope.baseInfo.directDelegationReasonCodeChange);
                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,
                        ProjectCode: $scope.viewModel.purchaseOfProDefine.projectCode,
                        StageAreaCode: $scope.viewModel.purchaseOfProDefine.stageAreaCode,
                        DirectDelegationReasonCode: $scope.viewModel.purchaseOfProDefine.directDelegationReasonCode,
                        CostCenterCode: $scope.viewModel.purchaseOfProDefine.costCenterCode,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                        IsUseProject: $scope.viewModel.isUseProject,
                        UseProjectCode: $scope.viewModel.purchaseBase.useProjectCode,
                        UseStageAreaCode: $scope.viewModel.purchaseBase.useStageAreaCode,
                        UseCostCenterCode: $scope.viewModel.purchaseBase.useCostCenterCode,
                    };
                    if (!param.ContractPriceTypeCode) { param.ContractPriceTypeCode = 0; }
                    if (!param.DirectDelegationReasonCode) { param.DirectDelegationReasonCode = 0; }
                    if (!param.CostCenterCode) { param.CostCenterCode = 0; }
                    if (param.DirectDelegationReasonCode && param.PurchaseAmount) {
                        //改成传页面对象
                        wfOperate.refreshProcess('/DirectCommissionedProjectDefineWf', $scope.currentActivityId, null, $scope.viewModel, true);
                    }
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
                            defer.resolve(getCleanModel());
                        }
                    }
                    else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve($scope.viewModel);
                        }, function () {
                            defer.reject(getCleanModel());
                        });
                    }
                    else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    }
                    else {
                        defer.resolve(getCleanModel());
                    }
                };
                $scope.baseInfo.init();
            }]);
    });