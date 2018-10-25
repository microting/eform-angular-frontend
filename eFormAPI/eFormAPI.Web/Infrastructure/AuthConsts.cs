namespace eFormAPI.Web.Infrastructure
{
    public static class AuthConsts
    {
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
                public const string Create = "sites_create";
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
                public const string Create = EformClaims.SitesClaims.Create;
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
        }
    }
}