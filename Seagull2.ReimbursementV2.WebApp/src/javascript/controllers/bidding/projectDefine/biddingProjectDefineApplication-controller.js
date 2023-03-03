define([
    'app',
    'biddingSynthesizeExtend',
    'projectExtend',
    'stageAreaExtend',
    'engineeringExtend',
    'corporationExtend',
    'useCostCenterExtend',
    'supplierCategoryExtend',
    'dateTimePickerExtend',
    'contractAgreementExtend',
    'supplierSelector',
    'negativeListExtend'
], function (app) {
    app.controller('biddingProjectDefineApplication_controller', [
        '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal',
        'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType',
        function ($scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = true;//作废 
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

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
                urlUseGetCostCenterList: function (param) {
                    return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&isUseCostCenter=true');
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
                // 获取使用成本中心
                getUseCostCenterList: function (param, done) {
                    $http({
                        method: 'GET',
                        url: $scope.api.urlUseGetCostCenterList(param),
                        data: param,
                    })
                        .success(function (data) { done(data); })
                        .error($scope.api.showErrorMessage);
                }
            };
            //设置
            $scope.settings = {
                // 附件设置项
                fileopts: {
                    'resourceId': $scope.viewModel.resourceID,
                },
                // 单选人员
                peopleSelectOpts: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                // 项目
                projectOpts: {
                    readOnly: false,
                    beforAppend: function (projectList) {
                        $scope.viewModel.projectScopeList = projectList;
                        $scope.viewModel.stageAreaScopeList = [];
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.viewModel.supplierScopeList = [];
                        $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;

                        $scope.settings.stageAreaOpts.projectList = projectList;
                        $scope.settings.stageAreaOpts.stageAreaName = "";
                        $scope.settings.contractAgreementOpts.projectList = projectList;
                        $scope.settings.contractAgreementOpts.stageAreaList = [];
                        $scope.settings.supplierScopeOpts.projectList = projectList;

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
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                        $scope.settings.contractAgreementOpts.stageAreaList = stageAreaList;
                        $scope.refreshProcess();
                    }
                },
                // 使用项目
                useProjectOpts: {
                    readOnly: false,
                    projectName: $scope.viewModel.purchaseBase.useProjectName,
                    beforAppend: function (project) {
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                        $scope.viewModel.purchaseBase.useProjectCode = project.projectCode;
                        $scope.viewModel.purchaseBase.useProjectName = project.projectName;
                        $scope.viewModel.purchaseBase.useStageAreaCode = "";
                        $scope.viewModel.purchaseBase.useStageAreaName = "";
                        $scope.settings.contractAgreementOpts.useProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                        $scope.settings.contractAgreementOpts.useStageAreaCode = "";
                        $scope.baseInfo.loadUseStageAreas(project.projectCode);
                    }
                },
                // 使用记账公司
                useChargeCompanyOpts: {
                    corporationName: $scope.viewModel.purchaseBase.useChargeCompanyName,
                    beforAppend: function (corporation) {
                        $scope.viewModel.contractAgreementScopeList = [];
                        $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                        $scope.viewModel.purchaseBase.useChargeCompanyCode = corporation.corporationCode;
                        $scope.viewModel.purchaseBase.useChargeCompanyName = corporation.corporationName;
                        $scope.viewModel.purchaseBase.useCostCenterCode = "";
                        $scope.viewModel.purchaseBase.useCostCenterName = "";
                        $scope.settings.contractAgreementOpts.useChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                        $scope.settings.contractAgreementOpts.useCostCenterCode = "";
                        $scope.baseInfo.loadUseCostCenter(corporation.corporationCode);
                    }
                },
                // 法人公司
                corporationOpts: {
                    corporationName: (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0) ?
                        $scope.viewModel.corporationScopeList[0].corporationName : null,
                    beforAppend: function (corporation) {
                        $scope.viewModel.corporationScopeList = corporation;
                        $scope.viewModel.purchaseOfProjectDefine.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfProjectDefine.chargeCompanyName = "";
                        $scope.viewModel.purchaseOfProjectDefine.costCenterCode = "";
                        $scope.viewModel.purchaseOfProjectDefine.costCenterName = "";
                        $scope.baseInfo.loadChargeCompany(corporation);
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
                // 采购时间安排信息
                purchaseDateArrangeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'Draft',
                },
                // 合约规划
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
                            $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount += myContract.costTargetAmount;
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                $scope.viewModel.contractAgreementScopeList = [];
                            }
                            $scope.viewModel.contractAgreementScopeList.push(myContract);
                        };
                    },
                    beforDelete: function () {
                        $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                        if (angular.isArray($scope.viewModel.contractAgreementScopeList)) {
                            for (var i = 0; i < $scope.viewModel.contractAgreementScopeList.length; i++) {
                                var agreement = $scope.viewModel.contractAgreementScopeList[i];
                                $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount += agreement.costTargetAmount;
                            }
                        };
                        $scope.refreshProcess();
                    }
                },
                // 入围供应商
                supplierScopeOpts: {
                    formAction: $scope.viewModel.formAction,
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    scene: "Draft",
                    supplierCatagory: $scope.viewModel.industryDomainScope,
                    blackList: ['supplierCatagory'],
                    projectList: $scope.viewModel.projectScopeList,
                    beforAppend: function (supplierData) {
                        if ($scope.viewModel.supplierScopeList.length > 0) {
                            var isSameSupplier = false;
                            angular.forEach($scope.viewModel.supplierScopeList, function (item) {
                                if (supplierData.supplierCode == item.supplierCode) {
                                    isSameSupplier = true;
                                }
                            });
                            if (isSameSupplier) {
                                sogModal.openAlertDialog("提示", "不能添加相同供应商！");
                            } else {
                                $scope.viewModel.supplierScopeList.push(supplierData);
                            }
                        } else {
                            $scope.viewModel.supplierScopeList.push(supplierData);
                        }


                    },
                    afterAppend: function (supplierData) {
                        $scope.viewModel.supplierScopeList = supplierData;
                    },
                }
            };
            // 基本信息
            $scope.baseInfo = {
                init: function () {
                    $scope.viewModel.negativeList = {
                        confirm: $scope.viewModel.purchaseOfProjectDefine.isReadAndAgree
                    };
                    this.setOpinionOpts($scope.opinionOpts.options);
                    // 显示审批
                    angular.forEach($scope.opinions, function (item, index) {
                        if (item.processId !== "InputOpinion") {
                            $scope.baseInfo.isOpinionsShow = true;
                        }
                    });
                },
                // 设置审批栏权限
                setOpinionOpts: function (data) {
                    angular.forEach(data, function (item) {
                        item.allowToBeAppended = false;
                        item.allowToBeDeleted = false;
                        item.allowToBeModified = false;
                    });
                },
                // 查询记账公司
                loadChargeCompany: function (corporation) {
                    wfWaiting.show();
                    $scope.viewModel.option.chargeCompanyList = [];
                    $scope.viewModel.option.costCenterList = [];
                    var param = {
                        corporationCode: ''
                    };
                    for (var i = 0; i < corporation.length; i++) {
                        if (i === 0) { param.corporationCode = corporation[i].corporationCode; }
                        else { param.corporationCode += ',' + corporation[i].corporationCode; }
                    }
                    $scope.api.getChargeCompanyList(param, function (data) {
                        $scope.viewModel.option.chargeCompanyList = data;
                        wfWaiting.hide();
                    });
                },
                // 查询成本中心
                loadCostCenter: function (chargeCompanyCode) {
                    wfWaiting.show();
                    $scope.viewModel.option.costCenterList = [];
                    var param = {
                        chargeCompanyCode: chargeCompanyCode
                    };
                    $scope.api.getCostCenterList(param, function (data) {
                        $scope.viewModel.option.costCenterList = data;
                        wfWaiting.hide();
                    });
                },
                // 查询使用期区
                loadUseStageAreas: function (projectCode) {
                    wfWaiting.show();
                    $scope.viewModel.option.useStageAreaList = [];
                    var param = {
                        projectCode: projectCode
                    };
                    $scope.api.getStageAreasByProjectCode(param, function (data) {
                        wfWaiting.hide();
                        if (data.error.length === 0) {
                            $scope.viewModel.option.useStageAreaList = data.areaList;
                        } else {
                            sogModal.openAlertDialog("提示信息", data.error);
                        }
                    });
                },
                // 查询使用成本中心
                loadUseCostCenter: function (chargeCompanyCode) {
                    wfWaiting.show();
                    $scope.viewModel.option.useCostCenterList = [];
                    var param = {
                        chargeCompanyCode: chargeCompanyCode
                    };
                    $scope.api.getUseCostCenterList(param, function (data) {
                        $scope.viewModel.option.useCostCenterList = data;
                        wfWaiting.hide();
                    });
                },
                // 记账公司选中下拉框选中后数据变化
                chargeCompanyChange: function () {
                    angular.forEach($scope.viewModel.option.chargeCompanyList, function (v) {
                        if ($scope.viewModel.purchaseOfProjectDefine.chargeCompanyCode === v.code) {
                            $scope.viewModel.purchaseOfProjectDefine.chargeCompanyName = v.name;
                        }
                        if ($scope.viewModel.purchaseOfProjectDefine.chargeCompanyCode) {
                            $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfProjectDefine.chargeCompanyCode);
                        }
                    })
                },
                // 成本中心选中下拉框数据变化
                costCenterChange: function () {
                    angular.forEach($scope.viewModel.option.costCenterList, function (v) {
                        if ($scope.viewModel.purchaseOfProjectDefine.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfProjectDefine.costCenterName = v.name;
                        }
                    })
                    $scope.refreshProcess();
                },
                // 使用期区选中下拉框数据变化
                useStageAreaChange: function () {
                    angular.forEach($scope.viewModel.option.useStageAreaList, function (v) {
                        if ($scope.viewModel.purchaseBase.useStageAreaCode === v.code) {
                            $scope.viewModel.purchaseBase.useStageAreaName = v.name;
                        }
                    })
                    $scope.viewModel.contractAgreementScopeList = [];
                    $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                    $scope.settings.contractAgreementOpts.useStageAreaCode = $scope.viewModel.purchaseBase.useStageAreaCode;
                    $scope.refreshProcess();
                },
                // 使用成本中心选中下拉框数据变化
                useCostCenterChange: function () {
                    angular.forEach($scope.viewModel.option.useCostCenterList, function (v) {
                        if ($scope.viewModel.purchaseBase.useCostCenterCode == v.code) {
                            $scope.viewModel.purchaseBase.useCostCenterName = v.name;
                        }
                    })
                    $scope.viewModel.contractAgreementScopeList = [];
                    $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
                    $scope.settings.contractAgreementOpts.useCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
                    $scope.refreshProcess();
                },
                // 支出类型选中下拉框选中后数据变化
                expenditureTypeChange: function () {
                    angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                            $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                        }
                    })
                    $scope.viewModel.contractAgreementScopeList = [];
                    $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount = 0;
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
                        $scope.viewModel.option.useStageAreaList = [];
                    } else if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                        $scope.viewModel.isUseCostCenter = false;
                        $scope.viewModel.isUseProject = true;
                        $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                        $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                        $scope.viewModel.purchaseBase.useCostCenterCode = "";
                        $scope.viewModel.purchaseBase.useCostCenterName = "";
                        $scope.settings.useChargeCompanyOpts.corporationName = "";
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
                        $scope.settings.useChargeCompanyOpts.corporationName = "";
                        $scope.viewModel.option.useCostCenterList = [];
                        $scope.viewModel.option.useStageAreaList = [];
                    }
                    $scope.refreshProcess();
                },
                // 合同价格形式选中下拉框数据变化
                contractPriceTypeChange: function () {
                    angular.forEach($scope.viewModel.option.contractPriceTypeList, function (v) {
                        if ($scope.viewModel.purchaseOfProjectDefine.contractPriceTypeCode === v.code) {
                            $scope.viewModel.purchaseOfProjectDefine.contractPriceTypeName = v.name;
                        }
                    });
                }
            };
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
            // 发送验证
            var validData = function () {
                var RequiredValidator = ValidateHelper.getValidator('Required');
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator("不能为空！") },
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                    { key: '项目名称', attributeName: 'projectScopeList', validator: new RequiredValidator('请选择！') },
                    { key: '期区', attributeName: 'stageAreaScopeList', validator: new RequiredValidator('请选择！') },
                    { key: '记账公司', attributeName: 'purchaseOfProjectDefine.chargeCompanyCode', validator: new RequiredValidator("请选择！") },
                    { key: '成本中心', attributeName: 'purchaseOfProjectDefine.costCenterCode', validator: new RequiredValidator("请选择！") },
                    { key: '合同价格形式', attributeName: 'purchaseOfProjectDefine.contractPriceTypeCode', validator: new RequiredSelectValidator('请选择！') },
                    { key: '本次采购范围和内容', attributeName: 'purchaseOfProjectDefine.purchaseContent', validator: new RequiredValidator("不能为空！") },
                    { key: '本次采购范围和内容', attributeName: 'purchaseOfProjectDefine.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    { key: '采购主责人', attributeName: 'purchaseOfProjectDefine.purchaseMainUser', validator: new RequiredValidator("不能为空！") },
                    { key: '商务负责人', attributeName: 'purchaseOfProjectDefine.businessMainUser', validator: new RequiredValidator("不能为空！") },
                    { key: '技术负责人', attributeName: 'purchaseOfProjectDefine.technologyMainUser', validator: new RequiredValidator("不能为空！") }
                ]);
                //   项目名称
                if (angular.isArray($scope.viewModel.projectScopeList) === false || $scope.viewModel.projectScopeList.length === 0) {
                    modelStateDictionary.addModelError('项目名称', '请选择！');
                }
                //  期区
                if (angular.isArray($scope.viewModel.stageAreaScopeList) === false || $scope.viewModel.stageAreaScopeList.length === 0) {
                    modelStateDictionary.addModelError('期区', '请选择！');
                }
                //  供应商类别
                if (angular.isArray($scope.viewModel.industryDomainScope) === false || $scope.viewModel.industryDomainScope.length === 0) {
                    modelStateDictionary.addModelError('供应商类别', '请选择！');
                }
                //  招标人
                if (angular.isArray($scope.viewModel.corporationScopeList) === false || $scope.viewModel.corporationScopeList.length === 0) {
                    modelStateDictionary.addModelError('招标人', '请选择！');
                }
                //支出类型
                if ($scope.viewModel.purchaseBase.expenditureTypeCode == null) {
                    modelStateDictionary.addModelError('支出类型', '请选择！');
                }
                if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                    if (!$scope.viewModel.purchaseBase.useProjectCode) {
                        modelStateDictionary.addModelError('使用项目', '请选择！');
                    }
                    if (!$scope.viewModel.purchaseBase.useStageAreaCode) {
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
                //采购小组成员
                if ($scope.viewModel.purchaseOfProjectDefine.businessMainUser && $scope.viewModel.purchaseOfProjectDefine.technologyMainUser)
                    if ($scope.viewModel.purchaseOfProjectDefine.technologyMainUser.id == $scope.viewModel.purchaseOfProjectDefine.businessMainUser.id)
                        modelStateDictionary.addModelError("采购小组成员", "商务负责人与技术负责人不能同为一人");
                //采购时间安排
                var isValidAdopt = true;
                if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                    var purchaseDateArrangeInfo = $scope.viewModel.purchaseDateArrangeInfoList[0];
                    if (!purchaseDateArrangeInfo.replyDeadline) {
                        modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能为空");
                        isValidAdopt = false;
                    }
                    if (!purchaseDateArrangeInfo.evaluateBiddingDeadline) {
                        modelStateDictionary.addModelError("采购时间安排", "评标时间不能为空");
                        isValidAdopt = false;
                    }
                    if (!purchaseDateArrangeInfo.decideBiddingDeadline) {
                        modelStateDictionary.addModelError("采购时间安排", "定标时间不能为空");
                        isValidAdopt = false;
                    }
                    if (isValidAdopt) {
                        if (new Date(purchaseDateArrangeInfo.replyDeadline) < new Date()) {
                            modelStateDictionary.addModelError("采购时间安排", "回标截止时间不能小于当前时间");
                        }
                        if (new Date(purchaseDateArrangeInfo.evaluateBiddingDeadline) < new Date(purchaseDateArrangeInfo.replyDeadline)) {
                            modelStateDictionary.addModelError("采购时间安排", "评标时间不能小于回标截止时间");
                        }
                        if (new Date(purchaseDateArrangeInfo.decideBiddingDeadline) < new Date(purchaseDateArrangeInfo.evaluateBiddingDeadline)) {
                            modelStateDictionary.addModelError("采购时间安排", "定标时间不能小于评标时间");
                        }
                    }
                }
                // 合约信息
                if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false
                    || $scope.viewModel.contractAgreementScopeList.length === 0) {
                    modelStateDictionary.addModelError('合约规划', '请添加！');
                }
                // 入围供应商
                if (angular.isArray($scope.viewModel.supplierScopeList) === false
                    || $scope.viewModel.supplierScopeList.length === 0) {
                    modelStateDictionary.addModelError('入围供应商', '请添加！');
                } else {
                    if ($scope.viewModel.supplierScopeList.length < 3) {
                        modelStateDictionary.addModelError("入围供应商", "入围供应商不能小于三家");
                    }
                }
                // 负面清单
                if ($scope.viewModel.negativeList.confirm !== true) {
                    modelStateDictionary.addModelError('负面清单-我已阅读并知悉相关要求', '请确认！');
                }
                //招标文件
                if (!$scope.viewModel.purchaseOfProjectDefine.biddingFile || $scope.viewModel.purchaseOfProjectDefine.biddingFile.length === 0) {
                    modelStateDictionary.addModelError('招标文件', '请上传招标文件！');
                }
                // 审批流
                if (angular.isArray($scope.opinionOpts.options) === false || $scope.opinionOpts.options.length === 0) {
                    modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
                }
                return modelStateDictionary;
            };
            // 保存验证
            var saveValidData = function () {
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                    { key: '本次采购范围和内容', attributeName: 'purchaseOfProjectDefine.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                ]);

                return modelStateDictionary;
            };
            // 复制viewModel
            function getCleanModel() {
                var model = {};
                angular.extend(model, $scope.viewModel);
                if ($scope.viewModel.negativeList) {
                    model.purchaseOfProjectDefine.isReadAndAgree = $scope.viewModel.negativeList.confirm;
                }
                model.option = null;
                return model;
            }
            //加载收集数据的名称
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
                        defer.resolve(getCleanModel());
                    }, function () {
                        defer.reject($scope.viewModel);
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
                } else {
                    defer.resolve(getCleanModel());
                }
            }
            // 刷新流程
            $scope.refreshProcess = function () {
                var param = {
                    ProjectScopeList: $scope.viewModel.projectScopeList,
                    StageAreaScopeList: $scope.viewModel.stageAreaScopeList,
                    PurchaseCostTargetAmount: $scope.viewModel.purchaseOfProjectDefine.purchaseCostTargetAmount,
                    CostCenterCode: $scope.viewModel.purchaseOfProjectDefine.costCenterCode,
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
                    wfOperate.refreshProcess('/BiddingProjectDefineApplicationWf', $scope.currentActivityId, null, param, true);
                }
            }
            $rootScope.$on("$processRefreshed", function (event, data) {
                $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                angular.extend($scope.opinionOpts, data.opinionOpts);
                $scope.baseInfo.refreshing = false;
                if ($scope.baseInfo.refreshCount > 0) { wfWaiting.show(); }
            });

            $scope.baseInfo.init();
        }
    ]);
});