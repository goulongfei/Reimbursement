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
    [ORTableMapping("Payment.Currency")]
    public class Currency
    {
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("Code", PrimaryKey = true)]
        public string Code { get; set; }

        /// <summary>
        /// 币种
        /// </summary>
        [DataMember]
        [ORFieldMapping("CnName")]
        public string CnName { get; set; }

        /// <summary>
        /// 与RMB汇率
        /// </summary>
        [DataMember]
        [ORFieldMapping("ExchangeRate")]
        public decimal ExchangeRate { get; set; }

        /// <summary>
        /// 排序号
        /// </summary>
        [DataMember]
        [ORFieldMapping("SortNo")]
        public int SortNo { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        [DataMember]
        [ORFieldMapping("CreateTime")]
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// 生效时间
        /// </summary>
        [DataMember]
        [ORFieldMapping("ModifyTime")]
        public DateTime? ModifyTime { get; set; }

    }
    public class CurrencyCollection : EditableDataObjectCollectionBase<Currency>
    {

    }

    public class CurrencyAdapter : UpdatableAndLoadableAdapterBase<Currency, CurrencyCollection>
    {
        private CurrencyAdapter()
        {
        }

        public static readonly CurrencyAdapter Instance = new CurrencyAdapter();

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
        public Currency LoadData(string code)
        {
            return this.Load(p =>
            {
                p.AppendItem("Code", code);
                p.AppendItem("ValidStatus", true);
            }).FirstOrDefault();
        }

    }
}