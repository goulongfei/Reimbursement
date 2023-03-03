define(['app'], function (app) {
    // 供应商类别
    app.directive("supplierCategory", function () {
        return {
            restrict: "A",
            scope: {
                data: '=',
                opts: '=',
                readOnly: '=',
                ispurchasePlan: '=',
                single: '@',
                idname: '@',
            },
            //template: "<div style='height:25px;'><input class='meeting' id='inputSupplierCategoryName' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"88%\"}' disabled ng-value='traderAreasName' title='{{traderAreasName}}'/>&nbsp;<i ng-if='!readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            template: "<div style='height:25px;'><input class='meeting' id='{{idname}}' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"88%\"}' disabled ng-value='traderAreasName' title='{{traderAreasName}}'/>&nbsp;<i ng-if='!readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",

            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting) {
                if (!$scope.single || $scope.single === "false") {
                    $scope.single = false;
                }
                if (!$scope.idname || $scope.idname === "") {
                    $scope.idname = "inputSupplierCategoryName";
                }

                $scope.traderAreasName = "";
                var names = "";
                if ($scope.data) {
                    if ($scope.data.length > 0) {
                        angular.forEach($scope.data, function (item) {
                            names += item.industryDomainName + ",";
                        });
                        $scope.traderAreasName = names.substring(0, names.length - 1);
                    } else if ($scope.data.industryDomainName != undefined) {
                        $scope.traderAreasName = $scope.data.industryDomainName;
                    }
                }
                $scope.open = function () {
                    var viewPath = 'htmlTemplate/controlTemplate/common/supplierCategory.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '', ["$scope", function ($modelScope) {
                            var url = '/SupplierCategory/LoadChildren';
                            $modelScope.tempSupplierCategory = new Array();
                            if (!$scope.single || $scope.single === "false") {
                                $scope.single = false;
                            }
                            // 查询条件
                            $modelScope.condation = {
                                // 关键字
                                categoryName: "",
                                // 供应商名称
                                supplierName: "",
                                // 是否展示树结构（这个不会作为查询条件）
                                isShowTree: true
                            };
                            // 查询结果展示
                            $modelScope.queryResult = [];
                            // 查询触发
                            $modelScope.query = function (category) {
                                // category 取值： 
                                // categoryName 关键字查询
                                // supplierName 根据供应商查询
                                var url = seagull2Url.getPlatformUrlBase() + "/SupplierCategory/LoadChildrenByContext";
                                var params = {};
                                var cdt = $modelScope.condation;
                                $modelScope.queryResult = [];
                                // 点击查询清除树结构中选中的数据
                                $modelScope.tempSupplierCategory = [];
                                if (!!cdt[category] && !!cdt[category].trim()) {
                                    cdt.isShowTree = false;
                                    params[category] = cdt[category].trim();
                                    wfWaiting.show();
                                    $http({
                                        method: 'GET',
                                        url: url,
                                        params: params,
                                    })
                                        .success(function (data) {
                                            wfWaiting.hide();
                                            $modelScope.queryResult = data;
                                        })
                                        .error(function () {
                                            wfWaiting.hide();
                                            sogModal.openAlertDialog("提示", "查询异常，请稍后重试！");
                                        });
                                } else {
                                    cdt.isShowTree = true;
                                }
                            };
                            //初始化总体待分摊科目--包含科目 tree
                            $modelScope.dynamicOpts = {
                                'rootName': '',
                                'serviceUrl': seagull2Url.getPlatformUrl(url),
                                'queryKey': 'parentId',
                                'queryValueField': 'id',
                                'showCheckboxes': $scope.single ? false : true,
                                'autoLoadRoot': true,
                                'beforeAddChildren': function (e) {
                                    if (e.parent != null) {
                                        angular.forEach(e.children, function (item) {
                                            item.checked = e.parent.checked;
                                        });
                                    }
                                },
                                'nodeClick': function (e) {
                                    var nodeData = e.nodeData;
                                    if ($scope.single) {
                                        var data = { "code": nodeData.id, "name": nodeData.displayName };
                                        $modelScope.tempSupplierCategory.splice(0, $modelScope.tempSupplierCategory.length);
                                        $modelScope.tempSupplierCategory.push(data);
                                    } else {
                                        if (nodeData.checked) {
                                            if (nodeData.children != null) {
                                                $modelScope.eachTree(nodeData);
                                            }
                                            else {
                                                var data = { "code": nodeData.id, "name": nodeData.displayName };
                                                $modelScope.tempSupplierCategory.push(data);
                                            }
                                        }
                                        else {
                                            if (nodeData.children != null) {
                                                $modelScope.eachTree(nodeData);
                                            } else {
                                                for (var i = 0; i < $modelScope.tempSupplierCategory.length; i++) {
                                                    if ($modelScope.tempSupplierCategory[i].code == nodeData.id) {
                                                        $modelScope.tempSupplierCategory.splice(i, 1);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                            //遍历树形结构
                            $modelScope.eachTree = function (e) {
                                angular.forEach(e.children, function (item) {
                                    item.checked = e.checked;
                                    if (item.children != null) {
                                        $modelScope.eachTree(item);
                                    }
                                    else {
                                        if (e.checked) {
                                            var data = { "code": item.id, "name": item.displayName };
                                            $modelScope.tempSupplierCategory.push(data);
                                        }
                                        else {
                                            for (var i = 0; i < $modelScope.tempSupplierCategory.length; i++) {
                                                if ($modelScope.tempSupplierCategory[i].code == item.id) {
                                                    $modelScope.tempSupplierCategory.splice(i, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            // 确定
                            $modelScope.confirmHandler = function () {
                                var result = [];
                                if ($modelScope.condation.isShowTree) { // 取树结构数据
                                    result = $modelScope.tempSupplierCategory;
                                } else {// 取查询列表数据
                                    angular.forEach($modelScope.queryResult, function (item) {
                                        if (item.isChecked) {
                                            result.push({
                                                code: item.id,
                                                name: item.title
                                            });
                                        }
                                    });
                                }
                                if (result.length === 0) {
                                    sogModal.openAlertDialog("提示", "请选择行业领域！");
                                    return;
                                }
                                $modelScope.confirm(result);
                            };

                            // 选择查询后类别
                            $modelScope.selectItem = function (id) {
                                if (!$scope.single) { return; }
                                for (var i = 0; i < $modelScope.queryResult.length; i++) {
                                    var cate = $modelScope.queryResult[i];
                                    if (cate.id !== id && cate.isChecked) {
                                        cate.isChecked = false;
                                    }
                                }
                            };

                        }], $scope, { containerStyle: {} },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                var supplierCatagory = [];
                                names = "";
                                for (var i = 0; i < v.length; i++) {
                                    var item = v[i];
                                    names += item.name + ",";
                                    supplierCatagory.push({ 'industryDomainCode': item.code, 'industryDomainName': item.name });
                                }
                                if (!$scope.ispurchasePlan) {
                                    $scope.data = supplierCatagory;
                                }
                                $scope.traderAreasName = names.substring(0, names.length - 1);
                                if ($scope.ispurchasePlan) { }
                                else {
                                    if ($scope.idname != undefined && $scope.idname != "") {
                                        document.getElementById($scope.idname).value = $scope.traderAreasName;
                                    } else {
                                        $scope.idname = "inputSupplierCategoryName";
                                        $("#inputSupplierCategoryName").val($scope.traderAreasName);
                                    }
                                }
                                if ($scope.opts && typeof $scope.opts.beforAppend === 'function') {
                                    if ($scope.ispurchasePlan) {
                                        var tradeitem = {
                                            item: $scope.data,
                                            result: v
                                        }
                                        $scope.opts.beforAppend(tradeitem);
                                    }
                                    else
                                        $scope.opts.beforAppend(v);
                                }
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }
            },
            link: function (scope, iElement, iAttr) {
                var width = !!iElement.width ? iElement.width() : iElement[0].clientWidth;
                iElement.children("input").css("width", (width - 28) + "px");
            }
        }
    });
})