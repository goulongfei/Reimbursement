﻿define(
    [
        'app'
    ],
    function (app) {
        app.controller('corporationRadioSelector_controller', [
            '$scope', '$rootScope', 'sogModal', '$http', '$state', '$stateParams', '$timeout', 'wfOperate', 'seagull2Url', 'wfWaiting', 'sogOguType', '$location',
            function ($scope, $rootScope, sogModal, $http, $state, $stateParams, $timeout, wfOperate, seagull2Url, wfWaiting, sogOguType, $location) {
                var config = {
                    url: {
                        corporationUrl: seagull2Url.getPlatformUrl('/Purchase/GetCorporationList')
                    }
                };

                $scope.viewModel.corporationConf = {
                    currentPage: 1,
                    itemsPerPage: 5,
                    totalItems: 0
                };

                $scope.Init = function () {
                    wfWaiting.show();
                    $http.get(config.url.corporationUrl)
                        .success(function (returnResult) {
                            wfWaiting.hide();
                            if (returnResult != null) {
                                $scope.corporationList = returnResult;
                                $scope.viewModel.corporationConf.totalItems = returnResult.length;
                            }
                        });
                };

                $scope.corporationSearch = function () {
                    var corporationNewList = [];
                    angular.forEach($scope.corporationList, function (corporation) {
                        if (corporation.cnName.indexOf($scope.viewModel.keyWords) != -1) {
                            corporationNewList.push(corporation);
                        }
                    });
                    $scope.corporationList = corporationNewList;
                    $scope.viewModel.corporationConf.totalItems = $scope.corporationList.length;
                };

                $scope.select = function (item) {
                    $scope.viewModel.corporation = item;
                };

                $scope.selectOk = function () {
                    if (!$scope.viewModel.corporation) {
                        sogModal.openAlertDialog('选择项目', '请先选择招标人');
                        return false;
                    } else {
                        $scope.confirm($scope.viewModel.corporation);
                    }
                };
            }]);
    });