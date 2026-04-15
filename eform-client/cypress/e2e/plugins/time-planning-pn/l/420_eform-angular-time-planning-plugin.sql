-- MariaDB dump 10.19  Distrib 10.6.16-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: 420_eform-angular-time-planning-plugin
-- ------------------------------------------------------
-- Server version	10.8.8-MariaDB-1:10.8.8+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AssignedSiteVersions`
--

DROP TABLE IF EXISTS `AssignedSiteVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssignedSiteVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SiteId` int(11) NOT NULL,
  `AssignedSiteId` int(11) NOT NULL,
  `CaseMicrotingUid` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssignedSiteVersions`
--

LOCK TABLES `AssignedSiteVersions` WRITE;
/*!40000 ALTER TABLE `AssignedSiteVersions` DISABLE KEYS */;
INSERT INTO `AssignedSiteVersions` VALUES (1,16172,1,NULL,'2022-09-21 08:45:32.313238','2022-09-21 08:45:32.313238','created',1,1,1),(2,16172,1,2,'2022-09-21 08:45:32.313238','2022-09-21 08:45:37.872319','created',1,1,2),(3,16178,2,NULL,'2022-09-23 12:13:31.492144','2022-09-23 12:13:31.492147','created',2,2,1),(4,16178,2,4,'2022-09-23 12:13:31.492144','2022-09-23 12:13:33.334108','created',2,2,2),(5,4,3,NULL,'2022-09-23 12:13:56.753796','2022-09-23 12:13:56.753797','created',2,2,1),(6,4,3,6,'2022-09-23 12:13:56.753796','2022-09-23 12:13:58.617323','created',2,2,2),(7,5,4,NULL,'2022-09-23 12:14:13.017549','2022-09-23 12:14:13.017549','created',2,2,1),(8,5,4,8,'2022-09-23 12:14:13.017549','2022-09-23 12:14:14.827839','created',2,2,2),(9,6,5,NULL,'2022-09-23 12:14:27.287206','2022-09-23 12:14:27.287207','created',2,2,1),(10,6,5,10,'2022-09-23 12:14:27.287206','2022-09-23 12:14:29.291624','created',2,2,2),(11,7,6,NULL,'2022-09-23 12:14:43.522259','2022-09-23 12:14:43.522260','created',2,2,1),(12,7,6,12,'2022-09-23 12:14:43.522259','2022-09-23 12:14:45.478693','created',2,2,2),(13,8,7,NULL,'2022-09-23 12:15:00.544841','2022-09-23 12:15:00.544842','created',2,2,1),(14,8,7,14,'2022-09-23 12:15:00.544841','2022-09-23 12:15:05.397224','created',2,2,2),(15,9,8,NULL,'2022-09-23 12:15:21.294176','2022-09-23 12:15:21.294177','created',2,2,1),(16,9,8,16,'2022-09-23 12:15:21.294176','2022-09-23 12:15:23.316193','created',2,2,2),(17,10,9,NULL,'2022-09-23 12:15:38.752310','2022-09-23 12:15:38.752310','created',2,2,1),(18,10,9,18,'2022-09-23 12:15:38.752310','2022-09-23 12:15:42.180273','created',2,2,2),(19,11,10,NULL,'2022-09-23 12:15:54.538444','2022-09-23 12:15:54.538444','created',2,2,1),(20,11,10,20,'2022-09-23 12:15:54.538444','2022-09-23 12:15:56.830008','created',2,2,2),(21,12,11,NULL,'2022-09-23 12:16:09.237669','2022-09-23 12:16:09.237669','created',2,2,1),(22,12,11,22,'2022-09-23 12:16:09.237669','2022-09-23 12:16:11.945223','created',2,2,2),(23,13,12,NULL,'2022-09-23 12:16:27.179964','2022-09-23 12:16:27.179964','created',2,2,1),(24,13,12,24,'2022-09-23 12:16:27.179964','2022-09-23 12:16:29.711134','created',2,2,2),(25,14,13,NULL,'2022-09-23 12:16:48.671467','2022-09-23 12:16:48.671467','created',2,2,1),(26,14,13,26,'2022-09-23 12:16:48.671467','2022-09-23 12:16:51.111857','created',2,2,2),(27,15,14,NULL,'2022-09-23 12:17:08.264578','2022-09-23 12:17:08.264578','created',2,2,1),(28,15,14,28,'2022-09-23 12:17:08.264578','2022-09-23 12:17:10.721482','created',2,2,2),(29,16202,15,NULL,'2022-09-23 12:21:17.640355','2022-09-23 12:21:17.640355','created',1,1,1),(30,16202,15,30,'2022-09-23 12:21:17.640355','2022-09-23 12:21:19.432166','created',1,1,2),(31,16180,16,NULL,'2022-09-23 12:22:29.895609','2022-09-23 12:22:29.895609','created',2,2,1),(32,16180,16,32,'2022-09-23 12:22:29.895609','2022-09-23 12:22:33.487784','created',2,2,2),(33,16182,17,NULL,'2022-09-26 06:43:17.009779','2022-09-26 06:43:17.009779','created',2,2,1),(34,16182,17,34,'2022-09-26 06:43:17.009779','2022-09-26 06:43:18.929358','created',2,2,2),(35,16184,18,NULL,'2022-09-26 06:43:23.088818','2022-09-26 06:43:23.088819','created',2,2,1),(36,16184,18,36,'2022-09-26 06:43:23.088818','2022-09-26 06:43:25.131553','created',2,2,2),(37,16186,19,NULL,'2022-09-26 06:43:28.637534','2022-09-26 06:43:28.637534','created',2,2,1),(38,16186,19,38,'2022-09-26 06:43:28.637534','2022-09-26 06:43:31.174313','created',2,2,2),(39,16188,20,NULL,'2022-09-26 06:43:34.790832','2022-09-26 06:43:34.790832','created',2,2,1),(40,16188,20,40,'2022-09-26 06:43:34.790832','2022-09-26 06:43:36.732424','created',2,2,2),(41,16190,21,NULL,'2022-09-26 06:43:40.132798','2022-09-26 06:43:40.132798','created',2,2,1),(42,16190,21,42,'2022-09-26 06:43:40.132798','2022-09-26 06:43:42.175879','created',2,2,2),(43,16192,22,NULL,'2022-09-26 06:43:47.786915','2022-09-26 06:43:47.786915','created',2,2,1),(44,16192,22,44,'2022-09-26 06:43:47.786915','2022-09-26 06:43:49.601975','created',2,2,2),(45,16194,23,NULL,'2022-09-26 06:43:53.016408','2022-09-26 06:43:53.016408','created',2,2,1),(46,16194,23,46,'2022-09-26 06:43:53.016408','2022-09-26 06:43:55.484046','created',2,2,2),(47,16196,24,NULL,'2022-09-26 06:43:58.723891','2022-09-26 06:43:58.723891','created',2,2,1),(48,16196,24,48,'2022-09-26 06:43:58.723891','2022-09-26 06:44:00.895990','created',2,2,2),(49,16198,25,NULL,'2022-09-26 06:44:04.968660','2022-09-26 06:44:04.968660','created',2,2,1),(50,16198,25,50,'2022-09-26 06:44:04.968660','2022-09-26 06:44:07.132129','created',2,2,2),(51,16200,26,NULL,'2022-09-26 06:44:10.338696','2022-09-26 06:44:10.338696','created',2,2,1),(52,16200,26,52,'2022-09-26 06:44:10.338696','2022-09-26 06:44:12.762396','created',2,2,2),(53,16204,27,NULL,'2022-09-26 12:04:22.414182','2022-09-26 12:04:22.414182','created',2,2,1),(54,16204,27,54,'2022-09-26 12:04:22.414182','2022-09-26 12:04:24.814913','created',2,2,2),(55,16206,28,NULL,'2022-09-26 12:04:28.977874','2022-09-26 12:04:28.977874','created',2,2,1),(56,16206,28,56,'2022-09-26 12:04:28.977874','2022-09-26 12:04:31.483222','created',2,2,2),(57,16170,29,NULL,'2022-09-26 12:04:37.350289','2022-09-26 12:04:37.350289','created',2,2,1),(58,16170,29,58,'2022-09-26 12:04:37.350289','2022-09-26 12:04:39.659647','created',2,2,2),(61,16184,31,NULL,'2023-02-06 13:27:33.282709','2023-02-06 13:27:33.282794','created',4,4,1),(64,16184,31,2790,'2023-02-06 13:27:33.282709','2023-02-06 13:27:36.888965','created',4,4,2);
/*!40000 ALTER TABLE `AssignedSiteVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssignedSites`
--

DROP TABLE IF EXISTS `AssignedSites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssignedSites` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SiteId` int(11) NOT NULL,
  `CaseMicrotingUid` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssignedSites`
--

LOCK TABLES `AssignedSites` WRITE;
/*!40000 ALTER TABLE `AssignedSites` DISABLE KEYS */;
INSERT INTO `AssignedSites` VALUES (1,16172,2,'2022-09-21 08:45:32.313238','2022-09-21 08:45:37.872319','created',1,1,2),(2,16178,4,'2022-09-23 12:13:31.492144','2022-09-23 12:13:33.334108','created',2,2,2),(3,4,6,'2022-09-23 12:13:56.753796','2022-09-23 12:13:58.617323','removed',2,2,2),(4,5,8,'2022-09-23 12:14:13.017549','2022-09-23 12:14:14.827839','removed',2,2,2),(5,6,10,'2022-09-23 12:14:27.287206','2022-09-23 12:14:29.291624','removed',2,2,2),(6,7,12,'2022-09-23 12:14:43.522259','2022-09-23 12:14:45.478693','removed',2,2,2),(7,8,14,'2022-09-23 12:15:00.544841','2022-09-23 12:15:05.397224','removed',2,2,2),(8,9,16,'2022-09-23 12:15:21.294176','2022-09-23 12:15:23.316193','removed',2,2,2),(9,10,18,'2022-09-23 12:15:38.752310','2022-09-23 12:15:42.180273','removed',2,2,2),(10,11,20,'2022-09-23 12:15:54.538444','2022-09-23 12:15:56.830008','removed',2,2,2),(11,12,22,'2022-09-23 12:16:09.237669','2022-09-23 12:16:11.945223','removed',2,2,2),(12,13,24,'2022-09-23 12:16:27.179964','2022-09-23 12:16:29.711134','removed',2,2,2),(13,14,26,'2022-09-23 12:16:48.671467','2022-09-23 12:16:51.111857','removed',2,2,2),(14,15,28,'2022-09-23 12:17:08.264578','2022-09-23 12:17:10.721482','removed',2,2,2),(15,16202,30,'2022-09-23 12:21:17.640355','2022-09-23 12:21:19.432166','created',1,1,2),(16,16180,32,'2022-09-23 12:22:29.895609','2022-09-23 12:22:33.487784','created',2,2,2),(17,16182,34,'2022-09-26 06:43:17.009779','2022-09-26 06:43:18.929358','created',2,2,2),(18,16184,36,'2022-09-26 06:43:23.088818','2022-09-26 06:43:25.131553','removed',2,2,2),(19,16186,38,'2022-09-26 06:43:28.637534','2022-09-26 06:43:31.174313','created',2,2,2),(20,16188,40,'2022-09-26 06:43:34.790832','2022-09-26 06:43:36.732424','created',2,2,2),(21,16190,42,'2022-09-26 06:43:40.132798','2022-09-26 06:43:42.175879','created',2,2,2),(22,16192,44,'2022-09-26 06:43:47.786915','2022-09-26 06:43:49.601975','created',2,2,2),(23,16194,46,'2022-09-26 06:43:53.016408','2022-09-26 06:43:55.484046','created',2,2,2),(24,16196,48,'2022-09-26 06:43:58.723891','2022-09-26 06:44:00.895990','created',2,2,2),(25,16198,50,'2022-09-26 06:44:04.968660','2022-09-26 06:44:07.132129','created',2,2,2),(26,16200,52,'2022-09-26 06:44:10.338696','2022-09-26 06:44:12.762396','created',2,2,2),(27,16204,54,'2022-09-26 12:04:22.414182','2022-09-26 12:04:24.814913','created',2,2,2),(28,16206,56,'2022-09-26 12:04:28.977874','2022-09-26 12:04:31.483222','created',2,2,2),(29,16170,58,'2022-09-26 12:04:37.350289','2022-09-26 12:04:39.659647','removed',2,2,2),(31,16184,2790,'2023-02-06 13:27:33.282709','2023-02-06 13:27:36.888965','created',4,4,2);
/*!40000 ALTER TABLE `AssignedSites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messages` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` longtext DEFAULT NULL,
  `DaName` longtext DEFAULT NULL,
  `DeName` longtext DEFAULT NULL,
  `EnName` longtext DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES (1,'DayOff','Fridag','Freier Tag','Day off'),(2,'Vacation','Ferie','Urlaub','Vacation'),(3,'Sick','Syg','Krank','Sick'),(4,'Course','Kursus','Kurs','Course'),(5,'LeaveOfAbsence','Orlov','Urlaub','Leave of absence'),(7,'Children1stSick','Barn 1. sygedag','1. Krankheitstag der Kinder','Children 1st sick'),(8,'Children2ndSick','Barn 2. sygedag','2. Krankheitstag der Kinder','Children 2nd sick');
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlanRegistrationVersions`
--

DROP TABLE IF EXISTS `PlanRegistrationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlanRegistrationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SdkSitId` int(11) NOT NULL,
  `Date` datetime(6) NOT NULL,
  `PlanText` longtext DEFAULT NULL,
  `PlanHours` double NOT NULL,
  `Start1Id` int(11) NOT NULL,
  `Stop1Id` int(11) NOT NULL,
  `Pause1Id` int(11) NOT NULL,
  `Start2Id` int(11) NOT NULL,
  `Stop2Id` int(11) NOT NULL,
  `Pause2Id` int(11) NOT NULL,
  `NettoHours` double NOT NULL,
  `Flex` double NOT NULL,
  `SumFlexEnd` double NOT NULL,
  `PaiedOutFlex` double NOT NULL,
  `MessageId` int(11) DEFAULT NULL,
  `CommentOffice` longtext DEFAULT NULL,
  `CommentOfficeAll` longtext DEFAULT NULL,
  `PlanRegistrationId` int(11) NOT NULL,
  `StatusCaseId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  `WorkerComment` longtext DEFAULT NULL,
  `SumFlexStart` double NOT NULL DEFAULT 0,
  `DataFromDevice` tinyint(1) NOT NULL DEFAULT 0,
  `RegistrationDeviceId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=31793 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PlanRegistrations`
--

DROP TABLE IF EXISTS `PlanRegistrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlanRegistrations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SdkSitId` int(11) NOT NULL,
  `Date` datetime(6) NOT NULL,
  `PlanText` longtext DEFAULT NULL,
  `PlanHours` double NOT NULL,
  `Start1Id` int(11) NOT NULL,
  `Stop1Id` int(11) NOT NULL,
  `Pause1Id` int(11) NOT NULL,
  `Start2Id` int(11) NOT NULL,
  `Stop2Id` int(11) NOT NULL,
  `Pause2Id` int(11) NOT NULL,
  `NettoHours` double NOT NULL,
  `Flex` double NOT NULL,
  `SumFlexEnd` double NOT NULL,
  `PaiedOutFlex` double NOT NULL,
  `MessageId` int(11) DEFAULT NULL,
  `CommentOffice` longtext DEFAULT NULL,
  `CommentOfficeAll` longtext DEFAULT NULL,
  `StatusCaseId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  `WorkerComment` longtext DEFAULT NULL,
  `SumFlexStart` double NOT NULL DEFAULT 0,
  `DataFromDevice` tinyint(1) NOT NULL DEFAULT 0,
  `RegistrationDeviceId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_PlanRegistrations_MessageId` (`MessageId`),
  CONSTRAINT `FK_PlanRegistrations_Messages_MessageId` FOREIGN KEY (`MessageId`) REFERENCES `Messages` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4594 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PluginConfigurationValueVersions`
--

DROP TABLE IF EXISTS `PluginConfigurationValueVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PluginConfigurationValueVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` longtext DEFAULT NULL,
  `Value` longtext DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PluginConfigurationValueVersions`
--

LOCK TABLES `PluginConfigurationValueVersions` WRITE;
/*!40000 ALTER TABLE `PluginConfigurationValueVersions` DISABLE KEYS */;
INSERT INTO `PluginConfigurationValueVersions` VALUES (1,'TimePlanningBaseSettings:EformId','0','2022-09-20 15:00:41.335947','2022-09-20 15:00:41.335947','created',0,0,1),(2,'TimePlanningBaseSettings:InfoeFormId','0','2022-09-20 15:00:44.560360','2022-09-20 15:00:44.560360','created',0,0,1),(3,'TimePlanningBaseSettings:InfoeFormId','5','2024-05-22 06:04:43.279511','2024-05-22 06:04:43.279881','created',0,0,2);
/*!40000 ALTER TABLE `PluginConfigurationValueVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PluginConfigurationValues`
--

DROP TABLE IF EXISTS `PluginConfigurationValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PluginConfigurationValues` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` longtext DEFAULT NULL,
  `Value` longtext DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PluginConfigurationValues`
--

LOCK TABLES `PluginConfigurationValues` WRITE;
/*!40000 ALTER TABLE `PluginConfigurationValues` DISABLE KEYS */;
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (1,'TimePlanningBaseSettings:FolderId','1','2025-01-25 04:39:26.778746','2025-01-25 04:41:37.460412','created',1,0,2);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (2,'TimePlanningBaseSettings:EformId','1','2025-01-25 04:39:27.010123','2025-01-25 04:41:34.810739','created',1,0,2);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (3,'TimePlanningBaseSettings:InfoeFormId','13','2025-01-25 04:39:27.020965','2025-01-25 04:41:35.992385','created',1,0,2);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (4,'TimePlanningBaseSettings:MaxHistoryDays','30','2025-01-25 04:39:27.025951','2025-01-25 04:39:27.025953','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (5,'TimePlanningBaseSettings:MaxDaysEditable','45','2025-01-25 04:39:27.031890','2025-01-25 04:39:27.031892','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (6,'TimePlanningBaseSettings:SiteIdsForCheck','','2025-01-25 04:39:27.036792','2025-01-25 04:39:27.036793','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (7,'TimePlanningBaseSettings:AllowUsersToUpdateTimeRegistrations','0','2025-01-25 04:39:27.041203','2025-01-25 04:39:27.041205','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (8,'TimePlanningBaseSettings:DateOfBlockingUserUpdateTimeRegistrations','20','2025-01-25 04:39:27.045874','2025-01-25 04:39:27.045875','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (9,'TimePlanningBaseSettings:GoogleApiKey','','2025-01-25 04:39:27.050854','2025-01-25 04:39:27.050856','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (10,'TimePlanningBaseSettings:GoogleSheetId','','2025-01-25 04:39:27.056632','2025-01-25 04:39:27.056634','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (11,'TimePlanningBaseSettings:GoogleSheetLastModified','','2025-01-25 04:39:27.061178','2025-01-25 04:39:27.061180','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (12,'TimePlanningBaseSettings:MondayBreakMinutesDivider','180','2025-01-25 04:39:27.066239','2025-01-25 04:39:27.066241','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (13,'TimePlanningBaseSettings:MondayBreakMinutesPrDivider','30','2025-01-25 04:39:27.071726','2025-01-25 04:39:27.071728','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (14,'TimePlanningBaseSettings:TuesdayBreakMinutesDivider','180','2025-01-25 04:39:27.077072','2025-01-25 04:39:27.077073','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (15,'TimePlanningBaseSettings:TuesdayBreakMinutesPrDivider','30','2025-01-25 04:39:27.082142','2025-01-25 04:39:27.082144','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (16,'TimePlanningBaseSettings:WednesdayBreakMinutesDivider','180','2025-01-25 04:39:27.088131','2025-01-25 04:39:27.088133','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (17,'TimePlanningBaseSettings:WednesdayBreakMinutesPrDivider','30','2025-01-25 04:39:27.092556','2025-01-25 04:39:27.092558','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (18,'TimePlanningBaseSettings:ThursdayBreakMinutesDivider','180','2025-01-25 04:39:27.098007','2025-01-25 04:39:27.098009','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (19,'TimePlanningBaseSettings:ThursdayBreakMinutesPrDivider','30','2025-01-25 04:39:27.103689','2025-01-25 04:39:27.103691','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (20,'TimePlanningBaseSettings:FridayBreakMinutesDivider','180','2025-01-25 04:39:27.108050','2025-01-25 04:39:27.108051','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (21,'TimePlanningBaseSettings:FridayBreakMinutesPrDivider','30','2025-01-25 04:39:27.113702','2025-01-25 04:39:27.113704','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (22,'TimePlanningBaseSettings:SaturdayBreakMinutesDivider','120','2025-01-25 04:39:27.118429','2025-01-25 04:39:27.118430','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (23,'TimePlanningBaseSettings:SaturdayBreakMinutesPrDivider','30','2025-01-25 04:39:27.123321','2025-01-25 04:39:27.123323','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (24,'TimePlanningBaseSettings:SundayBreakMinutesDivider','120','2025-01-25 04:39:27.127766','2025-01-25 04:39:27.127768','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (25,'TimePlanningBaseSettings:SundayBreakMinutesPrDivider','30','2025-01-25 04:39:27.132701','2025-01-25 04:39:27.132703','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (26,'TimePlanningBaseSettings:AutoBreakCalculationActive','0','2025-01-25 04:48:39.681394','2025-01-25 05:58:54.720784','created',1,1,4);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (64,'TimePlanningBaseSettings:MondayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.026860','2025-02-06 12:37:21.170403','created',1,1,3);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (65,'TimePlanningBaseSettings:TuesdayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.069031','2025-02-06 09:23:24.069032','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (66,'TimePlanningBaseSettings:WednesdayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.078123','2025-02-06 09:23:24.078124','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (67,'TimePlanningBaseSettings:ThursdayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.082459','2025-02-06 09:23:24.082461','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (68,'TimePlanningBaseSettings:FridayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.087385','2025-02-06 09:23:24.087387','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (69,'TimePlanningBaseSettings:SaturdayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.092741','2025-02-06 09:23:24.092743','created',1,0,1);
INSERT INTO `PluginConfigurationValues` (`Id`,`Name`,`Value`,`CreatedAt`,`UpdatedAt`,`WorkflowState`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) VALUES (70,'TimePlanningBaseSettings:SundayBreakMinutesUpperLimit','60','2025-02-06 09:23:24.097427','2025-02-06 09:23:24.097429','created',1,0,1);

/*!40000 ALTER TABLE `PluginConfigurationValues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PluginGroupPermissionVersions`
--

DROP TABLE IF EXISTS `PluginGroupPermissionVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PluginGroupPermissionVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `GroupId` int(11) NOT NULL,
  `PermissionId` int(11) NOT NULL,
  `IsEnabled` tinyint(1) NOT NULL,
  `PluginGroupPermissionId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PluginGroupPermissionVersions`
--

LOCK TABLES `PluginGroupPermissionVersions` WRITE;
/*!40000 ALTER TABLE `PluginGroupPermissionVersions` DISABLE KEYS */;
INSERT INTO `PluginGroupPermissionVersions` VALUES (1,1,5,1,1,'2022-09-20 14:55:38.927630','2022-09-20 14:55:38.927631','created',0,0,1),(2,1,2,1,2,'2022-09-20 14:55:38.997339','2022-09-20 14:55:38.997340','created',0,0,1),(3,1,3,1,3,'2022-09-20 14:55:39.029188','2022-09-20 14:55:39.029189','created',0,0,1),(4,1,4,1,4,'2022-09-20 14:55:39.053922','2022-09-20 14:55:39.053923','created',0,0,1),(5,1,1,1,5,'2022-09-20 14:55:39.086986','2022-09-20 14:55:39.086987','created',0,0,1),(6,1,6,1,6,'2022-09-20 14:55:39.106107','2022-09-20 14:55:39.106108','created',0,0,1);
/*!40000 ALTER TABLE `PluginGroupPermissionVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PluginGroupPermissions`
--

DROP TABLE IF EXISTS `PluginGroupPermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PluginGroupPermissions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `GroupId` int(11) NOT NULL,
  `PermissionId` int(11) NOT NULL,
  `IsEnabled` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_PluginGroupPermissions_PermissionId` (`PermissionId`),
  CONSTRAINT `FK_PluginGroupPermissions_PluginPermissions_PermissionId` FOREIGN KEY (`PermissionId`) REFERENCES `PluginPermissions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PluginGroupPermissions`
--

LOCK TABLES `PluginGroupPermissions` WRITE;
/*!40000 ALTER TABLE `PluginGroupPermissions` DISABLE KEYS */;
INSERT INTO `PluginGroupPermissions` VALUES (1,1,5,1,'2022-09-20 14:55:38.927630','2022-09-20 14:55:38.927631','created',0,0,1),(2,1,2,1,'2022-09-20 14:55:38.997339','2022-09-20 14:55:38.997340','created',0,0,1),(3,1,3,1,'2022-09-20 14:55:39.029188','2022-09-20 14:55:39.029189','created',0,0,1),(4,1,4,1,'2022-09-20 14:55:39.053922','2022-09-20 14:55:39.053923','created',0,0,1),(5,1,1,1,'2022-09-20 14:55:39.086986','2022-09-20 14:55:39.086987','created',0,0,1),(6,1,6,1,'2022-09-20 14:55:39.106107','2022-09-20 14:55:39.106108','created',0,0,1);
/*!40000 ALTER TABLE `PluginGroupPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PluginPermissions`
--

DROP TABLE IF EXISTS `PluginPermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PluginPermissions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PermissionName` longtext DEFAULT NULL,
  `ClaimName` longtext DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PluginPermissions`
--

LOCK TABLES `PluginPermissions` WRITE;
/*!40000 ALTER TABLE `PluginPermissions` DISABLE KEYS */;
INSERT INTO `PluginPermissions` VALUES (1,'Access ItemsPlanning Plugin','time_planning_plugin_access','2022-09-20 14:55:38.739360',NULL,'created',1,0,1),(2,'Create Notification Rules','time_planning_plannings_create','2022-09-20 14:55:38.767638',NULL,'created',1,0,1),(3,'Edit Planning','time_planning_plannings_edit','2022-09-20 14:55:38.769848',NULL,'created',1,0,1),(4,'Obtain plannings','time_planning_plannings_get','2022-09-20 14:55:38.771636',NULL,'created',1,0,1),(5,'Obtain flex','time_planning_flex_get','2022-09-20 14:55:38.773483',NULL,'created',1,0,1),(6,'Obtain working hours','time_planning_working_hours_get','2022-09-20 14:55:38.775483',NULL,'created',1,0,1);
/*!40000 ALTER TABLE `PluginPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RegistrationDeviceVersions`
--

DROP TABLE IF EXISTS `RegistrationDeviceVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RegistrationDeviceVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Token` longtext DEFAULT NULL,
  `SoftwareVersion` longtext DEFAULT NULL,
  `Model` longtext DEFAULT NULL,
  `Manufacturer` longtext DEFAULT NULL,
  `OsVersion` longtext DEFAULT NULL,
  `LastIp` longtext DEFAULT NULL,
  `LastKnownLocation` longtext DEFAULT NULL,
  `LookedUpIp` longtext DEFAULT NULL,
  `OtpCode` longtext DEFAULT NULL,
  `OtpEnabled` tinyint(1) NOT NULL,
  `RegistrationDeviceId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RegistrationDeviceVersions`
--

LOCK TABLES `RegistrationDeviceVersions` WRITE;
/*!40000 ALTER TABLE `RegistrationDeviceVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `RegistrationDeviceVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RegistrationDevices`
--

DROP TABLE IF EXISTS `RegistrationDevices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RegistrationDevices` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Token` longtext DEFAULT NULL,
  `SoftwareVersion` longtext DEFAULT NULL,
  `Model` longtext DEFAULT NULL,
  `Manufacturer` longtext DEFAULT NULL,
  `OsVersion` longtext DEFAULT NULL,
  `LastIp` longtext DEFAULT NULL,
  `LastKnownLocation` longtext DEFAULT NULL,
  `LookedUpIp` longtext DEFAULT NULL,
  `OtpCode` longtext DEFAULT NULL,
  `OtpEnabled` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedByUserId` int(11) NOT NULL,
  `UpdatedByUserId` int(11) NOT NULL,
  `Version` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RegistrationDevices`
--

LOCK TABLES `RegistrationDevices` WRITE;
/*!40000 ALTER TABLE `RegistrationDevices` DISABLE KEYS */;
/*!40000 ALTER TABLE `RegistrationDevices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__EFMigrationsHistory`
--

LOCK TABLES `__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `__EFMigrationsHistory` VALUES ('20211202224031_InitialCreate','6.0.8'),('20211203051857_AddingWorkerComment','6.0.8'),('20211209152624_AddingTranslationsToMessages','6.0.8'),('20220511073516_AddingSumFlexStartEnd','6.0.8'),('20220705191333_AddingDataFromDeviceToPlanRegistration','6.0.8'),('20240516051057_AddingRegistrationDevice','8.0.5'),('20240516053212_AddingRegistrationDeviceIdToPlanRegistrations','8.0.5');
/*!40000 ALTER TABLE `__EFMigrationsHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22  8:07:17
