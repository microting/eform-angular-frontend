using System;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionVersionModel
    {
        public int Id { get; set; }
        
        public DateTime UpdatedAt { get; set; }
        
        public int Version { get; set; }

        public string WeighingNumber { get; set; }

        public DateTime Date { get; set; }

        public DateTime Time { get; set; }

        public string RegistrationNumber { get; set; }

        public string TrashFraction { get; set; }

        public int? FractionId { get; set; }

        public string EakCode { get; set; }

        public string Producer { get; set; }

        public string Transporter { get; set; }

        public int? InstallationId { get; set; }
        
        public string InstallationName { get; set; }

        public bool MustBeInspected { get; set; }

        public int Status { get; set; }

        public int TrashInspectionId { get; set; }

        public int? SegmentId { get; set; }
        
        public string Segment { get; set; }

        public bool ExtendedInspection { get; set; }

        public bool InspectionDone { get; set; }

        public bool IsApproved { get; set; }

        public string ApprovedValue { get; set; }

        public string Comment { get; set; }

        public int? ProducerId { get; set; }

        public int? TransporterId { get; set; }

        public int? FirstWeight { get; set; }

        public int? SecondWeight { get; set; }

        public string ErrorFromCallBack { get; set; }

        public bool ResponseSendToCallBackUrl { get; set; }

        public string SuccessMessageFromCallBack { get; set; }
    }
}