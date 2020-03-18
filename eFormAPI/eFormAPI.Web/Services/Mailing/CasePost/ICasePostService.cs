namespace eFormAPI.Web.Services.Mailing.CasePost
{
    using System.Threading.Tasks;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface ICasePostService
    {
        Task<OperationDataResult<CasePostsListModel>> GetAllPosts(
            CasePostsRequest requestModel);

        Task<OperationDataResult<CasePostViewModel>> GetPostForView(
            int id);

        Task<OperationResult> CreatePost(
            CasePostCreateModel requestModel);
    }
}