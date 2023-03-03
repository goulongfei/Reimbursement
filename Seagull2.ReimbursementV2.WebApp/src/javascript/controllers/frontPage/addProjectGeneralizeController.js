define([
    "app",
], function (app) {
    app.controller('addProjectGeneralizeController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window) {
            wfWaiting.show();
            //页面数据
            $scope.viewModel = {
                //搜索条件
                queryCondition: {
                    projectCityCode: "",
                    projectCnName: "",
                    pageSize: 6,
                    pageIndex: 1
                },
                //分页配置
                paginationConf: {
                    currentPage: 1,
                    itemsPerPage: 6,
                    totalItems: 0
                },
                //关键字
                keyword: '',
                //项目编码
                projectCode: '',
                //项目名称
                projectName: '',
                //城市编码
                cityCode: '',
                //城市名称
                cityName: '',
                //城市集合
                cityList: [],
                //项目集合
                projectList: [],
                //推广项目集合
                projectGeneralizeList: [],
                selectedItem: null,
                chooseItem: function (item) {
                    this.selectedItem = item;
                    this.selectedItem.projectName = item.cnName;
                    this.selectedItem.projectCode = item.projectCode;
                },
                query: function () {
                    this.queryCondition.projectCityCode = this.cityCode;
                    this.queryCondition.projectCnName = this.keyword;
                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                    this.selectedItem = null;
                    this.isLoaded = true;
                    this.loadData(1, false);
                },
                loadData: function (pageIndex) {
                    wfWaiting.show();
                    var that = $scope.viewModel;
                    that.queryCondition.pageIndex = pageIndex;
                    $http.post(seagull2Url.getPlatformUrl("/ProjectInfo/QueryProjectInfomation"), that.queryCondition)
                        .success(function (data) {
                            that.paginationConf.totalItems = data.totalItems;
                            that.projectList = data.projectInfomationData;
                            wfWaiting.hide();
                        }).error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查询项目数据异常");
                            wfWaiting.hide();
                        });
                },
                confirm: function () {
                    $scope.viewModel.projectGeneralizeList.push(this.selectedItem);
                    wfWaiting.show();
                    if (this.selectedItem) {
                        var url = seagull2Url.getPlatformUrlBase() + "/Purchase/AddGeneralizeProject?ProjectCode=" + this.selectedItem.projectCode + "&ProjectName=" + this.selectedItem.projectName;
                        $http.get(url).success(function (data) {
                            if (data.replace(/\"/g, "") == 'OK') {
                                sogModal.openAlertDialog('提示', "添加推广项目成功")
                            }
                            else {
                                sogModal.openAlertDialog('添加推广项目失败', data)
                            }
                            wfWaiting.hide();
                        });
                    } else {
                        $scope.viewModel.projectGeneralizeList = [];
                        sogModal.openAlertDialog("提示", "请先选择一条项目信息");
                    }

                },

            };

            //获取城市
            $http.get(seagull2Url.getPlatformUrl("/ProjectInfo/GetProjectCitys") + '?r=' + Math.random(), { cache: false })
                .success(function (data) {
                    if (angular.isArray(data)) {
                        $scope.viewModel.cityList = data;
                    }
                    wfWaiting.hide();
                })
                .error(function (data, status) {
                    sogModal.openErrorDialog(data, status, "查询城市数据异常");
                    wfWaiting.hide();
                });

            $scope.$watch('viewModel.paginationConf.currentPage', function (newVal, oldVal) {
                if ($scope.viewModel.isLoaded) {
                    $scope.viewModel.loadData(newVal, true);
                }
            });

            $scope.load = function () {
                //获取推广项目
                $http.get(seagull2Url.getPlatformUrl("/Purchase/LoadPurchaseProjectGeneralizeList"))
                    .success(function (data) {
                        $scope.viewModel.projectGeneralizeList = data;
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "获取推广项目数据异常");
                        wfWaiting.hide();
                    });
            }
            
            $scope.load();
            //删除
            $scope.delete = function (item) {
                var promise = sogModal.openConfirmDialog("提示", "是否删除推广项目" + item.projectName)
                promise.then(function () {
                    var url = seagull2Url.getPlatformUrlBase() + "/Purchase/DeleteGeneralizeProject?ProjectCode=" + item.projectCode;
                    $http.get(url).success(function (data) {
                        wfWaiting.show();
                        if (data.replace(/\"/g, "") == 'OK') {
                            sogModal.openConfirmDialog('提示', "删除推广项目成功");
                            $scope.load();
                            wfWaiting.hide();
                        }
                        else {
                            sogModal.openAlertDialog('删除推广项目失败', data);
                            wfWaiting.hide();
                        }
                    });
                }, function () {
                    return false;
                });
               
            };
        }]);
});

