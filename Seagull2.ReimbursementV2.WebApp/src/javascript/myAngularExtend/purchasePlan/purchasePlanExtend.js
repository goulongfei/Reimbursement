//采购计划
define([
    'app',
    'tiger-balm',
    'commonUtilExtend',
    'contractAgreementSelector',
    'supplierCategoryExtend',
    'purchasePlanFileInfoExtend'
], function (app) {
    app.directive("fixedHeader", function ($window) {
        return {
            controller: function () {
                var t_r_content = $(".idt_r_content");
                t_r_content.css("height", ($window.innerHeight - 250) + "px");
                t_r_content.scroll(function () {
                    var left = -t_r_content.scrollLeft();
                    var t_r_t = $(".t_r_title table");
                    t_r_t.css("left", left + "px");
                });
            }
        };
    });
    $purchasePlanExtend.$inject = ['$http', '$window', 'wfWaiting', 'sogModal', 'seagull2Url', 'sogOguType', 'configure', 'linq', 'contractAgreementSelector'];
    function $purchasePlanExtend($http, $window, wfWaiting, sogModal, seagull2Url, sogOguType, configure, linq, contractAgreementSelector) {
        var add = "htmlTemplate/controlTemplate/purchasePlan/purchasePlan.html";
        var template = "<div><div ng-include=\"\'" + add + "\'\"/></div>";
        return {
            restrict: 'A',
            scope: {
                viewModel: '=',
                readOnly: '=',
                pageOpts: '='
            },
            template: template,
            replace: true,
            controller: function ($scope, $element, $attrs) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //基本信息
                $scope.baseInfo = {
                    //生成编码
                    guid: function () {
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    },
                    //获取日期
                    getNewData: function (dateTemp, day) {
                        dateTemp = dateTemp.split("-");
                        var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式    
                        var millSeconds = Math.abs(nDate) + (day * 24 * 60 * 60 * 1000);
                        var rDate = new Date(millSeconds);
                        var year = rDate.getFullYear();
                        var month = rDate.getMonth() + 1;
                        if (month < 10) month = "0" + month;
                        var date = rDate.getDate();
                        if (date < 10) date = "0" + date;
                        return (year + "-" + month + "-" + date);
                    },
                    //计算日期差
                    getDateDiff: function (startTime, endTime, diffType) {
                        //将计算间隔类性字符转换为小写
                        diffType = diffType.toLowerCase();
                        var sTime = new Date(startTime); //开始时间
                        var eTime = new Date(endTime); //结束时间
                        //作为除数的数字
                        var timeType = 1;
                        switch (diffType) {
                            case "second":
                                timeType = 1000;
                                break;
                            case "minute":
                                timeType = 1000 * 60;
                                break;
                            case "hour":
                                timeType = 1000 * 3600;
                                break;
                            case "day":
                                timeType = 1000 * 3600 * 24;
                                break;
                            default:
                                break;
                        }
                        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
                    },
                    //采购计划绑定集合
                    data: [],
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //数字控件
                    digitalOpts: {
                        min: 0,
                        max: 999999999,
                        precision: 0
                    },
                    //查询条件
                    codation: {
                        purchaseWaySelectAll: false,
                        contractAgreementTypeSelectAll: false,
                        purchaseStateSelectAll: false,
                        purchaseName: '',
                        purchaseWayCodes: [],
                        contractAgreementTypeCodes: [],
                        purchaseStateCodes: []
                    },
                    //选择查询条件
                    selectCodation: {
                        //采购方式全选
                        selectPurchaseWayAll: function () {
                            angular.forEach($scope.viewModel.purchaseWays, function (item) {
                                item.checked = $scope.baseInfo.codation.purchaseWaySelectAll;
                            });
                        },
                        //选择采购方式
                        selectPurchaseWay: function () {
                            for (var i = 0; i < $scope.viewModel.purchaseWays.length; i++) {
                                if (!$scope.viewModel.purchaseWays[i].checked) {
                                    $scope.baseInfo.codation.purchaseWaySelectAll = false;
                                    return;
                                } else {
                                    $scope.baseInfo.codation.purchaseWaySelectAll = true;
                                }
                            }
                        },
                        //合约分类全选
                        selectContractAgreementTypeAll: function () {
                            angular.forEach($scope.viewModel.contractAgreementTypes, function (item) {
                                item.checked = $scope.baseInfo.codation.contractAgreementTypeSelectAll;
                            });
                        },
                        //选择合约分类
                        selectContractAgreementType: function () {
                            for (var i = 0; i < $scope.viewModel.contractAgreementTypes.length; i++) {
                                if (!$scope.viewModel.contractAgreementTypes[i].checked) {
                                    $scope.baseInfo.codation.contractAgreementTypeSelectAll = false;
                                    return;
                                } else {
                                    $scope.baseInfo.codation.contractAgreementTypeSelectAll = true;
                                }
                            }
                        },
                        //采购状态全选
                        selectPurchaseStateAll: function () {
                            angular.forEach($scope.viewModel.purchaseStates, function (item) {
                                item.checked = $scope.baseInfo.codation.purchaseStateSelectAll;
                            });
                        },
                        //选择采购状态
                        selectPurchaseState: function () {
                            for (var i = 0; i < $scope.viewModel.purchaseStates.length; i++) {
                                if (!$scope.viewModel.purchaseStates[i].checked) {
                                    $scope.baseInfo.codation.purchaseStateSelectAll = false;
                                    return;
                                } else {
                                    $scope.baseInfo.codation.purchaseStateSelectAll = true;
                                }
                            }
                        },
                        //重置查询条件
                        resetCodation: function () {
                            $scope.baseInfo.codation.purchaseWaySelectAll = false;
                            $scope.baseInfo.selectCodation.selectPurchaseWayAll();
                            $scope.baseInfo.codation.contractAgreementTypeSelectAll = false;
                            $scope.baseInfo.selectCodation.selectContractAgreementTypeAll();
                            $scope.baseInfo.codation.purchaseStateSelectAll = false;
                            $scope.baseInfo.selectCodation.selectPurchaseStateAll();
                            $scope.baseInfo.codation.purchaseName = '';
                        },
                        //查询
                        search: function () {
                            $scope.baseInfo.selectCommodityPaging.currentPage = 1;
                            $scope.purchasePlan.purchasePlanAll = false;
                            $scope.baseInfo.searchPurchasePlanDetails(true);
                        },
                        //是否全屏
                        fullscreen: function () {
                            if ($scope.viewModel.isFullscreen == false || $scope.viewModel.isFullscreen == undefined) {
                                $scope.viewModel.isFullscreen = true;
                            } else {
                                $scope.viewModel.isFullscreen = false;
                            }
                        }
                    },
                    //分页
                    selectCommodityPaging: $scope.pageOpts,
                    //滚动条回位,并设置idt_r_content高度
                    divScroll: function () {
                        var t_r_content = $(".idt_r_content");
                        t_r_content.animate({ scrollTop: 0 }, 1);
                        t_r_content.animate({ scrollLeft: 0 }, 1);
                        var t_r_t = $(".idt_r_t table");
                        t_r_t.css("left", "0px");
                        if ($window.innerHeight - 250 - (($scope.baseInfo.data.length + 1) * 35) - 20 > 0) {
                            t_r_content.css("height", (($scope.baseInfo.data.length + 1) * 35 + 20) + "px");
                        } else {
                            t_r_content.css("height", ($window.innerHeight - 250) + "px");
                        }
                    },
                    //查询采购计划明细
                    searchPurchasePlanDetails: function (isSelect) {
                        wfWaiting.show();
                        var purchasePlanDetails = [];
                        $scope.baseInfo.data = [];
                        //构造查询条件
                        angular.forEach($scope.viewModel.purchaseWays, function (item) {
                            if (item.checked) {
                                $scope.baseInfo.codation.purchaseWayCodes.push(item.code);
                            }
                        });
                        angular.forEach($scope.viewModel.contractAgreementTypes, function (item) {
                            if (item.checked) {
                                $scope.baseInfo.codation.contractAgreementTypeCodes.push(item.code);
                            }
                        });
                        angular.forEach($scope.viewModel.purchaseStates, function (item) {
                            if (item.checked) {
                                $scope.baseInfo.codation.purchaseStateCodes.push(item.code);
                            }
                        });
                        angular.forEach($scope.viewModel.purchasePlanCaseDetailInfos, function (purchasePlan) {
                            if (isSelect) {
                                purchasePlan.checked = false;
                            }
                            //根据条件查询
                            var isAdopt = true;
                            if ($scope.baseInfo.codation.purchaseWaySelectAll === false && $scope.baseInfo.codation.purchaseWayCodes.length > 0) {
                                if ($scope.baseInfo.codation.purchaseWayCodes.indexOf(purchasePlan.purchaseWayCode) === -1) {
                                    isAdopt = false;
                                }
                            }
                            if (isAdopt === true && $scope.baseInfo.codation.contractAgreementTypeSelectAll === false && $scope.baseInfo.codation.contractAgreementTypeCodes.length > 0) {
                                if ($scope.baseInfo.codation.contractAgreementTypeCodes.indexOf(purchasePlan.contractAgreementTypeCode) === -1) {
                                    isAdopt = false;
                                }
                            }
                            if (isAdopt === true && $scope.baseInfo.codation.purchaseStateSelectAll === false && $scope.baseInfo.codation.purchaseStateCodes.length > 0) {
                                if ($scope.baseInfo.codation.purchaseStateCodes.indexOf(purchasePlan.purchaseStateCode) === -1) {
                                    isAdopt = false;
                                }
                            }
                            if (isAdopt === true && $scope.baseInfo.codation.purchaseName !== '') {
                                if (purchasePlan.purchaseName.indexOf($scope.baseInfo.codation.purchaseName) === -1) {
                                    isAdopt = false;
                                }
                            }
                            //所有条件验证通过添加至集合
                            if (isAdopt === true) {
                                purchasePlanDetails.push(purchasePlan);
                            }
                        });
                        $scope.baseInfo.codation.purchaseWayCodes = [];
                        $scope.baseInfo.codation.contractAgreementTypeCodes = [];
                        $scope.baseInfo.codation.purchaseStateCodes = [];
                        $scope.baseInfo.selectCommodityPaging.totalItems = purchasePlanDetails.length;
                        var startIndex = ($scope.baseInfo.selectCommodityPaging.currentPage - 1) * $scope.baseInfo.selectCommodityPaging.itemsPerPage;
                        var endIndex = ($scope.baseInfo.selectCommodityPaging.currentPage * $scope.baseInfo.selectCommodityPaging.itemsPerPage) - 1;
                        angular.forEach(purchasePlanDetails, function (purchasePlan, index) {
                            if (index >= startIndex && index <= endIndex) {
                                purchasePlan.edit = false;
                                $scope.baseInfo.data.push(purchasePlan);
                            }
                        });
                        $scope.baseInfo.divScroll();
                        wfWaiting.hide();
                    }
                };
                $scope.baseInfo.searchPurchasePlanDetails(true);
                //监听ViewModel页数的变化更新ViewModel的数据
                $scope.$watch('baseInfo.selectCommodityPaging.currentPage', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    $scope.baseInfo.searchPurchasePlanDetails(false);
                });

                //采购计划相关操作
                $scope.purchasePlan = {
                    purchasePlanAll: false,
                    editPurchasePlan: function (item) {
                        angular.forEach($scope.baseInfo.data, function (purchasePlan) {
                            purchasePlan.edit = false;
                        });
                        item.edit = true;
                    },
                    //计算日期
                    dateOfCalculation: function (item) {
                        var prePeriodCode = "";
                        switch (item.purchaseWayCode) {
                            case 1:
                                prePeriodCode = "Tender";
                                break;
                            case 7:
                                prePeriodCode = "NonContractPurchase";
                                break;
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                                if (item.prePurchaseAmount > 2000000) {
                                    prePeriodCode = "CommissionAmount";
                                } else {
                                    prePeriodCode = "Commission";
                                }
                                break;
                        }
                        if (prePeriodCode !== "") {
                            var prePeriod = linq.from($scope.viewModel.prePeriods).where(
                                function (where) {
                                    return where.code === prePeriodCode;
                                }).toArray()[0];
                            if (prePeriod) {
                                item.prePeriod = prePeriod.day;
                            }
                        }
                        if (item.preEnterSupplyDate !== null && item.preEnterSupplyDate !== "null" && item.preEnterSupplyDate !== "" && item.preEnterSupplyDate !== undefined && item.preEnterSupplyDate !== "undefined" && item.preEnterSupplyDate !== "1901-01-01T00:00:00+08:00" && item.preEnterSupplyDate !== "0001-01-01T00:00:00") {
                            var date = new Date(item.preEnterSupplyDate);
                            date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                            //合同签订日期=进场日期—15天
                            var newDate = $scope.baseInfo.getNewData(date, -15);
                            item.preContractSignDate = new Date(newDate);
                            $("#" + item.code + " #preContractSignDate input").val(newDate);
                            //计划采购完成日期=进场日期-20天
                            newDate = $scope.baseInfo.getNewData(date, -20);
                            item.preEndDate = new Date(newDate);
                            $("#" + item.code + " #preEndDate input").val(newDate);
                            date = new Date(item.preEndDate);
                            date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                            //计划采购开始日期=计划采购完成日期-周期
                            newDate = $scope.baseInfo.getNewData(date, -item.prePeriod);
                            item.preStartDate = new Date(newDate);
                            $("#" + item.code + " #preStartDate input").val(newDate);
                            date = new Date(item.preStartDate);
                            date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                            //供应商入库开始日期=采购开始时间-9天
                            newDate = $scope.baseInfo.getNewData(date, -9);
                            item.preSupplierPutInDate = new Date(newDate);
                            $("#" + item.code + " #preSupplierPutInDate input").val(newDate);
                        }
                    },
                    //选择采购方式
                    selectPurchaseWay: function (item) {
                        angular.forEach($scope.viewModel.purchaseWays, function (v) {
                            if (v.code === item.purchaseWayCode) {
                                item.purchaseWayName = v.name;
                                //自动计算日期
                                $scope.purchasePlan.dateOfCalculation(item);
                            }
                        });
                        if (item.purchaseWayCode == null) {
                            item.purchaseWayCode = 0;
                            item.purchaseWayName = "请选择";
                        }
                    },
                    //选择合约分类
                    selectContractAgreementType: function (item) {
                        angular.forEach($scope.viewModel.contractAgreementTypes, function (v) {
                            if (v.code === item.contractAgreementTypeCode) {
                                item.contractAgreementTypeName = v.name;
                            }
                        });
                        if (item.contractAgreementTypeCode == null) {
                            item.contractAgreementTypeCode = 0;
                            item.contractAgreementTypeName = "请选择";
                        }
                    },
                    //选择合约规划
                    selectContractAgreement: function (item) {
                        var contractAgreementCodeList = [];
                        var contractAgreementCollection = linq.from($scope.viewModel.contractAgreementScopes).where(
                            function (where) {
                                return where.aggregationToCode === item.code;
                            }).toArray();
                        if (contractAgreementCollection && contractAgreementCollection.length > 0) {
                            angular.forEach(contractAgreementCollection, function (contractAgreement) {
                                contractAgreementCodeList.push(contractAgreement.contractAgreementCode);
                            });
                        }
                        var params = {
                            projectCode: $scope.viewModel.purchasePlanCase.projectCode,
                            projectName: $scope.viewModel.purchasePlanCase.projectName,
                            stageAreaCode: $scope.viewModel.purchasePlanCase.stageAreaCode,
                            stageAreaName: $scope.viewModel.purchasePlanCase.stageAreaName,
                            contractAgreementCodeList: contractAgreementCodeList
                        };
                        var contractAgreementSelectorResult = contractAgreementSelector.open(params);
                        if (contractAgreementSelectorResult) {
                            contractAgreementSelectorResult.then(function (contractAgreementList) {
                                if (angular.isArray(contractAgreementList) && contractAgreementList.length > 0) {
                                    var purchasePlanContractAgreementList = [];
                                    var nameStr = "";
                                    var message = "";
                                    var enterSupplyDate = null;
                                    var costBelongName = "";
                                    var contractAgreementCategoryNameStr = "";
                                    angular.forEach(contractAgreementList, function (contractAgreement) {
                                        var contractAgreementCollection = linq.from($scope.viewModel.contractAgreementScopes).where(
                                            function (where) {
                                                return where.aggregationToCode !== item.code && where.contractAgreementCode === contractAgreement.planContractCode;
                                            }).toArray();
                                        if (contractAgreementCollection.length > 0) {
                                            var purchasePlan = linq.from($scope.viewModel.purchasePlanCaseDetailInfos).where(
                                                function (where) {
                                                    return where.code === contractAgreementCollection[0].aggregationToCode;
                                                }).toArray()[0];
                                            message = message + "合约【" + contractAgreement.planContractName + "】已被【" + purchasePlan.purchaseName + "】采购计划占用，已自动过滤！";
                                        } else {
                                            //拼接合约名称
                                            nameStr = nameStr + contractAgreement.planContractName + ";";
                                            contractAgreementCategoryNameStr = contractAgreementCategoryNameStr + contractAgreement.contractAgreementCategoryName + ";";
                                            //获取最小合约进场时间
                                            if (contractAgreement.enterSupplyDate !== null && contractAgreement.enterSupplyDate !== "null" && enterSupplyDate !== null &&
                                                enterSupplyDate !== "null" && new Date(contractAgreement.enterSupplyDate) < new Date(enterSupplyDate)) {
                                                enterSupplyDate = contractAgreement.enterSupplyDate;
                                            }
                                            if (angular.isArray(contractAgreement.costCourseInfoController) && contractAgreement.costCourseInfoController.length > 0) {
                                                angular.forEach(contractAgreement.costCourseInfoController, function (costCourse) {
                                                    var costName = "";
                                                    switch (costCourse.costCourseLevelCode.substring(0, 2)) {
                                                        case "KF2":
                                                            costName = "前期费用";
                                                            break;
                                                        case "KF3":
                                                            costName = "建筑安装工程费用";
                                                            break;
                                                        case "KF4":
                                                            costName = "基础设施费用";
                                                            break;
                                                        case "KF5":
                                                            costName = "配套设施";
                                                            break;
                                                    }
                                                    if (costBelongName.indexOf(costName) === -1) {
                                                        costBelongName = costBelongName + costName + ";";

                                                    }
                                                });
                                            }
                                            var code = $scope.baseInfo.guid();
                                            purchasePlanContractAgreementList.push({
                                                code: code,
                                                resourceID: $scope.viewModel.purchasePlanCase.resourceID,
                                                className: 2,
                                                validStatus: true,
                                                projectCode: $scope.viewModel.purchasePlanCase.projectCode,
                                                projectName: $scope.viewModel.purchasePlanCase.projectName,
                                                stageAreaCode: $scope.viewModel.purchasePlanCase.stageAreaCode,
                                                stageAreaName: $scope.viewModel.purchasePlanCase.stageAreaName,
                                                contractAgreementCode: contractAgreement.planContractCode,
                                                contractAgreementName: contractAgreement.planContractName,
                                                contractAgreementTypeCode: contractAgreement.contractPlanTypeCode,
                                                contractAgreementTypeName: contractAgreement.contractPlanTypeCnName,
                                                contractAgreementCategoryCode: "",
                                                contractAgreementCategoryName: "",
                                                costTargetAmount: contractAgreement.costTarget,
                                                sortNo: purchasePlanContractAgreementList.length + 1,
                                                resultCode: code,
                                                aggregationToCode: item.code,
                                                industryDomainCode: contractAgreement.industryDomainCode,
                                                industryDomainName: contractAgreement.industryDomainName
                                            });
                                        }
                                    });
                                    item.contractAgreementNameStr = nameStr.length > 0 ? nameStr.substring(0, nameStr.length - 1) : "";
                                    item.purchaseName = $scope.viewModel.purchasePlanCase.projectName + $scope.viewModel.purchasePlanCase.stageAreaName + item.contractAgreementNameStr;
                                    if (item.purchaseName.length > 30) {
                                        item.purchaseName = item.purchaseName.substring(0, 29);
                                    }
                                    item.costBelongName = costBelongName.length > 0 ? costBelongName.substring(0, costBelongName.length - 1) : "";
                                    item.contractAgreementCategoryNameStr = contractAgreementCategoryNameStr.length > 0 ? contractAgreementCategoryNameStr.substring(0, contractAgreementCategoryNameStr.length - 1) : "";
                                    var date = new Date();
                                    if (enterSupplyDate !== null && enterSupplyDate !== "null" && enterSupplyDate !== "undefined" && enterSupplyDate !== undefined && enterSupplyDate !== "1901-01-01T00:00:00+08:00" && enterSupplyDate !== "0001-01-01T00:00:00") {
                                        date = new Date(enterSupplyDate);
                                    } else {
                                        if (item.preEnterSupplyDate !== null && item.preEnterSupplyDate !== "null" && item.preEnterSupplyDate !== "undefined" && item.preEnterSupplyDate !== undefined && item.preEnterSupplyDate !== "1901-01-01T00:00:00+08:00" && item.preEnterSupplyDate !== "0001-01-01T00:00:00") {
                                            date = item.preEnterSupplyDate;
                                        }
                                    }
                                    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                                    item.preEnterSupplyDate = new Date(date);
                                    $("#" + item.code).find("#preEnterSupplyDate input").val(date);
                                    if (purchasePlanContractAgreementList.length > 0) {
                                        if (purchasePlanContractAgreementList[0].purchaseWayCode && purchasePlanContractAgreementList[0].purchaseWayName) {
                                            item.purchaseWayCode = purchasePlanContractAgreementList[0].purchaseWayCode;
                                            item.purchaseWayName = purchasePlanContractAgreementList[0].purchaseWayName;
                                        }
                                        if (purchasePlanContractAgreementList[0].purchaseMainUserCode && purchasePlanContractAgreementList[0].purchaseMainUserName) {
                                            item.purchaseMainUser = { id: purchasePlanContractAgreementList[0].purchaseMainUserCode, displayName: purchasePlanContractAgreementList[0].purchaseMainUserName };
                                            item.purchaseMainUserCode = purchasePlanContractAgreementList[0].purchaseMainUserCode;
                                            item.purchaseMainUserName = purchasePlanContractAgreementList[0].purchaseMainUserName;
                                        }
                                        //添加行业领域
                                        item.industryDomainCode = purchasePlanContractAgreementList[0].industryDomainCode;
                                        item.industryDomainName = purchasePlanContractAgreementList[0].industryDomainName;
                                    }
                                    item.prePurchaseAmount = linq.from(purchasePlanContractAgreementList).sum(
                                        function (where) {
                                            return where.costTargetAmount * 1;
                                        });
                                    for (var i = $scope.viewModel.contractAgreementScopes.length - 1; i >= 0; i--) {
                                        if ($scope.viewModel.contractAgreementScopes[i].aggregationToCode === item.code) {
                                            $scope.viewModel.contractAgreementScopes.splice(i, 1);
                                        }
                                    }
                                    angular.forEach(purchasePlanContractAgreementList, function (contractAgreement) {
                                        $scope.viewModel.contractAgreementScopes.push(contractAgreement);
                                    });
                                    var planList = linq.from($scope.viewModel.purchasePlanCaseDetailInfos).where(
                                        function (where) {
                                            return where.purchaseStateCode === 1;
                                        }).toArray();
                                    $scope.viewModel.purchasePlanCase.preTotalAmount = linq.from(planList).sum(
                                        function (where) {
                                            return where.prePurchaseAmount * 1;
                                        });
                                    if (message.length > 0) {
                                        sogModal.openAlertDialog("提示", message);
                                    }
                                    if (item.purchaseWayCode) {
                                        //自动计算日期
                                        $scope.purchasePlan.dateOfCalculation(item);
                                    }
                                }
                            });
                        }
                    },
                    //采购计划全选
                    purchaseSelectedAll: function () {
                        angular.forEach($scope.viewModel.purchasePlanCaseDetailInfos, function (item) {
                            if (item.purchaseStateCode === 1 || item.purchaseStateCode === "1") {
                                item.checked = $scope.purchasePlan.purchasePlanAll;
                            }
                        });
                    },
                    //选中采购计划
                    purchaseSelected: function (item) {
                        for (var i = 0; i < $scope.viewModel.purchasePlanCaseDetailInfos.length; i++) {
                            if ($scope.viewModel.purchasePlanCaseDetailInfos[i].purchaseStateCode === 1 || $scope.viewModel.purchasePlanCaseDetailInfos[i].purchaseStateCode === "1") {
                                if (!$scope.viewModel.purchasePlanCaseDetailInfos[i].checked) {
                                    $scope.purchasePlan.purchasePlanAll = false;
                                    return;
                                } else {
                                    $scope.purchasePlan.purchasePlanAll = true;
                                }
                            }
                        }
                    },
                    //添加采购计划
                    addPurchasePlan: function () {
                        $scope.purchasePlan.purchasePlanAll = false;
                        var code = $scope.baseInfo.guid();
                        var plan = {
                            code: code,
                            className: 1,
                            actualEndDate: "0001-01-01T00:00:00",
                            actualPurchaseAmount: 0,
                            biddingSectionCount: 0,
                            contractAgreementCategoryNameStr: "",
                            contractAgreementNameStr: "",
                            contractAgreementTypeCode: 0,
                            contractAgreementTypeName: "",
                            costBelongName: "",
                            flagCode: $scope.viewModel.purchasePlanCase.resultCode,
                            pFlagCode: $scope.viewModel.purchasePlanCase.code,
                            preContractSignData: "0001-01-01T00:00:00",
                            preDrawingcompleteDate: "0001-01-01T00:00:00",
                            preEndDate: "0001-01-01T00:00:00",
                            preEnterSupplyDate: "0001-01-01T00:00:00",
                            prePeriod: 0,
                            prePurchaseAmount: 0,
                            preStartDate: "0001-01-01T00:00:00",
                            preSupplierPutInDate: "0001-01-01T00:00:00",
                            purchaseCode: "",
                            purchaseMainUser: null,
                            purchaseMainUserCode: "",
                            purchaseMainUserName: "",
                            purchaseName: "",
                            purchaseStateCode: 1,
                            purchaseStateName: "未发起",
                            purchaseWayCode: 0,
                            purchaseWayName: "",
                            remark: "",
                            resourceID: $scope.viewModel.purchasePlanCase.resourceID,
                            resultCode: code,
                            sortNo: 1,
                            validStatus: true,
                            checked: false,
                            industryDomainCode: "",
                            industryDomainName: "",
                            p_MaterialFeedbackInfoListPEMu: []
                        };
                        $scope.purchasePlan.sortNo(0, 1);
                        //将新对象添加至集合最前面
                        $scope.viewModel.purchasePlanCaseDetailInfos.unshift(plan);
                        $scope.baseInfo.selectCommodityPaging.currentPage = 1;
                        $scope.baseInfo.searchPurchasePlanDetails(true);
                        $scope.viewModel.purchasePlanCase.purchasePlanDetailCount = $scope.viewModel.purchasePlanCaseDetailInfos.length;
                    },
                    //删除采购计划
                    delPurchasePlan: function () {
                        var select = false;
                        for (var i = $scope.viewModel.purchasePlanCaseDetailInfos.length - 1; i >= 0; i--) {
                            if ($scope.viewModel.purchasePlanCaseDetailInfos[i].checked) {
                                select = true;
                            }
                        }
                        if (!select) {
                            sogModal.openAlertDialog("提示", "请先选中需要删除的采购计划信息");
                        } else {
                            var promise = sogModal.openConfirmDialog("删除", "确认是否删除采购计划信息?");
                            promise.then(function (v) {
                                for (var i = $scope.viewModel.purchasePlanCaseDetailInfos.length - 1; i >= 0; i--) {
                                    if ($scope.viewModel.purchasePlanCaseDetailInfos[i].checked) {
                                        var item = $scope.viewModel.purchasePlanCaseDetailInfos[i];
                                        $scope.viewModel.purchasePlanCaseDetailInfos.splice(i, 1);
                                        //删除对应的合约
                                        for (var j = $scope.viewModel.contractAgreementScopes.length - 1; j >= 0; j--) {
                                            if ($scope.viewModel.contractAgreementScopes[j].aggregationToCode === item.code) {
                                                $scope.viewModel.contractAgreementScopes.splice(j, 1);
                                            }
                                        }
                                        $scope.purchasePlan.sortNo(item.sortNo, -1);
                                    }
                                }
                                $scope.purchasePlan.purchasePlanAll = false;
                                $scope.baseInfo.selectCommodityPaging.currentPage = 1;
                                $scope.baseInfo.searchPurchasePlanDetails(true);
                                $scope.viewModel.purchasePlanCase.purchasePlanDetailCount = $scope.viewModel.purchasePlanCaseDetailInfos.length;
                            });
                        }
                    },
                    //排序
                    sortNo: function (sortNo, i) {
                        angular.forEach($scope.viewModel.purchasePlanCaseDetailInfos, function (v) {
                            if (sortNo < v.sortNo) {
                                v.sortNo = v.sortNo + i;
                            }
                        });
                    },
                    //获取合同列表
                    getContractList: function (purchasePlanDetailCode) {
                        var contractList = [];
                        contractList = linq.from($scope.viewModel.contractScopes).where(
                            function (where) {
                                return where.aggregationToCode === purchasePlanDetailCode;
                            }).toArray();
                        return contractList;
                    },
                    //查看合同
                    searchContract: function (contract) {
                        wfWaiting.show();
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
                                    switch (contract.contractTypeCode) {
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
                                    }
                                    switch (contract.contractStateCode) {
                                        case 1:
                                            $http.get(seagull2Url.getPlatformUrl("/PurchasePlan/GetContract?contractResourceID=" + contract.contractResourceID + "&contractType=" + contractType + "&r=" + new Date().getTime()))
                                                .success(function (data) {
                                                    if (data.state) {
                                                        url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractType + "/?resourceID=" + contract.contractResourceID + "&activityID=" + data.activityID;
                                                        if (url.indexOf("?") === -1) {
                                                            url = url + "?_at=" + urlat;
                                                        } else {
                                                            url = url + "&_at=" + urlat;
                                                        }
                                                        $window.open(url, '_blank');
                                                    } else {
                                                        sogModal.openAlertDialog('提示', data.message);
                                                        wfWaiting.hide();
                                                    }
                                                }).error(function (data, status) {
                                                    sogModal.openAlertDialog('提示', "查看合同详情异常");
                                                    wfWaiting.hide();
                                                });
                                            break;
                                        case 3:
                                            url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractRouteType + "?id=" + contract.contractResourceID + '&contractTypeCode=' + contractTypeCode + '&systemVersionCode=2';
                                            if (url.indexOf("?") === -1) {
                                                url = url + "?_at=" + urlat;
                                            } else {
                                                url = url + "&_at=" + urlat;
                                            }
                                            $window.open(url, '_blank');
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                wfWaiting.hide();
                            }).error(function (data, status) {
                                sogModal.openAlertDialog('提示', "查看合同详情异常");
                                wfWaiting.hide();
                            });
                    },
                    //查看采购
                    searchPurchase: function (purchaseCode) {
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl("/PurchasePlan/GetPurchase?purchaseCode=" + purchaseCode + "&r=" + new Date().getTime()))
                            .success(function (purchaseData) {
                                if (purchaseData.state) {
                                    var urlat = null;
                                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                                        .success(function (data) {
                                            urlat = data;
                                            if (urlat !== null) {
                                                urlat = urlat.replace(/"/g, "");
                                                var url = $scope.common.webUrlBase + purchaseData.url;
                                                if (url.indexOf("?") === -1) {
                                                    url = url + "?_at=" + urlat;
                                                } else {
                                                    url = url + "&_at=" + urlat;
                                                }
                                                $window.open(url, '_blank');
                                            }
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            sogModal.openAlertDialog('提示', "查看采购详情异常");
                                            wfWaiting.hide();
                                        });
                                } else {
                                    sogModal.openAlertDialog('提示', purchaseData.message);
                                    wfWaiting.hide();
                                }
                            }).error(function (data, status) {
                                sogModal.openAlertDialog('提示', "查看采购详情异常");
                                wfWaiting.hide();
                            });
                    },
                    //导出采购明细
                    exportPurchasePlanDetail: function () {
                        wfWaiting.show();
                        var date = new Date();
                        var str = "";
                        str += date.getFullYear();//年
                        str += (date.getMonth() + 1);//月 月比实际月份要少1
                        str += date.getDate();//日
                        str += date.getHours();//HH
                        str += date.getMinutes();//MM
                        str += date.getSeconds(); //SS
                        var param = {
                            time: str,
                            purchasePlanDetails: $scope.viewModel.purchasePlanCaseDetailInfos
                        };
                        $http.post(seagull2Url.getPlatformUrl('/PurchasePlan/ExportPurchasePlanDetailForExcel'), param, { responseType: 'arraybuffer', cache: false })
                            .success(function (data) {
                                var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                                var objectUrl = URL.createObjectURL(blob);
                                var fileName = "采购计划明细" + param.time + ".xlsx";
                                if (objectUrl !== null && objectUrl.length < 44) {
                                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                                } else {
                                    var aForExcel = $("<a download='" + fileName + "' target='_blank'><span id='downFile'></span></a>").attr("href", objectUrl);
                                    $("body").append(aForExcel);
                                    $("#downFile").click();
                                    aForExcel.remove();
                                }
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                sogModal.openAlertDialog('提示', "导出采购明细异常");
                                $scope.isSuccess = false;
                                wfWaiting.hide();
                            });
                    },
                    ////选择行业领域
                    tradeCatagoryOpts: {
                        beforAppend: function (tradeitem) {
                            if (tradeitem.item != null) {
                                tradeitem.item.industryDomainCode = tradeitem.result[0].code;
                                tradeitem.item.industryDomainName = tradeitem.result[0].name;
                            }
                        }
                    },
                    specialty: $scope.viewModel.option.specialtyList,
                    isCompleted: $scope.viewModel.formAction.actionStateCode == 2 ? true : false
                };
                //监听采购计划集合日期
                $scope.$watch('viewModel.purchasePlanCaseDetailInfos', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    angular.forEach($scope.viewModel.purchasePlanCaseDetailInfos, function (item) {
                        if (item.purchaseStateCode === 1) {
                            if (item.preEndDate !== null && item.preEndDate !== "null" && item.preEndDate !== "" && item.preEndDate !== undefined && item.preEndDate !== "undefined" && item.preEndDate !== "1901-01-01T00:00:00+08:00" && item.preEndDate !== "0001-01-01T00:00:00" &&
                                item.preStartDate !== null && item.preStartDate !== "null" && item.preStartDate !== "" && item.preStartDate !== undefined && item.preStartDate !== "undefined" && item.preStartDate !== "1901-01-01T00:00:00+08:00" && item.preStartDate !== "0001-01-01T00:00:00") {
                                var sTime = new Date(item.preStartDate);
                                var eTime = new Date(item.preEndDate);
                                item.prePeriod = $scope.baseInfo.getDateDiff(sTime, eTime, 'day');
                            }
                        }
                    });
                }, true);
            }
        };
    }
    app.directive('purchasePlanExtend', $purchasePlanExtend);
});
