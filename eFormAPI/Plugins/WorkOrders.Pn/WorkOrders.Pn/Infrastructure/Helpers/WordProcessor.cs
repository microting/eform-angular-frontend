﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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

 using System;
 using System.IO;
 using DocumentFormat.OpenXml.Packaging;
 using DocumentFormat.OpenXml.Wordprocessing;
 using HtmlToOpenXml;

 namespace WorkOrders.Pn.Infrastructure.Helpers
{
    public class WordProcessor : IDisposable
    {
        // Document
        private readonly WordprocessingDocument _wordProcessingDocument;

        public WordProcessor(string filepath)
        {
            _wordProcessingDocument = WordprocessingDocument.Open(filepath, true);
        }

        public WordProcessor(Stream stream)
        {
            _wordProcessingDocument = WordprocessingDocument.Open(stream, true);
        }

        /// <summary>
        /// Adds the HTML.
        /// </summary>
        /// <param name="html">The HTML.</param>
        public void AddHtml(string html)
        {
            var mainPart = _wordProcessingDocument.MainDocumentPart;
            if (mainPart == null)
            {
                mainPart = _wordProcessingDocument.AddMainDocumentPart();
                new Document(new Body()).Save(mainPart);
            }

            var converter = new HtmlConverter(mainPart);
            converter.ParseHtml(html);
            mainPart.Document.Save();
        }

        public void Dispose()
        {
            _wordProcessingDocument.Save();
            _wordProcessingDocument.Close();
            _wordProcessingDocument.Dispose();
        }
    }
}
