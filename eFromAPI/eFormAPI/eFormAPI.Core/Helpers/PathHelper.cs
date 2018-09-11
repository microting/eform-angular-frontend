using System;
using System.IO;
using System.Runtime.InteropServices;
using eFormAPI.Common.Enums;

namespace eFormAPI.Core.Helpers
{
    public class PathHelper
    {
        /// <summary>
        /// Get current OS Platform
        /// </summary>
        /// <returns></returns>
        public static OSPlatforms GetOsVersion()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                return OSPlatforms.Linux;
            }
            if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                return OSPlatforms.OSX;
            }
            return OSPlatforms.Windows;
        }

        /// <summary>
        /// Get audio file for current application for OS platform
        /// </summary>
        /// <returns></returns>
        public static string GetAudioPath(string fileName)
        {
            var audioPath = GetAudioPath();
            return Path.Combine(audioPath, fileName);
        }

        /// <summary>
        /// Get audio directory for current application for OS platform
        /// </summary>
        /// <returns></returns>
        public static string GetAudioPath()
        {
            var storagePath = GetStoragePath();
            var audioDir = Path.Combine(storagePath, "picture");
            if (!Directory.Exists(audioDir))
            {
                Directory.CreateDirectory(audioDir);
            }
            return audioDir;
        }

        /// <summary>
        /// Get images directory for current application for OS platform
        /// </summary>
        /// <returns></returns>
        public static string GetImagesPath()
        {
            var storagePath = GetStoragePath();
            var imagesDir = Path.Combine(storagePath, "picture");
            if (!Directory.Exists(imagesDir))
            {
                Directory.CreateDirectory(imagesDir);
            }
            return imagesDir;
        }

        /// <summary>
        /// Get storage directory for current application for OS platform
        /// </summary>
        /// <returns></returns>
        public static string GetStoragePath()
        {
            var os = GetOsVersion();
            string homePath;
            switch (os)
            {
                case OSPlatforms.Linux:
                    homePath = Environment.CurrentDirectory;
                    break;
                case OSPlatforms.OSX:
                    homePath = Environment.CurrentDirectory;
                    break;
                case OSPlatforms.Windows:
                    homePath = Environment.CurrentDirectory;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            var storageDir = Path.Combine(homePath, "output", "datafolder");
            if (!Directory.Exists(storageDir))
            {
                Directory.CreateDirectory(storageDir);
            }
            return storageDir;
        }
    }
}
