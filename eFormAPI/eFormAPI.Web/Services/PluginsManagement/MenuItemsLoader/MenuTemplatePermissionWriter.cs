/*
The MIT License (MIT)

Copyright (c) 2007 - 2026 Microting A/S

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

namespace eFormAPI.Web.Services.PluginsManagement.MenuItemsLoader;

using System.Collections.Generic;
using System.Linq;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;

/// <summary>
/// Links a plugin menu template to the permissions it declares. Several links of one plugin may
/// share a claim, and Permissions.ClaimName is unique, so an existing permission is reused
/// instead of inserted a second time.
/// </summary>
public static class MenuTemplatePermissionWriter
{
    public static void Link(BaseDbContext dbContext, int menuTemplateId,
        IEnumerable<PluginMenuTemplatePermissionModel> permissions)
    {
        foreach (var itemPermission in permissions)
        {
            var permission = dbContext.Permissions
                .FirstOrDefault(x => x.ClaimName == itemPermission.ClaimName);

            if (permission == null)
            {
                permission = new Permission
                {
                    PermissionName = itemPermission.PermissionName,
                    ClaimName = itemPermission.ClaimName,
                    PermissionType = dbContext.PermissionTypes
                                         .FirstOrDefault(x => x.Name == itemPermission.PermissionTypeName)
                                     ?? new PermissionType { Name = itemPermission.PermissionTypeName }
                };

                dbContext.Permissions.Add(permission);
                dbContext.SaveChanges();
            }

            dbContext.MenuTemplatePermissions.Add(new MenuTemplatePermission
            {
                MenuTemplateId = menuTemplateId,
                PermissionId = permission.Id
            });
            dbContext.SaveChanges();
        }
    }
}
