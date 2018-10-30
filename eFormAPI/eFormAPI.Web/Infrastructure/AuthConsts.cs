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

            public static class EformsClaims
            {
                public const string Create = "eforms_create";
                public const string Delete = "eforms_delete";
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

            public static class Eforms
            {
                public const string Create = EformClaims.EformsClaims.Create;
                public const string Delete = EformClaims.EformsClaims.Delete;
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
                public const int Eforms = 8;
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

                public static class EformsClaims
                {
                    public const int Create = 27;
                    public const int Delete = 28;
                }
            }
        }
    }
}