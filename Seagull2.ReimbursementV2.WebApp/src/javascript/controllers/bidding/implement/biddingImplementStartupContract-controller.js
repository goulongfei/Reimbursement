define(
  [
    'app',
    'commonUtilExtend',
    'contractAgreementExtend',
    'biddingSynthesizeExtend',
    'bidSectionInfoExtend',
    'isEmphasisExtend',
    'signContractExtend',
    'leftNavExtend',
    'offerInfoExtend',
    'refundProgressExtend',
  ],
  function (app) {
    app.controller('biddingImplementStartupContract_controller', [
      '$scope', 'viewData',
      'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator', 'rcTools',
      'sogWfControlOperationType', '$rootScope', 'wfOperate',
      function ($scope, viewData,
        wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
        sogWfControlOperationType, $rootScope, wfOperate) {

        angular.extend($scope, viewData);
        //流程标题
        $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
        $scope.title = viewData.viewModel.formAction.actionTypeName;
        //设置导航栏按钮状态
        $scope.wfOperateOpts.allowCirculate = false; //传阅 
        $scope.wfOperateOpts.allowPrint = false; //打印
        $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
        $scope.wfOperateOpts.allowDoAbort = false; //作废
        $scope.wfOperateOpts.allowDoWithdrawToAssignees = false; //一撤到底 

        // 附件设置项
        $scope.fileOpts = {
          'auto': true,
          'preview': false,
          'fileNumLimit': 0
        };
        // 设置 
        $scope.settings = {
          //合约规划
          contractAgreementOpts: {
            model: 'readOnly',
            isAdmin: $scope.viewModel.isAdmin,
          },
          // 采购时间安排信息
          purchaseDateArrangeOpts: {
             'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
            'scene': 'Award',
          },
          // 标段信息
          bidSectionInfoOpts: {
              'scene': 'Award',
              biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
              isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile,
          },
          //左侧导航栏
          leftNavListOpts: {
            offset: 59.5,
            fixed: 0,
            delay: 2000,
            resourceId: $scope.resourceId,
            scene: "BiddingImplementStartupContract",
            activityInfoList: $scope.viewModel.processActivityInfoList,
            isAbandonBidding: $scope.viewModel.purchaseOfImplement.isAbandonBidding,
            isGrantDiscountEnquiry: $scope.viewModel.purchaseOfImplement.isGrantDiscountEnquiry,
            actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
          },
          //拟签订合同信息
          signContractOpts: {
            scene: 'StartupContract',
          },
          // 退费
          refundOpts: {
              route: 'biddingImplementStartupContract',
              businessType: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
          },
        };

        $scope.api = {
          showErrorMessage: function (error, status) {
            wfWaiting.hide();
            if (status === 400) {
              sogModal.openAlertDialog("提示", error.message).then(function () {});
            } else {
              if (error) {
                sogModal.openErrorDialog(error).then(function () {});
              }
            }
          },
        }

        // 基本信息 
        $scope.baseInfo = {
          init: function () {
            rcTools.setOpinionOpts($scope.opinionOpts.options);
            rcTools.setProcessNavigator($scope.processNavigator);
          },
        };

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
        //验证
        var validData = function () {
          var RequiredValidator = ValidateHelper.getValidator('Required');
          var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [{
            key: '采购名称',
            attributeName: 'purchaseBase.purchaseName',
            validator: new stringMaxLengthValidator(30, "不能大于30个字符!")
          }]);

          // 选择合约规划 
          // 拟签订合同信息
          if (angular.isArray($scope.viewModel.perSignContractInfoList)) {
            for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
              var item = $scope.viewModel.perSignContractInfoList[i];
              if (!item.operatorUser) {
                modelStateDictionary.addModelError('拟签订合同信息第' + (i + 1) + '行，合同经办人', '请选择！');
              }
            }
          }
          return modelStateDictionary;
        };
        // 保存验证
        var saveValidData = function () {
          var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
          return modelStateDictionary;
        };
        // 复制viewModel
        function getCleanModel() {
          var model = {};
          angular.extend(model, $scope.viewModel);
          model.option = null;
          return model;
        }
        //提交数据
        $scope.collectData = function (e, defer) {
          sogValidator.clear();
          var result;
          if (e.operationType === sogWfControlOperationType.MoveTo) {
            result = validData();
            if (!result.isValid()) {
              sogModal.openDialogForModelStateDictionary('信息校验失败', result);
              sogValidator.broadcastResult(result.get());
              defer.reject($scope.viewModel);
            } else {
              defer.resolve(getCleanModel());
            }
          } else if (e.operationType === sogWfControlOperationType.Comment) {
            var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
            promise.then(function () {
              defer.resolve(getCleanModel());
            }, function () {
              defer.reject($scope.viewModel);
            });
          } else if (e.operationType === sogWfControlOperationType.Save) {
            result = saveValidData();
            if (!result.isValid()) {
              sogModal.openDialogForModelStateDictionary('信息校验失败', result);
              sogValidator.broadcastResult(result.get());
              defer.reject($scope.viewModel);
            } else {
              defer.resolve(getCleanModel());
            }
          } else {
            defer.resolve(getCleanModel());
          }
        };


        $scope.baseInfo.init();
      }
    ]);
  });