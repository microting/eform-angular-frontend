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

            var core = _coreHelper.GetCore();
           
            var vehiclesModel = new VehiclesPnModel();
            return new OperationDataResult<VehiclesPnModel>(true, vehiclesModel);
        }

        [HttpPost]
        [Route("api/vehicles-pn/create-vehicle")]
        public OperationResult CreateVehicle(VehiclePnModel pnModel)
        {
            var core = _coreHelper.GetCore();
        
            return new OperationResult(true, $"Vehicle {pnModel.Brand} {pnModel.ModelName} created");
        
        }
        
        [HttpPost]
        [Route("api/vehicles-pn/update-vehicle")]
        public OperationResult UpdateVehicle(VehiclePnModel pnModel)
        {
        
            var core = _coreHelper.GetCore();
        
            return new OperationResult(true, $"Vehicle {pnModel.Id} updated");
        }

    }
}
