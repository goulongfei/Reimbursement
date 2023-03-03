define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopTechnologyEvaluteTender_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                //基本信息
                $scope.baseInfo = {
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                    },
                    fileReady: true,
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'TechnologyEvaluteTender',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    //查找技术标
                    getSupplierReplyBiddingInfo: function (supplierCode) {
                        var supplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSubmitList.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSubmitList[i].supplierCode == supplierCode) {
                                supplierReplyBiddingInfo = $scope.viewModel.supplierReplyBiddingInfoSubmitList[i];
                                break;
                            }
                        }
                        return supplierReplyBiddingInfo;
                    }
                };
                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);

                    angular.forEach($scope.viewModel.technologyEvaluateBiddingInfoList, function (item) {
                        if (item.isQualified === "" || item.isQualified === null || item.isQualified === "null" || item.isQualified === undefined || item.isQualified === "undefined") {
                            modelStateDictionary.addModelError("技术评标信息", "供应商【" + item.supplierName + "】请选择是否合格");
                        }
                    });
                    if ($scope.viewModel.technologyEvaluateTenderFile.clientFileInformationList == null || $scope.viewModel.technologyEvaluateTenderFile.clientFileInformationList.length == 0) {
                        modelStateDictionary.addModelError("附件", "技术评标文件不能为空");
                    } else {
                        var count = 0;
                        angular.forEach($scope.viewModel.technologyEvaluateTenderFile.clientFileInformationList, function (file) {
                            if (!file.isDeleted) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            modelStateDictionary.addModelError("附件", "技术评标文件不能为空");
                        }
                    }

                    return modelStateDictionary;
                };
                var checkFileData = function () {
                    if (!$scope.baseInfo.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    return true;
                };
                //收集数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    if (checkFileData()) {
                        switch (e.operationType) {
                            case sogWfControlOperationType.MoveTo:
                                var result = validData();
                                if (!result.isValid()) {
                                    sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                    defer.reject($scope.viewModel);
                                } else {
                                    defer.resolve($scope.viewModel);
                                }
                                break;
                            case sogWfControlOperationType.Save:
                                defer.resolve($scope.viewModel);
                                break;
                            case sogWfControlOperationType.CancelProcess:
                                defer.resolve($scope.viewModel);
                                break;
                            case sogWfControlOperationType.Circulate:
                                defer.resolve($scope.viewModel);
                                break;
                            default:
                                defer.resolve(null);
                                break;
                        }
                    }
                };
            }]);
    });