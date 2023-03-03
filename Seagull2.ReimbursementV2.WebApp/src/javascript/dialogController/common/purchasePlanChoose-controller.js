define(
    ['app',
        'engineeringExtend',
    ],
    function (app) {
        app.controller('purchasePlanChoose_controller',
            function ($scope, $rootScope, sogModal, $http, seagull2Url, wfWaiting, sogOguType, $location) {
                var config = {
                    url: {
                        purchasePlanUrl: seagull2Url.getPlatformUrl('/PurchaseScheme/QueryPurchasePlanInfomation'),
                        getStageAreaUrl: seagull2Url.getPlatformUrl('/ProjectInfo/GetStageAreaListByProjectCode')
                    },
                };

                $scope.purchasePlanModel = {
                    stageAreaScopeList: [],
                    purhcaesPlanList: [],
                    purchasePlanItem: null,
                    purchasePlanConf: {
                        currentPage: 1,
                        itemsPerPage: 10,
                        totalItems: 0
                    },
                }

                $scope.settings = {
                    //搜索条件
                    queryCondition: {
                        keyWords: "",
                        projectCode: "",
                        stageAreaCode: "",
                        pageSize: 10,
                        pageIndex: 1,
                    },
                    //项目名称
                    projectOpts: {
                        projectName: "",
                        beforAppend: function (project) {
                            $scope.settings.queryCondition.projectCode = project.projectCode;
                            $http.get(config.url.getStageAreaUrl + "?projectCode=" + $scope.settings.queryCondition.projectCode)
                                .success(function (returnResult) {
                                    wfWaiting.hide();
                                    if (returnResult != null) {
                                        $scope.purchasePlanModel.stageAreaScopeList = returnResult.returnData;
                                    }
                                });
                        }
                    },
                    select : function (item) {
                        $scope.purchasePlanModel.purchasePlanItem = item;
                    },
                };

                $scope.Init = function () {
                    wfWaiting.show();
                    $http.post(config.url.purchasePlanUrl + '?r=' + Math.random(), $scope.settings.queryCondition)
                        .success(function (returnResult) {
                            wfWaiting.hide();
                            if (returnResult != null) {
                                $scope.purchasePlanModel.purhcaesPlanList = returnResult.purchasePlanItemData;
                                $scope.purchasePlanModel.purchasePlanConf.totalItems = returnResult.totalItems;
                            }
                        });
                };
                $scope.Init();

                //监听ViewModel页数的变化更新ViewModel的数据
                $scope.$watch('purchasePlanModel.purchasePlanConf.currentPage', function (newVal) {
                    $scope.settings.queryCondition.pageIndex = $scope.purchasePlanModel.purchasePlanConf.currentPage;
                    $scope.Init();
                });

                $scope.purchasePlanFn = {
                    query: function () {
                        $scope.settings.queryCondition.pageIndex = 1;
                        if (!$scope.settings.queryCondition.projectCode) {
                            sogModal.openAlertDialog('选择采购计划', '请选择项目');
                            return false;
                        } 
                        if (!$scope.settings.queryCondition.stageAreaCode) {
                            sogModal.openAlertDialog('选择采购计划', '请选择期区');
                            return false;
                        } 
                        $scope.Init();
                    },
                    chooseItem: function (item) {
                        $scope.purchasePlanModel.purchasePlanItem = item;
                    },
                    confirm: function () {
                        if (!$scope.purchasePlanModel.purchasePlanItem) {
                            sogModal.openAlertDialog('选择采购计划', '请选择一条采购计划');
                            return false;
                        } else {
                            $scope.confirm($scope.purchasePlanModel.purchasePlanItem);
                        }
                    }
                }
            });
    });