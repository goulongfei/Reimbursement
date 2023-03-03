namespace Seagull2.ReimbursementV2.TransactionData
{
    /// <summary>
    /// 场景常量
    /// </summary>
    public class WfSceneConst
    {
        #region 采购通用的场景
        /// <summary>
        /// 默认场景
        /// </summary>
        public const string DEFAULTSCENE = "DefaultScene";
        /// <summary>
        /// 默认只读场景
        /// </summary>
        public const string DEFAULTREADONLYSCENE = "DefaultReadOnlyScene";
        /// <summary>
        /// 拟单
        /// </summary>
        public const string DRAFT = "Draft";
        /// <summary>
        /// 拟单只读
        /// </summary>
        public const string DRAFTREADONLY = "DraftReadOnly";

        /// <summary>
        /// 采购审批
        /// </summary>
        public const string PURCHASEAPPROVAL = "PurchaseApproval";
        /// <summary>
        /// 采购审批只读
        /// </summary>
        public const string PURCHASEAPPROVALREADONLY = "PurchaseApprovalReadOnly";
        /// <summary>
        /// 申请
        /// </summary>
        public const string APPLICATION = "Application";

        /// <summary>
        /// 申请只读
        /// </summary>
        public const string APPLICATIONREADONLY = "ApplicationReadOnly";

        /// <summary>
        /// 预算审计审批
        /// </summary>
        public const string AUDITAPPROVAL = "AuditApproval";

        /// <summary>
        /// 预算审计审批只读
        /// </summary>
        public const string AUDITAPPROVALREADONLY = "AuditApprovalReadOnly";

        /// <summary>
        /// 传阅场景
        /// </summary>
        public const string DEFAULTCIRCULATIONSCENE = "DefaultCirculationScene";

        /// <summary>
        /// 商务评标传阅
        /// </summary>
        public const string DEFAULTBUSINESSEVALUTECIRCULATIONSCENE = "DefaultBusinessEvaluteCirculationScene";

        /// <summary>
        /// 技术评标传阅
        /// </summary>
        public const string DEFAULTTECHNOLOGYEVALUTECIRCULATIONSCENE = "DefaultTechnologyEvaluteCirculationScene";
        /// <summary>
        /// 审批
        /// </summary>
        public const string APPROVAL = "Approval";
        /// <summary>
        /// 审批
        /// </summary>
        public const string APPROVALEDIT = "ApprovalEdit";
        #endregion
    }
}