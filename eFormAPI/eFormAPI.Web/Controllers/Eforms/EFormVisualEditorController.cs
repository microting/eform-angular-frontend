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

namespace eFormAPI.Web.Controllers.Eforms;

using System.Threading.Tasks;
using Abstractions.Eforms;
using Infrastructure.Helpers;
using Infrastructure.Models.VisualEformEditor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

[Route("api/template-visual-editor")]
[Route("api/eform-visual-editor")]
[Authorize]
public class EFormVisualEditorController(ITemplateVisualEditorService templateVisualEditorService) : Controller
{
    [HttpGet]
    public async Task<OperationDataResult<EformVisualEditorModel>> Read(int id)
    {
        return await templateVisualEditorService.ReadVisualTemplate(id);
    }

    [HttpPost]
    public async Task<OperationResult> Create([FromForm]EformVisualEditorCreateModel model)
    {
        // set files with help reflection. for some unknown reason, the field with the file in a deeply nested object is not set,
        // unlike the adjacent fields. if you know what it can be replaced,
        // or the reason why the files are not set and you know how to eliminate this reason,
        // then fix this **crutch**
        foreach (var formFile in HttpContext.Request.Form.Files)
        {
            // path to property(formFile.Name) can be 'Fields[0][PdfFiles][0][File]' or 'Fields[1]Fields[0][PdfFiles][0][File]'
            // or 'Checklists[1]Fields[0][PdfFiles][0][File]' or 'Checklists[1]Fields[1]Fields[0][PdfFiles][0][File]' or a **deeper nesting**
            ReflectionSetProperty.SetProperty(model, formFile.Name.Replace("][", ".").Replace("[", ".").Replace("]", ""), formFile);
        }
        return await templateVisualEditorService.CreateVisualTemplate(model);
    }


    [HttpPut]
    public async Task<OperationResult> Update([FromForm] EformVisualEditorUpdateModel model)
    {
        // set files with help reflection. for some unknown reason, the field with the file in a deeply nested object is not set,
        // unlike the adjacent fields. if you know what it can be replaced,
        // or the reason why the files are not set and you know how to eliminate this reason,
        // then fix this **crutch**
        foreach (var formFile in HttpContext.Request.Form.Files)
        {
            // path to property(formFile.Name) can be 'Fields[0][PdfFiles][0][File]' or 'Fields[1]Fields[0][PdfFiles][0][File]'
            // or 'Checklists[1]Fields[0][PdfFiles][0][File]' or 'Checklists[1]Fields[1]Fields[0][PdfFiles][0][File]' or a **deeper nesting**
            ReflectionSetProperty.SetProperty(model, formFile.Name.Replace("][", ".").Replace("[", ".").Replace("]", ""), formFile);
        }
        return await templateVisualEditorService.UpdateVisualTemplate(model);
    }
}