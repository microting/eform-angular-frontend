-- MariaDB dump 10.19  Distrib 10.6.16-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: 420_SDK
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
-- Table structure for table `AnswerValueVersions`
--

DROP TABLE IF EXISTS `AnswerValueVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AnswerValueVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `AnswerId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `AnswerValueId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_answer_value_versions_answerValueId` (`AnswerValueId`),
  CONSTRAINT `FK_answer_value_versions_answer_values_AnswerValueId` FOREIGN KEY (`AnswerValueId`) REFERENCES `AnswerValues` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AnswerValueVersions`
--

LOCK TABLES `AnswerValueVersions` WRITE;
/*!40000 ALTER TABLE `AnswerValueVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `AnswerValueVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AnswerValues`
--

DROP TABLE IF EXISTS `AnswerValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AnswerValues` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `AnswerId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_answer_values_answerId` (`AnswerId`),
  KEY `IX_answer_values_optionsId` (`OptionId`),
  KEY `IX_answer_values_questionId` (`QuestionId`),
  CONSTRAINT `FK_answer_values_answers_AnswerId` FOREIGN KEY (`AnswerId`) REFERENCES `Answers` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answer_values_options_OptionId` FOREIGN KEY (`OptionId`) REFERENCES `Options` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answer_values_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AnswerValues`
--

