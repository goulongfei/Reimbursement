define(
    [
        'app',
        'biddingSynthesizeExtend',
        'commonUtilExtend',
        'engineeringExtend',
        'corporationExtend',
        'supplierInfoExtendV4',
        'dateTimePickerExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseDraft_controller', [
            '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'locals',
            function ($scope, $rootScope, $http, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, locals) {
                angular.extend($scope, viewData);
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

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
                        //return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&IsProject=' + param.isProject);
                        return seagull2Url.getPlatformUrl('/Purchase/GetNotOperationCostControlCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&IsProject=' + param.isProject + '&islimit=' + false);
                    },
                    urlExpenditureTypeList: function (param) {
                        return seagull2Url.getPlatformUrl('/Purchase/GetExpenditureTypeList');
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
                    }
                };

                //设置
                $scope.settings = {
                    //附件设置项
                    fileopts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0,
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
                        min: 0,
                        max: 100000000000,
                        precision: 2
                    },
                    //项目名称
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfFixedAssets.projectName,
                        beforAppend: function (project) {
                            angular.extend(project, {});
                            $scope.viewModel.purchaseOfFixedAssets.project = project;
                            $scope.viewModel.purchaseOfFixedAssets.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfFixedAssets.projectName = project.projectName;

                            $scope.viewModel.supplierScopeList = [];
                            //传递给控件项目编码
                            $scope.settings.supplierScopeOpts.projectList.projectCode = $scope.viewModel.purchaseOfFixedAssets.projectCode;
                            $scope.settings.supplierScopeOpts.projectList.projectName = $scope.viewModel.purchaseOfFixedAssets.projectName;
                            $scope.refreshProcess();
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: '',
                        beforAppend: function (corporation) {
                            if (angular.isArray(corporation) === false) { return; }
                            $scope.viewModel.corporationScopeList = corporation;
                            $scope.baseInfo.loadChargeCompany(corporation);

                        }
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                    },

                    //入围供应商
                    supplierScopeOpts: {
                        formAction: $scope.viewModel.formAction,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                        scene: "Draft",
                        beforAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList.push(supplierData);
                        },
                        afterAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList = supplierData;
                        },
                        projectList: {
                            projectCode: $scope.viewModel.purchaseOfFixedAssets.projectCode,
                            projectName: $scope.viewModel.purchaseOfFixedAssets.projectName
                        },
                        blackList: [],
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "Draft",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
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
                }

                $scope.baseInfo = {
                    refreshCount: 0,
                    isHasRefreshed: false,
                    //是否涉及项目
                    setInvolveProject: function (isProject) {
                        $scope.viewModel.purchaseOfFixedAssets.isInvolveProject = isProject;
                        if (!isProject) {
                            $scope.viewModel.purchaseOfFixedAssets.projectCode = "";
                            $scope.viewModel.purchaseOfFixedAssets.projectName = "";
                            $scope.viewModel.supplierScopeList = [];
                            $scope.settings.projectOpts.projectName = "";
                            $scope.settings.supplierScopeOpts.blackList = [];
                            $scope.refreshProcess();
                        } else {
                            $scope.settings.supplierScopeOpts.blackList = ['project'];
                        }
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporation) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfFixedAssets.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfFixedAssets.costCenterCode = "";
                        $scope.viewModel.purchaseOfFixedAssets.costCenterName = "";
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
                        angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfFixedAssets.chargeCompanyName = v.name;
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode, v.data);
                            }

                        })
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
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.option.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfFixedAssets.costCenterCode == v.code) {
                                $scope.viewModel.purchaseOfFixedAssets.costCenterCode = v.code;
                                $scope.viewModel.purchaseOfFixedAssets.costCenterName = v.name;
                            }
                        });
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 1) {
                            $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode;
                            $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfFixedAssets.costCenterCode;
                        }
                    },
                    // 预计采购金额
                    perPurchaseAmountChange: function () {
                        $scope.refreshProcess();
                    },
                    //使用成本中心
                    useCostCenterChange: function (newValue, oldValue) {
                        $scope.refreshProcess();
                    },
                    //支出类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })

                        //2022年10月11日需求优化-清空法人、记账公司、成本中心信息
                        $scope.settings.corporationOpts.corporationName = "";
                        if ($scope.viewModel.corporationScopeList && $scope.viewModel.corporationScopeList.length > 0) {
                            $scope.viewModel.corporationScopeList[0].corporationCode = "";
                            $scope.viewModel.corporationScopeList[0].corporationName = "";
                        }
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfFixedAssets.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfFixedAssets.costCenterCode = "";
                        $scope.viewModel.purchaseOfFixedAssets.costCenterName = "";

                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2 || $scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.useCostCenterInfoList = [];
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.useCostCenterInfoList = [];
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode;
                                $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfFixedAssets.costCenterCode;
                            }
                        }
                    },
                }

                //页面加载数据
                var load = function () {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId && v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
                    //法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0) {
                        var corporationName = "";
                        angular.forEach($scope.viewModel.corporationScopeList, function (item) {
                            if (item.corporationName) {
                                corporationName += item.corporationName + ";";
                            }
                        });
                        $scope.settings.corporationOpts.corporationName = corporationName;
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

                window.onstorage = function () {
                    var supplierList = locals.getObject('addSupplier');
                    if (supplierList && supplierList.length > 0) {
                        $timeout(function () {
                            $scope.viewModel.supplierScopeList = supplierList;
                        }, 0)
                    }
                }

                $scope.$watch('viewModel.mainCostCenterCode', $scope.baseInfo.useCostCenterChange);

                $scope.refreshProcess = function () {
                    if ($scope.viewModel.isUseCostCenter) {
                        if ($scope.viewModel.useCostCenterInfoList.length > 0) {
                            if ($scope.viewModel.useCostCenterInfoList[0].useChargeCompanyCode && $scope.viewModel.useCostCenterInfoList[0].useCostCenterCode) {
                                $scope.viewModel.mainCostCenterCode = $scope.viewModel.useCostCenterInfoList[0].useCostCenterCode;
                                $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.useCostCenterInfoList[0].useChargeCompanyCode;
                            }
                        }
                    }
                    var corporationCode = null;
                    if (angular.isArray($scope.viewModel.corporationScopeList) && $scope.viewModel.corporationScopeList.length > 0) {
                        corporationCode = $scope.viewModel.corporationScopeList[0].corporationCode;
                    }
                    var param = {
                        ProjectCode: $scope.viewModel.purchaseOfFixedAssets.projectCode,
                        CorporationCode: corporationCode,
                        NcCorporationCode: $scope.viewModel.mainChargeCompanyCode,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        PerPurchaseAmount: $scope.viewModel.purchaseBase.perPurchaseAmount
                    };
                    if (!$scope.viewModel.isUseCostCenter) {
                        param.NcCorporationCode = $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode;
                        param.CostCenterCode = $scope.viewModel.purchaseOfFixedAssets.costCenterCode;
                    }
                    if (param.PerPurchaseAmount
                        && param.CostCenterCode
                        && param.NcCorporationCode
                        && param.CorporationCode) {
                        if ($scope.viewModel.purchaseOfFixedAssets.isInvolveProject === true
                            && !$scope.viewModel.purchaseOfFixedAssets.projectCode) {
                            return;
                        }
                        $scope.sendPefreshRequest(param);
                    }
                };

                $scope.sendPefreshRequest = function (param) {
                    if ($scope.baseInfo.refreshCount > 200) { return; }
                    if ($scope.baseInfo.isHasRefreshed === true) {
                        $scope.baseInfo.refreshCount++;
                        setTimeout(function () { $scope.sendPefreshRequest(param); }, 500);
                    }
                    else {
                        $scope.baseInfo.refreshCount = 0;
                        $scope.baseInfo.isHasRefreshed = true;
                        wfOperate.refreshProcess('/BiddingAssetsPurchaseDraftWf', $scope.currentActivityId, null, param, true);
                    }
                }

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.isHasRefreshed = false;
                    angular.extend($scope.opinionOpts.options, data.opinionOpts.options)
                    if ($scope.baseInfo.refreshCount > 0) { wfWaiting.show(); }
                });


                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator("不能为空！") },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符！") },
                        { key: '是否涉及项目', attributeName: 'purchaseOfFixedAssets.isInvolveProject', validator: new RequiredValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfFixedAssets.chargeCompanyCode', validator: new RequiredValidator("请选择！") },
                        { key: '成本中心', attributeName: 'purchaseOfFixedAssets.costCenterCode', validator: new RequiredValidator("请选择！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfFixedAssets.purchaseContent', validator: new RequiredValidator("不能为空！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfFixedAssets.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
                        { key: '采购主责人', attributeName: 'purchaseOfFixedAssets.purchaseMainUser', validator: new RequiredValidator("采购主责人不能为空！") },
                        { key: '商务负责人', attributeName: 'purchaseOfFixedAssets.businessMainUser', validator: new RequiredValidator("商务负责人不能为空！") },
                        { key: '技术负责人', attributeName: 'purchaseOfFixedAssets.technologyMainUser', validator: new RequiredValidator("技术负责人不能为空！") },
                        { key: '支出类型', attributeName: 'purchaseBase.expenditureTypeCode', validator: new RequiredValidator('不能为空！') }
                    ]);
                    //预计采购金额
                    if (!$scope.viewModel.purchaseBase.perPurchaseAmount || $scope.viewModel.purchaseBase.perPurchaseAmount <= 0) {
                        modelStateDictionary.addModelError('预计采购金额', '预计采购金额(元)必须大于零!');
                    }
                    if ($scope.viewModel.purchaseOfFixedAssets.isInvolveProject && !$scope.viewModel.purchaseOfFixedAssets.projectCode) {
                        modelStateDictionary.addModelError('项目名称', '项目不能为空！');
                    }

                    // 招标人
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('招标人', '不能为空！');
                    }
                    // 采购时间安排
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行采购时间安排';
                            if (!v.replyDeadline) {
                                modelStateDictionary.addModelError("回标截止时间", key + "不能为空！");
                            }
                            if (!v.evaluateBiddingDeadline) {
                                modelStateDictionary.addModelError("评标时间", key + "不能为空！");
                            }
                            if (!v.decideBiddingDeadline) {
                                modelStateDictionary.addModelError("定标时间", key + "不能为空！");
                            }
                        });
                    }
                    //使用成本中心验证
                    if ($scope.viewModel.isUseCostCenter == true && angular.isArray($scope.viewModel.useCostCenterInfoList)) {
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
                    //入围供应商信息
                    if (angular.isArray($scope.viewModel.supplierScopeList)) {
                        if ($scope.viewModel.supplierScopeList.length === 0) {
                            modelStateDictionary.addModelError('入围供应商', '请添加!');
                        }
                    }
                    //招标文件 
                    var biddingFileUploaded = false;
                    if ($scope.viewModel.biddingFile && angular.isArray($scope.viewModel.biddingFile)) {
                        for (var i = 0; i < $scope.viewModel.biddingFile.length; i++) {
                            var item = $scope.viewModel.biddingFile[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                biddingFileUploaded = true;
                            }
                        }
                    }
                    if (biddingFileUploaded === false) {
                        modelStateDictionary.addModelError('招标文件', '请上传！');
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
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符！") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfFixedAssets.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！") },
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
                            defer.resolve($scope.viewModel);
                        }
                    }
                    else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新！")
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

                load();
            }]);
    });