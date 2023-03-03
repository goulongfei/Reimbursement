define(['app'], function (app) {
    app.controller('messageEmailRecordInfo_controller', ['$scope', '$location', 'wfWaiting', 'sogModal', '$http', 'seagull2Url', function ($scope, $location, wfWaiting, sogModal, $http, seagull2Url) {

        //访问后台地址
        var configUrl = {
            MessageEmailRecordInfoUrl: '/ReturnTenderColludingAlert/MessageEmailRecordInfoShow'
        };

        //页面数据
        $scope.viewModel = {
            flowNumber: "",
            getUrl: "",
            postUrl: "",
            postUrlData: "",
            recordInfo: [],
            recordGetDataList: [],
            recordPostDataList: [],

        }

        $scope.messageQuery = function () {
            if ($scope.viewModel.flowNumber == "") {
                sogModal.openAlertDialog("提示", "请输入单据流水号");
                return;
            }
            if ($scope.viewModel.flowNumber.length != 14) {
                sogModal.openAlertDialog("提示", "请输入正确的单据流水号");
                return;
            }
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl(configUrl.MessageEmailRecordInfoUrl) + "?flowNumber=" + $scope.viewModel.flowNumber, { cache: false })
                .success(function (data) {
                    $scope.viewModel.recordInfo = data;
                    wfWaiting.hide();
                });
        };

        $scope.anyGetApiUrl = function () {
            if ($scope.viewModel.getUrl == "") {
                sogModal.openAlertDialog("提示", "请url地址");
                return;
            }
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl($scope.viewModel.getUrl), { cache: false })
                .success(function (data) {
                    $scope.viewModel.recordGetDataList = data;
                    wfWaiting.hide();
                }).error(function (err) {
                    wfWaiting.hide();
                    sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                });
        };

        $scope.anyPostApiUrl = function () {
            if ($scope.viewModel.postUrl == "") {
                sogModal.openAlertDialog("提示", "请url地址");
                return;
            }
            //{"projectCityCode":"110000","projectCnName":"天","pageSize":6,"pageIndex":1}
            if ($scope.viewModel.postUrlData == "") {
                sogModal.openAlertDialog("提示", "请输入请求参数");
                return;
            }
            wfWaiting.show();
            $http.post(seagull2Url.getPlatformUrl($scope.viewModel.postUrl), $scope.viewModel.postUrlData).success(function (data) {
                $scope.viewModel.recordPostDataList = data;
                wfWaiting.hide();
            }).error(function (err) {
                wfWaiting.hide();
                sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
            });
        };

        $scope.anyGetApiUrl = function () {
            if ($scope.viewModel.getUrl == "") {
                sogModal.openAlertDialog("提示", "请url地址");
                return;
            }
            wfWaiting.show();
            $http.get(seagull2Url.getPlatformUrl($scope.viewModel.getUrl), { cache: false })
                .success(function (data) {
                    $scope.viewModel.recordGetDataList = data;
                    wfWaiting.hide();
                }).error(function (err) {
                    wfWaiting.hide();
                    sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                });
        };

        $scope.getParametersByResourceID = function () {
            if ($scope.viewModel.resourceID == "") {
                sogModal.openAlertDialog("提示", "请输入resourceID");
                return;
            }
            wfWaiting.show();
            $scope.hideParams = false;
            $http.get(seagull2Url.getPlatformUrl("/Parameters/GetParametersByResourceID?resourceID=" + $scope.viewModel.resourceID), { cache: false })
                .success(function (data) {
                    $scope.data = data;
                    wfWaiting.hide();
                }).error(function (err) {
                    wfWaiting.hide();
                    sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                });
        };
        //直接委托更改供应商
        $scope.UpdateSupplier = function () {
            if ($scope.viewModel.code == "" || $scope.viewModel.supplierCode == undefined) {
                sogModal.openAlertDialog("提示", "请输入resourceID/supplierCode");
                return;
            }
            var command = {
                code: $scope.viewModel.code,
                supplierCode: $scope.viewModel.supplierCode,
                supplierName: $scope.viewModel.supplierName,
            };

            var url = seagull2Url.getPlatformUrl("/Parameters/UpdatepurchaseDelegationInfoSupplier");
            wfWaiting.show();
            $http.post(url, command)
                .success(function (data) {
                    wfWaiting.hide();
                    if (data.success) {
                        $scope.viewModel.code = "";
                        $scope.viewModel.supplierCode = "";
                        $scope.viewModel.supplierName = "";
                        sogModal.openAlertDialog("提示", "处理完成");
                    } else {
                        sogModal.openAlertDialog("提示", data.message);
                    }
                }).error(function (err) {
                    wfWaiting.hide();
                    sogModal.openAlertDialog("提示", err.message || "不好意思勒，出现异常了，请稍后重试！");
                });


        }


        //询价营销类合同订立无法结束代办修改数据
        $scope.closeInquiryPriceMarketingStartupContract = function () {
            if ($scope.viewModel.inquiryResourceID == "" || $scope.viewModel.inquiryResourceID == undefined) {
                sogModal.openAlertDialog("提示", "请输入resourceID");
                return;
            }
            var command = {
                resourceID: $scope.viewModel.inquiryResourceID,
                contractCode: $scope.viewModel.contractCode,
                contractResourceCode: $scope.viewModel.contractResourceCode,
                contractProcessCode: $scope.viewModel.contractProcessCode,
                contractActivityId: $scope.viewModel.contractActivityId,
                purchaseprocessId: $scope.viewModel.purchaseprocessId,
            };
            //wfWaiting.show();

            var url = seagull2Url.getPlatformUrl("/Parameters/CloseInquiryPriceMarketingStartupContract");
            wfWaiting.show();
            $http.post(url, command)
                .success(function (data) {
                    wfWaiting.hide();
                    if (data.success) {
                        $scope.viewModel.inquiryResourceID = "";
                        $scope.viewModel.contractCode = "";
                        $scope.viewModel.contractResourceCode = "";
                        $scope.viewModel.contractProcessCode = "";
                        $scope.viewModel.contractActivityId = "";
                        $scope.viewModel.purchaseprocessId = "";
                        sogModal.openAlertDialog("提示", "处理完成");
                    } else {
                        sogModal.openAlertDialog("提示", data.message);
                    }
                }).error(function (err) {
                    wfWaiting.hide();
                    sogModal.openAlertDialog("提示", err.message || "不好意思勒，出现异常了，请稍后重试！");
                });
        };

        //查查
        $scope.selectModel = {
            logServerIp: "",
            logTime: "",
            queryString: "",
            queryChecked: "default",
            queryHB: "",
            queryMCUser: "",
            content: [],
            title: [],
        }

        $scope.showLog = function () {
            if (!$scope.selectModel.logTime) {
                sogModal.openAlertDialog('校验', '请输入查询日期！');
                return;
            }
            wfWaiting.show();
            $scope.hideFiles = false;
            $http.get(seagull2Url.getPlatformUrl("/Test/ShowLog") + '?r=' + Math.random() + "&timeString=" + $scope.selectModel.logTime, { cache: false }).success(function (data) {
                $scope.files = data.files;
                $scope.selectModel.logServerIp = data.serverIP;
                wfWaiting.hide();
            }).error(function (e) {
                wfWaiting.hide();
                console.log(e);
            });
        };


    }]);
});

