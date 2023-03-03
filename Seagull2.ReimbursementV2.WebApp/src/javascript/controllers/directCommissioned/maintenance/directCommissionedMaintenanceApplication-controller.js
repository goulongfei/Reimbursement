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
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('directCommissionedMaintenanceApplication_controller', [
            '$scope', 'viewData', '$rootScope', '$http',
            'wfOperate', 'seagull2Url',
            'wfWaiting', 'sogModal', 'sogOguType', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            function ($scope, viewData, $rootScope, $http,
                wfOperate, seagull2Url,
                wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator,
                sogWfControlOperationType) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（第三方维保类）';
                //设置导航栏按钮状态 
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回 
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
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
                // 设置 
                $scope.settings = {
                    //附件设置项
                    fileopts: {
                        // 'resourceId': $scope.viewModel.resourceID,
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
                    //项目
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfMaintenance.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfMaintenance.project = project;
                        }
                    },
                    //使用项目
                    useProjectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseBase.useProjectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseBase.useProjectCode = project.projectCode;
                            $scope.viewModel.purchaseBase.useProjectName = project.projectName;
                            $scope.refreshProcess();
                        }
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 1,
                        'scene': 'application',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        },
                        'blackList': ['delegationAmount', 'project'],
                        'tinyAmount': 50000,
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
                    spreadButtonName: "展开"
                };

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
                        //return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&isproject=' + param.isProject);
                        return seagull2Url.getPlatformUrl('/Purchase/GetNotOperationCostControlCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&IsProject=' + param.isProject + '&islimit=' + false);
                    },
                    // 获取记账公司
                    getChargeCompanyList: function (param, done) {
                        var url = $scope.api.urlGetChargeCompanyList(param);
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 2 || $scope.viewModel.purchaseBase.expenditureTypeCode == 3) {
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
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        $scope.viewModel.negativeList = {
                            confirm: $scope.viewModel.purchaseOfMaintenance.isReadAndAgree
                        };
                        this.setOpinionOpts($scope.opinionOpts.options);
                        $scope.viewModel.purchaseOfMaintenance.project = {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        };
                        angular.forEach($scope.opinions, function (item, index) {
                            if (item.processId !== "InputOpinion") {
                                $scope.baseInfo.notAllOfInputOpinion = true;
                            }
                        });
                    },
                    notAllOfInputOpinion: false,
                    refreshing: false,
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
                        $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfMaintenance.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfMaintenance.costCenterCode = "";
                        $scope.viewModel.purchaseOfMaintenance.costCenterName = "";
                        var param = { corporationCode: corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                            if ($scope.baseInfo.refreshing === false) { wfWaiting.hide(); }
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        $scope.costCenter = [];
                        // $scope.refreshProcess();
                        angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfMaintenance.chargeCompanyName = v.name;
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode, v.data);
                            }
                        });
                        if (!$scope.viewModel.purchaseOfMaintenance.chargeCompanyCode) {
                            $scope.viewModel.option.costCenter = [];
                        }
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
                            if ($scope.baseInfo.refreshing === false) { wfWaiting.hide(); }
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.option.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfMaintenance.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfMaintenance.costCenterName = v.name;
                            }
                        });
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 1) {
                            $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode;
                            $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfMaintenance.costCenterCode;
                        }
                    },
                    // 移除委托信息控件黑名单指定项
                    removeBlackList: function (blackList, item) {
                        for (var i = blackList.length - 1; i >= 0; i--) {
                            if (blackList[i] === item) {
                                blackList.splice(i, 1);
                            }
                        }
                    },
                    // 项目变更  
                    projectChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        if (newVal) {
                            $scope.viewModel.purchaseOfMaintenance.projectCode = newVal.projectCode;
                            $scope.viewModel.purchaseOfMaintenance.projectName = newVal.projectName;
                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList) && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                    purchaseDelegationInfo.supplierCode = '';
                                    purchaseDelegationInfo.supplierName = '';
                                    purchaseDelegationInfo.industryDomainCode = '';
                                    purchaseDelegationInfo.industryDomainName = '';
                                })
                            }
                            $scope.settings.delegationOpts.project = {
                                projectCode: newVal.projectCode,
                                projectName: newVal.projectName
                            };
                            $scope.settings.delegationOpts.blackList.push("project");
                            if (newVal.projectCode) { $scope.refreshProcess(); }
                        }
                        else {
                            $scope.settings.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfMaintenance.projectCode = null;
                            $scope.viewModel.purchaseOfMaintenance.projectName = null;
                            $scope.settings.delegationOpts.project = null;
                            $scope.baseInfo.removeBlackList($scope.settings.delegationOpts.blackList, "project");
                            if (oldVal && oldVal.projectCode) { $scope.refreshProcess(); }
                        }

                    },
                    // 直接委托金额变更  
                    purchaseAmountChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        $scope.refreshProcess();
                    },
                    //使用成本中心
                    useCostCenterChange: function (newValue, oldValue) {
                        $scope.refreshProcess();
                    },
                    //支付类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        });
                        //2022年10月11日需求优化-清空法人、记账公司、成本中心信息
                        $scope.settings.corporationOpts.corporationName = "";
                        if ($scope.viewModel.corporationScopeList && $scope.viewModel.corporationScopeList.length > 0) {
                            $scope.viewModel.corporationScopeList[0].corporationCode = "";
                            $scope.viewModel.corporationScopeList[0].corporationName = "";
                        }
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfMaintenance.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfMaintenance.costCenterCode = "";
                        $scope.viewModel.purchaseOfMaintenance.costCenterName = "";

                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.useCostCenterInfoList = [];
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.settings.useProjectOpts.projectName = "";
                        } else if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = true;
                            $scope.viewModel.useCostCenterInfoList = [];
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.useCostCenterInfoList = [];
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.settings.useProjectOpts.projectName = "";
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                if ($scope.viewModel.mainCostCenterCode && $scope.viewModel.mainCostCenterCode == $scope.viewModel.purchaseOfMaintenance.costCenterCode) {
                                    $scope.refreshProcess();
                                } else {
                                    $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode;
                                    $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfMaintenance.costCenterCode;
                                }
                            }
                        }
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
                        { key: '记账公司', attributeName: 'purchaseOfMaintenance.chargeCompanyCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfMaintenance.costCenterCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '项目名称', attributeName: 'purchaseOfMaintenance.projectCode', validator: new RequiredValidator('请选择！') },
                        { key: '本次拟采购金额（元）', attributeName: 'purchaseBase.purchaseAmount', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfMaintenance.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfMaintenance.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '直接委托理由', attributeName: 'purchaseOfMaintenance.directDelegationReason', validator: new RequiredValidator('不能为空！') },
                        { key: '直接委托理由', attributeName: 'purchaseOfMaintenance.directDelegationReason', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购主责人', attributeName: 'purchaseOfMaintenance.purchaseMainUser', validator: new RequiredValidator('不能为空！') }
                    ]);
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
                    }
                    //使用项目
                    if ($scope.viewModel.isUseProject == true && !$scope.viewModel.purchaseBase.useProjectCode) {
                        modelStateDictionary.addModelError('使用项目', '不能为空!');
                    }
                    //使用成本中心验证
                    if ($scope.viewModel.isUseCostCenter == true) {
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
                                { key: rowKey + '，直接委托供应商', attributeName: 'supplierCode', validator: [new RequiredValidator("请选择！")] },
                                { key: rowKey + '，合同经办人', attributeName: 'operatorUser', validator: [new RequiredValidator("请选择！")] }
                            ]);
                            modelStateDictionary.merge(required);
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
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfMaintenance.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '付款方式描述', attributeName: 'purchaseOfMaintenance.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") }
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    if ($scope.viewModel.purchaseOfMaintenance.cityInput) {
                        model.purchaseOfMaintenance.fullPathId = $scope.viewModel.purchaseOfMaintenance.cityInput.fullPathId;
                        model.purchaseOfMaintenance.fullPathName = $scope.viewModel.purchaseOfMaintenance.cityInput.fullPathName;
                    }
                    if ($scope.viewModel.negativeList) {
                        model.purchaseOfMaintenance.isReadAndAgree = $scope.viewModel.negativeList.confirm;
                    }
                    model.purchaseOfMaintenance.cityInput = null;
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
                    }
                    else {
                        defer.resolve(getCleanModel());
                    }
                };
                $scope.$watch('viewModel.purchaseOfMaintenance.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);
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
                        PurchaseName: $scope.viewModel.purchaseBase.purchaseName,
                        ProjectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                        ApprovalAmountLimit: $scope.viewModel.purchaseBase.purchaseAmount,
                        NcCorporationCode: $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        IsUseProject: $scope.viewModel.isUseProject,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                    };
                    if (!$scope.viewModel.isUseCostCenter) {
                        param.NcCorporationCode = $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode;
                        param.CostCenterCode = $scope.viewModel.purchaseOfMaintenance.costCenterCode;
                    }
                    //使用项目
                    if ($scope.viewModel.isUseProject == true) {
                        param.ProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                    }
                    // 所有参数都填写后再刷新流程
                    if (param.ProjectCode
                        && param.ApprovalAmountLimit
                        && param.NcCorporationCode
                        && param.CostCenterCode) {
                        $scope.baseInfo.refreshing = true;
                        wfOperate.refreshProcess('/DirectCommissionedMaintenanceApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                    $scope.baseInfo.refreshing = false;
                });

                $scope.baseInfo.init();
            }
        ]);
    });