LOCK TABLES `AnswerValues` WRITE;
/*!40000 ALTER TABLE `AnswerValues` DISABLE KEYS */;
/*!40000 ALTER TABLE `AnswerValues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AnswerVersions`
--

DROP TABLE IF EXISTS `AnswerVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AnswerVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `AnswerDuration` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) DEFAULT NULL,
  `FinishedAt` datetime(6) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `UtcAdjusted` tinyint(1) NOT NULL,
  `TimeZone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `AnswerId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AnswerVersions`
--

LOCK TABLES `AnswerVersions` WRITE;
/*!40000 ALTER TABLE `AnswerVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `AnswerVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Answers`
--

DROP TABLE IF EXISTS `Answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Answers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `AnswerDuration` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) DEFAULT NULL,
  `FinishedAt` datetime(6) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `UtcAdjusted` tinyint(1) NOT NULL,
  `TimeZone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_answers_languageId` (`LanguageId`),
  KEY `IX_answers_questionSetId` (`QuestionSetId`),
  KEY `IX_answers_siteId` (`SiteId`),
  KEY `IX_answers_surveyConfigurationId` (`SurveyConfigurationId`),
  KEY `IX_answers_unitId` (`UnitId`),
  CONSTRAINT `FK_answers_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `Languages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answers_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `QuestionSets` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answers_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_answers_survey_configurations_SurveyConfigurationId` FOREIGN KEY (`SurveyConfigurationId`) REFERENCES `SurveyConfigurations` (`Id`),
  CONSTRAINT `FK_answers_units_UnitId` FOREIGN KEY (`UnitId`) REFERENCES `Units` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Answers`
--

LOCK TABLES `Answers` WRITE;
/*!40000 ALTER TABLE `Answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CaseVersions`
--

DROP TABLE IF EXISTS `CaseVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CaseVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CaseId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `DoneAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `MicrotingCheckUid` int(11) DEFAULT NULL,
  `CaseUid` varchar(255) DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue6` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue7` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue8` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue9` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue10` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FolderId` int(11) DEFAULT NULL,
  `IsArchived` tinyint(1) NOT NULL DEFAULT 0,
  `DoneAtUserModifiable` datetime(6) DEFAULT NULL,
  `ReceivedByServerAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=46052 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Cases`
--

DROP TABLE IF EXISTS `Cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cases` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `DoneAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `MicrotingCheckUid` int(11) DEFAULT NULL,
  `CaseUid` varchar(255) DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue6` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue7` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue8` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue9` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldValue10` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FolderId` int(11) DEFAULT NULL,
  `IsArchived` tinyint(1) NOT NULL DEFAULT 0,
  `DoneAtUserModifiable` datetime(6) DEFAULT NULL,
  `ReceivedByServerAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_cases_check_list_id` (`CheckListId`),
  KEY `IX_cases_done_by_user_id` (`WorkerId`),
  KEY `IX_cases_site_id` (`SiteId`),
  KEY `IX_cases_unit_id` (`UnitId`),
  KEY `IX_cases_CheckListId` (`CheckListId`),
  KEY `IX_cases_MicrotingUid_MicrotingCheckUid` (`MicrotingUid`,`MicrotingCheckUid`),
  KEY `IX_cases_FolderId` (`FolderId`),
  CONSTRAINT `FK_cases_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `CheckLists` (`Id`),
  CONSTRAINT `FK_cases_folders_FolderId` FOREIGN KEY (`FolderId`) REFERENCES `Folders` (`Id`),
  CONSTRAINT `FK_cases_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`),
  CONSTRAINT `FK_cases_units_UnitId` FOREIGN KEY (`UnitId`) REFERENCES `Units` (`Id`),
  CONSTRAINT `FK_cases_workers_WorkerId` FOREIGN KEY (`WorkerId`) REFERENCES `Workers` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19571 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListSiteVersions`
--

DROP TABLE IF EXISTS `CheckListSiteVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListSiteVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CheckListSiteId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LastCheckId` int(11) NOT NULL,
  `FolderId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3098 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListSites`
--

DROP TABLE IF EXISTS `CheckListSites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListSites` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LastCheckId` int(11) NOT NULL,
  `FolderId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_check_list_sites_check_list_id` (`CheckListId`),
  KEY `IX_check_list_sites_site_id` (`SiteId`),
  KEY `IX_check_list_sites_FolderId` (`FolderId`),
  CONSTRAINT `FK_check_list_sites_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `CheckLists` (`Id`),
  CONSTRAINT `FK_check_list_sites_folders_FolderId` FOREIGN KEY (`FolderId`) REFERENCES `Folders` (`Id`),
  CONSTRAINT `FK_check_list_sites_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListTranslationVersions`
--

DROP TABLE IF EXISTS `CheckListTranslationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListTranslationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `CheckListId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CheckListTranslationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=766 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListTranslations`
--

DROP TABLE IF EXISTS `CheckListTranslations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListTranslations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `CheckListId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_CheckLisTranslations_CheckListId` (`CheckListId`),
  CONSTRAINT `FK_CheckLisTranslations_CheckLists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `CheckLists` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=483 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListValueVersions`
--

DROP TABLE IF EXISTS `CheckListValueVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListValueVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CheckListValueId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `CaseId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `CheckListDuplicateId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3086 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListValues`
--

DROP TABLE IF EXISTS `CheckListValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListValues` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `CaseId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `CheckListDuplicateId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3086 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckListVersions`
--

DROP TABLE IF EXISTS `CheckListVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckListVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CheckListId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ParentId` int(11) DEFAULT NULL,
  `Repeated` int(11) DEFAULT NULL,
  `DisplayIndex` int(11) DEFAULT NULL,
  `CaseType` varchar(255) DEFAULT NULL,
  `FolderName` varchar(255) DEFAULT NULL,
  `ReviewEnabled` smallint(6) DEFAULT NULL,
  `ManualSync` smallint(6) DEFAULT NULL,
  `ExtraFieldsEnabled` smallint(6) DEFAULT NULL,
  `DoneButtonEnabled` smallint(6) DEFAULT NULL,
  `ApprovalEnabled` smallint(6) DEFAULT NULL,
  `MultiApproval` smallint(6) DEFAULT NULL,
  `FastNavigation` smallint(6) DEFAULT NULL,
  `DownloadEntities` smallint(6) DEFAULT NULL,
  `Field1` int(11) DEFAULT NULL,
  `Field2` int(11) DEFAULT NULL,
  `Field3` int(11) DEFAULT NULL,
  `Field4` int(11) DEFAULT NULL,
  `Field5` int(11) DEFAULT NULL,
  `Field6` int(11) DEFAULT NULL,
  `Field7` int(11) DEFAULT NULL,
  `Field8` int(11) DEFAULT NULL,
  `Field9` int(11) DEFAULT NULL,
  `Field10` int(11) DEFAULT NULL,
  `QuickSyncEnabled` smallint(6) DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DocxExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `JasperExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ExcelExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ReportH1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IsEditable` tinyint(1) NOT NULL DEFAULT 1,
  `IsHidden` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `IsAchievable` tinyint(1) NOT NULL DEFAULT 0,
  `IsDoneAtEditable` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=639 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CheckLists`
--

DROP TABLE IF EXISTS `CheckLists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CheckLists` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ParentId` int(11) DEFAULT NULL,
  `Repeated` int(11) DEFAULT NULL,
  `DisplayIndex` int(11) DEFAULT NULL,
  `CaseType` varchar(255) DEFAULT NULL,
  `FolderName` varchar(255) DEFAULT NULL,
  `ReviewEnabled` smallint(6) DEFAULT NULL,
  `ManualSync` smallint(6) DEFAULT NULL,
  `ExtraFieldsEnabled` smallint(6) DEFAULT NULL,
  `DoneButtonEnabled` smallint(6) DEFAULT NULL,
  `ApprovalEnabled` smallint(6) DEFAULT NULL,
  `MultiApproval` smallint(6) DEFAULT NULL,
  `FastNavigation` smallint(6) DEFAULT NULL,
  `DownloadEntities` smallint(6) DEFAULT NULL,
  `Field1` int(11) DEFAULT NULL,
  `Field2` int(11) DEFAULT NULL,
  `Field3` int(11) DEFAULT NULL,
  `Field4` int(11) DEFAULT NULL,
  `Field5` int(11) DEFAULT NULL,
  `Field6` int(11) DEFAULT NULL,
  `Field7` int(11) DEFAULT NULL,
  `Field8` int(11) DEFAULT NULL,
  `Field9` int(11) DEFAULT NULL,
  `Field10` int(11) DEFAULT NULL,
  `QuickSyncEnabled` smallint(6) DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DocxExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `JasperExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ExcelExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ReportH1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReportH5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IsEditable` tinyint(1) NOT NULL DEFAULT 1,
  `IsHidden` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `IsAchievable` tinyint(1) NOT NULL DEFAULT 0,
  `IsDoneAtEditable` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=318 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EntityGroupVersions`
--

DROP TABLE IF EXISTS `EntityGroupVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntityGroupVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `EntityGroupId` int(11) NOT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Editable` tinyint(1) NOT NULL DEFAULT 0,
  `Locked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EntityGroups`
--

DROP TABLE IF EXISTS `EntityGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntityGroups` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Editable` tinyint(1) NOT NULL DEFAULT 0,
  `Locked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EntityItemVersions`
--

DROP TABLE IF EXISTS `EntityItemVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntityItemVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `EntityItemId` int(11) NOT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `EntityGroupId` int(11) DEFAULT NULL,
  `EntityItemUid` varchar(50) DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Synced` smallint(6) DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EntityItems`
--

DROP TABLE IF EXISTS `EntityItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntityItems` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `EntityGroupId` int(11) DEFAULT NULL,
  `EntityItemUid` varchar(50) DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Synced` smallint(6) DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ExtraFieldValueVersions`
--

DROP TABLE IF EXISTS `ExtraFieldValueVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExtraFieldValueVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `ExtraFieldValueId` int(11) NOT NULL,
  `DoneAt` datetime(6) DEFAULT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `CaseId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `CheckListDuplicateId` int(11) DEFAULT NULL,
  `CheckListValueId` int(11) DEFAULT NULL,
  `UploadedDataId` int(11) DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Latitude` varchar(255) DEFAULT NULL,
  `Longitude` varchar(255) DEFAULT NULL,
  `Altitude` varchar(255) DEFAULT NULL,
  `Heading` varchar(255) DEFAULT NULL,
  `Accuracy` varchar(255) DEFAULT NULL,
  `FieldType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldTypeId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExtraFieldValueVersions`
--

LOCK TABLES `ExtraFieldValueVersions` WRITE;
/*!40000 ALTER TABLE `ExtraFieldValueVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExtraFieldValueVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExtraFieldValues`
--

DROP TABLE IF EXISTS `ExtraFieldValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExtraFieldValues` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `DoneAt` datetime(6) DEFAULT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `CaseId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `CheckListDuplicateId` int(11) DEFAULT NULL,
  `CheckListValueId` int(11) DEFAULT NULL,
  `UploadedDataId` int(11) DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Latitude` varchar(255) DEFAULT NULL,
  `Longitude` varchar(255) DEFAULT NULL,
  `Altitude` varchar(255) DEFAULT NULL,
  `Heading` varchar(255) DEFAULT NULL,
  `Accuracy` varchar(255) DEFAULT NULL,
  `FieldType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldTypeId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExtraFieldValues`
--

LOCK TABLES `ExtraFieldValues` WRITE;
/*!40000 ALTER TABLE `ExtraFieldValues` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExtraFieldValues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FieldOptionTranslationVersions`
--

DROP TABLE IF EXISTS `FieldOptionTranslationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldOptionTranslationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FieldOptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldOptionTranslationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2885 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldOptionTranslations`
--

DROP TABLE IF EXISTS `FieldOptionTranslations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldOptionTranslations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FieldOptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_FieldOptionTranslations_FieldOptionId` (`FieldOptionId`),
  CONSTRAINT `FK_FieldOptionTranslations_FieldOptions_FieldOptionId` FOREIGN KEY (`FieldOptionId`) REFERENCES `FieldOptions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2884 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldOptionVersions`
--

DROP TABLE IF EXISTS `FieldOptionVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldOptionVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `Key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Selected` tinyint(1) NOT NULL,
  `DisplayOrder` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldOptionId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1534 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldOptions`
--

DROP TABLE IF EXISTS `FieldOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldOptions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `Key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Selected` tinyint(1) NOT NULL,
  `DisplayOrder` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_FieldOptions_FieldId` (`FieldId`),
  CONSTRAINT `FK_FieldOptions_Fields_FieldId` FOREIGN KEY (`FieldId`) REFERENCES `Fields` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1534 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldTranslationVersions`
--

DROP TABLE IF EXISTS `FieldTranslationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldTranslationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FieldTranslationId` int(11) NOT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `UploadedDataId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1698 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldTranslations`
--

DROP TABLE IF EXISTS `FieldTranslations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldTranslations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `UploadedDataId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `IX_FieldTranslations_FieldId` (`FieldId`),
  CONSTRAINT `FK_FieldTranslations_Fields_FieldId` FOREIGN KEY (`FieldId`) REFERENCES `Fields` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1698 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldTypes`
--

DROP TABLE IF EXISTS `FieldTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldTypes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FieldTypes`
--

LOCK TABLES `FieldTypes` WRITE;
/*!40000 ALTER TABLE `FieldTypes` DISABLE KEYS */;
INSERT INTO `FieldTypes` VALUES (1,'Text','Simple text field'),(2,'Number','Simple number field'),(3,'None','Simple text to be displayed'),(4,'CheckBox','Simple check box field'),(5,'Picture','Simple picture field'),(6,'Audio','Simple audio field'),(7,'Movie','Simple movie field'),(8,'SingleSelect','Single selection list'),(9,'Comment','Simple comment field'),(10,'MultiSelect','Simple multi select list'),(11,'Date','Date selection'),(12,'Signature','Simple signature field'),(13,'Timer','Simple timer field'),(14,'EntitySearch','Autofilled searchable items field'),(15,'EntitySelect','Autofilled single selection list'),(16,'ShowPdf','Show PDF'),(17,'FieldGroup','Field group'),(18,'SaveButton','Save eForm'),(19,'NumberStepper','Number stepper field');
/*!40000 ALTER TABLE `FieldTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FieldValueVersions`
--

DROP TABLE IF EXISTS `FieldValueVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldValueVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FieldValueId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `DoneAt` datetime(6) DEFAULT NULL,
  `Date` datetime(6) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `CaseId` int(11) DEFAULT NULL,
  `FieldId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `CheckListDuplicateId` int(11) DEFAULT NULL,
  `UploadedDataId` int(11) DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Latitude` varchar(255) DEFAULT NULL,
  `Longitude` varchar(255) DEFAULT NULL,
  `Altitude` varchar(255) DEFAULT NULL,
  `Heading` varchar(255) DEFAULT NULL,
  `Accuracy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=44282 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FieldVersions`
--

DROP TABLE IF EXISTS `FieldVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FieldVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FieldId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `ParentFieldId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `FieldTypeId` int(11) DEFAULT NULL,
  `Mandatory` smallint(6) DEFAULT NULL,
  `ReadOnly` smallint(6) DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Color` varchar(255) DEFAULT NULL,
  `DisplayIndex` int(11) DEFAULT NULL,
  `Dummy` smallint(6) DEFAULT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `UnitName` varchar(255) DEFAULT NULL,
  `MinValue` varchar(255) DEFAULT NULL,
  `MaxValue` varchar(255) DEFAULT NULL,
  `MaxLength` int(11) DEFAULT NULL,
  `DecimalCount` int(11) DEFAULT NULL,
  `Multi` int(11) DEFAULT NULL,
  `Optional` smallint(6) DEFAULT NULL,
  `Selected` smallint(6) DEFAULT NULL,
  `Split` smallint(6) DEFAULT NULL,
  `GeolocationEnabled` smallint(6) DEFAULT NULL,
  `GeolocationForced` smallint(6) DEFAULT NULL,
  `GeolocationHidden` smallint(6) DEFAULT NULL,
  `StopOnSave` smallint(6) DEFAULT NULL,
  `IsNum` smallint(6) DEFAULT NULL,
  `BarcodeEnabled` smallint(6) DEFAULT NULL,
  `BarcodeType` varchar(255) DEFAULT NULL,
  `QueryType` varchar(255) DEFAULT NULL,
  `KeyValuePairList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EntityGroupId` int(11) DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=993 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Fields`
--

DROP TABLE IF EXISTS `Fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Fields` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `ParentFieldId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `FieldTypeId` int(11) DEFAULT NULL,
  `Mandatory` smallint(6) DEFAULT NULL,
  `ReadOnly` smallint(6) DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Color` varchar(255) DEFAULT NULL,
  `DisplayIndex` int(11) DEFAULT NULL,
  `Dummy` smallint(6) DEFAULT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `UnitName` varchar(255) DEFAULT NULL,
  `MinValue` varchar(255) DEFAULT NULL,
  `MaxValue` varchar(255) DEFAULT NULL,
  `MaxLength` int(11) DEFAULT NULL,
  `DecimalCount` int(11) DEFAULT NULL,
  `Multi` int(11) DEFAULT NULL,
  `Optional` smallint(6) DEFAULT NULL,
  `Selected` smallint(6) DEFAULT NULL,
  `Split` smallint(6) DEFAULT NULL,
  `GeolocationEnabled` smallint(6) DEFAULT NULL,
  `GeolocationForced` smallint(6) DEFAULT NULL,
  `GeolocationHidden` smallint(6) DEFAULT NULL,
  `StopOnSave` smallint(6) DEFAULT NULL,
  `IsNum` smallint(6) DEFAULT NULL,
  `BarcodeEnabled` smallint(6) DEFAULT NULL,
  `BarcodeType` varchar(255) DEFAULT NULL,
  `QueryType` varchar(255) DEFAULT NULL,
  `KeyValuePairList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EntityGroupId` int(11) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_fields_check_list_id` (`CheckListId`),
  KEY `IX_fields_field_type_id` (`FieldTypeId`),
  KEY `IX_fields_parentid` (`parentid`),
  KEY `FK_fields_fields_ParentFieldId` (`ParentFieldId`),
  CONSTRAINT `FK_fields_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `CheckLists` (`Id`),
  CONSTRAINT `FK_fields_field_types_FieldTypeId` FOREIGN KEY (`FieldTypeId`) REFERENCES `FieldTypes` (`Id`),
  CONSTRAINT `FK_fields_fields_ParentFieldId` FOREIGN KEY (`ParentFieldId`) REFERENCES `Fields` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=993 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FolderTranslationVersions`
--

DROP TABLE IF EXISTS `FolderTranslationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FolderTranslationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `FolderId` int(11) NOT NULL,
  `FolderTranslationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FolderTranslations`
--

DROP TABLE IF EXISTS `FolderTranslations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FolderTranslations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `FolderId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_FolderTranslations_FolderId` (`FolderId`),
  KEY `IX_FolderTranslations_LanguageId` (`LanguageId`),
  CONSTRAINT `FK_FolderTranslations_Folders_FolderId` FOREIGN KEY (`FolderId`) REFERENCES `Folders` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_FolderTranslations_Languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `Languages` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FolderTranslations`
--

LOCK TABLES `FolderTranslations` WRITE;
/*!40000 ALTER TABLE `FolderTranslations` DISABLE KEYS */;
INSERT INTO `FolderTranslations` VALUES (1,1,'created','2022-09-21 08:37:03.226528','2022-09-21 08:37:03.226528','Tidsregistrering','',0,1,1),(2,1,'created','2022-09-21 08:37:03.545866','2022-09-21 08:37:03.545866','','',0,2,1),(3,1,'created','2022-09-21 08:37:04.450792','2022-09-21 08:37:04.450792','','',0,3,1);
/*!40000 ALTER TABLE `FolderTranslations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FolderVersions`
--

DROP TABLE IF EXISTS `FolderVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FolderVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `FolderId` int(11) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `ParentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Folders`
--

DROP TABLE IF EXISTS `Folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Folders` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `ParentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_folders_parentid` (`ParentId`),
  CONSTRAINT `FK_folders_folders_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `Folders` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LanguageQuestionSetVersions`
--

DROP TABLE IF EXISTS `LanguageQuestionSetVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LanguageQuestionSetVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `LanguageId` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `LanguageQuestionSetId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_LanguageQuestionSetVersions_LanguageQuestionSetId` (`LanguageQuestionSetId`),
  CONSTRAINT `FK_LanguageQuestionSetVersions_LanguageQuestionSets_LanguageQue~` FOREIGN KEY (`LanguageQuestionSetId`) REFERENCES `LanguageQuestionSets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LanguageQuestionSetVersions`
--

LOCK TABLES `LanguageQuestionSetVersions` WRITE;
/*!40000 ALTER TABLE `LanguageQuestionSetVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `LanguageQuestionSetVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LanguageQuestionSets`
--

DROP TABLE IF EXISTS `LanguageQuestionSets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LanguageQuestionSets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `LanguageId` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_LanguageQuestionSets_LanguageId` (`LanguageId`),
  KEY `IX_LanguageQuestionSets_QuestionSetId` (`QuestionSetId`),
  CONSTRAINT `FK_LanguageQuestionSets_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `Languages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_LanguageQuestionSets_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `QuestionSets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LanguageQuestionSets`
--

LOCK TABLES `LanguageQuestionSets` WRITE;
/*!40000 ALTER TABLE `LanguageQuestionSets` DISABLE KEYS */;
/*!40000 ALTER TABLE `LanguageQuestionSets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LanguageVersions`
--

DROP TABLE IF EXISTS `LanguageVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LanguageVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LanguageCode` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LanguageId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`),
  KEY `IX_language_versions_languageId` (`LanguageId`),
  CONSTRAINT `FK_language_versions_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `Languages` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LanguageVersions`
--

LOCK TABLES `LanguageVersions` WRITE;
/*!40000 ALTER TABLE `LanguageVersions` DISABLE KEYS */;
INSERT INTO `LanguageVersions` VALUES (1,1,'created','2022-09-20 14:17:16.599036','2022-09-20 14:17:16.599116','Danish','da',1,1),(2,1,'created','2022-09-20 14:17:16.776618','2022-09-20 14:17:16.776619','English','en-US',2,1),(3,1,'created','2022-09-20 14:17:16.834511','2022-09-20 14:17:16.834511','German','de-DE',3,1),(4,1,'created','2022-12-11 08:08:17.454851','2022-12-11 08:08:17.454942','Ukrainian','uk-UA',4,0),(5,1,'created','2022-12-11 08:08:17.664474','2022-12-11 08:08:17.664543','Polish','pl-PL',5,0),(6,1,'created','2022-12-11 08:08:17.746433','2022-12-11 08:08:17.746436','Norwegian','no-NO',6,0),(7,1,'created','2022-12-11 08:08:17.807179','2022-12-11 08:08:17.807181','Swedish','sv-SE',7,0),(8,1,'created','2022-12-11 08:08:17.870763','2022-12-11 08:08:17.870765','Spanish','es-ES',8,0),(9,1,'created','2022-12-11 08:08:17.942499','2022-12-11 08:08:17.942500','French','fr-FR',9,0),(10,1,'created','2022-12-11 08:08:17.985927','2022-12-11 08:08:17.985930','Italian','it-IT',10,0),(11,1,'created','2022-12-11 08:08:18.061092','2022-12-11 08:08:18.061094','Dutch','nl-NL',11,0),(12,1,'created','2022-12-11 08:08:18.108419','2022-12-11 08:08:18.108421','Brazilian Portuguese','pt-BR',12,0),(13,1,'created','2022-12-11 08:08:18.144111','2022-12-11 08:08:18.144113','Portuguese','pt-PT',13,0),(14,1,'created','2022-12-11 08:08:18.179947','2022-12-11 08:08:18.179948','Finish','fi-FI',14,0),(15,2,'created','2022-09-20 14:17:16.599036','2024-07-01 15:54:01.107786','Dansk','da',1,1),(16,2,'created','2022-09-20 14:17:16.834511','2024-07-01 15:54:01.335456','Deutsch','de-DE',3,1),(17,2,'created','2022-12-11 08:08:17.454851','2024-07-01 15:54:01.656373','українська','uk-UA',4,0),(18,2,'created','2022-12-11 08:08:17.664474','2024-07-01 15:54:01.997320','Polski','pl-PL',5,0),(19,2,'created','2022-12-11 08:08:17.746433','2024-07-01 15:54:02.332950','Norsk','no-NO',6,0),(20,2,'created','2022-12-11 08:08:17.807179','2024-07-01 15:54:02.674784','Svenska','sv-SE',7,0),(21,2,'created','2022-12-11 08:08:17.870763','2024-07-01 15:54:02.991802','Español','es-ES',8,0),(22,2,'created','2022-12-11 08:08:17.942499','2024-07-01 15:54:03.210039','Français','fr-FR',9,0),(23,2,'created','2022-12-11 08:08:17.985927','2024-07-01 15:54:03.473931','Italiana','it-IT',10,0),(24,2,'created','2022-12-11 08:08:18.061092','2024-07-01 15:54:03.675335','Neerlandais','nl-NL',11,0),(25,2,'created','2022-12-11 08:08:18.108419','2024-07-01 15:54:03.960204','Portugues do Brasil','pt-BR',12,0),(26,2,'created','2022-12-11 08:08:18.144111','2024-07-01 15:54:04.200455','Português','pt-PT',13,0),(27,2,'created','2022-12-11 08:08:18.179947','2024-07-01 15:54:04.467841','Suomalainen','fi-FI',14,0),(28,1,'created','2024-07-01 15:54:04.682332','2024-07-01 15:54:04.682334','Türkçe','tr-TR',15,0),(29,1,'created','2024-07-01 15:54:04.872778','2024-07-01 15:54:04.872781','Eesti','et-ET',16,0),(30,1,'created','2024-07-01 15:54:05.096934','2024-07-01 15:54:05.096937','Latviski','lv-LV',17,0),(31,1,'created','2024-07-01 15:54:05.486128','2024-07-01 15:54:05.486130','Lietuvių','lt-LT',18,0),(32,1,'created','2024-07-01 15:54:05.772344','2024-07-01 15:54:05.772346','Română','ro-RO',19,0),(33,1,'created','2024-07-01 15:54:06.041205','2024-07-01 15:54:06.041208','български','bg-BG',20,0),(34,1,'created','2024-07-01 15:54:06.348847','2024-07-01 15:54:06.348850','Slovenský','sk-SK',21,0),(35,1,'created','2024-07-01 15:54:06.511728','2024-07-01 15:54:06.511730','Slovenščina','sl-SL',22,0),(36,1,'created','2024-07-01 15:54:06.734319','2024-07-01 15:54:06.734321','Íslenska','is-IS',23,0),(37,1,'created','2024-07-01 15:54:06.983420','2024-07-01 15:54:06.983423','Čeština','cs-CZ',24,0),(38,1,'created','2024-07-01 15:54:07.267651','2024-07-01 15:54:07.267653','Hrvatski','hr-HR',25,0),(39,1,'created','2024-07-01 15:54:07.556949','2024-07-01 15:54:07.556951','Ελληνικά','el-GR',26,0),(40,1,'created','2024-07-01 15:54:07.822709','2024-07-01 15:54:07.822711','Magyar','hu-HU',27,0);
/*!40000 ALTER TABLE `LanguageVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Languages`
--

DROP TABLE IF EXISTS `Languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Languages` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LanguageCode` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Languages`
--

LOCK TABLES `Languages` WRITE;
/*!40000 ALTER TABLE `Languages` DISABLE KEYS */;
INSERT INTO `Languages` VALUES (1,2,'created','2022-09-20 14:17:16.599036','2024-07-01 15:54:01.107786','Dansk','da',1),(2,1,'created','2022-09-20 14:17:16.776618','2022-09-20 14:17:16.776619','English','en-US',1),(3,2,'created','2022-09-20 14:17:16.834511','2024-07-01 15:54:01.335456','Deutsch','de-DE',1),(4,2,'created','2022-12-11 08:08:17.454851','2024-07-01 15:54:01.656373','українська','uk-UA',0),(5,2,'created','2022-12-11 08:08:17.664474','2024-07-01 15:54:01.997320','Polski','pl-PL',0),(6,2,'created','2022-12-11 08:08:17.746433','2024-07-01 15:54:02.332950','Norsk','no-NO',0),(7,2,'created','2022-12-11 08:08:17.807179','2024-07-01 15:54:02.674784','Svenska','sv-SE',0),(8,2,'created','2022-12-11 08:08:17.870763','2024-07-01 15:54:02.991802','Español','es-ES',0),(9,2,'created','2022-12-11 08:08:17.942499','2024-07-01 15:54:03.210039','Français','fr-FR',0),(10,2,'created','2022-12-11 08:08:17.985927','2024-07-01 15:54:03.473931','Italiana','it-IT',0),(11,2,'created','2022-12-11 08:08:18.061092','2024-07-01 15:54:03.675335','Neerlandais','nl-NL',0),(12,2,'created','2022-12-11 08:08:18.108419','2024-07-01 15:54:03.960204','Portugues do Brasil','pt-BR',0),(13,2,'created','2022-12-11 08:08:18.144111','2024-07-01 15:54:04.200455','Português','pt-PT',0),(14,2,'created','2022-12-11 08:08:18.179947','2024-07-01 15:54:04.467841','Suomalainen','fi-FI',0),(15,1,'created','2024-07-01 15:54:04.682332','2024-07-01 15:54:04.682334','Türkçe','tr-TR',0),(16,1,'created','2024-07-01 15:54:04.872778','2024-07-01 15:54:04.872781','Eesti','et-ET',0),(17,1,'created','2024-07-01 15:54:05.096934','2024-07-01 15:54:05.096937','Latviski','lv-LV',0),(18,1,'created','2024-07-01 15:54:05.486128','2024-07-01 15:54:05.486130','Lietuvių','lt-LT',0),(19,1,'created','2024-07-01 15:54:05.772344','2024-07-01 15:54:05.772346','Română','ro-RO',0),(20,1,'created','2024-07-01 15:54:06.041205','2024-07-01 15:54:06.041208','български','bg-BG',0),(21,1,'created','2024-07-01 15:54:06.348847','2024-07-01 15:54:06.348850','Slovenský','sk-SK',0),(22,1,'created','2024-07-01 15:54:06.511728','2024-07-01 15:54:06.511730','Slovenščina','sl-SL',0),(23,1,'created','2024-07-01 15:54:06.734319','2024-07-01 15:54:06.734321','Íslenska','is-IS',0),(24,1,'created','2024-07-01 15:54:06.983420','2024-07-01 15:54:06.983423','Čeština','cs-CZ',0),(25,1,'created','2024-07-01 15:54:07.267651','2024-07-01 15:54:07.267653','Hrvatski','hr-HR',0),(26,1,'created','2024-07-01 15:54:07.556949','2024-07-01 15:54:07.556951','Ελληνικά','el-GR',0),(27,1,'created','2024-07-01 15:54:07.822709','2024-07-01 15:54:07.822711','Magyar','hu-HU',0);
/*!40000 ALTER TABLE `Languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NotificationVersions`
--

DROP TABLE IF EXISTS `NotificationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `NotificationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `Transmission` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `NotificationUid` varchar(255) DEFAULT NULL,
  `Activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Stacktrace` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Version` int(11) NOT NULL,
  `NotificationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=36647 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notifications` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `Transmission` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `NotificationUid` varchar(255) DEFAULT NULL,
  `Activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Stacktrace` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Version` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=25790 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OptionTranslationVersions`
--

DROP TABLE IF EXISTS `OptionTranslationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OptionTranslationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `OptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OptionTranslationId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OptionTranslationVersions`
--

LOCK TABLES `OptionTranslationVersions` WRITE;
/*!40000 ALTER TABLE `OptionTranslationVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `OptionTranslationVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OptionTranslations`
--

DROP TABLE IF EXISTS `OptionTranslations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OptionTranslations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `OptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_OptionTranslations_LanguageId` (`LanguageId`),
  KEY `IX_OptionTranslations_OptionId` (`OptionId`),
  CONSTRAINT `FK_OptionTranslations_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `Languages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_OptionTranslations_options_OptionId` FOREIGN KEY (`OptionId`) REFERENCES `Options` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OptionTranslations`
--

LOCK TABLES `OptionTranslations` WRITE;
/*!40000 ALTER TABLE `OptionTranslations` DISABLE KEYS */;
/*!40000 ALTER TABLE `OptionTranslations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OptionVersions`
--

DROP TABLE IF EXISTS `OptionVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OptionVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `NextQuestionId` int(11) DEFAULT NULL,
  `Weight` int(11) NOT NULL,
  `WeightValue` int(11) NOT NULL,
  `ContinuousOptionId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionIndex` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `IX_option_versions_optionId` (`OptionId`),
  CONSTRAINT `FK_option_versions_options_OptionId` FOREIGN KEY (`OptionId`) REFERENCES `Options` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OptionVersions`
--

LOCK TABLES `OptionVersions` WRITE;
/*!40000 ALTER TABLE `OptionVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `OptionVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Options`
--

DROP TABLE IF EXISTS `Options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Options` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `NextQuestionId` int(11) DEFAULT NULL,
  `Weight` int(11) NOT NULL,
  `WeightValue` int(11) NOT NULL,
  `ContinuousOptionId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionIndex` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `IX_options_questionId` (`QuestionId`),
  CONSTRAINT `FK_options_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Options`
--

LOCK TABLES `Options` WRITE;
/*!40000 ALTER TABLE `Options` DISABLE KEYS */;
/*!40000 ALTER TABLE `Options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionSetVersions`
--

DROP TABLE IF EXISTS `QuestionSetVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QuestionSetVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HasChild` tinyint(1) NOT NULL,
  `PossiblyDeployed` tinyint(1) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `Share` tinyint(1) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_question_set_versions_questionSetId` (`QuestionSetId`),
  CONSTRAINT `FK_question_set_versions_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `QuestionSets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionSetVersions`
--

LOCK TABLES `QuestionSetVersions` WRITE;
/*!40000 ALTER TABLE `QuestionSetVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuestionSetVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionSets`
--

DROP TABLE IF EXISTS `QuestionSets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QuestionSets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HasChild` tinyint(1) NOT NULL,
  `PossiblyDeployed` tinyint(1) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `Share` tinyint(1) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionSets`
--

LOCK TABLES `QuestionSets` WRITE;
/*!40000 ALTER TABLE `QuestionSets` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuestionSets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionTranslationVersions`
--

DROP TABLE IF EXISTS `QuestionTranslationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QuestionTranslationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `QuestionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `QuestionTranslationId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_QuestionTranslationVersions_QuestionTranslationId` (`QuestionTranslationId`),
  CONSTRAINT `FK_QuestionTranslationVersions_QuestionTranslations_QuestionTra~` FOREIGN KEY (`QuestionTranslationId`) REFERENCES `QuestionTranslations` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionTranslationVersions`
--

LOCK TABLES `QuestionTranslationVersions` WRITE;
/*!40000 ALTER TABLE `QuestionTranslationVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuestionTranslationVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionTranslations`
--

DROP TABLE IF EXISTS `QuestionTranslations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QuestionTranslations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `QuestionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_QuestionTranslations_LanguageId` (`LanguageId`),
  KEY `IX_QuestionTranslations_QuestionId` (`QuestionId`),
  CONSTRAINT `FK_QuestionTranslations_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `Languages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_QuestionTranslations_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionTranslations`
--

LOCK TABLES `QuestionTranslations` WRITE;
/*!40000 ALTER TABLE `QuestionTranslations` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuestionTranslations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionVersions`
--

DROP TABLE IF EXISTS `QuestionVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QuestionVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `QuestionType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Minimum` int(11) NOT NULL,
  `Maximum` int(11) NOT NULL,
  `Type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RefId` int(11) NOT NULL,
  `QuestionIndex` int(11) NOT NULL,
  `Image` tinyint(1) NOT NULL,
  `ContinuousQuestionId` int(11) NOT NULL,
  `ImagePosition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Prioritised` tinyint(1) NOT NULL,
  `BackButtonEnabled` tinyint(1) NOT NULL,
  `FontSize` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MinDuration` int(11) NOT NULL,
  `MaxDuration` int(11) NOT NULL,
  `ValidDisplay` tinyint(1) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_question_versions_questionId` (`QuestionId`),
  CONSTRAINT `FK_question_versions_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `Questions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionVersions`
--

LOCK TABLES `QuestionVersions` WRITE;
/*!40000 ALTER TABLE `QuestionVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuestionVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Questions`
--

DROP TABLE IF EXISTS `Questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Questions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `QuestionType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Minimum` int(11) NOT NULL,
  `Maximum` int(11) NOT NULL,
  `Type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RefId` int(11) NOT NULL,
  `QuestionIndex` int(11) NOT NULL,
  `Image` tinyint(1) NOT NULL,
  `ContinuousQuestionId` int(11) NOT NULL,
  `ImagePosition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Prioritised` tinyint(1) NOT NULL,
  `BackButtonEnabled` tinyint(1) NOT NULL,
  `FontSize` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MinDuration` int(11) NOT NULL,
  `MaxDuration` int(11) NOT NULL,
  `ValidDisplay` tinyint(1) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_questions_questionSetId` (`QuestionSetId`),
  CONSTRAINT `FK_questions_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `QuestionSets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Questions`
--

LOCK TABLES `Questions` WRITE;
/*!40000 ALTER TABLE `Questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SettingVersions`
--

DROP TABLE IF EXISTS `SettingVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SettingVersions` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ChangedByName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Version` int(11) NOT NULL,
  `SettingId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SettingVersions`
--

LOCK TABLES `SettingVersions` WRITE;
/*!40000 ALTER TABLE `SettingVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SettingVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Settings`
--

DROP TABLE IF EXISTS `Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Settings` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ChangedByName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Version` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settings`
--

LOCK TABLES `Settings` WRITE;
/*!40000 ALTER TABLE `Settings` DISABLE KEYS */;
INSERT INTO `Settings` VALUES (1,'firstRunDone','true',NULL,NULL,NULL,0),(2,'logLevel','4',NULL,NULL,NULL,0),(3,'logLimit','25000',NULL,NULL,NULL,0),(4,'knownSitesDone','true',NULL,NULL,NULL,0),(5,'fileLocationPicture','/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/picture/',NULL,NULL,NULL,0),(6,'fileLocationPdf','/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/pdf/',NULL,NULL,NULL,0),(7,'fileLocationJasper','/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/',NULL,NULL,NULL,0),(8,'token','abc1234567890abc1234567890abcdef',NULL,NULL,NULL,0),(9,'comAddressBasic','https://basic.microting.com',NULL,NULL,NULL,0),(10,'comAddressApi','https://srv05.microting.com',NULL,NULL,NULL,0),(11,'comAddressPdfUpload','https://srv16.microting.com',NULL,NULL,NULL,0),(12,'comOrganizationId','420',NULL,NULL,NULL,0),(13,'awsAccessKeyId','asdasd',NULL,NULL,NULL,0),(14,'awsSecretAccessKey','asdasd',NULL,NULL,NULL,0),(15,'awsEndPoint','https://sqs.eu-central-1.amazonaws.com/941181150686/',NULL,NULL,NULL,0),(16,'unitLicenseNumber','100',NULL,NULL,NULL,0),(17,'httpServerAddress','http://localhost',NULL,NULL,NULL,0),(18,'maxParallelism','1',NULL,NULL,NULL,0),(19,'numberOfWorkers','1',NULL,NULL,NULL,0),(20,'comSpeechToText','https://speechtotext.microting.com',NULL,NULL,NULL,0),(21,'swiftEnabled','False',NULL,NULL,NULL,0),(22,'swiftUserName','eformsdk',NULL,NULL,NULL,0),(23,'swiftPassword','eformsdktosecretpassword',NULL,NULL,NULL,0),(24,'swiftEndPoint','http://172.16.4.4:8080/swift/v1',NULL,NULL,NULL,0),(25,'keystoneEndPoint','http://172.16.4.4:5000/v2.0',NULL,NULL,NULL,0),(26,'customerNo','420','',NULL,NULL,0),(27,'s3Enabled','True',NULL,NULL,NULL,0),(28,'s3AccessKeyId','asdasd',NULL,NULL,NULL,0),(29,'s3SecrectAccessKey','asdasd',NULL,NULL,NULL,0),(30,'s3Endpoint','https://s3.eu-central-1.amazonaws.com',NULL,NULL,NULL,0),(31,'s3BucketName','microting-uploaded-data',NULL,NULL,NULL,0),(32,'rabbitMqUser','admin',NULL,NULL,NULL,0),(33,'rabbitMqPassword','password',NULL,NULL,NULL,0),(34,'rabbitMqHost','localhost',NULL,NULL,NULL,0),(35,'translationsMigrated','4.0',NULL,NULL,NULL,0),(36,'pluginsEnabled','none',NULL,NULL,NULL,0),(37,'servicesEnabled','none',NULL,NULL,NULL,0),(38,'comAddressNewApi','none',NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteSurveyConfigurationVersions`
--

DROP TABLE IF EXISTS `SiteSurveyConfigurationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteSurveyConfigurationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NOT NULL,
  `SiteSurveyConfigurationId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_site_survey_configuration_versions_siteSurveyConfigurationId` (`SiteSurveyConfigurationId`),
  CONSTRAINT `FK_site_survey_configuration_versions_site_survey_configuration~` FOREIGN KEY (`SiteSurveyConfigurationId`) REFERENCES `SiteSurveyConfigurations` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteSurveyConfigurationVersions`
--

LOCK TABLES `SiteSurveyConfigurationVersions` WRITE;
/*!40000 ALTER TABLE `SiteSurveyConfigurationVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteSurveyConfigurationVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteSurveyConfigurations`
--

DROP TABLE IF EXISTS `SiteSurveyConfigurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteSurveyConfigurations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NOT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_site_survey_configurations_siteId` (`SiteId`),
  KEY `IX_site_survey_configurations_surveyConfigurationId` (`SurveyConfigurationId`),
  CONSTRAINT `FK_site_survey_configurations_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_site_survey_configurations_survey_configurations_SurveyConfi~` FOREIGN KEY (`SurveyConfigurationId`) REFERENCES `SurveyConfigurations` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteSurveyConfigurations`
--

LOCK TABLES `SiteSurveyConfigurations` WRITE;
/*!40000 ALTER TABLE `SiteSurveyConfigurations` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteSurveyConfigurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteTagVersions`
--

DROP TABLE IF EXISTS `SiteTagVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteTagVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `TagId` int(11) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `SiteTagId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteTagVersions`
--

LOCK TABLES `SiteTagVersions` WRITE;
/*!40000 ALTER TABLE `SiteTagVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteTagVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteTags`
--

DROP TABLE IF EXISTS `SiteTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteTags` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `TagId` int(11) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_SiteTags_SiteId` (`SiteId`),
  KEY `IX_SiteTags_TagId` (`TagId`),
  CONSTRAINT `FK_SiteTags_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`),
  CONSTRAINT `FK_SiteTags_tags_TagId` FOREIGN KEY (`TagId`) REFERENCES `Tags` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteTags`
--

LOCK TABLES `SiteTags` WRITE;
/*!40000 ALTER TABLE `SiteTags` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteTags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteVersions`
--

DROP TABLE IF EXISTS `SiteVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `LanguageId` int(11) NOT NULL DEFAULT 0,
  `SearchableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `SelectableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteVersions`
--

LOCK TABLES `SiteVersions` WRITE;
/*!40000 ALTER TABLE `SiteVersions` DISABLE KEYS */;
INSERT INTO `SiteVersions` VALUES (1,'2022-09-21 06:00:55.857335','2022-09-21 06:00:55.857335','Niels Windfeld-Lund',16170,1,'created',1,1,0,0,0),(2,'2022-09-21 06:00:55.857335','2022-09-21 06:00:56.360042','Niels Windfeld-Lund',16170,2,'created',1,1,2,1,0),(3,'2022-09-21 07:30:25.464525','2022-09-21 07:30:25.464525','Jesper Graversen',16172,1,'created',2,1,0,0,0),(4,'2022-09-21 07:30:25.464525','2022-09-21 07:30:25.811725','Jesper Graversen',16172,2,'created',2,1,4,3,0),(5,'2022-09-23 12:13:21.182132','2022-09-23 12:13:21.182134','Andreas Kammersgård',16178,1,'created',3,1,0,0,0),(6,'2022-09-23 12:13:21.182132','2022-09-23 12:13:21.812716','Andreas Kammersgård',16178,2,'created',3,1,6,5,0),(7,'2022-09-23 12:13:54.819751','2022-09-23 12:13:54.819751','Aksel Sværke',16180,1,'created',4,1,0,0,0),(8,'2022-09-23 12:13:54.819751','2022-09-23 12:13:55.544899','Aksel Sværke',16180,2,'created',4,1,8,7,0),(9,'2022-09-23 12:14:12.455159','2022-09-23 12:14:12.455159','Rasmus Koustrup',16182,1,'created',5,1,0,0,0),(10,'2022-09-23 12:14:12.455159','2022-09-23 12:14:12.718397','Rasmus Koustrup',16182,2,'created',5,1,10,9,0),(11,'2022-09-23 12:14:26.678898','2022-09-23 12:14:26.678898','Rasmus Nielsen',16184,1,'created',6,1,0,0,0),(12,'2022-09-23 12:14:26.678898','2022-09-23 12:14:26.961203','Rasmus Nielsen',16184,2,'created',6,1,12,11,0),(13,'2022-09-23 12:14:42.805722','2022-09-23 12:14:42.805722','Rasmus Svendsen',16186,1,'created',7,1,0,0,0),(14,'2022-09-23 12:14:42.805722','2022-09-23 12:14:43.117949','Rasmus Svendsen',16186,2,'created',7,1,14,13,0),(15,'2022-09-23 12:14:59.481680','2022-09-23 12:14:59.481680','Lars Byskov',16188,1,'created',8,1,0,0,0),(16,'2022-09-23 12:14:59.481680','2022-09-23 12:14:59.887487','Lars Byskov',16188,2,'created',8,1,16,15,0),(17,'2022-09-23 12:15:20.443131','2022-09-23 12:15:20.443131','Jens Ole Gravesen',16190,1,'created',9,1,0,0,0),(18,'2022-09-23 12:15:20.443131','2022-09-23 12:15:20.818374','Jens Ole Gravesen',16190,2,'created',9,1,18,17,0),(19,'2022-09-23 12:15:37.475498','2022-09-23 12:15:37.475498','Nikolaj Jessen',16192,1,'created',10,1,0,0,0),(20,'2022-09-23 12:15:37.475498','2022-09-23 12:15:37.925381','Nikolaj Jessen',16192,2,'created',10,1,20,19,0),(21,'2022-09-23 12:15:53.423097','2022-09-23 12:15:53.423097','Nikolai Byskov',16194,1,'created',11,1,0,0,0),(22,'2022-09-23 12:15:53.423097','2022-09-23 12:15:53.819698','Nikolai Byskov',16194,2,'created',11,1,22,21,0),(23,'2022-09-23 12:16:07.975345','2022-09-23 12:16:07.975345','Søren Sværke Jakobsen',16196,1,'created',12,1,0,0,0),(24,'2022-09-23 12:16:07.975345','2022-09-23 12:16:08.535751','Søren Sværke Jakobsen',16196,2,'created',12,1,24,23,0),(25,'2022-09-23 12:16:25.952866','2022-09-23 12:16:25.952866','Jhonrey Erigbuagas',16198,1,'created',13,2,0,0,0),(26,'2022-09-23 12:16:25.952866','2022-09-23 12:16:26.265830','Jhonrey Erigbuagas',16198,2,'created',13,2,26,25,0),(27,'2022-09-23 12:16:48.028678','2022-09-23 12:16:48.028678','Dave Lumacang',16200,1,'created',14,2,0,0,0),(28,'2022-09-23 12:16:48.028678','2022-09-23 12:16:48.312916','Dave Lumacang',16200,2,'created',14,2,28,27,0),(29,'2022-09-23 12:17:07.444392','2022-09-23 12:17:07.444392','Willy Sabanal',16202,1,'created',15,2,0,0,0),(30,'2022-09-23 12:17:07.444392','2022-09-23 12:17:07.792991','Willy Sabanal',16202,2,'created',15,2,30,29,0),(31,'2022-09-26 12:04:02.366980','2022-09-26 12:04:02.366980','Daniel Jakobsen',16204,1,'created',16,1,0,0,0),(32,'2022-09-26 12:04:02.366980','2022-09-26 12:04:02.672933','Daniel Jakobsen',16204,2,'created',16,1,32,31,0),(33,'2022-09-26 12:04:15.063128','2022-09-26 12:04:15.063128','Kent Jakobsen',16206,1,'created',17,1,0,0,0),(34,'2022-09-26 12:04:15.063128','2022-09-26 12:04:15.340389','Kent Jakobsen',16206,2,'created',17,1,34,33,0),(35,'2022-10-18 06:26:20.122595','2022-10-18 06:26:20.122597','bruger test',16300,1,'created',18,1,0,0,0),(36,'2022-10-18 06:26:20.122595','2022-10-18 06:26:20.718219','bruger test',16300,2,'created',18,1,36,35,0),(37,'2022-10-18 06:26:20.122595','2022-10-18 06:29:27.460957','bruger test',16300,3,'removed',18,1,36,35,0),(38,'2022-09-26 12:04:02.366980','2022-10-18 07:52:40.443904','Daniel Jakobsen',16204,3,'created',16,1,32,31,1),(40,'2022-09-23 12:14:26.678898','2023-02-06 13:27:32.222128','Mike Formentera',16184,3,'created',6,2,12,11,0),(41,'2022-09-21 06:00:55.857335','2023-05-11 11:55:36.426353','a b',16170,3,'created',1,1,2,1,0),(42,'2022-09-21 07:30:25.464525','2023-05-11 11:55:49.815884','c d',16172,3,'created',2,1,4,3,0),(43,'2022-09-23 12:13:21.182132','2023-05-11 11:55:55.091960','e f',16178,3,'created',3,1,6,5,0),(44,'2022-09-23 12:13:54.819751','2023-05-11 11:56:01.131647','g h',16180,3,'created',4,1,8,7,0),(45,'2022-09-23 12:14:12.455159','2023-05-11 11:56:07.214916','i j',16182,3,'created',5,1,10,9,0),(46,'2022-09-23 12:14:26.678898','2023-05-11 11:56:12.644290','k l',16184,4,'created',6,2,12,11,0),(47,'2022-09-23 12:14:42.805722','2023-05-11 11:56:18.847775','m n',16186,3,'created',7,1,14,13,0),(48,'2022-09-23 12:14:59.481680','2023-05-11 11:56:24.287643','o p',16188,3,'created',8,1,16,15,0),(49,'2022-09-23 12:15:20.443131','2023-05-11 11:56:30.647805','r s',16190,3,'created',9,1,18,17,0),(50,'2022-09-23 12:15:20.443131','2023-05-11 11:56:39.566329','q r',16190,4,'created',9,1,18,17,0),(51,'2022-09-23 12:15:37.475498','2023-05-11 11:56:47.155333','s t',16192,3,'created',10,1,20,19,0),(52,'2022-09-23 12:15:53.423097','2023-05-11 11:57:00.399544','u v',16194,3,'created',11,1,22,21,0),(53,'2022-09-23 12:16:07.975345','2023-05-11 11:57:08.646740','w x',16196,3,'created',12,1,24,23,0),(54,'2022-09-23 12:16:25.952866','2023-05-11 11:57:18.859692','y z',16198,3,'created',13,2,26,25,0),(55,'2022-09-23 12:16:48.028678','2023-05-11 11:57:28.561073','aa ab',16200,3,'created',14,2,28,27,0),(56,'2022-09-23 12:17:07.444392','2023-05-11 11:57:36.348666','ac ad',16202,3,'created',15,2,30,29,0),(57,'2022-09-26 12:04:15.063128','2023-05-11 11:57:47.218333','ae af',16206,3,'created',17,1,34,33,0),(58,'2022-09-26 12:04:02.366980','2023-05-11 11:58:45.531677','ae af',16204,4,'created',16,1,32,31,0),(59,'2022-09-26 12:04:15.063128','2023-05-11 11:58:53.813136','ag ah',16206,4,'created',17,1,34,33,0),(60,'2022-10-18 06:26:20.122595','2023-05-11 11:59:40.333329','ai aj',16300,4,'created',18,1,36,35,0);
/*!40000 ALTER TABLE `SiteVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteWorkerVersions`
--

DROP TABLE IF EXISTS `SiteWorkerVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteWorkerVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SiteId` int(11) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteWorkerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteWorkerVersions`
--

LOCK TABLES `SiteWorkerVersions` WRITE;
/*!40000 ALTER TABLE `SiteWorkerVersions` DISABLE KEYS */;
INSERT INTO `SiteWorkerVersions` VALUES (1,1,1,13912,1,'created','2022-09-21 06:00:56.980649','2022-09-21 06:00:56.980649',1),(2,2,2,13914,1,'created','2022-09-21 07:30:26.951496','2022-09-21 07:30:26.951496',2),(3,3,3,13920,1,'created','2022-09-23 12:13:22.442453','2022-09-23 12:13:22.442454',3),(4,4,4,13922,1,'created','2022-09-23 12:13:56.685451','2022-09-23 12:13:56.685451',4),(5,5,5,13924,1,'created','2022-09-23 12:14:12.968486','2022-09-23 12:14:12.968486',5),(6,6,6,13926,1,'created','2022-09-23 12:14:27.231359','2022-09-23 12:14:27.231359',6),(7,7,7,13928,1,'created','2022-09-23 12:14:43.424687','2022-09-23 12:14:43.424687',7),(8,8,8,13930,1,'created','2022-09-23 12:15:00.394785','2022-09-23 12:15:00.394785',8),(9,9,9,13932,1,'created','2022-09-23 12:15:21.161555','2022-09-23 12:15:21.161555',9),(10,10,10,13934,1,'created','2022-09-23 12:15:38.630878','2022-09-23 12:15:38.630878',10),(11,11,11,13936,1,'created','2022-09-23 12:15:54.381228','2022-09-23 12:15:54.381228',11),(12,12,12,13938,1,'created','2022-09-23 12:16:09.114012','2022-09-23 12:16:09.114012',12),(13,13,13,13940,1,'created','2022-09-23 12:16:27.125548','2022-09-23 12:16:27.125548',13),(14,14,14,13942,1,'created','2022-09-23 12:16:48.612179','2022-09-23 12:16:48.612179',14),(15,15,15,13944,1,'created','2022-09-23 12:17:08.124261','2022-09-23 12:17:08.124261',15),(16,16,16,13946,1,'created','2022-09-26 12:04:03.514994','2022-09-26 12:04:03.514994',16),(17,17,17,13948,1,'created','2022-09-26 12:04:15.619654','2022-09-26 12:04:15.619654',17),(18,18,18,14040,1,'created','2022-10-18 06:26:22.158132','2022-10-18 06:26:22.158133',18),(19,18,18,14040,2,'removed','2022-10-18 06:26:22.158132','2022-10-18 06:29:27.901479',18);
/*!40000 ALTER TABLE `SiteWorkerVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteWorkers`
--

DROP TABLE IF EXISTS `SiteWorkers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteWorkers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SiteId` int(11) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_site_workers_site_id` (`SiteId`),
  KEY `IX_site_workers_worker_id` (`WorkerId`),
  CONSTRAINT `FK_site_workers_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`),
  CONSTRAINT `FK_site_workers_workers_WorkerId` FOREIGN KEY (`WorkerId`) REFERENCES `Workers` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteWorkers`
--

LOCK TABLES `SiteWorkers` WRITE;
/*!40000 ALTER TABLE `SiteWorkers` DISABLE KEYS */;
INSERT INTO `SiteWorkers` VALUES (1,1,1,13912,1,'created','2022-09-21 06:00:56.980649','2022-09-21 06:00:56.980649'),(2,2,2,13914,1,'created','2022-09-21 07:30:26.951496','2022-09-21 07:30:26.951496'),(3,3,3,13920,1,'created','2022-09-23 12:13:22.442453','2022-09-23 12:13:22.442454'),(4,4,4,13922,1,'created','2022-09-23 12:13:56.685451','2022-09-23 12:13:56.685451'),(5,5,5,13924,1,'created','2022-09-23 12:14:12.968486','2022-09-23 12:14:12.968486'),(6,6,6,13926,1,'created','2022-09-23 12:14:27.231359','2022-09-23 12:14:27.231359'),(7,7,7,13928,1,'created','2022-09-23 12:14:43.424687','2022-09-23 12:14:43.424687'),(8,8,8,13930,1,'created','2022-09-23 12:15:00.394785','2022-09-23 12:15:00.394785'),(9,9,9,13932,1,'created','2022-09-23 12:15:21.161555','2022-09-23 12:15:21.161555'),(10,10,10,13934,1,'created','2022-09-23 12:15:38.630878','2022-09-23 12:15:38.630878'),(11,11,11,13936,1,'created','2022-09-23 12:15:54.381228','2022-09-23 12:15:54.381228'),(12,12,12,13938,1,'created','2022-09-23 12:16:09.114012','2022-09-23 12:16:09.114012'),(13,13,13,13940,1,'created','2022-09-23 12:16:27.125548','2022-09-23 12:16:27.125548'),(14,14,14,13942,1,'created','2022-09-23 12:16:48.612179','2022-09-23 12:16:48.612179'),(15,15,15,13944,1,'created','2022-09-23 12:17:08.124261','2022-09-23 12:17:08.124261'),(16,16,16,13946,1,'created','2022-09-26 12:04:03.514994','2022-09-26 12:04:03.514994'),(17,17,17,13948,1,'created','2022-09-26 12:04:15.619654','2022-09-26 12:04:15.619654'),(18,18,18,14040,2,'created','2022-10-18 06:26:22.158132','2022-10-18 06:29:27.901479');
/*!40000 ALTER TABLE `SiteWorkers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sites`
--

DROP TABLE IF EXISTS `Sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sites` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `MicrotingUid` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `LanguageId` int(11) NOT NULL DEFAULT 0,
  `SearchableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `SelectableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sites`
--

LOCK TABLES `Sites` WRITE;
/*!40000 ALTER TABLE `Sites` DISABLE KEYS */;
INSERT INTO `Sites` VALUES (1,'2022-09-21 06:00:55.857335','2023-05-11 11:55:36.426353','a b',16170,3,'created',1,2,1,0),(2,'2022-09-21 07:30:25.464525','2023-05-11 11:55:49.815884','c d',16172,3,'created',1,4,3,0),(3,'2022-09-23 12:13:21.182132','2023-05-11 11:55:55.091960','e f',16178,3,'created',1,6,5,0),(4,'2022-09-23 12:13:54.819751','2023-05-11 11:56:01.131647','g h',16180,3,'created',1,8,7,0),(5,'2022-09-23 12:14:12.455159','2023-05-11 11:56:07.214916','i j',16182,3,'created',1,10,9,0),(6,'2022-09-23 12:14:26.678898','2023-05-11 11:56:12.644290','k l',16184,4,'created',2,12,11,0),(7,'2022-09-23 12:14:42.805722','2023-05-11 11:56:18.847775','m n',16186,3,'created',1,14,13,0),(8,'2022-09-23 12:14:59.481680','2023-05-11 11:56:24.287643','o p',16188,3,'created',1,16,15,0),(9,'2022-09-23 12:15:20.443131','2023-05-11 11:56:39.566329','q r',16190,4,'created',1,18,17,0),(10,'2022-09-23 12:15:37.475498','2023-05-11 11:56:47.155333','s t',16192,3,'created',1,20,19,0),(11,'2022-09-23 12:15:53.423097','2023-05-11 11:57:00.399544','u v',16194,3,'created',1,22,21,0),(12,'2022-09-23 12:16:07.975345','2023-05-11 11:57:08.646740','w x',16196,3,'created',1,24,23,0),(13,'2022-09-23 12:16:25.952866','2023-05-11 11:57:18.859692','y z',16198,3,'created',2,26,25,0),(14,'2022-09-23 12:16:48.028678','2023-05-11 11:57:28.561073','aa ab',16200,3,'created',2,28,27,0),(15,'2022-09-23 12:17:07.444392','2023-05-11 11:57:36.348666','ac ad',16202,3,'created',2,30,29,0),(16,'2022-09-26 12:04:02.366980','2023-05-11 11:58:45.531677','ae af',16204,4,'created',1,32,31,0),(17,'2022-09-26 12:04:15.063128','2023-05-11 11:58:53.813136','ag ah',16206,4,'created',1,34,33,0),(18,'2022-10-18 06:26:20.122595','2023-05-11 11:59:40.333329','ai aj',16300,4,'created',1,36,35,0);
/*!40000 ALTER TABLE `Sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyConfigurationVersions`
--

DROP TABLE IF EXISTS `SurveyConfigurationVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SurveyConfigurationVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Start` datetime(6) NOT NULL,
  `Stop` datetime(6) NOT NULL,
  `TimeToLive` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TimeOut` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL DEFAULT 0,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_survey_configuration_versions_surveyConfigurationId` (`SurveyConfigurationId`),
  CONSTRAINT `FK_survey_configuration_versions_survey_configurations_SurveyCo~` FOREIGN KEY (`SurveyConfigurationId`) REFERENCES `SurveyConfigurations` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyConfigurationVersions`
--

LOCK TABLES `SurveyConfigurationVersions` WRITE;
/*!40000 ALTER TABLE `SurveyConfigurationVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `SurveyConfigurationVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyConfigurations`
--

DROP TABLE IF EXISTS `SurveyConfigurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SurveyConfigurations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Start` datetime(6) NOT NULL,
  `Stop` datetime(6) NOT NULL,
  `TimeToLive` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TimeOut` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL DEFAULT 0,
  `MicrotingUid` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_survey_configurations_QuestionSetId` (`QuestionSetId`),
  CONSTRAINT `FK_survey_configurations_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `QuestionSets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyConfigurations`
--

LOCK TABLES `SurveyConfigurations` WRITE;
/*!40000 ALTER TABLE `SurveyConfigurations` DISABLE KEYS */;
/*!40000 ALTER TABLE `SurveyConfigurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TagVersions`
--

DROP TABLE IF EXISTS `TagVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TagVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `TaggingsCount` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `TagId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TagVersions`
--

LOCK TABLES `TagVersions` WRITE;
/*!40000 ALTER TABLE `TagVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `TagVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TaggingVersions`
--

DROP TABLE IF EXISTS `TaggingVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaggingVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TagId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `TaggerId` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `TaggingId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TaggingVersions`
--

LOCK TABLES `TaggingVersions` WRITE;
/*!40000 ALTER TABLE `TaggingVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `TaggingVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Taggings`
--

DROP TABLE IF EXISTS `Taggings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Taggings` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TagId` int(11) DEFAULT NULL,
  `CheckListId` int(11) DEFAULT NULL,
  `TaggerId` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_taggings_check_list_id` (`CheckListId`),
  KEY `IX_taggings_tag_id` (`TagId`),
  CONSTRAINT `FK_taggings_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `CheckLists` (`Id`),
  CONSTRAINT `FK_taggings_tags_TagId` FOREIGN KEY (`TagId`) REFERENCES `Tags` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Taggings`
--

LOCK TABLES `Taggings` WRITE;
/*!40000 ALTER TABLE `Taggings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Taggings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tags` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `TaggingsCount` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tags`
--

LOCK TABLES `Tags` WRITE;
/*!40000 ALTER TABLE `Tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UnitVersions`
--

DROP TABLE IF EXISTS `UnitVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UnitVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MicrotingUid` int(11) DEFAULT NULL,
  `OtpCode` int(11) DEFAULT NULL,
  `CustomerNo` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `Manufacturer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Model` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OsVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `eFormVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `InSightVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Os` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LastIp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LeftMenuEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `PushEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SeparateFetchSend` tinyint(1) NOT NULL DEFAULT 0,
  `SerialNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SyncDefaultDelay` int(11) NOT NULL DEFAULT 0,
  `SyncDelayEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SyncDelayPrCheckList` int(11) NOT NULL DEFAULT 0,
  `SyncDialog` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UnitVersions`
--

LOCK TABLES `UnitVersions` WRITE;
/*!40000 ALTER TABLE `UnitVersions` DISABLE KEYS */;
INSERT INTO `UnitVersions` VALUES (1,18770,849309,918,1,'created',1,'2022-09-21 06:00:56.423345','2022-09-21 06:00:56.423345',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(2,18772,839178,918,1,'created',2,'2022-09-21 07:30:25.841350','2022-09-21 07:30:25.841350',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(3,18778,293342,918,1,'created',3,'2022-09-23 12:13:21.893522','2022-09-23 12:13:21.893523',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(4,18780,363121,918,1,'created',4,'2022-09-23 12:13:55.595530','2022-09-23 12:13:55.595531',4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(5,18782,262879,918,1,'created',5,'2022-09-23 12:14:12.747125','2022-09-23 12:14:12.747125',5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(6,18784,373808,918,1,'created',6,'2022-09-23 12:14:26.990508','2022-09-23 12:14:26.990508',6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(7,18786,697754,918,1,'created',7,'2022-09-23 12:14:43.160891','2022-09-23 12:14:43.160892',7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(8,18788,363636,918,1,'created',8,'2022-09-23 12:14:59.944387','2022-09-23 12:14:59.944387',8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(9,18790,796449,918,1,'created',9,'2022-09-23 12:15:20.861755','2022-09-23 12:15:20.861755',9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(10,18792,253197,918,1,'created',10,'2022-09-23 12:15:38.011133','2022-09-23 12:15:38.011133',10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(11,18794,216732,918,1,'created',11,'2022-09-23 12:15:53.919201','2022-09-23 12:15:53.919201',11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(12,18796,126946,918,1,'created',12,'2022-09-23 12:16:08.654410','2022-09-23 12:16:08.654410',12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(13,18798,186739,918,1,'created',13,'2022-09-23 12:16:26.305517','2022-09-23 12:16:26.305517',13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(14,18800,147462,918,1,'created',14,'2022-09-23 12:16:48.369920','2022-09-23 12:16:48.369920',14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(15,18802,882266,918,1,'created',15,'2022-09-23 12:17:07.825758','2022-09-23 12:17:07.825758',15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(16,18804,788264,918,1,'created',16,'2022-09-26 12:04:02.707318','2022-09-26 12:04:02.707318',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(17,18806,666377,918,1,'created',17,'2022-09-26 12:04:15.370813','2022-09-26 12:04:15.370813',17,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(18,18772,0,918,2,'created',2,'2022-09-21 07:30:25.841350','2022-09-26 12:19:07.347653',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(19,18804,0,918,2,'created',16,'2022-09-26 12:04:02.707318','2022-09-26 12:19:07.641067',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(20,18770,0,918,2,'created',1,'2022-09-21 06:00:56.423345','2022-09-26 12:19:15.895434',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(21,18770,674513,918,3,'created',1,'2022-09-21 06:00:56.423345','2022-10-18 06:05:37.846210',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(22,18770,0,918,4,'created',1,'2022-09-21 06:00:56.423345','2022-10-18 06:05:47.972494',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(23,18804,568805,918,3,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:12:18.368513',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(24,18804,0,918,4,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:12:35.720302',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(25,18772,928041,918,3,'created',2,'2022-09-21 07:30:25.841350','2022-10-18 06:14:12.319275',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(26,18772,0,918,4,'created',2,'2022-09-21 07:30:25.841350','2022-10-18 06:14:22.825830',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(27,18804,762534,918,5,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:18:19.573866',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(28,18804,0,918,6,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:18:32.589124',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(29,18770,210766,918,5,'created',1,'2022-09-21 06:00:56.423345','2022-10-18 06:21:58.775599',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(30,18770,0,918,6,'created',1,'2022-09-21 06:00:56.423345','2022-10-18 06:22:11.224283',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(31,18900,524939,918,1,'created',18,'2022-10-18 06:26:20.779345','2022-10-18 06:26:20.779346',18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(32,18804,703970,918,7,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:34:08.463810',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(33,18804,0,918,8,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:34:19.881910',16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(34,18804,0,918,9,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 06:37:10.419837',16,'Android','SM-G991B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(35,18772,211661,918,5,'created',2,'2022-09-21 07:30:25.841350','2022-10-18 06:43:59.167647',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(36,18772,0,918,6,'created',2,'2022-09-21 07:30:25.841350','2022-10-18 06:44:07.880596',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(37,18804,214090,918,10,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 07:36:50.697505',16,'Android','SM-G991B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(38,18804,0,918,11,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 07:37:07.326427',16,'Android','SM-G991B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(39,18772,812802,918,7,'created',2,'2022-09-21 07:30:25.841350','2022-10-18 07:44:49.528655',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(40,18804,0,918,12,'created',16,'2022-09-26 12:04:02.707318','2022-10-18 07:52:40.467796',16,'Android','SM-G991B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,1),(41,18770,761186,918,7,'created',1,'2022-09-21 06:00:56.423345','2022-10-18 08:02:23.506187',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(42,18770,0,918,8,'created',1,'2022-09-21 06:00:56.423345','2022-10-18 08:02:32.300428',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(43,18780,0,918,2,'created',4,'2022-09-23 12:13:55.595530','2022-10-18 10:31:58.525565',4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(44,18788,0,918,2,'created',8,'2022-09-23 12:14:59.944387','2022-10-18 10:40:09.723830',8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(45,18794,0,918,2,'created',11,'2022-09-23 12:15:53.919201','2022-10-18 10:40:19.821855',11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(46,18778,0,918,2,'created',3,'2022-09-23 12:13:21.893522','2022-10-18 10:45:42.349191',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(47,18778,0,918,3,'created',3,'2022-09-23 12:13:21.893522','2022-10-18 14:04:27.374280',3,'iOS','iPhone11,8',NULL,'15.6.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(48,18780,0,918,3,'created',4,'2022-09-23 12:13:55.595530','2022-10-19 13:30:18.113143',4,'Android','SM-A415F',NULL,'10','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(49,18782,0,918,2,'created',5,'2022-09-23 12:14:12.747125','2022-10-24 10:31:02.297628',5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(50,18784,0,918,2,'created',6,'2022-09-23 12:14:26.990508','2022-10-24 10:32:43.050728',6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(51,18772,0,918,8,'created',2,'2022-09-21 07:30:25.841350','2022-10-24 10:36:15.943440',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(52,18794,0,918,3,'created',11,'2022-09-23 12:15:53.919201','2022-10-24 12:03:37.120426',11,'iOS','iPhone12,1',NULL,'15.6.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(53,18782,0,918,3,'created',5,'2022-09-23 12:14:12.747125','2022-10-24 14:19:46.666363',5,'iOS','iPhone13,2',NULL,'16.0.2','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(54,18788,0,918,3,'created',8,'2022-09-23 12:14:59.944387','2022-10-24 16:06:23.926355',8,'iOS','iPhone12,8',NULL,'15.5','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(55,18790,0,918,2,'created',9,'2022-09-23 12:15:20.861755','2022-10-24 17:45:10.647787',9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(56,18772,0,918,9,'created',2,'2022-09-21 07:30:25.841350','2022-10-24 19:34:32.417844',2,'iOS','iPhone13,2',NULL,'15.6.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(57,18784,0,918,3,'created',6,'2022-09-23 12:14:26.990508','2022-10-25 15:21:46.645365',6,'Android','SM-A526B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(58,18790,0,918,3,'created',9,'2022-09-23 12:15:20.861755','2022-10-25 19:11:30.180407',9,'iOS','iPhone12,1',NULL,'16.0.3','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(59,18800,0,918,2,'created',14,'2022-09-23 12:16:48.369920','2022-11-08 17:21:13.704954',14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(60,18800,0,918,3,'created',14,'2022-09-23 12:16:48.369920','2022-11-08 17:24:04.888182',14,'iOS','iPhone14,3',NULL,'16.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(61,18798,0,918,2,'created',13,'2022-09-23 12:16:26.305517','2022-11-08 17:33:14.632056',13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(62,18798,0,918,3,'created',13,'2022-09-23 12:16:26.305517','2022-11-08 17:35:43.226748',13,'Android','SM-A115F',NULL,'10','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(63,18802,0,918,2,'created',15,'2022-09-23 12:17:07.825758','2022-11-08 17:39:14.755097',15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(64,18802,0,918,3,'created',15,'2022-09-23 12:17:07.825758','2022-11-10 13:11:23.409746',15,'Android','CPH1969',NULL,'11','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(65,18772,0,918,10,'created',2,'2022-09-21 07:30:25.841350','2022-11-18 05:45:09.045270',2,'iOS','iPhone13,2',NULL,'16.1.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(66,18788,0,918,4,'created',8,'2022-09-23 12:14:59.944387','2022-11-20 18:07:58.544846',8,'iOS','iPhone12,8',NULL,'16.1.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(67,18778,0,918,4,'created',3,'2022-09-23 12:13:21.893522','2022-11-23 21:11:16.990879',3,'iOS','iPhone11,8',NULL,'16.1.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(68,18794,0,918,4,'created',11,'2022-09-23 12:15:53.919201','2022-11-27 06:23:21.596413',11,'iOS','iPhone12,1',NULL,'16.1.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(69,18782,0,918,4,'created',5,'2022-09-23 12:14:12.747125','2022-11-29 14:47:08.560858',5,'iOS','iPhone13,2',NULL,'16.1.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(70,18782,0,918,5,'created',5,'2022-09-23 12:14:12.747125','2022-12-06 15:50:04.619134',5,'iOS','iPhone13,2',NULL,'16.1.2','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(71,18772,0,918,11,'created',2,'2022-09-21 07:30:25.841350','2022-12-07 14:47:37.943511',2,'iOS','iPhone13,2',NULL,'16.1.2','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(72,18786,0,918,2,'created',7,'2022-09-23 12:14:43.160891','2022-12-09 13:08:49.809247',7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(73,18786,0,918,3,'created',7,'2022-09-23 12:14:43.160891','2023-01-02 16:07:37.140975',7,'iOS','iPhone10,4',NULL,'15.4.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(75,18778,0,918,5,'created',3,'2022-09-23 12:13:21.893522','2023-01-23 18:49:08.371864',3,'iOS','iPhone11,8',NULL,'16.2','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(77,18782,0,918,6,'created',5,'2022-09-23 12:14:12.747125','2023-01-28 15:39:43.994568',5,'iOS','iPhone13,2',NULL,'16.2','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(79,18784,844251,918,4,'created',6,'2022-09-23 12:14:26.990508','2023-02-06 13:28:03.577843',6,'Android','SM-A526B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(80,18784,0,918,5,'created',6,'2022-09-23 12:14:26.990508','2023-02-08 04:48:42.128434',6,'Android','SM-A526B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(82,18784,0,918,6,'created',6,'2022-09-23 12:14:26.990508','2023-02-09 15:00:47.393059',6,'Android','DUB-LX2',NULL,'8.1.0','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(84,18788,0,918,5,'created',8,'2022-09-23 12:14:59.944387','2023-02-24 17:58:38.108078',8,'iOS','iPhone12,8',NULL,'16.3.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(86,18790,0,918,4,'created',9,'2022-09-23 12:15:20.861755','2023-02-25 08:59:35.370600',9,'iOS','iPhone12,1',NULL,'16.3.1','2.0.102',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(87,18798,0,918,4,'created',13,'2022-09-23 12:16:26.305517','2023-02-26 05:22:32.079657',13,'Android','SM-A115F',NULL,'11','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(88,18800,0,918,4,'created',14,'2022-09-23 12:16:48.369920','2023-03-07 18:40:12.797836',14,'iOS','iPhone14,3',NULL,'16.1','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(91,18778,0,918,6,'created',3,'2022-09-23 12:13:21.893522','2023-03-08 01:48:13.833918',3,'iOS','iPhone11,8',NULL,'16.2','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(92,18788,0,918,6,'created',8,'2022-09-23 12:14:59.944387','2023-03-08 16:33:41.163439',8,'iOS','iPhone12,8',NULL,'16.3.1','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(93,18794,0,918,5,'created',11,'2022-09-23 12:15:53.919201','2023-03-08 19:14:34.153109',11,'iOS','iPhone12,1',NULL,'16.1.1','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(95,18790,0,918,5,'created',9,'2022-09-23 12:15:20.861755','2023-03-09 14:28:18.137208',9,'iOS','iPhone12,1',NULL,'16.3.1','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(96,18802,0,918,4,'created',15,'2022-09-23 12:17:07.825758','2023-03-11 05:18:34.863478',15,'Android','CPH1969',NULL,'11','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(97,18782,0,918,7,'created',5,'2022-09-23 12:14:12.747125','2023-03-11 15:21:07.971995',5,'iOS','iPhone13,2',NULL,'16.3.1','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(98,18798,0,918,5,'created',13,'2022-09-23 12:16:26.305517','2023-03-13 07:54:45.890267',13,'Android','SM-A115F',NULL,'11','2.0.109',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(99,18802,0,918,5,'created',15,'2022-09-23 12:17:07.825758','2023-03-20 18:19:34.946515',15,'Android','CPH1969',NULL,'11','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(100,18782,0,918,8,'created',5,'2022-09-23 12:14:12.747125','2023-03-21 15:01:07.630139',5,'iOS','iPhone13,2',NULL,'16.3.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(101,18788,0,918,7,'created',8,'2022-09-23 12:14:59.944387','2023-03-21 20:05:29.321286',8,'iOS','iPhone12,8',NULL,'16.3.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(103,18778,0,918,7,'created',3,'2022-09-23 12:13:21.893522','2023-03-22 05:30:18.163780',3,'iOS','iPhone11,8',NULL,'16.2','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(106,18800,0,918,5,'created',14,'2022-09-23 12:16:48.369920','2023-03-23 04:54:46.505101',14,'iOS','iPhone14,3',NULL,'16.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(107,18790,0,918,6,'created',9,'2022-09-23 12:15:20.861755','2023-03-23 15:10:47.686574',9,'iOS','iPhone12,1',NULL,'16.3.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(108,18772,0,918,12,'created',2,'2022-09-21 07:30:25.841350','2023-03-23 17:48:24.317165',2,'iOS','iPhone13,2',NULL,'16.3.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(110,18794,0,918,6,'created',11,'2022-09-23 12:15:53.919201','2023-03-23 20:37:57.498854',11,'iOS','iPhone12,1',NULL,'16.1.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(111,18798,0,918,6,'created',13,'2022-09-23 12:16:26.305517','2023-03-27 02:21:17.359223',13,'Android','SM-A115F',NULL,'11','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(113,18788,0,918,8,'created',8,'2022-09-23 12:14:59.944387','2023-04-22 01:16:28.861630',8,'iOS','iPhone12,8',NULL,'16.4.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(116,18794,144167,918,7,'created',11,'2022-09-23 12:15:53.919201','2023-04-22 06:30:41.364277',11,'iOS','iPhone12,1',NULL,'16.1.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(118,18794,0,918,8,'created',11,'2022-09-23 12:15:53.919201','2023-04-22 14:24:04.803250',11,'iOS','iPhone12,1',NULL,'16.1.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(121,18794,0,918,9,'created',11,'2022-09-23 12:15:53.919201','2023-04-23 18:24:07.394131',11,'iOS','iPhone14,7',NULL,'16.2','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(122,18790,0,918,7,'created',9,'2022-09-23 12:15:20.861755','2023-04-24 13:36:51.429270',9,'iOS','iPhone12,1',NULL,'16.4.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(124,18786,0,918,4,'created',7,'2022-09-23 12:14:43.160891','2023-04-27 16:55:44.640993',7,'iOS','iPhone10,4',NULL,'16.4.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(125,18798,0,918,7,'created',13,'2022-09-23 12:16:26.305517','2023-05-01 13:01:42.543107',13,'Android','SM-A336B',NULL,'13','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(126,18798,0,918,8,'created',13,'2022-09-23 12:16:26.305517','2023-05-02 17:15:56.279160',13,'Android','SM-A115F',NULL,'11','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(127,18798,0,918,9,'created',13,'2022-09-23 12:16:26.305517','2023-05-03 12:44:23.810305',13,'Android','SM-A336B',NULL,'13','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(128,18798,0,918,10,'created',13,'2022-09-23 12:16:26.305517','2023-05-05 15:04:20.427181',13,'Android','SM-A115F',NULL,'11','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(131,18798,0,918,11,'created',13,'2022-09-23 12:16:26.305517','2023-05-06 14:53:11.165461',13,'Android','SM-A336B',NULL,'13','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(134,18798,0,918,12,'created',13,'2022-09-23 12:16:26.305517','2023-05-10 15:35:42.563590',13,'Android','SM-A115F',NULL,'12','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(137,18798,0,918,13,'created',13,'2022-09-23 12:16:26.305517','2023-05-11 10:51:58.108737',13,'Android','SM-A336B',NULL,'13','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0);
/*!40000 ALTER TABLE `UnitVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Units`
--

DROP TABLE IF EXISTS `Units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Units` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MicrotingUid` int(11) DEFAULT NULL,
  `OtpCode` int(11) DEFAULT NULL,
  `CustomerNo` int(11) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `SiteId` int(11) DEFAULT NULL,
  `Manufacturer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Model` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OsVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `eFormVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `InSightVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Os` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LastIp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LeftMenuEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `PushEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SeparateFetchSend` tinyint(1) NOT NULL DEFAULT 0,
  `SerialNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SyncDefaultDelay` int(11) NOT NULL DEFAULT 0,
  `SyncDelayEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SyncDelayPrCheckList` int(11) NOT NULL DEFAULT 0,
  `SyncDialog` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `IX_units_site_id` (`SiteId`),
  CONSTRAINT `FK_units_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Sites` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Units`
--

LOCK TABLES `Units` WRITE;
/*!40000 ALTER TABLE `Units` DISABLE KEYS */;
INSERT INTO `Units` VALUES (1,18770,0,420,8,'created','2022-09-21 06:00:56.423345','2022-10-18 08:02:32.300428',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(2,18772,0,420,12,'created','2022-09-21 07:30:25.841350','2023-03-23 17:48:24.317165',2,'iOS','iPhone13,2',NULL,'16.3.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(3,18778,0,420,7,'created','2022-09-23 12:13:21.893522','2023-03-22 05:30:18.163780',3,'iOS','iPhone11,8',NULL,'16.2','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(4,18780,0,420,3,'created','2022-09-23 12:13:55.595530','2022-10-19 13:30:18.113143',4,'Android','SM-A415F',NULL,'10','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(5,18782,0,420,8,'created','2022-09-23 12:14:12.747125','2023-03-21 15:01:07.630139',5,'iOS','iPhone13,2',NULL,'16.3.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(6,18784,0,420,6,'created','2022-09-23 12:14:26.990508','2023-02-09 15:00:47.393059',6,'Android','DUB-LX2',NULL,'8.1.0','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(7,18786,0,420,4,'created','2022-09-23 12:14:43.160891','2023-04-27 16:55:44.640993',7,'iOS','iPhone10,4',NULL,'16.4.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(8,18788,0,420,8,'created','2022-09-23 12:14:59.944387','2023-04-22 01:16:28.861630',8,'iOS','iPhone12,8',NULL,'16.4.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(9,18790,0,420,7,'created','2022-09-23 12:15:20.861755','2023-04-24 13:36:51.429270',9,'iOS','iPhone12,1',NULL,'16.4.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(10,18792,253197,420,1,'created','2022-09-23 12:15:38.011133','2022-09-23 12:15:38.011133',10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(11,18794,0,420,9,'created','2022-09-23 12:15:53.919201','2023-04-23 18:24:07.394131',11,'iOS','iPhone14,7',NULL,'16.2','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(12,18796,126946,420,1,'created','2022-09-23 12:16:08.654410','2022-09-23 12:16:08.654410',12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(13,18798,0,420,13,'created','2022-09-23 12:16:26.305517','2023-05-11 10:51:58.108737',13,'Android','SM-A336B',NULL,'13','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(14,18800,0,420,5,'created','2022-09-23 12:16:48.369920','2023-03-23 04:54:46.505101',14,'iOS','iPhone14,3',NULL,'16.1','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(15,18802,0,420,5,'created','2022-09-23 12:17:07.825758','2023-03-20 18:19:34.946515',15,'Android','CPH1969',NULL,'11','2.0.110',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(16,18804,0,420,12,'created','2022-09-26 12:04:02.707318','2022-10-18 07:52:40.467796',16,'Android','SM-G991B',NULL,'12','2.0.103',NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,1),(17,18806,666377,420,1,'created','2022-09-26 12:04:15.370813','2022-09-26 12:04:15.370813',17,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0),(18,18900,524939,420,1,'created','2022-10-18 06:26:20.779345','2022-10-18 06:26:20.779346',18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,NULL,0,0,0,0,0);
/*!40000 ALTER TABLE `Units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UploadedDataVersions`
--

DROP TABLE IF EXISTS `UploadedDataVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UploadedDataVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UploadedDataId` int(11) DEFAULT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UploaderId` int(11) DEFAULT NULL,
  `Checksum` varchar(255) DEFAULT NULL,
  `Extension` varchar(255) DEFAULT NULL,
  `CurrentFile` varchar(255) DEFAULT NULL,
  `UploaderType` varchar(255) DEFAULT NULL,
  `FileLocation` varchar(255) DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `ExpirationDate` datetime(6) DEFAULT NULL,
  `Local` smallint(6) DEFAULT NULL,
  `TranscriptionId` int(11) DEFAULT NULL,
  `OriginalFileLocation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UploadedDataVersions`
--

LOCK TABLES `UploadedDataVersions` WRITE;
/*!40000 ALTER TABLE `UploadedDataVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `UploadedDataVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UploadedDatas`
--

DROP TABLE IF EXISTS `UploadedDatas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UploadedDatas` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UploaderId` int(11) DEFAULT NULL,
  `Checksum` varchar(255) DEFAULT NULL,
  `Extension` varchar(255) DEFAULT NULL,
  `CurrentFile` varchar(255) DEFAULT NULL,
  `UploaderType` varchar(255) DEFAULT NULL,
  `FileLocation` varchar(255) DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `ExpirationDate` datetime(6) DEFAULT NULL,
  `Local` smallint(6) DEFAULT NULL,
  `TranscriptionId` int(11) DEFAULT NULL,
  `OriginalFileLocation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UploadedDatas`
--

LOCK TABLES `UploadedDatas` WRITE;
/*!40000 ALTER TABLE `UploadedDatas` DISABLE KEYS */;
/*!40000 ALTER TABLE `UploadedDatas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkerVersions`
--

DROP TABLE IF EXISTS `WorkerVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WorkerVersions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `WorkerId` int(11) DEFAULT NULL,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `Initials` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmployeeNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PinCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkerVersions`
--

LOCK TABLES `WorkerVersions` WRITE;
/*!40000 ALTER TABLE `WorkerVersions` DISABLE KEYS */;
INSERT INTO `WorkerVersions` VALUES (1,'2022-09-21 06:00:56.725618','2022-09-21 06:00:56.725618',13440,'created',1,'Niels','Windfeld-Lund',NULL,1,0,NULL,NULL,NULL),(2,'2022-09-21 07:30:25.964680','2022-09-21 07:30:25.964680',13442,'created',1,'Jesper','Graversen',NULL,2,0,NULL,NULL,NULL),(3,'2022-09-23 12:13:22.215458','2022-09-23 12:13:22.215459',13448,'created',1,'Andreas','Kammersgård',NULL,3,0,NULL,NULL,NULL),(4,'2022-09-23 12:13:55.739392','2022-09-23 12:13:55.739392',13450,'created',1,'Aksel','Sværke',NULL,4,0,NULL,NULL,NULL),(5,'2022-09-23 12:14:12.870443','2022-09-23 12:14:12.870443',13452,'created',1,'Rasmus','Koustrup',NULL,5,0,NULL,NULL,NULL),(6,'2022-09-23 12:14:27.125601','2022-09-23 12:14:27.125601',13454,'created',1,'Rasmus','Nielsen',NULL,6,0,NULL,NULL,NULL),(7,'2022-09-23 12:14:43.283661','2022-09-23 12:14:43.283661',13456,'created',1,'Rasmus','Svendsen',NULL,7,0,NULL,NULL,NULL),(8,'2022-09-23 12:15:00.213899','2022-09-23 12:15:00.213900',13458,'created',1,'Lars','Byskov',NULL,8,0,NULL,NULL,NULL),(9,'2022-09-23 12:15:21.005129','2022-09-23 12:15:21.005129',13460,'created',1,'Jens Ole','Gravesen',NULL,9,0,NULL,NULL,NULL),(10,'2022-09-23 12:15:38.302122','2022-09-23 12:15:38.302122',13462,'created',1,'Nikolaj','Jessen',NULL,10,0,NULL,NULL,NULL),(11,'2022-09-23 12:15:54.131293','2022-09-23 12:15:54.131293',13464,'created',1,'Nikolai','Byskov',NULL,11,0,NULL,NULL,NULL),(12,'2022-09-23 12:16:08.916472','2022-09-23 12:16:08.916472',13466,'created',1,'Søren','Sværke Jakobsen',NULL,12,0,NULL,NULL,NULL),(13,'2022-09-23 12:16:26.441776','2022-09-23 12:16:26.441776',13468,'created',1,'Jhonrey','Erigbuagas',NULL,13,0,NULL,NULL,NULL),(14,'2022-09-23 12:16:48.515209','2022-09-23 12:16:48.515209',13470,'created',1,'Dave','Lumacang',NULL,14,0,NULL,NULL,NULL),(15,'2022-09-23 12:17:07.965157','2022-09-23 12:17:07.965157',13472,'created',1,'Willy','Sabanal',NULL,15,0,NULL,NULL,NULL),(16,'2022-09-26 12:04:02.880257','2022-09-26 12:04:02.880257',13474,'created',1,'Daniel','Jakobsen',NULL,16,0,NULL,NULL,NULL),(17,'2022-09-26 12:04:15.508861','2022-09-26 12:04:15.508861',13476,'created',1,'Kent','Jakobsen',NULL,17,0,NULL,NULL,NULL),(18,'2022-10-18 06:26:20.972727','2022-10-18 06:26:20.972729',13568,'created',1,'bruger','test',NULL,18,0,NULL,NULL,NULL),(19,'2022-10-18 06:26:20.972727','2022-10-18 06:29:28.017471',13568,'removed',2,'bruger','test',NULL,18,0,NULL,NULL,NULL),(20,'2022-09-26 12:04:02.880257','2022-10-18 07:52:40.502333',13474,'created',2,'Daniel','Jakobsen',NULL,16,1,NULL,NULL,NULL),(22,'2022-09-23 12:14:27.125601','2023-02-06 13:27:33.189492',13454,'created',2,'Mike','Formentera',NULL,6,0,NULL,NULL,NULL),(23,'2022-09-21 06:00:56.725618','2023-05-11 11:55:37.314866',13440,'created',2,'a','b',NULL,1,0,NULL,NULL,NULL),(24,'2022-09-21 07:30:25.964680','2023-05-11 11:55:50.136947',13442,'created',2,'c','d',NULL,2,0,NULL,NULL,NULL),(25,'2022-09-23 12:13:22.215458','2023-05-11 11:55:55.539413',13448,'created',2,'e','f',NULL,3,0,NULL,NULL,NULL),(26,'2022-09-23 12:13:55.739392','2023-05-11 11:56:01.523777',13450,'created',2,'g','h',NULL,4,0,NULL,NULL,NULL),(27,'2022-09-23 12:14:12.870443','2023-05-11 11:56:07.623692',13452,'created',2,'i','j',NULL,5,0,NULL,NULL,NULL),(28,'2022-09-23 12:14:27.125601','2023-05-11 11:56:13.114679',13454,'created',3,'k','l',NULL,6,0,NULL,NULL,NULL),(29,'2022-09-23 12:14:43.283661','2023-05-11 11:56:19.152534',13456,'created',2,'m','n',NULL,7,0,NULL,NULL,NULL),(30,'2022-09-23 12:15:00.213899','2023-05-11 11:56:24.719031',13458,'created',2,'o','p',NULL,8,0,NULL,NULL,NULL),(31,'2022-09-23 12:15:21.005129','2023-05-11 11:56:31.145826',13460,'created',2,'r','s',NULL,9,0,NULL,NULL,NULL),(32,'2022-09-23 12:15:21.005129','2023-05-11 11:56:39.982385',13460,'created',3,'q','r',NULL,9,0,NULL,NULL,NULL),(33,'2022-09-23 12:15:38.302122','2023-05-11 11:56:47.541353',13462,'created',2,'s','t',NULL,10,0,NULL,NULL,NULL),(34,'2022-09-23 12:15:54.131293','2023-05-11 11:57:00.721574',13464,'created',2,'u','v',NULL,11,0,NULL,NULL,NULL),(35,'2022-09-23 12:16:08.916472','2023-05-11 11:57:09.256062',13466,'created',2,'w','x',NULL,12,0,NULL,NULL,NULL),(36,'2022-09-23 12:16:26.441776','2023-05-11 11:57:19.194189',13468,'created',2,'y','z',NULL,13,0,NULL,NULL,NULL),(37,'2022-09-23 12:16:48.515209','2023-05-11 11:57:28.994009',13470,'created',2,'aa','ab',NULL,14,0,NULL,NULL,NULL),(38,'2022-09-23 12:17:07.965157','2023-05-11 11:57:36.680905',13472,'created',2,'ac','ad',NULL,15,0,NULL,NULL,NULL),(39,'2022-09-26 12:04:15.508861','2023-05-11 11:57:47.673043',13476,'created',2,'ae','af',NULL,17,0,NULL,NULL,NULL),(40,'2022-09-26 12:04:02.880257','2023-05-11 11:58:45.836433',13474,'created',3,'ae','af',NULL,16,1,NULL,NULL,NULL),(41,'2022-09-26 12:04:15.508861','2023-05-11 11:58:54.215219',13476,'created',3,'ag','ah',NULL,17,0,NULL,NULL,NULL),(42,'2022-10-18 06:26:20.972727','2023-05-11 11:59:40.765504',13568,'removed',3,'ai','aj',NULL,18,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `WorkerVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workers`
--

DROP TABLE IF EXISTS `Workers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Workers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `WorkflowState` varchar(255) DEFAULT NULL,
  `Version` int(11) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `Initials` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmployeeNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PinCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workers`
--

LOCK TABLES `Workers` WRITE;
/*!40000 ALTER TABLE `Workers` DISABLE KEYS */;
INSERT INTO `Workers` VALUES (1,'2022-09-21 06:00:56.725618','2023-05-11 11:55:37.314866',13440,'created',2,'a','b',NULL,0,NULL,NULL,NULL),(2,'2022-09-21 07:30:25.964680','2023-05-11 11:55:50.136947',13442,'created',2,'c','d',NULL,0,NULL,NULL,NULL),(3,'2022-09-23 12:13:22.215458','2023-05-11 11:55:55.539413',13448,'created',2,'e','f',NULL,0,NULL,NULL,NULL),(4,'2022-09-23 12:13:55.739392','2023-05-11 11:56:01.523777',13450,'created',2,'g','h',NULL,0,NULL,NULL,NULL),(5,'2022-09-23 12:14:12.870443','2023-05-11 11:56:07.623692',13452,'created',2,'i','j',NULL,0,NULL,NULL,NULL),(6,'2022-09-23 12:14:27.125601','2023-05-11 11:56:13.114679',13454,'created',3,'k','l',NULL,0,NULL,NULL,NULL),(7,'2022-09-23 12:14:43.283661','2023-05-11 11:56:19.152534',13456,'created',2,'m','n',NULL,0,NULL,NULL,NULL),(8,'2022-09-23 12:15:00.213899','2023-05-11 11:56:24.719031',13458,'created',2,'o','p',NULL,0,NULL,NULL,NULL),(9,'2022-09-23 12:15:21.005129','2023-05-11 11:56:39.982385',13460,'created',3,'q','r',NULL,0,NULL,NULL,NULL),(10,'2022-09-23 12:15:38.302122','2023-05-11 11:56:47.541353',13462,'created',2,'s','t',NULL,0,NULL,NULL,NULL),(11,'2022-09-23 12:15:54.131293','2023-05-11 11:57:00.721574',13464,'created',2,'u','v',NULL,0,NULL,NULL,NULL),(12,'2022-09-23 12:16:08.916472','2023-05-11 11:57:09.256062',13466,'created',2,'w','x',NULL,0,NULL,NULL,NULL),(13,'2022-09-23 12:16:26.441776','2023-05-11 11:57:19.194189',13468,'created',2,'y','z',NULL,0,NULL,NULL,NULL),(14,'2022-09-23 12:16:48.515209','2023-05-11 11:57:28.994009',13470,'created',2,'aa','ab',NULL,0,NULL,NULL,NULL),(15,'2022-09-23 12:17:07.965157','2023-05-11 11:57:36.680905',13472,'created',2,'ac','ad',NULL,0,NULL,NULL,NULL),(16,'2022-09-26 12:04:02.880257','2023-05-11 11:58:45.836433',13474,'created',3,'ae','af',NULL,1,NULL,NULL,NULL),(17,'2022-09-26 12:04:15.508861','2023-05-11 11:58:54.215219',13476,'created',3,'ag','ah',NULL,0,NULL,NULL,NULL),(18,'2022-10-18 06:26:20.972727','2023-05-11 11:59:40.765504',13568,'created',3,'ai','aj',NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Workers` ENABLE KEYS */;
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
INSERT INTO `__EFMigrationsHistory` VALUES ('20180810124416_InitialCreate','6.0.8'),('20190116110009_AddingOriginalId','6.0.8'),('20190315092242_AddingModelseForInsight','6.0.8'),('20190318122928_FixingNamingOfSurveyConfigurationSites','6.0.8'),('20190319130214_AddingMissingForeignKeys','6.0.8'),('20190408081151_AddingFolders','6.0.8'),('20190408084408_AddingMissingParentId','6.0.8'),('20190509074123_RefactoringidtoId','6.0.8'),('20190514053645_RefactoringAttributeNames','6.0.8'),('20190515064952_FixingNamingForFieldValues','6.0.8'),('20190531092007_AddingMissingAIonLogs','6.0.8'),('20190711053344_AddingJasperDocxEnabledAttributesToCheckList','6.0.8'),('20190828054730_AddingNewVersionClasses','6.0.8'),('20190828074017_AddingMissingClasses','6.0.8'),('20190923100451_ChangeStringToInt','6.0.8'),('20190924172326_AddingNewIndexOnCases','6.0.8'),('20200116074236_AddingSiteTaggins','6.0.8'),('20200120093951_CleanupInSight','6.0.8'),('20200120164857_AddingTranslationsToInSight','6.0.8'),('20200120171433_AddingMicrotingUidToInSight','6.0.8'),('20200122103229_ChangingValueToBeStringForAnswerValue','6.0.8'),('20200222140656_AddinDisplayIndexToOptions','6.0.8'),('20200224084023_AddingAttributesToUnits','6.0.8'),('20200224092512_AddingMoreAttributesToUnits','6.0.8'),('20200226182616_MakingNextQuestionIdNullable','6.0.8'),('20200318150742_MakingUnitIdNullableForAnswers','6.0.8'),('20200427095029_AdjustTimeToUTC','6.0.8'),('20200513142551_AddingFolderIdToCasesAndCheckListSites','6.0.8'),('20200617160004_ChangingOptionsIndexToOptionIndex','6.0.8'),('20200620171527_AddingExcelExportEnabledToCheckList','6.0.8'),('20200701101500_LettingSurveyConfigurationIdBeNullable','6.0.8'),('20201116164405_AddingDescriptionToEntityGroup','6.0.8'),('20201130204234_FixingSplitScreen','6.0.8'),('20201220194822_FixingTableColumnNames','6.0.8'),('20201220201427_FixingQuestionSet','6.0.8'),('20201222125152_HugheTableRenaming','6.0.8'),('20201223104631_AddingTranslations','6.0.8'),('20201225165255_FixingBrokenTableNames','6.0.8'),('20201231062732_ChangingDescriptToLanguageCode','6.0.8'),('20210405153325_AddingExtraFieldValues','6.0.8'),('20210407134630_AddingFolderTranslations','6.0.8'),('20210609072417_AddingLinkingOfSitesAndEntities','6.0.8'),('20210730085329_AddingDefaultValueToFieldTranslations','6.0.8'),('20211014105943_CLAttributes','6.0.8'),('20211108111024_AddingIsArchivedToCases','6.0.8'),('20211116085744_AddingDoneAtEditable','6.0.8'),('20220207094729_AddingIsLockedToSiteUnitWorkers','6.0.8'),('20221016081344_AddingIsActiveToLanguage','7.0.0'),('20221129082337_AddingReceivedByServerAtToCases','7.0.0'),('20230506062507_AddingInitialsToWorkers','7.0.5'),('20230607084834_AddingOriginalFileLocationToUploadedData','8.0.6'),('20240619132520_AddPinCodeEmployeeNoToWorker','8.0.6');
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

-- Dump completed on 2024-07-02  7:00:46
