/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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

namespace eFormAPI.Web.Infrastructure.Helpers;

using System.Collections.Generic;
using Models.Menu;

public static class EformMenuHelper
{
    public static List<RightMenuItemModel> GetRightMenu()
    {
        return new List<RightMenuItemModel>
        {
            new RightMenuItemModel
            {
                Name = "user",
                E2EId = "sign-out-dropdown",
                Link = "",
                Position = 0
            },
            new RightMenuItemModel
            {
                Name = "User Management",
                LocaleName = "UserManagement",
                E2EId = "user-management-menu",
                Link = "/account-management/users",
                Position = 0,
                ParentId = 10
            },
            new RightMenuItemModel
            {
                Name = "Settings",
                LocaleName = "Settings",
                E2EId = "settings",
                Link = "/account-management/settings",
                Position = 1,
                ParentId = 10
            },
            new RightMenuItemModel
            {
                Name = "Security",
                LocaleName = "Security",
                E2EId = "security",
                Link = "/security",
                Position = 2,
                ParentId = 10
            },
            new RightMenuItemModel
            {
                Name = "Change password",
                LocaleName = "ChangePassword",
                E2EId = "change-password",
                Link = "/account-management/change-password",
                Position = 3,
                ParentId = 10
            },
            new RightMenuItemModel
            {
                Name = "Logout",
                LocaleName = "Logout",
                E2EId = "sign-out",
                Link = "/auth/sign-out",
                Position = 4,
                ParentId = 10
            }
        };
    }
}