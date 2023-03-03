define(function (require) {
    var app = require('app');
    app.controller('supplierCategory_controller', [
        '$scope', '$http', '$stateParams', 'seagull2Url', 'wfWaiting', 'seagull2Url',
        function ($scope, $http, $stateParams, seagull2Url, wfWaiting, seagull2Url) {
            var selectCollection = [];

            $scope.dynamicCategoryOpts = {
                'rootName': '行业领域',
                'root': '2',
                'serviceUrl': seagull2Url.getPlatformUrlBase() + "/Purchase/LoadSupplierCategoryChildren",
                'autoLoadRoot': true,
                'showCheckboxes': true,
                'beforeAddChildren': function (e) {
                    angular.forEach(e.children, function (item) {
                        item.hasChildren = true;
                    })
                },
                'nodeClick': function (e) {
                    loadTreeModel(e);
                }
            };

            var loadTreeModel = function (e) {
                if (selectCollection.length == 0) {
                    selectCollection.push(e.nodeData);
                }
                var flag = true;
                angular.forEach(selectCollection, function (v) {
                    if (v.id == e.nodeData.id) {
                        flag = false;
                    }
                });
                if (flag) {
                    selectCollection.push(e.nodeData);
                }
            }

            $scope.SipplierCategoryAllOk = function () {
                if (selectCollection.length > 0) {
                    angular.forEach(selectCollection, function (item) {
                        if (item.checked) {
                            var reg = /^[05]{2}/;
                            var resCode = item.id.match(reg);
                            if (resCode != null) {
                                item.title = "远洋邦邦" + item.title;
                            }                  
                        }
                    })
                }
                $scope.confirm(selectCollection);
            }
        }]);
});



