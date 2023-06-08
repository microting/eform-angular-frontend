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

namespace eFormAPI.Web.Infrastructure.Models.VisualEformEditor;

using System.Collections.Generic;

public class VisualEditorFields
{
    public int? Id { get; set; }

    public int FieldType { get; set; }

    /// <summary>
    /// Translates for label and description
    /// for Number field - def value long. for saveButton - def value string
    /// </summary>
    public List<TranslationWithDefaultValue> Translations { get; set; }
        = new();

    public string Color { get; set; }

    public bool Mandatory { get; set; }

    public int? Position { get; set; }
        
    /// <summary>
    /// for GroupOpenClose field
    /// </summary>
    public List<VisualEditorFields> Fields { get; set; }
        = new();

    /// <summary>
    /// for List field
    /// </summary>
    public List<FieldOptions> Options { get; set; }
        = new();

    /// <summary>
    /// for Number field - long. for Date - Date
    /// </summary>
    public string MinValue { get; set; }

    /// <summary>
    /// for Number field - long. for Date - Date
    /// </summary>
    public string MaxValue { get; set; }

    /// <summary>
    /// for Number field
    /// </summary>
    public int? DecimalCount { get; set; }

    /// <summary>
    /// for PDF field
    /// </summary>
    public List<UploadPdfFileForFieldModel> PdfFiles { get; set; }
        = new();

    public int ChecklistId { get; set; }

    public int? TempId { get; set; }

    public int? ParentFieldId { get; set; }

    public string UnitName { get; set; }

    public int? EntityGroupId { get; set; }
}