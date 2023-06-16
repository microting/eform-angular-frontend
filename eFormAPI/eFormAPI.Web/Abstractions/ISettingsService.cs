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

using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Settings.Admin;
using eFormAPI.Web.Infrastructure.Models.Settings.Initial;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions;

public interface ISettingsService
{
    OperationResult ConnectionStringExist();
    Task<OperationDataResult<AdminSettingsModel>> GetAdminSettings();
    OperationDataResult<string> GetDefaultLocale();
    OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings();
    OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings();
    OperationDataResult<string> GetAssemblyVersion();
    OperationDataResult<string> GetApplicationHostOs();
    OperationDataResult<string> GetLatestVersion();
    Task<OperationResult> ResetLoginPageSettings();
    Task<OperationResult> ResetPageHeaderSettings();
    Task<OperationResult> UpdateAdminSettings(AdminSettingsModel adminSettingsModel);
    Task<OperationResult> UpdateConnectionString(InitialSettingsModel initialSettingsModel);
    Task<OperationResult> IntegrityCheck();
    Task<OperationDataResult<LanguagesModel>> GetLanguages();
    Task<OperationResult> UpdateLanguages(LanguagesModel languages);
}