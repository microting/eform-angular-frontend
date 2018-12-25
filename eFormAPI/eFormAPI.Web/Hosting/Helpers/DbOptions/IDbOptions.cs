using System;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace eFormAPI.Web.Hosting.Helpers.DbOptions
{
    public interface IDbOptions<out T> : IOptionsSnapshot<T> where T : class, new()
    {
        void Update(DbContextOptionsBuilder<BaseDbContext> dbContextOptionsBuilder, Action<T> applyChanges);
    }
}