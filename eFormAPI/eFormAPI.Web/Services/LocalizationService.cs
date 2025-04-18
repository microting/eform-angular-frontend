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

using System.Linq;
using System.Reflection;
using Castle.Core.Internal;
using eFormAPI.Web.Abstractions;
using Microsoft.Extensions.Localization;

namespace eFormAPI.Web.Services;

public class LocalizationService(IStringLocalizerFactory factory) : ILocalizationService
{
    private readonly IStringLocalizer _localizer = factory.Create("SharedResource",
        Assembly.GetEntryAssembly().FullName);

    public string GetString(string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return key;
        }
        var str = _localizer[key];
        return str.Value;
    }

    public string GetStringWithFormat(string format,
        params object[] args)
    {
        if (string.IsNullOrEmpty(format))
        {
            return format;
        }

        var message = _localizer[format];
        if (message?.Value == null)
        {
            return null;
        }

        if (args != null && args.Any())
        {
            return string.Format(message.Value, args);
        }

        return message.Value;
    }
}