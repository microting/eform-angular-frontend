using System;
using Microsoft.Extensions.Options;

namespace eFormAPI.BasePn.Helpers.WritableOptions
{
    public interface IWritableOptions<out T> : IOptionsSnapshot<T> where T : class, new()
    {
        void Update(Action<T> applyChanges);
    }
}