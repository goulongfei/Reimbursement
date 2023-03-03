define(
    [
        'app',
        'commonUtilExtend',
        'bidSectionInfoExtend',
        'biddingSynthesizeExtend',
        'contractAgreementExtend',
        'signContractExtend',
        'leftNavExtend',
        'contractExtend',
    ],
    function (app) {
        app.controller('biddingImplementAward_controller', [
            '$scope', 'viewData',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator', 'rcTools',
            'sogWfControlOperationType', '$rootScope', 'wfOperate', '$http', 'configure',
            function ($scope, viewData,
                wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
                sogWfControlOperationType, $rootScope, wfOperate, $http, configure) {

                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoAbort = false; //作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false; //一撤到底 
                $scope.isApproval = true;
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
                //根据采购类别判断是否显示招标清单
                if ($scope.viewModel.purchaseOfImplement.purchaseCategoryCode == 1) {
                    $scope.isShowTenderFile = true;
                }

                // 设置 
                $scope.settings = {
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
                        isShowExpenditureType: $scope.viewModel.isShowExpenditureType,
                        multipleSelect: true,
                        isAward: true,
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
                                    if (c.validStatus === true) {
                                        var message = "合约[" + myContract.contractAgreementName + "]已选择！";
                                        sogModal.openAlertDialog("提示", message);
                                    }
                                    else {
                                        c.validStatus = true;
                                    }
                                    isSelected = true;
                                    return;
                                }
                            });
                            if (!isSelected) {
                                $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount += myContract.costTargetAmount;
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                                $scope.settings.bidSectionInfoOpts.contractAgreementScopeList = $scope.viewModel.contractAgreementScopeList;
                            };
                        },
                        beforDelete: function () {
                            $scope.settings.bidSectionInfoOpts.contractAgreementScopeList = $scope.viewModel.contractAgreementScopeList;
                            $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = 0;
                            angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                                $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount += agreement.validStatus ? agreement.costTargetAmount : 0;
                            });
                        },
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                         'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Award',
                    },
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'Award',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        isNeedAgreement: true,
                        projectList: $scope.viewModel.projectScopeList,
                        stageAreaList: $scope.viewModel.stageAreaScopeList,
                        contractAgreementScopeList: $scope.viewModel.contractAgreementScopeList,
                        contractAgreementTypeCode: $scope.viewModel.purchaseOfImplement.contractAgreementTypeCode,
                        processActivityInfoList: $scope.viewModel.processActivityInfoList,
                        afterEdit: function (v) {
                            $scope.settings.signContractOpts.awardSupplierList = [];
                            $scope.viewModel.totalBiddingTotalPrice = 0;
                            for (var i = 0; i < length; i++) {
                                $scope.viewModel.replySupplierScopeList[i].isWinTheBidding = false;
                            }
                            angular.forEach($scope.viewModel.biddingSectionInfoList, function (item, index) {
                                if (angular.isArray(item.supplierBiddingSectionList)) {
                                    for (var i = 0; i < item.supplierBiddingSectionList.length; i++) {
                                        var scope = item.supplierBiddingSectionList[i];
                                        if (scope.isWinTheBidding) {
                                            $scope.settings.signContractOpts.awardSupplierList.push({ code: scope.supplierCode, name: scope.supplierName });
                                            angular.forEach($scope.viewModel.replySupplierScopeList, function (item, index) {
                                                if (item.supplierCode === scope.supplierCode) {
                                                    item.isWinTheBidding = scope.isWinTheBidding;
                                                }
                                            });
                                        }
                                    }
                                }
                                // 中标总金额
                                $scope.viewModel.totalBiddingTotalPrice += item.biddingTotalPrice;
                            });
                        },
                        //甲指修改成本目标
                        afterCostTargetEdit: function (v) {
                            $scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount = v;
                        },
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
                    },
                    //拟签订合同信息
                    signContractOpts: {
                        scene: 'Award',
                        corporationScopeList: $scope.viewModel.corporationScopeList,
                        awardSupplierList: $scope.viewModel.option.awardSupplierList,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingImplementAward",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: "Award",
                        projectList: $scope.viewModel.projectScopeList,
                        supplierCatagory: $scope.viewModel.industryDomainScope,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        } else {
                            if (error) {
                                sogModal.openErrorDialog(error).then(function () { });
                            }
                        }
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                    },
                    // 设置是否发放澄清问卷
                    setIsGrantWinBiddingNotice: function (val) {
                        $scope.viewModel.purchaseOfImplement.isGrantWinBiddingNotice = val;
                        $scope.refreshProcess();
                    },
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
                            contractAgreementCode: data.planContractCode ? data.planContractCode : data.contractAgreementCode,
                            contractAgreementName: data.planContractName ? data.planContractName : data.contractAgreementName,
                            contractAgreementTypeCode: data.contractPlanTypeCode ? data.contractPlanTypeCode : data.contractAgreementTypeCode,
                            contractAgreementTypeName: data.contractPlanTypeCnName ? data.contractPlanTypeCnName : data.contractAgreementTypeName,
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
                    urlSaveSupplierLabelOptions: function () {
                        return $scope.common.apiUrlBase + '/THRWebApi/SupplierV2/LabelForOut/PurchaseSaveSupplierLabelOptions?r=' + Math.random();
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

                // 保存标签
                function saveLabel(func) {
                    if (!$scope.settings.supplierScopeOpts.model.industryDomainWithLabel
                        || !$scope.settings.supplierScopeOpts.model.industryDomainListForPricePerSquareMeter) {
                        func();
                        return;
                    }
                    wfWaiting.show();
                    if (angular.isArray($scope.viewModel.replySupplierScopeList) === false) { return; }
                    var saveData = [];
                    for (var i = 0; i < $scope.viewModel.replySupplierScopeList.length; i++) {
                        var item = $scope.viewModel.replySupplierScopeList[i];
                        if (item.labelTemplate) {
                            var template = JSON.parse(JSON.stringify(item.labelTemplate));
                            template.items = template.editItems;
                            saveData.push(template);
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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [{
                        key: '采购名称',
                        attributeName: 'purchaseBase.purchaseName',
                        validator: new RequiredValidator('不能为空！')
                    },
                    {
                        key: '定标专项单方',
                        attributeName: 'purchaseOfImplement.calibrationSpecialPrice',
                        validator: new RequiredValidator('不能为空！')
                    },
                    {
                        key: '建筑面积',
                        attributeName: 'purchaseOfImplement.buildingArea',
                        validator: new RequiredValidator('不能为空！')
                    },
                    {
                        key: '建设单方成本目标',
                        attributeName: 'purchaseOfImplement.buildingCostTargetPerArea',
                        validator: new RequiredValidator('不能为空！')
                    },
                    {
                        key: '是否发放中标通知',
                        attributeName: 'purchaseOfImplement.isGrantWinBiddingNotice',
                        validator: new RequiredValidator('请选择！')
                    }
                    ]);
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
                    // 选择合约规划 
                    // 合约信息
                    if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false ||
                        $scope.viewModel.contractAgreementScopeList.length === 0) {
                        modelStateDictionary.addModelError('合约规划', '请添加！');
                    }
                    // 拟签订合同信息
                    if (angular.isArray($scope.viewModel.perSignContractInfoList) === false ||
                        $scope.viewModel.perSignContractInfoList.length === 0) {
                        modelStateDictionary.addModelError('拟签订合同信息', '请添加！');
                    } else {
                        for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                            var item = $scope.viewModel.perSignContractInfoList[i];
                            if (!item.contractName) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同名称', '不能为空！');
                            }
                            if (item.contractName && item.contractName.length > 256) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同名称', '不能大于256个字符！');
                            }
                            if (!item.corporationCode) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，甲方（法人公司）', '请选择！');
                            }
                            if (!item.supplierCode) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，他方（供应商）', '请选择！');
                            }
                            if (!item.perSignContractAmount) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同金额（元）', '不能为空！');
                            }
                            if (!item.operatorUser) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同经办人', '请选择！');
                            }
                            if (angular.isArray(item.perSignContractAgreementScopeInfoList) === false ||
                                item.perSignContractAgreementScopeInfoList.length === 0) {
                                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，所属合约', '请选择！');
                            }
                        }
                    }
                    // 定标单方
                    if ($scope.settings.supplierScopeOpts.model.industryDomainListForPricePerSquareMeter) {
                        if (angular.isArray($scope.viewModel.replySupplierScopeList)) {
                            for (var i = 0; i < $scope.viewModel.replySupplierScopeList.length; i++) {
                                var item = $scope.viewModel.replySupplierScopeList[i];
                                if (!item.labelLC90117.figure && item.labelLC90117.figure !== 0) {
                                    modelStateDictionary.addModelError(item.supplierName + '-' + item.labelLC90117.title, '不能为空！');
                                }
                            }
                        }
                    }
                    // 审批流
                    if (angular.isArray($scope.opinionOpts.options) === false ||
                        $scope.opinionOpts.options.length === 0) {
                        modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    model.option = null;
                    for (var i = 0; i < $scope.viewModel.biddingSectionInfoList.length; i++) {
                        var item = $scope.viewModel.biddingSectionInfoList[i];
                        var giveUpUnitCount = parseInt(item.giveUpUnitCount);
                        if (angular.isNumber(giveUpUnitCount) === false || isNaN(giveUpUnitCount)) {
                            item.giveUpUnitCount = null;
                        }

                    }
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
                            saveLabel(function () { defer.resolve(getCleanModel()); });
                        }
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            saveLabel(function () { defer.resolve(getCleanModel()); });
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

                // 刷新流程
                $scope.refreshProcess = function () {
                    //改成传页面对象
                    wfOperate.refreshProcess('/BiddingImplementAwardWf', $scope.currentActivityId, null, $scope.viewModel, true);
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    rcTools.setOpinionOpts(data.opinionOpts.options);
                    rcTools.setProcessNavigator(data.processNavigator);
                });

                $scope.baseInfo.init();
            }
        ]);
    });