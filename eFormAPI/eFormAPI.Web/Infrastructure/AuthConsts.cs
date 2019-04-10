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
namespace eFormAPI.Web.Infrastructure
{
    public static class AuthConsts
    {
        public const string ClaimDefaultValue = "True";

        public static class EformClaims
        {
            public static class WorkersClaims
            {
                public const string Create = "workers_create";
                public const string Read = "workers_read";
                public const string Update = "workers_update";
                public const string Delete = "workers_delete";
            }

            public static class SitesClaims
            {
                public const string Read = "sites_read";
                public const string Update = "sites_update";
                public const string Delete = "sites_delete";
            }

            public static class EntitySearchClaims
            {
                public const string Create = "entity_search_create";
                public const string Read = "entity_search_read";
                public const string Update = "entity_search_update";
                public const string Delete = "entity_search_delete";
            }

            public static class EntitySelectClaims
            {
                public const string Create = "entity_select_create";
                public const string Read = "entity_select_read";
                public const string Update = "entity_select_update";
                public const string Delete = "entity_select_delete";
            }

            public static class UserManagementClaims
            {
                public const string Create = "users_create";
                public const string Read = "users_read";
                public const string Update = "users_update";
                public const string Delete = "users_delete";
            }

            public static class UnitsClaims
            {
                public const string Read = "units_read";
                public const string Update = "units_update";
            }

            public static class DeviceUsersClaims
            {
                public const string Create = "device_users_create";
                public const string Read = "device_users_read";
                public const string Update = "device_users_update";
                public const string Delete = "device_users_delete";
            }

            public static class CasesClaims
            {
                public const string CasesRead = "cases_read";
                public const string CaseRead = "case_read";
                public const string CaseUpdate = "case_update";
                public const string CaseDelete = "case_delete";
                public const string CaseGetPdf = "case_get_pdf";
                public const string CaseGetDocx = "case_get_docx";
                public const string CaseGetPptx = "case_get_pptx";
            }

            public static class EformsClaims
            {
                public const string Create = "eforms_create";
                public const string Delete = "eforms_delete";
                public const string Read = "eforms_read";
                public const string UpdateColumns = "eforms_update_columns";
                public const string DownloadXml = "eforms_download_xml";
                public const string UploadZip = "eforms_upload_zip";
                public const string PairingRead = "eforms_pairing_read";
                public const string PairingUpdate = "eforms_pairing_update";
                public const string ReadTags = "eforms_read_tags";
                public const string UpdateTags = "eforms_update_tags";
                public const string GetCsv = "eforms_get_csv";
                public const string ReadJasperReport = "eforms_read_jasper_report";
                public const string UpdateJasperReport = "eforms_update_jasper_report";
            }
        }

        public static class EformPolicies
        {
            public static class Workers
            {
                public const string Create = EformClaims.WorkersClaims.Create;
                public const string Read = EformClaims.WorkersClaims.Read;
                public const string Update = EformClaims.WorkersClaims.Update;
                public const string Delete = EformClaims.WorkersClaims.Delete;
            }

            public static class Sites
            {
                public const string Read = EformClaims.SitesClaims.Read;
                public const string Update = EformClaims.SitesClaims.Update;
                public const string Delete = EformClaims.SitesClaims.Delete;
            }

            public static class EntitySearch
            {
                public const string Create = EformClaims.EntitySearchClaims.Create;
                public const string Read = EformClaims.EntitySearchClaims.Read;
                public const string Update = EformClaims.EntitySearchClaims.Update;
                public const string Delete = EformClaims.EntitySearchClaims.Delete;
            }

            public static class EntitySelect
            {
                public const string Create = EformClaims.EntitySelectClaims.Create;
                public const string Read = EformClaims.EntitySelectClaims.Read;
                public const string Update = EformClaims.EntitySelectClaims.Update;
                public const string Delete = EformClaims.EntitySelectClaims.Delete;
            }

            public static class UserManagement
            {
                public const string Create = EformClaims.UserManagementClaims.Create;
                public const string Read = EformClaims.UserManagementClaims.Read;
                public const string Update = EformClaims.UserManagementClaims.Update;
                public const string Delete = EformClaims.UserManagementClaims.Delete;
            }

            public static class Units
            {
                public const string Read = EformClaims.UnitsClaims.Read;
                public const string Update = EformClaims.UnitsClaims.Update;
            }

