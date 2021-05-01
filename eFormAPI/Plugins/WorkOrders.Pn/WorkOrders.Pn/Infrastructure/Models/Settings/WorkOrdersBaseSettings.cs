namespace WorkOrders.Pn.Infrastructure.Models.Settings
{
    public class WorkOrdersBaseSettings
    {
        public string MaxParallelism { get; set; }
        public int NumberOfWorkers { get; set; }
        public int NewTaskId { get; set; }
        public int TaskListId { get; set; }
        public int FolderId { get; set; }
        public int FolderTasksId { get; set; }
    }
}
