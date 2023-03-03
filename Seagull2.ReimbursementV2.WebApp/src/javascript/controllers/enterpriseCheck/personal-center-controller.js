define(
    [
        'app',
        'javascript/controllers/enterpriseCheck/beneficiaryDialog-controller.js'
    ],
    function (app) {
        app.controller('personal_center_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", "$templateCache", "oAuth",
            function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $templateCache, oAuth) {

                //关联关系挖掘 companyName：公司名称(至少两家企业)
                $scope.showDetail = function () {
                    var url = "default.htm#/associationMining/" + '苏州朗动网络科技有限公司,苏州知彼信息科技中心(有限合伙)';
                    window.open(url, '_blank');
                }

                // 受益人详情
                $scope.beneficiaryIfor = function () {
                    var addr = "./views/enterpriseCheck/beneficiaryDialog.html";
                    var template = '<div ng-include="\'' + addr + '\'" ></div>';
                    var promise = sogModal.openDialog(template, "受益人详情", 'beneficiaryDialog_controller', $scope, { companyName: '美的集团股份有限公司' });
                }

                //股东关系关联 companyName：相关公司(至少两家企业)
                $scope.showPersonDetail = function () {
                    var url = "default.htm#/legalAssociation/" + '苏州朗动网络科技有限公司,苏州知彼信息科技中心(有限合伙)';
                    window.open(url, '_blank');
                }

                //行政处罚风险：   companyName：公司名称 keyNo :公司内部关联主键KeyNo 
                $scope.monitoringReportDetail = function (item) {// '苏州朗动网络科技有限公司'/+'4659626b1e5e43f1bcad8c268753216e'
                    var url = "default.htm#/monitoringReportDetail/" + "苏州朗动网络科技有限公司" + "/" + "4659626b1e5e43f1bcad8c268753216e";
                    window.open(url, '_blank');
                }

            }]);
    });