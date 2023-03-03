using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seagull2.ReimbursementV2.TransactionData
{
    /// <summary>
    /// 过程模型行为接口
    /// </summary>
    public interface IProcessModelAdapter<T>
    {
        /// <summary>
        /// 根据资源编码加载通用表单
        /// </summary>
        T GetModel(string resourceID);

        /// <summary>
        /// 更新到过程数据
        /// </summary>
        void UpdateToProcessData(T form);

        /// <summary>
        /// 更新到结果数据，如果一个过程模型没有更新到结果数据的情况要在XML注释中备注清楚
        /// </summary>
        void UpdateToResultData(T form);

        /// <summary>
        /// 更新到结果数据，如果一个过程模型没有更新到主题数据的情况要在XML注释中备注清楚
        /// </summary>
        void UpdateToMasterData(T form);

        /// <summary>
        /// 作废过程数据
        /// </summary>
        void CancelToProcessData(T form);
    }
}
