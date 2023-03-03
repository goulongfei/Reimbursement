define(['angular', 'app'], function (angular, app) {
    //1-单输入
    app.directive("autoCompleteSingle", function () {
        return {
            restrict: 'A',
            scope: {
                opts: '='
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/autoComplete.html',
            replace: false,
            transclude: false,
            controller: function ($scope, $http, $templateCache, seagull2Url, sogModal, sogOguType) {
                $scope.data = {
                    dataList: angular.copy($scope.opts.dataList),
                    inputType: 1, 
                    searchStr: "",
                    searchList: [],
                    showDropdown: false
                };
                $scope.option = {
                    changShow: function () {
                        if ($scope.data.searchStr != "") {
                            $scope.data.searchList = [];
                            angular.forEach($scope.data.dataList, function (item) {
                                if (item.indexOf($scope.data.searchStr) !== -1) {
                                    $scope.data.searchList.push(item);
                                }
                            });
                        }
                    },
                    hideResults: function () {
                        $scope.data.showDropdown = false;
                    },
                    showResults: function () {
                        $scope.data.showDropdown = true;
                        $scope.option.changShow();
                        if ($scope.data.searchList.length <= 0) {
                            $scope.data.showDropdown = false;
                        }
                    },
                    keyPressed: function () {
                        $scope.option.changShow();
                    },
                    select: function (item) {
                        $scope.data.searchStr = item;
                        $scope.data.showDropdown = false;
                        $scope.opts.afterSelected(item);
                    }
                };
                //更改数据源
                $scope.$watch('opts.dataList', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.data.dataList = angular.copy($scope.opts.dataList);
                        $scope.data.searchStr = "";
                        $scope.option.keyPressed();
                    }
                }, true);
            }
        };
    });
    //2-是复合输入，包含code和name
    app.directive("autoCompleteMult", function () {
        return {
            restrict: 'A',
            scope: {
                opts: '=',
                str: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/autoComplete.html',
            replace: false,
            transclude: false,
            controller: function ($scope, $http, $templateCache, seagull2Url, sogModal, sogOguType) {
                $scope.data = {
                    dataList: angular.copy($scope.opts.dataList),
                    inputType: 2, 
                    searchStr: angular.copy($scope.opts.inintStr),
                    searchList: [],
                    showDropdown: false
                };
                $scope.option = {
                    isExtendShow: false,
                    changShow: function () {
                        $scope.str = angular.copy($scope.data.searchStr)
                        $scope.data.searchList = [];
                        if ($scope.data.dataList == null || $scope.data.dataList.length == 0) {
                            return;
                        }
                        if ($scope.data.searchStr != "") {
                            angular.forEach($scope.data.dataList, function (item) {
                                if (item.name.indexOf($scope.data.searchStr) !== -1) {
                                    $scope.data.searchList.push(item);
                                }
                            });
                        } else {
                            //如果没有输入，只是展示前10个
                            if ($scope.data.dataList.length > 5) {
                                for (var i = 0; i < 5; i++) {
                                    $scope.data.searchList.push($scope.data.dataList[i]);
                                }
                                $scope.option.isExtendShow = true;
                            } else {
                                $scope.data.searchList = $scope.data.dataList;
                                $scope.option.isExtendShow = false;
                            }
                        }
                    },
                    hideResults: function () {
                        $scope.data.showDropdown = false;
                    },
                    showResults: function () {
                        $scope.data.showDropdown = true;
                        $scope.option.changShow();
                        if ($scope.data.searchList.length <= 0) {
                            $scope.data.showDropdown = false;
                        }
                    },
                    keyPressed: function () {
                        $scope.option.changShow();
                    },
                    select: function (item) {
                        $scope.data.searchStr = item.name;
                        $scope.data.showDropdown = false;
                        $scope.opts.afterSelected(item);
                    }
                };
                //更改数据源
                $scope.$watch('opts.dataList', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.data.dataList = angular.copy($scope.opts.dataList);
                        $scope.data.searchStr = "";
                        $scope.option.keyPressed();
                    }
                }, true);
                //更改输入值
                $scope.$watch('data.searchStr', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.data.showDropdown = true;
                    }
                }, true);
            }
        };
    });
});


   
