define([
    "app",
], function (app) {
    app.controller('JdMallUserLogsController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'ValidateHelper', 'sogValidator', 'sogOguType',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, validateHelper, sogValidator, sogOguType) {

            //页面数据
            $scope.viewModel = {
                //搜索条件
                queryCondition: {
                    jdMallUserName: "",
                    operationMode:"",
                    pageSize: 10,
                    pageIndex: 1
                },
                //分页配置
                paginationConf: {
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0
                },
                //账号集合
                logList: [],
                query: function () {
                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                    $scope.load(1);
                    //$scope.validPermission();
                }
            };

            $scope.$watch('viewModel.paginationConf.currentPage', function (newVal, oldVal) {
                $scope.load(newVal);
            });

            $scope.getActionTitle = function (action) {
                var str;
                switch (action) {
                    case 1:
                        str = "新增";
                        break;
                    case 2:
                        str = "编辑";
                        break;
                    case 3:
                        str = "删除";
                        break;
                    case 4:
                        str = "置为有效";
                        break;
                    case 5:
                        str = "置为无效";
                        break;
                    case 6:
                        str = "初始化";
                        break;
                    default:
                        str = "";
                }
                return str;
            };

            $scope.load = function (pageIndex) {

                wfWaiting.show();

                var that = $scope.viewModel;

                that.queryCondition.pageIndex = pageIndex;
                //获取京东账户
                $http.post(seagull2Url.getPlatformUrl("/JdMallUser/LoadPurchaseJdMallUserLogList"), that.queryCondition)
                    .success(function (data) {
                        that.paginationConf.totalItems = data.total;
                        $scope.viewModel.logList = data.data;
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "获取京东账号日志数据异常");
                        wfWaiting.hide();
                    });
            }
        }]);
});

