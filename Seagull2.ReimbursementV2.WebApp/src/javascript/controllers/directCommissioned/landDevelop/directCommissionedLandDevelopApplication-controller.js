define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        //'supplierInfoExtendV3',
        'commonUtilExtend',
        'supplierCategoryExtend',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierInfoExtendV4',
    ],
    function (app) {
        app.controller('directCommissionedLandDevelopApplication_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData',
            '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType',
            'seagull2Url',
            'ValidateHelper', 'sogValidator',
            'sogOguType',
            '$filter',
            'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(土地开发类)";
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

                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId && v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                }
                if ($scope.viewModel.corporationScopeList == null || $scope.viewModel.corporationScopeList == undefined || $scope.viewModel.corporationScopeList.length == 0) {
                    $scope.viewModel.corporationScopeList = [];
                    var tempCorporation = {
                        corporationCode: "",
                        corporationName: ""
                    }
                    $scope.viewModel.corporationScopeList.push(tempCorporation);
                }
                // 设置
                $scope.settings = {
                    //项目名称
                    projectOpts: {
                        projectName: $scope.viewModel.purchaseOfLandDevelop.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfLandDevelop.project = project;
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: $scope.viewModel.corporationScopeList[0].corporationName,
                        beforAppend: function (corporation) {
                            $scope.viewModel.corporationScopeList[0].corporationCode = corporation.corporationCode;
                            $scope.viewModel.corporationScopeList[0].corporationName = corporation.corporationName;
                            $scope.baseInfo.loadChargeCompany(corporation.corporationCode);
                        }
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'reason': $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfLandDevelop.projectCode,
                            projectName: $scope.viewModel.purchaseOfLandDevelop.projectName
                        },
                        'blackList': ['delegationAmount', 'reason', 'project'],
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
                        return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode);
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
                };

                //基本信息
                $scope.baseInfo = {
                    //直接委托理由
                    commissionReason: {
                        reasonCode: $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode,
                        reasonName: $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode
                    },
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    peopleSelect: {
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
                    //是否涉及工程
                    InvolveEngineering: function (v) {
                        if (v) {
                            $scope.viewModel.purchaseOfLandDevelop.isInvolveEngineering = true;
                        } else {
                            $scope.viewModel.purchaseOfLandDevelop.isInvolveEngineering = false;
                        }
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.options.chargeCompany = [];
                        $scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfLandDevelop.chargeCompanyName = "";
                        $scope.viewModel.options.costCenter = [];
                        $scope.viewModel.purchaseOfLandDevelop.costCenterCode = "";
                        $scope.viewModel.purchaseOfLandDevelop.costCenterName = "";
                        var param = { corporationCode: corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.options.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        angular.forEach($scope.viewModel.options.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfLandDevelop.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode);
                            }
                        })
                    },

                    //加载成本中心
                    loadCostCenter: function (chargeCompanyCode) {
                        wfWaiting.show();
                        $scope.viewModel.options.costCenter = [];
                        var param = { chargeCompanyCode: chargeCompanyCode };
                        $scope.api.getCostCenterList(param, function (data) {
                            $scope.viewModel.options.costCenter = data;
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.options.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfLandDevelop.costCenterCode == v.code) {
                                $scope.viewModel.purchaseOfLandDevelop.costCenterCode = v.code;
                                $scope.viewModel.purchaseOfLandDevelop.costCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode != 3) {
                            $scope.refreshProcess();
                        }
                    },
                    //直接委托理由选中下拉框数据变化
                    commissionReasonChange: function () {
                        angular.forEach($scope.viewModel.options.directDelegationReason, function (v) {
                            if ($scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode == v.code) {
                                if ($scope.viewModel.purchaseDelegationInfoList.length > 0 && $scope.viewModel.purchaseDelegationInfoList[0].supplierName) {
                                    var promise = sogModal.openConfirmDialog("提示", "直接委托理由发生变化，是否重新选择供应商?");
                                    promise.then(function () {
                                        for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                                            $scope.viewModel.purchaseDelegationInfoList[i].supplierCode = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].supplierName = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].industryDomainCode = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].industryDomainName = "";
                                        }
                                        $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode = v.code;
                                        $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonName = v.name;
                                        $scope.baseInfo.commissionReason.reasonCode = v.code;
                                        $scope.baseInfo.commissionReason.reasonName = v.name;
                                        return;
                                    }, function (data) {
                                        $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode = $scope.baseInfo.commissionReason.reasonCode
                                        $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonName = $scope.baseInfo.commissionReason.reasonName
                                    })
                                } else {
                                    $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode = v.code;
                                    $scope.viewModel.purchaseOfLandDevelop.directDelegationReasonName = v.name;
                                    $scope.baseInfo.commissionReason.reasonCode = v.code;
                                    $scope.baseInfo.commissionReason.reasonName = v.name;
                                }

                            }
                        })
                    },
                    //采购金额变化
                    purchaseAmountChange: function (newValue, oldValue) {
                        if ((newValue) && newValue != oldValue) {
                            $scope.refreshProcess();
                        }
                    },
                    //监听直接委托理由变化，传给委托信息控件
                    watchReasonChange: function (newValue, oldValue) {
                        $scope.settings.delegationOpts.reason = newValue;
                    },
                    // 移除委托信息控件黑名单指定项
                    removeBlackList: function (blackList, item) {
                        for (var i = blackList.length - 1; i >= 0; i--) {
                            if (blackList[i] === item) {
                                blackList.splice(i, 1);
                            }
                        }
                    },
                    // 项目变更 projectChange
                    projectChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        if (newVal) {
                            $scope.viewModel.purchaseOfLandDevelop.projectCode = newVal.projectCode;
                            $scope.viewModel.purchaseOfLandDevelop.projectName = newVal.projectName;
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
                        }
                        else {
                            $scope.settings.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfLandDevelop.projectCode = null;
                            $scope.viewModel.purchaseOfLandDevelop.projectName = null;

                            $scope.settings.delegationOpts.project = null;
                        }
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
                                    $scope.viewModel.options.useCostCenterList = data;
                                })
                        }
                    },
                    useCostCenterChange: function () {
                        angular.forEach($scope.viewModel.options.useCostCenterList, function (v) {
                            if ($scope.viewModel.purchaseBase.useCostCenterCode == v.code) {
                                $scope.viewModel.purchaseBase.useCostCenterCode = v.code;
                                $scope.viewModel.purchaseBase.useCostCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 3) {
                            $scope.refreshProcess();
                        }
                    },
                    //支出类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.options.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.settings.useProjectOpts.projectName = "";
                        } else if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = true;
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                            $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.purchaseBase.useChargeCompanyCode = "";
                            $scope.viewModel.purchaseBase.useChargeCompanyName = "";
                            $scope.viewModel.purchaseBase.useCostCenterCode = "";
                            $scope.viewModel.purchaseBase.useCostCenterName = "";
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.settings.useProjectOpts.projectName = "";
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                $scope.refreshProcess();
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
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator("不能为空！") },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '记账公司', attributeName: 'purchaseOfLandDevelop.chargeCompanyCode', validator: new RequiredValidator("请选择！") },
                        { key: '成本中心', attributeName: 'purchaseOfLandDevelop.costCenterCode', validator: new RequiredValidator("请选择！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfLandDevelop.purchaseContent', validator: new RequiredValidator("不能为空！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfLandDevelop.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购主责人', attributeName: 'purchaseOfLandDevelop.purchaseMainUser', validator: new RequiredValidator("不能为空！") }
                    ]);
                    //直接委托理由
                    if ($scope.viewModel.purchaseOfLandDevelop.directDelegationReasonCode == 0) {
                        modelStateDictionary.addModelError('直接委托理由', '请选择！');
                    }
                    //法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                                 || $scope.viewModel.corporationScopeList.length === 0
                                 || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
                    }
                    //使用项目
                    if ($scope.viewModel.isUseProject == true && !$scope.viewModel.purchaseBase.useProjectCode) {
                        modelStateDictionary.addModelError('使用项目', '不能为空!');
                    }
                    //使用记账公司验证
                    if ($scope.viewModel.isUseCostCenter == true && !$scope.viewModel.purchaseBase.useChargeCompanyCode) {
                        modelStateDictionary.addModelError('使用记账公司', '不能为空!');
                    }
                    //使用成本中心验证
                    if ($scope.viewModel.isUseCostCenter == true && !$scope.viewModel.purchaseBase.useCostCenterCode) {
                        modelStateDictionary.addModelError('使用成本中心', '不能为空!');
                    }
                    //直接委托信息
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
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfLandDevelop.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);

                    return modelStateDictionary;
                };

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
                            //是否有审批人
                            if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length == 0) {
                                sogModal.openAlertDialog('提示', '当前流程没有审批人，无法发送');
                            } else {
                                defer.resolve($scope.viewModel)
                            }
                        }
                    }
                    else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve($scope.viewModel);
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
                            defer.resolve($scope.viewModel);
                        }
                    } else {
                        defer.resolve($scope.viewModel);
                    }
                }

                $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);
                $scope.$watch('viewModel.purchaseOfLandDevelop.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.purchaseOfLandDevelop.directDelegationReasonCode', $scope.baseInfo.watchReasonChange);
                // 刷新流程
                $scope.refreshProcess = function () {
                    if ($scope.viewModel.isUseCostCenter) {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                    } else {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfLandDevelop.costCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfLandDevelop.chargeCompanyCode;
                    }
                    var param = {
                        ProjectCode: $scope.viewModel.purchaseOfLandDevelop.projectCode,
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        ChargeCompanyCode: $scope.viewModel.mainChargeCompanyCode,
                        CorporationCode: $scope.viewModel.corporationScopeList[0].corporationCode,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                        IsUseProject: $scope.viewModel.isUseProject
                    };
                    //使用项目
                    if ($scope.viewModel.isUseProject == true) {
                        param.ProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                    }
                    if (param.ProjectCode && param.PurchaseAmount && param.CostCenterCode && param.ChargeCompanyCode && param.CorporationCode) {
                        wfOperate.refreshProcess('/DirectCommissionedLandDevelopApplicationWf', $scope.currentActivityId, null, param, true);
                    }

                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                }); 
            }]);
    });