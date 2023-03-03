define(
    [
        'app',
        'corporationRadioSelector',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
    ],
    function (app) {
        app.controller('purchaseRenewFrontpage_controller',
            function ($scope, $rootScope, $http, sogModal, $window, wfWaiting, seagull2Url) {
               //
                //基本信息
                $scope.viewModel = {
                    purchaseName: "",
                    projectCode: "",
                    projectName: "",
                    stageAreaCode: "",
                    stageAreaName: "",
                    corporationCode: "",
                    corporationName: "",
                    chargeCompanyCode: "",
                    chargeCompanyName: "",
                    costCenterCode: "",
                    costCenterName: "",
                }
                $scope.paginationNonContract = {
                    currentPage: 1,
                    itemsPerPage: 20,
                    totalItems: 0
                }

                $scope.baseInfo = {
                    stageArea: [],
                    chargeCompany: [],
                    costCenter: [],
                    nonContractList : [],
                    //项目
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.viewModel.projectName,
                        beforAppend: function (project) {
                            $scope.viewModel.projectCode = project.projectCode;
                            $scope.viewModel.projectName = project.projectName;
                            $scope.baseInfo.loadStageAreas(project.projectCode);
                        }
                    },
                    // 加载期区
                    loadStageAreas: function (projectCode) {
                        wfWaiting.show();
                        $scope.baseInfo.stageArea = [];
                        var param = { projectCode: projectCode };
                        $scope.api.getStageAreasByProjectCode(param, function (data) {
                            wfWaiting.hide();
                            if (data.error.length == 0) {
                                $scope.baseInfo.stageArea = data.areaList;
                            } else {
                                sogModal.openAlertDialog("提示信息", data.error);
                            }
                        });
                    },
                    // 期区选中下拉框数据变化
                    stageAreaChange: function () {
                        angular.forEach($scope.baseInfo.stageArea, function (v) {
                            if ($scope.viewModel.stageAreaCode === v.code) {
                                $scope.viewModel.stageAreaName = v.name;
                            }
                        });
                    },
                    //法人公司
                    corporationOpts: {
                        corporationName: $scope.viewModel.corporationName,
                        beforAppend: function (corporation) {
                            $scope.viewModel.corporationCode = corporation.corporationCode;
                            $scope.viewModel.corporationName = corporation.corporationName;
                        }
                    },
                    //记账公司
                    chargeCompanyOpts: {
                        corporationName: $scope.viewModel.chargeCompanyName,
                        beforAppend: function (corporation) {
                            $scope.viewModel.chargeCompanyCode = corporation.corporationCode;
                            $scope.viewModel.chargeCompanyName = corporation.corporationName;
                            $scope.viewModel.costCenterCode = "";
                            $scope.viewModel.costCenterName = "";
                            $scope.baseInfo.loadCostCenter($scope.viewModel.chargeCompanyCode);
                        }
                    },
                    //加载成本中心    
                    loadCostCenter: function (chargeCompanyCode) {
                        wfWaiting.show();
                        $scope.baseInfo.costCenter = [];
                        var param = { chargeCompanyCode: chargeCompanyCode };
                        $scope.api.getCostCenterList(param, function (data) {
                            $scope.baseInfo.costCenter = data;
                            wfWaiting.hide();
                        });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function () {
                        angular.forEach($scope.baseInfo.costCenter, function (v) {
                            if ($scope.viewModel.costCenterCode === v.code) {
                                $scope.viewModel.costCenterName = v.name;
                            }
                        });
                    },
                    //查询
                    queryNonContractData : function() {
                        $scope.paginationNonContract.currentPage = 1;
                        $scope.api.getNonContractList();
                    },
                    //重置
                    renewQuery: function () {
                        $scope.viewModel = {
                            purchaseName: "",
                            projectCode: "",
                            projectName: "",
                            stageAreaCode: "",
                            stageAreaName: "",
                            corporationCode: "",
                            corporationName: "",
                            chargeCompanyCode: "",
                            chargeCompanyName: "",
                            costCenterCode: "",
                            costCenterName: "",
                        }
                        $scope.paginationNonContract = {
                            currentPage: 1,
                            itemsPerPage: 20,
                            totalItems: 0
                        }
                        $scope.api.getNonContractList();
                    },
                    strartRenewNonContractPurchase: function (item) {
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl("/PurchaseOfNoContract/CheckNonCotractRenewIsRunning?resourceID=") + item.resourceID + "&r=" + Math.random())
                            .success(function (data) {
                                wfWaiting.hide();
                                if (data.resultstate) {
                                    $window.open('default.htm?processDescKey=ReimbursementV2_NonContractPurchaseRenew&upperResourceID=' + item.resourceID + '#/nonContractRenewApplication/', '_self');
                                } else {
                                    sogModal.openAlertDialog("提示", data.errorMessage);
                                }
                            }).error(function (data) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", data.message);
                            });
                            
                           

                       
                    }
                };

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
                        return seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + param.chargeCompanyCode);
                    },
                    urlQueryNonContractList: seagull2Url.getPlatformUrl('/PurchaseOfNoContract/GetNonContractCompletedList'),

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
                    // 获取无合同采购列表
                    getNonContractList: function () {
                        var postData = {
                            pageIndex: $scope.paginationNonContract.currentPage,
                            pageSize: $scope.paginationNonContract.itemsPerPage,
                            viewModel: $scope.viewModel
                        }
                        wfWaiting.show();
                        $http.post($scope.api.urlQueryNonContractList, postData, { cache: false })
                        .success(function (data) {
                            wfWaiting.hide();
                            $scope.baseInfo.nonContractList = data.nonContractList;
                            $scope.paginationNonContract.totalItems = data.totalItems;
                        });
                    },
                };

                $scope.$watch("paginationNonContract.currentPage", function (nweVal, oldVal) {
                    $scope.api.getNonContractList();
                });

            });
    });