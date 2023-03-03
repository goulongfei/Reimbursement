define(["app"], function (app) {
    app.controller('purchasePlanFrontController', function ($scope, $http, wfWaiting, sogModal, seagull2Url, $window) {
        $scope.apiUrl = {
            getCitys: "/ProjectInfo/GetProjectCitys",
            getProjects: "/ProjectInfo/GetProjectsByCityCode",
            getStageAreas: "/ProjectInfo/GetStageAreasByProjectCode",
            drafterValid: "/PurchasePlan/DrafterValid"
        };

        $scope.viewModel = {
            citys: [
                {
                    code: "-1",
                    name: "--请选择--"
                }],//城市集合
            projects: [
                {
                    code: "-1",
                    name: "--请选择--"
                }],//项目集合
            stageAreas: [
                {
                    code: "-1",
                    name: "--请选择--"
                }],//期区集合
            selectCity: {
                code: "-1",
                name: "--请选择--"
            },//选中城市
            selectProject: {
                code: "-1",
                name: "--请选择--"
            },//选中项目
            selectStageArea: {
                code: "-1",
                name: "--请选择--"
            }//选中期区
        };

        $scope.baseInfo = {
            //初始化城市集合
            initCitys: function () {
                wfWaiting.show();
                $http.get(seagull2Url.getPlatformUrl($scope.apiUrl.getCitys) + '?r=' + Math.random(), { cache: false })
                    .success(function (data) {
                        if (angular.isArray(data)) {
                            angular.forEach(data, function (item) {
                                $scope.viewModel.citys.push(item);
                            });
                        }
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "查询城市数据异常");
                        wfWaiting.hide();
                    });
            },
            //初始化项目数据
            initProjects: function () {
                wfWaiting.show();
                $scope.viewModel.projects = [];
                $scope.viewModel.selectProject = {
                    code: "-1",
                    name: "--请选择--"
                };
                $scope.viewModel.selectStageArea = {
                    code: "-1",
                    name: "--请选择--"
                };
                $scope.viewModel.projects.push({ code: "-1", name: "--请选择--" });
                $http.get(seagull2Url.getPlatformUrl($scope.apiUrl.getProjects) + '?cityCode=' + $scope.viewModel.selectCity.code + '&r=' + Math.random(), { cache: false })
                    .success(function (data) {
                        if (angular.isArray(data)) {
                            angular.forEach(data, function (item) {
                                $scope.viewModel.projects.push(item);
                            });
                        }
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "查询项目数据异常");
                        wfWaiting.hide();
                    });
            },
            //初始化期区数据
            initStageAreas: function () {
                wfWaiting.show();
                $scope.viewModel.stageAreas = [];
                $scope.viewModel.selectStageArea = {
                    code: "-1",
                    name: "--请选择--"
                };
                $scope.viewModel.stageAreas.push({ code: "-1", name: "--请选择--" });
                $http.get(seagull2Url.getPlatformUrl($scope.apiUrl.getStageAreas) + '?projectCode=' + $scope.viewModel.selectProject.code + '&r=' + Math.random(), { cache: false })
                    .success(function (data) {
                        if (data.error.length > 0) {
                            sogModal.openAlertDialog('提示', data.error);
                        } else {
                            if (angular.isArray(data.areaList)) {
                                angular.forEach(data.areaList, function (item) {
                                    $scope.viewModel.stageAreas.push(item);
                                });
                            }
                        }
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "查询期区数据异常");
                        wfWaiting.hide();
                    });
            },
            selectCity: function () {
                if ($scope.viewModel.selectCity.code === "-1") {
                    $scope.viewModel.selectCity.name = "--请选择--";
                } else {
                    for (var i = 0; i < $scope.viewModel.citys.length; i++) {
                        if ($scope.viewModel.citys[i].code === $scope.viewModel.selectCity.code) {
                            $scope.viewModel.selectCity.name = $scope.viewModel.citys[i].name;
                            break;
                        }
                    }
                }
                $scope.baseInfo.initProjects();
            },
            selectProject: function () {
                if ($scope.viewModel.selectProject.code === "-1") {
                    $scope.viewModel.selectProject.name = "--请选择--";
                } else {
                    for (var i = 0; i < $scope.viewModel.projects.length; i++) {
                        if ($scope.viewModel.projects[i].code === $scope.viewModel.selectProject.code) {
                            $scope.viewModel.selectProject.name = $scope.viewModel.projects[i].name;
                            break;
                        }
                    }
                }
                $scope.baseInfo.initStageAreas();
            },
            selectStageArea: function () {
                if ($scope.viewModel.selectStageArea.code === "-1") {
                    $scope.viewModel.selectStageArea.name = "--请选择--";
                } else {
                    for (var i = 0; i < $scope.viewModel.stageAreas.length; i++) {
                        if ($scope.viewModel.stageAreas[i].code === $scope.viewModel.selectStageArea.code) {
                            $scope.viewModel.selectStageArea.name = $scope.viewModel.stageAreas[i].name;
                            break;
                        }
                    }
                }
            }
        };
        $scope.baseInfo.initCitys();

        $scope.submit = function () {
            if ($scope.viewModel.selectCity.code === "-1" || $scope.viewModel.selectCity.name === "--请选择--") {
                sogModal.openAlertDialog('提示', "请选择城市");
                return;
            }
            if ($scope.viewModel.selectProject.code === "-1" || $scope.viewModel.selectProject.name === "--请选择--") {
                sogModal.openAlertDialog('提示', "请选择项目");
                return;
            }
            if ($scope.viewModel.selectStageArea.code === "-1" || $scope.viewModel.selectStageArea.name === "--请选择--") {
                sogModal.openAlertDialog('提示', "请选择期区");
                return;
            }
            wfWaiting.show();
            var validParam = 'projectCode=' + $scope.viewModel.selectProject.code;
            if ($scope.viewModel.selectStageArea.code) {
                validParam = validParam + '&stageAreaCode=' + $scope.viewModel.selectStageArea.code;
            }
            $http.get(seagull2Url.getPlatformUrl($scope.apiUrl.drafterValid) + '?' + validParam + '&r=' + Math.random(), { cache: false })
                .success(function (data) {
                    if (data.state) {
                        var param = '&cityCode=' + $scope.viewModel.selectCity.code + '&projectCode=' + $scope.viewModel.selectProject.code + '&stageAreaCode=' + $scope.viewModel.selectStageArea.code;
                        $window.open('default.htm?processDescKey=ReimbursementV2_PurchasePlan' + param + '#/purchasePlanDrafter/', '_self');
                    } else {
                        sogModal.openAlertDialog('提示', data.message);
                    }
                    wfWaiting.hide();
                })
                .error(function (data, status) {
                    sogModal.openErrorDialog(data, status, "查询城市数据异常");
                    wfWaiting.hide();
                });
        };

        $scope.cancel = function () {
            self.close();
        };
    });
});

