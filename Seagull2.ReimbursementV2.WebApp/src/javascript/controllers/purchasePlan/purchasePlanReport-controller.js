define(
    [
        'app',
        'corporationRadioSelector',
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
    ],
    function (app) {
        app.controller('purchasePlanReport_controller',
            function ($scope, $rootScope, $http, $state, seagull2Url, wfWaiting, sogModal, sogOguType, configure, $window,
                ValidateHelper, sogValidator, errorDialog,) {

                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题项目名称
                $scope.title = "采购计划上报情况跟踪表";

                // 自定义子级 中国
                $scope.selectorOptsCity = {
                    root: {
                        id: 'CHN',
                        //子级的类型
                        childrenClass: 'province' //regionType.province
                    },
                    rootName: '中国',
                    selectMask: ['city'], //[regionType.city]
                    multiple: true,
                };
                $scope.allSelectCheck = false;//全选按钮
                var arrCheckValue = new Array();
                $scope.summitConfigList = [];
                $scope.model = {
                    listShowProjectConstructConfigInfo: [], //查看项目集合
                    offlineProjectName: "",
                    listCity: [],
                    listPorject: [],
                    listBusinessDivision: [{ code: "", cnName: "请选择" }],//事业部
                    listIncorporatedCompany: null,
                    PurchasePlanReportDatas: [],
                    BusinessDivisionCollection: [],
                    version: {
                        all: 0,//截止目前
                        thisYear: 1,//今年
                        lastYear: 2//去年
                    },
                    paginationConf: {
                        currentPage: 1,
                        itemsPerPage: 80,
                        totalItems: 0
                    },

                    queryCondition: {
                        cityCode: "",
                        cityName: "",
                        projectCode: "",
                        projectName: "",
                        stageAreaCode: "",
                        businessDivisionCode: "",
                        businessDivisionName: "",
                        pageSize: 80,
                        pageIndex: 1,
                    },

                    //重置条件
                    reset: function () {
                        this.listCity = null;
                        this.queryCondition.projectName = "";
                        this.queryCondition.projectCode = "";
                        this.queryCondition.businessDivisionCode = "";
                        this.queryCondition.businessDivisionName = "";
                        $scope.baseInfo.projectOpts.projectName = "",
                            this.listUser = null;
                    },

                    //点击查询                   
                    clickquery: function () {
                        if (this.queryCondition.businessDivisionCode != "" && this.queryCondition.businessDivisionCode != null) {
                            this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                            if (this.paginationConf.currentPage === 1) {
                                $scope.queryData(1);
                            }
                            else {
                                this.paginationConf.currentPage = 1;
                            }
                        }
                        else {
                            sogModal.openConfirmDialog("提示", "请选择事业部!");
                        }
                    },
                };

                //基本信息
                $scope.baseInfo = {
                    //项目名称
                    projectOpts: {
                        readOnly: false,
                        projectName: $scope.model.queryCondition.projectName,
                        beforAppend: function (project) {
                            $scope.model.queryCondition.projectCode = project.projectCode;
                            $scope.model.queryCondition.projectName = project.projectName;
                        }
                    },
                };
                $scope.allSelectCheck = false;//全选按钮
                $scope.summitConfigList = [];

                //事业部change
                $scope.businessDivisionChange = function (index, curItem) {
                    angular.forEach($scope.model.listBusinessDivision, function (item) {
                        if (item.code == curItem.businessDivisionCode) {
                            curItem.businessDivisionName = item.name;
                        }
                    });
                };

                //选择事业部
                $scope.SelectBusinessDivision = function () {
                    var path = "./htmlTemplate/controlTemplate/common/selectBusinessDivisionDialog.html",
                        dialog = sogModal.openLayer('<div><div ng-include="\'' + path + '\'"></div></div>', ['$scope', function ($modalScope) {
                            $modalScope.selectedItem = null,
                                $modalScope.chkList = [];
                            GetConstructCenterData();
                            //点击节点事件                                                    
                            function GetConstructCenterData() {
                                wfWaiting.show();
                                $http.get(seagull2Url.getPlatformUrl("/PurchasePlanReport/GetBusinessDivisionData") + '?r=' + Math.random(), { cache: false })
                                    .success(function (data) {
                                        $modalScope.lstBusinessDivision = data;
                                        wfWaiting.hide();

                                    }).error(function (data, status) {
                                        errorDialog.openErrorDialog(data, status, "查询事业部数据异常");
                                        wfWaiting.hide();
                                    });
                            }

                            $modalScope.SelectSealOK = function () {
                                //获取选择项
                                angular.forEach($modalScope.lstBusinessDivision, function (item) {
                                    if (item.checked) {
                                        $modalScope.chkList.push(item);
                                    }
                                });
                                angular.forEach($modalScope.chkList, function (item) {
                                    $scope.model.queryCondition.businessDivisionCode += item.businessDivisionCode + ",";
                                    $scope.model.queryCondition.businessDivisionName += item.businessDivisionName + ",";
                                });

                            };
                        }], undefined, {}, undefined, undefined);
                };

                //查看采购计划历史版本
                $scope.GetPurchasePlanEditRecord = function (version, projectCode, stageAreaCode) {
                    if (projectCode != null) {
                        $scope.PurchasePlanRecordList = [];
                        if (stageAreaCode == "") {
                            var url = "/PurchasePlanReport/GetPurchasePlanEditRecord?version=" + version + "&projectCode=" + projectCode + "&Random=" + Math.random();
                        }
                        else {
                            var url = "/PurchasePlanReport/GetPurchasePlanEditRecord?version=" + version + "&projectCode=" + projectCode + "&stageAreaCode=" + stageAreaCode + "&Random=" + Math.random();
                        }
                        url = seagull2Url.getPlatformUrl(url);
                        wfWaiting.show();
                        $http.get(url).success(function (result) {
                            var url = "views/purchasePlan/viewpurchasePlanReport.html";
                            var template = '<div ng-include="\'' + url + '\'"></div>';
                            $scope.PurchasePlanRecordList = result.data;
                            console.log(result.data)
                            sogModal.openDialog(template, '采购计划历史版本(全部)', this, $scope, { containerStyle: { width: '600px' } });
                            wfWaiting.hide();
                        });
                    }
                    else {
                        var url = "views/purchasePlan/viewpurchasePlanReport.html";
                        var template = '<div ng-include="\'' + url + '\'"></div>';
                        sogModal.openDialog(template, '采购计划历史版本(全部)', this, $scope, { containerStyle: { width: '600px' } });
                    }
                };

                //查看采购计划历史单据
                $scope.ViewPurchasePlanRecordForm = function (item) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var route = "purchasePlanDrafter";
                                url = $scope.common.webUrlBase + "/THRWebApp/PurchaseV2/default.htm#/" + route + "/?resourceID=" + item.resourceID;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看采购计划单据异常");
                            wfWaiting.hide();
                        });
                };

                //查询月报信息
                $scope.queryData = function (pageIndex) {
                    var that = $scope.model;
                    that.queryCondition.pageIndex = pageIndex;
                    wfWaiting.show();
                    $http.post(seagull2Url.getPlatformUrl("/PurchasePlanReport/QueryPurchasePlanReport"), that.queryCondition)
                        .success(function (data) {
                            that.paginationConf.totalItems = data.total;
                            $scope.model.PurchasePlanReportDatas = data.data;
                            console.log(that.paginationConf.totalItems)
                            wfWaiting.hide();
                            if (that.paginationConf.totalItems < 1) {
                                sogModal.openConfirmDialog("提示", "所选事业部或项目查询信息为空!");
                            }
                            console.log(data.data)
                        }).error(function (e) {
                            sogModal.openErrorDialog(data, status, "获取信息数据异常");
                            wfWaiting.hide();
                        });

                };
                $scope.queryData();

                //分页监控
                $scope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                    if ($scope.model.paginationConf.totalItems > 0)
                        $scope.queryData(newVal);
                });

            });
    });