﻿/*
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

namespace eFormAPI.Web.Infrastructure.Models.VisualEformEditor
{
    using System.Collections.Generic;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class EformVisualEditorCreateModel
    {
        public int? Id { get; set; }

        /// <summary>
        /// Translates for eform label and description with languageId
        /// </summary>
        public List<CommonTranslationsModel> Translations { get; set; }
            = new();

        public List<int> TagIds { get; set; } = new();

        public int? Position { get; set; }

        public List<EformVisualEditorCreateModel> CheckLists { get; set; } = new();

        public List<VisualEditorFields> Fields { get; set; } = new();

        public int? TempId { get; set; }

        public int? ParentChecklistId { get; set; }

        public bool QuickSync { get; set; }
	}
}
