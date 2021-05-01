/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace OuterInnerResource.Pn.Infrastructure.Data.Seed.Data
{
    public class OuterInnerResourceConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:SdkConnectionString",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:LogLevel",
                Value = "4"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:LogLimit",
                Value = "25000"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:MaxParallelism",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:NumberOfWorkers",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:Token",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:SdkeFormId",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:EnabledSiteIds",
                Value = ""
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:QuickSyncEnabled",
                Value = "false"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:ReportTimeType",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:OuterResourceName",
                Value = "Outer resources"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:InnerResourceName",
                Value = "Inner resources"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:OuterTotalTimeName",
                Value = "Working day"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:InnerTotalTimeName",
                Value = "Time tracking for the whole day"
            },
            new PluginConfigurationValue()
            {
                Name = "OuterInnerResourceSettings:ShouldCheckAllCases",
                Value = "false"
            },
        };
    }
}
