define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("commissionBaseOpts", function () {
        function base() {
            this.corporationCode = "";
            this.corporationName = "";
            this.beforAppend = function (v) { };
            this.afterAppend = function (v) { };
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
    //选择法人公司(多选)
    app.directive("selectMultipleCorporation", function () {
        return {
            restrict: 'A',
            template: "<div><input sog-valide-status='招标人' style='width:88%;' type='text' class='meeting' disabled ng-value='opts.corporationName' title='{{opts.corporationName}}' placeholder='请选择招标人'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, commissionBaseOpts, errorDialog) {
                $scope.opts = commissionBaseOpts.get($scope.opts);
                angular.forEach($scope.data, function (item) {
                    if (item.corporationName != "") {
                        $scope.opts.corporationName += item.corporationName + ',';
                    }
                });
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/corproationInfoMultiSelect.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择法人公司', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    corporationCnName: "",
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                keyword: "",
                                selectedItemList: [],
                                corporationList: [],
                                isLoaded: false,
                                showPageing: true,
                                chooseItem: function (item) {
                                    if (item.checked === true) {
                                        var isExists = false;
                                        for (var i = 0; i < this.selectedItemList.length; i++) {
                                            if (this.selectedItemList[i].corporationCode === item.corporationCode) {
                                                isExists = true;
                                            }
                                        }
                                        if (isExists === false) {
                                            item.corporationCnName = item.cnName;
                                            this.selectedItemList.push(item);
                                        }
                                    }
                                    else {
                                        if (this.showPageing === false) {
                                            var promise = sogModal.openConfirmDialog("确认", "是否取消选择法人公司?");
                                            promise.then(function () {
                                                for (var i = $modelScope.model.selectedItemList.length - 1; i >= 0; i--) {
                                                    if ($modelScope.model.selectedItemList[i].corporationCode === item.corporationCode) {
                                                        $modelScope.model.selectedItemList.splice(i, 1);
                                                    }
                                                }
                                            }, function () {
                                                for (var i = $modelScope.model.selectedItemList.length - 1; i >= 0; i--) {
                                                    if ($modelScope.model.selectedItemList[i].corporationCode === item.corporationCode) {
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
                                loadData: function (pageIndex) {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.isLoaded = true;
                                    this.queryData($modelScope.model.paginationConf.currentPage, false);
                                },
                                query: function () {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.isLoaded = true;
                                    this.queryData(1, false);
                                },
                                showSelectList: function () {
                                    this.corporationList = this.selectedItemList;
                                    this.showPageing = false;
                                },
                                queryData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.showPageing = true;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryCorporationInfo"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.corporationList = [];
                                            for (var y = 0; y < data.corporationInfo.length; y++) {
                                                for (var i = 0; i < that.selectedItemList.length; i++) {
                                                    if (that.selectedItemList[i].corporationCode === data.corporationInfo[y].corporationCode) {
                                                        data.corporationInfo[y].checked = true;
                                                    }
                                                }
                                                that.corporationList.push(data.corporationInfo[y]);
                                            }
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询法人公司数据异常");
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
                                    var validatorFieldList = [{ key: '法人公司列表', attributeName: 'selectedItemList', validator: new ModelRequiredValidator('请选择法人公司！') }];
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, validatorFieldList);
                                    if (this.selectedItemList === null || this.selectedItemList.length === 0) {
                                        modelStateDictionary.addModelError('法人公司列表', '请选择法人公司！');
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
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.data = v;
                                $scope.opts.corporationName = "";
                                for (var i = 0; i < v.length; i++) {
                                    $scope.opts.corporationName += v[i].corporationName + ";";
                                }
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }


            }
        };
    });

})