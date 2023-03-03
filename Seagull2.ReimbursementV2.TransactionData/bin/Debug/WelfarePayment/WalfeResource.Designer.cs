﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace SinoOcean.Seagull2.Framework.MasterData.WelfarePayment {
    using System;
    
    
    /// <summary>
    ///   一个强类型的资源类，用于查找本地化的字符串等。
    /// </summary>
    // 此类是由 StronglyTypedResourceBuilder
    // 类通过类似于 ResGen 或 Visual Studio 的工具自动生成的。
    // 若要添加或移除成员，请编辑 .ResX 文件，然后重新运行 ResGen
    // (以 /str 作为命令选项)，或重新生成 VS 项目。
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class WalfeResource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal WalfeResource() {
        }
        
        /// <summary>
        ///   返回此类使用的缓存的 ResourceManager 实例。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("SinoOcean.Seagull2.Framework.MasterData.WelfarePayment.WalfeResource", typeof(WalfeResource).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   重写当前线程的 CurrentUICulture 属性，对
        ///   使用此强类型资源类的所有资源查找执行重写。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   查找类似 SELECT [Code]
        ///      ,[EmployeeCode]
        ///      ,[GenderCode]
        ///      ,[CnName]
        ///      ,[Birthday]
        ///  FROM {1}
        ///  where VersionEndTime is null and Code in({0}) 的本地化字符串。
        /// </summary>
        internal static string CmiChildrenSql {
            get {
                return ResourceManager.GetString("CmiChildrenSql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 SELECT    eba.BankAccount,eba.EmployeeCode,b.CnName as BankName,ebap.CardPurposeTypeCode
        ///FROM  {3} as eba INNER JOIN
        ///                       {4} as ebap ON eba.Code = ebap.EmployeeBankAccountCode
        ///                      inner join  {5} as b on b.Code =eba.BankCode
        ///WHERE     ebap.CardPurposeTypeCode in (&apos;{0}&apos;,&apos;{1}&apos;) AND (eba.VersionEndTime IS NULL) AND 
        ///                      (ebap.VersionEndTime IS NULL) and b.ValidStatus=1 and  eba.EmployeeCode IN ({2}) 的本地化字符串。
        /// </summary>
        internal static string CmiEmpBankInfoSql {
            get {
                return ResourceManager.GetString("CmiEmpBankInfoSql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 SELECT     e.Code as EmployeeCode, e.WorkEmail, 
        ///p.GenderCode, p.Birthday, 
        ///p.IdentityCardCode, e.WorkAddress,
        ///(    select top 1 a.CnName from 
        ///                    {10} AC
        ///                   inner join  {5}  a
        ///                   on a.code = AC.WelfarePaymentAddressCode
        ///                   inner join  {6} ec
        ///                   on ec.CorporationCode = AC.CorporationCode
        ///                   inner join  {7} hc
        ///                   on hc.CorporationCode =ec.CorporationCode
        ///				   INNER JOIN {3} unit ON hc [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string CmiEmpInfoExtSql {
            get {
                return ResourceManager.GetString("CmiEmpInfoExtSql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 SELECT A.*,B.PaymentBase as LastPaymentBase FROM ({0}) as A Left outer join ({1}) as B ON B.EmployeeCode =A.EmployeeCode 的本地化字符串。
        /// </summary>
        internal static string FormartOuterJoin {
            get {
                return ResourceManager.GetString("FormartOuterJoin", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 select 
        ///eci.EmployeeCode,
        ///ecc.InsuranceCost,
        ///cic.CnName as CmiCategory,
        ///cic.Code  as CmiCategoryCode
        ///,cit.Code  
        ///,cit.CnName  
        ///,cit.CostStandard 
        ///,ecc.VersionStartTime
        ///from
        ///EmpService.EmployeeCommercialInsuranceInfo AS eci 
        ///INNER JOIN EmpService.Employee_CommercialInsuranceInsureType_CommercialInsuranceCategory ecc 
        ///ON ecc.EmployeeCommercialInsuranceInfoCode = eci.Code
        ///inner join EmpService.CommercialInsuranceInsureType_CommercialInsuranceCategory cc
        ///on cc.Code=ecc.CommercialInsuranceInsureTyp [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string GetEmpCmiListByYearMonthCmiType_Sql {
            get {
                return ResourceManager.GetString("GetEmpCmiListByYearMonthCmiType_Sql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 SELECT  ec.EmployeeCode, hc.HRMgmtUnitCode,ec.CorporationCode,c.CnName as CorporationName
        ///FROM {2} as  ec INNER JOIN
        ///  {3} as e ON ec.EmployeeCode = e.Code INNER JOIN
        ///  {4} as c ON ec.CorporationCode = c.Code INNER JOIN
        ///  {5} as hc ON c.Code = hc.CorporationCode
        ///WHERE ec.ValidStatus = 1 AND c.ValidStatus = 1 AND ec.VersionEndTime is null AND e.VersionEndTime is null AND hc.ValidStatus = 1 AND 
        ///hc.HRMgmtUnitCode = {0} AND ec.HRManageUnitFunctionCode = &apos;{1}&apos; 的本地化字符串。
        /// </summary>
        internal static string HRUnitOfEmployeeInWalfeFunction_Sql {
            get {
                return ResourceManager.GetString("HRUnitOfEmployeeInWalfeFunction_Sql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 SELECT e.EmployeeCode,e.EmployeeName,e.VocationLevel,hc.CorporationName, 
        ///hc.CorporationCode,e.LoginName, /*hc.HRManageUnitFunctionCode,*/ e.EmployeeNo,
        ///    hc.WelfareChangeInType, hc.WelfareChangeOutType
        ///    WelfareChangeInType, hc.WelfareChangeOutType
        /// FROM      ( Select e.Code As EmployeeCode,u.LOGON_NAME As LoginName,isnull(p.CnName,u.DISPLAY_NAME) As EmployeeName
        ///                      ,e.VocationLevel,e.EmployeeIDNumber as EmployeeNo                     
        ///                      From  {3} e 
        ///       [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string LoadCompanyAndEmployeeDataSql {
            get {
                return ResourceManager.GetString("LoadCompanyAndEmployeeDataSql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似  
        /// update   {4} set 
        /// {4} .VersionEndTime=&apos;{2}&apos;
        /// from
        /// (
        /// select cc.Code from
        ///   {5} as cc
        /// inner join  {6} as c
        /// on c.Code =cc.CommercialInsuranceInsureTypeCode
        /// where cc.VersionEndTime is null and {3}
        /// ) as a
        ///where a.Code=
        ///{4}.CommercialInsuranceInsureType_CommercialInsuranceCategoryCode 
        ///and  {4}.VersionEndTime is null AND  EmployeeCode in (select ec.EmployeeCode from  {7} as ec INNER JOIN  {8}  as  hc 
        ///                      ON ec.CorporationCode = hc.CorporationCode where hc.HRMgmtUnitCode [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string UpdateEmpCmiTypeCategoryVersionEndTimeSql {
            get {
                return ResourceManager.GetString("UpdateEmpCmiTypeCategoryVersionEndTimeSql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 select distinct
        ///eeci.EmployeeCode
        ///,eeci.PaymentBase
        ///from EmpService.EmployeeExtendCommercialInsuranceInfo as eeci
        ///
        ///where (eeci.HasQuit=0 or eeci.HasQuit is null)
        ///and eeci.ValidStatus=1
        ///and eeci.EffectiveDate&lt;{0}
        /// AND NOT exists(select 1 FROM  EmpService.EmployeeExtendCommercialInsuranceInfo
        ///  as a1 WHERE a1.EmployeeCode =eeci.EmployeeCode AND a1.VersionStartTime&gt;eeci.VersionStartTime
        ///and a1.EffectiveDate&lt;{0}
        /// and (a1.HasQuit=0 or a1.HasQuit is null)
        /// ) 的本地化字符串。
        /// </summary>
        internal static string WelfareReportCpAdapter_Last_Sql {
            get {
                return ResourceManager.GetString("WelfareReportCpAdapter_Last_Sql", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 select distinct
        ///eeci.Code
        ///,ec.CorporationCode,
        ///c.CnName as CorporationName
        ///,eeci.EmployeeCode
        ///,ISNULL(p.CnName,u.DISPLAY_NAME) as EmployeeName
        ///,eeci.CostCenterCode
        ///,eeci.InsuranceCompanyCode
        ///,eeci.WelfareTypeCode
        ///,eeci.WelfareChangetTypeCode
        ///,eeci.PaymentBase
        ///,eeci.PaymentPercent
        ///,eeci.PaymentStartDate
        ///,eeci.PaymentEndDate
        ///,eeci.ChangeDate
        ///,eeci.EffectiveDate
        ///,eeci.VersionStartTime
        ///,eeci.VersionEndTime
        ///from EmpService.EmployeeExtendCommercialInsuranceInfo as eeci
        ///inner join EmpService.Emp [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string WelfareReportCpAdapter_Load_Sql {
            get {
                return ResourceManager.GetString("WelfareReportCpAdapter_Load_Sql", resourceCulture);
            }
        }
    }
}
