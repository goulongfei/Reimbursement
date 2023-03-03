define([
    'angular',
    'app',
    'commonUtilExtend',
], function (angular, app) {

    //基础 opts
    app.factory("commissionBaseOpts", function () {
        function base() {
            this.corporationCode = "";
            this.corporationName = "";
            this.strategyPurchaseAgreementInfoCode = "";
            this.strategyPurchaseAgreementInfoName = "";
            this.beforAppend = function (v) { };
            this.beforDelete = function (v) { };
            this.refreshOpts = function (opts) { };//该方法接收当前的配置对象，可在这里从新修改该配置对象；
        }
        return {
            get: function (opts) {
                if (!angular.isObject(opts)) {
                    opts = {};
                }
                return angular.extend(new base(), opts);
            }
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
            }
        };
    });

    //战采协议
    app.directive("strategyPurchaseAgreementInfo", function () {
        return {
            restrict: 'A',
            template: "<div><input style='width:78%;' type='text' class='meeting' disabled ng-value='opts.strategyPurchaseAgreementInfoName' title='{{opts.strategyPurchaseAgreementInfoName}}' placeholder='请选择'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i>&nbsp<i ng-click='remove()' class='glyphicon glyphicon-remove' style='cursor: pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "=",
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, commissionBaseOpts, errorDialog) {
                $scope.opts = commissionBaseOpts.get($scope.opts);
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/strategyPurchaseAgreementInfoExtend.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择战采协议', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    strategyPurchaseAgreementInfoName: "",
                                    industryDomainName: "",
                                    supplierCode: "",
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                agreementInfoNameKeyWord: '',
                                industryDomainNameKeyWord: '',
                                selectedItem: null,
                                strategyPurchaseAgreementInfoList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                    this.selectedItem.strategyPurchaseAgreementInfoName = item.strategyPurchaseAgreementInfoName;
                                },

                                loadData: function (pageIndex) {
                                    this.queryCondition.strategyPurchaseAgreementInfoName = this.agreementInfoNameKeyWord;
                                    this.queryCondition.industryDomainName = this.industryDomainNameKeyWord;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData($modelScope.model.paginationConf.currentPage, false);
                                },
                                query: function () {
                                    this.queryCondition.strategyPurchaseAgreementInfoName = this.agreementInfoNameKeyWord;
                                    this.queryCondition.industryDomainName = this.industryDomainNameKeyWord;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData(1, false);
                                },
                                queryData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryStrategyPurchaseAgreementInfoByGroup"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.strategyPurchaseAgreementInfoList = data.strategyPurchaseAgreementInfo;
                                            wfWaiting.hide();
                                        })
                                        .error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询战采协议数据异常");
                                            wfWaiting.hide();
                                        });

                                },
                                clear: function () {
                                    //  this.supplierNameKeyWord = '';
                                    this.agreementInfoNameKeyWord = '';
                                    this.industryDomainNameKeyWord = '';
                                },
                                confirm: function () {
                                    if (this.selectedItem != null) {
                                        $modelScope.confirm(this.selectedItem);
                                    } else {
                                        sogModal.openAlertDialog("提示", "请选择一个战采协议");
                                    }

                                },
                            };
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '80%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                $scope.opts.beforAppend(v);
                                $scope.opts.strategyPurchaseAgreementInfoName = v.strategyPurchaseAgreementInfoName;
                                defer.resolve(v);//确定 
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };

                $scope.remove = function () {
                    $scope.opts.beforDelete();
                    $scope.opts.strategyPurchaseAgreementInfoName = "";
                };

            }
        };

    });
});