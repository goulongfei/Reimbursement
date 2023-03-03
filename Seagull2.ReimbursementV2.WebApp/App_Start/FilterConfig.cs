using System.Web;
using System.Web.Mvc;

namespace Seagull2.ReimbursementV2.WebApp
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
