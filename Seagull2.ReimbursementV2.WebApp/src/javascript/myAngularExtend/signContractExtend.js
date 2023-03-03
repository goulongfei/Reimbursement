define([
    'angular',
    'app'
], function (angular, app) {

    //签订合同
    app.directive("signContract", function () {
        return {
            restrict: 'AE',
            scope: {
                opts: "=",
                data: "=",
                sectionInfo: "=",
                readOnly: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/signContractInfo.html',
            replace: false,
            controller: function ($scope, sogModal, rcBaseOpts, sogOguType, wfWaiting, $http, seagull2Url, $window, errorDialog, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.opts = rcBaseOpts.get($scope.opts);
                //单选人员
                $scope.operatorSelect = {
                    selectMask: sogOguType.User,
                    multiple: false
                };
                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100000000000,
                    precision: 2
                };
                $scope.model = {
                    corporationScopeList: $scope.opts.corporationScopeList,
                    supplierScopeList: $scope.opts.awardSupplierList,
                };
                $scope.$watch('opts.awardSupplierList', function () {
                    if ($scope.readOnly === true || !$scope.opts.awardSupplierList) { return; }
                    $scope.model.awardSupplierList = $scope.opts.awardSupplierList;
                    if (angular.isArray($scope.model.awardSupplierList) === false) {
                        $scope.model.awardSupplierList = [];
                    }
                    angular.forEach($scope.data, function (item, index) {
                        var isExists = false;
                        if (angular.isArray($scope.model.awardSupplierList)) {
                            for (var i = 0; i < $scope.model.awardSupplierList.length; i++) {
                                if ($scope.model.awardSupplierList[i].code === item.supplierCode) {
                                    isExists = true;
                                }
                            }
                        }
                        if (isExists === false) {
                            item.supplierCode = null;
                            item.supplierName = null;
                        }
                    });
                });
                // 添加
                $scope.addDetail = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    if (angular.isArray($scope.data) === false) {
                        $scope.data = [];
                    }
                    $scope.data.push({
                        operatorUser: "",
                        sortNo: $scope.data.length
                    });
                };
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    if (angular.isArray($scope.data)) {
                        for (var i = $scope.data.length - 1; i >= 0; i--) {
                            if ($scope.data[i].checked) {
                                select = true;
                            }
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的拟签订合同信息")
                    } else {
                        var messsage = "确认是否删除拟签订合同信息?";
                        var promise = sogModal.openConfirmDialog("删除", messsage);
                        promise.then(function (v) {
                            if (angular.isArray($scope.data)) {
                                for (var i = $scope.data.length - 1; i >= 0; i--) {
                                    if ($scope.data[i].checked) {
                                        $scope.data.splice(i, 1);
                                    }
                                }
                            }
                            $scope.select_all = false;
                            if (typeof $scope.opts.beforDelete === 'function') { $scope.opts.beforDelete(v); }
                        })
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    if (angular.isArray($scope.data)) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            $scope.data[i].checked = allChecked;
                        }
                    }
                }
                //复选框选中
                $scope.selectOne = function (checked) {
                    if (angular.isArray($scope.data)) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            if (!$scope.data[i].checked) {
                                $scope.select_all = false;
                                return;
                            } else {
                                $scope.select_all = true;
                            }
                        }
                    }
                }
                // 供应商变更
                $scope.supplierChange = function (item) {
                    item.perSignContractAgreementScopeInfoList = [];
                    //询价(营销类)
                    if ($scope.opts.actionTypeCode === 28) {
                        var amount = 0;
                        item.isBottomPriceWin = false;
                        angular.forEach($scope.opts.supplierScopeList, function (supplier) {
                            if (item.supplierCode === supplier.supplierCode) {
                                item.supplierName = supplier.supplierName;
                                item.perSignContractAmount = supplier.finalQuoteAmount;
                            }
                            if (amount == 0 || supplier.finalQuoteAmount < amount)
                                amount = supplier.finalQuoteAmount;
                        });
                        if (item.perSignContractAmount == amount)
                            item.isBottomPriceWin = true;
                    }
                }
                // 查看所属合约
                $scope.showContractAgreement = function (index, per) {
                    $scope.editContractAgreement(index, per, true);
                }
                // 选择所属合约
                $scope.editContractAgreement = function (index, per, readOnly) {
                    $scope.editIndex = index;
                    if (!per.supplierCode && $scope.readOnly != true) {
                        var message = "请选择他方（供应商）！";
                        sogModal.openAlertDialog("提示", message);
                        return false;
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/multiPerSignContractAgreement.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择所属合约',
                            ["$scope", function ($modelScope) {
                                $modelScope.supplierAgreementList = [];
                                $modelScope.query = {
                                    stageAreaCode: null,
                                    projectCode: null,
                                    select_all: false,
                                    readOnly: readOnly ? true : false
                                };
                                if ($modelScope.query.readOnly === false && angular.isArray($scope.sectionInfo)) {
                                    // 标段信息
                                    for (var i = 0; i < $scope.sectionInfo.length; i++) {
                                        var section = $scope.sectionInfo[i];
                                        // 检查是否中标
                                        var isWinTheBidding = false;
                                        if (angular.isArray(section.supplierBiddingSectionList)) {
                                            for (var y = 0; y < section.supplierBiddingSectionList.length; y++) {
                                                var supplier = section.supplierBiddingSectionList[y];
                                                if (supplier.supplierCode === per.supplierCode) {
                                                    isWinTheBidding = supplier.isWinTheBidding;
                                                }
                                            }
                                        }
                                        if (isWinTheBidding === true
                                            && angular.isArray(section.biddingSectionContractAgreementScopeInfoList)) {
                                            // 从标段成本目标拆分中找合约
                                            for (var u = 0; u < section.biddingSectionContractAgreementScopeInfoList.length; u++) {
                                                var info = section.biddingSectionContractAgreementScopeInfoList[u];
                                                info.checked = false;
                                                var isExists = false;
                                                // 防止重复添加合约
                                                if (angular.isArray($modelScope.supplierAgreementList)) {
                                                    for (var o = 0; o < $modelScope.supplierAgreementList.length; o++) {
                                                        if ($modelScope.supplierAgreementList[o].contractAgreementCode === info.contractAgreementCode) {
                                                            isExists = true;
                                                        }
                                                    }
                                                }
                                                if (isExists === false) {
                                                    // 设置合约是否已选择
                                                    if (angular.isArray(per.perSignContractAgreementScopeInfoList)) {
                                                        for (var t = 0; t < per.perSignContractAgreementScopeInfoList.length; t++) {
                                                            var perSignContractAgreement = per.perSignContractAgreementScopeInfoList[t];
                                                            if (perSignContractAgreement.contractAgreementCode === info.contractAgreementCode) {
                                                                info.checked = true;
                                                            }
                                                        }
                                                    }
                                                    $modelScope.supplierAgreementList.push(info);
                                                }
                                            }
                                        }
                                    }
                                }
                                if ($modelScope.query.readOnly === false && !angular.isArray($scope.sectionInfo)) {
                                    for (var u = 0; u < $scope.opts.contractAgreementScopeList.length; u++) {
                                        var info = $scope.opts.contractAgreementScopeList[u];
                                        info.checked = false;
                                        var isExists = false;
                                        // 防止重复添加合约
                                        if (angular.isArray($modelScope.supplierAgreementList)) {
                                            for (var o = 0; o < $modelScope.supplierAgreementList.length; o++) {
                                                if ($modelScope.supplierAgreementList[o].contractAgreementCode === info.contractAgreementCode) {
                                                    isExists = true;
                                                }
                                            }
                                        }
                                        if (isExists === false) {
                                            // 设置合约是否已选择
                                            if (angular.isArray(per.perSignContractAgreementScopeInfoList)) {
                                                for (var t = 0; t < per.perSignContractAgreementScopeInfoList.length; t++) {
                                                    var perSignContractAgreement = per.perSignContractAgreementScopeInfoList[t];
                                                    if (perSignContractAgreement.contractAgreementCode === info.contractAgreementCode) {
                                                        info.checked = true;
                                                    }
                                                }
                                            }
                                            $modelScope.supplierAgreementList.push(info);
                                        }
                                    }
                                };
                                if ($modelScope.query.readOnly) {
                                    $modelScope.supplierAgreementList = per.perSignContractAgreementScopeInfoList;
                                }
                                // 填充期区选项
                                $modelScope.projectChange = function () {
                                    $modelScope.stageAreaCollection = [];
                                    $modelScope.query.stageAreaCode = null;
                                    $modelScope.query.select_all = false;
                                    if ($modelScope.query.projectCode === undefined || $modelScope.query.projectCode === "")
                                        return;
                                    angular.forEach($modelScope.supplierAgreementList, function (item) {
                                        var isExistStageArea = false;
                                        if ($modelScope.query.projectCode === item.projectCode) {
                                            var stageArea = {
                                                code: item.stageAreaCode,
                                                name: item.stageAreaName,
                                            };
                                            angular.forEach($modelScope.stageAreaCollection, function (s) {
                                                if (s.code === item.stageAreaCode) {
                                                    isExistStageArea = true;
                                                    return;
                                                }
                                            });
                                            if (!isExistStageArea) {
                                                $modelScope.stageAreaCollection.push(stageArea);
                                            }
                                        };
                                    });
                                }

                                $modelScope.projectCollection = [];

                                // 填充项目选项
                                angular.forEach($modelScope.supplierAgreementList, function (item) {
                                    var isExistProject = false;
                                    var project = {
                                        code: item.projectCode,
                                        name: item.projectName,
                                    };
                                    angular.forEach($modelScope.projectCollection, function (p) {
                                        if (p.code === item.projectCode) {
                                            isExistProject = true;
                                            return;
                                        }
                                    });
                                    if (!isExistProject) {
                                        $modelScope.projectCollection.push(project);
                                    }
                                });


                                //确定
                                $modelScope.selectedOk = function () {
                                    //var projectName = "";
                                    //var stageAreaName = "";
                                    var selectItemList = [];
                                    //$scope.isMultiStageArea = false;
                                    if (angular.isArray($modelScope.supplierAgreementList)) {
                                        if ($modelScope.supplierAgreementList.length > 1) {
                                            var flagCount = 0;
                                            var selectCount = 0;
                                            angular.forEach($modelScope.supplierAgreementList, function (item) {
                                                if ((item.contractAgreementTypeCode === "7" || item.contractAgreementTypeCode === 7) && item.checked) {
                                                    flagCount += 1;
                                                }
                                                if (item.checked) {
                                                    selectCount += 1;
                                                }
                                            });
                                            if (flagCount > 0 && flagCount < selectCount) {
                                                sogModal.openAlertDialog("提示", "一个合同不能同时关联营销合约与四项合约");
                                                return false;
                                            }
                                        }

                                        for (var i = 0; i < $modelScope.supplierAgreementList.length; i++) {
                                            var item = $modelScope.supplierAgreementList[i];
                                            if (!item.checked) { continue; }
                                            //if (!projectName) { projectName = item.projectName; }
                                            //if (!stageAreaName && item.stageAreaName !== "跨期") { stageAreaName = item.stageAreaName; }

                                            //if (projectName && projectName !== item.projectName) {
                                            //    $scope.isMultiStageArea = true;
                                            //}
                                            //if (stageAreaName && item.stageAreaName !== "跨期" && stageAreaName !== item.stageAreaName) {
                                            //    $scope.isMultiStageArea = true;
                                            //}
                                            selectItemList.push($modelScope.supplierAgreementList[i]);
                                        }
                                        //if ($scope.isMultiStageArea === true) {
                                        //    sogModal.openAlertDialog("提示", "只能选择同一个期区下的合约！");
                                        //    return;
                                        //}
                                    }
                                    $modelScope.confirm(selectItemList);
                                }

                                //全选
                                $modelScope.selectAll = function (allChecked) {
                                    for (var i = 0; i < $modelScope.supplierAgreementList.length; i++) {
                                        if ((!$modelScope.query.projectCode || $modelScope.supplierAgreementList[i].projectCode === $modelScope.query.projectCode)
                                            && (!$modelScope.query.stageAreaCode || $modelScope.supplierAgreementList[i].stageAreaCode === $modelScope.query.stageAreaCode)) {
                                            $modelScope.supplierAgreementList[i].checked = allChecked;
                                        }
                                    }
                                }
                                //复选框选中
                                $modelScope.selectOne = function (checked) {
                                    $modelScope.query.select_all = true;
                                    for (var i = 0; i < $modelScope.supplierAgreementList.length; i++) {
                                        if (!$modelScope.supplierAgreementList[i].checked
                                            && $modelScope.query.select_all === true) {
                                            $modelScope.query.select_all = false;
                                        }
                                    }
                                };

                            }],
                            $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定    
                                if ($scope.editIndex >= 0) {
                                    per.perSignContractAgreementScopeInfoList = v;
                                }
                            },
                            function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                //查看合同详情
                $scope.lookContarctInfo = function (obj) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var contractType = "";
                                var contractTypeCode = "";
                                var contractRouteType = "";
                                switch ($scope.opts.purchaseBase.purchaseBusinessTypeCode) {
                                    case 4:
                                        // 项目定义类合同
                                        contractTypeCode = 7;
                                        contractType = "projectDefinitionEntry";
                                        contractRouteType = "projectDefinitionContractView";
                                        break;
                                    case 5:
                                        // 项目实施合同
                                        contractTypeCode = 3;
                                        contractType = "projectContractEntry";
                                        contractRouteType = "projectContractView";

                                        break;
                                    case 6:
                                        // 工程采购合同
                                        contractTypeCode = 4;
                                        contractType = "projectmaterialcontractentry";
                                        contractRouteType = "projectmaterialcontractview";
                                        break;
                                    case 7:
                                        // 营销类合同
                                        contractTypeCode = 5;
                                        contractType = "marketingContractEntry";
                                        contractRouteType = "marketingContractView";
                                        break;
                                    default:
                                }
                                switch (obj.contractStateCode) {
                                    case 1:
                                        if (obj.contractProcessDraftURL) {
                                            url = $scope.common.webUrlBase + obj.contractProcessDraftURL;
                                        }
                                        else {
                                            url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractType + "/?resourceID=" + obj.contractResourceCode;
                                        }
                                        break;
                                    case 3:
                                        url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractRouteType + "?id=" + obj.contractResourceCode + '&contractTypeCode=' + contractTypeCode + '&systemVersionCode=2';
                                        break;
                                }
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看合同详情异常");
                            wfWaiting.hide();
                        });
                };
                //获取合同状态
                if ($scope.opts.scene == 'StartupContract' && $scope.readOnly === true) {
                    wfWaiting.show();
                    $scope.isSuccess = false;
                    if (angular.isArray($scope.data) == false) { return; }
                    var contractResourceCodelist = [];
                    for (var i = 0; i < $scope.data.length; i++) {
                        if ($scope.data[i].contractResourceCode) {
                            contractResourceCodelist.push($scope.data[i].contractResourceCode);
                        }
                    }
                    if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                        var param = {
                            resourceID: $scope.opts.purchaseBase.resourceID,
                            purchaseWayCode: $scope.opts.purchaseBase.purchaseWayCode,
                            contractResourceCodelist: contractResourceCodelist,
                        }
                        $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                            .success(function (data) {
                                $scope.isSuccess = (data.data && data.data.length > 0);
                                for (var i = 0; i < data.data.length; i++) {
                                    for (var y = 0; y < $scope.data.length; y++) {
                                        var item = $scope.data[y];
                                        if (item.contractResourceCode == data.data[i].contractResourceCode) {
                                            item.contractStateCode = data.data[i].contractStateCode;
                                            item.contractStateName = data.data[i].contractStateName;
                                        }
                                    }
                                }
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "获取合同状态异常");
                                $scope.isSuccess = false;
                                wfWaiting.hide();
                            });
                    }
                    else {
                        $scope.isSuccess = true;
                        wfWaiting.hide();
                    }
                };
                //重新发起合同
                $scope.reStartContract = function (item) {
                    wfWaiting.show();
                    var param = {
                        bussinessTypeCode: $scope.opts.purchaseBase.purchaseBusinessTypeCode,
                        purchaseWayCode: $scope.opts.purchaseBase.purchaseWayCode,
                        resourceId: item.resourceID,
                        code: item.code,
                        operatorUserCode: item.operatorUser.id,
                        operatorUserName: item.operatorUser.displayName
                    }

                    $http({
                        method: 'POST',
                        url: seagull2Url.getPlatformUrl('/PurchaseContract/ReStartContract'),
                        data: param
                    }).error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "重新发起合同异常");
                        wfWaiting.hide();
                    })
                        .success(function (data) {
                            wfWaiting.hide();
                            item.contractStateCode = 1;
                            item.contractStateName = "未生效"
                            $scope.isSuccess = true;
                            var promise = sogModal.openAlertDialog("提示", "重新发起合同成功");
                            promise.then(function (result) {
                                location.reload();
                            }, function (rejectData) {
                                location.reload();
                            });
                        });

                };
            },
        };
    });
})