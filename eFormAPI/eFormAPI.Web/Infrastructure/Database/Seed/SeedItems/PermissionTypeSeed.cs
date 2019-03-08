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
using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    public static class PermissionTypeSeed
    {
        public static ModelBuilder AddPermissionTypes(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PermissionType>().HasData(
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Workers,
                    Name = "Workers"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Sites,
                    Name = "Sites"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.EntitySearch,
                    Name = "Entity search"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.EntitySelect,
                    Name = "Entity select"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.UserManagement,
                    Name = "User management"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Units,
                    Name = "Units"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.DeviceUsers,
                    Name = "Device users"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Cases,
                    Name = "Cases"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Eforms,
                    Name = "Eforms"
                });
            return modelBuilder;
        }
    }
}