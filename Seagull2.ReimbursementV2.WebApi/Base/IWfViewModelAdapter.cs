namespace Seagull2.ReimbursementV2.WebApi.Base
{
    /// <summary>
    /// 流程视图模型适配器接口
    /// </summary>
    public interface IWfViewModelAdapter<T>
    {
        /// <summary>
        /// 根据资源编码加载视图模型
        /// </summary>
        T GetViewModel(string resourceID);

        /// <summary>
        /// 首次初始化视图模型，如果需要首次进行一次初始化操作，请封装在此接口中
        /// </summary>
        T InitViewModel(string resourceID);

        /// <summary>
        /// 修正视图模型
        /// </summary>
        void FixViewModel(T viewModel);

        /// <summary>
        /// 更新到过程数据
        /// </summary>
        void UpdateToProcessData(T viewModel);

        /// <summary>
        /// 更新到结果数据
        /// </summary>
        void UpdateToResultData(T viewModel);

        ///// <summary>
        ///// 更新到主题数据
        ///// </summary>
        //void UpdateToMasterData(T viewModel);

        void CancelToProcessData(T viewModel);
    }
}