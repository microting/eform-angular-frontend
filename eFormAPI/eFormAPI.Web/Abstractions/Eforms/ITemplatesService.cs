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

using Infrastructure.Models;
using Infrastructure.Models.Import;
using Infrastructure.Models.Templates;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

public interface ITemplatesService
{
    Task<OperationResult> Create(EFormXmlModel eFormXmlModel);

    Task<OperationDataResult<ExcelParseResult>> Import(Stream excelStream);

    Task<OperationResult> Delete(int id);

    Task<OperationResult> Deploy(DeployModel deployModel);

    Task<OperationDataResult<int>> Duplicate(TemplateDuplicateRequestModel requestModel);

    Task<OperationDataResult<DeployToModel>> DeployTo(int id);

    Task<OperationDataResult<Template_Dto>> Get(int id);

    Task<OperationDataResult<List<Field>>> GetFields(int id);

    Task<OperationDataResult<TemplateListModel>> Index(TemplateRequestModel templateRequestModel);

    Task<OperationDataResult<List<CommonDictionaryModel>>> GetDictionaryTemplates(string nameFilter, int idFilter);
}