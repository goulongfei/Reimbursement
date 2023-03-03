using MCS.Library.SOA.DataObjects;
using MCS.Library.SOA.DataObjects.Workflow;
using Newtonsoft.Json;
using Seagull2.Owin.Workflow.Controller;
using Seagull2.ReimbursementV2.TransactionData;
using System;
using System.Web.Http;

namespace Seagull2.ReimbursementV2.WebApi
{
    /// <summary>
    /// 比价采购--审批
    /// </summary>
    [Route("ComparePricePurchaseApprovalWf")]
    public class ComparePricePurchaseApprovalWfController : WfApiController
    {
        #region 场景与意见 
        protected override string GetDefaultWorkflowSceneId(IWfActivity currentActivity)
        {
            return "DefaultScene";
        }

        protected override string GetDefaultReadOnlySceneId(IWfActivity currentActivity)
        {
            return "DefaultReadOnlyScene";
        }

        protected override bool HasOpinion(IWfActivity currentActivity, string sceneId)
        {
            return true;
        }
        #endregion

        #region Open
        protected override object LoadViewModel(IWfActivity currentActivity, string sceneId)
        {
            ComparePricePurchaseApprovalViewModel viewModel = ComparePricePurchaseApprovalViewModelAdapter.Instance.GetViewModel(currentActivity.RootActivity.Process.ResourceID);
            return viewModel;
        }
        #endregion

        #region Save
        protected override void SaveExecutorBeforeExecute(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
        }

        protected override object SaveExecutorPrepareApplicationData(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput == null)
            {
                return null;
            }
            ComparePricePurchaseApprovalViewModel viewModel = JsonConvert.DeserializeObject<ComparePricePurchaseApprovalViewModel>(dataInput);
            return viewModel;
        }

        protected override void SaveExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {
        }
        #endregion

        #region MoveTo
        protected override void MoveToExecutorBeforeExecute(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
        }

        protected override object MoveToExecutorPrepareApplicationData(string dataInput, string sceneId, WfExecutorDataContext dataContext)
        {
            if (dataInput == null)
            {
                return null;
            }
            ComparePricePurchaseApprovalViewModel viewModel = JsonConvert.DeserializeObject<ComparePricePurchaseApprovalViewModel>(dataInput);
            return viewModel;
        }

        protected override void MoveToExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {

        }

        #endregion

        #region 传阅
        protected override void CirculateExecutorSaveApplicationData(object dataSource, string sceneId, WfExecutorDataContext dataContext)
        {
            CirculatorHelper.SetCirculateTitle(sceneId, dataContext);
        }
        #endregion

        #region 私有方法
       

        #endregion
    }
}
