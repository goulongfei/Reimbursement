define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("rcBaseOpts", function () {
        function base() {
            this.title = "添加";//一般用于按钮的显示文字  
            this.projectName = "";//项目 name   
            this.beforAppend = function (v) { };
            this.refreshOpts = function (opts) { };//该方法接收当前的配置对象，可在这里从新修改该配置对象；
        }
        return {
            get: function (opts) {
                if (!angular.isObject(opts)) {
                    opts = {};
                }
                return angular.extend(new base(), opts);
            }
        }
    });
    //该文件指令全部所需Api服务
    app.factory("baseApi", function (sogModal) {
        return {
            //选择项目控件
            rcSelectProject: {
                GetProjectCitys: "/ProjectInfo/GetProjectCitys",
                QueryProjectInfomation: "/ProjectInfo/QueryProjectInfomation"
            },
        };
    });
    //错误提示框
    app.factory("errorDialog", function (sogModal) {
        return {
            //请求出现错误调用的提示框
            openErrorDialog: function (data, status, msg) {
                sogModal.openErrorDialog({
                    message: msg,
                    exceptionMessage: status,
                    stackTrace: data || msg
                });
            },
            //请求出现错误调用的提示框 Notice
            openErrorNotice: function (data, status, msg) {
                sogModal.openErrorNotice({
                    message: msg,
                    exceptionMessage: status,
                    stackTrace: data || msg
                });
            }
        };
    });

    //选择项目
    app.directive("selectMultipleProject", function () {
        return {
            restrict: 'A',
            template: "<div style='height:25px;'><input type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='opts.projectName' title='{{opts.projectName}}' placeholder='请选择项目名称'/>&nbsp;<i ng-if='!opts.readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, rcBaseOpts, baseApi, errorDialog) {
                $scope.opts = rcBaseOpts.get($scope.opts);
                if (!$scope.single) {
                    $scope.single = false;
                }
                $scope.opts.projectName = '';
                angular.forEach($scope.data, function (item) {
                    if (item.projectName!="") {
                        $scope.opts.projectName += item.projectName + ',';
                    }
                });
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/selectMultipleProjectTemp.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择项目', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    projectCityCode: "",
                                    projectCnName: "",
                                    pageSize: 10,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 10,
                                    totalItems: 0
                                },
                                cityCode: "",
                                keyword: "",
                                selectedItemList: [],
                                cityList: [{ code: "", name: "请选择" }],
                                projectList: [],
                                isLoaded: false,
                                showPageing: true,
                                chooseItem: function (item) {
                                    if (item.checked === true) {
                                        var isExists = false;
                                        for (var i = 0; i < this.selectedItemList.length; i++) {
                                            if (this.selectedItemList[i].projectCode === item.projectCode) {
                                                isExists = true;
                                            }
                                        }
                                        if (isExists === false) {
                                            item.projectName = item.cnName;
                                            this.selectedItemList.push(item);
                                        }
                                    }
                                    else {
                                        if (this.showPageing === false) {
                                            var promise = sogModal.openConfirmDialog("确认", "是否取消选择项目?");
                                            promise.then(function () {
                                                for (var i = $modelScope.model.selectedItemList.length - 1; i >= 0; i--) {
                                                    if ($modelScope.model.selectedItemList[i].projectCode === item.projectCode) {
                                                        $modelScope.model.selectedItemList.splice(i, 1);
                                                    }
                                                }
                                            }, function () {
                                                for (var i = $modelScope.model.selectedItemList.length - 1; i >= 0; i--) {
                                                    if ($modelScope.model.selectedItemList[i].projectCode === item.projectCode) {
                                                        $modelScope.model.selectedItemList[i].checked = true;
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            for (var i = this.selectedItemList.length - 1; i >= 0; i--) {
                                                if (this.selectedItemList[i].projectCode === item.projectCode) {
                                                    $modelScope.model.selectedItemList.splice(i, 1);
                                                }
                                            }
                                        }
                                    }
                                },
                                query: function () {
                                    this.queryCondition.projectCityCode = this.cityCode;
                                    this.queryCondition.projectCnName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.isLoaded = true;
                                    this.loadData(1, false);
                                },
                                showSelectList: function () {
                                    this.projectList = this.selectedItemList;
                                    this.showPageing = false;
                                },
                                loadData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.showPageing = true;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl(baseApi.rcSelectProject.QueryProjectInfomation), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.projectList = [];
                                            for (var y = 0; y < data.projectInfomationData.length; y++) {
                                                for (var i = 0; i < that.selectedItemList.length; i++) {
                                                    if (that.selectedItemList[i].projectCode === data.projectInfomationData[y].projectCode) {
                                                        data.projectInfomationData[y].checked = true;
                                                    }
                                                }
                                                that.projectList.push(data.projectInfomationData[y]);
                                            }
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询项目数据异常");
                                            wfWaiting.hide();
                                        });
                                },
                                confirm: function () {
                                    if (this.valideStatus()) {
                                        $modelScope.confirm(this.selectedItemList);
                                    }
                                },
                                //校验
                                valideStatus: function () {
                                    //自定义校验
                                    var ModelRequiredValidator = (function () {
                                        return function (message) {
                                            this.validateData = function (value, name, validationContext) {
                                                if (value === null || value === undefined || value === "") {
                                                    ValidateHelper.updateValidationContext(validationContext, name, message);
                                                    return false;
                                                }
                                                return true;
                                            };
                                        };
                                    }());
                                    //校验字段列表
                                    var validatorFieldList = [{ key: '项目列表', attributeName: 'selectedItemList', validator: new ModelRequiredValidator('请选择项目！') }];
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, validatorFieldList);
                                    if (this.selectedItemList === null || this.selectedItemList.length === 0) {
                                        modelStateDictionary.addModelError('项目列表', '请选择项目！');
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                }
                            };

                            getCities();
                            function getCities() {
                                wfWaiting.show();
                                $http.get(seagull2Url.getPlatformUrl(baseApi.rcSelectProject.GetProjectCitys) + '?r=' + Math.random(), { cache: false })
                                    .success(function (data) {
                                        if (angular.isArray(data)) {
                                            $modelScope.model.cityList = data;
                                            $modelScope.model.cityCode = data[0].code;
                                        }
                                        wfWaiting.hide();
                                    })
                                    .error(function (data, status) {
                                        errorDialog.openErrorDialog(data, status, "查询城市数据异常");
                                        wfWaiting.hide();
                                    });
                            }
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '50%' } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定 
                                $scope.data = v;
                                $scope.opts.projectName = '';
                                angular.forEach(v, function (item) {
                                    $scope.opts.projectName += item.projectName + ',';
                                });
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }


            }
        };
    });

});