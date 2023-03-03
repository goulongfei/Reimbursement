define(['app'], function (app) {
    // 项目城市
    app.directive("projectCity", function () {
        return {
            restrict: "A",
            scope: {
                opts: "=",
            },
            template: "<div style='height:25px;'><input class='meeting' id='inputProjectCityName' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"88%\"}' disabled ng-value='projectCityName' title='{{projectCityName}}'/></i>&nbsp;<i ng-if='!readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i>&nbsp;<i ng-if='!readOnly' ng-click='remove()' class='glyphicon glyphicon-remove' style='cursor:pointer;'></i></div>",
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting) {
                if (!$scope.single) {
                    $scope.single = false;
                }
                $scope.projectCityName = "";
                $scope.open = function () {
                    var viewPath = 'htmlTemplate/controlTemplate/common/supplierProjectCity.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '', ["$scope", function ($modelScope) {
                            var url = seagull2Url.getPlatformUrlBase()+'/ProjectInfo/FetchProjectCityList';
                            $modelScope.tempProject = new Array();
                            // 查询条件
                            $modelScope.condation = {
                                // 关键字
                                projectName: "",
                                // 是否展示树结构（这个不会作为查询条件）
                                isShowTree: true
                            };
                            // 查询结果展示
                            $modelScope.queryResult = [];
                           
                            // 查询触发
                            $modelScope.query = function (city) {
                                var getProjectListUrl = seagull2Url.getPlatformUrlBase() + "/ProjectInfo/LoadChildrenByContext";
                                var params = {};
                                var cdt = $modelScope.condation;
                                $modelScope.queryResult = [];
                                // 点击查询清除树结构中选中的数据
                                $modelScope.tempProject = [];
                                if (!!cdt[city] && !!cdt[city].trim()) {
                                    cdt.isShowTree = false;
                                    params[city] = cdt[city].trim();
                                    wfWaiting.show();
                                    $http({
                                        method: 'GET',
                                        url: getProjectListUrl,
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
                            //初始化tree
                            $modelScope.selectProjectCityOpts = {
                                'rootName': '可合作城市',
                                'serviceUrl': url,
                                'autoLoadRoot': true,
                                'showCheckboxes': true,
                                'nodeClick': function (e) {
                                    var nodeData = e.nodeData;
                                    if ($scope.single) {
                                        var data = { "code": nodeData.id, "name": nodeData.displayName };
                                        $modelScope.tempProject.splice(0, $modelScope.tempProject.length);
                                        $modelScope.tempProject.push(data);
                                    } else {
                                        if (nodeData.checked) {
                                            if (nodeData.children != null) {
                                                $modelScope.eachTree(nodeData);
                                            }
                                            else {
                                                var data = { "code": nodeData.id, "name": nodeData.displayName };
                                                $modelScope.tempProject.push(data);
                                            }
                                        }
                                        else {
                                            if (nodeData.children != null) {
                                                $modelScope.eachTree(nodeData);
                                            } else {
                                                for (var i = 0; i < $modelScope.tempProject.length; i++) {
                                                    if ($modelScope.tempProject[i].code == nodeData.id) {
                                                        $modelScope.tempProject.splice(i, 1);
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
                                            $modelScope.tempProject.push(data);
                                        }
                                        else {
                                            for (var i = 0; i < $modelScope.tempProject.length; i++) {
                                                if ($modelScope.tempProject[i].code == item.id) {
                                                    $modelScope.tempProject.splice(i, 1);
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
                                    result = $modelScope.tempProject;
                                } else {// 取查询列表数据
                                    angular.forEach($modelScope.queryResult, function (item) {
                                        if (item.isChecked) {
                                            result.push({
                                                code: item.id,
                                                name: item.displayName
                                            });
                                        }
                                    });
                                }
                                if (result.length === 0) {
                                    sogModal.openAlertDialog("提示", "请选择城市！");
                                    return;
                                }
                                $modelScope.confirm(result);
                            };

                        }], $scope, { containerStyle: {} },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                names = "";
                                for (var i = 0; i < v.length; i++) {
                                    var item = v[i];
                                    names += item.name + ",";
                                }
                                $scope.projectCityName = names.substring(0, names.length - 1);

                                $("#inputProjectCityName").val($scope.projectCityName);
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }
                //移除
                $scope.remove = function () {
                    $scope.projectCityName = "";
                    var cityList = [];
                    $("#inputProjectCityName").val($scope.projectCityName);
                    $scope.opts.beforAppend(cityList);
                }
            },
            link: function (scope, iElement, iAttr) {
                var width = !!iElement.width ? iElement.width() : iElement[0].clientWidth;
                iElement.children("input").css("width", (width - 28) + "px");
            }
        }
    });
})