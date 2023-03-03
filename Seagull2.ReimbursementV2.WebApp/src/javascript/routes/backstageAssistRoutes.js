define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var csspathBase = "https://cdn.sinoocean-test.com/libs/seagull2-workflow-responsive/1.0.4/";

        //短信邮件信息记录查询
        $stateProvider.state('messageEmailRecordInfoState', {
            url: '/messageEmailRecordInfoQuery',
            controller: 'messageEmailRecordInfo_controller',
            controllerUrl: './javascript/controllers/backstageAssist/messageEmailRecordInfo-controller.js',
            templateUrl: './views/backstageAssist/messageEmailRecordInfo.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });


        $stateProvider.state('containerRecordInfoState', {
            url: '/containerRecordInfo',
            controller: 'messageEmailRecordInfo_controller',
            controllerUrl: './javascript/controllers/backstageAssist/messageEmailRecordInfo-controller.js',
            templateUrl: './views/backstageAssist/containerRecordInfo.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
        });


        //投标异常线索信息查询
        $stateProvider.state('biddingAbnormityClewInfo', {
            url: '/biddingAbnormityClewInfo',
            controller: 'biddingAbnormityClewInfoView_controller',
            controllerUrl: './javascript/controllers/biddingAbnormity/biddingAbnormityClewInfoView-controller.js',
            templateUrl: './views/biddingAbnormity/biddingAbnormityClewInfoView.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8']
            //roleControl: { code: 'BiddingV2:BiddingAbnormityClewInfo', name: 'A招标异常信息报表查看' }
        });

        //客服操作页面
        $stateProvider.state('customerServiceAssist', {
            url: '/customerServiceAssist',
            controller: 'customerServiceAssist_controller',
            controllerUrl: './javascript/controllers/backstageAssist/customerServiceAssist-controller.js',
            templateUrl: './views/backstageAssist/customerServiceAssist.html',
            requiredLogin: true,
            dependencies: ['css!' + csspathBase + '/form', 'ie8css!' + csspathBase + '/form_ie8'],
            roleControl: { code: 'SubAdmin:caigouguanli', name: '仅客服使用' }
        });
    }]);
});