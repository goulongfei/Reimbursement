define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'corporationExtend',
        'supplierInfoExtendV2',
        'supplierCategoryExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'supplierSelector',
        'projectExtend',
        'leftNavExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingMaintenanceDraft_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog', 'supplierSelector', 'locals',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, supplierSelector, locals) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(第三方维保类)";

                $scope.isOpinionsShow = false;
                $scope.isApprovalShow = false;
                $scope.viewModel.purchaseOfMaintenance.project = null;
                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.processId == 'InputOpinion')
                        $scope.isOpinionsShow = true;

                    //审批意见是否显示
                    if (v.processId != 'InputOpinion')
                        $scope.isApprovalShow = true;
                });

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = true;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印

                $scope.$broadcast('viewModel', { data: $scope.viewModel });

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
                    spreadButtonName: "展开",
                    isApproval: false
                };

                //基本信息
                $scope.baseInfo = {
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
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMaintenance.projectCode,
                            projectName: $scope.viewModel.purchaseOfMaintenance.projectName
                        },
                    },
                    // 项目变更 projectChange
                    projectChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        else {
                            $scope.refreshProcessForApproval();
                        }
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "Draft",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //采购金额变化
                    purchaseAmountChange: function () {
                        $scope.refreshProcessForApproval();
                    },
                    //使用成本中心
                    useCostCenterChange: function (newValue, oldValue) {
                        $scope.refreshProcessForApproval();
                    },
                    //支付类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })
                        //2022年10月11日需求优化-清空法人、记账公司、成本中心信息
                        $scope.api.corporationOpts.corporationName = "";
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
                            $scope.api.useProjectOpts.projectName = "";
                        } else if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2) {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = true;
                            $scope.viewModel.useCostCenterInfoList = [];
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.api.useProjectOpts.projectName = "";
                            $scope.viewModel.useCostCenterInfoList = [];
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                if ($scope.viewModel.mainCostCenterCode && $scope.viewModel.mainCostCenterCode == $scope.viewModel.purchaseOfMaintenance.costCenterCode) {
                                    $scope.refreshProcessForApproval();
                                } else {
                                    $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode;
                                    $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfMaintenance.costCenterCode;
                                }
                            }
                        }
                    },
                };

                //页面所用函数
                $scope.api = {
                    //自定义指令回调函数
                    //项目
                    projectOpts: {
                        readOnly: false,
                        beforAppend: function (projectList) {
                            $scope.viewModel.projectScopeList = projectList;
                            $scope.viewModel.purchaseOfMaintenance.project = $scope.viewModel.projectScopeList;
                            $scope.api.supplierScopeOpts.projectList = projectList;
                            $scope.viewModel.supplierScopeList = [];
                        }
                    },
                    //使用项目
                    useProjectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseBase.useProjectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseBase.useProjectCode = project.projectCode;
                            $scope.viewModel.purchaseBase.useProjectName = project.projectName;
                            $scope.refreshProcessForApproval();
                        }
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: $scope.viewModel.corporationNames,
                        beforAppend: function (corporationData) {
                            $scope.viewModel.corporationScopeList = [];
                            angular.forEach(corporationData, function (v, i) {
                                $scope.viewModel.corporationScopeList.push(v);
                            });
                            $scope.initChargeCompany($scope.viewModel.corporationScopeList);

                        }
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        scene: "Draft",
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
                        }
                    }
                };

                //查询记账公司
                $scope.initChargeCompany = function (corporationList) {
                    var corporationCodes = "";
                    $scope.viewModel.option.chargeCompany = [];
                    $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode = "";
                    $scope.viewModel.purchaseOfMaintenance.chargeCompanyName = "";
                    $scope.viewModel.option.costCenter = [];
                    $scope.viewModel.purchaseOfMaintenance.costCenterCode = "";
                    $scope.viewModel.purchaseOfMaintenance.costCenterName = "";
                    angular.forEach(corporationList, function (v, i) {
                        corporationCodes += v.corporationCode + ",";
                    });
                    if (corporationCodes != "")
                        corporationCodes = corporationCodes.substring(0, corporationCodes.length - 1);
                    if (corporationCodes) {
                        var url = seagull2Url.getPlatformUrl("/Purchase/GetChargeCompanyList?corporationCode=" + corporationCodes);
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 2 || $scope.viewModel.purchaseBase.expenditureTypeCode == 3) {
                            url += '&organizationType=1'
                        }
                        $http.get(url)
                            .success(function (data) {
                                $scope.viewModel.option.chargeCompany = data;
                            })
                    }
                }

                //记账公司下拉框选中后数据变化
                $scope.chargeCompanyChange = function () {
                    angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                        if ($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode == v.code) {
                            $scope.viewModel.purchaseOfMaintenance.chargeCompanyName = v.name;
                            $scope.loadCostCenter($scope.viewModel.purchaseOfMaintenance.chargeCompanyCode, v.data);
                        }
                    })
                }

                //加载成本中心
                $scope.loadCostCenter = function (chargeCompanyCode, organizationType) {
                    var isProject = 1;
                    if (organizationType == 0) {
                        isProject = 2;
                    }
                    //seagull2Url.getPlatformUrl("/Purchase/GetCostCenterList?chargeCompanyCode=" + chargeCompanyCode + "&IsProject=" + isProject)
                    var url = seagull2Url.getPlatformUrl('/Purchase/GetNotOperationCostControlCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + chargeCompanyCode + '&IsProject=' + isProject + '&islimit=' + false);
                    if (chargeCompanyCode) {
                        $http.get(url)
                            .success(function (data) {
                                $scope.viewModel.option.costCenter = data;
                            })
                    }

                }
                //成本中心选中下拉框数据变化
                $scope.costCenterChange = function () {
                    angular.forEach($scope.viewModel.option.costCenter, function (v) {
                        if ($scope.viewModel.purchaseOfMaintenance.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfMaintenance.costCenterCode = v.code;
                            $scope.viewModel.purchaseOfMaintenance.costCenterName = v.name;
                        }
                    })
                    if ($scope.viewModel.purchaseBase.expenditureTypeCode != 3) {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfMaintenance.costCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode;
                    }
                }

                $scope.$watch('viewModel.purchaseOfMaintenance.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.mainCostCenterCode', $scope.baseInfo.useCostCenterChange);

                window.onstorage = function () {
                    var supplierList = locals.getObject('addSupplier');
                    if (supplierList && supplierList.length > 0) {
                        $timeout(function () {
                            $scope.viewModel.supplierScopeList = supplierList;
                        }, 0)
                    }
                }
                //刷新流程参数用于审批流
                $scope.refreshProcessForApproval = function () {
                    if ($scope.viewModel.isUseCostCenter) {
                        if ($scope.viewModel.useCostCenterInfoList.length > 0) {
                            if ($scope.viewModel.useCostCenterInfoList[0].useChargeCompanyCode && $scope.viewModel.useCostCenterInfoList[0].useCostCenterCode) {
                                $scope.viewModel.mainCostCenterCode = $scope.viewModel.useCostCenterInfoList[0].useCostCenterCode;
                                $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.useCostCenterInfoList[0].useChargeCompanyCode;
                            }
                        }
                    }
                    var param = {
                        ProjectCode: $scope.viewModel.projectScopeList[0].projectCode,
                        PurchaseAmount: $scope.viewModel.purchaseBase.perPurchaseAmount,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        ChargeCompanyCode: $scope.viewModel.mainChargeCompanyCode,
                        CorporationCode: $scope.viewModel.corporationScopeList[0].corporationCode,
                        IsUseProject: $scope.viewModel.isUseProject,
                        IsUseCostCenter: $scope.viewModel.isUseCostCenter,
                    };
                    if (!$scope.viewModel.isUseCostCenter) {
                        param.ChargeCompanyCode = $scope.viewModel.purchaseOfMaintenance.chargeCompanyCode;
                        param.CostCenterCode = $scope.viewModel.purchaseOfMaintenance.costCenterCode;
                    }
                    //使用项目
                    if ($scope.viewModel.isUseProject == true) {
                        param.ProjectCode = $scope.viewModel.purchaseBase.useProjectCode;
                    }
                    if (param.ProjectCode && param.PurchaseAmount && param.CostCenterCode && param.CorporationCode) {
                        wfOperate.refreshProcess('/BiddingMaintenanceApplicationWf', viewData.currentActivityId, null, param, true).success(function (data) {
                        });
                    }
                }
                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);

                    if (!$scope.viewModel.purchaseBase.purchaseName)
                        error.addModelError("采购名称", "采购名称不能为空");
                    else
                        if ($scope.viewModel.purchaseBase.purchaseName.length > 30) error.addModelError("采购名称", "采购名称不能超过30个字");

                    //项目名称
                    if (angular.isArray($scope.viewModel.projectScopeList) === false || $scope.viewModel.projectScopeList.length === 0 || !$scope.viewModel.projectScopeList[0].projectCode) {
                        error.addModelError('项目', '请选择！');
                    }
                    if ($scope.viewModel.purchaseBase.perPurchaseAmount == null || $scope.viewModel.purchaseBase.perPurchaseAmount == undefined || $scope.viewModel.purchaseBase.perPurchaseAmount == 0) error.addModelError("预计采购金额", "预计采购金额不能为空或等于0");
                    if (!$scope.viewModel.corporationScopeList[0].corporationCode) error.addModelError("招标人", "招标人不能为空");
                    if (!$scope.viewModel.purchaseOfMaintenance.chargeCompanyCode) error.addModelError("记账公司", "记账公司不能为空");
                    if (!$scope.viewModel.purchaseOfMaintenance.costCenterCode) error.addModelError("成本中心", "成本中心不能为空");

                    if (!$scope.viewModel.purchaseMainUser) error.addModelError("招标主责人", "招标主责人不能为空");
                    if (!$scope.viewModel.businessMainUser) error.addModelError("商务主责人", "商务主责人不能为空");
                    if (!$scope.viewModel.technologyMainUser) error.addModelError("技术主责人", "技术主责人不能为空");

                    if ($scope.viewModel.businessMainUser && $scope.viewModel.technologyMainUser)
                        if ($scope.viewModel.technologyMainUser.id == $scope.viewModel.businessMainUser.id) error.addModelError("主责人", "商务主责人与技术主责人不能同为一人");
                    if (!$scope.viewModel.purchaseOfMaintenance.purchaseContent) error.addModelError("本次采购范围和内容", "本次采购范围和内容不能为空");
                    if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                        error.addModelError("回标截止时间", "回标截止时间不能为空");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                        error.addModelError("评标时间", "评标时间不能为空");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                        error.addModelError("定标时间", "定标时间不能为空");
                    }
                    if (new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline.replace('T', ' ')) <= new Date()) {
                        error.addModelError("回标截止时间", "回标截止时间不能小于等于当前时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline <= new Date()) {
                        error.addModelError("评标时间", "评标时间不能小于等于当前时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline <= new Date()) {
                        error.addModelError("定标时间", "定标时间不能小于等于当前时间");
                    }
                    if (new Date($filter('date')($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline, 'yyyy-MM-dd 00:00:00.000')) <= new Date($scope.viewModel.purchaseDateArrangeInfo.replyDeadline.replace('T', ' '))) {
                        error.addModelError("评标时间", "评标时间不能小于等于回标截止时间");
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline <= $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline) {
                        error.addModelError("定标时间", "定标时间不能小于等于评标时间");
                    }
                    if ($scope.viewModel.supplierScopeList.length < 3) {
                        error.addModelError("入围供应商", "入围供应商不能小于三家");
                    }
                    //使用项目
                    if ($scope.viewModel.isUseProject == true && !$scope.viewModel.purchaseBase.useProjectCode) {
                        error.addModelError('使用项目', '不能为空!');
                    }
                    //使用成本中心验证
                    if ($scope.viewModel.isUseCostCenter == true) {
                        // 校验是否为空
                        if ($scope.viewModel.useCostCenterInfoList.length === 0) {
                            error.addModelError('使用成本中心', '不能为空!');
                        }
                        for (var i = 0; i < $scope.viewModel.useCostCenterInfoList.length; i++) {
                            var item = $scope.viewModel.useCostCenterInfoList[i];
                            var rowKey = "使用成本中心" + (i + 1) + "行";
                            var required = ValidateHelper.validateData(item, [
                                { key: rowKey + '，使用记账公司', attributeName: 'useChargeCompanyCode', validator: [new RequiredValidator("请选择！")] },
                                { key: rowKey + '，使用成本中心', attributeName: 'useCostCenterCode', validator: [new RequiredValidator("请选择！")] }
                            ]);
                            error.merge(required);
                        }
                    }
                    if ($scope.viewModel.supplierScopeList.length) {
                        var hash = [];
                        angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                            if (hash.indexOf(v.supplierCode) == -1) {
                                hash.push(v.supplierCode);
                            }
                        });

                        if (hash.length != $scope.viewModel.supplierScopeList.length) {
                            error.addModelError("入围供应商", "选择的供应商有重复，请删选后发送");
                        }
                    }

                    if ($scope.viewModel.reportFile == null || $scope.viewModel.reportFile.length == 0) error.addModelError("招标文件", "招标文件不能为空");

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }
                $scope.fileReady = true;
                var checkFileData = function () {
                    if (!$scope.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    return true;
                };
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    if (checkFileData()) {

                        if ($scope.viewModel.purchaseDateArrangeInfo.replyDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.replyDeadline == "") {
                            $scope.viewModel.purchaseDateArrangeInfo.replyDeadline = "0001-01-01T00:00:00";
                        }
                        if ($scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline == "") {
                            $scope.viewModel.purchaseDateArrangeInfo.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                        }
                        if ($scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == null || $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline == "") {
                            $scope.viewModel.purchaseDateArrangeInfo.decideBiddingDeadline = "0001-01-01T00:00:00";
                        }

                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                defer.resolve($scope.viewModel);
                            } else {
                                defer.reject($scope.viewModel);
                            }
                        } else if (e.operationType === sogWfControlOperationType.Save) {

                        }
                        return defer.resolve($scope.viewModel);
                    }
                }


            }]);
    });