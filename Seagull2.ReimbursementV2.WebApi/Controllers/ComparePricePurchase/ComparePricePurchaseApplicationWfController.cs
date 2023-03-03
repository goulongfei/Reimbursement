using MCS.Library.SOA.DataObjects.Workflow;
using Seagull2.Owin.Workflow.Controller;
using Seagull2.Owin.Workflow.Models;
using System;
using System.Linq;
using System.Web.Http;
using MCS.Library.Core;
using Newtonsoft.Json;
using Seagull2.ReimbursementV2.TransactionData.Enum;
using Seagull2.ReimbursementV2.TransactionData.Controllers;
using Seagull2.ReimbursementV2.TransactionData;
using MCS.Library.SOA.DataObjects;
using MCS.Library.Principal;
using MCS.Library.OGUPermission;
using SchemaType = MCS.Library.OGUPermission.SchemaType;
using Seagull2.ReimbursementV2.WebApi;
using Seagull2.ReimbursementV2.WebApi.Models;

namespace Seagull2.ReimbursementV2.WebApi
{
    /// <summary>
    /// 报销流程-报销申请
    /// </summary>
    [Route("ReimbursementApplicationWf")]
    public class ReimbursementApplicationWfController : WfApiController
    {
        #region 场景与意见
        protected override string GetDefaultWorkflowSceneId(IWfActivity currentActivity)
        {
            return WfSceneConst.DEFAULTSCENE ;
        }

        protected override string GetDefaultReadOnlySceneId(IWfActivity currentActivity)
        {
            return WfSceneConst.DEFAULTREADONLYSCENE;
        }

        protected override bool HasOpinion(IWfActivity currentActivity, string sceneId)
        {
            return true;
        }
        #endregion

        #region Startup
        protected override IWfActivity ChangeCurrentActivityOnStartup(IWfActivity currentActivity)
        {
            IWfActivity activity =
                       currentActivity.BranchProcessGroups.FirstOrDefault()?.Branches.FirstOrDefault()?.CurrentActivity ??
                       currentActivity;
            return activity;
        }

        protected override object StartWorkflowPrepareApplicationData(IWfActivity currentActivity, object dataInput, WfExecutorDataContext dataContext)
        {
            ReimbursementApplicationViewModel viewModel = ReimbursementApplicationViewModelAdapter.Instance.InitViewModel(currentActivity.RootActivity.Process.ResourceID);
            return viewModel;
        }

        protected override object StartWorkflowReturnViewModel(object dataSource, WfExecutorDataContext dataContext)
        {
            return dataSource;
        }
        #endregion

        #region Open
        protected override object LoadViewModel(IWfActivity currentActivity, string sceneId)
        {
            ReimbursementApplicationViewModel viewModel = ReimbursementApplicationViewModelAdapter.Instance.GetViewModel(currentActivity.RootActivity.Process.ResourceID);
            return viewModel;
        }
        #endregion

        #region Save
        protected override void SaveExecutorBeforeExecute(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput != null)
            {
                ReimbursementApplicationViewModel viewModel = JsonConvert.DeserializeObject<ReimbursementApplicationViewModel>(dataInput);
                SetApplicationRumtimeParameter(viewModel, dataContext.CurrentProcess.CurrentActivity);
            }
        }

        protected override object SaveExecutorPrepareApplicationData(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput == null)
            {
                return null;
            }
            ReimbursementApplicationViewModel viewModel = JsonConvert.DeserializeObject<ReimbursementApplicationViewModel>(dataInput);
            return viewModel;
        }

        protected override void SaveExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {
            if (sceneId == WfSceneConst.APPLICATION)
            {
                ReimbursementApplicationViewModel viewModel = dataSource as ReimbursementApplicationViewModel;
                ReimbursementApplicationViewModelAdapter.Instance.UpdateToProcessData(viewModel);
                //更新代办标题
                UpdateTaskTitle(dataContext.CurrentProcess, viewModel);
            }
        }
        #endregion

        #region MoveTo
        protected override void MoveToExecutorBeforeExecute(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput != null)
            {
                ReimbursementApplicationViewModel viewModel = JsonConvert.DeserializeObject<ReimbursementApplicationViewModel>(dataInput);
                SetApplicationRumtimeParameter(viewModel, dataContext.CurrentProcess.CurrentActivity);
            }
        }

        protected override object MoveToExecutorPrepareApplicationData(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput == null)
            {
                return null;
            }
            ReimbursementApplicationViewModel viewModel = JsonConvert.DeserializeObject<ReimbursementApplicationViewModel>(dataInput);
            return viewModel;
        }

        protected override void MoveToExecutorValidData(object dataSource, string sceneId, ModelValidResult validResult, WfExecutorDataContext dataContext)
        {
            ReimbursementApplicationViewModel viewModel = dataSource as ReimbursementApplicationViewModel;
        }

        protected override void MoveToExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {
            if (sceneId == WfSceneConst.APPLICATION)
            {
                ReimbursementApplicationViewModel viewModel = dataSource as ReimbursementApplicationViewModel;
                ReimbursementApplicationViewModelAdapter.Instance.UpdateToProcessData(viewModel);
                //更新代办标题
                UpdateTaskTitle(dataContext.CurrentProcess, viewModel);
            }
        }
        #endregion

        #region 作废
        protected override void CancelExecutorBeforeExecute(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            IWfProcess wfProcess = dataContext.CurrentProcess;
            //作废子流程，自动作废主流程
            if (dataContext.CurrentProcess.EntryInfo != null)
            {
                wfProcess = dataContext.CurrentProcess.EntryInfo.OwnerActivity.Process;
            }
            wfProcess.CancelProcess(true);
        }

        protected override object CancelExecutorPrepareApplicationData(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput == null)
            {
                return null;
            }
            ReimbursementApplicationViewModel viewModel = JsonConvert.DeserializeObject<ReimbursementApplicationViewModel>(dataInput);
            return viewModel;
        }

        /// <summary>
        /// 作废时调用
        /// </summary>
        protected override void CancelExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataSource != null)
            {
                //处理逻辑
                //ReimbursementApplicationViewModel viewModel = dataSource as ReimbursementApplicationViewModel;
                //ComparePricePurchaseCommonViewModelAdapter.Instance.DoAborted(viewModel);
            }
        }
        #endregion

        #region 传阅
        protected override void CirculateExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {
            //CirculatorHelper.SetCirculateTitle(WfSceneConst.DEFAULTCIRCULATIONSCENE, dataContext);
        }
        #endregion

        #region 私有方法
        /// <summary>
        /// 设置流程参数
        /// </summary> 
        private void SetApplicationRumtimeParameter(ReimbursementApplicationViewModel viewModel, IWfActivity currentActivity)
        {
            
        }

        /// <summary>
        /// 更新代办标题
        /// </summary> 
        private void UpdateTaskTitle(IWfProcess process, ReimbursementApplicationViewModel viewModel)
        {           
        }
        #endregion
    }
}