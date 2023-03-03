using MCS.Library.Core;
using MCS.Library.Principal;
using Seagull2.Owin.Material.Models;
using Seagull2.ReimbursementV2.TransactionData;
using Seagull2.ReimbursementV2.WebApi.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using master = SinoOcean.Seagull2.Framework.MasterData;
using System.Web.Http.ModelBinding;

namespace Seagull2.ReimbursementV2.WebApi
{
    /// <summary>
    /// 比价采购-采购申请
    /// </summary>
    public class ComparePricePurchaseApplicationViewModel : ComparePricePurchaseCommonViewModel
    {
        /// <summary>
        /// 表单选项
        /// </summary>
        public object Option { get; set; }
    }

    /// <summary>
    /// 比价采购-采购申请视图模型适配器
    /// </summary>
    public class ComparePricePurchaseApplicationViewModelAdapter : IWfViewModelAdapter<ComparePricePurchaseApplicationViewModel>
    {
        private ComparePricePurchaseApplicationViewModelAdapter() { }

        public static readonly ComparePricePurchaseApplicationViewModelAdapter Instance = new ComparePricePurchaseApplicationViewModelAdapter();

        #region IWfViewModelAdapter 接口实现
        public void FixViewModel(ComparePricePurchaseApplicationViewModel viewModel)
        {

        }

        public ComparePricePurchaseApplicationViewModel InitViewModel(string resourceID)
        {
            ComparePricePurchaseProcessModel data = ComparePricePurchaseProcessModelAdapter.Instance.InitModel(resourceID);
            ComparePricePurchaseApplicationViewModel viewModel = CopyFromData(data);
            return viewModel;
        }

        public ComparePricePurchaseApplicationViewModel GetViewModel(string resourceID)
        {
            ComparePricePurchaseProcessModel data = ComparePricePurchaseProcessModelAdapter.Instance.GetModel(resourceID);
            ComparePricePurchaseApplicationViewModel viewModel = CopyFromData(data);
            return viewModel;
        }

        public void UpdateToProcessData(ComparePricePurchaseApplicationViewModel viewModel)
        {
        }
        #endregion

        #region 不用实现的接口
        public void CancelToProcessData(ComparePricePurchaseApplicationViewModel viewModel)
        {
            throw new NotImplementedException();
        }

        public void UpdateToResultData(ComparePricePurchaseApplicationViewModel viewModel)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region 公共方法
        /// <summary>
        /// 获取表单选项
        /// </summary>
        /// <returns></returns>
        public object GetOption(ComparePricePurchaseApplicationViewModel viewModel)
        {

            return null;
        }
        #endregion

        #region 私有方法
        public ComparePricePurchaseApplicationViewModel CopyFromData(ComparePricePurchaseProcessModel data)
        {
           
           
            return null;
        }

        public ComparePricePurchaseProcessModel CopyToData(ComparePricePurchaseApplicationViewModel viewModel)
        {
           
            return null;
        }
        #endregion
    }
}
