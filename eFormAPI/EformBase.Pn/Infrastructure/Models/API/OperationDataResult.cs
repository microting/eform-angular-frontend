namespace EformBase.Pn.Infrastructure.Models.API
{
    public class OperationDataResult<TModel> : OperationResult
    {
        public OperationDataResult(bool success) : base(success)
        {
        }

        public OperationDataResult(bool success, string message) : base(success, message)
        {
        }

        public OperationDataResult(bool success, TModel model) : base(success)
        {
            Model = model;
        }

        public OperationDataResult(bool success, string message, TModel model) : base(success, message)
        {
            Model = model;
        }

        public TModel Model { get; set; }
    }
}