define(
    [
        'app',
        'tiger-balm',
        'linqjs',
        'corporationRadioSelector',
        'commonUtilExtend',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'contractAgreementExtend',
        "autoCompleteExtend",
        'governmentSelectorExtend'
    ],
    function (app) {

        app.controller('businessOperationsApplication_controller', [
            '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator',
            function ($scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator) {

                angular.extend($scope, viewData);

                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = true;//作废
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowComment = false;  //评论
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                //流程标题
                $scope.mainTitle = '采购管理';
                $scope.title = '无合同采购（非开发运营类）';
                if ($scope.viewModel.isNonContractAdditional)
                    $scope.title = "无合同采购补录（非开发运营类）";

                //基本信息
                $scope.baseInfo = {
                    // 无合同采购申请报告
                    purchaseOfNoContractApplicationFileOpts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'className': null,
                        'preview': false,
                        'fileNumLimit': 10,//附件最大上传个数
                    },
                    // 付款计算明细
                    payCaculationDetailFileOpts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'className': null,
                        'preview': false,
                        'fileNumLimit': 10,//附件最大上传个数
                    },
                    // 收费依据文件
                    chargeAccordingFileOpts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'className': null,
                        'preview': false,
                        'fileNumLimit': 10,//附件最大上传个数
                    },
                    moneyopts: {
                        min: 0,
                        max: 100000000000,
                        precision: 2
                    },
                    //项目名称
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfBusinessOperations.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfBusinessOperations.project = project;
                            $scope.viewModel.purchaseOfBusinessOperations.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfBusinessOperations.projectName = project.projectName;
                            $scope.baseInfo.contractAgreementOpts.projectCode = project.projectCode;
                            $scope.baseInfo.contractAgreementOpts.projectName = project.projectName;
                        }
                    },
                    // 项目变更 projectChange
                    projectChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        if (newVal) {
                            $scope.viewModel.purchaseOfBusinessOperations.projectCode = newVal.projectCode;
                            $scope.viewModel.purchaseOfBusinessOperations.projectName = newVal.projectName;
                            $scope.api.deleteContractAgreementScopeInfoList();
                        }
                        else {
                            $scope.baseInfo.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfBusinessOperations.projectCode = null;
                            $scope.viewModel.purchaseOfBusinessOperations.projectName = null;
                            $scope.api.deleteContractAgreementScopeInfoList();
                        }
                    },
                    //专业下拉框选中后数据变化
                    specialtyChange: function () {
                        angular.forEach($scope.viewModel.option.specialtyList, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.specialtyCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.specialtyName = v.name;
                                $scope.baseInfo.contractAgreementOpts.specialtyCode = v.code;
                                $scope.baseInfo.contractAgreementOpts.specialtyName = v.name;
                            }
                        })
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0)
                            ? $scope.viewModel.corporationScopeList[0].corporationName
                            : null,
                        beforAppend: function (corporation) {
                            if (angular.isArray($scope.viewModel.corporationScopeList) === false || $scope.viewModel.corporationScopeList.length === 0) {
                                $scope.viewModel.corporationScopeList = [{}];
                            }
                            $scope.viewModel.corporationScopeList[0].corporationCode = corporation.corporationCode;
                            $scope.viewModel.corporationScopeList[0].corporationName = corporation.corporationName;
                            //记账公司
                            $scope.baseInfo.loadChargeCompany(corporation.corporationCode);
                        }
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfBusinessOperations.costCenterCode = "";
                        $scope.viewModel.purchaseOfBusinessOperations.costCenterName = "";
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
                            if ($scope.viewModel.purchaseOfBusinessOperations.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.costCenterName = v.name;
                            }
                        });
                        $scope.refreshProcess();
                    },
                    // 采购金额变更 purchaseAmountChange
                    purchaseAmountChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        if (newVal) {
                            $scope.viewModel.purchaseBase.purchaseAmount = newVal;
                            $scope.refreshProcess();
                        }
                    },
                    //收款单位(政府)
                    governmentOpts: {
                        dataList: $scope.viewModel.option.chargeUnitList,
                        inintStr: $scope.viewModel.purchaseOfBusinessOperations.chargeUnitName,
                        afterSelected: function (item) {
                            if (item != null) {
                                $scope.viewModel.purchaseOfBusinessOperations.chargeUnitCode = item.code;
                                $scope.viewModel.purchaseOfBusinessOperations.chargeUnitName = item.name;
                            }
                        }
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectCode: $scope.viewModel.purchaseOfBusinessOperations.projectCode,
                        projectName: $scope.viewModel.purchaseOfBusinessOperations.projectName,
                        specialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                        specialtyName: $scope.viewModel.purchaseOfBusinessOperations.specialtyName,
                        purchaseWay: $scope.viewModel.purchaseBase.purchaseWayCode,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        isNonContractbusinessOperationsAdditional: $scope.viewModel.isNonContractAdditional ? true : false,
                        isNoContractPruchase: true,
                        multipleSelect: false,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        beforAppend: function (myContract) {
                            if ($scope.viewModel.contractAgreementScopeList && $scope.viewModel.contractAgreementScopeList.length > 0) {
                                sogModal.openAlertDialog("提示", "已经存在一个合约,增加失败");
                                return;
                            } else {

                                angular.forEach(myContract.contractAgreementSplitInfoList, function (item) {
                                    if (item.year < myContract.useYear) {
                                        item.isCanApportion = false;
                                    } else {
                                        item.isCanApportion = true;
                                    }
                                });
                                console.log("返回合约");
                                console.log(myContract);
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
                                    $scope.viewModel.contractAgreementScopeList.push(myContract);
                                    $scope.baseInfo.amountChange();
                                };
                            }
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseBase.purchaseAmount = 0;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += agreement.costTargetAmount;
                            });
                        },
                    },
                    //分摊金额变动
                    amountChange: function () {
                        $scope.baseInfo.costTargetAmountHeji = 0;
                        $scope.baseInfo.actualAmountHeji = 0;
                        $scope.baseInfo.accumulativeHappenedHeji = 0;
                        $scope.baseInfo.surplusValueWithTaxHeji = 0;
                        if ($scope.viewModel.contractAgreementScopeList != null && $scope.viewModel.contractAgreementScopeList.length > 0) {
                            angular.forEach($scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList, function (splitInfo) {
                                if (!splitInfo.actualAmount) {
                                    splitInfo.actualAmount = 0;
                                }
                                if (splitInfo.isCanApportion) {
                                    let tempValue = splitInfo.costTargetAmount - splitInfo.actualAmount - splitInfo.accumulativeHappenedAmountWithTax;
                                    if (tempValue < 0) {
                                        splitInfo.actualAmount = 0;
                                        sogModal.openAlertDialog("提示", "余量不可小于0");
                                    }
                                    splitInfo.surplusValueWithTax = tempValue;
                                    $scope.baseInfo.actualAmountHeji = $scope.baseInfo.actualAmountHeji + splitInfo.actualAmount;
                                }
                                $scope.baseInfo.costTargetAmountHeji += parseFloat(splitInfo.costTargetAmount);
                                $scope.baseInfo.accumulativeHappenedHeji += parseFloat(splitInfo.accumulativeHappenedAmountWithTax);
                            });
                            $scope.baseInfo.surplusValueWithTaxHeji = $scope.baseInfo.costTargetAmountHeji - $scope.baseInfo.actualAmountHeji - $scope.baseInfo.accumulativeHappenedHeji;
                            $scope.viewModel.purchaseBase.purchaseAmount = $scope.baseInfo.actualAmountHeji;
                        }
                    },
                    costTargetAmountHeji: 0,       //合计科目成本
                    actualAmountHeji: 0,           //合计分摊金额
                    accumulativeHappenedHeji: 0,   //合计已发生采购
                    surplusValueWithTaxHeji: 0,    //合计余量                    
                };
                $scope.baseInfo.amountChange();

                //页面所用函数
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
                    // 删除合约规划
                    deleteContractAgreementScopeInfoList: function () {
                        if ($scope.viewModel.contractAgreementScopeList != null && $scope.viewModel.contractAgreementScopeList.length > 0) {
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.api.deletecontractAgreementSplitInfoList();
                        };
                        $scope.viewModel.purchaseBase.purchaseAmount = 0;
                    },
                    // 删除成本科目
                    deletecontractAgreementSplitInfoList: function () {
                        if ($scope.viewModel.contractAgreementSplitInfoList !== undefined && $scope.viewModel.contractAgreementSplitInfoList.length > 0) {
                            angular.forEach($scope.viewModel.contractAgreementSplitInfoList, function () {
                                $scope.viewModel.contractAgreementScopeList.contractAgreementSplitInfoList = [];
                                $scope.viewModel.contractAgreementSplitInfoList = [];
                            })
                        };
                        $scope.viewModel.purchaseBase.purchaseAmount = 0;
                    },
                };

                $scope.$watch('viewModel.purchaseOfBusinessOperations.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);

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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '项目名称', attributeName: 'purchaseOfBusinessOperations.projectCode', validator: new RequiredValidator('请选择！') },
                        { key: '专业', attributeName: 'purchaseOfBusinessOperations.specialtyCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfBusinessOperations.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfBusinessOperations.costCenterCode', validator: new RequiredValidator('请选择！') },
                        { key: '收款单位', attributeName: 'purchaseOfBusinessOperations.chargeUnitName', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new RequiredValidator('不能为空！') }
                    ]);
                    if (!$scope.viewModel.purchaseBase.purchaseAmount) {
                        modelStateDictionary.addModelError('本次采购金额', '本次采购金额不能为0!');
                    }
                    // 法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
                    }
                    // 合约规划
                    if (!$scope.viewModel.contractAgreementScopeList ||
                        $scope.viewModel.contractAgreementScopeList.length == 0) {
                        modelStateDictionary.addModelError('合约规划', '不能为空！');
                    }
                    //付款计算明细文件
                    if ($scope.viewModel.payCaculationDetailFiles == null || $scope.viewModel.payCaculationDetailFiles.length == 0) {
                        modelStateDictionary.addModelError("附件", "付款计算明细文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.payCaculationDetailFiles, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "付款计算明细文件不能为空");
                        }
                    }
                    if ($scope.viewModel.isNonContractAdditional) {
                        //补录文件
                        if ($scope.viewModel.purchaseOfNoContractApplicationFiles == null || $scope.viewModel.purchaseOfNoContractApplicationFiles.length == 0) {
                            modelStateDictionary.addModelError("附件", "无合同采购补录报告(商写)不能为空");
                        } else {
                            var count = 0;
                            angular.forEach($scope.viewModel.purchaseOfNoContractApplicationFiles, function (file) {
                                if (!file.isDeleted) {
                                    count++;
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("附件", "无合同采购补录报告(商写)不能为空");
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
                    ]);
                    return modelStateDictionary;
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,
                        ProjectCode: $scope.viewModel.purchaseOfBusinessOperations.projectCode,
                        SpecialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                        CostCenterCode: $scope.viewModel.purchaseOfBusinessOperations.costCenterCode,
                        CostCenterName: $scope.viewModel.purchaseOfBusinessOperations.costCenterName
                    };
                    if (!param.PurchaseAmount) { param.PurchaseAmount = 0; }
                    if (param.PurchaseAmount != 0 && param.CostCenterCode != "") {
                        wfOperate.refreshProcess('/BusinessOperationsApplicationWf', $scope.currentActivityId, null, $scope.viewModel, true);
                    }
                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts)
                });
                //提交数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (e.operationType === sogWfControlOperationType.MoveTo) { //发送
                        result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
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
                    else if (e.operationType === sogWfControlOperationType.Save) { //保存
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve($scope.viewModel);
                        }
                    }
                    else {
                        defer.resolve($scope.viewModel);
                    }
                };
            }]);
    });
