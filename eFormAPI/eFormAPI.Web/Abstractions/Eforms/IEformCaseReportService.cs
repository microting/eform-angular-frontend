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

namespace eFormAPI.Web.Abstractions.Eforms;

using System.IO;
using System.Threading.Tasks;
using Infrastructure.Models;
using Infrastructure.Models.ReportEformCase;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public interface IEformCaseReportService
{
    public Task<OperationDataResult<EFormCasesReportModel>> GetReportEformCases(EFormCaseReportRequest eFormCaseReportRequest);

    public Task<OperationDataResult<Stream>> GenerateReportFile(EFormCaseReportRequest model);

    public Task<OperationResult> UpdateReportHeaders(EformDocxReportHeadersModel eformDocxReportHeadersModel);
        
    public Task<OperationDataResult<EformDocxReportHeadersModel>> GetReportHeadersByTemplateId(int templateId);
}