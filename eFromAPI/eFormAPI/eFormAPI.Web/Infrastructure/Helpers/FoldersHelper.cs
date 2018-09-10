using System.IO;

namespace eFormAPI.Web.Infrastructure.Helpers
{
    public class FoldersHelper
    {
        public static void ClearFolder(string folderName)
        {
            var dir = new DirectoryInfo(folderName);

            foreach(var fi in dir.GetFiles())
            {
                fi.Delete();
            }

            foreach (var di in dir.GetDirectories())
            {
                ClearFolder(di.FullName);
                di.Delete();
            }
        }
    }
}