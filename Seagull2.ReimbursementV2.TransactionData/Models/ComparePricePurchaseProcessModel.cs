using MCS.Library.Core;
using MCS.Library.Principal;
using Seagull2.Owin.Material.Models;
using Seagull2.ReimbursementV2.TransactionData.Enum;
using System;
using System.Collections.Generic;

namespace Seagull2.ReimbursementV2.TransactionData
{
    public class ComparePricePurchaseProcessModel
    {
        public ComparePricePurchaseProcessModel() { }
        public ComparePricePurchaseProcessModel(string ResourceID)
        {
            this.ResourceID = ResourceID;
        }

        /// <summary>
        /// 资源编码
        /// </summary>
        public string ResourceID { get; set; }

        /// <summary>
        /// 更新操作
        /// </summary>
        public bool IsUpdate { get; set; }
       

        /// <summary>
        /// 采购基表业务主体内容
        /// </summary>
        private PaymentDetailTrans _PaymentDetailTrans = null;
        public PaymentDetailTrans PaymentDetailTrans
        {
            get
            {
                if (_PaymentDetailTrans == null)
                {
                    if (!ResourceID.IsNullOrEmpty())
                    {
                        _PaymentDetailTrans = PaymentDetailTransAdapter.Instance.LoadData(ResourceID);
                        if (_PaymentDetailTrans == null)
                        {
                            _PaymentDetailTrans = new PaymentDetailTrans();
                        }
                    }
                    else
                    {
                        _PaymentDetailTrans = new PaymentDetailTrans();
                    }

                }
                return _PaymentDetailTrans;
            }
            set
            {
                _PaymentDetailTrans = value;
            }
        }


        /// <summary>
        /// 文件列表
        /// </summary>
        private List<ClientFileInformation> _ClientFileList = null;
        public List<ClientFileInformation> ClientFileList
        {
            get
            {
                if (IsUpdate) { return _ClientFileList; }
                if (_ClientFileList == null)
                {
                    if (!ResourceID.IsNullOrEmpty())
                    {
                        if (_ClientFileList == null)
                        {
                            _ClientFileList = new List<ClientFileInformation>();
                        }
                    }
                    else
                    {
                        _ClientFileList = new List<ClientFileInformation>();
                    }
                }
                return _ClientFileList;
            }
            set
            {
                _ClientFileList = value;
            }
        }
        
    }

    public class ComparePricePurchaseProcessModelAdapter : IProcessModelAdapter<ComparePricePurchaseProcessModel>
    {
        public ComparePricePurchaseProcessModelAdapter() { }

        public static readonly ComparePricePurchaseProcessModelAdapter Instance = new ComparePricePurchaseProcessModelAdapter();

        #region 不用实现的接口
        public void CancelToProcessData(ComparePricePurchaseProcessModel form)
        {
            throw new NotImplementedException();
        }

        public void UpdateToMasterData(ComparePricePurchaseProcessModel form)
        {
            throw new NotImplementedException();
        }
        #endregion

        /// <summary>
        /// 根据资源编码获取比价采购数据
        /// </summary>
        /// <param name="resourceID"></param>
        /// <returns></returns>
        public ComparePricePurchaseProcessModel InitModel(string resourceID)
        {
            ComparePricePurchaseProcessModel model = new ComparePricePurchaseProcessModel(resourceID);
            return model;
        }

        /// <summary>
        /// 根据资源编码获取比价采购数据
        /// </summary>
        /// <param name="resourceID"></param>
        /// <returns></returns>
        public ComparePricePurchaseProcessModel GetModel(string resourceID)
        {
            ComparePricePurchaseProcessModel processModel = new ComparePricePurchaseProcessModel(resourceID);
            return processModel;
        }

        /// <summary>
        /// 更新通用行为主体行为状态
        /// </summary>
        /// <param name="state"></param>
        /// <param name="data"></param>
        public void UpdateFormAction(ComparePricePurchaseProcessModel data)
        {            
        
        }

   

        #region 更新至过程库
        public void UpdateToProcessData(ComparePricePurchaseProcessModel form)
        {          
        
        }
        #endregion

        #region 更新至结果库
        /// <param name="form"></param>
        public void UpdateToResultData(ComparePricePurchaseProcessModel form)
        {
           
        }
        #endregion
    }
}
