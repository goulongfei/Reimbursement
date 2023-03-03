define(['app'], function (app) {
    // 选择合同
    app.directive("contract", function () {
        return {
            restrict: "A",
            scope: {
                data: '=',
                readOnly: '=',
                project: '=',
            },
            template: '<div><input style="width:82%;" type="text" readonly="readonly" class="meeting" title="{{data.contractName}}" ng-model="data.contractName" ng-readonly="true" />&nbsp;<span style="cursor: pointer;" ng-click="selectContract()"><i class="glyphicon glyphicon-folder-open"></i></span>&nbsp;<span style="cursor: pointer;" ng-click="removeContract()"><i class="glyphicon glyphicon-remove"></i></span></div>',
            replace: true,
            transclude: false,
            controller: function ($scope, $http, sogModal, errorDialog, wfWaiting, configure, sogOguType) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.selectContract = function () {
                    if (!$scope.project || !$scope.project.projectCode) {
                        if (angular.isArray($scope.project) === false || $scope.project.length === 0) {
                            sogModal.openAlertDialog("提示", "请先选择项目！");
                            return;
                        }
                    }

                    var viewPath = 'htmlTemplate/dialogTemplate/common/contractSelector.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择合同', ["$scope", function ($modelScope) {
                            if (angular.isArray($scope.project) === false) {
                                $scope.projectCode = $scope.project ? $scope.project.projectCode : "";
                            }
                            else {
                                $scope.projectCode = $scope.project.length === 1 ? $scope.project[0].projectCode : "";
                            }
                            $modelScope.model = {
                                queryCondition: {
                                    contractName: "",
                                    contractNo: "",
                                    operatorUserCode: "",
                                    projectCode: "",
                                    pageSize: 8,
                                    currentIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 8,
                                    totalItems: 0
                                },
                                //单选人员
                                peopleSelect: {
                                    selectMask: sogOguType.User,
                                    multiple: false
                                },
                                selectedItem: null,
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                    this.selectedItem.contractName = item.contractName;
                                },
                                query: function () {
                                    this.queryCondition.projectCode = $scope.project ? $scope.project.projectCode : "";
                                    this.queryCondition.contractName = this.contractName;
                                    this.queryCondition.contractNo = this.contractNo;
                                    this.queryCondition.operatorUserCode = this.operatorUser ? this.operatorUser.id : "";
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.loadData(1);
                                },
                                loadData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.queryCondition.pageIndex = pageIndex;
                                    var url = $scope.common.apiUrlBase + "/THRWebApi/ContractV2/Tender/SearContract";
                                    $http.post(url, that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalCount;
                                            that.list = data.contract;
                                            this.isLoaded = true;
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询合同数据异常");
                                            wfWaiting.hide();
                                        });
                                },
                                confirm: function () {
                                    $modelScope.confirm(this.selectedItem);
                                },
                                reset: function () {
                                    this.contractName = "";
                                    this.contractNo = "";
                                    this.operatorUser = null;
                                },
                            };

                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded === true && newVal !== oldVal) {
                                    $modelScope.model.loadData(newVal);
                                }
                            });
                        }], $scope, { containerStyle: { width: '70%' } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.data = v;
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }

                $scope.removeContract = function () {
                    $scope.data = null;
                }
            },
            link: function (scope, iElement, iAttr) {
            }
        }
    });
})