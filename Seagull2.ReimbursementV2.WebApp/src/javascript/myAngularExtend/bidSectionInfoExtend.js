define([
    'angular',
    'app',
    'selectBidExtend',
    'commonUtilExtend',
    'fileDownExtend',
    'glodonFileExtend'
], function (angular, app) {
    // 标段信息
    app.directive("bidSectionInfo", function () {
        return {
            restrict: "AE",
            scope: {
                data: '=',
                readOnly: '=',
                opts: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/bidSectionInfo.html',
            replace: false,
            transclude: false,
            controller: function ($scope, sogModal, ValidateHelper, sogValidator, sogModal, rcTools, configure, $window) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.editIndex = null;
                $scope.biddingOrEnquiry = !$scope.opts.biddingOrEnquiry ? "招标" : $scope.opts.biddingOrEnquiry;
                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                $scope.linkOpt = {
                    id: "",
                    extraName: "",
                    type: 2,
                }
                var scene = $scope.opts.scene;
                var readOnly = $scope.readOnly;
                //  拟单添加
                $scope.addDetail = function () {
                    //  验证是否选择招标清单
                    if ($scope.opts.scene == "Draft" && ($scope.opts.isUsedTenderFile == null || $scope.opts.isUsedTenderFile == undefined) && $scope.opts.catalogId == 1) {
                        sogModal.openAlertDialog("提示", "请先选择是否使用招标清单！");
                        return;
                    };
                    scene = "Draft";
                    readOnly = false;
                    $scope.editDetail(-1, null);
                };
                // 拟单只读
                $scope.showDetail = function (index, item) {
                    scene = "Draft";
                    readOnly = true;
                    $scope.editDetail(index, item);
                };
                // 回复情况查看
                $scope.editIssueBiddingDocumentDetail = function (index, item) {
                    scene = "IssueBiddingDocument";
                    readOnly = false;
                    $scope.editDetail(index, item);
                };
                // 回复情况查看
                $scope.showInviteReplyDetail = function (index, item) {
                    scene = "IssueBiddingDocument";
                    readOnly = true;
                    $scope.editDetail(index, item);
                };
                // 答疑编辑
                $scope.editAnswerDetail = function (index, item) {
                    scene = "Answer";
                    readOnly = false;
                    $scope.editDetail(index, item);
                };
                // 答疑查看
                $scope.showAnswerDetail = function (index, item) {
                    scene = "Answer";
                    readOnly = true;
                    $scope.editDetail(index, item);
                };
                // 回标情况查看
                $scope.showReplyDetail = function (index, item) {
                    scene = "OpenTender";
                    readOnly = true;
                    $scope.editDetail(index, item);
                };
                // 标段信息查看
                $scope.showApprovalDetail = function (index, item) {
                    scene = "Approval";
                    readOnly = true;
                    $scope.editDetail(index, item);
                };
                // 商务清标查看
                $scope.showBusinessClarigyDetail = function (index, item) {
                    scene = "BusinessClarigy";
                    readOnly = true;
                    $scope.editDetail(index, item, "商务清标回标信息-招标文件");
                };
                // 技术清标查看
                $scope.showTechnologyClarigyDetail = function (index, item) {
                    scene = "TechnologyClarigy";
                    readOnly = true;
                    $scope.editDetail(index, item, "技术清标回标信息-招标文件");
                };
                // 商务评标回标信息编辑
                $scope.editBusinessEvaluateDetail = function (index, item) {
                    scene = "BusinessEvaluate";
                    readOnly = false;
                    $scope.editDetail(index, item, "商务评标回标信息-招标文件");
                };
                // 商务评标回标信息查看
                $scope.showBusinessEvaluateDetail = function (index, item) {
                    scene = "BusinessEvaluate";
                    readOnly = true;
                    $scope.editDetail(index, item, "商务评标回标信息-招标文件");
                };
                // 技术评标回标信息编辑
                $scope.editTechnologyEvaluateDetail = function (index, item) {
                    scene = "TechnologyEvaluate";
                    readOnly = false;
                    $scope.editDetail(index, item, "技术评标回标信息-招标文件");
                };
                // 技术评标回标信息
                $scope.showTechnologyEvaluateDetail = function (index, item) {
                    scene = "TechnologyEvaluate";
                    readOnly = true;
                    $scope.editDetail(index, item, "技术评标回标信息-招标文件");
                };
                // 标段成本目标
                $scope.editBidCostTargetDetail = function (index, item) {
                    scene = "AwardBidCostTarget";
                    readOnly = false;
                    $scope.editDetail(index, item, "编辑标段成本目标");
                };
                // 标段成本目标
                $scope.showBidCostTargetDetail = function (index, item) {
                    scene = "AwardBidCostTarget";
                    readOnly = true;
                    $scope.editDetail(index, item, "编辑标段成本目标");
                };
                // 中标信息
                $scope.editWinBiddingDetail = function (index, item) {
                    scene = "AwardWinBidding";
                    readOnly = false;
                    $scope.editDetail(index, item, "编辑中标信息");
                };
                // 中标信息
                $scope.showWinBiddingDetail = function (index, item) {
                    scene = "AwardWinBidding";
                    readOnly = true;
                    $scope.editDetail(index, item, "中标信息");
                };
                // 定标结论
                $scope.editAwardBiddingDetail = function (index, item) {
                    scene = "AwardBiddingDetail";
                    readOnly = false;
                    $scope.editDetail(index, item, "编辑定标结论");
                };
                // 编辑
                $scope.editDetail = function (index, item, title) {
                    $scope.editIndex = index;
                    var currentItem = JSON.parse(JSON.stringify(item));
                    if (currentItem != null && currentItem.glodonTenderListInfo != null) {
                        $scope.linkOpt.id = currentItem.glodonTenderListInfo.fileId;
                        $scope.linkOpt.extraName = currentItem.glodonTenderListInfo.fileName;
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/bidSectionInfoDetail.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, title ? title : '标段信息', ["$scope", "wfWaiting", "$http", "seagull2Url", "sogModal", "rcTools",
                            function ($modelScope, wfWaiting, $http, seagull2Url, sogModal, rcTools) {
                                $modelScope.model = {
                                    readOnly: readOnly,
                                    scene: scene,
                                    isNeedAgreement: $scope.opts.isNeedAgreement,
                                    projectList: $scope.opts.projectList,
                                    currentItem: currentItem,
                                    biddingOrEnquiry: $scope.biddingOrEnquiry,
                                    confirm: function () {
                                        if ($modelScope.model.scene === "Draft" && valideStatus()) {
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "IssueBiddingDocument" && valideStatus()) {
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "Answer" && valideStatusAnswer()) {
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "BusinessEvaluate" && valideStatusBusinessEvaluate()) {
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "TechnologyEvaluate" && valideStatusTechnologyEvaluate()) {
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "AwardBidCostTarget" && valideStatusAwardBidCostTarget()) {
                                            // 汇总成本目标
                                            this.currentItem.biddingCostTargetAmount = 0;
                                            if (angular.isArray(currentItem.biddingSectionContractAgreementScopeInfoList)) {
                                                for (var i = 0; i < currentItem.biddingSectionContractAgreementScopeInfoList.length; i++) {
                                                    var scope = currentItem.biddingSectionContractAgreementScopeInfoList[i];
                                                    if (angular.isNumber(scope.splitToBiddingSectionCostTargetAmount)) {
                                                        this.currentItem.biddingCostTargetAmount += scope.splitToBiddingSectionCostTargetAmount;
                                                    }
                                                }
                                            }
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "AwardWinBidding" && valideStatusAwardWinBidding()) {
                                            // 中标信息	
                                            this.currentItem.biddingTotalPrice = 0;
                                            this.currentItem.biddingSupplierNames = '';
                                            if (angular.isArray(currentItem.supplierBiddingSectionList)) {
                                                for (var i = 0; i < currentItem.supplierBiddingSectionList.length; i++) {
                                                    var scope = currentItem.supplierBiddingSectionList[i];
                                                    if (scope.isWinTheBidding && angular.isNumber(scope.lastReplyBiddingAmount)) {
                                                        this.currentItem.biddingTotalPrice += scope.lastReplyBiddingAmount;
                                                    }
                                                    if (scope.isWinTheBidding && scope.supplierName) {
                                                        this.currentItem.biddingSupplierNames += scope.supplierName + '；';
                                                    }
                                                }
                                            }
                                            $modelScope.confirm(this.currentItem);
                                        }
                                        else if ($modelScope.model.scene === "AwardBiddingDetail" && valideStatusAwardBiddingDetail()) {
                                            $modelScope.confirm(this.currentItem);
                                        }
                                    },
                                    businessEvaluateSort: [],
                                    projectCode: '',
                                    queryCondition: {
                                    },
                                    init: function () {
                                        if ($modelScope.model.scene === "AwardBidCostTarget") {
                                            initContractAgreementScopeList();
                                        }
                                    }
                                };

                                $modelScope.setting = {
                                    // 招标清单
                                    tenderFileOpts: {
                                        projectList: $scope.opts.projectList,
                                        stageAreaList: $scope.opts.stageAreaList,
                                        catalogId: $scope.opts.catalogId,
                                        scene: $scope.opts.scene,
                                        isUsedTenderFile: $scope.opts.isUsedTenderFile,
                                        resourceID: $scope.opts.resourceID,
                                        fileId: ($modelScope.model.currentItem == null || $modelScope.model.currentItem.glodonTenderListInfo == null) ? null : $modelScope.model.currentItem.glodonTenderListInfo.fileId,
                                        fileName: ($modelScope.model.currentItem == null || $modelScope.model.currentItem.glodonTenderListInfo == null) ? null : $modelScope.model.currentItem.glodonTenderListInfo.fileName,
                                        beforAppend: function (glodonFile) {
                                            if ($modelScope.model.currentItem == null) {
                                                sogModal.openAlertDialog("提示", "请先填写标段名称！");
                                                return false;
                                            }
                                            if ($scope.data != null && $scope.data.length > 0) {
                                                var isRepeat = false;
                                                angular.forEach($scope.data, function (bidSection, index) {
                                                    if (bidSection.glodonTenderListInfo != null && bidSection.glodonTenderListInfo.fileId == glodonFile.fileId)
                                                        isRepeat = true;
                                                });
                                                if (isRepeat) {
                                                    sogModal.openAlertDialog("提示", glodonFile.fileName + "已在其他标段使用，请重新选择！");
                                                    return false;
                                                }
                                            }
                                            $modelScope.setting.tenderFileOpts.fileId = glodonFile.fileId;
                                            $modelScope.setting.tenderFileOpts.fileName = glodonFile.fileName;
                                            $modelScope.model.currentItem.glodonTenderListInfo = glodonFile;
                                            return true;
                                        },
                                        deleteAppend: function () {
                                            if ($modelScope.model.currentItem != null) {
                                                if ($scope.data != null && $scope.data.length > 0) {
                                                    angular.forEach($scope.data, function (bidSection, index) {
                                                        if (bidSection.glodonTenderListInfo != null && bidSection.glodonTenderListInfo.fileId == $modelScope.setting.tenderFileOpts.fileId)
                                                            bidSection.glodonTenderListInfo = null;
                                                    });
                                                }
                                                $modelScope.model.currentItem.glodonTenderListInfo = null;
                                                $modelScope.setting.tenderFileOpts.fileId = "";
                                                $modelScope.setting.tenderFileOpts.fileName = "";
                                                
                                            }
                                        }
                                    }
                                }

                                // 日期控件选项
                                $modelScope.dateOpts = {
                                    format: 'yyyy-mm-dd',
                                    selectYears: true
                                };

                                // 附件设置项
                                $modelScope.fileOpts = {
                                    'auto': true,
                                    'preview': false,
                                    'fileNumLimit': 0
                                };

                                // 数字控件
                                $modelScope.moneyOpts = {
                                    min: 0,
                                    max: 100000000000,
                                    precision: 2
                                };

                                //一键清标配置
                                $modelScope.analyzeOpt = {
                                    id: $modelScope.model.currentItem != null ? $modelScope.model.currentItem.projectAnalyzeID : null,
                                    extraName: "一键清标",
                                    type: 3,
                                };

                                if ($scope.opts && !$scope.readOnly) {
                                    // 选择标段设置项
                                    $modelScope.selectBidOpts = {
                                        'projectList': $scope.opts.projectList,
                                        'stageAreaList': $scope.opts.stageAreaList,
                                    };
                                    // 招标补充说明
                                    if ($modelScope.model.currentItem && angular.isArray($modelScope.model.currentItem.supplementFileList) === false) {
                                        $modelScope.model.currentItem.supplementFileList = [];
                                    }
                                };
                                $modelScope.numberToChinese = function (round) {
                                    return rcTools.numberToChinese(round);
                                };

                                // 商务评标排名
                                if ($modelScope.model.currentItem) {
                                    angular.forEach($modelScope.model.currentItem.businessEvaluateBiddingInfoList, function (item, index) {
                                        $modelScope.model.businessEvaluateSort.push(index + 1);
                                    });
                                }
                                // 添加标段信息时校验
                                valideStatus = function () {
                                    // 自定义校验器-判断字符长度
                                    var stringMaxLengthValidator = (function () {
                                        return function (maxlength, message) {
                                            this.validateData = function (value, name, validationContext) {
                                                if (value && value.length > maxlength) {
                                                    ValidateHelper.updateValidationContext(validationContext, name, message);
                                                    return false;
                                                }
                                                return true;
                                            };
                                        };
                                    }());
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段名称', attributeName: 'currentItem.biddingSectionName', validator: new RequiredValidator('不能为空！') },
                                        { key: '标段名称', attributeName: 'currentItem.biddingSectionName', validator: new stringMaxLengthValidator(100, "不能大于100个字符！") },
                                        { key: '本标段拟开工日期', attributeName: 'currentItem.perStartWorkDate', validator: new RequiredValidator('不能为空！') },
                                        { key: '本标段拟竣工日期', attributeName: 'currentItem.perCompletedDate', validator: new RequiredValidator('不能为空！') },
                                        { key: '本标段招标内容和范围', attributeName: 'currentItem.biddingSectionContent', validator: new RequiredValidator('不能为空！') },
                                        { key: '本标段招标内容和范围', attributeName: 'currentItem.biddingSectionContent', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符！")}
                                    ]);
                                    if (($modelScope.model.currentItem == null || $modelScope.model.currentItem.glodonTenderListInfo == null || !$modelScope.model.currentItem.glodonTenderListInfo.fileId) && $scope.opts.isUsedTenderFile == true) {
                                        modelStateDictionary.addModelError('选择招标清单', '不能为空！');
                                    }
                                    if ($modelScope.model.currentItem) {
                                        for (var i = 0; i < $scope.data.length; i++) {
                                            if ($scope.editIndex !== -1 && $scope.editIndex !== i
                                                && $modelScope.model.currentItem.biddingSectionName === $scope.data[i].biddingSectionName) {
                                                modelStateDictionary.addModelError('标段名称', $modelScope.model.currentItem.biddingSectionName + '已存在！');
                                            }
                                        }
                                        if (($modelScope.model.currentItem.perStartWorkDate)
                                            && ($modelScope.model.currentItem.perCompletedDate)) {
                                            if ($modelScope.model.currentItem.perCompletedDate <= $modelScope.model.currentItem.perStartWorkDate) {
                                                modelStateDictionary.addModelError('本标段拟竣工日期', '拟竣工日期必须大于本标段拟开工日期！');
                                            }
                                        }
                                        // 招标文件
                                        var fileUploaded = false;
                                        if ($modelScope.model.currentItem.inviteDidFileList && angular.isArray($modelScope.model.currentItem.inviteDidFileList)) {
                                            for (var i = 0; i < $modelScope.model.currentItem.inviteDidFileList.length; i++) {
                                                var item = $modelScope.model.currentItem.inviteDidFileList[i];
                                                if (item.uploaded === true && item.isDeleted !== true) {
                                                    fileUploaded = true;
                                                }
                                            }
                                        }
                                        if (fileUploaded === false) {
                                            modelStateDictionary.addModelError($modelScope.model.biddingOrEnquiry + '文件', '请上传！');
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                };
                                // 添加招标文件补充说明时校验
                                valideStatusAnswer = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') }
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        // 招标文件补充说明
                                        if ($modelScope.model.currentItem.supplementFileList && angular.isArray($modelScope.model.currentItem.supplementFileList)) {
                                            for (var i = 0; i < $modelScope.model.currentItem.supplementFileList.length; i++) {
                                                var fileUploaded = false;
                                                var item = $modelScope.model.currentItem.supplementFileList[i];
                                                if (angular.isArray(item.clientFileInformationList) === false
                                                    || item.clientFileInformationList.length === 0) {
                                                    continue;
                                                }
                                                for (var y = 0; y < item.clientFileInformationList.length; y++) {
                                                    var file = item.clientFileInformationList[y];
                                                    if (file.uploaded === true) {
                                                        fileUploaded = true;
                                                    }
                                                }
                                                if (fileUploaded === false) {
                                                    modelStateDictionary.addModelError($modelScope.model.biddingOrEnquiry + '文件补充说明第' + (i + 1) + '行', '附件未上传完毕，请稍后！');
                                                }
                                            }
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                };
                                // 提交到供应商时校验
                                valideStatusCommit = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') },
                                        { key: '最新提问截止时间', attributeName: 'currentItem.answerInfo.lastQuestionDeadline', validator: new RequiredValidator('不能为空！') },
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        // 本次答疑文件
                                        var fileUploaded = false;
                                        if ($modelScope.model.currentItem.answerInfo.clientFileInformationList
                                            && angular.isArray($modelScope.model.currentItem.answerInfo.clientFileInformationList)) {
                                            for (var i = 0; i < $modelScope.model.currentItem.answerInfo.clientFileInformationList.length; i++) {
                                                var item = $modelScope.model.currentItem.answerInfo.clientFileInformationList[i];
                                                if (item.uploaded === true && item.isDeleted !== true) {
                                                    fileUploaded = true;
                                                }
                                            }
                                        }
                                        if (fileUploaded === false) {
                                            modelStateDictionary.addModelError('本次答疑文件', '请上传！');
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                };
                                // 商务评标验证
                                valideStatusBusinessEvaluate = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') }
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        // 招标文件补充说明
                                        if ($modelScope.model.currentItem.businessEvaluateBiddingInfoList && angular.isArray($modelScope.model.currentItem.businessEvaluateBiddingInfoList)) {
                                            for (var i = 0; i < $modelScope.model.currentItem.businessEvaluateBiddingInfoList.length; i++) {
                                                var item = $modelScope.model.currentItem.businessEvaluateBiddingInfoList[i];
                                                if (item.isAllowEditFirstTurnRanking && !item.firstTurnRanking) {
                                                    modelStateDictionary.addModelError('商务评标信息第' + (i + 1) + '行，名次', '请选择！');
                                                }
                                            }
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                };
                                // 技术评标验证
                                valideStatusTechnologyEvaluate = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') }
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        // 招标文件补充说明
                                        if ($modelScope.model.currentItem.technologyEvaluateBiddingInfoList && angular.isArray($modelScope.model.currentItem.technologyEvaluateBiddingInfoList)) {
                                            for (var i = 0; i < $modelScope.model.currentItem.technologyEvaluateBiddingInfoList.length; i++) {
                                                var item = $modelScope.model.currentItem.technologyEvaluateBiddingInfoList[i];
                                                if (item.isQualified === null || item.isQualified === '') {
                                                    modelStateDictionary.addModelError('技术评标信息第' + (i + 1) + '行，是否合格', '请选择！');
                                                }
                                            }
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                };
                                // 编辑标段成本目标验证
                                valideStatusAwardBidCostTarget = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') }
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        if (angular.isArray($modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList) === false
                                            || $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList.length === 0) {
                                            modelStateDictionary.addModelError('标段成本目标拆分信息', '不能为空！');
                                        }
                                        else {
                                            var agreementCodeArray = [];
                                            for (var i = 0; i < $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList.length; i++) {
                                                var item = $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList[i];

                                                var hasAgreementCode = false;
                                                for (var ia = 0; ia < agreementCodeArray.length; ia++) {
                                                    if (agreementCodeArray[ia] === item.contractAgreementCode) {
                                                        modelStateDictionary.addModelError('标段成本目标第' + (i + 1) + '行，合约名称', '不能重复选择！');
                                                        hasAgreementCode = true;
                                                    }
                                                }
                                                if (!hasAgreementCode) { agreementCodeArray.push(item.contractAgreementCode); }

                                                if (!item.contractAgreementCode) {
                                                    modelStateDictionary.addModelError('标段成本目标第' + (i + 1) + '行，合约名称', '请选择！');
                                                }
                                                else if (!item.splitToBiddingSectionCostTargetAmount) {
                                                    modelStateDictionary.addModelError('标段成本目标第' + (i + 1) + '行，合约规划拆分至标段的成本目标金额（元）', '不能为空！');
                                                }
                                                else if (rcTools.toFixedNum(item.splitToBiddingSectionCostTargetAmount) > rcTools.toFixedNum(item.contractAgreementCostTargetAmount)) {
                                                    modelStateDictionary.addModelError('标段成本目标第' + (i + 1) + '行，合约规划拆分至标段的成本目标金额（元）', '不能大于成本目标！');
                                                }
                                            }
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                };
                                // 编辑标段中标信息验证
                                valideStatusAwardWinBidding = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') }
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        if (angular.isArray($modelScope.model.currentItem.supplierBiddingSectionList) === false
                                            || $modelScope.model.currentItem.supplierBiddingSectionList.length === 0) {
                                            modelStateDictionary.addModelError('中标信息', '不能为空！');
                                        }
                                        else {
                                            var index = 0;
                                            for (var i = 0; i < $modelScope.model.currentItem.supplierBiddingSectionList.length; i++) {
                                                var item = $modelScope.model.currentItem.supplierBiddingSectionList[i];
                                                if (item.isWinTheBidding === true) {
                                                    index++;
                                                    if (item.isWinTheBidding === true && !item.isBottomPrice && !item.notBottomPriceWinReason) {
                                                        modelStateDictionary.addModelError('中标信息第' + (index) + '行，未采用最低价原因', '不能为空！');
                                                        hasAgreementCode = true;
                                                    }
                                                    if (item.notBottomPriceWinReason && item.notBottomPriceWinReason.length > 500) {
                                                        modelStateDictionary.addModelError('中标信息第' + (index) + '行，未采用最低价原因', '不能大于500个字符！');
                                                    }
                                                    if (item.winBiddingRemark && item.winBiddingRemark.length > 500) {
                                                        modelStateDictionary.addModelError('中标信息第' + (index) + '行，备注', '不能大于500个字符！');
                                                    }
                                                }
                                            }
                                        }
                                        if ($modelScope.model.isNeedAgreement !== true) {
                                            var fileUploaded = false;
                                            if ($modelScope.model.currentItem.priceFile && angular.isArray($modelScope.model.currentItem.priceFile)) {
                                                for (var i = 0; i < $modelScope.model.currentItem.priceFile.length; i++) {
                                                    var item = $modelScope.model.currentItem.priceFile[i];
                                                    if (item.uploaded === true && item.isDeleted !== true) {
                                                        fileUploaded = true;
                                                    }
                                                }
                                            }
                                            if (fileUploaded === false) {
                                                modelStateDictionary.addModelError('认价单', '请上传！');
                                            }

                                            if (!$modelScope.model.currentItem.flagContract || !$modelScope.model.currentItem.flagContract.contractCode) {
                                                modelStateDictionary.addModelError('所属合同', '请选择!');
                                            }
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                }

                                // 编辑标段定标结论验证
                                valideStatusAwardBiddingDetail = function () {
                                    var RequiredValidator = ValidateHelper.getValidator('Required');
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, [
                                        { key: '标段信息', attributeName: 'currentItem', validator: new RequiredValidator('不能为空！') }
                                    ]);
                                    if ($modelScope.model.currentItem) {
                                        var giveUpUnitCount = parseInt($modelScope.model.currentItem.giveUpUnitCount);
                                        if (angular.isNumber(giveUpUnitCount) === false || isNaN(giveUpUnitCount)) {
                                            modelStateDictionary.addModelError('弃标单位数量', '必须是数字！');
                                        }
                                        if ($modelScope.model.currentItem.giveUpUnitCount > 0
                                            && !$modelScope.model.currentItem.giveUpUnitNames) {
                                            modelStateDictionary.addModelError('弃标单位', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.giveUpUnitNames
                                            && $modelScope.model.currentItem.giveUpUnitNames.length > 300) {
                                            modelStateDictionary.addModelError('弃标单位', '不能大于300个字符！');
                                        }
                                        if ($modelScope.model.currentItem.giveUpUnitCount > 0
                                            && !$modelScope.model.currentItem.giveUpUnitOpinion) {
                                            modelStateDictionary.addModelError('处罚意见', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.giveUpUnitOpinion
                                            && $modelScope.model.currentItem.giveUpUnitOpinion.length > 500) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能大于500个字符！');
                                        }
                                        if ($modelScope.model.currentItem.isBottomPriceWin === null) {
                                            modelStateDictionary.addModelError('是否最低价中标', '请选择！');
                                        }
                                        if ($modelScope.model.currentItem.isBottomPriceWin === false
                                            && !$modelScope.model.currentItem.notBottomPriceWinReason) {
                                            modelStateDictionary.addModelError('非最低价中标原因', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.notBottomPriceWinReason
                                            && $modelScope.model.currentItem.notBottomPriceWinReason.length > 500) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能大于500个字符！');
                                        }
                                        if ($modelScope.model.currentItem.isAdjustCostTarget === null) {
                                            modelStateDictionary.addModelError('成本目标是否调整', '请选择！');
                                        }
                                        if ($modelScope.model.currentItem.isAdjustCostTarget === true
                                            && !$modelScope.model.currentItem.adjustCostTargetReason) {
                                            modelStateDictionary.addModelError('成本目标调整原因', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.adjustCostTargetReason
                                            && $modelScope.model.currentItem.adjustCostTargetReason.length > 500) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能大于500个字符！');
                                        }
                                        if ($modelScope.model.currentItem.isPrecedenceUnitWin === null) {
                                            modelStateDictionary.addModelError('具有优先中标权单位中标', '请选择！');
                                        }
                                        if ($modelScope.model.currentItem.isPrecedenceUnitWin === false
                                            && !$modelScope.model.currentItem.notPrecedenceUnitWinReason) {
                                            modelStateDictionary.addModelError('具有优先中标权单位未中标原因', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.notPrecedenceUnitWinReason
                                            && $modelScope.model.currentItem.notPrecedenceUnitWinReason.length > 500) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能大于500个字符！');
                                        }
                                        if ($modelScope.model.currentItem.isPrecedenceUnitGiveUp === null) {
                                            modelStateDictionary.addModelError('有无放弃函', '请选择！');
                                        }
                                        if ($modelScope.model.currentItem.isBiddingConditionaAmend === null) {
                                            modelStateDictionary.addModelError('招标条件是否大范围修改', '请选择！');
                                        }
                                        if ($modelScope.model.currentItem.isBiddingConditionaAmend === true
                                            && !$modelScope.model.currentItem.biddingConditionaAmendContent) {
                                            modelStateDictionary.addModelError('具体修改内容', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.biddingConditionaAmendContent
                                            && $modelScope.model.currentItem.biddingConditionaAmendContent.length > 500) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能大于500个字符！');
                                        }
                                        if ($modelScope.model.currentItem.isExceedBenchmarkingPrice === null) {
                                            modelStateDictionary.addModelError('是否超过对标价格', '请选择！');
                                        }
                                        if ($modelScope.model.currentItem.isExceedBenchmarkingPrice === true
                                            && !$modelScope.model.currentItem.exceedBenchmarkingPriceReason) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.exceedBenchmarkingPriceReason
                                            && $modelScope.model.currentItem.exceedBenchmarkingPriceReason.length > 500) {
                                            modelStateDictionary.addModelError('超过对标价格原因', '不能大于500个字符！');
                                        }
                                        if (!$modelScope.model.currentItem.biddingSectionOtherRemark) {
                                            modelStateDictionary.addModelError('其他说明', '不能为空！');
                                        }
                                        if ($modelScope.model.currentItem.biddingSectionOtherRemark
                                            && $modelScope.model.currentItem.biddingSectionOtherRemark.length > 500) {
                                            modelStateDictionary.addModelError('其他说明', '不能大于500个字符！');
                                        }
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                }
                                // 招标文件补充说明
                                $modelScope.supplementFile = {
                                    isCheckAll: false,
                                    checkAll: function () {
                                        for (var i = 0; i < $modelScope.model.currentItem.supplementFileList.length; i++) {
                                            var item = $modelScope.model.currentItem.supplementFileList[i];
                                            item.checked = !$modelScope.supplementFile.isCheckAll;
                                        }
                                    },
                                    addItem: function () {
                                        $modelScope.model.currentItem.supplementFileList.push({
                                            canDelete: true,
                                            canEditFileName: true
                                        });
                                    },
                                    deleteItem: function () {
                                        var selected = false;
                                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除" + $modelScope.model.biddingOrEnquiry + "文件补充说明?");
                                        promise.then(function (v) {
                                            for (var i = $modelScope.model.currentItem.supplementFileList.length - 1; i >= 0; i--) {
                                                var item = $modelScope.model.currentItem.supplementFileList[i];
                                                if (item.checked) {
                                                    selected = true;
                                                    $modelScope.model.currentItem.supplementFileList.splice(i, 1);
                                                }
                                            }

                                            if (selected === false) {
                                                sogModal.openAlertDialog('提示', "请选择需要删除的" + $modelScope.model.biddingOrEnquiry + "文件补充说明！");
                                            }
                                            $modelScope.supplementFile.isCheckAll = false;
                                        });
                                    }
                                };
                                // 提交到供应商
                                $modelScope.commit = function () {
                                    if (valideStatusCommit() === false) { return null; }
                                    wfWaiting.show();
                                    $http.post(seagull2Url.getPlatformUrl('/BiddingEngineering/CommitToSupplier'), $modelScope.model.currentItem.answerInfo)
                                        .success(function (data) {
                                            $modelScope.model.currentItem.historyAnswerInfoList = data.historyAnswerInfoList;
                                            $modelScope.model.currentItem.answerInfo = data.answerInfo;

                                            var list = $modelScope.model.currentItem.supplierBiddingSectionList;
                                            for (var i = 0; i < list.length; i++) {
                                                var item = list[i];
                                                if (angular.isArray(item.questionInfoList)
                                                    && angular.isArray(data.historyAnswerInfoList)
                                                    && item.questionInfoList.length <= data.historyAnswerInfoList.length) {
                                                    item.questionInfoList.push({ round: data.answerInfo.round });
                                                }
                                            }

                                            if ($scope.editIndex >= 0) {
                                                $scope.data[$scope.editIndex].historyAnswerInfoList = data.historyAnswerInfoList;
                                                $scope.data[$scope.editIndex].answerInfo = data.answerInfo;
                                                $scope.data[$scope.editIndex].supplierBiddingSectionList = list;
                                            }
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            if (data) {
                                                sogModal.openAlertDialog("错误", data.message);
                                            } else {
                                                sogModal.openAlertDialog("提示", "提交到供应商出错错误");
                                            }
                                            wfWaiting.hide();
                                        });
                                };
                                // 标段成本目标，添加行
                                $modelScope.addBiddingSectionContractAgreementScopeInfo = function () {
                                    if (angular.isArray($modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList) === false) {
                                        $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList = [];
                                    }
                                    $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList.push({});
                                };
                                // 标段成本目标，删除行
                                $modelScope.deleteBiddingSectionContractAgreementScopeInfo = function () {
                                    var select = false;
                                    if (angular.isArray($modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList)) {
                                        for (var i = $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList.length - 1; i >= 0; i--) {
                                            if ($modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList[i].checked) {
                                                select = true;
                                            }
                                        }
                                    }
                                    if (!select) {
                                        sogModal.openAlertDialog("提示", "请先选中需要删除的合约规划！")
                                    } else {

                                        var promise = sogModal.openConfirmDialog("提示", "是否确认删除！")
                                        promise.then(function () {
                                            for (var i = $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList.length - 1; i >= 0; i--) {
                                                if ($modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList[i].checked) {
                                                    $modelScope.model.currentItem.biddingSectionContractAgreementScopeInfoList.splice(i, 1);
                                                }
                                            }
                                        }, function () {
                                        });
                                    }
                                };
                                var initContractAgreementScopeList = function () {
                                    $modelScope.contractAgreementScopeList = [];
                                    angular.forEach($scope.opts.contractAgreementScopeList, function (item) {
                                        if (item.validStatus) {
                                            $modelScope.contractAgreementScopeList.push(item);
                                        }
                                    });
                                };

                                // 标段成本目标，合约变更
                                $modelScope.contractAgreementChange = function (scope) {
                                    scope.contractAgreementName = null;
                                    scope.contractAgreementScopeCode = null;
                                    scope.projectCode = null;
                                    scope.projectName = null;
                                    scope.stageAreaCode = null;
                                    scope.stageAreaName = null;
                                    scope.contractAgreementTypeCode = null;
                                    scope.contractAgreementTypeName = null;
                                    scope.contractAgreementCostTargetAmount = null;
                                    scope.splitToBiddingSectionCostTargetAmount = null;
                                    angular.forEach($modelScope.contractAgreementScopeList, function (item) {
                                        if (item.contractAgreementCode === scope.contractAgreementCode) {
                                            scope.contractAgreementName = item.contractAgreementName;
                                            scope.contractAgreementScopeCode = item.resultCode;
                                            scope.projectCode = item.projectCode;
                                            scope.projectName = item.projectName;
                                            scope.stageAreaCode = item.stageAreaCode;
                                            scope.stageAreaName = item.stageAreaName;
                                            scope.contractAgreementTypeCode = item.contractAgreementTypeCode;
                                            scope.contractAgreementTypeName = item.contractAgreementTypeName;
                                            scope.contractAgreementCostTargetAmount = item.costTargetAmount;
                                            scope.splitToBiddingSectionCostTargetAmount = 0;
                                            return false;
                                        }
                                    });
                                };
                                // 添加中标信息
                                $modelScope.addAwardWinBiddingScopeInfo = function () {
                                    var select = false;
                                    for (var i = 0; i < $modelScope.model.currentItem.supplierReplyScopeList.length; i++) {
                                        if ($modelScope.model.currentItem.supplierReplyScopeList[i].checked) {
                                            select = true;
                                        }
                                    }
                                    if (!select) {
                                        sogModal.openAlertDialog("提示", "请选择中标供应商信息！")
                                    } else {
                                        for (var i = 0; i < $modelScope.model.currentItem.supplierReplyScopeList.length; i++) {
                                            var replyScope = $modelScope.model.currentItem.supplierReplyScopeList[i];
                                            // 选择的中标供应商
                                            if (replyScope.checked) {
                                                replyScope.checked = false;
                                                // 标段范围信息
                                                for (var y = 0; y < $modelScope.model.currentItem.supplierBiddingSectionList.length; y++) {
                                                    var sectionScope = $modelScope.model.currentItem.supplierBiddingSectionList[y];
                                                    if (replyScope.supplierCode === sectionScope.supplierCode) {
                                                        sectionScope.isWinTheBidding = true;
                                                        sectionScope.industryDomainName = replyScope.industryDomainName;
                                                        replyScope.isWinTheBidding = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };
                                // 删除中标信息
                                $modelScope.deleteAwardWinBiddingScopeInfo = function () {
                                    var select = false;
                                    for (var i = $modelScope.model.currentItem.supplierBiddingSectionList.length - 1; i >= 0; i--) {
                                        if ($modelScope.model.currentItem.supplierBiddingSectionList[i].checked) {
                                            select = true;
                                        }
                                    }
                                    if (!select) {
                                        sogModal.openAlertDialog("提示", "请先选中需要删除的中标信息！")
                                    } else {
                                        var messsage = "确认是否删除中标信息?";
                                        var promise = sogModal.openConfirmDialog("删除", messsage);
                                        promise.then(function (v) {
                                            for (var i = 0; i < $modelScope.model.currentItem.supplierBiddingSectionList.length; i++) {
                                                var sectionScope = $modelScope.model.currentItem.supplierBiddingSectionList[i];
                                                // 选择的中标供应商
                                                if (sectionScope.checked) {
                                                    // 标段范围信息
                                                    for (var y = 0; y < $modelScope.model.currentItem.supplierReplyScopeList.length; y++) {
                                                        var replyScope = $modelScope.model.currentItem.supplierReplyScopeList[y];
                                                        if (replyScope.supplierCode === sectionScope.supplierCode) {
                                                            sectionScope.checked = false;
                                                            sectionScope.isWinTheBidding = false;
                                                            replyScope.isWinTheBidding = false;
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    }
                                };

                                // 查看招标基本信息
                                $modelScope.showApplicationPage = function () {
                                    angular.forEach($scope.opts.processActivityInfoList, function (item, index) {
                                        if (item.activityCodeName === "BiddingEngineeringApplication" || item.activityCodeName === "BiddingImplementApplication") {
                                            var url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + item.activityStateName + "/" + item.activityCode;
                                            $window.open(url, '_blank');
                                        }
                                    });
                                };

                                $modelScope.model.init();
                            }], $scope, { containerStyle: { width: '90%' } },
                            function (v, defer) {
                                defer.resolve(v);
                                if ($scope.editIndex !== -1) {
                                    $scope.data[$scope.editIndex] = v;
                                }
                                else {
                                    $scope.data.push(v);
                                }
                                if (typeof $scope.opts.afterEdit === 'function') { $scope.opts.afterEdit(v); }
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的标段信息！")
                    } else {
                        var messsage = "确认是否删除标段信息?";
                        var promise = sogModal.openConfirmDialog("删除", messsage);
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                if ($scope.data[i].checked) {
                                    $scope.data.splice(i, 1);
                                }
                            }
                            $scope.select_all = false;
                            // if (typeof $scope.opts.beforDelete === 'function') { $scope.opts.beforDelete(v); }
                        })
                    }
                };
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].checked = allChecked;
                    }
                };
                //复选框选中
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        if (!$scope.data[i].checked) {
                            $scope.select_all = false;
                            return;
                        } else {
                            $scope.select_all = true;
                        }
                    }
                };
                // 甲指类修改成本目标
                $scope.costTargetAmountChange = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.data.length; i++) {
                        total += rcTools.toFixedNum($scope.data[i].biddingCostTargetAmount);
                    }
                    if (typeof $scope.opts.afterCostTargetEdit === 'function') { $scope.opts.afterCostTargetEdit(total); }
                };

            },
            link: function (scope, iElement, iAttr) {
            }
        }
    });
})