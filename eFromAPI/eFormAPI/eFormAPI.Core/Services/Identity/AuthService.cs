using System;
using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Core.Abstractions;
using eFormAPI.Core.Helpers;
using eFormAPI.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace eFormAPI.Core.Services.Identity
{
    public class AuthService : IAuthService
    {
        private readonly TokenOptions _tokenOptions;
        private readonly IUserService _userService;
        private readonly IOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AuthService> _logger;
        private readonly UserManager<EformUser> _userManager;
        private readonly RoleManager<EformRole> _roleManager;
        private readonly SignInManager<EformUser> _signInManager;

        public AuthService(TokenOptions tokenOptions, ILogger<AuthService> logger, IOptions<ApplicationSettings> appSettings, RoleManager<EformRole> roleManager, SignInManager<EformUser> signInManager, UserManager<EformUser> userManager, IUserService userService)
        {
            _tokenOptions = tokenOptions;
            _logger = logger;
            _appSettings = appSettings;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _userManager = userManager;
            _userService = userService;
        }



        public async Task<OperationResult> LogOut()
        {
            try
            {
                await _signInManager.SignOutAsync();
            }
            catch (Exception e)
            {
                //              _logger.LogDatabase(e);
                Console.WriteLine(e);
                return new OperationResult(false, e.Message);
            }

            return new OperationResult(true);
        }
        
    }
}