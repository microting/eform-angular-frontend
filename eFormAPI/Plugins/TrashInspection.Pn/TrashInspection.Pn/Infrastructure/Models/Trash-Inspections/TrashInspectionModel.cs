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

using System;
using System.ComponentModel.DataAnnotations;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionModel
    {
        //vars
        //global vars
        public int Id { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [StringLength(255)]
        public string WorkflowState { get; set; }

        public int Version { get; set; }

        public int CreatedByUserId { get; set; }

        public int UpdatedByUserId { get; set; }

        public string WeighingNumber { get; set; }

        public DateTime Date { get; set; }

        public DateTime Time { get; set; }

        public string RegistrationNumber { get; set; }

        public string EakCode { get; set; }

        public string Token { get; set; }

        public bool MustBeInspected { get; set; }

        public int Status { get; set; }

        public bool IsApproved { get; set; }

        public bool InspectionDone { get; set; }

        public bool ExtendedInspection { get; set; }

        public string Comment { get; set; }

        public int SdkCaseId { get; set; }

        public int SdkeFormId { get; set; }

        public bool ResponseSendToCallBackUrl { get; set; }

        //

        //producer vars
        public string ProducerForeignId { get; set; }

        public int ProducerId { get; set; }

        public string Producer { get; set; }

        public string ProducerAddress { get; set; }

        public string ProducerCity { get; set; }

        public string ProducerZip { get; set; }

        public string ProducerPhone { get; set; }

        public string ProducerContact { get; set; }
        //

        //transporter vars
        public string TransporterForeignId { get; set; }

        public int TransporterId { get; set; }

        public string Transporter { get; set; }

        public string TransporterAddress { get; set; }

        public string TransporterCity { get; set; }

        public string TransporterZip { get; set; }

        public string TransporterPhone { get; set; }

        public string TransporterContact { get; set; }
        //

        //fraction vars
        public int? FractionId { get; set; }

        public string TrashFraction { get; set; }
        //

        //installation vars
        public int? InstallationId { get; set; }

        public string InstallationName { get; set; }
        //

        //segment vars
        public int? SegmentId { get; set; }

        public string Segment { get; set; }
        //
        //
    }
}
