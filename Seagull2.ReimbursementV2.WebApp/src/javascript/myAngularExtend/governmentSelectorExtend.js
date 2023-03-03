define([
    'angular',
    'app'
], function (angular, app) {
    //基础 opts
    app.factory("rcBaseOpts", function () {
        function base() {
            this.title = "添加";//一般用于按钮的显示文字 
            this.code = "";//政府 code
            this.cnName = "";//政府 name  
            
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
    app.factory("apiUrl", function (sogModal) {
        return { 
            //选择政府控件
            rcGovSelector: {
                GetGovernments: "/Purchase/GetGovernmentInfos",
                //QueryProjectInfomation: "/ProjectInfo/QueryProjectInfomation"
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

    //选择政府(收款单位)
    app.directive("rcGovSelector", function () {
        return {
            restrict: 'A',
            template: "<div><input sog-valide-status='收款单位' type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='opts.governmentName' title='{{opts.governmentName}}' placeholder='请选择收款单位'/>&nbsp;<i ng-if='!opts.readOnly' ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                readOnly: "@"
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, rcBaseOpts, apiUrl, errorDialog) {
                $scope.opts = rcBaseOpts.get($scope.opts);
                if (!$scope.single) {
                    $scope.single = false;
                }
                $scope.opts.governmentName = $scope.opts.chargeUnitName || "";
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/selectGovernment.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择政府', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    keyWords: "",
                                    pageSize: 10,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 10,
                                    totalItems: 0
                                },
                                selectedItem: null,
                                governmentList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                    this.selectedItem.governmentName = item.cnName;
                                },
                                query: function () {
                                    this.queryCondition.keyWords = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.loadData(1, false);
                                },
                                loadData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl(apiUrl.rcGovSelector.GetGovernments), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.count;
                                            that.governmentList = data.governmentList;
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询项目数据异常");
                                            wfWaiting.hide();
                                        });
                                },
                                confirm: function () {
                                    if (this.valideStatus()) {
                                        $modelScope.confirm(this.selectedItem);
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
                                    var validatorFieldList = [{ key: '查询结果', attributeName: 'selectedItem', validator: new ModelRequiredValidator('请选择政府！') }];
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, validatorFieldList);
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
                        }], $scope, { containerStyle: {  } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.governmentName = v.governmentName;
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }


            }
        };
    });

});