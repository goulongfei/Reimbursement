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
    [ORTableMapping("Payment.EmployeeGatherInfo")]
    public class EmployeeGatherInfo
    {
        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("Code", PrimaryKey = true)]
        public string Code { get; set; }

        /// <summary>
        /// 编码
        /// </summary>
        [DataMember]
        [ORFieldMapping("EmployeeCode")]
        public string EmployeeCode { get; set; }

        /// <summary>
        /// 币种
        /// </summary>
        [DataMember]
        [ORFieldMapping("Bank")]
        public string Bank { get; set; }

        /// <summary>
        /// 银行卡账号
        /// </summary>
        [DataMember]
        [ORFieldMapping("Account")]
        public decimal Account { get; set; }

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
    public class EmployeeGatherInfoCollection : EditableDataObjectCollectionBase<EmployeeGatherInfo>
    {

    }

    public class EmployeeGatherInfoAdapter : UpdatableAndLoadableAdapterBase<EmployeeGatherInfo, EmployeeGatherInfoCollection>
    {
        private EmployeeGatherInfoAdapter()
        {
        }

        public static readonly EmployeeGatherInfoAdapter Instance = new EmployeeGatherInfoAdapter();

        /// <summary>
        /// 获取数据库连接配置名称
        /// </summary>
        /// <returns></returns>
        protected override string GetConnectionName()
        {
            return DatabaseUtils.TRANDB_CONNECTION_STR;
        }       

    }
}