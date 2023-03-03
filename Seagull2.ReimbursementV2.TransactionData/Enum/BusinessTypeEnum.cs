using MCS.Library.Core;

namespace Seagull2.ReimbursementV2.TransactionData.Enum
{
    public enum BusinessTypeEnum
    {
        /// <summary>
        /// 默认值
        /// </summary>
        [EnumItemDescription("默认值")]
        None = 0,

        /// <summary>
        /// 非项目服务类
        /// </summary>
        [EnumItemDescription("非项目服务类")]
        NotProject = 1,

        /// <summary>
        /// 固定资产采购类
        /// </summary>
        [EnumItemDescription("固定资产采购类")]
        FixedAssets = 2,

        /// <summary>
        /// 项目定义服务类
        /// </summary>
        [EnumItemDescription("项目定义服务类")]
        ProjectDefine = 4,

        /// <summary>
        /// 项目实施服务类
        /// </summary>
        [EnumItemDescription("项目实施服务类")]
        Implement = 5,

        /// <summary>
        /// 工程采购类
        /// </summary>
        [EnumItemDescription("工程采购类")]
        Engineering = 6,

        /// <summary>
        /// 营销类
        /// </summary>
        [EnumItemDescription("营销类")]
        Marketing = 7,

        /// <summary>
        /// 土地开发类
        /// </summary>
        [EnumItemDescription("土地开发类")]
        LandDevelop = 8,

        /// <summary>
        /// 第三方维保类 
        /// </summary>
        [EnumItemDescription("第三方维保类")]
        Maintenance = 9,

        /// <summary>
        /// 非开发运营类 
        /// </summary>
        [EnumItemDescription("非开发运营类")]
        BusinessOperations = 10,
    }
}
