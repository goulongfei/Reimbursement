 //我的采购清单
define(['app'], function (app) {
    //待发起
    app.directive('pdTaskUnstart', function () {
        return {
            restrict: "A",
            scope: false,
            templateUrl: "./htmlTemplate/controlTemplate/purchaseDetailedList/pdTaskPending.html",
            controller: function ($scope, commonService, commonSetting, wfWaiting) {
                //分页配置
                $scope.paginationUnstart = {
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0
                }
                //待办列表
                $scope.taskList = [];

                $scope.unStartView = {
                    showPurchaseType: function (item, event) {
                        $scope.sideSetting.selectItem = item;
                        $scope.sideSetting.directChildShow = false;
                        $scope.sideSetting.biddingChildShow = false;
                        if ($scope.sideSetting.purchaseTypeShow == true) {
                            $scope.sideSetting.purchaseTypeShow = false;
                        } else {
                            $(".pdl-dropright-menu1").css("top", (event.clientY - 35) + "px");
                            $(".pdl-dropright-menu1").css("left", window.innerWidth / 5 * 2 + 9 + "px");
                            $scope.sideSetting.purchaseTypeShow = true;
                        }
                    },
                }

                //清空查询条件
                function clear_search_input() {
                    $scope.queryKeyWord = ""; //标题
                }

                //加载列表数据
                function loadList() {
                    var postData = {
                        pageIndex: $scope.paginationUnstart.currentPage,
                        pageSize: $scope.paginationUnstart.itemsPerPage,
                        queryTaskTitle: $scope.$parent.queryKeyWord
                    }
                    wfWaiting.show();
                    commonService.getTabList(commonSetting.taskConfig.userTask.type, postData)
                        .success(function (res) {
                            $scope.taskList = res.data;
                            $scope.paginationUnstart.totalItems = res.totalItems;

                            //待办总数给tab数量标记
                            var params = {
                                count: res.totalItems,
                                taskType: commonSetting.taskConfig.userTask.type
                            }
                            $scope.$emit("set_task_count", params);
                            //$scope.$parent.queryKeyWord = ""; //标题
                            wfWaiting.hide();
                        })
                        .error(function (data, header, config, status) {
                            wfWaiting.hide();
                            commonService.requestException(data, header);
                        });
                }

                /********************** Start ************************/
                $scope.$watch("paginationUnstart.currentPage", function (nweVal, oldVal) {
                    loadList();
                });

                //接受父级的广播
                $scope.$on('to-unstart', function (event) {
                    $scope.paginationUnstart.currentPage = 1;
                    clear_search_input();
                    loadList();
                });
                /************************ END ************************/
            }
        }
    });

    //进行中
    app.directive('pdTaskProcessing', function () {
        return {
            restrict: "A",
            scope: false,
            templateUrl: "./htmlTemplate/controlTemplate/purchaseDetailedList/pdTaskProcessing.html",
            controller: function ($scope, commonService, commonSetting, wfWaiting) {
                //分页配置
                $scope.paginationRunning = {
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0
                }

                //待办列表
                $scope.taskList = [];

                //清空查询条件
                function clear_search_input() {
                     $scope.queryKeyWord = ""; //标题
                }

                //加载列表数据
                function loadList() {
                    var postData = {
                        pageIndex: $scope.paginationRunning.currentPage,
                        pageSize: $scope.paginationRunning.itemsPerPage,
                        queryTaskTitle: $scope.$parent.queryKeyWord
                    }
                    wfWaiting.show();
                    commonService.getTabList(commonSetting.taskConfig.runingTask.type, postData)
                        .success(function (res) {
                            $scope.taskList = res.data;
                            $scope.paginationRunning.totalItems = res.totalItems;

                            //待办总数给tab数量标记
                            var params = {
                                count: res.totalItems,
                                taskType: commonSetting.taskConfig.runingTask.type
                            }
                            $scope.$emit("set_task_count", params);
                            //$scope.$parent.queryKeyWord = ""; //标题
                            wfWaiting.hide();
                        })
                        .error(function (data, header, config, status) {
                            wfWaiting.hide();
                            commonService.requestException(data, header);
                        });
                }

                /********************** Start ************************/
                $scope.$watch("paginationRunning.currentPage", function (nweVal, oldVal) {
                    loadList();
                });

                //接受父级的广播
                $scope.$on('to-running', function (event) {
                    $scope.paginationRunning.currentPage = 1;
                    clear_search_input();
                    loadList();
                });
                /************************ END ************************/
            }
        }
    });

    //已完成
    app.directive('pdTaskFinished', function () {
        return {
            restrict: "A",
            scope: false,
            templateUrl: "./htmlTemplate/controlTemplate/purchaseDetailedList/pdTaskFinished.html",
            controller: function ($scope, commonService, commonSetting, wfWaiting) {
                //分页配置
                $scope.paginationFinished = {
                    currentPage: 1,
                    itemsPerPage: 10,
                    pagesLength : 4,
                    totalItems: 0
                }

                //待办列表
                $scope.taskList = [];

                //清空查询条件
                function clear_search_input() {
                     $scope.queryKeyWord = ""; //标题
                }

                //加载列表数据
                function loadList() {
                    var postData = {
                        pageIndex: $scope.paginationFinished.currentPage,
                        pageSize: $scope.paginationFinished.itemsPerPage,
                        queryTaskTitle: $scope.$parent.queryKeyWord
                    }
                    wfWaiting.show();
                    commonService.getTabList(commonSetting.taskConfig.completedTask.type, postData)
                        .success(function (res) {
                            $scope.taskList = res.data;
                            $scope.paginationFinished.totalItems = res.totalItems;

                            //待办总数给tab数量标记
                            var params = {
                                count: res.totalItems,
                                taskType: commonSetting.taskConfig.completedTask.type
                            }
                            $scope.$emit("set_task_count", params);
                            //$scope.$parent.queryKeyWord = ""; //标题
                            wfWaiting.hide();
                        })
                        .error(function (data, header) {
                            wfWaiting.hide();
                            commonService.requestException(data, header);
                        });
                }

                /********************** Start ************************/
                $scope.$watch("paginationFinished.currentPage", function (nweVal, oldVal) {
                    loadList();
                });

                //接受父级的广播
                $scope.$on('to-finished', function (event) {
                    $scope.paginationFinished.currentPage = 1;
                    clear_search_input();
                    loadList();
                });
                /************************ END ************************/
            }
        }
    });

    app.factory('commonService', ['$http', 'seagull2Url', 'sogModal', 'commonApi', 'commonSetting',
        function ($http, seagull2Url, sogModal, commonApi, commonSetting) {
            //处理页面请求错误提示
            var requestException = function (data, header) {
                var promise = null;
                if (header == 0) {
                    promise = sogModal.openAlertDialog('提示！', '消息：请检查网络是否已连接。');
                } else {
                    promise = sogModal.openErrorDialog(data);
                }
                return promise;
            };

            var getTabList = function (taskType, postData) {
                var promise = null;
                var taskConfig = commonSetting.taskConfig;
                switch (taskType) {
                    case taskConfig.userTask.type: promise = $http.post(seagull2Url.getPlatformUrl(commonApi.LoadUserTaskUnStart + "?r=" + Math.random()), postData, { cache: false });//获取待办列表
                        break;
                    case taskConfig.runingTask.type: promise = $http.post(seagull2Url.getPlatformUrl(commonApi.LoadUserTaskRuningTask + "?r=" + Math.random()), postData, { cache: false });//获取流转中列表
                        break;
                    case taskConfig.completedTask.type: promise = $http.post(seagull2Url.getPlatformUrl(commonApi.LoadUserTaskCompletedTask + "?r=" + Math.random()), postData, { cache: false });//获取已办结列表
                        break;
                }
                return promise;
            };

            var getUserTaskCount = function () {
                return $http.get(seagull2Url.getPlatformUrl(commonApi.getUserTaskCountUrl) + '?random=' + Math.random());
            }

            var requestException = function (data, header) {
                var promise = null;
                if (header == 0) {
                    promise = sogModal.openAlertDialog('提示！', '消息：请检查网络是否已连接。');
                } else {
                    promise = sogModal.openErrorDialog(data);
                }
                return promise;
            };

            //实现分页工具函数
            var getListPartData = function (resource, pageIndex, pageSize) {
                var start = (pageIndex - 1) * pageSize,
                    end = pageIndex * pageSize;
                return resource.slice(start, end);
            }
            return {
                requestException: function (header) {
                    return requestException(header);
                },
                getTabList: getTabList,
                getUserTaskCount: getUserTaskCount,
                getListPartData: getListPartData,
            }
        }]);

    //我的待办的api
    app.factory('commonApi', [function () {
        return {
            LoadUserTaskUnStart: '/PurchaseDetailedList/Task/LoadUserTaskUnStart',//待发起,
            LoadUserTaskRuningTask: '/PurchaseDetailedList/Task/LoadUserTaskRuningTask',//流转中
            LoadUserTaskCompletedTask: '/PurchaseDetailedList/Task/LoadUserTaskCompletedTask',//已办结
            StartUpWorkFlowByPurchaseDetailed: '/PurchaseDetailedList/Task/StartUpWorkFlowByPurchaseDetailed',//发起流程
        }
    }]);

    //我的待办的设置
    app.factory("commonSetting", [function () {
        return {
            userConfig: null,
            taskConfig: {
                userTask: { name: "待发起", type: "unStart", value: "unStart" },
                runingTask: { name: "流转中", type: "runingTask", value: "runingTask" },
                completedTask: { name: "已办结", type: "completedTask", value: "completedTask" },
            },
        }
    }]);
});