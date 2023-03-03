using Seagull2.Owin.Material.Models;
using System.Collections.Generic;

namespace Seagull2.ReimbursementV2.WebApi
{
    public class ComparePricePurchaseCommonViewModel
    {
        /// <summary>
        /// 资源编码
        /// </summary>
        public string ResourceID { get; set; }

        /// <summary>
        /// 结果编码
        /// </summary>
        public string ResultCode { get; set; }

       

        /// <summary>
        /// 附件数据
        /// </summary>
        public List<ClientFileInformation> ClientFileList { get; set; }
    }

    public class ComparePricePurchaseCommonViewModelAdapter
    {
        public static readonly ComparePricePurchaseCommonViewModelAdapter Instance = new ComparePricePurchaseCommonViewModelAdapter();

        /// <summary>
        /// 作废流程
        /// </summary>
        /// <param name="viewModel"></param>
        public void DoAborted(ComparePricePurchaseCommonViewModel viewModel)
        {
            //FormActionAdapter.Instance.UpdateFormActionStatus(viewModel.ResourceID, FormActionStateEnum.Aborted);
        }        
    }
}