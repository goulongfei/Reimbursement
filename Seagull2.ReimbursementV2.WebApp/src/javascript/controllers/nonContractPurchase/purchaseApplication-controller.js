define(
    [
        'app',
        'tiger-balm',
        'linqjs',
        'corporationRadioSelector',
        'commonUtilExtend',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        "autoCompleteExtend",
        'contractAgreementExtend',
        'governmentSelectorExtend'
    ],
    function (app) {

        app.controller('purchaseApplication_controller', [
            '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'configure', 'linq', 'rcTools', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'regionType', 'regionShowStyle',
            function ($scope, $rootScope, $http, wfOperate, viewData, wfWaiting, configure, linq, rcTools, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, regionType, regionShowStyle) {

                angular.extend($scope, viewData);
                console.log($scope.viewModel);
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = true;//作废
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowComment = true;  //评论
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.isSeletProject = false;//是否选择项目
                $scope.mainTitle = '采购管理';
                $scope.title = '无合同采购';
                if ($scope.viewModel.isNonContractAdditional)
                    $scope.title = "无合同采购补录";
                if ($scope.viewModel.contractAgreementScopeList.length > 0) {
                    angular.extend($scope.viewModel.contractAgreementSplitInfoList, $scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList); //无合同采购选择用的合约规划内容
                }

                var apiUrl = {
                    productType: '/PurchaseOfNoContract/GetProductType?rand=' + Math.random(),
                    saveCostAttributionData: '/PurchaseOfNoContract/SaveCostAttributionData?rand=' + Math.random(),
                };
                //是否有返回款
                $scope.hasPrepaymentRefundList = [
                    { code: true, name: "是", checked: $scope.viewModel.purchaseOfNoContract.hasPrepaymentRefund },
                    { code: false, name: "否", checked: !$scope.viewModel.purchaseOfNoContract.hasPrepaymentRefund }
                ];
                //  生成Code
                $scope.newGuid = function () {
                    var guid = "";
                    for (var i = 1; i <= 32; i++) {
                        var n = Math.floor(Math.random() * 16.0).toString(16);
                        guid += n;
                        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                            guid += "-";
                    }
                    return guid;
                }

                //基本信息
                $scope.baseInfo = {
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
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
                    percentopts: {
                        min: 0,
                        max: 10000000,
                        precision: 2
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 地区
                    regionOpts: {
                        root: {
                            id: 'CHN',
                            //子级的类型
                            childrenClass: regionType.province
                        },
                        rootName: '中国',
                        selectMask: [regionType.county],
                        multiple: false,
                        showStyle: regionShowStyle.fullName,
                    },
                    //项目
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.purchaseOfNoContract.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.purchaseOfNoContract.project = project;
                            $scope.viewModel.purchaseOfNoContract.projectCode = project.projectCode;
                            $scope.viewModel.purchaseOfNoContract.projectName = project.projectName;
                            $scope.baseInfo.contractAgreementOpts.projectCode = project.projectCode;
                            $scope.baseInfo.contractAgreementOpts.projectName = project.projectName;
                            $scope.baseInfo.loadStageAreas(project.projectCode);
                            //$scope.refreshProcess();
                        }
                    },
                    // 项目变更 projectChange
                    projectChange: function (newVal, oldVal) {
                        if (newVal === oldVal) { return; }
                        if (newVal) {
                            $scope.viewModel.purchaseOfNoContract.projectCode = newVal.projectCode;
                            $scope.viewModel.purchaseOfNoContract.projectName = newVal.projectName;
                            $scope.viewModel.purchaseOfNoContract.stageAreaCode = null;
                            $scope.viewModel.purchaseOfNoContract.stageAreaName = null;
                            $scope.baseInfo.contractAgreementOpts.projectCode = newVal.projectCode;
                            $scope.baseInfo.contractAgreementOpts.projectName = newVal.projectName;
                            $scope.baseInfo.contractAgreementOpts.stageAreaCode = null;
                            $scope.baseInfo.contractAgreementOpts.stageAreaName = null;
                            $scope.api.deleteContractAgreementScopeInfoList();
                            $scope.baseInfo.loadStageAreas(newVal.projectCode);
                            if (newVal.projectCode) {
                                $scope.refreshProcess();
                            }
                        }
                        else {
                            $scope.baseInfo.projectOpts.projectName = null;
                            $scope.viewModel.purchaseOfNoContract.projectCode = null;
                            $scope.viewModel.purchaseOfNoContract.projectName = null;
                            $scope.viewModel.purchaseOfNoContract.stageAreaCode = null;
                            $scope.viewModel.purchaseOfNoContract.stageAreaName = null;
                            $scope.viewModel.purchaseOfNoContract.isInvolveProject = false;
                            $scope.api.deleteContractAgreementScopeInfoList();
                            if (oldVal && oldVal.projectCode) { $scope.refreshProcess(); }
                        }
                    },
                    // 加载期区
                    loadStageAreas: function (projectCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.stageArea = [];
                        var param = { projectCode: projectCode };
                        $scope.api.getStageAreasByProjectCode(param, function (data) {
                            wfWaiting.hide();
                            if (data.error.length == 0) {
                                $scope.viewModel.option.stageArea = data.areaList;
                            } else {
                                sogModal.openAlertDialog("提示信息", data.error);
                            }
                        });
                    },
                    // 期区选中下拉框数据变化
                    stageAreaChange: function () {
                        angular.forEach($scope.viewModel.option.stageArea, function (v) {
                            if ($scope.viewModel.purchaseOfNoContract.stageAreaCode === v.code) {
                                $scope.viewModel.purchaseOfNoContract.stageAreaName = v.name;
                            }
                        });
                        $scope.baseInfo.contractAgreementOpts.stageAreaCode = $scope.viewModel.purchaseOfNoContract.stageAreaCode;
                        $scope.baseInfo.contractAgreementOpts.stageAreaName = $scope.viewModel.purchaseOfNoContract.stageAreaName;
                        $scope.api.deleteContractAgreementScopeInfoList();
                        $scope.refreshProcess();
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
                            $scope.baseInfo.loadChargeCompany(corporation.corporationCode);
                        }
                    },
                    //法人公司选择后数据变化
                    corporationSelected: function () {
                        //每次重新选择法人公司将之前选择的清空
                        $scope.viewModel.purchaseOfNoContract.corporationCode = "";
                        $scope.viewModel.purchaseOfNoContract.corporationName = "";
                        var viewpath = './htmlTemplate/dialogTemplate/common/corporationRadioSelector.html';
                        var projectDetailResult = sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                            '选择法人公司', "corporationRadioSelector_controller", $scope, {
                            containerStyle: {
                                width: '60%'
                            }
                        });
                        projectDetailResult.then(function (resultData) {
                            $scope.viewModel.purchaseOfNoContract.corporationCode = resultData.code;
                            $scope.viewModel.purchaseOfNoContract.corporationName = resultData.cnName;
                            $scope.baseInfo.loadChargeCompany($scope.viewModel.purchaseOfNoContract.corporationCode);
                        });
                    },
                    //查询记账公司
                    loadChargeCompany: function (corporationCode) {
                        wfWaiting.show();
                        $scope.viewModel.option.chargeCompany = [];
                        $scope.viewModel.purchaseOfNoContract.chargeCompanyCode = "";
                        $scope.viewModel.purchaseOfNoContract.chargeCompanyName = "";
                        $scope.viewModel.option.costCenter = [];
                        $scope.viewModel.purchaseOfNoContract.costCenterCode = "";
                        $scope.viewModel.purchaseOfNoContract.costCenterName = "";
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
                            if ($scope.viewModel.purchaseOfNoContract.chargeCompanyCode === v.code) {
                                $scope.viewModel.purchaseOfNoContract.chargeCompanyName = v.name;
                            }
                            if ($scope.viewModel.purchaseOfNoContract.chargeCompanyCode) {
                                $scope.baseInfo.loadCostCenter($scope.viewModel.purchaseOfNoContract.chargeCompanyCode);
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
                            if ($scope.viewModel.purchaseOfNoContract.costCenterCode === v.code) {
                                $scope.viewModel.purchaseOfNoContract.costCenterName = v.name;
                            }
                        });
                        $scope.refreshProcess();
                    },
                    //是否有返还款
                    hasPrepaymentRefund: function (item) {
                        if (item != null && !item.checked) {
                            $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount = 0;
                            $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale = 0;
                        }
                    },
                    //应返还比例
                    refundScale: function () {
                        if ($scope.viewModel.purchaseBase.purchaseAmount != null && $scope.viewModel.purchaseBase.purchaseAmount != 0) {
                            $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount = $scope.viewModel.purchaseBase.purchaseAmount * ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale * 1.0 / 100);
                        } else {
                            $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount = 0;
                        }
                    },
                    //应返还金额
                    refundAmount: function () {
                        if ($scope.viewModel.purchaseBase.purchaseAmount != null && $scope.viewModel.purchaseBase.purchaseAmount != 0) {
                            $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale = ($scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount * 1.0 / $scope.viewModel.purchaseBase.purchaseAmount) * 100;
                        } else {
                            $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale = 0;
                        }
                    },
                    //收款单位(政府)
                    //governmentOpts: {
                    //    readOnly: false,
                    //    chargeUnitName: $scope.viewModel.purchaseOfNoContract.chargeUnitName,
                    //    beforAppend: function (government) {
                    //        $scope.viewModel.purchaseOfNoContract.government = government;
                    //        $scope.viewModel.purchaseOfNoContract.chargeUnitCode = government.code;
                    //        $scope.viewModel.purchaseOfNoContract.chargeUnitName = government.cnName;
                    //        $scope.baseInfo.contractAgreementOpts.chargeUnitCode = government.code;
                    //        $scope.baseInfo.contractAgreementOpts.chargeUnitName = government.cnName;
                    //    }
                    //},
                    //收款单位(政府)
                    governmentOpts: {
                        dataList: $scope.viewModel.option.chargeUnitList,
                        inintStr: $scope.viewModel.purchaseOfNoContract.chargeUnitName,
                        afterSelected: function (item) {
                            if (item != null) {
                                $scope.viewModel.purchaseOfNoContract.chargeUnitCode = item.code;
                                $scope.viewModel.purchaseOfNoContract.chargeUnitName = item.name;
                            }
                        }
                    },
                    //合约规划
                    contractAgreementOpts: {
                        projectCode: $scope.viewModel.purchaseOfNoContract.projectCode,
                        projectName: $scope.viewModel.purchaseOfNoContract.projectName,
                        stageAreaCode: $scope.viewModel.purchaseOfNoContract.stageAreaCode,
                        stageAreaName: $scope.viewModel.purchaseOfNoContract.stageAreaName,
                        occupyObjectTypeCode: "3",
                        applicationName: "无合同采购",
                        contractAgreement: $scope.viewModel.contractAgreementScopeList,
                        readonly: true,
                        model: 'edit',
                        isAdmin: $scope.viewModel.isAdmin,
                        beforAppend: function (v) {
                            var myContract = dataFormat(v);// 格式化到视图
                            var costAttribution = [];   //成本归属
                            var isSelected = false;
                            angular.extend(costAttribution, myContract);  //复制一份合约列表，用于成本归属信息填写
                            costAttribution.disabled = false;
                            if (myContract.contractAgreementTypeCode != 1 && myContract.contractAgreementTypeCode != 7) {
                                var message = "无合同采购只能选择四项或营销类的合约规划！";
                                sogModal.openAlertDialog("提示", message);
                                return false;
                            }
                            //判断是否还有余量
                            var surplus = 0;
                            for (var i = 0; i < costAttribution.contractAgreementSplitInfoList.length; i++) {
                                surplus += rcTools.toFixedNum(costAttribution.contractAgreementSplitInfoList[i].surplusValueWithTax, 2);
                                rcTools.toFixedNum(surplus, 2);
                            }
                            if (parseFloat(surplus) <= 0) {
                                sogModal.openAlertDialog('选择合约规划', "您选取的合约成本目标已全部用完, 请重新选择合约!");
                                return;
                            }

                            if ($scope.viewModel.contractAgreementScopeList.length > 0) {
                                angular.forEach($scope.viewModel.contractAgreementScopeList, function (c) {
                                    if (c.contractAgreementCode === myContract.contractAgreementCode) {
                                        var message = "合约已选择！";
                                        sogModal.openAlertDialog("提示", message);
                                        isSelected = true;
                                        return;
                                    }
                                });
                            };
                            if (!isSelected) {
                                $scope.viewModel.contractAgreementScopeList.push(myContract);
                                $scope.viewModel.contractAgreementSplitInfoList = myContract.contractAgreementSplitInfoList;
                                $scope.viewModel.costTargetStageAreaProductTypeApportionInfoList = $scope.viewModel.contractAgreementSplitInfoList
                            };
                        },
                        beforDelete: function () {
                            $scope.api.deleteContractAgreementScopeInfoList();
                        },
                    },

                    /////成本归属//////
                    //业态范围
                    selectBusinessType: function (item) {
                        var param = { projectCode: $scope.viewModel.purchaseOfNoContract.projectCode, stageAreaCode: $scope.viewModel.purchaseOfNoContract.stageAreaCode };
                        $http.get(seagull2Url.getPlatformUrl(apiUrl.productType), {
                            params: {
                                url: $scope.api.urlGetProductTypesByProjectCodeAndStageAreaCode(param),
                                ProjectCode: $scope.viewModel.purchaseOfNoContract.projectCode,
                                StageAreaCode: $scope.viewModel.purchaseOfNoContract.stageAreaCode == null || $scope.viewModel.purchaseOfNoContract.stageAreaCode == '' ?
                                    "null" : $scope.viewModel.purchaseOfNoContract.stageAreaCode
                            },
                            cache: false
                        }).then(function (response) {
                            wfWaiting.hide();
                            $scope.productTypeListAll = response.data;
                            $scope.productTypeList = null;
                            if ($scope.productTypeListAll == null || $scope.productTypeListAll.length <= 0) {
                                sogModal.openAlertDialog('提示', "此项目没有业态信息,请先录入规划指标！");
                                return;
                            } else if ($scope.productTypeList == null) {
                                var data = $scope.productTypeListAll;
                                if (data != null) {
                                    //顶级节点
                                    var treeList = [];
                                    angular.forEach($scope.productTypeListAll, function (item) {

                                        treeList.push({
                                            id: item.o_PInfo.stageAreaCode,
                                            checkedable: false,
                                            displayName: item.o_PInfo.stageAreaName,
                                            hasChildren: true,
                                            children: null,
                                        });
                                    });
                                    $scope.treeList = treeList;
                                }
                            }
                            var viewPath = './views/nonContractPurchase/htmlTemplate/businessTypesSelector.html';
                            var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                            sogModal.openLayer(template, ['$scope', function ($treeScope) {
                                $treeScope.selectCategory = [];
                                var treeData = function (data) {
                                    var treeList = [];
                                    data.forEach(function (item) {
                                        treeList.push({
                                            isTopNode: true,
                                            id: item.id,
                                            displayName: item.displayName,
                                            title: item.displayName,
                                            children: childrenList($scope.productTypeListAll, item.id)//加载子节点
                                        });
                                    })
                                    return treeList;
                                };
                                var childrenList = function (data, stageAreaCode) {
                                    var childrenList = [];
                                    var list = linq.from(data).where(function (item) {
                                        return item.o_PInfo.stageAreaCode == stageAreaCode;
                                    }).toArray();
                                    list[0].productListInfo.forEach(function (item) {
                                        if (item.propertyTypeClassifyName != null) {
                                            var checked = false;
                                            var code = '';
                                            var resultCode = ''
                                            if (item.costTargetStageAreaProductTypeApportionInfoList != null && item.costTargetStageAreaProductTypeApportionInfoList.length > 0) {
                                                var checkedArr = linq.from(item.costTargetStageAreaProductTypeApportionInfoList).where(function (p) {
                                                    return p.productTypeCode == item.productTypeCode && p.stageAreaCode == list[0].o_PInfo.stageAreaCode;
                                                }).toArray();
                                                checked = checkedArr.length > 0;
                                                if (checked) {
                                                    code = checkedArr[0].code;
                                                    resultCode = checkedArr[0].resultCode;
                                                }
                                            }

                                            var displayName = item.productTypeName;
                                            if (item.propertyTypeClassifyName != null) {
                                                displayName = '(' + item.propertyTypeClassifyName + ')' + item.productTypeName;
                                            }
                                            var children = {
                                                id: item.productTypeCode,
                                                displayName: displayName,
                                                title: item.productTypeName,
                                                hasChildren: false,
                                                hasLoaded: false,
                                                expanded: true,
                                                selected: false,
                                                checked: checked,
                                                checkedable: true,
                                                vendibilityArea: item.vendibilityArea, //可售面积
                                                buildingArea: item.buildingArea, //可售面积
                                                stageAreaCode: list[0].o_PInfo.stageAreaCode,
                                                stageAreaName: list[0].o_PInfo.stageAreaName,
                                                code: code,
                                                resultCode: resultCode
                                            }
                                            if (checked) {
                                                $treeScope.selectCategory.push(children);
                                            }
                                            childrenList.push(children);
                                        }
                                    });
                                    return childrenList;
                                }

                                $treeScope.dynamicOpts = {
                                    'showCheckboxes': true,
                                    'autoLoadRoot': false,
                                    'expanded': true,
                                    'nodeClick': function (e) {
                                        $treeScope.selectCategory.forEach(function (item, index) {
                                            if (e.nodeData.id == item.id && e.nodeData.stageAreaCode == item.stageAreaCode) {
                                                $treeScope.selectCategory.splice(index, 1);
                                            }
                                        })
                                        if (e.nodeData.checked) {
                                            $treeScope.selectCategory.push(e.nodeData);
                                        }
                                    }
                                };

                                $treeScope.list = treeData($scope.treeList);

                                $treeScope.contractAgreementCategoryOk = function () {
                                    if ($treeScope.selectCategory == null || $treeScope.selectCategory.length <= 0) {
                                        sogModal.openAlertDialog('提示', "请选择产品类型！");
                                        return;
                                    }

                                    //初始化分摊信息
                                    item.costTargetStageAreaProductTypeApportionInfoList = [];
                                    item.businessTypeNames = '';
                                    angular.forEach($treeScope.selectCategory, function (c) {
                                        item.costTargetStageAreaProductTypeApportionInfoList.push({
                                            code: $scope.newGuid(),
                                            resourceID: item.resourceID,
                                            className: 1, //1.采购.合约期区产品类型成本目标分摊信息
                                            creator: $scope.viewModel.formAction.creator,
                                            createTime: new Date(),
                                            validStatus: true,
                                            stageAreaCode: item.stageAreaCode,
                                            stageAreaName: item.stageAreaName,
                                            productTypeCode: c.id,
                                            productTypeName: c.title,
                                            projectCode: item.projectCode,
                                            projectName: item.projectName,
                                            buildingArea: c.buildingArea, //建筑面积
                                            vendibilityArea: c.vendibilityArea, //可售面积
                                            diyApportionScale: 0, //自定义分摊占比
                                            diyApportionAmount: 0, //自定义分摊金额
                                            finallyApportionScale: 0,
                                            finallyApportionAmountWithTax: 0,
                                            finallyApportionAmountNotTax: 0,
                                            apportionCostDescribe: "",
                                            apportionRuleCode: item.allotTypeCode,
                                            apportionRuleName: item.allotTypeName,
                                            taxRate: item.taxValue,
                                            aggregationToCode: item.code,
                                            resultCode: ""
                                        });
                                        item.businessTypeNames += c.displayName + ',';
                                    })
                                    $treeScope.closeThisDialog();
                                }
                            }], undefined, {}, undefined, undefined);
                        }, function (data) { });
                    },

                    //更改分配方式
                    changeApportionmentWay: function (obj, index) {
                        angular.forEach($scope.viewModel.allotTypeList, function (v) {
                            if (obj.allotTypeCode === v.code) {
                                angular.forEach(obj.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                    c.apportionRuleCode = v.code
                                    c.apportionRuleName = v.name;
                                    obj.allotTypeCode = v.code;
                                    obj.allotTypeName = v.name;
                                });
                            }
                        });
                    },

                    //自定义分配方式
                    editallotType: function (item, index) {
                        if (item.actualAmount == 0 || item.actualAmount == "") {
                            sogModal.openAlertDialog('提示', "请先填写实际金额！");
                            return;
                        }
                        if (item.allotTypeCode == null || item.allotTypeCode == "") {
                            sogModal.openAlertDialog('提示', "请先选择分配方式！");
                            return;
                        }
                        if (item.costTargetStageAreaProductTypeApportionInfoList[index].productTypeCode == null || item.costTargetStageAreaProductTypeApportionInfoList[index].productTypeCode == "") {
                            sogModal.openAlertDialog('提示', "请先选择业态范围！");
                            return;
                        }
                        var viewPath = './views/nonContractPurchase/htmlTemplate/addCostAttributionDetail.html';
                        var template = '<div><div ng-include="\'' + viewPath + '\'"></div>';
                        sogModal.openDialog(template, '自定义比例', ['$scope', function ($childModelScope) {
                            $childModelScope.diyScaleOpts = {
                                min: 0,
                                max: 100
                            }
                            //显示自定义金额
                            angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                if (c.diyApportionScale != undefined && c.diyApportionScale != 0) {
                                    c.diyApportionAmount = (item.actualAmount * c.diyApportionScale) / 100;
                                }
                            });
                            $childModelScope.list = angular.copy(item.costTargetStageAreaProductTypeApportionInfoList);
                            $childModelScope.readOnly = $scope.readOnly;
                            $childModelScope.numOpts = {
                                min: 0,
                                max: 100,
                                precision: 2
                            }
                            $childModelScope.productTypeConf = {
                                currentPage: 1,
                                itemsPerPage: 6,
                                totalItems: 0,
                            };
                            //成本归属实际金额
                            $scope.unSharedScaleNew = 100;
                            initInfo();
                            function initInfo() {
                                if (item.costTargetStageAreaProductTypeApportionInfoList) {
                                    $childModelScope.productTypeList = item;
                                    var a = 0;
                                    angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                        if (item.actualAmount) {
                                            a += parseFloat(c.diyApportionScale);
                                        }
                                    });
                                    $childModelScope.unSharedScale = $scope.unSharedScaleNew - a;
                                    $childModelScope.productTypeConf.totalItems = $childModelScope.list.length;
                                }
                                $scope.totalSharedAmount = getTotalAmount();
                            }
                            function getTotalAmount() {
                                var totalAmount = linq.from(item.costTargetStageAreaProductTypeApportionInfoList).sum(function (ap) {
                                    angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                        if (ap.productTypeCode == c.productTypeCode && ap.code == c.code) {
                                            c.diyApportionAmount = (item.actualAmount * ap.diyApportionScale) / 100;
                                        }
                                    });
                                    return ap.diyApportionAmount;
                                });
                                return rcTools.toFixedNum(totalAmount, 2);
                            }
                            $childModelScope.ActualAmountOnchange = function (v) {
                                var a = $childModelScope.getTotalScale();

                                angular.forEach($childModelScope.list, function (c) {
                                    if (c.diyApportionScale != undefined && c.diyApportionScale != 0 && c.diyApportionScale != null) {
                                        c.diyApportionAmount = (item.actualAmount * c.diyApportionScale) / 100;
                                    } else {
                                        c.diyApportionAmount = 0;
                                    }
                                });
                                $scope.totalSharedAmount = $childModelScope.getTotalAmount();
                                if (a > $scope.unSharedScaleNew) {
                                    sogModal.openAlertDialog('分摊信息', '分摊总金额不能大于成本归属实际金额!');
                                    v.diyApportionScale = 0;
                                    var b = 0;
                                    angular.forEach($childModelScope.productTypeList, function (v) {
                                        if (v.diyApportionScale) {
                                            b += parseFloat(v.diyApportionScale);
                                        }
                                    })
                                    $childModelScope.unSharedScale = $scope.unSharedScaleNew - b;
                                    return;
                                } else {
                                    $childModelScope.unSharedScale = $scope.unSharedScaleNew - a;
                                }
                            }
                            //计算分摊总比例
                            $childModelScope.getTotalScale = function () {
                                var totalScale = linq.from($childModelScope.list).sum(function (ap) {
                                    angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                        if (ap.productTypeCode == c.productTypeCode && ap.code == c.code) {
                                            c.diyApportionScale = ap.diyApportionScale;
                                            c.diyApportionAmount = (item.actualAmount * ap.diyApportionScale) / 100;
                                        }
                                    });
                                    return ap.diyApportionScale;
                                });
                                return rcTools.toFixedNum(totalScale, 2);
                            }
                            //计算分摊总金额
                            $childModelScope.getTotalAmount = function () {
                                var totalAmount = linq.from($childModelScope.list).sum(function (ap) {
                                    angular.forEach(item.costTargetStageAreaProductTypeApportionInfoList, function (c) {
                                        if (ap.productTypeCode == c.productTypeCode && ap.code == c.code) {
                                            c.diyApportionAmount = (item.actualAmount * ap.diyApportionScale) / 100;
                                        }
                                    });
                                    return ap.diyApportionAmount;
                                });
                                return rcTools.toFixedNum(totalAmount, 2);
                            }
                            $childModelScope.confirm = function () {
                                if ($childModelScope.unSharedScale != 0) {
                                    sogModal.openAlertDialog('分摊信息', '您还有剩余未分配金额!');
                                    return;
                                }
                                $childModelScope.closeThisDialog();
                            }
                            $childModelScope.cancel = function () {
                                if ($childModelScope.unSharedScale != 0) {
                                    sogModal.openAlertDialog('分摊信息', '您还有剩余未分配金额!');
                                    return;
                                }
                                $childModelScope.closeThisDialog();
                            }
                        }], $scope, { containerStyle: { width: '320px;' } }, function (v, defer) {
                            item.costTargetStageAreaProductTypeApportionInfoList = v;
                            defer.resolve(v);
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                    },

                    validOnchange: function (item) {
                        $scope.viewModel.purchaseBase.purchaseAmount = 0;
                        var sorNo = 1;
                        var errorMessage = "";
                        angular.forEach(item.contractAgreementSplitInfoList, function (v) {
                            var surplusValueWithTax = rcTools.toFixedNum(v.surplusValueWithTax, 2);
                            if (surplusValueWithTax < 0) {
                                errorMessage += '第' + sorNo + '行科目成本余量不能小于0！;';
                            } else {
                                $scope.viewModel.purchaseBase.purchaseAmount += v.actualAmount;
                            }
                            sorNo++;
                        });
                        if (errorMessage) {
                            var message = {
                                "message": "成本归属信息验证失败",
                                "modelState": {
                                    "成本归属": errorMessage.split(";"),
                                }
                            };
                            sogModal.openBadRequestDialog(message, function () {
                                $scope.msg = "关闭了";
                            });
                        }
                    },

                    actualAmountOnchange: function (item, index) {
                        angular.forEach(item.contractAgreementSplitInfoList, function (k) {
                            if (k.actualAmount == null) {
                                k.actualAmount = 0;
                            }
                        });
                        if ($scope.viewModel.purchaseBase.purchaseAmount > $scope.viewModel.contractAgreementScopeList[0].costTargetAmount) {
                            sogModal.openAlertDialog('成本归属', '分摊总金额不能大于成本目标金额!');
                            $scope.viewModel.purchaseBase.purchaseAmount = 0;
                            return;
                        } else {
                            $scope.baseInfo.getEachTotalAmount();
                            $scope.viewModel.purchaseBase.purchaseAmount = 0;
                            angular.forEach(item.contractAgreementSplitInfoList, function (v) {
                                if (v.actualAmount > 0) {
                                    $scope.viewModel.purchaseBase.purchaseAmount += v.actualAmount;
                                }
                            });
                            if ($scope.viewModel.purchaseBase.purchaseAmount != null && $scope.viewModel.purchaseBase.purchaseAmount != 0) {
                                if ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale != 0 && $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount == 0) {
                                    $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount = $scope.viewModel.purchaseBase.purchaseAmount * ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale * 1.0 / 100);
                                } else if ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale == 0 && $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount != 0) {
                                    $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale = ($scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount * 1.0 / $scope.viewModel.purchaseBase.purchaseAmount) * 100;
                                } else if ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale != 0 && $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount != 0) {
                                    $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount = $scope.viewModel.purchaseBase.purchaseAmount * ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale * 1.0 / 100);
                                }
                            } else {
                                $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount = 0;
                                $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale = 0;
                            }
                        }
                        $scope.refreshProcess();
                    },
                    forecastHappenOnchange: function (item) {
                        item.originForecastHappenAmountWithTax = item.forecastHappenAmountWithTax;
                        $scope.baseInfo.validOnchange(item);
                        $scope.baseInfo.getEachTotalAmount();
                    },
                    //成本归属每项的合计计算
                    getEachTotalAmount: function () {
                        if ($scope.viewModel.contractAgreementScopeList.length > 0) {
                            var allCostTargetAmount = 0;
                            var allActualAmount = 0;
                            var allAccumulativeHappenedAmountWithTax = 0;
                            var allForecastHappenAmountWithTax = 0;
                            angular.forEach($scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList, function (splitInfo) {
                                allCostTargetAmount += parseFloat(splitInfo.costTargetAmount);
                                allActualAmount += parseFloat(splitInfo.actualAmount);
                                allAccumulativeHappenedAmountWithTax += parseFloat(splitInfo.accumulativeHappenedAmountWithTax);
                                allForecastHappenAmountWithTax += parseFloat(splitInfo.forecastHappenAmountWithTax);
                            });
                            $scope.viewModel.contractAgreementScopeList[0].allCostTargetAmount = allCostTargetAmount;
                            $scope.viewModel.contractAgreementScopeList[0].allActualAmount = allActualAmount;
                            $scope.viewModel.contractAgreementScopeList[0].allAccumulativeHappenedAmountWithTax = allAccumulativeHappenedAmountWithTax;
                            $scope.viewModel.contractAgreementScopeList[0].allForecastHappenAmountWithTax = allForecastHappenAmountWithTax;
                            $scope.viewModel.contractAgreementScopeList[0].allSurplusValueWithTax = allCostTargetAmount - allActualAmount - allAccumulativeHappenedAmountWithTax - allForecastHappenAmountWithTax;
                        }
                    },
                    isHasRefreshed: true,

                };

                //页面所用函数
                $scope.api = {
                    //自定义指令回调函数
                    urlGetStageAreasByProjectCode: function (param) {
                        return seagull2Url.getPlatformUrl('/ProjectInfo/GetStageAreasByProjectCode?r=' + Math.random() + '&projectCode=' + param.projectCode);
                    },
                    //获取业态
                    urlGetProductTypesByProjectCodeAndStageAreaCode: function (param) {
                        var config = {};
                        var projectCode = param.projectCode;
                        var stageAreaCode = param.stageAreaCode;
                        var rootUrl = configure.getConfig(config, 'common').apiUrlBase
                        var url = "";
                        if ($scope.viewModel.purchaseOfNoContract.stageAreaCode == '' || $scope.viewModel.purchaseOfNoContract.stageAreaCode == null) {
                            url = rootUrl + '/THRWebApi/ProDefineV2/FurnishIntertemporal/GetProductTypeTargetData?r=' + Math.random() + '&ProjectCode=' + projectCode;
                        } else {
                            url = rootUrl + '/THRWebApi/ProDefineV2/FurnishIntertemporal/GetTargetInfoData?r=' + Math.random() + '&ProjectCode=' + projectCode + '&StageAreaCode=' + stageAreaCode;
                        }
                        return url;
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
                    // 删除合约规划
                    deleteContractAgreementScopeInfoList: function () {
                        if ($scope.viewModel.contractAgreementScopeList !== undefined && $scope.viewModel.contractAgreementScopeList.length > 0) {
                            $scope.baseInfo.contractAgreementOpts.contractAgreement = []
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
                    autoDeduction: function (contractAgreement) {
                        this.calcForecastHappenAmount(contractAgreement, false);
                    },
                    recovery: function (contractAgreement) {
                        this.calcForecastHappenAmount(contractAgreement, true);
                    },
                    calcForecastHappenAmount: function (contractAgreement, isRecovery) {
                        wfWaiting.show();
                        var baseUrl = seagull2Url.getPlatformUrl("/EngineerAlternation/LoadForecastHappen") + '?&contractAgreementCode=' + contractAgreement.contractAgreementCode;
                        var url = baseUrl.replace("ReimbursementV2", "ContractV2");
                        $http.get(url + '&r=' + Math.random(), { cache: false })
                            .success(function (response) {
                                wfWaiting.hide();
                                if (response.state) {
                                    angular.forEach(response.data, function (item) {
                                        var arry = linq.from($scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList).where(
                                            function (where) {
                                                return where.costCourseCode === item.costCourseCode;
                                            });
                                        if (arry !== null && arry !== undefined) {
                                            arry = arry.toArray();
                                            if (angular.isArray(arry) && arry.length > 0) {
                                                if (isRecovery) {
                                                    arry[0].forecastHappenAmountWithTax = item.forecastHappenAmount;
                                                    arry[0].originForecastHappenAmountWithTax = item.forecastHappenAmount;
                                                } else {
                                                    if (arry[0].actualAmount > 0) {
                                                        arry[0].originForecastHappenAmountWithTax = item.forecastHappenAmount - arry[0].actualAmount < 0 ? 0 : rcTools.toFixedNum(item.forecastHappenAmount - arry[0].actualAmount, 2);
                                                        arry[0].forecastHappenAmountWithTax = arry[0].originForecastHappenAmountWithTax;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    $scope.baseInfo.getEachTotalAmount();
                                } else {
                                    sogModal.openAlertDialog("提示", response.message);
                                }
                            }).error(function (data, status) {
                                wfWaiting.hide();
                                if (data) {
                                    sogModal.openAlertDialog(status, data.message);
                                } else {
                                    sogModal.openAlertDialog("提示", "获取预估待发生错误");
                                }
                            });
                    },
                };

                $scope.baseInfo.getEachTotalAmount();

                // 获取的合约数据格式化
                var dataFormat = (function (data) {
                    var contractAgreementSplitInfos = [];
                    var costTargetStageAreaProductTypeApportionInfos = [];
                    // 合约成本科目明细
                    if (angular.isArray(data.costCourseInfoController)) {
                        for (var i = 0; i < data.costCourseInfoController.length; i++) {
                            var item = data.costCourseInfoController[i];
                            var costTargetStageAreaProductTypeApportionInfo = {
                                projectCode: $scope.viewModel.purchaseOfNoContract.projectCode,
                                projectName: $scope.viewModel.purchaseOfNoContract.projectName,
                                stageAreaCode: data.stageAreaCode,
                                stageAreaName: data.stageAreaName,
                                productTypeCode: item.productTypeCode,//业态
                                productTypeName: item.productTypeName,
                                finallyApportionAmountWithTax: item.costTargetAmountWithTax == null ? 0 : item.costTargetAmountWithTax,
                                finallyApportionAmountNotTax: item.costTargetAmountTax == null ? 0 : item.costTargetAmountTax,
                                apportionRuleCode: item.apportionRuleCode,
                                apportionRuleName: item.apportionRuleName,
                            };
                            costTargetStageAreaProductTypeApportionInfos.push(costTargetStageAreaProductTypeApportionInfo);

                            var contractAgreementSplitInfo = {
                                actualAmount: 0,
                                projectCode: $scope.viewModel.purchaseOfNoContract.projectCode,
                                projectName: $scope.viewModel.purchaseOfNoContract.projectName,
                                stageAreaCode: data.stageAreaCode,
                                stageAreaName: data.stageAreaName,
                                contractAgreementCode: data.planContractCode,
                                contractAgreementName: data.planContractName,
                                costCourseCode: item.costCourseCode,
                                costCourseName: item.costCourseName,
                                costCourseLevelCode: item.costCourseLevelCode,
                                costTargetAmount: item.costTargetAmountWithTax,
                                allotTypeCode: item.apportionRuleCode,
                                allotTypeName: item.apportionRuleName,
                                businessTypeNames: item.productTypeName, //业态
                                surplusValueWithTax: item.surplusValueWithTax, //余量
                                forecastHappenAmountWithTax: item.forecastHappenAmountWithTax,
                                accumulativeHappenedAmountWithTax: item.accumulativeOccupyAmountWithTax,
                                costTargetStageAreaProductTypeApportionInfoList: costTargetStageAreaProductTypeApportionInfos
                            };
                            contractAgreementSplitInfos.push(contractAgreementSplitInfo);
                        }
                    }
                    // 被占用的合约
                    return contractAgreementScope = {
                        projectCode: $scope.viewModel.purchaseOfNoContract.projectCode,
                        projectName: $scope.viewModel.purchaseOfNoContract.projectName,
                        stageAreaCode: $scope.viewModel.purchaseOfNoContract.stageAreaCode,
                        stageAreaName: $scope.viewModel.purchaseOfNoContract.stageAreaName,
                        contractAgreementCode: data.planContractCode,
                        contractAgreementName: data.planContractName,
                        contractAgreementTypeCode: data.contractPlanTypeCode,
                        contractAgreementTypeName: data.contractPlanTypeCnName,
                        costTargetAmount: data.costTarget,
                        contractAgreementSplitInfoList: contractAgreementSplitInfos,
                        isCostBelongStageArea: data.isCostBelongStageArea,
                        validStatus: true,
                    }
                });
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
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(100, "不能大于100个字符!") },
                        { key: '项目名称', attributeName: 'purchaseOfNoContract.projectCode', validator: new RequiredValidator('请选择！') },
                        { key: '期区', attributeName: 'purchaseOfNoContract.stageAreaName', validator: new RequiredValidator('请选择！') },
                        { key: '记账公司', attributeName: 'purchaseOfNoContract.chargeCompanyCode', validator: new RequiredValidator('请选择！') },
                        { key: '成本中心', attributeName: 'purchaseOfNoContract.costCenterCode', validator: new RequiredValidator('请选择！') },
                        { key: '建设地点详细信息', attributeName: 'purchaseOfNoContract.buildDetailAddress', validator: new stringMaxLengthValidator(200, "不能大于200个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfNoContract.purchaseContent', validator: new RequiredValidator('不能为空！') },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfNoContract.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '建设单方成本目标', attributeName: 'purchaseOfNoContract.buildingCostTargetPerArea', validator: new RequiredValidator('不能为空！') },
                        { key: '收款单位', attributeName: 'purchaseOfNoContract.chargeUnitName', validator: new RequiredValidator('不能为空') },
                        { key: '收费标准描述', attributeName: 'purchaseOfNoContract.chargeStandardDescribe', validator: new RequiredValidator('不能为空！') },
                        { key: '收费标准描述', attributeName: 'purchaseOfNoContract.chargeStandardDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '付款方式描述', attributeName: 'purchaseOfNoContract.paymentWayDescribe', validator: new RequiredValidator('不能为空！') },
                        { key: '付款方式描述', attributeName: 'purchaseOfNoContract.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '原因说明', attributeName: 'purchaseOfNoContract.reasonExplain', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '收费依据文件名称', attributeName: 'purchaseOfNoContract.chargeAccordingFileName', validator: new stringMaxLengthValidator(256, "不能大于256个字符!") },
                    ]);
                    if (!$scope.viewModel.purchaseOfNoContract.buildDetailAddress && !$scope.viewModel.isNonContractAdditional) {
                        modelStateDictionary.addModelError('建设地点', '请选择！');
                    }
                    if (!$scope.viewModel.purchaseOfNoContract.cityInput && !$scope.viewModel.isNonContractAdditional) {
                        modelStateDictionary.addModelError('建设地点详细信息', '不能为空！');
                    }
                    if (!$scope.viewModel.purchaseBase.purchaseAmount) {
                        modelStateDictionary.addModelError('本次采购金额', '本次采购金额不能为0!');
                    }
                    if (!$scope.baseInfo.isHasRefreshed) {
                        modelStateDictionary.addModelError('审批流程刷新', '审批流程刷新未完成,请稍后!');
                        $scope.baseInfo.isHasRefreshed = true;
                    }
                    // 法人公司
                    if (angular.isArray($scope.viewModel.corporationScopeList) === false
                        || $scope.viewModel.corporationScopeList.length === 0
                        || !$scope.viewModel.corporationScopeList[0].corporationCode) {
                        modelStateDictionary.addModelError('法人公司', '不能为空！');
                    }
                    // 建设单方成本目标
                    if ($scope.viewModel.purchaseOfNoContract.buildingCostTargetPerArea === 0) {
                        modelStateDictionary.addModelError('建设单方成本目标', '不能为0！');
                    }
                    if (angular.isArray($scope.viewModel.contractAgreementSplitInfoList)) {
                        // 校验成本科目是否为空
                        if ($scope.viewModel.contractAgreementSplitInfoList.length === 0) {
                            modelStateDictionary.addModelError('成本归属', '不能为空!');
                        } else {
                            var amountSum = 0;
                            angular.forEach($scope.viewModel.contractAgreementSplitInfoList, function (s) {
                                amountSum += s.actualAmount;
                            })
                            var item = $scope.viewModel.contractAgreementScopeList[0];
                            for (var i = 0; i < item.contractAgreementSplitInfoList.length; i++) {
                                var split = item.contractAgreementSplitInfoList[i];
                                var rowKey = "成本归属第" + (i + 1) + "行";
                                var surplusValueWithTax = rcTools.toFixedNum(split.surplusValueWithTax, 2);
                                if (surplusValueWithTax < 0) {
                                    modelStateDictionary.addModelError(rowKey + '，科目余量金额 ', '科目余量金额不能小于零!');
                                }
                                if (split.forecastHappenAmountWithTax == null || split.forecastHappenAmountWithTax == undefined) {
                                    modelStateDictionary.addModelError(rowKey + '，预估待发生金额 ', '预估待发生金额不能为空!');
                                }
                                if (split.actualAmount > 0) {
                                    if (split.actualAmount > split.costTargetAmount) {
                                        modelStateDictionary.addModelError(rowKey + '，本单分摊金额', '本单分摊金额应小于科目成本目标');
                                    }
                                    for (var j = 0; j < split.costTargetStageAreaProductTypeApportionInfoList.length; j++) {
                                        var rows = "自定义比例第" + (j + 1) + "条"
                                        if (split.costTargetStageAreaProductTypeApportionInfoList[j].apportionRuleCode == "3" && split.costTargetStageAreaProductTypeApportionInfoList[j].diyApportionScale === 0) {
                                            modelStateDictionary.addModelError(rowKey + '，自定义比例', '请点击编辑填写' + rows + '的金额');
                                        }
                                    }
                                    var required = ValidateHelper.validateData(split, [
                                        { key: rowKey + '，业态范围', attributeName: 'businessTypeNames', validator: [new RequiredValidator("请选择！")] },
                                        { key: rowKey + '，分配方式', attributeName: 'allotTypeCode', validator: [new RequiredValidator("请选择！")] }
                                    ]);
                                    modelStateDictionary.merge(required);
                                }
                            }
                        }
                    }
                    // 合约规划列表验证
                    if (angular.isArray($scope.viewModel.contractAgreementScopeList)) {
                        if ($scope.viewModel.contractAgreementScopeList.length === 0) {
                            modelStateDictionary.addModelError('合约规划', '不能为空!');
                        }
                    }
                    if ($scope.viewModel.purchaseOfNoContract.hasPrepaymentRefund == true || $scope.viewModel.purchaseOfNoContract.hasPrepaymentRefund == "true") {
                        if ($scope.viewModel.purchaseOfNoContract.prepaymentRefundScale == undefined || $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale == null || $scope.viewModel.purchaseOfNoContract.prepaymentRefundScale == 0) {
                            modelStateDictionary.addModelError('应返还比例', '应返还比例不能为空!');
                        }
                        if ($scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount == undefined || $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount == null || $scope.viewModel.purchaseOfNoContract.prepaymentRefundAmount == 0) {
                            modelStateDictionary.addModelError('应返还金额', '应返还金额不能为空!');
                        }
                    }
                    var fileName = "无合同采购申请报告";
                    if ($scope.viewModel.isNonContractAdditional)
                        fileName = "无合同采购补录报告";
                    if ($scope.viewModel.purchaseOfNoContractApplicationFiles == null || $scope.viewModel.purchaseOfNoContractApplicationFiles.length == 0) {
                        modelStateDictionary.addModelError("附件", fileName + "文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.purchaseOfNoContractApplicationFiles, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", fileName + "文件不能为空");
                        }
                    }
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
                    //判断是否有审批人
                    // 审批流
                    if (angular.isArray($scope.opinionOpts.options) === false
                        || $scope.opinionOpts.options.length === 0) {
                        modelStateDictionary.addModelError('审批流程', '审批人不能为空,请先保存单据！');
                    }
                    if ($scope.viewModel.isNonContractAdditional) {
                        if (angular.isArray($scope.opinionOpts.options) && $scope.opinionOpts.options.length > 0
                            && $scope.opinionOpts.options[0].users.length === 0) {
                            modelStateDictionary.addModelError('审批流程', '审批人不能为空,请先保存单据！');
                        }
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '本次采购范围和内容', attributeName: 'purchaseOfNoContract.purchaseContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '建设地点详细信息', attributeName: 'purchaseOfNoContract.buildDetailAddress', validator: new stringMaxLengthValidator(200, "不能大于200个字符!") },
                        { key: '付款方式描述', attributeName: 'purchaseOfNoContract.paymentWayDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '收费标准描述', attributeName: 'purchaseOfNoContract.chargeStandardDescribe', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '原因说明', attributeName: 'purchaseOfNoContract.reasonExplain', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '收费依据文件名称', attributeName: 'purchaseOfNoContract.chargeAccordingFileName', validator: new stringMaxLengthValidator(256, "不能大于256个字符!") },
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    if ($scope.viewModel.purchaseOfNoContract.cityInput) {
                        model.purchaseOfNoContract.fullPathId = $scope.viewModel.purchaseOfNoContract.cityInput.fullPathId;
                        model.purchaseOfNoContract.fullPathName = $scope.viewModel.purchaseOfNoContract.cityInput.fullPathName;
                    }
                    if (model.purchaseOfNoContract.buildingArea === null || model.purchaseOfNoContract.buildingArea === "") {
                        model.purchaseOfNoContract.buildingArea = 0;
                    }
                    if (model.purchaseOfNoContract.buildingCostTargetPerArea === null || model.purchaseOfNoContract.buildingCostTargetPerArea === "") {
                        model.purchaseOfNoContract.buildingCostTargetPerArea = 0;
                    }
                    //model.option = null;
                    return model;
                };
                $scope.$watch('viewModel.purchaseOfNoContract.project', $scope.baseInfo.projectChange);
                //$scope.$watch('viewModel.purchaseBase.purchaseAmount', $scope.baseInfo.projectChange);

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        PurchaseAmount: $scope.viewModel.purchaseBase.purchaseAmount,           //本次采购金额
                        ProjectCode: $scope.viewModel.purchaseOfNoContract.projectCode,         //项目编码
                        StageAreaCode: $scope.viewModel.purchaseOfNoContract.stageAreaCode,     //期区编码
                        CostCenterCode: $scope.viewModel.purchaseOfNoContract.costCenterCode,   //成本中心
                    };
                    if (!param.PurchaseAmount) { param.PurchaseAmount = 0; }
                    if (param.PurchaseAmount != 0 && param.ProjectCode != "" && param.CostCenterCode != "") {
                        $scope.baseInfo.isHasRefreshed = false;
                        wfOperate.refreshProcess('/PurchaseApplicationWf', $scope.currentActivityId, null, param, true);
                    }
                };
                $rootScope.$on("$processRefreshed", function (event, data) {
                    wfWaiting.show();
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                    $scope.baseInfo.isHasRefreshed = true;
                    wfWaiting.hide();
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
            }]);
    });
