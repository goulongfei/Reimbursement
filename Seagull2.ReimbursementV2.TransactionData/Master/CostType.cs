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
    /// 报销类型
    /// </summary>
    [Serializable]
    [ORTableMapping("Payment.CostType")]
    public class CostType
    {
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("Code", PrimaryKey = true)]
        public string Code { get; set; }

        /// <summary>
        /// 报销类型
        /// </summary>
        [DataMember]
        [ORFieldMapping("CnName")]
        public string CnName { get; set; }


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

        /// <summary>
        /// 税率
        /// </summary>
        [DataMember]
        [ORFieldMapping("TaxRate")]
        public decimal TaxRate { get; set; }


    }
    public class CostTypeCollection : EditableDataObjectCollectionBase<CostType>
    {

    }

    public class CostTypeAdapter : UpdatableAndLoadableAdapterBase<CostType, CostTypeCollection>
    {
        private CostTypeAdapter()
        {
        }

        public static readonly CostTypeAdapter Instance = new CostTypeAdapter();

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
        public CostType LoadData(string Code)
        {
            return this.Load(p =>
            {
                p.AppendItem("Code", Code);
                p.AppendItem("ValidStatus", true);
            }).FirstOrDefault();
        }

    }
}