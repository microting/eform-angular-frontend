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

using Newtonsoft.Json.Linq;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    public static class TransportersHelper
    {
        public static TransporterModel ComposeValues(TransporterModel transporter, JToken headers,
            JToken transporterObj)
        {
            if (int.TryParse(headers[0]["headerValue"].ToString(), out var locationId))
            {
                transporter.Name = transporterObj[locationId].ToString(); // Number
            }
            if (int.TryParse(headers[1]["headerValue"].ToString(), out locationId))
            {
                transporter.Description = transporterObj[locationId].ToString(); //Name
            }
            if (int.TryParse(headers[2]["headerValue"].ToString(), out locationId))
            {
                transporter.ForeignId = transporterObj[locationId].ToString(); //Location Code
            }
            if (int.TryParse(headers[3]["headerValue"].ToString(), out locationId))
            {
                transporter.Address = transporterObj[locationId].ToString(); //eFormId
            }

            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.City = transporterObj[locationId].ToString();
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.ZipCode = transporterObj[locationId].ToString();
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.Phone = transporterObj[locationId].ToString();
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                transporter.ContactPerson = transporterObj[locationId].ToString();
            }

            return transporter;
        }
    }
}