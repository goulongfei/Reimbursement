/// <reference path="myangularextend/purchaseplan/purchaseplanfileinfo-controller.js" />
/// <reference path="myangularextend/purchaseplan/purchaseplanfileinfo-controller.js" />
require.config({
    map: {
        '*': {
            'ie8css': 'https://cdn.sinoocean-test.com/libs/requirecss-branch-seagull2/1.1.0/ie8css.min.js',
            'css': 'https://cdn.sinoocean-test.com/libs/requirecss-branch-seagull2/1.1.0/css.min.js'
        }
    },
    waitSeconds: 0,
    //配置angular的路径
    paths: {
        'angular': 'https://cdn.sinoocean-test.com/libs/angular/1.2.27/angular.min',
        'angular-cookies': 'https://cdn.sinoocean-test.com/libs/angular/1.2.27/angular-cookies.min',
        'angular-resource': 'https://cdn.sinoocean-test.com/libs/angular/1.2.27/angular-resource.min',
        'angular-ui-router': 'https://cdn.sinoocean-test.com/libs/angular-ui-router/0.2.18/release/angular-ui-router.min',
        'angular-ui-tree': 'https://cdn.sinoocean-test.com/libs/angular-ui-tree/2.15.0/dist/angular-ui-tree.min',
        'angular-async-loader': 'https://cdn.sinoocean-test.com/libs/angular-async-loader/1.3.2/angular-async-loader.min',
        'text': 'https://cdn.sinoocean-test.com/libs/text/2.0.15/text.min',
        'jquery': 'https://cdn.sinoocean-test.com/libs/jquery/1.12.3/dist/jquery.min',
        'webuploader': 'https://cdn.sinoocean-test.com/libs/webuploader/0.1.8/dist/webuploader.min',
        'urijs': 'https://cdn.sinoocean-test.com/libs/urijs/1.18.0/src',
        'seagull2-workflow-responsive': 'https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.1.1/seagull2-workflow-responsive.min',
        'angular-seagull2-common': 'https://cdn.sinoocean-test.com/libs/angular-seagull2-common/1.10.0/angular-seagull2-common',
        'angular-seagull2-oauth': 'https://cdn.sinoocean-test.com/libs/angular-seagull2-oauth/1.8.0/angular-seagull2-oauth',
        'angular-seagull2-workflow': 'https://cdn.sinoocean-test.com/libs/angular-seagull2-workflow/1.22.0/angular-seagull2-workflow',
        'angular-seagull2-infrastructure': 'https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure',
        'angular-datepicker': 'https://cdn.sinoocean-test.com/libs/datepicker-branch-seagull2/1.0.4/datepicker-branch-seagull2.min',
        'tiger-balm': 'https://cdn.sinoocean-test.com/libs/tiger-balm/0.7.2/dist/tiger-balm.min',
        'linqjs': 'https://cdn.sinoocean-test.com/libs/linq/3.0.8/linq.min',
        'scrollspy': 'https://cdn.sinoocean-test.com/libs/bootstrap/3.3.6/js/scrollspy',
        'app': './javascript/app',
        'app-routes': './javascript/app-routes',
        //自定义指令
        'supplierInfoExtend': 'javascript/myAngularExtend/supplierInfoExtend',
        'supplierInfoExtendV2': 'javascript/myAngularExtend/supplierInfoExtend-new',
        'commonUtilExtend': 'javascript/myAngularExtend/commonUtilExtend',
        //招投标类自定义指令
        'biddingSynthesizeExtend': 'javascript/myAngularExtend/biddingSynthesizeExtend',
        //直接委托综合类自定义指令
        'directCommissionedSynthesizeExtend': 'javascript/myAngularExtend/directCommissionedSynthesizeExtend',
        //工程类自定义指令
        'engineeringExtend': 'javascript/myAngularExtend/engineeringExtend',
        //供应商类别自定义指令
        'supplierCategoryExtend': 'javascript/myAngularExtend/supplierCategoryExtend',
        //负面清单
        'negativeListExtend': 'javascript/myAngularExtend/negativeListExtend',
        //合约规划
        'contractAgreementExtend': 'javascript/myAngularExtend/contractAgreementExtend',
        // 选择合同
        'contractExtend': 'javascript/myAngularExtend/contractExtend',
        // 供应商选择服务
        'supplierSelector': 'javascript/myAngularExtend/supplierSelectorService',
        // 选择采购明细
        'fixedAssetsExtend': 'javascript/myAngularExtend/fixedAssetsExtend',
        //时间控件
        'dateTimePickerExtend': 'javascript/myAngularExtend/dateTimePickerExtend',
        //政府控件
        'governmentSelectorExtend': 'javascript/myAngularExtend/governmentSelectorExtend',
        //法人公司多选
        'corporationExtend': 'javascript/myAngularExtend/corporationExtend',
        // 法人公司单选
        'corporationRadioSelector': 'javascript/dialogController/common/corporationRadioSelector-controller',
        // 企查查
        'echarts': 'javascript/enterpriseCheckExtend/echarts.min',
        //图表自定义
        'echartsUitl': 'javascript/myAngularExtend/echartsUitlExtend',
        //项目控件自定义指令
        'projectExtend': 'javascript/myAngularExtend/projectExtend',
        //期区控件自定义指令
        'stageAreaExtend': 'javascript/myAngularExtend/stageAreaExtend',
        //行业领域自定义指令
        'supplierCategory': 'javascript/dialogController/common/supplierCategory-controller',
        //招投标左侧导航自定义指令
        'leftNavExtend': 'javascript/myAngularExtend/leftNavExtend',
        //选择供应商自定义指令(优化)
        'supplierInfoExtendV3': 'javascript/myAngularExtend/supplierInfoExtendV3',
        //供应商可合作城市
        'supplierProjectCityExtend': 'javascript/myAngularExtend/supplierProjectCityExtend',
        //供应商合作项目
        'supplierProjectExtend': 'javascript/myAngularExtend/supplierProjectExtend',
        // 可投标段
        'bidSectionExtend': 'javascript/myAngularExtend/bidSectionExtend',
        // 标段信息
        'bidSectionInfoExtend': 'javascript/myAngularExtend/bidSectionInfoExtend',
        // 选择项目实施标段信息
        'selectBidExtend': 'javascript/myAngularExtend/selectBidExtend',
        // 银行选择控件
        'angular-seagull2-affiliatedBankprovider': 'javascript/myAngularExtend/angular-seagull2-affiliatedBankprovider',
        // 银行账号选择控件
        'angular-seagull2-bankAccountprovider': 'javascript/myAngularExtend/angular-seagull2-bankAccountprovider',
        //选择合约规划服务
        'contractAgreementSelector': 'javascript/myAngularExtend/contractAgreementSelectorService',
        // 是否重要
        'isEmphasisExtend': 'javascript/myAngularExtend/isEmphasisExtend',
        // 区域导航
        'sectionNavExtend': 'javascript/myAngularExtend/sectionNavExtend',
        // 招投标页面用到的企查查展示
        'enterpriseShowExtend': 'javascript/myAngularExtend/enterpriseShowExtend',
        // 采购计划控件
        'purchasePlanExtend': 'javascript/myAngularExtend/purchasePlan/purchasePlanExtend',
        // 拟签订合同信息
        'signContractExtend': 'javascript/myAngularExtend/signContractExtend',
        // 报价信息
        'offerInfoExtend': 'javascript/myAngularExtend/offerInfoExtend',
        // 退费信息
        'refundProgressExtend': 'javascript/myAngularExtend/refundProgressExtend',
        // 一键下载
        'fileDownExtend': 'javascript/myAngularExtend/fileDownExtend',
        // 我的采购清单-待办
        'pdTaskExtend': 'javascript/myAngularExtend/purchaseDetailedList/pdTaskExtend',
        //选择供应商自定义指令(优化)
        'supplierInfoExtendV4': 'javascript/myAngularExtend/supplierInfoExtendV4',
        // 供应商选择服务(通用)
        'supplierSelectorV2': 'javascript/myAngularExtend/supplierSelectorServiceV2',
        // 施工面积
        'currentConstructionArea': 'javascript/myAngularExtend/currentConstructionAreaExtend',
        // 战采协议
        'strategyPurchaseAgreementInfoExtend': 'javascript/myAngularExtend/strategyPurchaseAgreementInfoExtend',
        // 使用成本中心
        'useCostCenterExtend': 'javascript/myAngularExtend/useCostCenterExtend',
        // 采购计划选择
        'purchasePlanChoose': 'javascript/dialogController/common/purchasePlanChoose-controller',
        //自动补全（下拉搜索）
        'autoCompleteExtend': 'javascript/myAngularExtend/autoCompleteExtend',
        //广联达招标清单控件
        'glodonFileExtend': 'javascript/myAngularExtend/glodonFileExtend',
        //比价采购'
        'comparePriceSynthesizeExtend': 'javascript/myAngularExtend/comparePriceSynthesizeExtend',
        //采购计划-前置需求
        'purchasePlanFileInfoExtend': 'javascript/myAngularExtend/purchasePlan/purchasePlanFileInfoExtend'

    },
    //这个配置是你在引入依赖的时候的包名
    shim: {
        'text': { exports: 'text' },
        'angular': { exports: 'angular' },
        'angular-cookies': { exports: 'angular-cookies', deps: ['angular'] },
        'angular-ui-router': { deps: ['angular'] },
        'angular-ui-tree': { deps: ['angular', 'css!https://cdn.sinoocean-test.com/libs/angular-ui-tree/2.15.0/dist/angular-ui-tree.min'] },
        'angular-datepicker': { deps: ['angular', 'css!https://cdn.sinoocean-test.com/libs/datepicker-branch-seagull2/1.0.4/datepicker-branch-seagull2'] },
        'angular-seagull2-common': {
            deps: [
                'angular',
                'urijs/uri',
                'angular-ui-tree',
                'css!https://cdn.sinoocean-test.com/libs/angular-seagull2-common/1.10.0/angular-seagull2-common.min',
                'ie8css!https://cdn.sinoocean-test.com/libs/angular-seagull2-common/1.10.0/angular-seagull2-common.ie8.min']
        },
        'angular-seagull2-oauth': {
            deps: [
                'angular',
                'angular-cookies',
                'angular-ui-router',
                'urijs/uri',
                'angular-seagull2-common',
                'css!https://cdn.sinoocean-test.com/libs/angular-seagull2-oauth/1.8.0/angular-seagull2-oauth.min',
                'ie8css!https://cdn.sinoocean-test.com/libs/angular-seagull2-oauth/1.8.0/angular-seagull2-oauth.ie8.min']
        },
        'angular-seagull2-workflow': {
            deps: [
                'angular',
                'urijs/uri',
                'angular-seagull2-common',
                'angular-datepicker',
                'css!https://cdn.sinoocean-test.com/libs/angular-seagull2-workflow/1.22.0/angular-seagull2-workflow.min',
                'ie8css!https://cdn.sinoocean-test.com/libs/angular-seagull2-workflow/1.22.0/angular-seagull2-workflow.ie8.min']
        },
        'angular-seagull2-infrastructure': {
            deps: [
                'angular',
                'angular-ui-tree',
                'angular-seagull2-common',
                'css!https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure.min',
                'ie8css!https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure.ie8.min']
        },
        'appConstant': {
            deps: ['angular']
        },
        'angular-seagull2-affiliatedBankprovider': {
            deps: [
                'angular',
                'angular-seagull2-common',
                'angular-seagull2-workflow',
                'css!https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure.min',
                'ie8css!https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure.ie8.min']
        },
        'angular-seagull2-bankAccountprovider': {
            deps: [
                'angular',
                'angular-seagull2-common',
                'angular-seagull2-workflow',
                'css!https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure.min',
                'ie8css!https://cdn.sinoocean-test.com/libs/angular-seagull2-infrastructure/0.2.4/angular-seagull2-infrastructure.ie8.min']
        },
    }
});
require(['angular', 'webuploader', 'app', 'jquery', 'app-routes'],
    function (angular, webuploader, app, jquery) {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['app']);
            angular.element(document).find('html').addClass('ng-app');
            window.sogFormBridge = app.get('sogFormBridge');
        });
        window.WebUploader = webuploader;
        window.jquery = jquery;
    });