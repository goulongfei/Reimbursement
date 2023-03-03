define(
    [
        'app',
        'corporationRadioSelector',
        'commonUtilExtend',
        'directCommissionedSynthesizeExtend',
        'contractAgreementExtend',
        'engineeringExtend',
        'supplierInfoExtendV4',
    ],
    function (app) {
        app.controller('directCommissionedBusinessOperationsApplication_controller',
            function ($scope, $rootScope, $http,wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(非开发运营类)";
                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = true;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
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

                // 设置
                $scope.settings = {
                    //项目名称
                    projectOpts: {
                        projectName: $scope.viewModel.purchaseOfBusinessOperations.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfBusinessOperations.project = project;
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0) ?
                            $scope.viewModel.corporationScopeList[0].corporationName : '',
                        beforAppend: function (corporation) {
                            if (corporation == null) { return; }
                            $scope.viewModel.corporationScopeList = [];
                            $scope.viewModel.corporationScopeList.push({
                                corporationCode: corporation.corporationCode,
                                corporationName: corporation.corporationName,
                            });
                            $scope.baseInfo.loadChargeCompany(corporation.corporationCode);
                        }
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'isBusinessAgreement': true,
                        'contractAgreementScopeForPurchaseDelegation': $scope.viewModel.contractAgreementScopeList,
                        'reason': $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfBusinessOperations.projectCode,
                            projectName: $scope.viewModel.purchaseOfBusinessOperations.projectName
                        },
                        'blackList': ['delegationAmount', 'reason', 'project'],
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectCode: $scope.viewModel.purchaseOfBusinessOperations.projectCode,
                        projectName: $scope.viewModel.purchaseOfBusinessOperations.projectName,
                        specialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                        specialtyName: $scope.viewModel.purchaseOfBusinessOperations.specialtyName,
                        purchaseWay: $scope.viewModel.purchaseBase.purchaseWayCode,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        isNoContractPruchase: false,
                        multipleSelect: false,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        beforAppend: function (myContract) {
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                $scope.viewModel.contractAgreementScopeList = [];
                            }
                            var isSelected = false;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                    var message = "合约[" + myContract.contractAgreementName + "]已选择！";
                                    sogModal.openAlertDialog("提示", message);
                                    isSelected = true;
                                    return;
                                }
                            });
                            if (!isSelected) {
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += myContract.costTargetAmount;
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                                $scope.settings.delegationOpts.contractAgreementScopeForPurchaseDelegation = $scope.viewModel.contractAgreementScopeList;
                            };
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                agreement.disabled = false;
                                agreement.selected = false;
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += agreement.costTargetAmount;
                            });
                            $scope.settings.delegationOpts.contractAgreementScopeForPurchaseDelegation = $scope.viewModel.contractAgreementScopeList;
                        },
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
                        reasonCode: $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode,
                        reasonName: $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonName
                    },
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },

                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    // 金额控件
                    moneyOpts: {
                        min: 1,
                        max: 9999999999,
                        precision: 2
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.options.chargeCompany = [];
                        $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyName = "";
                        $scope.viewModel.options.costCenter = [];
                        $scope.viewModel.purchaseOfBusinessOperations.costCenterCode = "";
                        $scope.viewModel.purchaseOfBusinessOperations.costCenterName = "";
                        var param = { corporationCode: corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.options.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        angular.forEach($scope.viewModel.options.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfBusinessOperations.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfBusinessOperations.chargeCompanyCode);
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
                            if ($scope.viewModel.purchaseOfBusinessOperations.costCenterCode == v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.costCenterCode = v.code;
                                $scope.viewModel.purchaseOfBusinessOperations.costCenterName = v.name;
                            }
                        });
                        $scope.refreshProcess();
                    },
                    //专业选中下拉框数据变化
                    specialtyChange: function () {
                        angular.forEach($scope.viewModel.options.specialty, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.specialtyCode == v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.specialtyCode = v.code;
                                $scope.viewModel.purchaseOfBusinessOperations.specialtyName = v.name;
                                $scope.settings.contractAgreementOpts.specialtyCode = v.code;
                                $scope.settings.contractAgreementOpts.specialtyName = v.name;
                                $scope.viewModel.contractAgreementScopeList = [];
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                                $scope.settings.delegationOpts.contractAgreementScopeForPurchaseDelegation = [];
                            }
                        });
                        $scope.refreshProcess();
                    },
                    //直接委托理由选中下拉框数据变化
                    commissionReasonChange: function () {
                        angular.forEach($scope.viewModel.options.directDelegationReason, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode == v.code) {
                                if ($scope.viewModel.purchaseDelegationInfoList.length > 0 && $scope.viewModel.purchaseDelegationInfoList[0].supplierName) {
                                    var promise = sogModal.openConfirmDialog("提示", "直接委托理由发生变化，是否重新选择供应商?");
                                    promise.then(function () {
                                        for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                                            $scope.viewModel.purchaseDelegationInfoList[i].supplierCode = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].supplierName = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].industryDomainCode = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].industryDomainName = "";
                                        }
                                        $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode = v.code;
                                        $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonName = v.name;
                                        $scope.baseInfo.commissionReason.reasonCode = v.code;
                                        $scope.baseInfo.commissionReason.reasonName = v.name;
                                        return;
                                    }, function (data) {
                                        $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode = $scope.baseInfo.commissionReason.reasonCode
                                        $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonName = $scope.baseInfo.commissionReason.reasonName
                                    })
                                } else {
                                    $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonCode = v.code;
                                    $scope.viewModel.purchaseOfBusinessOperations.directDelegationReasonName = v.name;
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
                            $scope.viewModel.purchaseOfBusinessOperations.projectCode = newVal.projectCode;
                            $scope.viewModel.purchaseOfBusinessOperations.projectName = newVal.projectName;
                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList) && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                    purchaseDelegationInfo.supplierCode = '';
                                    purchaseDelegationInfo.supplierName = '';
                                    purchaseDelegationInfo.industryDomainCode = '';
                                    purchaseDelegationInfo.industryDomainName = '';
                                })
                            }

                            $scope.settings.contractAgreementOpts.projectCode = newVal.projectCode;
                            $scope.settings.contractAgreementOpts.projectName = newVal.projectName;
                            $scope.settings.delegationOpts.project = {
                                projectCode: newVal.projectCode,
                                projectName: newVal.projectName
                            };
                            $scope.settings.delegationOpts.blackList.push("project");
                        }
                        else {
                            $scope.settings.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfBusinessOperations.projectCode = null;
                            $scope.viewModel.purchaseOfBusinessOperations.projectName = null;

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
                    }
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
                // 发送验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator("不能为空！") },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '项目名称', attributeName: 'purchaseOfBusinessOperations.projectCode', validator: new RequiredValidator("请选择！") },
                        { key: '专业', attributeName: 'purchaseOfBusinessOperations.specialtyCode', validator: new RequiredValidator("请选择！") },
                        { key: '记账公司', attributeName: 'purchaseOfBusinessOperations.chargeCompanyCode', validator: new RequiredValidator("请选择！") },
                        { key: '成本中心', attributeName: 'purchaseOfBusinessOperations.costCenterCode', validator: new RequiredValidator("请选择！") },
                        { key: '直接委托理由', attributeName: 'purchaseOfBusinessOperations.directDelegationReasonCode', validator: new RequiredValidator('请选择！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new RequiredValidator("不能为空！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") }
                    ]);
                    //专业
                    if ($scope.viewModel.purchaseOfBusinessOperations.specialtyCode == 0) {
                        modelStateDictionary.addModelError('专业', '请选择！');
                    }
                    //法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
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
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
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
                $scope.$watch('viewModel.purchaseOfBusinessOperations.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.purchaseOfBusinessOperations.directDelegationReasonCode', $scope.baseInfo.watchReasonChange);

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        ProjectCode: $scope.viewModel.purchaseOfBusinessOperations.projectCode,
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,
                        CostCenterCode: $scope.viewModel.purchaseOfBusinessOperations.costCenterCode,
                        SpecialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                    };
                    if (param.ProjectCode && param.PurchaseAmount && param.CostCenterCode && param.SpecialtyCode) {
                        wfOperate.refreshProcess('/DirectCommissionedBusinessOperationsApplicationWf', $scope.currentActivityId, null, $scope.viewModel, true);
                    }

                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                });
            });
    });