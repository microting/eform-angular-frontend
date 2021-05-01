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
    public static class ProducersHelper
    {
        public static ProducerModel ComposeValues(ProducerModel producer, JToken headers, JToken producerObj)
        {
            if (int.TryParse(headers[0]["headerValue"].ToString(), out var locationId))
            {
                producer.Name = producerObj[locationId].ToString(); // NAme
            }
            if (int.TryParse(headers[1]["headerValue"].ToString(), out locationId))
            {
                producer.Description = producerObj[locationId].ToString(); //Description
            }
            if (int.TryParse(headers[2]["headerValue"].ToString(), out locationId))
            {
                producer.ForeignId = producerObj[locationId].ToString(); //Foreign Id
            }
            if (int.TryParse(headers[3]["headerValue"].ToString(), out locationId))
            {
                producer.Address = producerObj[locationId].ToString(); //Address
            }

            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.City = producerObj[locationId].ToString(); //City
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.ZipCode = producerObj[locationId].ToString(); //ZipCode
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.Phone = producerObj[locationId].ToString(); //Phone
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                producer.ContactPerson = producerObj[locationId].ToString(); //Contact Person
            }
            return producer;
        }
    }
}