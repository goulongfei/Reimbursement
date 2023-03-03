define(
    [
        'app',
        'commonUtilExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        'projectExtend',
        'corporationExtend',
        'dateTimePickerExtend',
        'biddingSynthesizeExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsApplication_controller',
            function ($scope, viewData, $rootScope, $http, wfOperate, seagull2Url, wfWaiting, sogModal, sogOguType, ValidateHelper, sogValidator, sogWfControlOperationType) {
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

                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100,
                    precision: -1
                };
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
                            $scope.viewModel.corporationScopeList[0].corporationName : '',
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
                            $scope.viewModel.contractAgreementScopeList = [];
                            $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                            $scope.settings.contractAgreementOpts.projectList = projectList;
                            $scope.settings.supplierScopeOpts.projectList = projectList;
                            $scope.refreshProcess();
                        }
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectList: $scope.viewModel.projectScopeList,
                        specialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                        specialtyName: $scope.viewModel.purchaseOfBusinessOperations.specialtyName,
                        purchaseWay: $scope.viewModel.purchaseBase.purchaseWayCode,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        isNoContractPruchase: false,
                        multipleSelect: true,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        beforAppend: function (myContract) {
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false) {
                                $scope.viewModel.contractAgreementScopeList = [];
                            }
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
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += myContract.costTargetAmount;
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                                $scope.refreshProcess();
                            };
                        },
                        beforDelete: function () {
                            $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                            if (angular.isArray($scope.viewModel.contractAgreementScopeList)) {
                                for (var i = 0; i < $scope.viewModel.contractAgreementScopeList.length; i++) {
                                    var agreement = $scope.viewModel.contractAgreementScopeList[i];
                                    $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += agreement.costTargetAmount;
                                }
                            };
                            $scope.refreshProcess();
                        },
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                        'firstLink': true
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: "Draft",
                        blackList: [],
                        projectList: $scope.viewModel.projectScopeList,
                        beforAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList.push(supplierData);
                        },
                        afterAppend: function (supplierScopeList) {
                            $scope.viewModel.supplierScopeList = supplierScopeList;
                        },
                        isMonopolyEditable: false,
                        industryDomainType: $scope.viewModel.industryDomainType,
                        labelTemplateCodeList: $scope.viewModel.labelTemplateCodeList,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsApplication",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //附件设置项
                    fileReady: true,
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    }
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
                }

                // 基本信息
                $scope.baseInfo = {
                    init: function () {
                        $scope.viewModel.negativeList = {
                            confirm: $scope.viewModel.purchaseOfBusinessOperations.isReadAndAgree
                        };
                        this.setOpinionOpts($scope.opinionOpts.options);
                        // 显示审批
                        angular.forEach($scope.opinions, function (item, index) {
                            if (item.processId !== "InputOpinion") {
                                $scope.baseInfo.notAllOfInputOpinion = true;
                            }
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
                        $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfBusinessOperations.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfBusinessOperations.costCenterCode = "";
                        $scope.viewModel.purchaseOfBusinessOperations.costCenterName = "";
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
                            if ($scope.viewModel.purchaseOfBusinessOperations.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.costCenterName = v.name;
                            }
                        })
                        $scope.refreshProcess();
                    },
                    // 专业选中下拉框数据变化
                    specialtyChange: function () {
                        angular.forEach($scope.viewModel.option.specialtyList, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.specialtyCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.specialtyName = v.name;
                                $scope.settings.contractAgreementOpts.specialtyCode = v.code;
                                $scope.settings.contractAgreementOpts.specialtyName = v.name;
                                $scope.viewModel.contractAgreementScopeList = [];
                                $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                            }
                        });
                        $scope.refreshProcess();
                    },
                    // 开标方式选中下拉框数据变化
                    openTenderTypeChange: function () {
                        angular.forEach($scope.viewModel.option.openTenderTypeList, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.openTenderCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.openTenderName = v.name;
                            }
                        });
                    },
                    // 评标方式选中下拉框数据变化
                    enquiryTypeChange: function () {
                        angular.forEach($scope.viewModel.option.enquiryTypeList, function (v) {
                            if ($scope.viewModel.purchaseOfBusinessOperations.enquiryTypeCode === v.code) {
                                $scope.viewModel.purchaseOfBusinessOperations.enquiryTypeName = v.name;
                            }
                        })
                    },
                    // 采购方式选中下拉框数据变化
                    purchasePatternChange: function () {
                        angular.forEach($scope.viewModel.option.purchasePatternList, function (v) {
                            if ($scope.viewModel.purchaseBase.purchaseWayCode === v.code) {
                                $scope.viewModel.purchaseBase.purchaseWayName = v.name;
                            }
                        })
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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '采购方式', attributeName: 'purchaseBase.purchaseWayCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '项目名称', attributeName: 'projectScopeList', validator: new RequiredValidator('请选择！') },
                        { key: '专业', attributeName: 'purchaseOfBusinessOperations.specialtyCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfBusinessOperations.chargeCompanyCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfBusinessOperations.costCenterCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '开标方式', attributeName: 'purchaseOfBusinessOperations.openTenderCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '评标方式', attributeName: 'purchaseOfBusinessOperations.enquiryTypeCode', validator: new RequiredSelectValidator('请选择！') },
                        { key: '本次招标范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次招标范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
                        { key: '采购负责人', attributeName: 'purchaseOfBusinessOperations.purchaseMainUser', validator: new RequiredSelectValidator('请选择！') },
                        { key: '商务负责人', attributeName: 'purchaseOfBusinessOperations.businessMainUser', validator: new RequiredSelectValidator('请选择！') },
                        { key: '技术负责人', attributeName: 'purchaseOfBusinessOperations.technologyMainUser', validator: new RequiredSelectValidator('请选择！') }
                    ]);
                    if ($scope.viewModel.purchaseOfBusinessOperations.enquiryTypeCode == 2) {
                        if ($scope.viewModel.purchaseOfBusinessOperations.businessScale == undefined || $scope.viewModel.purchaseOfBusinessOperations.businessScale == null) {
                            modelStateDictionary.addModelError('商务标占比', '不能为空！');
                        } else if ($scope.viewModel.purchaseOfBusinessOperations.businessScale <= 0 || $scope.viewModel.purchaseOfBusinessOperations.businessScale >= 100) {
                            modelStateDictionary.addModelError('商务标占比', '应该大于0并且小于100！');
                        }

                        if ($scope.viewModel.purchaseOfBusinessOperations.technologyScale == undefined || $scope.viewModel.purchaseOfBusinessOperations.technologyScale == null) {
                            modelStateDictionary.addModelError('技术标占比', '不能为空！');
                        } else if ($scope.viewModel.purchaseOfBusinessOperations.technologyScale <= 0 || $scope.viewModel.purchaseOfBusinessOperations.technologyScale >= 100) {
                            modelStateDictionary.addModelError('技术标占比', '应该大于0并且小于100！');
                        }
                        if ($scope.viewModel.purchaseOfBusinessOperations.businessScale && $scope.viewModel.purchaseOfBusinessOperations.technologyScale) {
                            if (($scope.viewModel.purchaseOfBusinessOperations.businessScale + $scope.viewModel.purchaseOfBusinessOperations.technologyScale) != 100) {
                                modelStateDictionary.addModelError('商务标占比和技术标占比', '必须等于100！');
                            }
                        }
                    }
                    //   项目名称
                    if (angular.isArray($scope.viewModel.projectScopeList) === false
                        || $scope.viewModel.projectScopeList.length === 0) {
                        modelStateDictionary.addModelError('项目名称', '请选择！');
                    }
                    //  招标人
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0) {
                        modelStateDictionary.addModelError('招标人', '请选择！');
                    }
                    // 采购时间安排
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行采购时间安排';
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
                    // 合约规划
                    if (angular.isArray($scope.viewModel.contractAgreementScopeList) === false
                        || $scope.viewModel.contractAgreementScopeList.length === 0) {
                        modelStateDictionary.addModelError('合约规划', '请添加！');
                    }
                    // 入围供应商
                    if (angular.isArray($scope.viewModel.supplierScopeList) === false || $scope.viewModel.supplierScopeList.length === 0) {
                        modelStateDictionary.addModelError('入围供应商', '请添加！');
                    } else {
                        //招标
                        if ($scope.viewModel.purchaseBase.purchaseWayCode === 3 && $scope.viewModel.supplierScopeList.length < 3) {
                            modelStateDictionary.addModelError('入围供应商', '入围供应商必须≥3家！');
                        }
                        //询价
                        if ($scope.viewModel.purchaseBase.purchaseWayCode === 2 && $scope.viewModel.supplierScopeList.length < 2) {
                            modelStateDictionary.addModelError('入围供应商', '入围供应商必须≥2家！');
                        }
                    }
                    if ($scope.viewModel.biddingFile == null || $scope.viewModel.biddingFile.length == 0) {
                        modelStateDictionary.addModelError("附件", "标书附件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.biddingFile, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "标书附件不能为空");
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
                        { key: '本次招标范围和内容', attributeName: 'purchaseOfBusinessOperations.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
                    ]);
                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
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

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        ProjectScopeList: $scope.viewModel.projectScopeList,
                        PurchaseCostTargetAmount: $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount,
                        CostCenterCode: $scope.viewModel.purchaseOfBusinessOperations.costCenterCode,
                        SpecialtyCode: $scope.viewModel.purchaseOfBusinessOperations.specialtyCode,
                    };
                    if (!$scope.viewModel.purchaseOfBusinessOperations.contractAgreementTypeCode) {
                        $scope.viewModel.purchaseOfBusinessOperations.contractAgreementTypeCode = 0;
                    }
                    if (param.ProjectScopeList && param.CostCenterCode && param.SpecialtyCode && param.PurchaseCostTargetAmount) {
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
                        wfOperate.refreshProcess('/BiddingBusinessOperationsApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                }

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                    // 从合约汇总成本目标切换到填写成本目标时，需要把合约汇总数清空
                    $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount = 0;
                    angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreement) {
                        $scope.viewModel.purchaseOfBusinessOperations.purchaseCostTargetAmount += agreement.costTargetAmount;
                    });
                    $scope.baseInfo.refreshing = false;
                    if ($scope.baseInfo.refreshCount > 0) { wfWaiting.show(); }
                });

                $scope.baseInfo.init();
            }
        );
    });
