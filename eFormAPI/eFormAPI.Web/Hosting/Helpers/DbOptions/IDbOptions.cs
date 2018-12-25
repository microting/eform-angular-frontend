using System;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.Extensions.Options;

namespace eFormAPI.Web.Hosting.Helpers.DbOptions
{
    public interface IDbOptions<out T> : IOptionsSnapshot<T> where T : class, new()
    {
        Task UpdateDb(Action<T> applyChanges, BaseDbContext dbContext);
    }
}