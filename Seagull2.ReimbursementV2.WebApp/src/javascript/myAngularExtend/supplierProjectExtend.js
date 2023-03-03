define(['app'], function (app) {
    // 合作项目
    app.directive("supplierProject", function () {
        return {
            restrict: "A",
            scope: {
                opts: "=",
            },
            template: "<div style='height:25px;'><input class='meeting' id='inputProjectName' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"88%\"}' disabled ng-value='projectName' title='{{projectName}}'/>&nbsp;<i ng-if='!readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i>&nbsp;<i ng-if='!readOnly' ng-click='remove()' class='glyphicon glyphicon-remove' style='cursor:pointer;'></i></div>",
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting) {
                if (!$scope.single) {
                    $scope.single = false;
                }
                $scope.projectName = "";
                
                $scope.open = function () {
                    var codeList = [];
                    if ($scope.opts.cityList != null) {
                        for (var i = 0; i < $scope.opts.cityList.length; i++) {
                            codeList += $scope.opts.cityList[i].code + ';';
                        }
                    }

                    var viewPath = 'htmlTemplate/controlTemplate/common/supplierProject.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '', ["$scope", function ($modelScope) {
                            var url = seagull2Url.getPlatformUrlBase() + '/ProjectInfo/GetProjectByCityCodeList';
                            $modelScope.tempProjectCity = new Array();
                            // 是否展示树结构（这个不会作为查询条件）
                            $modelScope.isShowTree = true;
                            // 查询条件
                            $modelScope.queryCondition = {
                                projectCityCode: "",
                                projectCnName: "",
                                pageSize: 10,
                                pageIndex: 1,
                            };
                            $modelScope.paginationConf = {
                                currentPage: 1,
                                itemsPerPage: 10,
                                totalItems: 0
                            },
                            // 查询结果展示
                            $modelScope.queryResult = [];
                            // 查询触发
                            $modelScope.query = function () {
                                var getProjectListUrl = seagull2Url.getPlatformUrlBase() + "/ProjectInfo/QueryProjectInfomation";
                                $modelScope.queryResult = [];
                                // 点击查询清除树结构中选中的数据
                                $modelScope.tempProjectCity = [];
                                $modelScope.queryCondition.pageSize = $modelScope.paginationConf.itemsPerPage;
                                $modelScope.queryCondition.pageIndex = $modelScope.paginationConf.currentPage-1;
                                if ($modelScope.queryCondition.projectCnName != "") {
                                    $modelScope.isShowTree = false;
                                    wfWaiting.show();
                                    $http.post(getProjectListUrl, $modelScope.queryCondition)
                                           .success(function (data) {
                                               $modelScope.queryResult = data.projectInfomationData;
                                               $modelScope.paginationConf.totalItems = data.totalItems;
                                               wfWaiting.hide();
                                           }).error(function (data, status) {
                                               errorDialog.openErrorDialog(data, status, "查询项目数据异常");
                                               wfWaiting.hide();
                                           });
                                } else {
                                    $modelScope.isShowTree = true;
                                }

                            };
                            $modelScope.$watch('paginationConf.currentPage', function () {
                                $modelScope.query();
                            });
                            //初始化tree
                            $modelScope.selectProjectOpts = {
                                'rootName': '所属项目',
                                'root': codeList,
                                'serviceUrl': url,
                                'autoLoadRoot': true,
                                'showCheckboxes': true,
                                'nodeClick': function (e) {
                                    var nodeData = e.nodeData;
                                    if ($scope.single) {
                                        var data = { "code": nodeData.id, "name": nodeData.displayName };
                                        $modelScope.tempProjectCity.splice(0, $modelScope.tempProjectCity.length);
                                        $modelScope.tempProjectCity.push(data);
                                    } else {
                                        if (nodeData.checked) {
                                            if (nodeData.children != null) {
                                                $modelScope.eachTree(nodeData);
                                            }
                                            else {
                                                var data = { "code": nodeData.id, "name": nodeData.displayName };
                                                $modelScope.tempProjectCity.push(data);
                                            }
                                        }
                                        else {
                                            if (nodeData.children != null) {
                                                $modelScope.eachTree(nodeData);
                                            } else {
                                                for (var i = 0; i < $modelScope.tempProjectCity.length; i++) {
                                                    if ($modelScope.tempProjectCity[i].code == nodeData.id) {
                                                        $modelScope.tempProjectCity.splice(i, 1);
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
                                            $modelScope.tempProjectCity.push(data);
                                        }
                                        else {
                                            for (var i = 0; i < $modelScope.tempProjectCity.length; i++) {
                                                if ($modelScope.tempProjectCity[i].code == item.id) {
                                                    $modelScope.tempProjectCity.splice(i, 1);
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
                                if ($modelScope.isShowTree) { // 取树结构数据
                                    result = $modelScope.tempProjectCity;
                                } else {// 取查询列表数据
                                    angular.forEach($modelScope.queryResult, function (item) {
                                        if (item.isChecked) {
                                            result.push({
                                                code: item.projectCode,
                                                name: item.businessModelName+"-"+item.cnName
                                            });
                                        }
                                    });
                                }
                                if (result.length === 0) {
                                    sogModal.openAlertDialog("提示", "请选择项目！");
                                    return;
                                }
                                $modelScope.confirm(result);
                            };

                        }], $scope, { containerStyle: { } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                names = "";
                                for (var i = 0; i < v.length; i++) {
                                    var item = v[i];
                                    names += item.name + ",";
                                }
                                $scope.projectName = names.substring(0, names.length - 1);

                                $("#inputProjectName").val($scope.projectName);
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }
                //移除
                $scope.remove = function () {
                    var projectList = [];
                    $scope.projectName = "";
                    $("#inputProjectName").val($scope.projectName);
                    $scope.opts.beforAppend(projectList);
                }
            },
            link: function (scope, iElement, iAttr) {
                var width = !!iElement.width ? iElement.width() : iElement[0].clientWidth;
                iElement.children("input").css("width", (width - 28) + "px");
            }
        }
    });
})