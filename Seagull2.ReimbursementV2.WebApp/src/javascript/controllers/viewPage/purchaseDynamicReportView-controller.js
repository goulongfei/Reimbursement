define([
    "app",
], function (app) {
    app.controller('purchaseDynamicReportView_controller', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'ValidateHelper', 'sogValidator', 'sogOguType',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, validateHelper, sogValidator, sogOguType) {
            $scope.confs = {
                type: $location.search().type,
                projectCode: $location.search().projectCode,
                stageAreaCode: $location.search().stageAreaCode,
                stratTime: $location.search().stratTime,
                endTime: $location.search().endTime,
            }
            //页面数据
            $scope.viewModel = {
                //搜索条件
                queryCondition: {
                    type: 0,
                    projectCode: "",
                    stageAreaCode: "",
                    stratTime: "",
                    endTime: "",
                    pageSize: 15,
                    pageIndex: 1
                },
                //分页配置
                paginationConf: {
                    currentPage: 1,
                    itemsPerPage: 15,
                    totalItems: 0
                },
                //账号集合
                reportList: []
            };
            $scope.$watch('viewModel.paginationConf.currentPage', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    $scope.load(newVal);
                }
            });
            $scope.load = function (pageIndex) {
                if ($scope.confs.type == 0 || $scope.confs.projectCode == "" || $scope.confs.stageAreaCode == "") {
                    sogModal.openAlertDialog("提示", "参数有误！");
                } else {
                    wfWaiting.show();
                    //var that = $scope.viewModel;
                    $scope.viewModel.queryCondition.pageIndex = pageIndex;
                    $scope.viewModel.queryCondition.type = $scope.confs.type;
                    $scope.viewModel.queryCondition.projectCode = $scope.confs.projectCode;
                    $scope.viewModel.queryCondition.stageAreaCode = $scope.confs.stageAreaCode;
                    $scope.viewModel.queryCondition.stratTime = $scope.confs.stratTime;
                    $scope.viewModel.queryCondition.endTime = $scope.confs.endTime;
                    $http.post(seagull2Url.getPlatformUrl("/PurchaseDataView/GetPurchaseDynamicData"), $scope.viewModel.queryCondition)
                        .success(function (data) {
                            $scope.viewModel.paginationConf.totalItems = data.total;
                            $scope.viewModel.reportList = data.data;
                            wfWaiting.hide();
                        })
                        .error(function (data, status) {
                            sogModal.openErrorDialog(data, status, "获取采购数据异常");
                            wfWaiting.hide();
                        });
                }
            }
            //查看页面
            $scope.targetPage = function (item) {
                if (item.purchaseRoutes == "" || item.purchaseRoutes == null) {
                    sogModal.openAlertDialog("提示", "当前单据还未产生已办信息，烦请流转后在查看！");
                    return;
                }
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        var urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = item.purchaseRoutes;
                            url = url + "&_at=" + urlat;
                            $window.open(url, '_blank');
                        }
                    })
            };
            $scope.load(1);
        }]);
});

