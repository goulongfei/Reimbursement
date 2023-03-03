using Seagull2.Owin.Material.Models;
using Seagull2.ReimbursementV2.TransactionData;
using Seagull2.ReimbursementV2.WebApi.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seagull2.ReimbursementV2.WebApi
{
    /// <summary>
    /// 比价采购-审批
    /// </summary>
    public class ComparePricePurchaseApprovalViewModel : ComparePricePurchaseCommonViewModel
    {
    }

    public class ComparePricePurchaseApprovalViewModelAdapter : IWfViewModelAdapter<ComparePricePurchaseApprovalViewModel>
    {
        private ComparePricePurchaseApprovalViewModelAdapter(){}

        public static readonly ComparePricePurchaseApprovalViewModelAdapter Instance = new ComparePricePurchaseApprovalViewModelAdapter();

        #region IWfViewModelAdapter 接口实现
        public ComparePricePurchaseApprovalViewModel GetViewModel(string resourceID)
        {
            ComparePricePurchaseProcessModel data = ComparePricePurchaseProcessModelAdapter.Instance.GetModel(resourceID);
            ComparePricePurchaseApprovalViewModel viewModel = CopyFromData(data);
            return viewModel;
        }

        public void UpdateToProcessData(ComparePricePurchaseApprovalViewModel viewModel)
        {
           
        }

        public void UpdateToResultData(ComparePricePurchaseApprovalViewModel viewModel)
        {
          
        }
        #endregion

        #region 不用实现的接口
        public void CancelToProcessData(ComparePricePurchaseApprovalViewModel viewModel)
        {
            throw new NotImplementedException();
        }

        public void FixViewModel(ComparePricePurchaseApprovalViewModel viewModel)
        {
            throw new NotImplementedException();
        }

        public ComparePricePurchaseApprovalViewModel InitViewModel(string resourceID)
        {
            throw new NotImplementedException();
        }        
        #endregion

        #region 私有方法
        public ComparePricePurchaseApprovalViewModel CopyFromData(ComparePricePurchaseProcessModel data)
        {
           
            return null;
        }

        public ComparePricePurchaseProcessModel CopyToData(ComparePricePurchaseApprovalViewModel viewModel)
        {
            
            return null;
        }
        #endregion
    }
}
