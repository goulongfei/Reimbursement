define(['app'], function (app) {
    //该文件指令全部所需Api服务
    app.factory("rcBaseApi", function (sogModal) {
        return {
            //选择合约规划控件
            rcSelectContractPlan: {
                GetContractPlanType: "/Purchase/GetContractAgreementEditType",//合约规划类型
                QueryPlanContractInfomation: "/Tender/QueryContractInfomation",//合约规划查询 
                LoadDataByContractAgreementCode: "/PurchaseContractAgreement/LoadDataByContractAgreementCode"//根据合约编码查询合约
            }
        };
    });

    app.factory('contractAgreementSelector', function ($http, seagull2Url, wfWaiting, sogModal, configure, rcBaseApi) {
        /**
         * 全局变量
         */
        var common = {};
        configure.getConfig(common, 'common');

        /*
         * 校验 open 函数的参数
         * @param {Object} params 
         * */
        function checkParams(params) {
            if (!params || !angular.isObject(params)) {
                return '请传递参数';
            }
            // 校验 项目
            if (!params.projectCode || !params.projectName) {
                if (!angular.isArray(params.projectList) || params.projectList.length === 0) {
                    return "请先选择项目，再选择合约规划";
                }
            }
            // 校验 期区
            if (!params.stageAreaCode || !params.stageAreaName) {
                if (!angular.isArray(params.stageAreaList) || params.stageAreaList.length === 0) {
                    return "请先选择期区，再选择合约规划";
                }
            }
            return '';
        }

        /*
         * 
         * @param {Object} params
         * params 参数说明：
         * 
        params 参数说明：
        projectCode                 项目编码   String
        projectName                 项目名称   String
        stageAreaCode               期区编码   String
        stageAreaName               期区名称   String
        occupyObjectTypeCode        占用类型   String
        projectList                 项目列表   List
        stageAreaList               期区列表   List
        contractAgreementCodeList   合约列表   List
        *
        * @returns {Promise}
         */
        function open(params) {
            var errMsg = checkParams(params);
            if (errMsg.length > 0) {
                sogModal.openAlertDialog("提示", errMsg);
                return;
            }
            var viewPath = 'htmlTemplate/dialogTemplate/common/contractAgreementSelectorTemp.html';
            var promise = sogModal.openLayer('<div><div ng-include="\'' + viewPath + '\'"></div></div>', ['$scope', function ($modelScope) {
                $modelScope.multipleSelect = false;
                $modelScope.projectChange = function (projectCode) {
                    $modelScope.stageAreaList = [];
                    var isChangeStageArea = false;
                    angular.forEach(params.stageAreaList, function (item, index) {
                        if (projectCode === item.projectCode) {
                            if (isChangeStageArea === false) {
                                $modelScope.model.queryCondition.stageAreaCode = item.stageAreaCode;
                                isChangeStageArea = true;
                            }

                            $modelScope.stageAreaList.push({ code: item.stageAreaCode, name: item.stageAreaName });
                        }
                    });
                };
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
                        projectCode: params.projectCode, //项目code
                        projectName: params.projectName,
                        stageAreaCode: params.stageAreaCode,//期区
                        stageAreaName: params.stageAreaName,
                        contractPlanTypeCode: "", //合约类型
                        planContractName: "", //合约规划名称
                        occupyObjectTypeCode: params.occupyObjectTypeCode,
                        pageSize: 10,
                        pageIndex: 1
                    },
                    selectedItem: [],
                    contractPlanList: [],
                    isLoaded: false,
                    chooseItem: function (item) {
                        if (item.checked) {
                            this.selectedItem.push(item);
                        } else {
                            for (var i = this.selectedItem.length - 1; i >= 0; i--) {
                                if (this.selectedItem[i].planContractCode === item.planContractCode) {
                                    this.selectedItem.splice(i, 1);
                                }
                            }
                        }
                    },
                    query: function () {
                        this.queryCondition.contractPlanTypeCode = this.contractPlanTypeCode;
                        this.queryCondition.planContractName = this.planContractName;
                        this.isLoaded = true;
                        this.loadData(1);
                    },
                    loadData: function (pageIndex) {
                        wfWaiting.show();
                        var that = this;
                        this.queryCondition.pageIndex = pageIndex;
                        //如果合约编码不为空则通过合约编码查询合约
                        if (params.contractAgreementCodeList && params.contractAgreementCodeList.length > 0) {
                            var postUrl = seagull2Url.getPlatformUrl(rcBaseApi.rcSelectContractPlan.LoadDataByContractAgreementCode) + "?contractAgreementCode=" + params.contractAgreementCodeList;
                            postUrl = postUrl.replace("ReimbursementV2", "ContractV2");
                            $http.post(postUrl, params.contractAgreementCodeList)
                                .success(function (data) {
                                    that.paginationConf.totalItems = data.length;
                                    that.contractPlanList = data;
                                    angular.forEach(that.contractPlanList, function (item) {
                                        item.checked = true;
                                        $modelScope.model.selectedItem.push(item);
                                    });
                                    params.contractAgreementCodeList = [];
                                    wfWaiting.hide();
                                }).error(function (data, status) {
                                    sogModal.openAlertDialog("提示", "查询合约规划数据异常");
                                    wfWaiting.hide();
                                });
                        } else {
                            var baseUrl = seagull2Url.getPlatformUrlBase() + rcBaseApi.rcSelectContractPlan.QueryPlanContractInfomation;
                            var url = baseUrl.replace("ReimbursementV2", "ContractV2");
                            $http.post(url, this.queryCondition)
                                .success(function (data) {
                                    that.paginationConf.totalItems = data.totalItems;
                                    that.contractPlanList = data.planContractInfomationData;
                                    angular.forEach(that.contractPlanList, function (item) {
                                        angular.forEach(that.selectedItem, function (selItem) {
                                            if (item.planContractCode == selItem.planContractCode)
                                                item.checked = true;
                                        });
                                    });
                                    wfWaiting.hide();
                                }).error(function (data, status) {
                                    sogModal.openAlertDialog("提示", "查询合约规划数据异常");
                                    wfWaiting.hide();
                                });
                        }
                    },
                    confirm: function () {
                        if (this.valideStatus()) {
                            angular.forEach(this.selectedItem, function (item) {
                                item.projectCode = $modelScope.model.queryCondition.projectCode;
                                item.projectName = $modelScope.model.queryCondition.projectName;
                                item.stageAreaCode = $modelScope.model.queryCondition.stageAreaCode;
                                item.stageAreaName = $modelScope.model.queryCondition.stageAreaName;
                            });
                            $modelScope.confirm(this.selectedItem);
                        }
                    },
                    //校验
                    valideStatus: function () {
                        if (!angular.isArray(this.selectedItem) || this.selectedItem.length === 0) {
                            sogModal.openAlertDialog("提示", "请选择合约规划");
                            return false;
                        }
                        return true;
                    }
                };
                $modelScope.model.isLoaded = true;
                $modelScope.model.loadData(1);
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
                if (angular.isArray(params.projectList) && params.projectList.length > 0) {
                    $modelScope.multipleSelect = true;
                    $modelScope.model.queryCondition.projectCode = params.projectList[0].projectCode;
                    $modelScope.model.queryCondition.projectName = params.projectList[0].projectName;
                    $modelScope.projectList = [];
                    angular.forEach(params.projectList, function (item, index) {
                        $modelScope.projectList.push({ code: item.projectCode, name: item.projectName });
                    });
                }
                if (angular.isArray(params.stageAreaList) && params.stageAreaList.length > 0) {
                    $modelScope.model.queryCondition.stageAreaCode = params.stageAreaList[0].stageAreaCode;
                    $modelScope.model.queryCondition.stageAreaName = params.stageAreaList[0].stageAreaName;
                    $modelScope.projectChange($modelScope.model.queryCondition.projectCode);
                }
                getContractPlanType();
                //分页监控
                $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                    if ($modelScope.model.isLoaded) {
                        $modelScope.model.loadData(newVal, true);
                    }
                });

            }], undefined, undefined, undefined, undefined);// modal end
            return promise;
        }

        return {
            open: open
        };
    });// app.factory end
});


