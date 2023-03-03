define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("rcBaseOpts", function () {
        function base() {
            this.projectCode = "";
            this.projectName = "";
            this.stageAreaCode = "";
            this.stageAreaName = "";
            this.beforAppend = function (v) { };
            this.refreshOpts = function (opts) { };//该方法接收当前的配置对象，可在这里从新修改该配置对象；
        }
        return {
            get: function (opts) {
                if (!angular.isObject(opts)) {
                    opts = {};
                }
                return angular.extend(new base(), opts);
            }
        }
    });
    //该文件指令全部所需Api服务
    app.factory("rcBaseApi", function (sogModal) {
        return {
            //选择合约规划控件
            rcSelectContractPlan: {
                GetContractPlanType: "/Purchase/GetContractAgreementEditType",//合约规划类型
                QueryPlanContractInfomation: "/Tender/QueryContractInfomation",//合约规划查询 
                QueryBusinessPlanContract: "/V3/DomainExclusiveJoint/BusinessContractAgreementForPruchase/QueryBusinessContractAgreementForSelect",//查询商写合约
            },
        };
    });
    //错误提示框
    app.factory("errorDialog", function (sogModal) {
        return {
            //请求出现错误调用的提示框
            openErrorDialog: function (data, status, msg) {
                sogModal.openErrorDialog({
                    message: msg,
                    exceptionMessage: status,
                    stackTrace: data || msg
                });
            }
        };
    });

    //合约规划
    app.directive("contractAgreementSplitInfo", function () {
        return {
            restrict: 'AE',
            scope: {
                opts: "=",
                data: "=",
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/contractAgreementSplitInfo.html',
            replace: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, rcBaseOpts, rcBaseApi, errorDialog) {
                $scope.opts = rcBaseOpts.get($scope.opts);
                // 添加
                $scope.addDetail = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    if (!$scope.opts.multipleSelect) {
                        $scope.opts.multipleSelect = false;
                    }
                    if ($scope.opts.multipleSelect == true) {
                        if (!angular.isArray($scope.opts.projectList) || $scope.opts.projectList.length === 0) {
                            var message = "请先选择项目！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                        if (!angular.isArray($scope.opts.stageAreaList) || $scope.opts.stageAreaList.length === 0) {
                            var message = "请先选择期区！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    else {
                        if (!$scope.opts.projectCode) {
                            var message = "请先选择项目！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                        if (!$scope.opts.stageAreaName || $scope.opts.stageAreaName == "") {
                            var message = "请先选择期区！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    if ($scope.opts.businessType === "工程采购类") {
                        if ($scope.opts.isShowExpenditureType === false || $scope.opts.isShowExpenditureType === undefined) {
                            sogModal.openAlertDialog("提示", "请选择合约分类！");
                            return false;
                        }
                    }
                    if ($scope.opts.expenditureTypeCode === null) {
                        sogModal.openAlertDialog("提示", "请选择支出类型！");
                        return false;
                    }
                    if ($scope.opts.expenditureTypeCode === 2) {
                        if (!$scope.opts.useProjectCode || $scope.opts.useStageAreaCode == null) {
                            sogModal.openAlertDialog("提示", "请选择使用项目和使用期区！");
                            return false;
                        }
                    }
                    if ($scope.opts.expenditureTypeCode === 3) {
                        if (!$scope.opts.useCostCenterCode) {
                            sogModal.openAlertDialog("提示", "请选择使用记账公司和使用成本中心！");
                            return false;
                        }
                    }
                    if ($scope.opts.applicationName != undefined) {
                        if (((!$scope.opts.applicationName) || $scope.opts.applicationName == "无合同采购") && $scope.opts.contractAgreement.length > 0) {
                            var message = "无合同采购只能添加一条合约规划！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/contractAgreement.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择合约规划', ["$scope", function ($modelScope) {
                            $modelScope.stageAreaList = [];
                            $modelScope.model = {
                                contractPlanTypeCode: "-1",
                                planContractName: "",
                                contractPlanTypeList: [{ code: "-1", name: "全部" }],
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 10,
                                    totalItems: 0
                                },
                                queryCondition: {
                                    projectCode: $scope.opts.projectCode, //项目code
                                    projectName: $scope.opts.projectName,
                                    stageAreaCode: $scope.opts.stageAreaCode,//期区
                                    stageAreaName: $scope.opts.stageAreaName,
                                    contractPlanTypeCode: "", //合约类型
                                    planContractName: "", //合约规划名称
                                    pageSize: 10,
                                    pageIndex: 1,
                                    useProjectCode: $scope.opts.useProjectCode,
                                    useStageAreaCode: $scope.opts.useStageAreaCode,
                                    useChargeCompanyCode: $scope.opts.useChargeCompanyCode,
                                    useCostCenterCode: $scope.opts.useCostCenterCode,
                                    expenditureTypeCode: $scope.opts.expenditureTypeCode
                                },
                                selectedItem: null,
                                contractPlanList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                },
                                query: function () {
                                    this.queryCondition.contractPlanTypeCode = this.contractPlanTypeCode;
                                    this.queryCondition.planContractName = this.planContractName;
                                    this.queryCondition.occupyObjectTypeCode = $scope.opts.occupyObjectTypeCode;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.loadData(1);
                                },
                                loadData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = this;
                                    this.queryCondition.pageIndex = pageIndex;
                                    var baseUrl = seagull2Url.getPlatformUrlBase() + rcBaseApi.rcSelectContractPlan.QueryPlanContractInfomation;
                                    var url = baseUrl.replace("ReimbursementV2", "ContractV2");
                                    $http.post(url, this.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.contractPlanList = [];
                                            if (angular.isArray($scope.data)) {
                                                for (var i = 0; i < $scope.data.length; i++) {
                                                    if ($scope.data[i].validStatus === false && $scope.data[i].stageAreaCode === that.queryCondition.stageAreaCode) {
                                                        if (that.queryCondition.planContractName && $scope.data[i].contractAgreementName.indexOf(that.queryCondition.planContractName)) {
                                                            that.contractPlanList.push($scope.data[i]);
                                                            continue;
                                                        }
                                                        that.contractPlanList.push($scope.data[i]);
                                                    }
                                                }
                                            }
                                            if (angular.isArray(data.planContractInfomationData)) {
                                                angular.forEach(data.planContractInfomationData, function (item, index) {
                                                    if (item.contractPlanTypeCode === "7") {
                                                        item.contractPlanTypeCnName = "营销合约"
                                                    }
                                                });
                                                that.contractPlanList = that.contractPlanList.concat(data.planContractInfomationData);
                                            }
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询合约规划数据异常");
                                            wfWaiting.hide();
                                        });
                                },
                                confirm: function () {
                                    if (this.valideStatus()) {
                                        this.selectedItem.projectCode = $modelScope.model.queryCondition.projectCode;
                                        if (angular.isArray($modelScope.projectList) && $modelScope.projectList.length > 0) {
                                            for (var i = 0; i < $modelScope.projectList.length; i++) {
                                                if ($modelScope.projectList[i].code === $modelScope.model.queryCondition.projectCode) {
                                                    this.selectedItem.projectName = $modelScope.projectList[i].name;
                                                }
                                            }
                                        }
                                        else {
                                            this.selectedItem.projectName = $modelScope.model.queryCondition.projectName;
                                        }
                                        this.selectedItem.stageAreaCode = $modelScope.model.queryCondition.stageAreaCode;
                                        if (angular.isArray($modelScope.stageAreaList) && $modelScope.stageAreaList.length > 0) {
                                            for (var i = 0; i < $modelScope.stageAreaList.length; i++) {
                                                if ($modelScope.stageAreaList[i].code === $modelScope.model.queryCondition.stageAreaCode) {
                                                    this.selectedItem.stageAreaName = $modelScope.stageAreaList[i].name;
                                                }
                                            }
                                        }
                                        else {
                                            this.selectedItem.stageAreaName = $modelScope.model.queryCondition.stageAreaName;
                                        }
                                        $modelScope.confirm(this.selectedItem);
                                    }
                                },
                                //校验
                                valideStatus: function () {
                                    //自定义校验
                                    var ModelRequiredValidator = (function () {
                                        return function (message) {
                                            this.validateData = function (value, name, validationContext) {
                                                if (!value) {
                                                    ValidateHelper.updateValidationContext(validationContext, name, message);
                                                    return false;
                                                }
                                                return true;
                                            };
                                        };
                                    }());
                                    //校验字段列表
                                    var validatorFieldList = [{ key: '合约规划列表', attributeName: 'selectedItem', validator: new ModelRequiredValidator('请选择合约规划！') }];
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, validatorFieldList);
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                },
                                // 是否存在删除合约
                                hasInvalidStatus: function () {
                                    if (angular.isArray($scope.data)) {
                                        for (var i = 0; i < $scope.data.length; i++) {
                                            if (!$scope.data[i].validStatus) { return true; }
                                        }
                                    }
                                },
                                // 是否显示删除合约
                                isShowInvalidStatus: function (item) {
                                    if (angular.isArray($modelScope.model.contractPlanList)) {
                                        for (var i = 0; i < $modelScope.model.contractPlanList.length; i++) {
                                            if (item.contractAgreementCode === $modelScope.model.contractPlanList[i].planContractCode) { return false; }
                                        }
                                    }
                                    return true;
                                },
                            };
                            $modelScope.projectChange = function (projectCode) {
                                var isChangeStageArea = false;
                                $modelScope.stageAreaList = [];
                                angular.forEach($scope.opts.stageAreaList, function (item, index) {
                                    if (projectCode === item.projectCode) {
                                        if (isChangeStageArea === false) {
                                            $modelScope.model.queryCondition.stageAreaCode = item.stageAreaCode;
                                            $modelScope.model.queryCondition.stageAreaName = item.stageAreaName;
                                            isChangeStageArea = true;
                                        }
                                        $modelScope.stageAreaList.push({ code: item.stageAreaCode, name: item.stageAreaName });
                                    }
                                });
                            };
                            if ($scope.opts.multipleSelect == true) {
                                if (angular.isArray($scope.opts.projectList) && $scope.opts.projectList.length > 0) {
                                    $modelScope.model.queryCondition.projectCode = $scope.opts.projectList[0].projectCode;
                                    $modelScope.model.queryCondition.projectName = $scope.opts.projectList[0].projectName;
                                    $modelScope.projectList = [];
                                    angular.forEach($scope.opts.projectList, function (item, index) {
                                        $modelScope.projectList.push({ code: item.projectCode, name: item.projectName });
                                    });
                                }
                                if (angular.isArray($scope.opts.stageAreaList) && $scope.opts.stageAreaList.length > 0) {
                                    $modelScope.model.queryCondition.stageAreaCode = $scope.opts.stageAreaList[0].stageAreaCode;
                                    $modelScope.model.queryCondition.stageAreaName = $scope.opts.stageAreaList[0].stageAreaName;
                                    $modelScope.projectChange($modelScope.model.queryCondition.projectCode);
                                }
                            }
                            else if ($scope.opts.multipleSelect == false) {
                                if ($scope.opts.stageAreaName !== '跨期') {
                                    $modelScope.stageAreaList.push({ code: '', name: '跨期' });
                                }
                                $modelScope.stageAreaList.push({ code: $scope.opts.stageAreaCode, name: $scope.opts.stageAreaName });
                            }
                            $modelScope.stageAreaChange = function () {
                                angular.forEach($modelScope.stageAreaList, function (v) {
                                    if ($modelScope.model.queryCondition.stageAreaCode === v.code) {
                                        $modelScope.model.queryCondition.stageAreaName = v.name;
                                        $modelScope.model.contractPlanList = [];
                                    }
                                });
                            };
                            function getContractPlanType() {
                                wfWaiting.show();
                                var that = $modelScope.model;
                                $http.get(seagull2Url.getPlatformUrl(rcBaseApi.rcSelectContractPlan.GetContractPlanType), { cache: false })
                                    .success(function (data) {
                                        if (angular.isArray(data)) {
                                            data.unshift({ code: "0", name: "全部" });
                                            that.contractPlanTypeList = data;
                                            that.contractPlanTypeCode = data[0].code;
                                            that.queryCondition.contractPlanTypeCode = data[0].code;
                                        }
                                        wfWaiting.hide();
                                    })
                                    .error(function (data, status) {
                                        var msg = "查询合约类型数据异常";
                                        var ex = {
                                            message: msg,
                                            exceptionMessage: status,
                                            stackTrace: data || msg + ",请稍后重试!"
                                        };
                                        sogModal.openErrorNotice(ex);
                                        wfWaiting.hide();
                                    });
                            }

                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                            getContractPlanType();
                        }], $scope, { containerStyle: { width: '70%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的合约规划")
                    } else {
                        var messsage = "确认是否删除合约规划?";
                        if ($scope.opts.actionTypeCode === 4) {
                            // 直接委托(项目定义服务类)
                            messsage = "确认是否删除合约规划?确认删除需要重新添加委托信息中的所属合约。";
                        }
                        if ($scope.opts.actionTypeCode === 20) {
                            // 无合同采购
                            messsage = "确认是否删除合约规划?确认删除需要重新填写成本归属中的信息。";
                        }
                        var promise = sogModal.openConfirmDialog("删除", messsage);
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                var item = $scope.data[i];
                                if (item.checked) {
                                    if ($scope.opts.isAward) {
                                        item.checked = false;
                                        item.validStatus = false;
                                        item.planContractCode = item.contractAgreementCode;
                                        item.planContractName = item.contractAgreementName;
                                        item.contractPlanTypeCode = item.contractAgreementTypeCode;
                                        item.contractPlanTypeCnName = item.contractAgreementTypeName;
                                    }
                                    else {
                                        $scope.data.splice(i, 1);
                                    }
                                }
                            }
                            $scope.select_all = false;
                            $scope.opts.beforDelete(v);
                        })
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].checked = allChecked;
                    }
                }
                //复选框选中
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        if (!$scope.data[i].checked) {
                            $scope.select_all = false;
                            return;
                        } else {
                            $scope.select_all = true;
                        }
                    }
                }
            },
        };
    });

    //商写合约规划
    app.directive("contractAgreementBusiness", function () {
        return {
            restrict: 'AE',
            scope: {
                opts: "=",
                data: "=",
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/contractAgreementBusiness.html',
            replace: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, rcBaseOpts, rcBaseApi, errorDialog) {
                $scope.opts = rcBaseOpts.get($scope.opts);
                // 添加
                $scope.addDetail = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    if (!$scope.opts.multipleSelect) {
                        $scope.opts.multipleSelect = false;
                    }
                    if ($scope.opts.multipleSelect == true) {
                        if (!angular.isArray($scope.opts.projectList) || $scope.opts.projectList.length === 0) {
                            var message = "请先选择项目！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    else {
                        if (!$scope.opts.projectCode) {
                            var message = "请先选择项目！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    if (!$scope.opts.specialtyCode) {
                        sogModal.openAlertDialog("提示", "请先选择专业！");
                        return false;
                    }
                    if ($scope.opts.applicationName != undefined) {
                        if (((!$scope.opts.applicationName) || $scope.opts.applicationName == "无合同采购") && $scope.opts.contractAgreement.length > 0) {
                            var message = "无合同采购只能添加一条合约规划！";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/contractAgreementBusinessTemp.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择合约规划', ["$scope", function ($modelScope) {
                            var myDate = new Date();
                            var currentYear = myDate.getFullYear();
                            $modelScope.model = {
                                yearCode: currentYear,
                                planContractName: "",
                                isNonContractbusinessOperationsAdditional: $scope.opts.isNonContractbusinessOperationsAdditional,
                                yearList: [{ code: currentYear, name: currentYear + "年" }, { code: currentYear + 1, name: currentYear + 1 + "年" }],
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 10,
                                    totalItems: 0
                                },
                                queryCondition: {
                                    projectCode: "", //项目code
                                    editSpecialtyCode: $scope.opts.specialtyCode,//专业
                                    specialtyName: $scope.opts.specialtyName,
                                    isNoContractPruchase: $scope.opts.isNoContractPruchase,
                                    year: null,
                                    isCanSelectHistoryAdd: false,
                                    contractAgreementName: "",
                                    pageSize: 10,
                                    pageIndex: 1,
                                },
                                selectedItem: null,
                                contractPlanList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                },
                                query: function () {
                                    this.queryCondition.year = this.yearCode;
                                    if (this.queryCondition.isCanSelectHistoryAdd) {
                                        delete this.queryCondition.year;
                                    }
                                    this.queryCondition.contractAgreementName = this.planContractName;

                                    if (!this.queryCondition.projectCode) {
                                        sogModal.openAlertDialog("提示", "请选择项目！");
                                        return false;
                                    }
                                    if (!$scope.opts.isNonContractbusinessOperationsAdditional) {
                                        if (!this.queryCondition.year) {
                                            sogModal.openAlertDialog("提示", "请选择编制年份！");
                                            return false;
                                        }
                                    }
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.loadData(1);
                                },
                                getBelongsYear: function (contractPlan) {
                                    if (contractPlan.courseYearList != undefined && contractPlan.courseYearList.length > 0) {
                                        var startYear = currentYear;
                                        var endYear = currentYear;
                                        if ($modelScope.model.yearCode != null) {
                                            startYear = $modelScope.model.yearCode;
                                            endYear = $modelScope.model.yearCode;
                                        }
                                        angular.forEach(contractPlan.courseYearList, function (item) {
                                            if (item.year < startYear) {
                                                startYear = item.year;
                                            }
                                            if (item.year > endYear) {
                                                endYear = item.year;
                                            }
                                        });
                                        if (!$scope.opts.isNoContractPruchase) {
                                            startYear = $modelScope.model.yearCode;
                                        }
                                        if (startYear == endYear) {
                                            contractPlan.belongsYear = endYear;
                                        } else {
                                            contractPlan.belongsYear = startYear + "-" + endYear;
                                        }
                                    }
                                },
                                getStringInfo: function (contractPlan) {
                                    var fixString = "";
                                    if (contractPlan.courseYearList != undefined && contractPlan.courseYearList.length > 0) {
                                        angular.forEach(contractPlan.courseYearList, function (item) {
                                            var isNeedShow = true;
                                            if (!$scope.opts.isNoContractPruchase && item.year < $modelScope.model.yearCode)
                                                isNeedShow = false;
                                            if (fixString.indexOf(item.costCourseName) == -1 && isNeedShow)
                                                fixString += item.costCourseName + ";";
                                        });
                                        if (fixString)
                                            fixString = fixString.substring(0, fixString.length - 1);
                                    }
                                    contractPlan.costCourseName = fixString;
                                },
                                getCostTargetAmount: function (contractPlan) {
                                    if (contractPlan.courseYearList != undefined && contractPlan.courseYearList.length > 0 && !$scope.opts.isNoContractPruchase) {
                                        angular.forEach(contractPlan.courseYearList, function (item) {
                                            if (item.year < $modelScope.model.yearCode) {
                                                contractPlan.costTargetAmountWithTax -= item.costTargetAmountWithTax;
                                            }
                                        });
                                    }
                                },
                                loadData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = this;
                                    this.queryCondition.pageIndex = pageIndex;
                                    var baseUrl = seagull2Url.getPlatformUrlBase() + rcBaseApi.rcSelectContractPlan.QueryBusinessPlanContract;
                                    var url = baseUrl.replace("ReimbursementV2", "ContractV2");
                                    $http.post(url, this.queryCondition)
                                        .success(function (data) {
                                            wfWaiting.hide();
                                            if (data != null && data.isSucceed) {
                                                that.contractPlanList = [];
                                                that.paginationConf.totalItems = data.totalItemsCount;
                                                if (angular.isArray($scope.data)) {
                                                    for (var i = 0; i < $scope.data.length; i++) {
                                                        if ($scope.data[i].validStatus === false) {
                                                            if (that.queryCondition.contractAgreementName && $scope.data[i].contractAgreementName.indexOf(that.queryCondition.contractAgreementName)) {
                                                                that.contractPlanList.push($scope.data[i]);
                                                                continue;
                                                            }
                                                            that.contractPlanList.push($scope.data[i]);
                                                        }
                                                    }
                                                }
                                                that.contractPlanList = that.contractPlanList.concat(data.contractAgreementList);
                                            } else {
                                                if (data != null && !data.isSucceed)
                                                    sogModal.openAlertDialog("查询合约规划数据异常", data.errorList[0]);
                                            }
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询合约规划数据异常");
                                            wfWaiting.hide();
                                        });
                                },
                                confirm: function () {
                                    if (this.valideStatus()) {
                                        // 合约数据格式化
                                        var contractAgreementSelected = {
                                            projectCode: this.selectedItem.projectCode,
                                            projectName: this.selectedItem.projectName,
                                            specialtyCode: this.selectedItem.editSpecialtyCode,
                                            specialtyName: this.selectedItem.editSpecialtyName,
                                            startYearMonth: this.selectedItem.startYearMonth,
                                            endYearMonth: this.selectedItem.endYearMonth,
                                            useYear: this.queryCondition.year,
                                            belongsYear: this.selectedItem.belongsYear,
                                            contractAgreementCode: this.selectedItem.code,
                                            contractAgreementName: this.selectedItem.contractAgreementName,
                                            costTargetAmount: this.selectedItem.costTargetAmountWithTax,
                                            costCourseName: this.selectedItem.costCourseName,
                                            contractAgreementSplitInfoList: [],
                                            validStatus: true,
                                            isHistoryAdd: this.selectedItem.isHistoryAdd,
                                        };
                                        if (contractAgreementSelected.useYear == undefined && $scope.opts.isNonContractbusinessOperationsAdditional) {
                                            if (contractAgreementSelected.isHistoryAdd) {
                                                contractAgreementSelected.useYear = 1;
                                            } else {
                                                contractAgreementSelected.useYear = currentYear;
                                            }
                                        }
                                        // 合约成本科目明细
                                        if (angular.isArray(this.selectedItem.courseYearList)) {
                                            angular.forEach(this.selectedItem.courseYearList, function (item) {
                                                var contractAgreementSplitInfo = {
                                                    projectCode: contractAgreementSelected.projectCode,
                                                    projectName: contractAgreementSelected.projectName,
                                                    specialtyCode: contractAgreementSelected.specialtyCode,
                                                    specialtyName: contractAgreementSelected.specialtyName,
                                                    year: item.year,
                                                    isCanApportion: null,
                                                    contractAgreementCode: contractAgreementSelected.contractAgreementCode,
                                                    contractAgreementName: contractAgreementSelected.contractAgreementName,
                                                    costCourseCode: item.costCourseCode,
                                                    costCourseName: item.costCourseName,
                                                    costCourseFullName: item.costCourseName,
                                                    costCourseLevelCode: item.costCourseLevelCode,
                                                    costTargetAmount: item.costTargetAmountWithTax,
                                                    accumulativeHappenedAmountWithTax: item.accumulativeHappenedAmountWithTax,
                                                    forecastHappenAmountWithTax: item.forecastHappenAmountWithTax,
                                                    surplusValueWithTax: item.surplusValueWithTax,
                                                    validStatus: true,
                                                };
                                                contractAgreementSelected.contractAgreementSplitInfoList.push(contractAgreementSplitInfo);
                                            });
                                        }
                                        $modelScope.confirm(contractAgreementSelected);
                                    }
                                },
                                //校验
                                valideStatus: function () {
                                    //自定义校验
                                    var ModelRequiredValidator = (function () {
                                        return function (message) {
                                            this.validateData = function (value, name, validationContext) {
                                                if (!value) {
                                                    ValidateHelper.updateValidationContext(validationContext, name, message);
                                                    return false;
                                                }
                                                return true;
                                            };
                                        };
                                    }());
                                    //校验字段列表
                                    var validatorFieldList = [{ key: '合约规划列表', attributeName: 'selectedItem', validator: new ModelRequiredValidator('请选择合约规划！') }];
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, validatorFieldList);
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                },
                                // 是否存在删除合约
                                hasInvalidStatus: function () {
                                    if (angular.isArray($scope.data)) {
                                        for (var i = 0; i < $scope.data.length; i++) {
                                            if (!$scope.data[i].validStatus) { return true; }
                                        }
                                    }
                                },
                                // 是否显示删除合约
                                isShowInvalidStatus: function (item) {
                                    if (angular.isArray($modelScope.model.contractPlanList)) {
                                        for (var i = 0; i < $modelScope.model.contractPlanList.length; i++) {
                                            if (item.contractAgreementCode === $modelScope.model.contractPlanList[i].planContractCode) { return false; }
                                        }
                                    }
                                    return true;
                                },
                            };
                            if ($scope.opts.isNonContractbusinessOperationsAdditional) {
                                $modelScope.model.yearList = [];
                                $modelScope.model.yearList = [{ code: currentYear, name: currentYear + "年" }];
                            }
                            $modelScope.yearchecked = function () {
                                if ($scope.opts.isNonContractbusinessOperationsAdditional) {
                                    if ($modelScope.model.yearCode == null) {
                                        $modelScope.model.queryCondition.isCanSelectHistoryAdd = true;
                                    } else
                                        $modelScope.model.queryCondition.isCanSelectHistoryAdd = false;
                                }
                            };
                            $modelScope.projectChange = function (projectCode) {
                                if (angular.isArray($modelScope.projectList) && $modelScope.projectList.length > 0) {
                                    angular.forEach($modelScope.projectList, function (item, index) {
                                        if (item.projectCode == projectCode)
                                            $modelScope.model.queryCondition.projectName = $scope.opts.projectName;
                                    });
                                }
                            };

                            if ($scope.opts.multipleSelect == true) {
                                if (angular.isArray($scope.opts.projectList) && $scope.opts.projectList.length > 0) {
                                    $modelScope.projectList = [];
                                    angular.forEach($scope.opts.projectList, function (item, index) {
                                        $modelScope.projectList.push({ code: item.projectCode, name: item.projectName });
                                    });
                                }
                            } else {
                                $modelScope.model.queryCondition.projectCode = $scope.opts.projectCode;
                                $modelScope.model.queryCondition.projectName = $scope.opts.projectName;
                            }

                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '70%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的合约规划")
                    } else {
                        var messsage = "确认是否删除合约规划?";
                        if ($scope.opts.actionTypeCode === 32) {
                            // 直接委托
                            messsage = "确认是否删除合约规划?确认删除需要重新添加委托信息中的所属合约。";
                        }
                        if ($scope.opts.actionTypeCode === 34) {
                            // 无合同采购
                            messsage = "确认是否删除合约规划?确认删除需要重新填写成本归属中的信息。";
                        }
                        var promise = sogModal.openConfirmDialog("删除", messsage);
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                var item = $scope.data[i];
                                if (item.checked) {
                                    if ($scope.opts.isAward) {
                                        item.checked = false;
                                        item.validStatus = false;
                                        item.planContractCode = item.contractAgreementCode;
                                        item.planContractName = item.contractAgreementName;
                                    }
                                    else {
                                        $scope.data.splice(i, 1);
                                    }
                                }
                            }
                            $scope.select_all = false;
                            $scope.opts.beforDelete(v);
                        })
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].checked = allChecked;
                    }
                }
                //复选框选中
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        if (!$scope.data[i].checked) {
                            $scope.select_all = false;
                            return;
                        } else {
                            $scope.select_all = true;
                        }
                    }
                }
            },
        };
    });
})