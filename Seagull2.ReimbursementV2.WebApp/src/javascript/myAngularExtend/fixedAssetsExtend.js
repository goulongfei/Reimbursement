define([
    'angular',
    'app'
], function (angular, app) { 
    //查询供应商
    app.directive("searchFixedAssets", function () {
        return {
            restrict: "AE",
            scope: {
                data: "=",
                opts: "=",
                index: "=",
                readOnly: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/searchFixedAssets.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.SelectFixedAssets = function () {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/fixedAssetsPurchaseGoods.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择采购明细', ["$scope", function ($modelScope) {
                            $modelScope.data = [];
                            $modelScope.model = {
                                pageIndex: 0,
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 8,
                                    totalItems: $scope.opts.fixedAssetsList.length,
                                },
                                confirm: function () {
                                    $modelScope.confirm(this.selectedItem);
                                },
                                selectedPage: function () {
                                    this.pageIndex = (this.paginationConf.currentPage - 1) * this.paginationConf.itemsPerPage
                                    if ($scope.readOnly !== true) {
                                        $modelScope.data = $scope.opts.fixedAssetsList
                                            .slice(this.pageIndex, this.pageIndex + this.paginationConf.itemsPerPage);
                                    } else {
                                        $modelScope.data = $scope.data.fixedAssetsPurchaseGoodsDetailInfoList;
                                        this.paginationConf.totalItems = $modelScope.data.length;
                                    }
                                }
                            };
                            $modelScope.$watch('model.paginationConf.currentPage', function () {
                                $modelScope.model.selectedPage();
                            });
                            $modelScope.model.selectedPage();

                        }], $scope, { containerStyle: { width: '70%', height: '600px', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.beforAppend($scope.index);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                $scope.RemoveFixedAssets = function () {
                    $scope.opts.beforClear($scope.index);
                };
            }],
            link: function ($scope, element, attrs) {
            }
        };
    });
});