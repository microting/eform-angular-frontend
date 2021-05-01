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

namespace ItemsPlanning.Pn.Infrastructure.Models.Planning
{
    public class PlanningUpdateModel
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public string PlanningNumber { get; set; }

        public string LocationCode { get; set; }

        public string BuildYear { get; set; }

        public string Type { get; set; }

        public PlanningFolderModel Folder { get; set; }

        public PlanningReiterationModel Reiteration { get; set; }

        public PlanningEformModel BoundEform { get; set; }

        public PlanningFieldsModel EnabledFields { get; set; }

        public List<PlanningNameTranslations> TranslationsName { get; set; }
            = new List<PlanningNameTranslations>();

        public List<int> TagsIds { get; set; }
            = new List<int>();
    }
}