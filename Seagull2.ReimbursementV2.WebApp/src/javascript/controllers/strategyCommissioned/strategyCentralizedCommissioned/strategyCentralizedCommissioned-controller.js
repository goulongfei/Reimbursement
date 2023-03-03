define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'supplierCategoryExtend',
        'supplierInfoExtendV4',
    ],
    function (app) {

        app.controller('strategyCentralizedCommissioned_controller', [
            '$scope', '$http', 'wfOperate', 'viewData', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', 'exception', 'wfWaiting',
            function ($scope, $http, wfOperate, viewData, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, exception, wfWaiting) {
                var init = {
                    //配置url
                    configUrl: {
                        PurchaseContractCategoryUrl: seagull2Url.getPlatformUrl('/Purchase/GetPurchaseContractCategory'),
                        ConstructCenterUrl: seagull2Url.getPlatformUrl('/Purchase/GetConstructCenter')
                    }
                };

                angular.extend($scope, viewData);
				// 配置顶部菜单按钮，隐藏打印、撤回
                viewData.wfOperateOpts.allowPrint = false;
                viewData.wfOperateOpts.allowDoWithdraw = false;
                $scope.mainTitle = '采购管理';
                $scope.isOpinionsShow = false;
                if($scope.opinions.length > 0){
                    angular.forEach($scope.opinions, function (v) {                           
                        if (v.processId !== "InputOpinion") {     
                            $scope.isOpinionsShow = true;
                        }
                    });
                }

                //页面权限加载--对接统一权限资源权限
                function CheckPermission() {
                    var command = {
                        permissionValue: "strategyPurchaseFontOaportal",
                        permissionName: "战略采购"
                    };
                    var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
                    wfWaiting.show();
                    $http.post(url, command)
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data.success) {
                                if (!data.data) {
                                    exception.throwException(500, { message: "您没有战略采购相关权限，请联系管理员!" });
                                }
                            } else {
                                exception.throwException(500, { message: data.message });
                            }
                        });
                }
                CheckPermission();

                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    //合约分类
                    getPurchaseContractCategorys: function () {
                        $http.get(init.configUrl.PurchaseContractCategoryUrl)
                            .success(function (data) {
                                $scope.PurchaseContractCategorys = data;
                            }).error(function (error) {
                                sogModal.openErrorDialog(error);
                            });
                    },
                    //招采组织
                    getConstructCenter: function () {
                        $http.get(init.configUrl.ConstructCenterUrl)
                            .success(function (data) {
                                $scope.ConstructCenter = data;
                            }).error(function (error) {
                                sogModal.openErrorDialog(error);
                            });
                    },
                    //选择合约分类
                    initPurchaseContractCategory: function () {
                        angular.forEach($scope.PurchaseContractCategorys, function (v) {
                            if (v.code == $scope.viewModel.p_StrategyPurchasePlanCase.contractAgreementTypeCode) {
                                $scope.viewModel.p_StrategyPurchasePlanCase.contractAgreementTypeName = v.cnName;
                            }
                        });
                    },
                    //选择招采组织
                    initConstructCenter: function () {
                        angular.forEach($scope.ConstructCenter, function (v) {
                            if (v.code == $scope.viewModel.p_StrategyPurchasePlanCase.constructCenterCode) {
                                $scope.viewModel.p_StrategyPurchasePlanCase.constructCenterName = v.cnName;
                            }
                        });
                    },
                    //招标人
                    companySelected: function () {
                        //每次重新选择招标人将之前选择的清空
                        $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = "";
                        $scope.viewModel.p_StrategyPurchasePlanCase.bidderName = "";
                        var viewpath = './htmlTemplate/dialogTemplate/common/corporationRadioSelector.html';
                        var projectDetailResult = sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                            '选择招标人', "corporationRadioSelector_controller", $scope, { containerStyle: { width: '60%' } });
                        projectDetailResult.then(function (resultData) {
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = resultData.code;
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderName = resultData.cnName;
                        });
                        
                    },
                    //刷新流程
                    bidderCodeChange: function (newValue, oldValue) {
                        if (newValue === oldValue) { return; }
                        if (newValue) {
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = newValue;
                            $scope.refreshProcess();
                        }
                    },
                    //选择供应商类别
                    supplierTypeSelected: function () {
                        //清空数据
                        $scope.viewModel.p_IndustryDomainScopes = [];
                        $scope.viewModel.industryDomainName = "";
                        var tempUrl = './htmlTemplate/dialogTemplate/common/supplierCategory.html';
                        var supplierTypeDialogUrl = '<div style="height:75%;" ng-include="\'' + tempUrl + '\'"></div>';
                        var promise = sogModal.openDialog(supplierTypeDialogUrl, "选择行业领域", "supplierCategory_controller", $scope);
                        promise.then(function (result) {
                            angular.forEach(result, function (v) {
                                var obj = {
                                    industryDomainCode: v.id,
                                    industryDomainName: v.title
                                };
                                $scope.viewModel.p_IndustryDomainScopes.push(obj);
                            });
                            $scope.baseInfo.supplierTypeInit();
                            $scope.supplierOpts.supplierCatagory = $scope.viewModel.p_IndustryDomainScopes;
                        });
                    },
                    supplierTypeInit: function () {
                        $scope.viewModel.industryDomainName = "";
                        angular.forEach($scope.viewModel.p_IndustryDomainScopes, function (v) {
                            $scope.viewModel.industryDomainName += v.industryDomainName + ';';
                        });
                    }
                };

                $scope.supplierOpts = {
                    'actionTypeCode': 1,
                    //供应商类别
                    'supplierCatagory': [],
                    ////小微供应商限定金额,-1表示不可以选择小微供应商
                    //'tinyAmount': -1,
                    'blackList': ['supplierCatagory'],
                    beforAppend: function (supplier, index) {
                        var item = $scope.viewModel.p_StrategyPurchaseAgreementInfos[index];
                        item.industryDomainName = "";
                        item.industryDomainCode = "";
                        item.supplierCode = "";
                        item.supplierName = "";
                    },
                    isDirectCommissioned: false,
                };

                // 监听画面  
                $scope.$watch('viewModel.p_StrategyPurchasePlanCase.bidderCode', $scope.baseInfo.bidderCodeChange);
                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        corporationCode: $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode,
                    };
                    wfOperate.refreshProcess('/StrategyCentralizedCommissionedWf', $scope.currentActivityId, null, param, true);
                };

                //战略协议信息
                $scope.strategyCentralizedCommissioned = {
                    //添加
                    addStrategyCentralizedCommissioned: function () {
                        var StrategyCentralizedCommissioned = {};
                        $scope.viewModel.p_StrategyPurchaseAgreementInfos.push(StrategyCentralizedCommissioned);
                    },
                    //选择
                    selectAll: function (check, arr) {
                        angular.forEach(arr, function (v) {
                            v.checked = check;
                        });
                    },
                    //选择一个
                    selectOne: function (item, arr) {
                        if (!item.checked) {
                            $scope.selectStrategyCentralizedCommissionedCheckedAll = false;
                        } else {
                            var index = 0;
                            angular.forEach(arr, function (v) {
                                if (v.checked) {
                                    index++;
                                }
                            });
                            if (arr.length == index) {
                                $scope.selectStrategyCentralizedCommissionedCheckedAll = true;
                            } else {
                                $scope.selectStrategyCentralizedCommissionedCheckedAll = false;
                            }
                        };
                    },
                   // 删除
                    deleteStrategyCentralizedCommissioned: function () {
                        if (!$scope.viewModel.p_StrategyPurchaseAgreementInfos || !$scope.viewModel.p_StrategyPurchaseAgreementInfos.length) {
                            sogModal.openAlertDialog("提示", "删除的战略协议信息不能为空");
                        }
                        var arr = [];
                        angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfos, function (v) {
                            if (!v.checked) {
                                arr.push(v);
                            } 
                        });
                        if (arr.length == $scope.viewModel.p_StrategyPurchaseAgreementInfos.length) {
                            sogModal.openAlertDialog("提示", "删除的战略协议信息不能为空");
                        }
                        $scope.viewModel.p_StrategyPurchaseAgreementInfos = arr;
                        if (!$scope.viewModel.p_StrategyPurchaseAgreementInfos.length) {
                            $scope.selectStrategyCentralizedCommissionedCheckedAll = false;
                        }
                    },
                    getIndustryDomain: function (item) {

                    }
                };

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");

                var checkData = function () {
                    sogValidator.clear();
                    var error = ValidateHelper.validateData($scope.viewModel, [
                        {
                            Key: '', attributeName: '', validator: new RequiredValidator('')
                        }]);
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.purchasePlanName) error.addModelError("采购名称", "采购名称不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.bidderName) error.addModelError("招标人", "招标人不能为空");
                    if (!$scope.viewModel.p_IndustryDomainScopes || !$scope.viewModel.p_IndustryDomainScopes.length) error.addModelError("采购类别", "采购类别不能为空");
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.contractAgreementTypeCode == "0") error.addModelError("合约分类", "合约分类不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.constructCenterCode) error.addModelError("招采组织", "招采组织不能为空");
                    if (!$scope.viewModel.constructCenterMainUser) error.addModelError("招采组织集采负责人", "招采组织集采负责人不能为空");
                    if (!$scope.viewModel.strategyPurchasePlanPersonList || !$scope.viewModel.strategyPurchasePlanPersonList.length) error.addModelError("采购小组成员", "采购小组成员不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.purchaseContentDescribe) error.addModelError("本次采购范围和内容", "本次采购范围和内容不能为空");
                    if (!$scope.viewModel.p_StrategyPurchasePlanCase.payWayDescribe) error.addModelError("付款方式描述", "付款方式描述不能为空");
                    if (!$scope.viewModel.p_StrategyPurchaseAgreementInfos || !$scope.viewModel.p_StrategyPurchaseAgreementInfos.length) error.addModelError("战略协议信息 ", "战略协议信息不能为空");
                    if ($scope.viewModel.p_StrategyPurchaseAgreementInfos.length) {
                        angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfos, function (v, i) {
                            var key = '第' + (i + 1) + '行战略协议信息 ';
                            if (!v.supplierName) {
                                error.addModelError("供应商名称	", key + "供应商名称不能为空");
                            }
                            if (!v.industryDomainName) {
                                error.addModelError("行业领域	", key + "行业领域不能为空");
                            }
                            if (!v.agreementName) {
                                error.addModelError("战采协议名称	", key + "战采协议名称不能为空");
                            }
                            if (!v.agreementFile || !v.agreementFile.length) {
                                error.addModelError("框架协议附件	", key + "框架协议附件不能为空");
                            } else {
                                var applicationReportFiles = false;   //附件不为空
                                for (var i = 0; i < v.agreementFile.length; i++) {
                                    if (!v.agreementFile[i].isDeleted) {
                                        applicationReportFiles = true;
                                        break;
                                    }
                                }
                                if (!applicationReportFiles) {
                                    error.addModelError("框架协议附件", key+"框架协议附件不能为空");
                                }
                            }
                            if (v.agreementCopies == 0 || !v.agreementCopies) {
                                error.addModelError("协议份数		", key + "协议份数不能为空");
                            }
                            if (!v.quoteDetailedFile || !v.quoteDetailedFile.length) {
                                error.addModelError("报价清单	", key+"报价清单不能为空");
                            } else {
                                var aquoteDetailedFiles = false;   //附件不为空
                                for (var i = 0; i < v.quoteDetailedFile.length; i++) {
                                    if (!v.quoteDetailedFile[i].isDeleted) {
                                        aquoteDetailedFiles = true;
                                        break;
                                    }
                                }
                                if (!aquoteDetailedFiles) {
                                    error.addModelError("报价清单", key+"报价清单附件不能为空");
                                }
                            }
                            if (!v.strategyDirectFile || !v.strategyDirectFile.length) {
                                error.addModelError("战采指导手册	", key+"战采指导手册不能为空");
                            } else {
                                var strategyDirectFiles = false;   //附件不为空
                                for (var i = 0; i < v.strategyDirectFile.length; i++) {
                                    if (!v.strategyDirectFile[i].isDeleted) {
                                        strategyDirectFiles = true;
                                        break;
                                    }
                                }
                                if (!strategyDirectFiles) {
                                    error.addModelError("战采指导手册", key +"战采指导手册附件不能为空");
                                }
                            }
                            if (v.startDate && v.endDate) {
                                if (v.startDate.getTime() > v.endDate.getTime()) {
                                    error.addModelError("协议时间", key + "协议开始时间不能大于协议结束时间");
                                }
                            }
                             if (!v.startDate) {
                                error.addModelError("协议开始时间", key + "协议开始时间不能为空");
                            }
                            if (!v.endDate) {
                                error.addModelError("协议结束时间", key + "协议结束时间不能为空");
                            }
                        });
                    }
                    if (!error.isValid()) {
                        sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                        sogValidator.broadcastResult(error.get());
                        return false;
                    }
                    return true;
                };
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
                    if (checkFileData()) {
                        if (e.operationType === sogWfControlOperationType.MoveTo) {
                            if (checkData(e)) {
                                defer.resolve($scope.viewModel);
                            }
                            else {
                                defer.reject($scope.viewModel);
                            }
                        }
                        return defer.resolve($scope.viewModel);
                    };
                }
            }]);
    });