
define(
    [
        'app'
    ],
    function (app) {

        app.controller('purchaseStrategyContractSelector-controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
            '$timeout', 'wfWaiting', 'sogModal', 'seagull2Url', '$location',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, seagull2Url, $location) {

                $scope.viewModel.strategyContractList = [];

                $scope.viewModel.strategyContractConf = {
                    currentPage: 1,
                    itemsPerPage: 5,
                    totalItems: 0
                };

                //选战采协议-分页初始化
                var selectProjectInit = function () {
                    $scope.viewModel.strategyContractConf.currentPage = 1;
                    var tempProjectList = new Array();
                    var m = $scope.viewModel.strategyContractConf.itemsPerPage * ($scope.viewModel.strategyContractConf.currentPage - 1);
                    for (i = 0; i < $scope.viewModel.strategyContractConf.itemsPerPage; i++) {
                        if (m + i >= $scope.viewModel.strategyContractList.length) {
                            break;
                        }
                        tempProjectList.push($scope.viewModel.strategyContractList[m + i]);
                    }
                    $scope.strategyContractList = tempProjectList;
                    $scope.viewModel.strategyContractConf.totalItems = $scope.viewModel.strategyContractList.length;
                }

                //查询战采协议
                var purchaseStrategySearch = function (supplierName, contractName) {
                    var url = seagull2Url.getPlatformUrl('/PurchaseBase/GetPurchaseStrategyContractList');
                    var obj = { supplierName: supplierName, contractName: contractName };
                    wfWaiting.show();
                    $http.post(url, obj)
                        .success(function(data) {
                            $scope.viewModel.strategyContractList = data;
                            selectProjectInit();
                            wfWaiting.hide();
                        });
                }
                purchaseStrategySearch("", "");


                //选战采协议-查询刷新数据
                $scope.setCondition = function (supplierName, contractName) {
                    if (supplierName == undefined) {
                        supplierName = "";
                    }
                    if (contractName == undefined) {
                        contractName = "";
                    }
                    purchaseStrategySearch(supplierName, contractName);
                }

                //选战采协议-条件重置
                $scope.renewConditon = function (supplierName, contractName) {
                    this.supplierName = "";
                    this.contractName = "";
                }

                //选战采协议-分页
                $scope.$watch('viewModel.strategyContractConf.currentPage', function (newValue, oldValue) {
                    if ($scope.viewModel.strategyContractConf.currentPage == 0 || $scope.viewModel.strategyContractConf.itemsPerPage == 0) {
                        return;
                    }
                    var tempProjectList = [];
                    var m = $scope.viewModel.strategyContractConf.itemsPerPage * ($scope.viewModel.strategyContractConf.currentPage - 1);
                    for (i = 0; i < $scope.viewModel.strategyContractConf.itemsPerPage; i++) {
                        if (m + i >= $scope.viewModel.strategyContractList.length) {
                            break;
                        }
                        tempProjectList.push($scope.viewModel.strategyContractList[m + i]);
                    }
                    $scope.strategyContractList = tempProjectList;
                    for (var i = 0; i < $scope.strategyContractList.length; i++) {
                        if ($scope.strategyContractList[i].checked) {
                            $scope.strategyContractList[i].checked = false;
                        }
                    }
                    $scope.viewModel.strategyContractConf.totalItems = $scope.viewModel.strategyContractList.length;
                }, true);



                //单选方法
                $scope.strategyContractOk = function (item) {
                    if (item) {
                        var contractResult = JSON.parse(item);
                        $scope.confirm(contractResult);
                    }
                    else {
                        sogModal.openAlertDialog('提示', '请选择协议！');
                    }
                }
            }], undefined, {}, undefined, undefined);
    });
