namespace TrashInspection.Pn.Infrastructure.Const
{
    public static class TrashInspectionClaims
    {
        public const string AccessTrashInspectionPlugin = "tip_a";

        #region trashinspections

        public const string AccessTrashInspections = "tip_tia";
        public const string CreateTrashInspections = "tip_tic";
        public const string UpdateTrashInspections = "tip_tiu";
        public const string DeleteTrashInspections = "tip_tid";
        public const string GetPdf = "tip_tipdf";
        public const string GetDocx = "tip_tidocx";
        public const string GetStats = "tip_tistats";
        
        #endregion
                
        #region installations
        
        public const string AccessInstallations = "tip_ia";
        public const string CreateInstallations = "tip_ic";
        public const string UpdateInstallations = "tip_iu";
        public const string DeleteInstallations = "tip_id";
        #endregion
        
        #region fractions

        public const string AccessFractions = "tip_fa";
        public const string CreateFractions = "tip_fc";
        public const string UpdateFractions = "tip_fu";
        public const string DeleteFractions = "tip_fd";

        #endregion
        
        #region segments
        
        public const string AccessSegments = "tip_sa";
        public const string CreateSegments = "tip_sc";
        public const string UpdateSegments = "tip_su";
        public const string DeleteSegments = "tip_sd";
        
        #endregion
        
        #region producers
        
        public const string AccessProducers = "tip_pa";
        public const string CreateProducers = "tip_pc";
        public const string UpdateProducers = "tip_pu";
        public const string DeleteProducers = "tip_pd";
        
        #endregion
        
        #region transporters
        
        public const string AccessTransporters = "tip_ta";
        public const string CreateTransporters = "tip_tc";
        public const string UpdateTransporters = "tip_tu";
        public const string DeleteTransporters = "tip_td";
        
        #endregion
        
        #region reports
        
        public const string AccessReports = "tip_ra";
        public const string CreateReports = "tip_rc";
        public const string UpdateReports = "tip_ru";
        public const string DeleteReports = "tip_rd";
        
        #endregion

    }
}