            public static class DeviceUsers
            {
                public const string Create = EformClaims.DeviceUsersClaims.Create;
                public const string Read = EformClaims.DeviceUsersClaims.Read;
                public const string Update = EformClaims.DeviceUsersClaims.Update;
                public const string Delete = EformClaims.DeviceUsersClaims.Delete;
            }

            public static class Cases
            {
                public const string CasesRead = EformClaims.CasesClaims.CasesRead;
                public const string CaseRead = EformClaims.CasesClaims.CaseRead;
                public const string CaseUpdate = EformClaims.CasesClaims.CaseUpdate;
                public const string CaseDelete = EformClaims.CasesClaims.CaseDelete;
                public const string CaseGetPdf = EformClaims.CasesClaims.CaseGetPdf;
                public const string CaseGetDocx = EformClaims.CasesClaims.CaseGetDocx;
                public const string CaseGetPptx = EformClaims.CasesClaims.CaseGetPptx;
            }

            public static class Eforms
            {
                public const string Create = EformClaims.EformsClaims.Create;
                public const string Delete = EformClaims.EformsClaims.Delete;
                public const string Read = EformClaims.EformsClaims.Read;
                public const string UpdateColumns = EformClaims.EformsClaims.UpdateColumns;
                public const string DownloadXml = EformClaims.EformsClaims.DownloadXml;
                public const string UploadZip = EformClaims.EformsClaims.UploadZip;
                public const string PairingRead = EformClaims.EformsClaims.PairingRead;
                public const string PairingUpdate = EformClaims.EformsClaims.PairingUpdate;
                public const string ReadTags = EformClaims.EformsClaims.ReadTags;
                public const string UpdateTags = EformClaims.EformsClaims.UpdateTags;
                public const string GetCsv = EformClaims.EformsClaims.GetCsv;
                public const string ReadJasperReport = EformClaims.EformsClaims.ReadJasperReport;
                public const string UpdateJasperReport = EformClaims.EformsClaims.UpdateJasperReport;
            }
        }

        public static class DbIds
        {
            public static class SecurityGroups
            {
                public const int EformAdmins = 1;
                public const int EformUsers = 2;
            }

            public static class PermissionTypes
            {
                public const int Workers = 1;
                public const int Sites = 2;
                public const int EntitySearch = 3;
                public const int EntitySelect = 4;
                public const int UserManagement = 5;
                public const int Units = 6;
                public const int DeviceUsers = 7;
                public const int Cases = 8;
                public const int Eforms = 9;
            }

            public static class Permissions
            {
                public static class WorkersClaims
                {
                    public const int Create = 1;
                    public const int Read = 2;
                    public const int Update = 3;
                    public const int Delete = 4;
                }

                public static class SitesClaims
                {
                    public const int Read = 6;
                    public const int Update = 7;
                    public const int Delete = 8;
                }

                public static class EntitySearchClaims
                {
                    public const int Create = 9;
                    public const int Read = 10;
                    public const int Update = 11;
                    public const int Delete = 12;
                }

                public static class EntitySelectClaims
                {
                    public const int Create = 13;
                    public const int Read = 14;
                    public const int Update = 15;
                    public const int Delete = 16;
                }

                public static class UserManagementClaims
                {
                    public const int Create = 17;
                    public const int Read = 18;
                    public const int Update = 19;
                    public const int Delete = 20;
                }

                public static class Units
                {
                    public const int Read = 21;
                    public const int Update = 22;
                }

                public static class DeviceUsers
                {
                    public const int Create = 23;
                    public const int Read = 24;
                    public const int Update = 25;
                    public const int Delete = 26;
                }

                public static class Cases
                {
                    public const int CasesRead = 33;
                    public const int CaseRead = 34;
                    public const int CaseUpdate = 35;
                    public const int CaseDelete = 36;
                    public const int CaseGetPdf = 37;
                    public const int CaseGetDocx = 45;
                    public const int CaseGetPptx = 46;
                }

                public static class Eforms
                {
                    public const int Create = 27;
                    public const int Delete = 28;
                    public const int Read = 29;
                    public const int UpdateColumns = 30;
                    public const int DownloadXml = 31;
                    public const int UploadZip = 32;
                    public const int PairingRead = 38;
                    public const int PairingUpdate = 39;
                    public const int ReadTags = 40;
                    public const int UpdateTags = 41;
                    public const int GetCsv = 42;
                    public const int ReadJasperReport = 43;
                    public const int UpdateJasperReport = 44;
                }
            }
        }
    }
}