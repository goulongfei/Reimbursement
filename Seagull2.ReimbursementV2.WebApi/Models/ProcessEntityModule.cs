using Seagull2.ReimbursementV2.TransactionData;
using Seagull2.ReimbursementV2.TransactionData.Enum;
using System;

namespace Seagull2.ReimbursementV2.WebApi
{
    /// <summary>
    /// 采购基表业务主体内容
    /// </summary>
    public class P_PurchaseBasePEMu
    {
        /// <summary>
        /// 编码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 资源编码
        /// </summary>
        public string ResourceID { get; set; }


        /// <summary>
        /// 创建人
        /// </summary>
        public string Creator { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// 修改人
        /// </summary>
        public string Modifier { get; set; }

        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime? ModifyTime { get; set; }

        /// <summary>
        /// 有效性
        /// </summary>
        public bool ValidStatus { get; set; }

        /// <summary>
        /// 采购名称
        /// </summary>
        public string PurchaseName { get; set; }

        /// <summary>
        /// 采购方式名称
        /// </summary>
        public string PurchaseWayName { get; set; }

        /// <summary>
        /// 采购业务类型编码
        /// </summary>
        public BusinessTypeEnum PurchaseBusinessTypeCode { get; set; }

        /// <summary>
        /// 采购业务类型名称
        /// </summary>
        public string PurchaseBusinessTypeName { get; set; }

        /// <summary>
        /// 采购金额
        /// </summary>
        public decimal? PurchaseAmount { get; set; }

        /// <summary>
        /// 预计采购金额
        /// </summary>
        public decimal? PerPurchaseAmount { get; set; }

        /// <summary>
        /// 是否无合同采购
        /// </summary>
        public bool IsNoContractPurchase { get; set; }

        /// <summary>
        /// 是否比价采购
        /// </summary>
        public bool IsComparePricePurchase { get; set; }

        /// <summary>
        /// 结果编码
        /// </summary>
        public string ResultCode { get; set; }

        /// <summary>
        ///  上游流程类型编码
        /// </summary>
        public int UpstreamProcessTypeCode { get; set; }

        /// <summary>
        ///  上游流程类型名称
        /// </summary>
        public string UpstreamProcessTypeName { get; set; }

        /// <summary>
        ///  上游流程资源编码
        /// </summary>
        public string UpstreamProcessResourceID { get; set; }

        /// <summary>
        ///  上游流程表单地址
        /// </summary>
        public string UpstreamProcessURL { get; set; }

        /// <summary>
        ///  上游流程名称
        /// </summary>
        public string UpstreamProcessName { get; set; }

        /// <summary>
        /// 上游流程指引名称
        /// </summary>
        public string UpstreamProcessGuideName { get; set; }

        /// <summary>
        /// 过程独有_是否已回标完毕	
        /// </summary> 
        public bool? IsReplyBiddingComplete { get; set; }

        /// <summary>
        /// 过程独有_是否已定标完成
        /// </summary> 
        public bool IsConfirmBiddingComplete { get; set; }

        /// <summary>
        /// 支出类型编码
        /// </summary>
        public int? ExpenditureTypeCode { get; set; }

        /// <summary>
        /// 支出类型名称
        /// </summary>
        public string ExpenditureTypeName { get; set; }

        /// <summary>
        /// 使用项目编码
        /// </summary>
        public string UseProjectCode { get; set; }

        /// <summary>
        /// 使用项目名称
        /// </summary>
        public string UseProjectName { get; set; }

        /// <summary>
        /// 使用期区编码
        /// </summary>
        public string UseStageAreaCode { get; set; }

        /// <summary>
        /// 使用期区名称
        /// </summary>
        public string UseStageAreaName { get; set; }

        /// <summary>
        /// 使用记账公司编码
        /// </summary>
        public string UseChargeCompanyCode { get; set; }

        /// <summary>
        /// 使用记账公司名称
        /// </summary>
        public string UseChargeCompanyName { get; set; }

        /// <summary>
        /// 使用成本中心编码
        /// </summary>
        public string UseCostCenterCode { get; set; }

        /// <summary>
        /// 使用成本中心名称
        /// </summary>
        public string UseCostCenterName { get; set; }

        /// <summary>
        /// 是否使用招标清单
        /// </summary>
        public bool? IsUsedTenderFile { get; set; }
    }

    /// <summary>
    /// 采购基表业务主体内容数据适配器
    /// </summary>
    public class P_PurchaseBasePEMuAdapter
    {

        public P_PurchaseBasePEMuAdapter() { }

        public static readonly P_PurchaseBasePEMuAdapter Instance = new P_PurchaseBasePEMuAdapter();

      
        }    
}