/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Services.Security
{
    public class EformPermissionsService : IEformPermissionsService
    {
        private readonly BaseDbContext _dbContext;
        private readonly IUserService _userService;

        public EformPermissionsService(BaseDbContext dbContext,
            IUserService userService)
        {
            _dbContext = dbContext;
            _userService = userService;
        }

        public async Task<bool> CheckEform(int eformId, string claimName)
        {
            if (!_userService.IsInRole(EformRole.Admin))
            {
                var result = await _dbContext
                    .EformInGroups
                    .Where(x => x.TemplateId == eformId
                                && x.SecurityGroup.SecurityGroupUsers.Any(u => u.EformUserId == _userService.UserId))
                    .Select(x => new
                    {
                        iss = x.EformPermissions.Any(y => y.Permission.ClaimName == claimName)
                    })
                    .FirstOrDefaultAsync();
                if (result != null)
                {
                    return result.iss;
                }
            }
            return true;
        }
    }
}