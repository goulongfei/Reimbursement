define(
    [
        'app',
        'javascript/controllers/enterpriseCheck/beneficiaryDialog-controller.js'
    ],
    function (app) {
        app.controller('prepare_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate',
            '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url) {

                $scope.items = [
                    { companyName: "乐视体育文化产业发展(北京)有限公司" },
                    { companyName: "乐视财富(北京)信息技术有限公司" },
                    { companyName: "乐视控股(北京)有限公司" },
                    { companyName: "乐视移动智能信息技术(北京)有限公司" },
                    { companyName: "乐视影业(北京)有限公司" },
                    { companyName: "乐视云计算有限公司" },
                    { companyName: "深圳市乐视视频技术有限公司" }
                ]
                $scope.infors = [];
                $scope.getRealtionship = function () {
                    if ($scope.items.length <= 1) {
                        sogModal.openAlertDialog("提示", "最少选择两个公司");
                        return;
                    }
                    var url = seagull2Url.getPlatformUrl('/GetRelationShip') + '?r=' + Math.random();
                    var timeSpan = null;
                    var token = null;
                    var body = {
                        Timespan: timeSpan,
                        CompanyCollcetion: $scope.items,
                        Token: token,
                        PageIndex: 1,
                        PageSize: 10,
                        code: 4
                    };
                    wfWaiting.show();
                    $http.post(url, body).success(function (data) {
                        wfWaiting.hide();
                        $scope.infors = data.companyCollcetion;

                    })
                }

                //关联关系挖掘 companyName：公司名称(至少两家企业)
                $scope.showDetail = function (array) {
                    var str = "";
                    angular.forEach(array, function (item) {
                        str += item.companyName + ",";
                    })
                    str = str.substring(0, str.length - 1);
                    var url = "default.htm#/associationMining/" + str;
                    window.open(url, '_blank');
                }

                // 受益人详情
                $scope.beneficiaryIfor = function (item) {
                    var addr = "./views/enterpriseCheck/beneficiaryDialog.html";
                    var template = '<div ng-include="\'' + addr + '\'" ></div>';
                    var promise = sogModal.openDialog(template, "受益人详情", 'beneficiaryDialog_controller', $scope, { companyName: item.companyName });
                }

                //股东关系关联 companyName：相关公司(至少两家企业)
                $scope.showPersonDetail = function (array) {
                    var str = "";
                    angular.forEach(array, function (item) {
                        str += item.companyName + ",";
                    })
                    str = str.substring(0, str.length - 1);
                    var url = "default.htm#/legalAssociation/" + str;
                    window.open(url, '_blank');
                }

                //行政处罚风险：   companyName：公司名称 keyNo :公司内部关联主键KeyNo 
                $scope.monitoringReportDetail = function (item) {
                    var url = "default.htm#/monitoringReportDetail/" + item.companyName;
                    window.open(url, '_blank');
                }

            }]);
    });