define([
    "app",
], function (app) {
    app.controller('supplierReplyBiddingReportController', [
        '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
        '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location', '$window', 'ValidateHelper', 'sogValidator', 'sogOguType', 'configure',
        function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location, $window, validateHelper, sogValidator, sogOguType, configure) {
            $scope.common = {};
            configure.getConfig($scope.common, 'common');
            //页面数据
            $scope.viewModel = {
                //搜索条件
                queryCondition: {
                    purchaseName: "",
                    supplierName: "",
                    replyIP: "",
                    pageSize: 10,
                    pageIndex: 1
                },
                //分页配置
                paginationConf: {
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0
                },
                //集合
                dataList: [],
                urlModel: {},
                hasPermission: false,
            };
            //检查是否有查看权限
            $scope.checkPermission = function () {
                var command = {
                    permissionValue: "QuerySupplierReplyBiddingIPView",
                    permissionName: "供应商回标IP查询页面"
                };
                var url = seagull2Url.getPlatformUrl("/SupplierReplyBidding/GetUpmsPermissions");
                wfWaiting.show();
                $http.post(url, command)
                    .success(function (data) {
                        if (data.success) {
                            $scope.viewModel.hasPermission = data.data;
                            wfWaiting.hide();
                            $scope.load(1);
                        } else {
                            wfWaiting.hide();
                            sogModal.openAlertDialog("查询数据异常", data.message);
                        }

                    }).error(function (data, status) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("查询数据异常", data.message);
                    });
            }
            $scope.checkPermission();

            $scope.query = function () {
                var that = $scope.viewModel;
                that.queryCondition.pageSize = that.paginationConf.itemsPerPage;
                that.paginationConf.currentPage = 1;
                $scope.load(1);
            };

            $scope.$watch('viewModel.paginationConf.currentPage', function (newVal, oldVal) {
                if ($scope.viewModel.paginationConf.totalItems > 0)
                    $scope.load(newVal);
            });

            //导出数据
            $scope.export = function () {
                if (!$scope.viewModel.hasPermission) {
                    sogModal.openAlertDialog("提示", "您没有权限导出供应商回标IP数据！");
                    return;
                }
                var that = $scope.viewModel;
                wfWaiting.show();
                //获取数据
                $http.post(seagull2Url.getPlatformUrl('/SupplierReplyBidding/ExportForExcel'), that.queryCondition, { responseType: 'arraybuffer', cache: false })
                    .success(function (data) {
                        var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                        var objectUrl = URL.createObjectURL(blob);
                        var fileName = "供应商回标IP信息.xlsx";
                        if (objectUrl !== null && objectUrl.length < 44) {
                            window.navigator.msSaveOrOpenBlob(blob, fileName);
                        } else {
                            var aForExcel = $("<a download='" + fileName + "' target='_blank'><span id='downFile'></span></a>").attr("href", objectUrl);
                            $("body").append(aForExcel);
                            $("#downFile").click();
                            aForExcel.remove();
                        }
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openAlertDialog('提示', "导出供应商回标IP信息异常");
                        $scope.isSuccess = false;
                        wfWaiting.hide();
                    });
            }

            $scope.reset = function () {
                $scope.viewModel.queryCondition = {};
                $scope.load(1);
            }
            $scope.load = function (pageIndex) {
                
                if (!$scope.viewModel.hasPermission) {
                    sogModal.openAlertDialog("提示", "您没有权限查看供应商回标IP数据！");
                    return;
                }
                var that = $scope.viewModel;
                wfWaiting.show();

                that.queryCondition.pageIndex = pageIndex;
                //获取数据
                $http.post(seagull2Url.getPlatformUrl("/SupplierReplyBidding/LoadSupplierReplyBiddingList"), that.queryCondition)
                    .success(function (data) {
                        that.paginationConf.totalItems = data.total;
                        $scope.viewModel.dataList = data.data;
                        wfWaiting.hide();
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "获取数据异常");
                        wfWaiting.hide();
                    });
            }
            
            //查看页面
            $scope.lookInfo = function (flag, type) {
                //获取数据
                var strmsg = "";
                if (type == 0) {
                    strmsg = "未找到商务评标环节数据";
                }
                else if (type == 1) {
                    strmsg = "未找到发放标书环节数据";
                } else {
                    strmsg = "未找到编制招标信息环节数据";
                }
                $http.get(seagull2Url.getPlatformUrl("/SupplierReplyBidding/GetProcessActivityInfo") + "?resourceID=" + flag.resourceID + "&type=" + type)
                    .success(function (data) {
                        if (data.data == null) {
                            sogModal.openAlertDialog("获取数据异常", strmsg);
                            return;
                        }
                        //$scope.viewModel.urlModel = data.data;
                        wfWaiting.hide();
                        openUrl(data.data, flag.resourceID);
                    })
                    .error(function (data, status) {
                        sogModal.openErrorDialog(data, status, "获取数据异常");
                        wfWaiting.hide();
                    });
            };

            var openUrl = function (item, resourceID) {
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = "";
                            var activityID = "";
                            var routeType = "";
                            url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + item.activityStateName + "/?resourceID=" + resourceID + "&activityID=" + item.activityCode;
                            if (url.indexOf("?") == -1) {
                                url = url + "?_at=" + urlat;
                            } else {
                                url = url + "&_at=" + urlat;
                            }
                            $window.open(url, '_blank');
                        }

                    })
            }

        }]);
});

