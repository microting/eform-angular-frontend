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

namespace Monitoring.Pn.Controllers
{
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.EformMonitoringBase.Infrastructure.Const;
    using Microting.EformMonitoringBase.Infrastructure.Models;

    [Authorize]
    public class RulesController : Controller
    {
        private readonly IRulesService _rulesService;

        public RulesController(IRulesService rulesService)
        {
            _rulesService = rulesService;
        }

        [HttpGet("api/monitoring-pn/rules")]
        [Authorize(Policy = MonitoringClaims.AccessMonitoringPlugin)]
        public async Task<OperationResult> Index(NotificationListRequestModel requestModel)
        {
            return await _rulesService.Index(requestModel);
        }

        [HttpPost("api/monitoring-pn/rules")]
        [Authorize(Policy = MonitoringClaims.CreateNotificationRules)]
        public async Task<OperationResult> Create([FromBody] NotificationRuleModel model)
        {
            return await _rulesService.Create(model);
        }

        [HttpGet("api/monitoring-pn/rules/{id}")]
        [Authorize(Policy = MonitoringClaims.AccessMonitoringPlugin)]
        public async Task<OperationResult> Read(int id)
        {
            return await _rulesService.Read(id);
        }


        [HttpPut("api/monitoring-pn/rules")]
        [Authorize(Policy = MonitoringClaims.UpdateNotificationRules)]
        public async Task<OperationResult> Update([FromBody] NotificationRuleModel model)
        {
            return await _rulesService.Update(model);
        }

        [HttpDelete("api/monitoring-pn/rules/{id}")]
        [Authorize(Policy = MonitoringClaims.DeleteNotificationRules)]
        public async Task<OperationResult> Delete(int id)
        {
            return await _rulesService.Delete(id);
        }
    }
}
