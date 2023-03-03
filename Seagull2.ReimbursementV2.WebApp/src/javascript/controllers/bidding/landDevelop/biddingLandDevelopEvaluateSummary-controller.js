define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend',
        'dateTimePickerExtend'
    ],
    function (app) {
        app.controller('biddingLandDevelopEvaluateSummary_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }
                $scope.$broadcast('viewModel', { data: $scope.viewModel });
                //基本信息
                $scope.baseInfo = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "EvaluateSummary",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
                    fileReady: true,
                };
                //发起让利回复
                $scope.chargeGrant = function () {
                    wfOperate.refreshProcess('/BiddingLandDevelopEvaluteSummaryWf', $scope.currentActivityId, null, {
                        IsGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry
                    }).success(function (d) {
                    }).error(function (data, status) { });
                }; 
                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if ($scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry === null || $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry === "null") {
                        modelStateDictionary.addModelError("发放让利询价", "请选择是否发放让利询价");
                    }
                    //联系人电话
                    var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                    var regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,}$/;
                    if ($scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry === true) {
                        var isEmpty = true;
                        angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList,
                            function (v, i) {
                                var key = '第' + (i + 1) + '行供应商';

                                if (v.businessGrantDiscountEnquiryFileList != null && v.businessGrantDiscountEnquiryFileList.length > 0) {
                                    var fileCount = 0;
                                    angular.forEach(v.businessGrantDiscountEnquiryFileList,
                                        function (v, i) {
                                            if (v.isDeleted) {
                                                fileCount++;
                                            }
                                        });
                                    if (fileCount != v.businessGrantDiscountEnquiryFileList.length) {
                                        isEmpty = false;
                                        if (!v.linkPhone) {
                                            modelStateDictionary.addModelError("联系人电话", key + "联系人电话不能为空");
                                        }
                                        if (v.linkPhone && regPhoneNumber.test(v.linkPhone) === false) {
                                            modelStateDictionary.addModelError('联系人电话', key + '联系人电话格式不正确');
                                        }
                                        if (!v.linkEmail) {
                                            modelStateDictionary.addModelError("联系人邮箱", key + "联系人邮箱不能为空");
                                        }
                                        if (v.linkEmail && regEmail.test(v.linkEmail) === false) {
                                            modelStateDictionary.addModelError('联系人邮箱', key + '联系人邮箱格式不正确');
                                        }
                                    }
                                }
                                else {
                                    if (v.linkPhone) {
                                        if (v.businessGrantDiscountEnquiryFileList == null || v.businessGrantDiscountEnquiryFileList.length == 0) {
                                            modelStateDictionary.addModelError('让利文件', key + '请上传让利文件');
                                        }
                                        if (!v.linkEmail) {
                                            modelStateDictionary.addModelError('联系人邮箱', key + '联系人邮箱不能为空');
                                        }
                                    }

                                    if (v.linkEmail) {
                                        if (v.businessGrantDiscountEnquiryFileList == null || v.businessGrantDiscountEnquiryFileList.length == 0) {
                                            modelStateDictionary.addModelError('让利文件', key + '请上传让利文件');
                                        }
                                        if (!v.linkPhone) {
                                            modelStateDictionary.addModelError('联系人电话', key + '联系人电话不能为空');
                                        }
                                    }
                                }

                            });
                        if (isEmpty)
                            modelStateDictionary.addModelError("发放让利询价", "若选择了需要发放让利，至少要添加一条让利信息。");
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
                            default:
                                defer.resolve(null);
                                break;
                        }
                    }
                };

            }]);
    });