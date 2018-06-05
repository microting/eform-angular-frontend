using System.Collections.Generic;
using System.Web.Http;
using EformBase.Pn.Infrastructure;

namespace Test.Pn.Controllers
{
    public class TestController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        [Route("api/test/tags")]
        public List<object> GetAllTags()
        {

            var core = _coreHelper.GetCore();
            var tags = core.GetAllTags(false);
            var model = new List<object>(tags.Count);
            tags.ForEach(tag =>
            {
                model.Add(new
                {
                    tag.Id,
                    tag.Name,
                });
            });
            return model;

        }
    }
}
