using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Swashbuckle.Application;
using Swashbuckle.Swagger;

namespace eFormAPI.Web
{
    public static class SwaggerConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            configuration.EnableSwagger(c =>
                {
                    c.SingleApiVersion("v1", "Eform API");
                    c.IncludeXmlComments($@"{System.AppDomain.CurrentDomain.BaseDirectory}\bin\API.docs.xml");
                    c.DescribeAllEnumsAsStrings();
                    c.DocumentFilter<AuthTokenOperation>();
                    c.OperationFilter<AddAuthorizationHeader>();
                    c.UseFullTypeNameInSchemaIds();
                    c.SchemaId(x => x.FullName + Guid.NewGuid());
                }).EnableSwaggerUi();
        }
    }

    public class AuthTokenOperation : IDocumentFilter
    {
        public void Apply(SwaggerDocument swaggerDoc, SchemaRegistry schemaRegistry, IApiExplorer apiExplorer)
        {
            swaggerDoc.paths.Add("/api/auth/token", new PathItem
            {
                post = new Operation
                {
                    tags = new List<string> { "Auth" },
                    consumes = new List<string>
                    {
                        "application/x-www-form-urlencoded"
                    },
                    parameters = new List<Parameter> {
                        new Parameter
                        {
                            type = "string",
                            name = "grant_type",
                            required = true,
                            @in = "formData",
                            @default = "password"
                        },
                        new Parameter
                        {
                            type = "string",
                            name = "username",
                            required = false,
                            @in = "formData"
                        },
                        new Parameter
                        {
                            type = "string",
                            name = "password",
                            required = false,
                            @in = "formData"
                        }
                    }
                }
            });
        }
    }

    public class AddAuthorizationHeader : IOperationFilter
    {
        /// <summary>
        /// Adds an authorization header to the given operation in Swagger.
        /// </summary>
        /// <param name="operation">The Swashbuckle operation.</param>
        /// <param name="schemaRegistry">The Swashbuckle schema registry.</param>
        /// <param name="apiDescription">The Swashbuckle api description.</param>
        public void Apply(Operation operation, SchemaRegistry schemaRegistry, ApiDescription apiDescription)
        {
            if (operation == null) return;

            if (operation.parameters == null)
            {
                operation.parameters = new List<Parameter>();
            }

            var parameter = new Parameter
            {
                description = "The authorization token",
                @in = "header",
                name = "Authorization",
                required = true,
                type = "string",
                @default = "Bearer "
            };

            if (apiDescription.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any())
            {
                parameter.required = false;
            }

            operation.parameters.Add(parameter);
        }
    }
}