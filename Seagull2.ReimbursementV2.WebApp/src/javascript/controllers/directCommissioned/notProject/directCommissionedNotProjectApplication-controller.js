define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'supplierCategoryExtend',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'commonUtilExtend',
        'supplierInfoExtendV4',
        'useCostCenterExtend'
    ],
    function (app) {
        app.controller('directCommissionedNotProjectApplication_controller', [
            '$window', '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'sogWfQueryField', 'configure',
            function ($window, $scope, $rootScope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, sogWfQueryField, configure) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '直接委托';
                $scope.title = "直接委托(非项目服务类)";
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
                // 设置
                $scope.settings = {
                    //项目
                    projectOpts: {
                        projectName: $scope.viewModel.purchaseOfNotProject.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfNotProject.project = project;
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
                        'isInvolveProject': $scope.viewModel.purchaseOfNotProject.isInvolveProject,
                        'isUpstreamReadOnly': $scope.viewModel.isUpstreamReadOnly,
                        'reason': $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode,
                        'purchaseBase': $scope.viewModel.purchaseBase,
                        'tinyAmount': 50000,
                        'project': {
                            projectCode: $scope.viewModel.purchaseOfNotProject.projectCode,
                            projectName: $scope.viewModel.purchaseOfNotProject.projectName
                        },
                        'blackList': ['delegationAmount', 'reason'],
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
                        return seagull2Url.getPlatformUrl('/Purchase/GetNotOperationCostControlCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode + '&IsProject=' + param.isProject);
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
                        var url = $scope.api.urlGetCostCenterList(param);
                        if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode == 14) {

                            url += '&islimit=false';
                        };

                        $http({
                            method: 'GET',
                            url: url,
                            data: param,
                        })
                            .success(function (data) { done(data); })
                            .error($scope.api.showErrorMessage);
                    },
                };
                //基本信息
                $scope.baseInfo = {
                    // 初始化方法
                    init: function () {
                        // 人员专业线提示
                        $scope.baseInfo.banEmpStation();
                    },
                    //直接委托理由
                    commissionReason: {
                        reasonCode: $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode,
                        reasonName: $scope.viewModel.purchaseOfNotProject.directDelegationReasonName
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
                    //是否涉及信息系统建设
                    InitITConstruction: function (v) {
                        if (v) {
                            $scope.viewModel.purchaseOfNotProject.isInvolveITConstruction = true;
                        } else {
                            $scope.viewModel.purchaseOfNotProject.isInvolveITConstruction = false;
                        }
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.options.chargeCompany = [];
                        $scope.viewModel.purchaseOfNotProject.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfNotProject.chargeCompanyName = "";
                        $scope.viewModel.options.costCenter = [];
                        $scope.viewModel.purchaseOfNotProject.costCenterCode = "";
                        $scope.viewModel.purchaseOfNotProject.costCenterName = "";
                        var param = { corporationCode: corporationCode };
                        $scope.api.getChargeCompanyList(param, function (data) {
                            $scope.viewModel.options.chargeCompany = data;
                            wfWaiting.hide();
                        });
                    },
                    //记账公司下拉框选中后数据变化
                    chargeCompanyChange: function () {
                        angular.forEach($scope.viewModel.options.chargeCompany, function (v) {
                            if ($scope.viewModel.purchaseOfNotProject.chargeCompanyCode == v.code) {
                                $scope.viewModel.purchaseOfNotProject.chargeCompanyName = v.name;
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfNotProject.chargeCompanyCode, v.data);
                            }
                        })
                    },
                    //加载成本中心
                    loadCostCenter: function (chargeCompanyCode, organizationType) {
                        wfWaiting.show();
                        $scope.viewModel.options.costCenter = [];
                        var isProject = 1;
                        if (organizationType == 0) {
                            isProject = 2;
                        }
                        var param = { chargeCompanyCode: chargeCompanyCode, isProject: isProject };
                        $scope.api.getCostCenterList(param, function (data) {
                            $scope.viewModel.options.costCenter = data;
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.viewModel.options.costCenter, function (v) {
                            if ($scope.viewModel.purchaseOfNotProject.costCenterCode == v.code) {
                                $scope.viewModel.purchaseOfNotProject.costCenterCode = v.code;
                                $scope.viewModel.purchaseOfNotProject.costCenterName = v.name;
                            }
                        })
                        if ($scope.viewModel.purchaseBase.expenditureTypeCode == 1) {
                            $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfNotProject.chargeCompanyCode;
                            $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfNotProject.costCenterCode;
                        }
                    },
                    //直接委托理由选中下拉框数据变化
                    commissionReasonChange: function () {
                        angular.forEach($scope.viewModel.options.directDelegationReason, function (v) {
                            if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode == v.code) {
                                if ($scope.viewModel.purchaseDelegationInfoList.length > 0 && $scope.viewModel.purchaseDelegationInfoList[0].supplierName && !$scope.viewModel.isUpstreamReadOnly) {
                                    if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode == 1) {
                                        for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                                            $scope.viewModel.purchaseDelegationInfoList[i].supplierCode = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].supplierName = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].industryDomainCode = "";
                                            $scope.viewModel.purchaseDelegationInfoList[i].industryDomainName = "";
                                        }
                                        $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = v.code;
                                        $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = v.name;
                                        $scope.baseInfo.commissionReason.reasonCode = v.code;
                                        $scope.baseInfo.commissionReason.reasonName = v.name;
                                    } else {
                                        var promise = sogModal.openConfirmDialog("提示", "直接委托理由发生变化，是否重新选择供应商?");
                                        promise.then(function () {
                                            for (var i = 0; i < $scope.viewModel.purchaseDelegationInfoList.length; i++) {
                                                $scope.viewModel.purchaseDelegationInfoList[i].supplierCode = "";
                                                $scope.viewModel.purchaseDelegationInfoList[i].supplierName = "";
                                                $scope.viewModel.purchaseDelegationInfoList[i].industryDomainCode = "";
                                                $scope.viewModel.purchaseDelegationInfoList[i].industryDomainName = "";
                                            }
                                            $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = v.code;
                                            $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = v.name;
                                            $scope.baseInfo.commissionReason.reasonCode = v.code;
                                            $scope.baseInfo.commissionReason.reasonName = v.name;
                                            return;
                                        }, function (data) {
                                            $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = $scope.baseInfo.commissionReason.reasonCode;
                                            $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = $scope.baseInfo.commissionReason.reasonName;
                                            if ($scope.viewModel.purchaseOfNotProject.chargeCompanyCode) {
                                                angular.forEach($scope.viewModel.options.chargeCompany, function (v) {
                                                    if ($scope.viewModel.purchaseOfNotProject.chargeCompanyCode == v.code) {
                                                        $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfNotProject.chargeCompanyCode, v.data);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                                else if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode == 14) {
                                    if (!$scope.viewModel.isJdMallUser) {
                                        $scope.showOrganizationContacts($scope.viewModel.organizationContactList);
                                        $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = "";
                                        $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = "";
                                        return;
                                    }
                                    if ($scope.viewModel.jdSupplierCnName.length === 0) {
                                        sogModal.openAlertDialog('提示', "请联系管理员添加北京京东世纪信息技术有限公司供应商信息！");
                                        $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = "";
                                        $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = "";
                                        return;
                                    }
                                    //2 添加数据
                                    $scope.viewModel.purchaseDelegationInfoList = [];
                                    var list = {
                                        supplierName: $scope.viewModel.jdSupplierCnName,
                                        supplierCode: $scope.viewModel.jdSupplierCode,
                                        industryDomainName: "",
                                        industryDomainCode: ""
                                    };
                                    $scope.viewModel.purchaseDelegationInfoList.push(list);

                                    $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = v.code;
                                    $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = v.name;
                                    $scope.baseInfo.commissionReason.reasonCode = v.code;
                                    $scope.baseInfo.commissionReason.reasonName = v.name;
                                }
                                else {
                                    $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode = v.code;
                                    $scope.viewModel.purchaseOfNotProject.directDelegationReasonName = v.name;
                                    $scope.baseInfo.commissionReason.reasonCode = v.code;
                                    $scope.baseInfo.commissionReason.reasonName = v.name;
                                }

                            }
                        })
                        //重新加载成本中心
                        if ($scope.viewModel.purchaseOfNotProject.chargeCompanyCode) {
                            angular.forEach($scope.viewModel.options.chargeCompany, function (v) {
                                if ($scope.viewModel.purchaseOfNotProject.chargeCompanyCode == v.code) {
                                    $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfNotProject.chargeCompanyCode, v.data);
                                }
                            })
                        }
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
                        if (newValue != oldValue) {
                            if (newValue == 14 || oldValue == 14) {
                                //清空使用成本中心jd购重新选择
                                $scope.viewModel.useCostCenterInfoList = [];
                                $scope.refreshProcess();
                            }
                        }
                    },
                    //使用成本中心
                    useCostCenterChange: function (newValue, oldValue) {
                        $scope.refreshProcess();
                    },
                    //是否涉及项目
                    InitProjectInfo: function (v) {
                        if (v === true) {
                            this.projectChange({});
                        } else {
                            this.projectChange(null);
                        }

                    },
                    //是否法务类
                    InitIsLegal: function (v) {
                        if (v) {
                            $scope.viewModel.purchaseOfNotProject.isLegal = true;
                        } else {
                            $scope.viewModel.purchaseOfNotProject.isLegal = false;
                        }
                        $scope.refreshProcess();
                    },
                    //是否重大诉讼
                    InitIsGreatLawsuit: function (v) {
                        if (v) {
                            $scope.viewModel.purchaseOfNotProject.isGreatLawsuit = true;
                        } else {
                            $scope.viewModel.purchaseOfNotProject.isGreatLawsuit = false;
                        }
                        $scope.refreshProcess();
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
                            $scope.viewModel.purchaseOfNotProject.isInvolveProject = true;
                            $scope.viewModel.purchaseOfNotProject.projectCode = newVal.projectCode
                            $scope.viewModel.purchaseOfNotProject.projectName = newVal.projectName;

                            $scope.settings.delegationOpts.project = {
                                projectCode: newVal.projectCode,
                                projectName: newVal.projectName
                            };
                            $scope.settings.delegationOpts.blackList.push("project");
                        }
                        else {
                            $scope.viewModel.purchaseOfNotProject.isInvolveProject = false;
                            $scope.settings.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfNotProject.projectCode = null;
                            $scope.viewModel.purchaseOfNotProject.projectName = null;

                            $scope.settings.delegationOpts.project = null;
                            $scope.baseInfo.removeBlackList($scope.settings.delegationOpts.blackList, "project");
                        }
                        if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode != 14 && $scope.viewModel.purchaseBase.upstreamProcessURL == "") {
                            if (angular.isArray($scope.viewModel.purchaseDelegationInfoList) && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                                angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (purchaseDelegationInfo) {
                                    purchaseDelegationInfo.supplierCode = '';
                                    purchaseDelegationInfo.supplierName = '';
                                    purchaseDelegationInfo.industryDomainCode = '';
                                    purchaseDelegationInfo.industryDomainName = '';
                                })
                            }
                        }
                    },
                    // 人员一级专业线提示
                    banEmpStation: function () {
                        if ($scope.viewModel.empStation && $scope.viewModel.empStation.isBanNewStationCategorySystem === true) {
                            var stationName = $scope.viewModel.empStation.fullPath;
                            if (!stationName) { stationName = ""; }
                            sogModal.openAlertDialog('提示', '[' + stationName + '] 专业线人员不能发起非项目服务类采购流程，请核实费用类型，选择正确的采购类型发起');
                        }
                    },
                    //支出类型判断
                    expenditureTypeChange: function () {
                        angular.forEach($scope.viewModel.options.expenditureTypeList, function (v) {
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === v.code) {
                                $scope.viewModel.purchaseBase.expenditureTypeName = v.name;
                            }
                        })
                        //2022年10月11日需求优化-清空法人、记账公司、成本中心信息
                        $scope.settings.corporationOpts.corporationName = "";
                        $scope.viewModel.corporationScopeList[0].corporationCode = "";
                        $scope.viewModel.corporationScopeList[0].corporationName = "";
                        $scope.viewModel.options.chargeCompany = [];
                        $scope.viewModel.purchaseOfNotProject.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfNotProject.chargeCompanyName = "";
                        $scope.viewModel.options.costCenter = [];
                        $scope.viewModel.purchaseOfNotProject.costCenterCode = "";
                        $scope.viewModel.purchaseOfNotProject.costCenterName = "";

                        if ($scope.viewModel.purchaseBase.expenditureTypeCode === 2 || $scope.viewModel.purchaseBase.expenditureTypeCode === 3) {
                            $scope.viewModel.isUseCostCenter = true;
                            $scope.viewModel.useCostCenterInfoList = [];
                        } else {
                            $scope.viewModel.isUseCostCenter = false;
                            $scope.viewModel.useCostCenterInfoList = [];
                            if ($scope.viewModel.purchaseBase.expenditureTypeCode === 1) {
                                $scope.viewModel.mainChargeCompanyCode = $scope.viewModel.purchaseOfNotProject.chargeCompanyCode;
                                $scope.viewModel.mainCostCenterCode = $scope.viewModel.purchaseOfNotProject.costCenterCode;
                            }
                        }
                    },
                };

                //添加
                $scope.showOrganizationContacts = function (data) {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/SelectOrganizationContact.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    var opts = {
                        width: '55%',
                        footerHeight: 0
                    };
                    var promise = sogModal.openMaxDialog(template, '提示', ["$scope",
                        function ($modelScope) {
                            $modelScope.userList = angular.copy($scope.viewModel.organizationContactList);
                            $modelScope.currentUser = $scope.viewModel.purchaseMainUser;
                        }], $scope, null, opts);
                    promise.then(function (v) {

                    }, function (v) {

                    });

                };


                //京东登录跳转下单
                $scope.jdLogin = function () {
                    var returnUrl = window.location.protocol + "//" + window.location.host + "/THRWebApp/ReimbursementV2/default.htm#/directCommissionedNotProject/" + $scope.currentActivityId;// window.location.href;
                    if (!$scope.viewModel.isJdMallUser) {
                        $scope.showOrganizationContacts($scope.viewModel.organizationContactList);
                        return;
                    }
                    if ($scope.viewModel.jdSupplierCnName.length === 0) {
                        sogModal.openAlertDialog('提示', "请联系管理员添加北京京东世纪信息技术有限公司供应商信息！");
                        return;
                    }
                    var loginInfo = {
                        returnUrl: returnUrl,
                        prNo: $scope.viewModel.flowNumber
                    };
                    //3 保存数据
                    $scope.autosave(loginInfo);

                    wfWaiting.show();

                };

                var createHidden = function (name, value, form) {
                    var hidden = document.createElement('input');
                    hidden.type = 'hidden';
                    hidden.name = name;
                    hidden.value = value;
                    form.appendChild(hidden);
                };

                //查看京东已选产品
                $scope.showJdproducts = function () {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/SelectJdMallProducts.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    var opts = {
                        width: '55%',
                        footerHeight: 0
                    };
                    var promise = sogModal.openMaxDialog(template, '订单产品明细', ["$scope",
                        function ($modelScope) {
                            $modelScope.delegationInfo = angular.copy($scope.viewModel.purchaseDelegationInfoList[0]);
                        }], $scope, null, opts);
                    promise.then(function (v) {

                    }, function (v) {

                    });

                };
                // 供应商详情
                $scope.checkSupplierDetails = function (code) {
                    var config = {};
                    var baseRootUrl = configure.getConfig(config, 'common').apiUrlBase;
                    var url = "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code;
                    $window.open(baseRootUrl + url);
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
                        { key: '记账公司', attributeName: 'purchaseOfNotProject.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfNotProject.costCenterCode', validator: new RequiredValidator('请选择！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfNotProject.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfNotProject.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '采购主责人', attributeName: 'purchaseMainUser', validator: new RequiredValidator('不能为空！') },
                        { key: '支出类型', attributeName: 'purchaseBase.expenditureTypeCode', validator: new RequiredValidator('不能为空！') }
                    ]);

                    //项目
                    if ($scope.viewModel.purchaseOfNotProject.isInvolveProject) {
                        if (!$scope.viewModel.purchaseOfNotProject.projectName) {
                            modelStateDictionary.addModelError('项目名称', '请选择！');
                        }

                    }
                    if ($scope.viewModel.purchaseOfNotProject.isGreatLawsuit == null) {
                        modelStateDictionary.addModelError('是否重大诉讼', '请选择！');
                    } else {
                        if ($scope.viewModel.purchaseOfNotProject.isGreatLawsuit == true) {
                            if ($scope.viewModel.purchaseOfNotProject.isLegal != null && $scope.viewModel.purchaseOfNotProject.isLegal == false) {
                                modelStateDictionary.addModelError('是否法务类', '重大诉讼一定是法务类！');
                            }
                        }

                    }
                    if ($scope.viewModel.purchaseOfNotProject.isLegal == null) {
                        modelStateDictionary.addModelError('是否法务类', '请选择！');
                    }

                    //法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
                    }
                    //是否涉及信息系统建设
                    if ($scope.viewModel.purchaseOfNotProject.isInvolveITConstruction) {
                        modelStateDictionary.addModelError('是否涉及信息系统建设', '若涉及信息系统建设业务，请走信息系统建设流程发起采购，否则无法发起合同！');
                    }
                    //直接委托理由
                    if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode == 0) {
                        modelStateDictionary.addModelError('直接委托理由', '请选择！');
                    }
                    ////直接委托报告
                    //if (!$scope.viewModel.purchaseOfNotProject.directCommissionedReportFile || $scope.viewModel.purchaseOfNotProject.directCommissionedReportFile.length === 0) {
                    //    modelStateDictionary.addModelError('直接委托报告', '请上传直接委托报告！');
                    //}
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
                            if ($scope.viewModel.purchaseOfNotProject.directDelegationReasonCode !== 14) {
                                var required = ValidateHelper.validateData(item, [
                                    { key: rowKey + '，直接委托供应商', attributeName: 'supplierCode', validator: [new RequiredValidator("请选择！")] },
                                    { key: rowKey + '，合同经办人', attributeName: 'operatorUser', validator: [new RequiredValidator("请选择！")] }
                                ]);
                                modelStateDictionary.merge(required);
                            }
                        }
                    }
                    return modelStateDictionary;
                };

                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfNotProject.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                    ]);

                    return modelStateDictionary;
                };

                $scope.autosave = function (loginInfo) {
                    var $viewData = {};
                    $viewData.dataInput = angular.toJson($scope.viewModel);
                    $viewData.actionParams = angular.toJson({
                        activityId: $scope.currentActivityId,
                        transitionKey: $scope.wfOperateOpts.transitionKey,
                        fields: sogWfQueryField.All,
                        viewModel: $scope.viewModel,
                        updateTag: $scope.updateTag
                    });
                    var urlParams = {
                        activityId: $scope.currentActivityId,
                        actionName: "Save",
                        updateTag: $scope.updateTag
                    };
                    wfWaiting.show();
                    $http.put(seagull2Url.getPlatformUrl("/DirectCommissionedNotProjectApplicationWf"), $viewData, { 'params': urlParams })
                        .error(function (data, status, headers, config) {
                            wfWaiting.hide();
                            sogModal.openMessageDialog(status, data);
                        }).success(function (data, status, headers, config) {
                            wfWaiting.hide();

                            $http.post(seagull2Url.getPlatformUrl("/JdMallUser/JdLogin"), loginInfo)
                                .success(function (data) {
                                    wfWaiting.hide();
                                    if (data.success) {
                                        var loginInfo = data.data;
                                        console.log(loginInfo);

                                        var form1 = document.createElement('form');
                                        form1.id = "formId";
                                        form1.name = "formId";
                                        document.body.appendChild(form1);

                                        createHidden("pin", loginInfo.pin, form1);
                                        createHidden("appId", loginInfo.appId, form1);
                                        createHidden("strustNo", loginInfo.strustNo, form1);
                                        createHidden("sign", loginInfo.sign, form1);
                                        createHidden("uniqueNo", loginInfo.uniqueNo, form1);
                                        createHidden("hookUrl", loginInfo.hookUrl, form1);
                                        createHidden("PR", loginInfo.pr, form1);
                                        createHidden("returnUrl", loginInfo.returnUrl, form1);

                                        form1.method = 'post';
                                        form1.action = loginInfo.jdVspUrl;
                                        form1.targer = '_blank';
                                        console.log(form1);
                                        form1.submit();
                                        document.body.removeChild(form1);
                                    } else {
                                        var promise = sogModal.openConfirmDialog("提示", data.message);
                                        promise.then(function () {
                                            $window.location.reload();
                                        }, function () {
                                            $window.location.reload();
                                        });
                                    }
                                })
                                .error(function (data, status) {
                                    sogModal.openErrorDialog(data, status, "登录京东失败");
                                    wfWaiting.hide();
                                });


                            //$window.location.reload();
                        });
                }
                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        result = validData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel)
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
                $scope.$watch('viewModel.purchaseOfNotProject.project', $scope.baseInfo.projectChange);
                $scope.$watch('viewModel.purchaseOfNotProject.directDelegationReasonCode', $scope.baseInfo.watchReasonChange);
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
                        ProjectCode: $scope.viewModel.purchaseOfNotProject.projectCode,
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,
                        CostCenterCode: $scope.viewModel.mainCostCenterCode,
                        ChargeCompanyCode: $scope.viewModel.purchaseOfNotProject.chargeCompanyCode,
                        IsGreatLawsuit: $scope.viewModel.purchaseOfNotProject.isGreatLawsuit == null ? false : $scope.viewModel.purchaseOfNotProject.isGreatLawsuit,
                        IsLegal: $scope.viewModel.purchaseOfNotProject.isLegal == null ? false : $scope.viewModel.purchaseOfNotProject.isLegal,
                        CorporationCode: $scope.viewModel.corporationScopeList[0].corporationCode,
                        DirectDelegationReasonCode: $scope.viewModel.purchaseOfNotProject.directDelegationReasonCode
                    };
                    if (!$scope.viewModel.isUseCostCenter) {
                        param.ChargeCompanyCode = $scope.viewModel.purchaseOfNotProject.chargeCompanyCode;
                        param.CostCenterCode = $scope.viewModel.purchaseOfNotProject.costCenterCode;
                    }
                    if (!$scope.viewModel.purchaseOfNotProject.isInvolveProject) { param.ProjectCode = ""; }
                    if (param.PurchaseAmount && param.CostCenterCode && param.ChargeCompanyCode && param.CorporationCode) {
                        wfOperate.refreshProcess('/DirectCommissionedNotProjectApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                });

                // 初始化
                $scope.baseInfo.init();
            }]);
    });