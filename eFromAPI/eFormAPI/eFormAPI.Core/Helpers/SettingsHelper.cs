using System;
using System.Configuration;
using Amazon.Runtime.Internal.Util;
using eFormAPI.Common.Models.Settings;
using eFormAPI.Database.Entities;
using Microsoft.AspNetCore.Identity;

namespace eFormAPI.Core.Helpers
{
    public class SettingsHelper
    {
        private string _connectionString;
      //  private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public SettingsHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateAdminUser(AdminSetupModel adminSetupModel)
        {

        }

        //public static bool GetTwoFactorAuthForceInfo()
        //{
        //    try
        //    {

        //        var configuration = WebConfigurationManager.OpenWebConfiguration("~");
        //        var section = (AppSettingsSection)configuration.GetSection("appSettings");
        //        return section.Settings["auth:isTwoFactorForced"].Value.Equals("True");
        //    }
        //    catch (Exception e)
        //    {
        //        Logger.Error(e.Message);
        //    }
        //    return false;
        //}

        //public static void UpdateTwoFactorAuthForceInfo(bool isTwoFactorEnabled)
        //{
        //    try
        //    {
        //        var configuration = WebConfigurationManager.OpenWebConfiguration("~");
        //        var section = (AppSettingsSection)configuration.GetSection("appSettings");
        //        section.Settings["auth:isTwoFactorForced"].Value = isTwoFactorEnabled.ToString();
        //        configuration.Save();
        //        ConfigurationManager.RefreshSection("appSettings");
        //    }
        //    catch (Exception e)
        //    {
        //        Logger.Error(e.Message);
        //    }
        //}
    }
}