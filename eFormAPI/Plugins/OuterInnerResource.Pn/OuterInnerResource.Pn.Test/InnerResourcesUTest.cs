/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using NUnit.Framework;

namespace MachineArea.Pn.Test
{
    [TestFixture]
    public class InnerResourcesUTest : DbTestFixture
    {
        [Test]
        public async Task Machine_Save_DoesSave()
        {
            // Arrange
            InnerResource newInnerResource = new InnerResource
            {
                Name = Guid.NewGuid().ToString()
            };

            // Act
            await newInnerResource.Create(DbContext);

            InnerResource innerResource = DbContext.InnerResources.AsNoTracking().First();
            List<InnerResource> innerResourceList = DbContext.InnerResources.AsNoTracking().ToList();
            List<InnerResourceVersion> versionList = DbContext.InnerResourceVersions.AsNoTracking().ToList();
            
            // Assert
            Assert.NotNull(innerResource);
            Assert.AreEqual(1, innerResourceList.Count());
            Assert.AreEqual(1, versionList.Count());
            
            Assert.AreEqual(newInnerResource.Name, innerResource.Name);
        }

        [Test]
        public async Task Machine_Update_DoesUpdate()
        {
            // Arrange
            InnerResource innerResource = new InnerResource
            {
                Name = Guid.NewGuid().ToString()
            };

            DbContext.InnerResources.Add(innerResource);
            DbContext.SaveChanges();

            //Act
            InnerResource selectedInnerResource = new InnerResource
            {
                Name = Guid.NewGuid().ToString(),
                Id = innerResource.Id
            };

            await selectedInnerResource.Update(DbContext);

            InnerResource dbInnerResource = DbContext.InnerResources.AsNoTracking().First();
            List<InnerResource> innerResourceList = DbContext.InnerResources.AsNoTracking().ToList();
            List<InnerResourceVersion> versionList = DbContext.InnerResourceVersions.AsNoTracking().ToList();

            //Assert
            
            Assert.NotNull(dbInnerResource);
            Assert.AreEqual(1, innerResourceList.Count());
            Assert.AreEqual(1, versionList.Count());
            
            Assert.AreEqual(selectedInnerResource.Name, dbInnerResource.Name);
        }

        [Test]
        public async Task Machine_UpdateBinding_DoesUpdate()
        {
            // Arrange
            InnerResource innerResource = new InnerResource
            {
                Name = Guid.NewGuid().ToString()
            };

            OuterResource area = new OuterResource
            {
                Name = Guid.NewGuid().ToString()
            };

            DbContext.InnerResources.Add(innerResource);
            DbContext.OuterResources.Add(area);
            DbContext.SaveChanges();

            //Act
            InnerResource selectedInnerResource = new InnerResource
            {
                Name = Guid.NewGuid().ToString(),
                Id = innerResource.Id,
                OuterInnerResources = new List<Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource>()
                {
                    new Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource()
                    {
                        OuterResourceId = area.Id,
                        InnerResourceId = innerResource.Id
                    }
                }
            };

            await selectedInnerResource.Update(DbContext);

            //Assert
            Assert.AreEqual(selectedInnerResource.OuterInnerResources.First().OuterResourceId, area.Id);

        }

        [Test]
        public async Task Machine_Delete_DoesDelete()
        {
            //Arrange
            InnerResource innerResource = new InnerResource
            {
                Name = Guid.NewGuid().ToString()
            };

            DbContext.InnerResources.Add(innerResource);
            DbContext.SaveChanges();

            //Act
            InnerResource selectedInnerResource = new InnerResource
            {
                Name = innerResource.Name,
                Id = innerResource.Id
            };

            await selectedInnerResource.Delete(DbContext);
            
            InnerResource dbInnerResource = DbContext.InnerResources.AsNoTracking().First();
            List<InnerResource> innerResourceList = DbContext.InnerResources.AsNoTracking().ToList();
            List<InnerResourceVersion> versionList = DbContext.InnerResourceVersions.AsNoTracking().ToList();
            
            // Assert
            Assert.NotNull(dbInnerResource);
            Assert.AreEqual(1, innerResourceList.Count());
            Assert.AreEqual(1, versionList.Count());
            
            Assert.AreEqual(dbInnerResource.WorkflowState, Constants.WorkflowStates.Removed);
        }
    }
}