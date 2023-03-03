using MCS.Library.Core;
using MCS.Library.OGUPermission;
using MCS.Library.Principal;
using MCS.Library.SOA.DataObjects;
using MCS.Library.SOA.DataObjects.Workflow;
using MCS.Web.Library.MVC;
using System.Collections.Generic;
using System.Linq;
using System;
            

namespace Seagull2.ReimbursementV2.TransactionData
{
    public class CirculatorHelper
    {
        /// <summary>
        /// 设置传阅的场景
        /// </summary>
        public static void SetCirculateScene()
        {
            if (WfClientContext.Current.CurrentActivity != null
                && WfClientContext.Current.CurrentActivity.Process.Descriptor.Key == WfProcessDescriptorManager.DefaultCirculationProcessKey)
            {
                string currentScene = WfClientContext.Current.CurrentActivity.Descriptor.InheritedReadOnlyScene;
                WfClientContext.Current.CurrentActivity.Descriptor.Properties.TrySetValue("Scene", currentScene);
                WfClientContext.Current.CurrentActivity.Descriptor.Properties.TrySetValue("ReadOnlyScene", currentScene);
            }
        }

        /// <summary>
        /// 设置默认参数--管理员超级撤回后参数丢失
        /// </summary>
        public static void SetDefaultParameters(bool IsGrantDiscountEnquiry = false)
        {
            IWfProcess process = WfClientContext.Current.CurrentActivity.Process;
            if (process.ApplicationRumtimeParameters["BiddingMarketingCancel"] == null)
                process.ApplicationRumtimeParameters["BiddingMarketingCancel"] = false;
            if (process.ApplicationRumtimeParameters["BiddingMaintenanceCancel"] == null)
                process.ApplicationRumtimeParameters["BiddingMaintenanceCancel"] = false;
            if (process.ApplicationRumtimeParameters["IsGrantDiscountEnquiry"] == null)
                process.ApplicationRumtimeParameters["IsGrantDiscountEnquiry"] = IsGrantDiscountEnquiry;
        }

        /// <summary>
        /// 设置传阅标题
        /// </summary>
        public static void SetCirculateTitle(string sceneId, WfExecutorDataContext dataContext)
        {
            dataContext.MoveToTasks.ForEach(f =>
            {
                if (f.Status == TaskStatus.Circularize)
                {
                    if (!f.TaskTitle.Contains("传阅："))
                    {
                        if (dataContext.CurrentProcess.ApplicationRumtimeParameters.Contains("TaskTitle"))
                        {
                            f.TaskTitle = dataContext.CurrentProcess.ApplicationRumtimeParameters["TaskTitle"].ToString() + dataContext.CurrentProcess.ApplicationRumtimeParameters["FlowNumber"].ToString();
                        }

                        f.TaskTitle = "传阅：" + f.TaskTitle;
                    }
                }
            });
            dataContext.CurrentProcess.Activities.ForEach(ra =>
            {
                ra.BranchProcessGroups.ForEach(i =>
                {
                    i.Branches.ForEach(b =>
                    {
                        if (b.Descriptor.Key == WfProcessDescriptorManager.DefaultCirculationProcessKey)
                        {
                            b.Activities.ForEach(a =>
                            {
                                WfActivityDescriptor descriptor = a.Descriptor as WfActivityDescriptor;
                                descriptor.Scene = sceneId;
                            });
                        }
                    });
                });
            });
        }


        /// <summary>
        /// 发送传阅
        /// </summary>
        /// <param name="list">传阅人列表</param>
        /// <param name="title">传阅待办标题</param>
        public static void TranslateCirculators(List<IUser> list, string title)
        {
            List<IUser> circulators = new List<IUser>();
            if (list.Any())
            {
                list.ForEach(item => circulators.Add(OguMechanismFactory.GetMechanism().GetObjects<IUser>(SearchOUIDType.Guid, item.ID).FirstOrDefault()));

                WfCirculateExecutor circulateExecutor = new WfCirculateExecutor(WfClientContext.Current.OriginalActivity, WfClientContext.Current.OriginalActivity, circulators);

                var activityDescriptor = circulateExecutor.TargetActivity.Descriptor as WfActivityDescriptor;
                activityDescriptor.Scene = WfSceneConst.DEFAULTCIRCULATIONSCENE;
                circulateExecutor.PrepareMoveToTasks += (context, tasks) =>
                {
                    tasks.ForEach(t =>
                    {
                        IWfProcess process = WfRuntime.GetProcessByProcessID(t.ProcessID);
                        if (process.Descriptor.Key == WfProcessDescriptorManager.DefaultCirculationProcessKey)
                        {
                            if (t.TaskTitle.IndexOf("传阅：") < 0)
                            {
                                t.TaskTitle = "传阅：" + title;
                            }
                        }
                    });
                };
                WfClientContext.Current.Execute(circulateExecutor);
            }
        }

        /// <summary>
        /// 发送传阅
        /// </summary>
        /// <param name="originalActivity">传阅环节</param>
        /// <param name="circulators">传阅人列表</param>
        /// <param name="title">传阅待办标题</param>
        public static void TranslateCirculatorsByActivity(IWfActivity originalActivity, List<IUser> circulators, string title)
        {
            if (circulators.Any() == false) { return; }
            {
                WfCirculateExecutor circulateExecutor = new WfCirculateExecutor(originalActivity, originalActivity, circulators);

                var activityDescriptor = circulateExecutor.TargetActivity.Descriptor as WfActivityDescriptor;
                //activityDescriptor.Scene = WfSceneConst.DEFAULTCIRCULATIONSCENE;
                circulateExecutor.PrepareMoveToTasks += (context, tasks) =>
                {
                    tasks.ForEach(t =>
                    {
                        IWfProcess process = WfRuntime.GetProcessByProcessID(t.ProcessID);
                        if (process.Descriptor.Key == WfProcessDescriptorManager.DefaultCirculationProcessKey)
                        {
                            process.CurrentActivity.Descriptor.Properties.TrySetValue("Scene", WfSceneConst.DEFAULTCIRCULATIONSCENE);
                            process.CurrentActivity.Descriptor.Properties.TrySetValue("ReadOnlyScene", WfSceneConst.DEFAULTCIRCULATIONSCENE);
                            if (t.TaskTitle.IndexOf("传阅：") < 0)
                            {
                                t.TaskTitle = "传阅：" + title;
                            }
                        }
                    });
                };
                WfClientContext.Current.Execute(circulateExecutor);
            }
        }

        public static void WorkflowCirculator(WfExecutorDataContext dataContext)
        {
            dataContext.Executor.PrepareMoveToTasks += (context, tasks) =>
            {
                foreach (UserTask item in tasks)
                {
                    if (item.Status == TaskStatus.Circularize)
                    {
                        if (!item.TaskTitle.Contains("传阅"))
                        {
                            item.TaskTitle = "传阅：" + item.TaskTitle;
                        }
                    }
                }
            };
        }
    }
}
