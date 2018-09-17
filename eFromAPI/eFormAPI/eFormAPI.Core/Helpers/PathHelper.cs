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
        /// Get eform settings images for login-page file
        /// </summary>
        /// <returns></returns>
        public static string GetEformLoginPageSettingsImagesPath(string fileName)
        {
            var eformDir = GetEformLoginPageSettingsImagesPath();
            return Path.Combine(eformDir, fileName);
        }

        /// <summary>
        /// Get eform settings images for login-page directory
        /// </summary>
        /// <returns></returns>
        public static string GetEformLoginPageSettingsImagesPath()
        {
            var storagePath = GetStoragePath();
            var eformDir = Path.Combine(storagePath, "picture", "settings", "login-page");
            if (!Directory.Exists(eformDir))
            {
                Directory.CreateDirectory(eformDir);
            }
            return eformDir;
        }

        /// <summary>
        /// Get eform settings images file
        /// </summary>
        /// <returns></returns>
        public static string GetEformSettingsImagesPath(string fileName)
        {
            var eformDir = GetEformSettingsImagesPath();
            return Path.Combine(eformDir, fileName);
        }

        /// <summary>
        /// Get eform settings images directory
        /// </summary>
        /// <returns></returns>
        public static string GetEformSettingsImagesPath()
        {
            var storagePath = GetStoragePath();
            var eformDir = Path.Combine(storagePath, "picture", "settings");
            if (!Directory.Exists(eformDir))
            {
                Directory.CreateDirectory(eformDir);
            }
            return eformDir;
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
            var outputPath = GetOutputPath();
            var storagePath = Path.Combine(outputPath, "datafolder");
            if (!Directory.Exists(storagePath))
            {
                Directory.CreateDirectory(storagePath);
            }
            return storagePath;
        }

        /// <summary>
        /// Get output file for current application for OS platform
        /// </summary>
        /// <returns></returns>
        public static string GetOutputPath(string fileName)
        {
            var audioPath = GetOutputPath();
            return Path.Combine(audioPath, fileName);
        }

        /// <summary>
        /// Get output directory for current application for OS platform
        /// </summary>
        /// <returns></returns>
        public static string GetOutputPath()
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
            var storageDir = Path.Combine(homePath, "output");
            if (!Directory.Exists(storageDir))
            {
                Directory.CreateDirectory(storageDir);
            }
            return storageDir;
        }
    }
}
