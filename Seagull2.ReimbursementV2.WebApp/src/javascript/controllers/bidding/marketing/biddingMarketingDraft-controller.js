define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'supplierInfoExtendV2',
        'supplierCategoryExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'dateTimePickerExtend',
        'leftNavExtend',
        'commonUtilExtend',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('biddingMarketingDraft_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog','locals',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog, locals) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(营销类)";

                $scope.isOpinionsShow = false;
                $scope.isApprovalShow = false;
                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.processId == 'InputOpinion')
                        $scope.isOpinionsShow = true;

                    //审批意见是否显示
                    if ( v.processId != 'InputOpinion')
                        $scope.isApprovalShow = true;
                });

                $scope.wfOperateOpts.allowCirculate = false;//传阅
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoAbort = true;//作废 
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印

                $scope.$broadcast('viewModel', { data: $scope.viewModel });
                $scope.viewModel.purchaseOfMarketing.project = null;
                $scope.viewModel.projectScopeList = [];
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
                    //招标比例
                    optsScale: {
                        min: 1,
                        max: 100,
                        precision: 2
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
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'Draft',
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'priceFile': $scope.viewModel.priceFile,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                            projectName: $scope.viewModel.purchaseOfMarketing.projectName
                        },
                    },
                    isShowUpstreamProcessMarketing: false,
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
                                    $scope.viewModel.option.useCostCenterList = data;
                                })
                        }
                    },
                    useCostCenterChange: function () {
                        angular.forEach($scope.viewModel.option.useCostCenterList, function (v) {
                            if ($scope.viewModel.purchaseBase.useCostCenterCode == v.code) {
                                $scope.viewModel.purchaseBase.useCostCenterCode = v.code;
                                $scope.viewModel.purchaseBase.useCostCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 3) {
                            $scope.refreshProcessForApproval();
                        }
                    },
                    //支出类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.option.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            $scope.viewModel.isUseProject = false;
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.purchaseBase.useProjectCode = "";
                            $scope.viewModel.purchaseBase.useProjectName = "";
                            $scope.api.useProjectOpts.projectName = "";
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
                            $scope.api.useProjectOpts.projectName = "";
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                $scope.refreshProcessForApproval();
                            }
                        }
                    },
                };
                
                //过滤时间显示格式
                for (var i = 0; i < $scope.viewModel.purchaseDateArrangeInfoList.length; i++) {
                    $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].replyDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].evaluateBiddingDeadline;
                    $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline = $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline == "0001-01-01T00:00:00" ? "" : $scope.viewModel.purchaseDateArrangeInfoList[i].decideBiddingDeadline;
                }

                //如果有上流流程信息，则显示出
                if ($scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != null && $scope.viewModel.purchaseOfMarketing.upstreamProcessResourceID != "") {
                    $scope.baseInfo.isShowUpstreamProcessMarketing = true;
                }
                if ($scope.viewModel.purchaseOfMarketing.projectCode != null && $scope.viewModel.purchaseOfMarketing.projectCode != "") {
                    $scope.viewModel.purchaseOfMarketing.project = {
                        projectCode: $scope.viewModel.purchaseOfMarketing.projectCode,
                        projectName: $scope.viewModel.purchaseOfMarketing.projectName,
                    }
                    $scope.viewModel.projectScopeList.push($scope.viewModel.purchaseOfMarketing.project);
                }
                //页面所用函数
                $scope.api = {
                    //自定义指令回调函数
                    //项目名称
                    projectOpts: {
                        projectName: $scope.viewModel.purchaseOfMarketing.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfMarketing.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfMarketing.projectName = project.projectName;
                            $scope.viewModel.purchaseOfMarketing.project = {
                                projectCode: project.projectCode,
                                projectName: project.projectName
                            };
                            if ($scope.viewModel.projectScopeList.length!=0) {
                                $scope.viewModel.projectScopeList = [];
                            }
                            $scope.viewModel.projectScopeList.push($scope.viewModel.purchaseOfMarketing.project);
                            $scope.api.supplierScopeOpts.projectList = $scope.viewModel.projectScopeList;
                            $scope.viewModel.supplierScopeList = [];
                            $scope.refreshProcessForApproval();
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
                        corporationName: $scope.viewModel.corporationScope[0].corporationName,
                        beforAppend: function (corporationData) {
                            $scope.viewModel.corporationScope[0].corporationCode = corporationData.corporationCode;
                            $scope.viewModel.corporationScope[0].corporationName = corporationData.corporationName;
                            $scope.initChargeCompany($scope.viewModel.corporationScope[0].corporationCode, true);
                        }
                    },
                    //入围供应商
                    supplierScopeOpts: {
                        scene: "Draft",
                        projectList: $scope.viewModel.projectScopeList,
                        beforAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList.push(supplierData);
                        },
                        afterAppend: function (supplierData) {
                            $scope.viewModel.supplierScopeList = supplierData;
                        }
                    }
                };

                //查询记账公司
                $scope.initChargeCompany = function (corporationCode, isClear) {
                    if (corporationCode) {
                        if (isClear) {
                            $scope.viewModel.option.chargeCompany = [];
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyCode = "";
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyName = "";
                            $scope.viewModel.option.costCenter = [];
                            $scope.viewModel.purchaseOfMarketing.costCenterCode = "";
                            $scope.viewModel.purchaseOfMarketing.costCenterName = "";
                        }
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetChargeCompanyList?corporationCode=" + corporationCode))
                        .success(function (data) {
                            $scope.viewModel.option.chargeCompany = data;
                        })
                    }
                }

                //记账公司下拉框选中后数据变化
                $scope.chargeCompanyChange = function () {
                    angular.forEach($scope.viewModel.option.chargeCompany, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.chargeCompanyName = v.name;
                        }
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode) {
                            $scope.loadCostCenter($scope.viewModel.purchaseOfMarketing.chargeCompanyCode);
                        }
                    })
                }

                //加载成本中心
                $scope.loadCostCenter = function (chargeCompanyCode) {
                    if (chargeCompanyCode) {
                        $http.get(seagull2Url.getPlatformUrl("/Purchase/GetCostCenterList?chargeCompanyCode=" + chargeCompanyCode + '&isFilterOperationCostControl=true'))
                         .success(function (data) {
                             $scope.viewModel.option.costCenter = data;
                         })
                    }

                }
                //成本中心选中下拉框数据变化
                $scope.costCenterChange = function () {
                    angular.forEach($scope.viewModel.option.costCenter, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.costCenterCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.costCenterCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.costCenterName = v.name;
                        }
                    })
                    if ($scope.viewModel.purchaseBase.expenditureTypeCode != 3) {
                        $scope.refreshProcessForApproval();
                    }
                }

                //是否涉及工程数据变化
                $scope.isInvolveEngineeringChange = function () {
                    $scope.refreshProcessForApproval();
                }

                //营销采购分类下拉框选中
                $scope.marketingPurchaseTypeChange = function () {
                    angular.forEach($scope.viewModel.option.marketingPurchaseType, function (v) {
                        if ($scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode == v.code) {
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode = v.code;
                            $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeName = v.name;
                        }
                    })
                    $scope.refreshProcessForApproval();
                }

                //刷新流程参数用于审批流
                $scope.refreshProcessForApproval = function () {
                    if ($scope.viewModel.isUseCostCenter) {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseBase.useCostCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseBase.useChargeCompanyCode;
                    } else {
                        $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfMarketing.costCenterCode;
                        $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfMarketing.chargeCompanyCode;
                    }
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            if (v.replyDeadline == null || v.replyDeadline == "") {
                                v.replyDeadline = "0001-01-01T00:00:00";
                            }
                            if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "") {
                                v.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                            }
                            if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "") {
                                v.decideBiddingDeadline = "0001-01-01T00:00:00";
                            }
                        });
                    }
                    if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == null)
                        $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount = 0;

                    var dataModel = { Data: $scope.viewModel };
                    if ($scope.viewModel.purchaseOfMarketing.projectCode && $scope.viewModel.mainCostCenterCode && $scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode) {
                        wfOperate.refreshProcess('/BiddingMarketingDraftWf', viewData.currentActivityId, undefined, angular.toJson(dataModel), true).success(function (data) {
                        });
                    }
                } 

                window.onstorage = function () {
                    var supplierList = locals.getObject('addSupplier');
                    if (supplierList && supplierList.length > 0) {
                        $timeout(function () {
                            $scope.viewModel.supplierScopeList = supplierList;
                        }, 0)
                    }
                }

                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                });

                //校验是否选择了法人公司和成本中心
                $scope.validOpts = function (name) {
                    if (name == '记账公司') {
                        if ($scope.viewModel.corporationScope[0].corporationCode == "" || $scope.viewModel.corporationScope[0].corporationCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择法人公司");
                        }
                    }
                    if (name == '成本中心') {
                        if ($scope.viewModel.purchaseOfMarketing.chargeCompanyCode == "" || $scope.viewModel.purchaseOfMarketing.chargeCompanyCode == null) {
                            sogModal.openAlertDialog("提示", "请先选择记账公司");
                        }
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

                    if ($scope.viewModel.purchaseOfMarketing.isInvolveProject) {
                        if (!$scope.viewModel.purchaseOfMarketing.projectName || !$scope.viewModel.purchaseOfMarketing.projectCode) {
                            error.addModelError("项目名称", "项目不能为空");
                        }
                    }

                    if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == null || $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == undefined || $scope.viewModel.purchaseOfMarketing.marketingBudgetAmount == 0) error.addModelError("营销费用预算", "营销费用预算不能为空或等于0");
                    if (!$scope.viewModel.corporationScope[0].corporationCode) error.addModelError("招标人", "招标人不能为空");
                    if (!$scope.viewModel.purchaseOfMarketing.chargeCompanyCode) error.addModelError("记账公司", "记账公司不能为空");
                    if (!$scope.viewModel.purchaseOfMarketing.costCenterCode) error.addModelError("成本中心", "成本中心不能为空");
                    if (!$scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeName || !$scope.viewModel.purchaseOfMarketing.marketingPurchaseTypeCode) error.addModelError("营销采购分类", "营销采购分类不能为空");
                    if ($scope.viewModel.purchaseOfMarketing.isInvolveEngineering == null) {
                        error.addModelError('是否涉及工程', '是否涉及工程未选择！');
                    }
                    if ($scope.viewModel.purchaseOfMarketing.businessScale == null || $scope.viewModel.purchaseOfMarketing.businessScale == undefined) error.addModelError("商务标占比", "商务标占比不能为空");
                    if ($scope.viewModel.purchaseOfMarketing.technologyScale == null || $scope.viewModel.purchaseOfMarketing.technologyScale == undefined) error.addModelError("技术标占比", "技术标占比不能为空");
                    if ($scope.viewModel.purchaseOfMarketing.businessScale == 0 || $scope.viewModel.purchaseOfMarketing.businessScale == 100) error.addModelError("商务标占比", "商务标占比必须大于0小于100");
                    if ($scope.viewModel.purchaseOfMarketing.technologyScale == 0 || $scope.viewModel.purchaseOfMarketing.technologyScale == 100) error.addModelError("技术标占比", "技术标占比必须大于0小于100");
                    if ($scope.viewModel.purchaseOfMarketing.businessScale + $scope.viewModel.purchaseOfMarketing.technologyScale != 100) error.addModelError("占比合计", "商务标占比、技术标占比合计必须为100%");

                    if (!$scope.viewModel.purchaseMainUser) error.addModelError("招标主责人", "招标主责人不能为空");
                    if (!$scope.viewModel.businessMainUser) error.addModelError("商务主责人", "商务主责人不能为空");
                    if (!$scope.viewModel.technologyMainUser) error.addModelError("技术主责人", "技术主责人不能为空");

                    if ($scope.viewModel.businessMainUser && $scope.viewModel.technologyMainUser)
                        if ($scope.viewModel.technologyMainUser.id == $scope.viewModel.businessMainUser.id) error.addModelError("主责人", "商务主责人与技术主责人不能同为一人");
                    if (!$scope.viewModel.purchaseOfMarketing.purchaseContent) error.addModelError("本次采购范围和内容", "本次采购范围和内容不能为空");
                    if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                        angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                            var key = '第' + (i + 1) + '行采购时间安排';
                            if (v.replyDeadline == null || v.replyDeadline == "0001-01-01T00:00:00" || v.replyDeadline == "") {
                                error.addModelError("回标截止时间", key + "回标截止时间不能为空");
                            }
                            if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "0001-01-01T00:00:00" || v.evaluateBiddingDeadline == "") {
                                error.addModelError("评标时间", key + "评标时间不能为空");
                            }
                            if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "0001-01-01T00:00:00" || v.decideBiddingDeadline == "") {
                                error.addModelError("定标时间", key + "定标时间不能为空");
                            }

                            if (new Date(v.replyDeadline.replace('T', ' ')) <= new Date()) {
                                error.addModelError("回标截止时间", key + "回标截止时间不能小于等于当前时间");
                            }
                            if (v.evaluateBiddingDeadline <= new Date()) {
                                error.addModelError("评标时间", key + "评标时间不能小于等于当前时间");
                            }
                            if (v.decideBiddingDeadline <= new Date()) {
                                error.addModelError("定标时间", key + "定标时间不能小于等于当前时间");
                            }

                            if (new Date($filter('date')(v.evaluateBiddingDeadline, 'yyyy-MM-dd 00:00:00.000')) <= new Date(v.replyDeadline.replace('T', ' '))) {
                                error.addModelError("评标时间", key + "评标时间不能小于等于回标截止时间");
                            }

                            if (v.decideBiddingDeadline <= v.evaluateBiddingDeadline) {
                                error.addModelError("定标时间", key + "定标时间不能小于等于评标时间");
                            }
                        });
                    }

                    //使用项目
                    if ($scope.viewModel.isUseProject == true && !$scope.viewModel.purchaseBase.useProjectCode) {
                        error.addModelError('使用项目', '不能为空!');
                    }
                    //使用记账公司验证
                    if ($scope.viewModel.isUseCostCenter == true && !$scope.viewModel.purchaseBase.useChargeCompanyCode) {
                        error.addModelError('使用记账公司', '不能为空!');
                    }
                    //使用成本中心验证
                    if ($scope.viewModel.isUseCostCenter == true && !$scope.viewModel.purchaseBase.useCostCenterCode) {
                        error.addModelError('使用成本中心', '不能为空!');
                    }
                    if ($scope.viewModel.supplierScopeList.length < 3) {
                        error.addModelError("入围供应商", "入围供应商不能小于三家");
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

                    if ($scope.viewModel.purchaseOfMarketing.biddingReportFile == null || $scope.viewModel.purchaseOfMarketing.biddingReportFile.length == 0) error.addModelError("招标文件", "招标文件不能为空");

                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                }
               
                var checkFileData = function () {
                    var retrunFlag = true;
                    if ($scope.viewModel.purchaseOfMarketing.biddingReportFile != null && $scope.viewModel.purchaseOfMarketing.biddingReportFile.length > 0) {
                        angular.forEach($scope.viewModel.purchaseOfMarketing.biddingReportFile, function (item) {
                            if (!item.uploaded) {
                                retrunFlag = false;
                            }
                        });
                    }
                    if ($scope.viewModel.purchaseOfMarketing.biddingOtherFile != null && $scope.viewModel.purchaseOfMarketing.biddingOtherFile.length > 0) {
                        angular.forEach($scope.viewModel.purchaseOfMarketing.biddingOtherFile, function (item) {
                            if (!item.uploaded) {
                                retrunFlag = false;
                            }
                        });
                    }
                    if (!retrunFlag) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                    }
                    return retrunFlag;
                };
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    if (checkFileData()) {
                        if ($scope.viewModel.purchaseDateArrangeInfoList.length) {
                            angular.forEach($scope.viewModel.purchaseDateArrangeInfoList, function (v, i) {
                                if (v.replyDeadline == null || v.replyDeadline == "") {
                                    v.replyDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.evaluateBiddingDeadline == null || v.evaluateBiddingDeadline == "") {
                                    v.evaluateBiddingDeadline = "0001-01-01T00:00:00";
                                }
                                if (v.decideBiddingDeadline == null || v.decideBiddingDeadline == "") {
                                    v.decideBiddingDeadline = "0001-01-01T00:00:00";
                                }
                            });
                        }
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                //是否有审批人
                                if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length == 0)
                                {
                                    sogModal.openAlertDialog('提示', '当前流程没有审批人，无法发送，');
                                    return defer.reject($scope.viewModel);
                                } else if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length == 1) {
                                    if ($scope.opinionOpts.options[0].name == "编制招标信息") {
                                        sogModal.openAlertDialog('提示', '当前流程没有审批人，无法发送，');
                                        return defer.reject($scope.viewModel);
                                    }
                                }
                                else {
                                    return defer.resolve($scope.viewModel)
                                }
                            } else {
                                return defer.reject($scope.viewModel);
                            }
                        } else if (e.operationType === sogWfControlOperationType.Save) {

                        }
                        return defer.resolve($scope.viewModel);
                    }
                }
            }]);
    });