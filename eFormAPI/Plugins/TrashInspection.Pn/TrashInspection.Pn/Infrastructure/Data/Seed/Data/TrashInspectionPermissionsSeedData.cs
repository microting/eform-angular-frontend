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

using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using TrashInspection.Pn.Infrastructure.Const;

namespace TrashInspection.Pn.Infrastructure.Data.Seed.Data
{
    public static class TrashInspectionPermissionsSeedData 
    {
        public static PluginPermission[] Data => new[]
        {
            new PluginPermission
            {
                PermissionName = "Access TrashInspection Plugin",
                ClaimName = TrashInspectionClaims.AccessTrashInspectionPlugin
            },
            new PluginPermission
            {
                PermissionName = "Access Trash Inspections",
                ClaimName = TrashInspectionClaims.AccessTrashInspections
            }, 
            new PluginPermission
            {
                PermissionName = "Create Trash Inspections",
                ClaimName = TrashInspectionClaims.CreateTrashInspections
            }, 
            new PluginPermission
            {
                PermissionName = "Update Trash Inspections",
                ClaimName = TrashInspectionClaims.UpdateTrashInspections
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Trash Inspections",
                ClaimName = TrashInspectionClaims.DeleteTrashInspections
            }, 
            new PluginPermission
            {
                PermissionName = "Get PDF Report",
                ClaimName = TrashInspectionClaims.GetPdf
            }, 
            new PluginPermission
            {
                PermissionName = "Get DOCX Report",
                ClaimName = TrashInspectionClaims.GetDocx
            }, 
            new PluginPermission
            {
                PermissionName = "Get Stats",
                ClaimName = TrashInspectionClaims.GetStats
            }, 
            new PluginPermission
            {
                PermissionName = "Access Installations",
                ClaimName = TrashInspectionClaims.AccessInstallations
            }, 
            new PluginPermission
            {
                PermissionName = "Create Installations",
                ClaimName = TrashInspectionClaims.CreateInstallations
            },
            new PluginPermission
            {
                PermissionName = "Update Installations",
                ClaimName = TrashInspectionClaims.UpdateInstallations
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Installations",
                ClaimName = TrashInspectionClaims.DeleteInstallations
            }, 
            new PluginPermission
            {
                PermissionName = "Access Fractions",
                ClaimName = TrashInspectionClaims.AccessFractions
            }, 
            new PluginPermission
            {
                PermissionName = "Create Fractions",
                ClaimName = TrashInspectionClaims.CreateFractions
            },
            new PluginPermission
            {
                PermissionName = "Update Fractions",
                ClaimName = TrashInspectionClaims.UpdateFractions
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Fractions",
                ClaimName = TrashInspectionClaims.DeleteFractions
            },  
            new PluginPermission
            {
                PermissionName = "Access Segments",
                ClaimName = TrashInspectionClaims.AccessSegments
            }, 
            new PluginPermission
            {
                PermissionName = "Create Segments",
                ClaimName = TrashInspectionClaims.CreateSegments
            },
            new PluginPermission
            {
                PermissionName = "Update Segments",
                ClaimName = TrashInspectionClaims.UpdateSegments
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Segments",
                ClaimName = TrashInspectionClaims.DeleteSegments
            }, 
            new PluginPermission
            {
                PermissionName = "Access Producers",
                ClaimName = TrashInspectionClaims.AccessProducers
            }, 
            new PluginPermission
            {
                PermissionName = "Create Producers",
                ClaimName = TrashInspectionClaims.CreateProducers
            },
            new PluginPermission
            {
                PermissionName = "Update Producers",
                ClaimName = TrashInspectionClaims.UpdateProducers
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Producers",
                ClaimName = TrashInspectionClaims.DeleteProducers
            }, 
            new PluginPermission
            {
                PermissionName = "Access Transporters",
                ClaimName = TrashInspectionClaims.AccessTransporters
            }, 
            new PluginPermission
            {
                PermissionName = "Create Transporters",
                ClaimName = TrashInspectionClaims.CreateTransporters
            },
            new PluginPermission
            {
                PermissionName = "Update Transporters",
                ClaimName = TrashInspectionClaims.UpdateTransporters
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Transporters",
                ClaimName = TrashInspectionClaims.DeleteTransporters
            }, 
            new PluginPermission
            {
                PermissionName = "Access Reports",
                ClaimName = TrashInspectionClaims.AccessReports
            }, 
            new PluginPermission
            {
                PermissionName = "Create Reports",
                ClaimName = TrashInspectionClaims.CreateReports
            },
            new PluginPermission
            {
                PermissionName = "Update Reports",
                ClaimName = TrashInspectionClaims.UpdateReports
            }, 
            new PluginPermission
            {
                PermissionName = "Delete Reports",
                ClaimName = TrashInspectionClaims.DeleteReports
            }, 
        };
    }
}