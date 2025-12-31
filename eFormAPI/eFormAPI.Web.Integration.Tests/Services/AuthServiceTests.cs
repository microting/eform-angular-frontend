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

using NUnit.Framework;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using Microsoft.AspNetCore.Identity;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Services.Cache.AuthCache;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests : DbTestFixture
    {
        private IOptions<EformTokenOptions> _tokenOptions;
        private ILogger<AuthService> _logger;
        private IDbOptions<ApplicationSettings> _appSettings;
        private IUserService _userService;
        private ILocalizationService _localizationService;
        private IClaimsService _claimsService;
        private IAuthCacheService _authCacheService;
        private AuthService _authService;

        public override void DoSetup()
        {
            _tokenOptions = Substitute.For<IOptions<EformTokenOptions>>();
            _logger = Substitute.For<ILogger<AuthService>>();
            _appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
            _userService = Substitute.For<IUserService>();
            _localizationService = Substitute.For<ILocalizationService>();
            _claimsService = Substitute.For<IClaimsService>();
            _authCacheService = Substitute.For<IAuthCacheService>();

            var roleManager = Substitute.For<RoleManager<EformRole>>(
                Substitute.For<IRoleStore<EformRole>>(), null, null, null, null);
            var signInManager = Substitute.For<SignInManager<EformUser>>(
                Substitute.For<UserManager<EformUser>>(
                    Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null),
                Substitute.For<Microsoft.AspNetCore.Http.IHttpContextAccessor>(),
                Substitute.For<IUserClaimsPrincipalFactory<EformUser>>(),
                null, null, null, null);
            var userManager = Substitute.For<UserManager<EformUser>>(
                Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null);

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());

            _tokenOptions.Value.Returns(new EformTokenOptions());
            _appSettings.Value.Returns(new ApplicationSettings());

            _authService = new AuthService(
                _tokenOptions,
                _logger,
                _appSettings,
                roleManager,
                signInManager,
                userManager,
                _userService,
                _localizationService,
                _claimsService,
                _authCacheService);
        }

        [Test]
        public void AuthService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_authService, Is.Not.Null);
        }
    }
}
