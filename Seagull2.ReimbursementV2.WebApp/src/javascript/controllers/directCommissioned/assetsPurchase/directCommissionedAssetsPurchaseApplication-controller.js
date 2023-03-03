define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        //'supplierInfoExtendV3',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierCategoryExtend',
        'fixedAssetsExtend',
        'supplierInfoExtendV4',
        'useCostCenterExtend'
    ],
    function (app) {

        app.controller('directCommissionedAssetsPurchaseApplication_controller', [
            '$scope', '$rootScope', '$http', 'wfOperate', 'viewData',
            'wfWaiting', 'sogModal',
            'sogWfControlOperationType',
            'seagull2Url',
            'ValidateHelper', 'sogValidator',
            'sogOguType', '$window',
            function ($scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal,
                sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $window) {

                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowCirculate = false;//传阅  
                viewData.wfOperateOpts.allowPrint = false;//打印 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                $scope.isSeletProject = false;//是否选择项目
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（固定资产采购类）';
                $scope.isOpinionsShow = false;
                if ($scope.opinions.length > 0) {
                    angular.forEach($scope.opinions, function (v) {
                        if (v.processId !== "InputOpinion") {
                            $scope.isOpinionsShow = true;
                        }
                    });
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

                //基本信息
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                        $scope.viewModel.purchaseOfFixedAssets.project = {
                            projectCode: $scope.viewModel.purchaseOfFixedAssets.projectCode,
                            projectName: $scope.viewModel.purchaseOfFixedAssets.projectName
                        };
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
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //项目
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfFixedAssets.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfFixedAssets.project = project;
                        }
                    },
                    //是否涉及项目
                    InitProjectInfo: function (v) {
                        if (v === true) {
                            this.projectChange({});
                        } else {
                            this.projectChange(null);
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
                            $scope.viewModel.purchaseOfFixedAssets.projectCode = newVal.projectCode;
                            $scope.viewModel.purchaseOfFixedAssets.projectName = newVal.projectName;
                            $scope.viewModel.purchaseOfFixedAssets.isInvolveProject = true;
                            $scope.baseInfo.delegationOpts.project = {
                                projectCode: newVal.projectCode,
                                projectName: newVal.projectName
                            };
                            $scope.baseInfo.delegationOpts.blackList.push("project");
                            if (newVal.projectCode) { $scope.refreshProcess(); }
                        }
                        else {
                            $scope.baseInfo.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfFixedAssets.projectCode = null;
                            $scope.viewModel.purchaseOfFixedAssets.projectName = null;
                            $scope.viewModel.purchaseOfFixedAssets.isInvolveProject = false;
                            $scope.baseInfo.delegationOpts.project = null;
                            $scope.baseInfo.removeBlackList($scope.baseInfo.delegationOpts.blackList, "project");
                            if (oldVal && oldVal.projectCode) { $scope.refreshProcess(); }
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
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfFixedAssets.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfFixedAssets.costCenterCode = "";
                        $scope.viewModel.purchaseOfFixedAssets.costCenterName = "";
                        var param = { corporationCode: corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        //$scope.costCenter = [];
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
                            if ($scope.viewModel.purchaseOfFixedAssets.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfFixedAssets.costCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 1) {
                            $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode;
                            $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfFixedAssets.costCenterCode;
                        }
                    },
                    // 本次直接委托金额变更
                    purchaseAmountChange: function (newValue, oldValue) {
                        if (newValue === oldValue) { return; }
                        if (newValue) {
                            $scope.viewModel.purchaseBase.purchaseAmount = newValue;
                            $scope.refreshProcess();
                        }
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 2,
                        'scene': 'application',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'fixedAssetsList': $scope.viewModel.fixedAssetsList,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfFixedAssets.projectCode,
                            projectName: $scope.viewModel.purchaseOfFixedAssets.projectName
                        },
                        'blackList': ['delegationAmount'],
                        'tinyAmount': 50000,
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
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
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
                        $scope.baseInfo.corporationOpts.corporationName = "";
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
                };
                //  查看上游流程
                $scope.lookFixedAssets = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = $scope.viewModel.purchaseOfFixedAssets.upstreamProcessURL;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看上游流程异常");
                            wfWaiting.hide();
                        });
                }
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
                        //return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&isProject=' + param.isProject);
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
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') },
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        //{ key: '法人公司', attributeName: '', validator: new RequiredValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfFixedAssets.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfFixedAssets.costCenterCode', validator: new RequiredValidator('请选择！') },
                        { key: '直接委托理由', attributeName: 'purchaseOfFixedAssets.directDelegationReason', validator: new RequiredValidator('不能为空！') },
                        { key: '直接委托理由', attributeName: 'purchaseOfFixedAssets.directDelegationReason', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfFixedAssets.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfFixedAssets.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购主责人', attributeName: 'purchaseMainUser', validator: new RequiredValidator('不能为空！') },
                        { key: '支出类型', attributeName: 'purchaseBase.expenditureTypeCode', validator: new RequiredValidator('不能为空！') }
                    ]);
                    //项目
                    if ($scope.viewModel.purchaseOfFixedAssets.isInvolveProject) {
                        if (!$scope.viewModel.purchaseOfFixedAssets.projectName) {
                            modelStateDictionary.addModelError('项目名称', '请选择！');
                        }
                    }
                    if ($scope.viewModel.corporationScopeList[0].corporationCode === "" || $scope.viewModel.corporationScopeList[0].corporationCode === null) {
                        modelStateDictionary.addModelError('法人公司', '请选择！');
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
                    //直接委托信息
                    if ($scope.viewModel.purchaseDelegationInfoList.length == 0) modelStateDictionary.addModelError("直接委托信息", "请至少添加一行直接委托信息");
                    if ($scope.viewModel.purchaseDelegationInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行委托信息 ';
                            if (!v.delegationAmount) {
                                modelStateDictionary.addModelError("委托金额	", key + "委托金额不能为空");
                            }
                            if (!v.supplierName) {
                                modelStateDictionary.addModelError("供应商名称	", key + "供应商名称不能为空");
                            }
                            if (!v.industryDomainName) {
                                modelStateDictionary.addModelError("供应商行业领域	", key + "供应商行业领域不能为空");
                            }
                            if (!v.operatorUser) {
                                modelStateDictionary.addModelError("合同经办人	", key + "合同经办人不能为空");
                            }
                            //采购内容
                            if (!v.fixedAssetsPurchaseGoodsDetailInfoList || v.fixedAssetsPurchaseGoodsDetailInfoList.length == 0) {
                                modelStateDictionary.addModelError('采购内容', key + '采购内容不能为空');
                            }
                        });
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
                        { key: '直接委托理由', attributeName: 'purchaseOfFixedAssets.DirectDelegationReason', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfFixedAssets.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    model.option = null;
                    return model;
                };
                // 监听画面  
                $scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.purchaseAmountChange);
                $scope.$watch('viewModel.purchaseOfFixedAssets.project', $scope.baseInfo.projectChange);
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
                        ApprovalAmountLimit: $scope.viewModel.purchaseBase.purchaseAmount,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        NcCorporationCode: $scope.viewModel.mainChargeCompanyCode,
                        CorporationCode: $scope.viewModel.corporationScopeList[0].corporationCode,
                        ProjectCode: $scope.viewModel.purchaseOfFixedAssets.projectCode,
                    };
                    if (!$scope.viewModel.isUseCostCenter) {
                        param.NcCorporationCode = $scope.viewModel.purchaseOfFixedAssets.chargeCompanyCode;
                        param.CostCenterCode = $scope.viewModel.purchaseOfFixedAssets.costCenterCode;
                    }
                    if (param.ApprovalAmountLimit
                        && param.CostCenterCode
                        && param.NcCorporationCode
                        && param.CorporationCode) {
                        if ($scope.viewModel.purchaseOfFixedAssets.isInvolveProject === true
                            && !$scope.viewModel.purchaseOfFixedAssets.projectCode) {
                            return;
                        }
                        wfOperate.refreshProcess('/DirectCommissionedAssetsPurchaseApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                });
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