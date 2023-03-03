define([
    "app",
], function (app) {
    app.controller('OrganizationContactController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'ValidateHelper', 'sogValidator',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, validateHelper, sogValidator) {
            wfWaiting.show();
            //页面数据
            $scope.viewModel = {
                //搜索条件
                queryCondition: {
                    organizationName: "",
                    pageSize: 10,
                    pageIndex: 1
                },
                userInfo: {
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
                userName: "",
                //账号集合
                userList: [],
                query: function () {
                    this.queryCondition.organizationName = this.organizationName;
                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                    $scope.load(1);
                }
            };

            $scope.$watch('viewModel.paginationConf.currentPage', function (newVal, oldVal) {
                $scope.load(newVal);
            });

            $scope.load = function (pageIndex) {
                var that = $scope.viewModel;
                that.queryCondition.pageIndex = pageIndex;
                //获取京东账户
                $http.post(seagull2Url.getPlatformUrl("/JdMallUser/LoadOrganizationContactList"), that.queryCondition)
                    .success(function (data) {
                        that.paginationConf.totalItems = data.total;
                        $scope.viewModel.userList = data.data;
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "获取数据异常");
                        wfWaiting.hide();
                    });
            }
            $scope.load(1);
            //添加
            $scope.addDetail = function () {
                var viewPath = 'htmlTemplate/dialogTemplate/common/addOrganizationContact.html';
                var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                var opts = {
                    width: '45%',
                    footerHeight: 0
                };
                var promise = sogModal.openMaxDialog(template, '组织联系人', ["$scope",
                    function ($modelScope) {
                        $modelScope.userInfo = angular.copy($scope.viewModel.userInfo);
                        $modelScope.valideStatus = function () {

                            var modelStateDictionary = validateHelper.validateData($modelScope.model, []);
                            if ($modelScope.userInfo.organizationName === "") {
                                modelStateDictionary.addModelError('错误信息', '事业部/专业线名称不能为空!');
                            }
                            if ($modelScope.userInfo.contactNames === "") {
                                modelStateDictionary.addModelError('错误信息', '联系人姓名不能为空！');
                            }
                            if ($modelScope.userInfo.telephones === "") {
                                modelStateDictionary.addModelError('错误信息', '联系人电话不能为空！');
                            }
                            if ($modelScope.userInfo.emails === "") {
                                modelStateDictionary.addModelError('错误信息', '联系人邮箱不能为空！');
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
                            
                            $http.post(seagull2Url.getPlatformUrl("/JdMallUser/AddOrganizationContact"), that.userInfo)
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
                                    sogModal.openErrorDialog(data, status, "获取数据异常");
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
                var promise = sogModal.openConfirmDialog("提示", "是否删除此数据" + item.organizationName+"联系人信息")
                promise.then(function () {
                    var url = seagull2Url.getPlatformUrlBase() + "/JdMallUser/DeleteOrganizationContact?code=" + item.code;
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

        }]);
});

