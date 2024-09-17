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

using System.Text;

namespace eFormAPI.Web.Services;

using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using Abstractions;
using eFormCore;
using ImageMagick;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Infrastructure.Models.ReportEformCase;
using Microting.eForm.Dto;
using System.Diagnostics;

public class WordService : IWordService
{
    private readonly ILogger<WordService> _logger;
    private readonly ILocalizationService _localizationService;
    private readonly IEFormCoreService _coreHelper;
    private bool _s3Enabled;
    private bool _swiftEnabled;
    //private readonly BaseDbContext _dbContext;

    public WordService(
        ILogger<WordService> logger,
        ILocalizationService localizationService,
        IEFormCoreService coreHelper/*,
            BaseDbContext dbContext*/)
    {
        _logger = logger;
        _localizationService = localizationService;
        _coreHelper = coreHelper;
        //_dbContext = dbContext;
    }

    public async Task<OperationDataResult<Stream>> GenerateWordDashboard(EFormCasesReportModel reportModel)
    {
        try
        {
            // get core
            var core = await _coreHelper.GetCore();
            //var headerImageName = _dbContext.ConfigurationValues
            //    .Single(x => x.Id == "HeaderSettings:MainText").Value;

            _s3Enabled = core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true";
            _swiftEnabled = core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true";
            // Read html and template
            var resourceString = "eFormAPI.Web.Resources.Templates.WordExport.page.html";
            var assembly = Assembly.GetExecutingAssembly();
            var resourceStream = assembly.GetManifestResourceStream(resourceString);
            using var reader = new StreamReader(resourceStream ?? throw new InvalidOperationException($"{nameof(resourceStream)} is null"));
            var html = await reader.ReadToEndAsync();

            resourceString = "eFormAPI.Web.Resources.Templates.WordExport.file.docx";
            var docxFileResourceStream = assembly.GetManifestResourceStream(resourceString);
            if (docxFileResourceStream == null)
            {
                throw new InvalidOperationException($"{nameof(docxFileResourceStream)} is null");
            }
            var docxFileStream = new MemoryStream();
            await docxFileResourceStream.CopyToAsync(docxFileStream);
            var basePicturePath = await core.GetSdkSetting(Settings.fileLocationPicture);

            var word = new WordProcessor(docxFileStream);

            var itemsHtml = new StringBuilder();
            //var header = _dbContext.PluginConfigurationValues.Single(x => x.Name == "ItemsPlanningBaseSettings:ReportHeaderName").Value;
            //var subHeader = _dbContext.PluginConfigurationValues.Single(x => x.Name == "ItemsPlanningBaseSettings:ReportSubHeaderName").Value;
            itemsHtml.Append("<body>");
            itemsHtml.Append(@"<p style='display:flex;align-content:center;justify-content:center;flex-wrap:wrap;'>");
            for (var i = 0; i < 8; i++)
            {
                itemsHtml.Append(@"<p style='font-size:24px;text-align:center;color:#fff;'>Enter</p>");
            }
            //itemsHtml += $@"<p style='font-size:24px;text-align:center;'>{header}</p>";
            //itemsHtml += $@"<p style='font-size:20px;text-align:center;'>{subHeader}</p>";
            if(reportModel.FromDate != null && reportModel.ToDate != null)
            {
                itemsHtml.Append($@"<p style='font-size:15px;text-align:center;'>{_localizationService.GetString("ReportPeriod")}: "
                                 + $@"{reportModel.FromDate} - {reportModel.ToDate}</p>");
            }
            //if (!string.IsNullOrEmpty(headerImageName) && headerImageName != "../../../assets/images/logo.png")
            //{
            //    itemsHtml = await InsertImage(headerImageName, itemsHtml, 150, 150, core, basePicturePath);
            //}
            itemsHtml.Append(@"</p>");
            itemsHtml.Append(@"<div style='page-break-before:always;'>");

            if(reportModel.TextHeaders != null)
            {
                if (!string.IsNullOrEmpty(reportModel.TextHeaders.Header1))
                {
                    itemsHtml.Append($@"<p style='font-size:16pt;color:#2e74b5;'>{reportModel.TextHeaders.Header1}</p>");
                }


                if (!string.IsNullOrEmpty(reportModel.TextHeaders.Header2))
                {
                    itemsHtml.Append($@"<p style='font-size:13pt;color:#2e74b5;'>{reportModel.TextHeaders.Header2}</p>");
                }


                if (!string.IsNullOrEmpty(reportModel.TextHeaders.Header3))
                {
                    itemsHtml.Append($@"<p style='font-size:12pt;color:#1f4d78;'>{reportModel.TextHeaders.Header3}</p>");
                }


                if (!string.IsNullOrEmpty(reportModel.TextHeaders.Header4))
                {
                    itemsHtml.Append($@"<p style='font-size:11pt;font-style:normal;'>{reportModel.TextHeaders.Header4}</p>");
                }


                if (!string.IsNullOrEmpty(reportModel.TextHeaders.Header5))
                {
                    itemsHtml.Append($@"<p style='font-size:10pt;font-style:normal;'>{reportModel.TextHeaders.Header5}</p>");
                }
            }
            foreach (var description in reportModel.DescriptionBlocks)
            {
                itemsHtml.Append($@"<p>{description}</p>");
            }

            //if (!string.IsNullOrEmpty(reportModel.TableName))
            //{
            //    itemsHtml += $@"<p style='padding-bottom: 0;'>{_localizationService.GetString("Table")} {i + 1}: {reportModel.TableName}</p>";
            //}

            itemsHtml.Append(@"<table width=""100%"" border=""1"">");

            // Table header
            itemsHtml.Append(@"<tr style=""background-color:#f5f5f5;font-weight:bold"">");
            itemsHtml.Append($@"<td>{_localizationService.GetString("CaseId")}</td>");
            itemsHtml.Append($@"<td>{_localizationService.GetString("CreatedAt")}</td>");
            itemsHtml.Append($@"<td>{_localizationService.GetString("DoneBy")}</td>");
            //itemsHtml += $@"<td>{_localizationService.GetString("ItemName")}</td>";

            foreach (var itemHeader in reportModel.ItemHeaders)
            {
                itemsHtml.Append($@"<td>{itemHeader.Value}</td>");
            }

            itemsHtml.Append(@"</tr>");

            foreach (var dataModel in reportModel.Items)
            {
                itemsHtml.Append(@"<tr>");
                itemsHtml.Append($@"<td>{dataModel.MicrotingSdkCaseId}</td>");

                itemsHtml.Append($@"<td>{dataModel.MicrotingSdkCaseDoneAt:dd.MM.yyyy HH:mm:ss}</td>");
                itemsHtml.Append($@"<td>{dataModel.DoneBy}</td>");

                foreach (var dataModelCaseField in dataModel.CaseFields)
                {
                    if (dataModelCaseField == "checked")
                    {
                        itemsHtml.Append($@"<td>&#10004;</td>");
                    }
                    else
                    {
                        if (dataModelCaseField == "unchecked")
                        {
                            itemsHtml.Append($@"<td></td>");
                        } else
                        {
                            itemsHtml.Append($@"<td>{dataModelCaseField}</td>");
                        }
                    }
                }

                // itemsHtml += $@"<td>{dataModel.ImagesCount}</td>";
                // itemsHtml += $@"<td>{dataModel.PostsCount}</td>";
                itemsHtml.Append(@"</tr>");
            }

            itemsHtml.Append(@"</table>");

            itemsHtml.Append(@"<br/>");

            // if (!string.IsNullOrEmpty(reportModel.TemplateName))
            // {
            //    itemsHtml += $@"{reportModel.TemplateName}";
            // }

            // pictures
            foreach (var (key, value) in reportModel.ImageNames)
            {
                itemsHtml.Append($@"<p>{_localizationService.GetString("Picture")}: {key[1]}</p>");

                itemsHtml = await InsertImage(value[0], itemsHtml, 700, 650, core, basePicturePath);

                if (!string.IsNullOrEmpty(value[1]))
                {
                    itemsHtml.Append($@"<a href=""{value[1]}"">{value[1]}</a>");
                }
            }

            itemsHtml.Append(@"</div>");
            itemsHtml.Append("</body>");

            html = html.Replace("{%ItemList%}", itemsHtml.ToString());

            word.AddHtml(html);
            word.Dispose();
            docxFileStream.Position = 0;
            return new OperationDataResult<Stream>(true, docxFileStream);
        }
        catch (Exception e)
        {
            Trace.TraceError(e.Message);
            _logger.LogError(e.Message);
            return new OperationDataResult<Stream>(
                false,
                _localizationService.GetString("ErrorWhileCreatingWordFile"));
        }
    }

    private async Task<StringBuilder> InsertImage(string imageName, StringBuilder itemsHtml, int imageSize, int imageWidth, Core core, string basePicturePath)
    {
        var filePath = Path.Combine(basePicturePath, imageName);
        Stream stream;
        if (_s3Enabled)
        {
            var storageResult = await core.GetFileFromS3Storage(imageName);
            stream = storageResult.ResponseStream;
        }
        else if (!File.Exists(filePath))
        {
            return null;
            // return new OperationDataResult<Stream>(
            //     false,
            //     _localizationService.GetString($"{imagesName} not found"));
        }
        else
        {
            stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        }

        using (var image = new MagickImage(stream))
        {
            decimal currentRation = image.Height / (decimal)image.Width;
            int newWidth = imageSize;
            int newHeight = (int)Math.Round((currentRation * newWidth));

            image.Resize((uint)newWidth, (uint)newHeight);
            image.Crop((uint)newWidth, (uint)newHeight);

            var base64String = image.ToBase64();
            itemsHtml.Append($@"<p><img src=""data:image/png;base64,{base64String}"" width=""{imageWidth}px"" alt="""" /></p>");
        }

        await stream.DisposeAsync();

        return itemsHtml;
    }
}