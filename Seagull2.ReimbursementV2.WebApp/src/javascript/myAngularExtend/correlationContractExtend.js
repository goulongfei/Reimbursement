define(['app'], function (app) {
    // 选择合同
    /*
     opts = {
        projectCode: "", // 项目编码
        contract: "", // 合同名称 contract = { contractName: "", contractCode: "" }
    };
     */
    app.directive("correlationContractExtend", function () {
        return {
            restrict: "A",
            scope: {
                opts: '=',
            },
            template: '<div><input style="width:80%;" type="text" class="meeting" title="{{opts.contract.contractName}}" ng-model="opts.contract.contractName" ng-readonly="true" />&nbsp;<span style="cursor: pointer;" ng-click="openContractModal()"><i class="glyphicon glyphicon-folder-open"></i></span>&nbsp;<span style="cursor: pointer;" ng-click="removeContract()"><i class="glyphicon glyphicon-remove"></i></span></div>',
            replace: true,
            transclude: false,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                // 清空合同
                $scope.removeContract = function () {
                    $scope.opts.contract.contractName = "";
                    $scope.opts.contract.contractCode = "";
                }; 
                // 打开合同选择框
                $scope.openContractModal = function () {
                    var opts = $scope.opts;
                    if (!opts.projectCode || !opts.projectCode.trim()) {
                        sogModal.openAlertDialog("提示", "缺少项目编码");
                        return;
                    };
                    var viewPath = 'htmlTemplate/dialogTemplate/common/correlationContractTemp.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    sogModal.openDialog(template, '关联合同', ["$scope", function ($modelScope) {
                        $modelScope.model = {
                            //合同查询结果列表
                            contractList: [],
                            //查询条件
                            condition: {
                                // 项目编码
                                projectCode: opts.projectCode,
                                // 合同名称 
                                contractName: "",
                                // 合同号
                                contractNo: "",
                                // 经办人  
                                operatorUser: null
                            },
                            // 分页配置
                            paginationConf: {
                                currentPage: 1,
                                itemsPerPage: 10,
                                totalItems: 0
                            },
                            // 选中合同
                            selectedItem: null
                        };
                        // 选择操作
                        $modelScope.chooseItem = function (item) {
                            $modelScope.model.selectedItem = item;
                        };
                        // 查询操作
                        $modelScope.query = function () {
                            load();
                        };
                        // 重置操作
                        $modelScope.reset = function () {
                            var cdt = $modelScope.model.condition;
                            cdt.contractName = "";
                            cdt.contractNo = "";
                            cdt.operatorUser = null;
                            load();
                        };
                        // 确认
                        $modelScope.confirmHandler = function () {
                            var model = $modelScope.model;
                            if (!model.selectedItem) {;
                                sogModal.openAlertDialog("提示", "请选择合同");
                            }
                            $modelScope.confirm(model.selectedItem);
                        };
                        //分页监控
                        $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                            load();
                        });

                        // 加载数据
                        function load() {
                            var url = $scope.common.apiUrlBase + "/THRWebApi/ContractV2/Tender/SearContract";
                            var model = $modelScope.model;
                            var cdt = model.condition;
                            var pconf = model.paginationConf;
                            var data = {
                                projectCode:      cdt.projectCode,
                                contractName:     cdt.contractName,
                                operatorUserCode: cdt.operatorUser ? cdt.operatorUser.id : "",
                                contractNo:       cdt.contractNo,
                                currentIndex:     pconf.currentPage,
                                pageSize:         pconf.itemsPerPage
                            };
                            $http.post(url, data)
                                .success(function (data) {
                                    pconf.totalItems = data.totalCount;
                                    model.contractList = data.contract;
                                    wfWaiting.hide();
                                }).error(function (data, status) {
                                    sogModal.openAlertDialog("提示", "查询出现异常，请稍后重试！");
                                    wfWaiting.hide();
                                });
                        };
                }], $scope, { containerStyle: { width: '70%' } },
                    function (v, defer) {//50%
                        defer.resolve(v);//确定
                        $scope.opts.contract = v;
                    }, function (v, defer) {
                        defer.resolve(v);//取消
                    });
                }
            }/*End*/
        }
    });
})