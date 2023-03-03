define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
        'fixedAssetsExtend',
    ],
    function (app) {

        app.controller('directCommissionedAssetsPurchaseStartContract_controller', [
            '$scope', 'viewData', 'sogOguType', '$window', '$http', 'seagull2Url', 'wfWaiting','sogModal',
            function ($scope, viewData, sogOguType, $window, $http, seagull2Url, wfWaiting, sogModal) {

                angular.extend($scope, viewData);
                $scope.wfOperateOpts.allowCirculate = true;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdraw = !!$scope.viewModel.isAdmin && !$scope.viewModel.completedCompleted;//撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（固定资产采购类）';
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                //  查看上游流程
                $scope.lookFixedAssets = function () {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = $scope.viewModel.purchaseOfFixedAssets.upstreamProcessURL;
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看上游流程异常");
                            wfWaiting.hide();
                        });
                }
                //基本信息
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 2,
                        'completereadonly': false,
                        'scene': 'startupContractEdit',
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $scope.baseInfo.init();

                //更新供应商更名后最新名称
                $scope.isUpdateSupplier = true;
                function Init() {
                    wfWaiting.show();
                    $scope.isUpdateSupplier = false;
                    var suppliers = [];
                    if ($scope.viewModel.purchaseDelegationInfoList.length > 0) {
                        angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (item) {
                            var supplier = {};
                            supplier.supplierCode = item.supplierCode;
                            supplier.supplierName = item.supplierName;
                            suppliers.push(supplier);
                        });

                        var baseUrl = seagull2Url.getPlatformUrlBase() + "/SupplierChangeNameRecord/GetSupplierChangedList";
                        var url = baseUrl.replace("ReimbursementV2", "SupplierV2");
                        $http.post(url, suppliers)
                            .success(function (data) {
                                wfWaiting.hide();
                                var tip = "";
                                var supplierRecords = [];
                                angular.forEach(data.data, function (record) {
                                    angular.forEach(suppliers, function (supplier) {
                                        var supplierRecord = {};
                                        if (supplier.supplierCode == record.supplierCode && supplier.supplierName != record.supplierNewName) {
                                            supplier.isNeedUpdate = true;
                                            $scope.isUpdateSupplier = true;
                                            supplierRecord.supplierName = supplier.supplierName;
                                            supplierRecord.supplierNewName = record.supplierNewName;
                                            supplierRecords.push(supplierRecord);
                                        }
                                    });
                                });
                                var names = "";
                                var newNames = "";
                                for (var i = 0; i < supplierRecords.length; i++) {
                                    names += supplierRecords[i].supplierName + (supplierRecords.length > 1 && i < supplierRecords.length - 1 ? "," : "");
                                    newNames += supplierRecords[i].supplierNewName + (supplierRecords.length > 1 && i < supplierRecords.length - 1 ? "," : "");
                                }
                                tip = "供应商" + names + "已更名为" + newNames + "，是否更新流程中该供应商为最新名称";

                                if ($scope.isUpdateSupplier) {
                                    var promise = sogModal.openConfirmDialog("提示", tip);
                                    promise.then(function () {
                                        angular.forEach($scope.viewModel.purchaseDelegationInfoList, function (item) {
                                            angular.forEach(data.data, function (record) {
                                                if (item.supplierCode == record.supplierCode) {
                                                    item.supplierName = record.supplierNewName;
                                                }
                                            });
                                        });
                                        $scope.isUpdateSupplier = false;
                                    }, function () {
                                    });
                                }

                            }).error(function (data, status) {
                                errorDialog.openErrorDialog("提示", "查询供应商更名信息数据异常，请稍后再试");
                                console.log(data, status);
                                wfWaiting.hide();
                            });
                    }
                }

                if ($scope.isUpdateSupplier) {
                    Init();
                }
            }]);
    });