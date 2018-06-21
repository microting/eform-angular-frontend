using System.Collections.Generic;
using System.Web.Http;
using EformBase.Pn.Infrastructure;
using EformBase.Pn.Infrastructure.Models.API;
using Vehicles.Pn.Models;

namespace Vehicles.Pn.Controllers
{
    public class VehiclesPnController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpPost]
        [Route("api/vehicles-pn")]
        public OperationDataResult<VehiclesPnModel> GetAllVehicles(VehiclesPnRequestModel pnRequestModel)
        {
            var vehiclesPnModel = new VehiclesPnModel()
            {
                Total = 1,
                Vehicles = new List<VehiclePnModel>()
            };
            
            
            return new OperationDataResult<VehiclesPnModel>(true, vehiclesPnModel);
        }

        [HttpPost]
        [Route("api/vehicles-pn/create-vehicle")]
        public OperationResult CreateVehicle(VehiclePnModel vehiclePnCreateModel)
        {
            var vehiclePnModel = new VehiclePnModel();

            vehiclePnModel = vehiclePnCreateModel;


            return new OperationResult(true, 
                $"Vehicle {vehiclePnCreateModel.Brand} {vehiclePnCreateModel.ModelName} created");
        }
        
        [HttpPost]
        [Route("api/vehicles-pn/update-vehicle")]
        public OperationResult UpdateVehicle(VehiclePnModel vehiclePnUpdateModel)
        {
            var vehiclePnEntity = new VehiclePnModel();

            vehiclePnEntity = vehiclePnUpdateModel;

            return new OperationResult(true, $"Vehicle {vehiclePnUpdateModel.Id} updated");
        }

    }
}
