define([
    "app",
], function (app) {
    app.controller('JdMallUsersController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'ValidateHelper', 'sogValidator', 'sogOguType',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, validateHelper, sogValidator, sogOguType) {

            //页面数据
            $scope.viewModel = {
                //搜索条件
                queryCondition: {
                    userName: "",
                    pageSize: 10,
                    pageIndex: 1
                },
                userInfo: {
                    code: "",
                    sysUser: null,
                    jdUserName: "",
                    jdPassword: "",
                    description: "",
                    validStatus: true
                },
                //分页配置
                paginationConf: {
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0
                },

                //账号集合
                userList: [],
                hasPermission: false,
                query: function () {
                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                    $scope.load(1);
                }
            };
            $scope.baseInfo = {
                //单选人员
                peopleSelect: {
                    selectMask: sogOguType.User,
                    multiple: false
                },
                idEdit: false
            };

            //检查是否有权限
            $scope.validPermission = function () {
                wfWaiting.show();
                var url = seagull2Url.getPlatformUrlBase() + "/JdMallUser/GetJdMallUserPermission";

                $http.get(url).success(function (data) {
                    if (data.success) {

                        $scope.viewModel.hasPermission = data.data;
                        if (!$scope.viewModel.hasPermission) {
                            sogModal.openAlertDialog('提示', "您没有京东购账号管理权限!");
                            return;
                        } else {
                            $scope.load(1);
                        }
                            
                        console.log($scope.viewModel.hasPermission);
                    }
                });
                wfWaiting.hide();
            };

             $scope.validPermission();

            $scope.$watch('viewModel.paginationConf.currentPage', function (newVal, oldVal) {
                if ($scope.viewModel.paginationConf.totalItems > 0)
                    $scope.load(newVal);
            });

            $scope.load = function (pageIndex) {

                var that = $scope.viewModel;
                if (!that.hasPermission) {
                    sogModal.openAlertDialog('提示', "您没有京东购账号管理权限!");
                    return;
                }
                wfWaiting.show();
                that.queryCondition.pageIndex = pageIndex;
                //获取京东账户
                $http.post(seagull2Url.getPlatformUrl("/JdMallUser/LoadPurchaseJdMallUserList"), that.queryCondition)
                    .success(function (data) {
                        that.paginationConf.totalItems = data.total;
                        $scope.viewModel.userList = data.data;
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "获取京东账号数据异常");
                        wfWaiting.hide();
                    });
            }
            //$scope.load(1);

            $scope.import = function () {
                var url = seagull2Url.getPlatformUrlBase() + "/JdMallUser/ImportJdUser";
                wfWaiting.show();
                $http.get(url).success(function (data) {
                    if (data.success) {
                        sogModal.openAlertDialog('提示', data.message);
                        $scope.load(1);
                    } else {
                        sogModal.openAlertDialog('提示', "初始化失败" + data.message);
                    }
                    wfWaiting.hide();
                });
            }

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

            $scope.logView = function (userCode) {
                var viewPath = 'htmlTemplate/dialogTemplate/common/ShowJdMallUserLogs.html';
                var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                var opts = {
                    width: '65%',
                    footerHeight: 0
                };
                //获取京东账户
                wfWaiting.show();
                var promise = sogModal.openMaxDialog(template, '日志信息', ["$scope",
                    function ($modelScope) {
                        $http.get(seagull2Url.getPlatformUrl("/JdMallUser/LoadPurchaseJdMallUserLogs") + "?code=" + userCode)
                            .success(function (data) {
                                $modelScope.logList = data.data;
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                sogModal.openErrorDialog(data, status, "获取京东账号日志数据异常");
                                wfWaiting.hide();
                            });
                    }], $scope, null, opts);
                promise.then(function (v) {

                }, function (v) {

                });
            }
            //添加
            $scope.addDetail = function () {

                var viewPath = 'htmlTemplate/dialogTemplate/common/addJdMallUser.html';
                var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                var opts = {
                    width: '45%',
                    footerHeight: 0
                };
                $scope.baseInfo.isEdit = false;
                var promise = sogModal.openMaxDialog(template, '京东购账户', ["$scope",
                    function ($modelScope) {
                        $modelScope.userInfo = angular.copy($scope.viewModel.userInfo);
                        $modelScope.valideStatus = function () {

                            var modelStateDictionary = validateHelper.validateData($modelScope.model, []);
                            if ($modelScope.userInfo.jdUserName === "") {
                                modelStateDictionary.addModelError('错误信息', '账户不能为空!');
                            }
                            if ($modelScope.userInfo.jdPassword === "") {
                                modelStateDictionary.addModelError('错误信息', '密码不能为空！');
                            }
                            if ($modelScope.userInfo.sysUser === null) {
                                modelStateDictionary.addModelError('错误信息', '请关联用户！');
                            }
                            sogValidator.clear();
                            if (!modelStateDictionary.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                sogValidator.broadcastResult(modelStateDictionary.get());
                                return false;
                            }
                            return true;
                        }
                        $modelScope.save = function () {
                            if (!$modelScope.valideStatus()) {
                                return;
                            }
                            var that = $modelScope;
                            wfWaiting.show();
                            $modelScope.valideStatus();

                            $http.post(seagull2Url.getPlatformUrl("/JdMallUser/SaveJdMallUser"), that.userInfo)
                                .success(function (data) {
                                    if (data.data) {
                                        //$modelScope.confirm($modelScope);
                                        sogModal.openSuccessToast('新增成功', 500);
                                        $modelScope.closeThisDialog();
                                        $scope.load(1);
                                        wfWaiting.hide();

                                    } else {
                                        sogModal.openAlertDialog('新增失败', data.message);
                                        wfWaiting.hide();
                                    }
                                })
                                .error(function (data, status) {
                                    sogModal.openErrorDialog(data, status, "获取京东账号数据异常");
                                    wfWaiting.hide();
                                });

                        };
                    }], $scope, null, opts);
                promise.then(function (v) {
                    $scope.load(1);
                }, function (v) {
                    $scope.msg = "点击了取消:" + v;
                });

            };
            //删除
            $scope.delete = function (item) {
                var promise = sogModal.openConfirmDialog("提示", "是否删除此账号" + item.jdUserName);
                promise.then(function () {
                    var url = seagull2Url.getPlatformUrlBase() + "/JdMallUser/DeleteJdMallUser?code=" + item.code;
                    $http.get(url).success(function (data) {
                        wfWaiting.show();
                        if (data.success) {
                            sogModal.openSuccessToast('删除成功', 500);
                            wfWaiting.hide();
                            $scope.load(1);
                        }
                        else {
                            sogModal.openAlertDialog('删除失败', data.message);
                            wfWaiting.hide();
                        }
                    });
                }, function () {
                    return false;
                });

            };

            //编辑
            $scope.edit = function (item) {

                var viewPath = 'htmlTemplate/dialogTemplate/common/addJdMallUser.html';
                var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                var opts = {
                    width: '45%',
                    footerHeight: 0
                };
                $scope.baseInfo.isEdit = true;
                var promise = sogModal.openMaxDialog(template, '京东购账户', ["$scope",
                    function ($modelScope) {
                        $modelScope.userInfo = angular.copy($scope.viewModel.userInfo);
                        var url = seagull2Url.getPlatformUrlBase() + "/JdMallUser/GetJdMallUser?code=" + item.code;
                        $http.get(url).success(function (data) {
                            wfWaiting.show();
                            if (data.success) {
                                $modelScope.userInfo = data.data;
                                wfWaiting.hide();
                                console.log($modelScope.userInfo);
                            }
                        });

                        $modelScope.valideStatus = function () {
                            var modelStateDictionary = validateHelper.validateData($modelScope.model, []);
                            if ($modelScope.userInfo.jdUserName === "") {
                                modelStateDictionary.addModelError('错误信息', '账户不能为空!');
                            }
                            if ($modelScope.userInfo.jdPassword === "") {
                                modelStateDictionary.addModelError('错误信息', '密码不能为空！');
                            }
                            if ($modelScope.userInfo.sysUser === null) {
                                modelStateDictionary.addModelError('错误信息', '请关联用户！');
                            }
                            sogValidator.clear();
                            if (!modelStateDictionary.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                sogValidator.broadcastResult(modelStateDictionary.get());
                                return false;
                            }
                            return true;
                        }
                        $modelScope.save = function () {
                            if (!$modelScope.valideStatus()) {
                                return;
                            }
                            var that = $modelScope;
                            wfWaiting.show();
                            $modelScope.valideStatus();

                            $http.post(seagull2Url.getPlatformUrl("/JdMallUser/EditJdMallUser"), that.userInfo)
                                .success(function (data) {
                                    if (data.data) {
                                        sogModal.openSuccessToast('编辑成功', 500);
                                        $modelScope.closeThisDialog();
                                        $scope.load(1);
                                        wfWaiting.hide();

                                    } else {
                                        sogModal.openAlertDialog('编辑失败', data.message);
                                        wfWaiting.hide();
                                    }
                                })
                                .error(function (data, status) {
                                    sogModal.openErrorDialog(data, status, "获取京东账号数据异常");
                                    wfWaiting.hide();
                                });

                        };
                    }], $scope, null, opts);
                promise.then(function (v) {
                    $scope.load(1);
                }, function (v) {
                    $scope.msg = "点击了取消:" + v;
                });

            };

            //改变状态
            $scope.change = function (item) {
                var msg = item.validStatus ? "改为无效" : "改为有效";
                var promise = sogModal.openConfirmDialog("提示", "是否将此账号" + item.jdUserName + msg + "?");
                promise.then(function () {
                    var url = seagull2Url.getPlatformUrlBase() + "/JdMallUser/EditJdUserValid";
                    var command = {
                        code: item.code,
                        validStatus: !item.validStatus
                    };
                    $http.post(url, command).success(function (data) {
                        wfWaiting.show();
                        if (data.success) {
                            sogModal.openSuccessToast('修改成功', 500);
                            wfWaiting.hide();
                            $scope.load(1);
                        }
                        else {
                            sogModal.openAlertDialog('修改失败', data.message);
                            wfWaiting.hide();
                        }
                    });
                }, function () {
                    return false;
                });

            };

        }]);
});

