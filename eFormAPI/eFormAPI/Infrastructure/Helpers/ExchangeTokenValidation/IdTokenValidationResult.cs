using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eFormAPI.Web.Infrastructure.Helpers.ExchangeTokenValidation
{
    /// <summary>
    /// Provides validation results for an Exchange identity token
    /// </summary>
    public class IdTokenValidationResult
    {
        /// <summary>
        /// Indicates if the token is valid
        /// </summary>
        public bool IsValid { get; set; }

        /// <summary>
        /// Validation result message, typically indicates a reason for failure. Optional.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Indicates the result of validating the audience.
        /// </summary>
        public string AudienceResult { get; set; }

        /// <summary>
        /// Indicates the result of validating the lifetime.
        /// </summary>
        public string LifetimeResult { get; set; }

        /// <summary>
        /// Indicates the result of validating the version.
        /// </summary>
        public string VersionResult { get; set; }

        /// <summary>
        /// Indicates the result of validating the signature.
        /// </summary>
        public string SignatureResult { get; set; }

        /// <summary>
        /// The computed User ID. If the token is invalid, this value will be empty.
        /// </summary>
        public string ComputedUserId { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public IdTokenValidationResult()
        {
            IsValid = false;
            Message = string.Empty;
            AudienceResult = "unknown";
            LifetimeResult = "unknown";
            SignatureResult = "unknown";
            VersionResult = "failed";
            ComputedUserId = string.Empty;
        }
    }
}