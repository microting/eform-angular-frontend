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
// ReSharper disable UnusedMember.Global
// ReSharper disable PossiblyMistakenUseOfParamsMethod
namespace InsightDashboard.Pn.Services.WordService
{
    using System;
    using System.IO;
    using System.Linq;
    using DocumentFormat.OpenXml.Drawing;
    using DocumentFormat.OpenXml.Drawing.Wordprocessing;
    using DocumentFormat.OpenXml.Packaging;
    using DocumentFormat.OpenXml.Wordprocessing;
    using HtmlToOpenXml;
    using Paragraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;
    using Picture = DocumentFormat.OpenXml.Wordprocessing.Picture;
    using Run = DocumentFormat.OpenXml.Wordprocessing.Run;
    using RunProperties = DocumentFormat.OpenXml.Wordprocessing.RunProperties;
    using Text = DocumentFormat.OpenXml.Wordprocessing.Text;

    public class WordProcessor : IDisposable
    {
        // Define Constants for Page Width and Page Margin
        private const int PageWidth = 10000;
        private const int PageHeight = 17000;
        private const int PageMarginLeft = 1000;
        private const int PageMarginRight = 1000;
        private const int PageMarginTop = 1000;
        private const int PageMarginBottom = 1000;
        private const double DocumentSizePerPixel = 15;
        private const double EmuPerPixel = 9525;

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

        /// <summary>
        /// Add the text paragraph.
        /// </summary>
        /// <param name="txt">The text.</param>
        /// <param name="boldStyle">if set to <c>true</c> [bold style].</param>
        public void AddTextParagraph(
            string txt,
            bool boldStyle)
        {
            // Assign a reference to the existing document body.
            Body body = _wordProcessingDocument.MainDocumentPart.Document.Body;

            // Add new text.
            Paragraph para = body.AppendChild(new Paragraph());
            Run run = para.AppendChild(new Run());
            run.AppendChild(new Text(txt));

            //create RunProperties and append styles
            RunProperties runProperties = new RunProperties();
            if (boldStyle)
            {
                runProperties.Append(new Bold());
            }

            // Set the RunProperties to the RunProperties containing the styles
            run.RunProperties = runProperties;
        }

        /// <summary>
        /// Adds the image paragraph.
        /// Source: https://stackoverflow.com/questions/50645759/openxml-force-image-fit-in-parent-container
        /// </summary>
        /// <param name="pngBase64String">The PNG base64 string.</param>
        public void AddImageParagraph(string pngBase64String)
        {
            var html = $"<p><img src=\"data:image/png;base64,{pngBase64String}\" alt=\"Image\" /></p>";
            var converter = new HtmlConverter(_wordProcessingDocument.MainDocumentPart);
            var compositeElements = converter.Parse(html);

            // Set Page Size and Page Margin so that we can place the image as desired.
            // Available Width = PageWidth - PageMarginLeft - PageMarginRight (= 17000 - 1000 - 1000 = 15000 for default values)
            var sectionProperties = new SectionProperties();
            sectionProperties.AppendChild(new PageSize { Width = PageWidth, Height = PageHeight });
            sectionProperties.AppendChild(new PageMargin { Left = PageMarginLeft, Bottom = PageMarginBottom, Top = PageMarginTop, Right = PageMarginRight });
            _wordProcessingDocument.MainDocumentPart.Document.Body.AppendChild(sectionProperties);

            if (compositeElements[0] is Paragraph p)
            {
                // Search for Extents used by the word present in Drawing > Inline > Extent
                var inlineEnumerable = p.ChildElements.Where(e => e is Run)
                    .Where(r => r.GetFirstChild<Drawing>() != null).Select(r => r.GetFirstChild<Drawing>())
                    .Where(r => r.GetFirstChild<Inline>() != null).Select(r => r.GetFirstChild<Inline>());

                // Update Visible Extent
                var inlineChildren = inlineEnumerable as Inline[] ?? inlineEnumerable.ToArray();
                foreach (var inlineChild in inlineChildren)
                {
                    var inlineElement = inlineChild.Extent;
                    UpdateExtent(inlineElement);
                }

                // Search for Extents used by the word present in Drawing > Inline > Graphic > GraphicData > Picture > ShapeProperties > Transform2D > Extents
                var extentsEnumerable = inlineChildren
                    .Where(r => r.GetFirstChild<Graphic>() != null).Select(d => d.GetFirstChild<Graphic>())
                    .Where(r => r.GetFirstChild<GraphicData>() != null).Select(r => r.GetFirstChild<GraphicData>())
                    .Where(r => r.GetFirstChild<Picture>() != null)
                    .Select(r => r.GetFirstChild<Picture>())
                    .Where(r => r.GetFirstChild<ShapeProperties>() != null)
                    .Select(r => r.GetFirstChild<ShapeProperties>())
                    .Where(r => r.GetFirstChild<Transform2D>() != null).Select(r => r.GetFirstChild<Transform2D>())
                    .Where(r => r.GetFirstChild<Extents>() != null).Select(r => r.GetFirstChild<Extents>());

                // Modify all images in Extents to the desired size here, to be stretched out on available page width
                foreach (var extents in extentsEnumerable)
                {
                    // Set Image Size: We calculate Aspect Ratio of the image and then calculate the width and update the height as per aspect ratio
                    var inlineElement = extents;

                    UpdateExtent(inlineElement);
                }
            }

            _wordProcessingDocument.MainDocumentPart.Document.Body.Append(compositeElements);
        }

        /// <summary>
        /// Updates the extent.
        /// Source: https://stackoverflow.com/questions/50645759/openxml-force-image-fit-in-parent-container
        /// </summary>
        /// <param name="inlineElement">The inline element.</param>
        private static void UpdateExtent(dynamic inlineElement)
        {
            // Read Default Cx and Cy Values provided in Emu
            var extentCx = inlineElement.Cx;
            var extentCy = inlineElement.Cy;

            // Aspect ratio used to set image height after calculation of width
            double aspectRatioOfImage = (double)extentCy / extentCx;

            // We know 15 width of Page = 1 width of image in pixel = 9525 EMUs per pixel, and we convert document size to pixel and then to EMU
            // For Default Values Available page width = 15000 page width = 15000/ 15 pixels = 1000 pixels = 1000 * 9525 Emu = 9525000 Emu
            double newExtentCx = EmuPerPixel * ((PageWidth - PageMarginLeft - PageMarginRight) / DocumentSizePerPixel);
            // Maintain the Aspect Ratio for height
            double newExtentCy = aspectRatioOfImage * newExtentCx;

            // Update the values
            inlineElement.Cx = (long)Math.Round(newExtentCx);
            inlineElement.Cy = (long)Math.Round(newExtentCy);
        }

        public void Dispose()
        {
            _wordProcessingDocument.Save();
            _wordProcessingDocument.Close();
            _wordProcessingDocument.Dispose();
        }
    }
}
