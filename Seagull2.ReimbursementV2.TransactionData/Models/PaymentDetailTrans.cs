using MCS.Library.Core;
using MCS.Library.Data.Builder;
using MCS.Library.Data.DataObjects;
using MCS.Library.Data.Mapping;
using MCS.Library.SOA.DataObjects;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
namespace Seagull2.ReimbursementV2.TransactionData
{
    /// <summary>
    /// 报销明细主体内容
    /// </summary>
    [Serializable]
    [ORTableMapping("Payment.PaymentDetailTrans")]
    public class PaymentDetailTrans
    {
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("Code", PrimaryKey = true)]
        public string Code { get; set; }

        /// <summary>
        /// 报销编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("PaymentCode")]
        public string PaymentCode { get; set; }

        /// <summary>
        /// 报销类型编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("CostTypeCode")]
        public string CostTypeCode { get; set; }

        /// <summary>
        /// 报销类型
        /// </summary>
        [DataMember]
        [ORFieldMapping("CostTypeName")]
        public string CostTypeName { get; set; }

        /// <summary>
        /// 币种编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("CurrencyCode")]
        public string CurrencyCode { get; set; }

        /// <summary>
        /// 币种
        /// </summary>
        [DataMember]
        [ORFieldMapping("CurrencyName")]
        public string CurrencyName { get; set; }


        /// <summary>
        /// 原始币种金额
        /// </summary>
        [DataMember]
        [ORFieldMapping("OriginalCurrencyAmount")]
        public decimal OriginalCurrencyAmount { get; set; }

        /// <summary>
        /// 当前汇率金额（RMB）除税后
        /// </summary>
        [DataMember]
        [ORFieldMapping("CurrentCurrencyAmount")]
        public decimal CurrentCurrencyAmount { get; set; }

        /// <summary>
        /// 税率
        /// </summary>
        [DataMember]
        [ORFieldMapping("TaxRate")]
        public DateTime TaxRate { get; set; }
        /// <summary>
        /// 修改人
        /// </summary>
        [DataMember]
        [ORFieldMapping("CurrentCurrencyTax")]
        public string CurrentCurrencyTax { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        [DataMember]
        [ORFieldMapping("SortNo")]
        public bool SortNo { get; set; }
       
    }
    public class PaymentDetailTransCollection : EditableDataObjectCollectionBase<PaymentDetailTrans>
    {

    }

    public class PaymentDetailTransAdapter : UpdatableAndLoadableAdapterBase<PaymentDetailTrans, PaymentDetailTransCollection>
    {
        private PaymentDetailTransAdapter()
        {
        }

        public static readonly PaymentDetailTransAdapter Instance = new PaymentDetailTransAdapter();

        /// <summary>
        /// 获取数据库连接配置名称
        /// </summary>
        /// <returns></returns>
        protected override string GetConnectionName()
        {
            return DatabaseUtils.TRANDB_CONNECTION_STR;
        }

        /// <summary>
        /// 根据资源编码 和 类别 加载采购主数据.
        /// </summary>
        /// <param name="resourceID">资源ID</param>
        /// <returns></returns>
        public PaymentDetailTrans LoadData(string paymentCode)
        {
            return this.Load(p =>
            {
                p.AppendItem("PaymentCode", paymentCode);
            }).FirstOrDefault();
        }

    }
}