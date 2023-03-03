using MCS.Library.Core;
using Seagull2.Owin.Material.Models;
using System;
using System.Collections.Generic;
using Seagull2.ReimbursementV2.TransactionData;
using Seagull2.ReimbursementV2.WebApi.Base;

namespace Seagull2.ReimbursementV2.WebApi.Models
{
    public class ReimbursementApplicationViewModel
    {

        public ReimbursementApplicationViewModel() { }
        public ReimbursementApplicationViewModel(string paymentCode)
        {
            this.PaymentCode = paymentCode;
        }
        //报销人、报销组织、申请日期、收款信息, 报销本币总额（计算项），报销明细、附件.

        public string PaymentCode { get; set; }

        /// <summary>
        /// 表单选项
        /// </summary>
        public object Option { get; set; }

        /// <summary>
        /// 报销人编码
        /// </summary>
        public PaymentDetailTrans ApplicantUserCode { get; set; }

        /// <summary>
        /// 报销人
        /// </summary>
        public PaymentDetailTrans ApplicantUserName { get; set; }


        /// <summary>
        /// 报销组织编码
        /// </summary>
        public PaymentDetailTrans ApplyOrgCode { get; set; }

        /// <summary>
        /// 报销组织
        /// </summary>
        public PaymentDetailTrans ApplyOrgName { get; set; }

        /// <summary>
        /// 收款信息
        /// </summary>
        public List<EmployeeGatherInfo> GatherInfo { get; set; }

        /// <summary>
        /// 报销本币总额
        /// </summary>
        public PaymentDetailTrans CurrentCurrencyAmount { get; set; }


        /// <summary>
        /// 报销明细
        /// </summary>
        private PaymentDetailTrans _PaymentDetailTrans = null;
        public PaymentDetailTrans PaymentDetailTrans
        {
            get
            {
                if (_PaymentDetailTrans == null)
                {
                    if (!PaymentCode.IsNullOrEmpty())
                    {
                        _PaymentDetailTrans = PaymentDetailTransAdapter.Instance.LoadData(PaymentCode);
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
        /// 附件
        /// </summary>
        public List<ClientFileInformation> ClientFileList { get; set; }
    }

    public class ReimbursementApplicationViewModelAdapter : IWfViewModelAdapter<ReimbursementApplicationViewModel>
    {
        public ReimbursementApplicationViewModelAdapter() { }

        public static readonly ReimbursementApplicationViewModelAdapter Instance = new ReimbursementApplicationViewModelAdapter();

        /// <summary>
        /// 根据资源编码获取比价采购数据
        /// </summary>
        /// <param name="resourceID"></param>
        /// <returns></returns>
        public ReimbursementApplicationViewModel InitViewModel(string resourceID)
        {
            return null;
        }
        public ReimbursementApplicationViewModel GetViewModel(string resourceID)
        {
            return null;
        }
        public void UpdateToProcessData(ReimbursementApplicationViewModel form)
        {
            throw new NotImplementedException();
        }

        public void UpdateToResultData(ReimbursementApplicationViewModel form)
        {
            throw new NotImplementedException();
        }

        public void UpdateToMasterData(ReimbursementApplicationViewModel form)
        {
            throw new NotImplementedException();
        }

        public void CancelToProcessData(ReimbursementApplicationViewModel form)
        {
            throw new NotImplementedException();
        }

        public void FixViewModel(ReimbursementApplicationViewModel viewModel)
        {
            throw new NotImplementedException();
        }
    }
    }