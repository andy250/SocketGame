using System.Web.Mvc;

namespace space.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            if (Session["user"] != null)
            {
                return RedirectToAction("Game");
            }
            else
            {
                return View();
            }
        }

        [HttpPost]
        public ActionResult SaveUser()
        {
            if (Request.Form["user"] != null)
            {
                Session["user"] = Request.Form["user"];
                return RedirectToAction("Game");
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        public ActionResult Game()
        {
            ViewData.Model = Session["user"];
            return View();
        }

        public ActionResult Logout()
        {
            Session["user"] = null;
            return RedirectToAction("Index");
        }

        public JsonResult Health()
        {
            return Json(100, JsonRequestBehavior.AllowGet);
        }
    }
}