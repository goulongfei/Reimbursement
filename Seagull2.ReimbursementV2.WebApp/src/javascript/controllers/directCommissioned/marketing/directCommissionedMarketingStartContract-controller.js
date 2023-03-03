define(
    [
        'app',
        'directCommissionedSynthesizeExtend',
         'commonUtilExtend',
    ],
    function (app) {
        app.controller('directCommissionedMarketingStartContract_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url', 'wfWaiting','sogModal',
            function ($scope, viewData, $http, seagull2Url, wfWaiting, sogModal) {

                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "直接委托(营销类)";
                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                //基本信息
                $scope.baseInfo = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'startupContractEdit',
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

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
                                sogModal.openErrorDialog("提示", "查询供应商更名信息数据异常，请稍后再试");
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