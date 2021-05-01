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

using Microting.eForm.Infrastructure;

namespace Monitoring.Pn.Helpers
{
    using System;
    using System.Linq;
    using Microting.EformMonitoringBase.Infrastructure.Data.Entities;
    using Microting.EformMonitoringBase.Infrastructure.Enums;
    using Microting.EformMonitoringBase.Infrastructure.Models.Blocks;
    using Newtonsoft.Json;

    public static class RulesBlockHelper
    {
        public static string GetRuleTriggerString(NotificationRule notificationRule, MicrotingDbContext dbContext)
        {
            var result = "";
            var jsonSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Include
            };
            switch (notificationRule.RuleType)
            {
                case RuleType.Select:
                    var multiSelectBlock = JsonConvert.DeserializeObject<SelectBlock>(notificationRule.Data, jsonSettings);
                    result = multiSelectBlock.KeyValuePairList
                        .Where(i => i.Selected)
                        .Aggregate(result, (current, item) => current + $"<p>{multiSelectBlock.Label} = {item.Value}</p>");
                    break;
                case RuleType.CheckBox:
                    var checkBoxBlock = JsonConvert.DeserializeObject<CheckBoxBlock>(notificationRule.Data, jsonSettings);
                    var checkboxState = checkBoxBlock.Selected ? "Checked" : "Not Checked";
                    result = $"<p>{checkBoxBlock.Label} = {checkboxState}</p>";
                    break;
                case RuleType.Number:
                    var numberBlock = JsonConvert.DeserializeObject<NumberBlock>(notificationRule.Data, jsonSettings);

                    if (numberBlock.GreaterThanValue != null)
                        result += $"<p>{numberBlock.Label} > {numberBlock.GreaterThanValue}</p>";

                    if (numberBlock.LessThanValue != null)
                        result += $"<p>{numberBlock.Label} < {numberBlock.LessThanValue}</p>";

                    if (numberBlock.EqualValue != null)
                        result += $"<p>{numberBlock.Label} = {numberBlock.EqualValue}</p>";
                    break;
                case null:
                    if (notificationRule.DeviceUsers.Any())
                    {
                        foreach (DeviceUser deviceUser in notificationRule.DeviceUsers)
                        {
                            result += dbContext.Sites.Single(x => x.MicrotingUid == deviceUser.DeviceUserId).Name;
                        }
                    }
                    break;
            }

            return result;
        }
    }
}
