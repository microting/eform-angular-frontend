/*
 Navicat Premium Data Transfer

 Source Server         : MariaDb
 Source Server Type    : MariaDB
 Source Server Version : 110001 (11.0.1-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : 420_sdk

 Target Server Type    : MariaDB
 Target Server Version : 110001 (11.0.1-MariaDB)
 File Encoding         : 65001

 Date: 08/09/2023 19:34:27
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for __efmigrationshistory
-- ----------------------------
DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE `__efmigrationshistory`  (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`MigrationId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of __efmigrationshistory
-- ----------------------------
INSERT INTO `__efmigrationshistory` VALUES ('20180810124416_InitialCreate', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190116110009_AddingOriginalId', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190315092242_AddingModelseForInsight', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190318122928_FixingNamingOfSurveyConfigurationSites', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190319130214_AddingMissingForeignKeys', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190408081151_AddingFolders', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190408084408_AddingMissingParentId', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190509074123_RefactoringidtoId', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190514053645_RefactoringAttributeNames', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190515064952_FixingNamingForFieldValues', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190531092007_AddingMissingAIonLogs', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190711053344_AddingJasperDocxEnabledAttributesToCheckList', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190828054730_AddingNewVersionClasses', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190828074017_AddingMissingClasses', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190923100451_ChangeStringToInt', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20190924172326_AddingNewIndexOnCases', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200116074236_AddingSiteTaggins', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200120093951_CleanupInSight', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200120164857_AddingTranslationsToInSight', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200120171433_AddingMicrotingUidToInSight', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200122103229_ChangingValueToBeStringForAnswerValue', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200222140656_AddinDisplayIndexToOptions', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200224084023_AddingAttributesToUnits', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200224092512_AddingMoreAttributesToUnits', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200226182616_MakingNextQuestionIdNullable', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200318150742_MakingUnitIdNullableForAnswers', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200427095029_AdjustTimeToUTC', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200513142551_AddingFolderIdToCasesAndCheckListSites', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200617160004_ChangingOptionsIndexToOptionIndex', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200620171527_AddingExcelExportEnabledToCheckList', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20200701101500_LettingSurveyConfigurationIdBeNullable', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201116164405_AddingDescriptionToEntityGroup', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201130204234_FixingSplitScreen', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201220194822_FixingTableColumnNames', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201220201427_FixingQuestionSet', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201222125152_HugheTableRenaming', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201223104631_AddingTranslations', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201225165255_FixingBrokenTableNames', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20201231062732_ChangingDescriptToLanguageCode', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20210405153325_AddingExtraFieldValues', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20210407134630_AddingFolderTranslations', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20210609072417_AddingLinkingOfSitesAndEntities', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20210730085329_AddingDefaultValueToFieldTranslations', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20211014105943_CLAttributes', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20211108111024_AddingIsArchivedToCases', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20211116085744_AddingDoneAtEditable', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20220207094729_AddingIsLockedToSiteUnitWorkers', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20221016081344_AddingIsActiveToLanguage', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20221129082337_AddingReceivedByServerAtToCases', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20230506062507_AddingInitialsToWorkers', '7.0.10');
INSERT INTO `__efmigrationshistory` VALUES ('20230607084834_AddingOriginalFileLocationToUploadedData', '7.0.10');

-- ----------------------------
-- Table structure for answers
-- ----------------------------
DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `UnitId` int(11) NULL DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `AnswerDuration` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NULL DEFAULT NULL,
  `FinishedAt` datetime(6) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `UtcAdjusted` tinyint(1) NOT NULL,
  `TimeZone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_answers_languageId`(`LanguageId`) USING BTREE,
  INDEX `IX_answers_questionSetId`(`QuestionSetId`) USING BTREE,
  INDEX `IX_answers_siteId`(`SiteId`) USING BTREE,
  INDEX `IX_answers_surveyConfigurationId`(`SurveyConfigurationId`) USING BTREE,
  INDEX `IX_answers_unitId`(`UnitId`) USING BTREE,
  CONSTRAINT `FK_answers_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `languages` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_answers_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `questionsets` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_answers_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_answers_survey_configurations_SurveyConfigurationId` FOREIGN KEY (`SurveyConfigurationId`) REFERENCES `surveyconfigurations` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_answers_units_UnitId` FOREIGN KEY (`UnitId`) REFERENCES `units` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of answers
-- ----------------------------

-- ----------------------------
-- Table structure for answervalues
-- ----------------------------
DROP TABLE IF EXISTS `answervalues`;
CREATE TABLE `answervalues`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `AnswerId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_answer_values_answerId`(`AnswerId`) USING BTREE,
  INDEX `IX_answer_values_optionsId`(`OptionId`) USING BTREE,
  INDEX `IX_answer_values_questionId`(`QuestionId`) USING BTREE,
  CONSTRAINT `FK_answer_values_answers_AnswerId` FOREIGN KEY (`AnswerId`) REFERENCES `answers` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_answer_values_options_OptionId` FOREIGN KEY (`OptionId`) REFERENCES `options` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_answer_values_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of answervalues
-- ----------------------------

-- ----------------------------
-- Table structure for answervalueversions
-- ----------------------------
DROP TABLE IF EXISTS `answervalueversions`;
CREATE TABLE `answervalueversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `AnswerId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `AnswerValueId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_answer_value_versions_answerValueId`(`AnswerValueId`) USING BTREE,
  CONSTRAINT `FK_answer_value_versions_answer_values_AnswerValueId` FOREIGN KEY (`AnswerValueId`) REFERENCES `answervalues` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of answervalueversions
-- ----------------------------

-- ----------------------------
-- Table structure for answerversions
-- ----------------------------
DROP TABLE IF EXISTS `answerversions`;
CREATE TABLE `answerversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `UnitId` int(11) NULL DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `AnswerDuration` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NULL DEFAULT NULL,
  `FinishedAt` datetime(6) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `UtcAdjusted` tinyint(1) NOT NULL,
  `TimeZone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `AnswerId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of answerversions
-- ----------------------------

-- ----------------------------
-- Table structure for cases
-- ----------------------------
DROP TABLE IF EXISTS `cases`;
CREATE TABLE `cases`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `Status` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `DoneAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `UnitId` int(11) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `MicrotingCheckUid` int(11) NULL DEFAULT NULL,
  `CaseUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue6` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue7` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue8` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue9` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue10` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FolderId` int(11) NULL DEFAULT NULL,
  `IsArchived` tinyint(1) NOT NULL DEFAULT 0,
  `DoneAtUserModifiable` datetime(6) NULL DEFAULT NULL,
  `ReceivedByServerAt` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_cases_check_list_id`(`CheckListId`) USING BTREE,
  INDEX `IX_cases_done_by_user_id`(`WorkerId`) USING BTREE,
  INDEX `IX_cases_site_id`(`SiteId`) USING BTREE,
  INDEX `IX_cases_unit_id`(`UnitId`) USING BTREE,
  INDEX `IX_cases_CheckListId`(`CheckListId`) USING BTREE,
  INDEX `IX_cases_MicrotingUid_MicrotingCheckUid`(`MicrotingUid`, `MicrotingCheckUid`) USING BTREE,
  INDEX `IX_cases_FolderId`(`FolderId`) USING BTREE,
  CONSTRAINT `FK_cases_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `checklists` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_cases_folders_FolderId` FOREIGN KEY (`FolderId`) REFERENCES `folders` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_cases_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_cases_units_UnitId` FOREIGN KEY (`UnitId`) REFERENCES `units` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_cases_workers_WorkerId` FOREIGN KEY (`WorkerId`) REFERENCES `workers` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cases
-- ----------------------------

-- ----------------------------
-- Table structure for caseversions
-- ----------------------------
DROP TABLE IF EXISTS `caseversions`;
CREATE TABLE `caseversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CaseId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `Status` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `DoneAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `UnitId` int(11) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `MicrotingCheckUid` int(11) NULL DEFAULT NULL,
  `CaseUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue6` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue7` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue8` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue9` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldValue10` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FolderId` int(11) NULL DEFAULT NULL,
  `IsArchived` tinyint(1) NOT NULL DEFAULT 0,
  `DoneAtUserModifiable` datetime(6) NULL DEFAULT NULL,
  `ReceivedByServerAt` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of caseversions
-- ----------------------------

-- ----------------------------
-- Table structure for checklists
-- ----------------------------
DROP TABLE IF EXISTS `checklists`;
CREATE TABLE `checklists`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ParentId` int(11) NULL DEFAULT NULL,
  `Repeated` int(11) NULL DEFAULT NULL,
  `DisplayIndex` int(11) NULL DEFAULT NULL,
  `CaseType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FolderName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReviewEnabled` smallint(6) NULL DEFAULT NULL,
  `ManualSync` smallint(6) NULL DEFAULT NULL,
  `ExtraFieldsEnabled` smallint(6) NULL DEFAULT NULL,
  `DoneButtonEnabled` smallint(6) NULL DEFAULT NULL,
  `ApprovalEnabled` smallint(6) NULL DEFAULT NULL,
  `MultiApproval` smallint(6) NULL DEFAULT NULL,
  `FastNavigation` smallint(6) NULL DEFAULT NULL,
  `DownloadEntities` smallint(6) NULL DEFAULT NULL,
  `Field1` int(11) NULL DEFAULT NULL,
  `Field2` int(11) NULL DEFAULT NULL,
  `Field3` int(11) NULL DEFAULT NULL,
  `Field4` int(11) NULL DEFAULT NULL,
  `Field5` int(11) NULL DEFAULT NULL,
  `Field6` int(11) NULL DEFAULT NULL,
  `Field7` int(11) NULL DEFAULT NULL,
  `Field8` int(11) NULL DEFAULT NULL,
  `Field9` int(11) NULL DEFAULT NULL,
  `Field10` int(11) NULL DEFAULT NULL,
  `QuickSyncEnabled` smallint(6) NULL DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `DocxExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `JasperExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ExcelExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ReportH1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `IsEditable` tinyint(1) NOT NULL DEFAULT 1,
  `IsHidden` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `IsAchievable` tinyint(1) NOT NULL DEFAULT 0,
  `IsDoneAtEditable` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklists
-- ----------------------------
INSERT INTO `checklists` VALUES (1, 'created', 2, '2023-09-08 16:12:40.580238', '2023-09-08 16:12:41.502739', NULL, NULL, NULL, NULL, 1, 3164, '', 'Storebælt - Skinneudtræk 2 mdr.', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '12', NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0);
INSERT INTO `checklists` VALUES (2, 'created', 1, '2023-09-08 16:17:41.747532', '2023-09-08 16:17:41.747532', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, 0, 0, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0);
INSERT INTO `checklists` VALUES (3, 'created', 1, '2023-09-08 16:17:41.758081', '2023-09-08 16:17:41.758081', NULL, NULL, NULL, 2, NULL, 0, NULL, NULL, 0, NULL, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0);
INSERT INTO `checklists` VALUES (4, 'created', 1, '2023-09-08 16:17:50.845837', '2023-09-08 16:17:50.845837', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, 0, 0, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0);
INSERT INTO `checklists` VALUES (5, 'created', 1, '2023-09-08 16:17:50.854568', '2023-09-08 16:17:50.854568', NULL, NULL, NULL, 4, NULL, 0, NULL, NULL, 0, NULL, 0, 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0);

-- ----------------------------
-- Table structure for checklistsites
-- ----------------------------
DROP TABLE IF EXISTS `checklistsites`;
CREATE TABLE `checklistsites`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LastCheckId` int(11) NOT NULL,
  `FolderId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_check_list_sites_check_list_id`(`CheckListId`) USING BTREE,
  INDEX `IX_check_list_sites_site_id`(`SiteId`) USING BTREE,
  INDEX `IX_check_list_sites_FolderId`(`FolderId`) USING BTREE,
  CONSTRAINT `FK_check_list_sites_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `checklists` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_check_list_sites_folders_FolderId` FOREIGN KEY (`FolderId`) REFERENCES `folders` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_check_list_sites_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklistsites
-- ----------------------------

-- ----------------------------
-- Table structure for checklistsiteversions
-- ----------------------------
DROP TABLE IF EXISTS `checklistsiteversions`;
CREATE TABLE `checklistsiteversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CheckListSiteId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LastCheckId` int(11) NOT NULL,
  `FolderId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklistsiteversions
-- ----------------------------

-- ----------------------------
-- Table structure for checklisttranslations
-- ----------------------------
DROP TABLE IF EXISTS `checklisttranslations`;
CREATE TABLE `checklisttranslations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `CheckListId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_CheckLisTranslations_CheckListId`(`CheckListId`) USING BTREE,
  CONSTRAINT `FK_CheckLisTranslations_CheckLists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `checklists` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklisttranslations
-- ----------------------------
INSERT INTO `checklisttranslations` VALUES (1, 2, 'created', '2023-09-08 16:12:40.737027', '2023-09-08 16:17:32.063045', 1, 1, 'test eForm 1', NULL);
INSERT INTO `checklisttranslations` VALUES (2, 1, 'created', '2023-09-08 16:17:41.765527', '2023-09-08 16:17:41.765527', 2, 1, 'test eForm 2', NULL);
INSERT INTO `checklisttranslations` VALUES (3, 1, 'created', '2023-09-08 16:17:41.772171', '2023-09-08 16:17:41.772171', 3, 1, 'test eForm 2', NULL);
INSERT INTO `checklisttranslations` VALUES (4, 1, 'created', '2023-09-08 16:17:41.779037', '2023-09-08 16:17:41.779037', 2, 2, 'test eForm 2', NULL);
INSERT INTO `checklisttranslations` VALUES (5, 1, 'created', '2023-09-08 16:17:41.785802', '2023-09-08 16:17:41.785802', 3, 2, 'test eForm 2', NULL);
INSERT INTO `checklisttranslations` VALUES (6, 1, 'created', '2023-09-08 16:17:41.792636', '2023-09-08 16:17:41.792636', 2, 3, NULL, NULL);
INSERT INTO `checklisttranslations` VALUES (7, 1, 'created', '2023-09-08 16:17:41.799356', '2023-09-08 16:17:41.799356', 3, 3, NULL, NULL);
INSERT INTO `checklisttranslations` VALUES (8, 1, 'created', '2023-09-08 16:17:50.861991', '2023-09-08 16:17:50.861991', 4, 1, 'test eForm 3', NULL);
INSERT INTO `checklisttranslations` VALUES (9, 1, 'created', '2023-09-08 16:17:50.868925', '2023-09-08 16:17:50.868925', 5, 1, 'test eForm 3', NULL);
INSERT INTO `checklisttranslations` VALUES (10, 1, 'created', '2023-09-08 16:17:50.875720', '2023-09-08 16:17:50.875720', 4, 2, 'test eForm 3', NULL);
INSERT INTO `checklisttranslations` VALUES (11, 1, 'created', '2023-09-08 16:17:50.882558', '2023-09-08 16:17:50.882558', 5, 2, 'test eForm 3', NULL);
INSERT INTO `checklisttranslations` VALUES (12, 1, 'created', '2023-09-08 16:17:50.889610', '2023-09-08 16:17:50.889610', 4, 3, NULL, NULL);
INSERT INTO `checklisttranslations` VALUES (13, 1, 'created', '2023-09-08 16:17:50.896552', '2023-09-08 16:17:50.896552', 5, 3, NULL, NULL);

-- ----------------------------
-- Table structure for checklisttranslationversions
-- ----------------------------
DROP TABLE IF EXISTS `checklisttranslationversions`;
CREATE TABLE `checklisttranslationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `CheckListId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CheckListTranslationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklisttranslationversions
-- ----------------------------

-- ----------------------------
-- Table structure for checklistvalues
-- ----------------------------
DROP TABLE IF EXISTS `checklistvalues`;
CREATE TABLE `checklistvalues`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `UserId` int(11) NULL DEFAULT NULL,
  `CaseId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `CheckListDuplicateId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklistvalues
-- ----------------------------

-- ----------------------------
-- Table structure for checklistvalueversions
-- ----------------------------
DROP TABLE IF EXISTS `checklistvalueversions`;
CREATE TABLE `checklistvalueversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CheckListValueId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `UserId` int(11) NULL DEFAULT NULL,
  `CaseId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `CheckListDuplicateId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklistvalueversions
-- ----------------------------

-- ----------------------------
-- Table structure for checklistversions
-- ----------------------------
DROP TABLE IF EXISTS `checklistversions`;
CREATE TABLE `checklistversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ParentId` int(11) NULL DEFAULT NULL,
  `Repeated` int(11) NULL DEFAULT NULL,
  `DisplayIndex` int(11) NULL DEFAULT NULL,
  `CaseType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FolderName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReviewEnabled` smallint(6) NULL DEFAULT NULL,
  `ManualSync` smallint(6) NULL DEFAULT NULL,
  `ExtraFieldsEnabled` smallint(6) NULL DEFAULT NULL,
  `DoneButtonEnabled` smallint(6) NULL DEFAULT NULL,
  `ApprovalEnabled` smallint(6) NULL DEFAULT NULL,
  `MultiApproval` smallint(6) NULL DEFAULT NULL,
  `FastNavigation` smallint(6) NULL DEFAULT NULL,
  `DownloadEntities` smallint(6) NULL DEFAULT NULL,
  `Field1` int(11) NULL DEFAULT NULL,
  `Field2` int(11) NULL DEFAULT NULL,
  `Field3` int(11) NULL DEFAULT NULL,
  `Field4` int(11) NULL DEFAULT NULL,
  `Field5` int(11) NULL DEFAULT NULL,
  `Field6` int(11) NULL DEFAULT NULL,
  `Field7` int(11) NULL DEFAULT NULL,
  `Field8` int(11) NULL DEFAULT NULL,
  `Field9` int(11) NULL DEFAULT NULL,
  `Field10` int(11) NULL DEFAULT NULL,
  `QuickSyncEnabled` smallint(6) NULL DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Color` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `DocxExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `JasperExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ExcelExportEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `ReportH1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH3` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH4` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ReportH5` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `IsEditable` tinyint(1) NOT NULL DEFAULT 1,
  `IsHidden` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `IsAchievable` tinyint(1) NOT NULL DEFAULT 0,
  `IsDoneAtEditable` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checklistversions
-- ----------------------------

-- ----------------------------
-- Table structure for entitygroups
-- ----------------------------
DROP TABLE IF EXISTS `entitygroups`;
CREATE TABLE `entitygroups`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Editable` tinyint(1) NOT NULL DEFAULT 0,
  `Locked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of entitygroups
-- ----------------------------
INSERT INTO `entitygroups` VALUES (1, 'created', 2, '2023-09-08 16:19:34.217486', '2023-09-08 16:19:34.262215', '129560', 'Device users', 'EntitySelect', '', 0, 1);
INSERT INTO `entitygroups` VALUES (2, 'created', 2, '2023-09-08 16:19:34.275975', '2023-09-08 16:19:34.286190', '497770', 'Device users', 'EntitySearch', '', 0, 1);

-- ----------------------------
-- Table structure for entitygroupversions
-- ----------------------------
DROP TABLE IF EXISTS `entitygroupversions`;
CREATE TABLE `entitygroupversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `EntityGroupId` int(11) NOT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Editable` tinyint(1) NOT NULL DEFAULT 0,
  `Locked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of entitygroupversions
-- ----------------------------

-- ----------------------------
-- Table structure for entityitems
-- ----------------------------
DROP TABLE IF EXISTS `entityitems`;
CREATE TABLE `entityitems`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `EntityGroupId` int(11) NULL DEFAULT NULL,
  `EntityItemUid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Synced` smallint(6) NULL DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of entityitems
-- ----------------------------
INSERT INTO `entityitems` VALUES (1, 'created', 1, '2023-09-08 16:19:34.391639', '2023-09-08 16:19:34.391639', 1, '1', '799877', 'site 1', '', 0, 0);
INSERT INTO `entityitems` VALUES (2, 'created', 1, '2023-09-08 16:19:34.449507', '2023-09-08 16:19:34.449507', 2, '1', '131671', 'site 1', '', 0, 0);
INSERT INTO `entityitems` VALUES (3, 'created', 1, '2023-09-08 16:19:41.722768', '2023-09-08 16:19:41.722768', 1, '2', '154837', 'site 2', '', 0, 0);
INSERT INTO `entityitems` VALUES (4, 'created', 1, '2023-09-08 16:19:41.735792', '2023-09-08 16:19:41.735792', 2, '2', '141844', 'site 2', '', 0, 0);
INSERT INTO `entityitems` VALUES (5, 'created', 1, '2023-09-08 16:19:49.524359', '2023-09-08 16:19:49.524359', 1, '3', '776815', 'site 3', '', 0, 0);
INSERT INTO `entityitems` VALUES (6, 'created', 1, '2023-09-08 16:19:49.538947', '2023-09-08 16:19:49.538947', 2, '3', '632087', 'site 3', '', 0, 0);

-- ----------------------------
-- Table structure for entityitemversions
-- ----------------------------
DROP TABLE IF EXISTS `entityitemversions`;
CREATE TABLE `entityitemversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `EntityItemId` int(11) NOT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `EntityGroupId` int(11) NULL DEFAULT NULL,
  `EntityItemUid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Synced` smallint(6) NULL DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of entityitemversions
-- ----------------------------

-- ----------------------------
-- Table structure for extrafieldvalues
-- ----------------------------
DROP TABLE IF EXISTS `extrafieldvalues`;
CREATE TABLE `extrafieldvalues`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `DoneAt` datetime(6) NULL DEFAULT NULL,
  `Date` datetime(6) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `CaseId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `CheckListDuplicateId` int(11) NULL DEFAULT NULL,
  `CheckListValueId` int(11) NULL DEFAULT NULL,
  `UploadedDataId` int(11) NULL DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Latitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Longitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Altitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Accuracy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldTypeId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of extrafieldvalues
-- ----------------------------

-- ----------------------------
-- Table structure for extrafieldvalueversions
-- ----------------------------
DROP TABLE IF EXISTS `extrafieldvalueversions`;
CREATE TABLE `extrafieldvalueversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `ExtraFieldValueId` int(11) NOT NULL,
  `DoneAt` datetime(6) NULL DEFAULT NULL,
  `Date` datetime(6) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `CaseId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `CheckListDuplicateId` int(11) NULL DEFAULT NULL,
  `CheckListValueId` int(11) NULL DEFAULT NULL,
  `UploadedDataId` int(11) NULL DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Latitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Longitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Altitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Accuracy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldTypeId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of extrafieldvalueversions
-- ----------------------------

-- ----------------------------
-- Table structure for fieldoptions
-- ----------------------------
DROP TABLE IF EXISTS `fieldoptions`;
CREATE TABLE `fieldoptions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `Key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Selected` tinyint(1) NOT NULL,
  `DisplayOrder` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_FieldOptions_FieldId`(`FieldId`) USING BTREE,
  CONSTRAINT `FK_FieldOptions_Fields_FieldId` FOREIGN KEY (`FieldId`) REFERENCES `fields` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldoptions
-- ----------------------------

-- ----------------------------
-- Table structure for fieldoptiontranslations
-- ----------------------------
DROP TABLE IF EXISTS `fieldoptiontranslations`;
CREATE TABLE `fieldoptiontranslations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FieldOptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_FieldOptionTranslations_FieldOptionId`(`FieldOptionId`) USING BTREE,
  CONSTRAINT `FK_FieldOptionTranslations_FieldOptions_FieldOptionId` FOREIGN KEY (`FieldOptionId`) REFERENCES `fieldoptions` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldoptiontranslations
-- ----------------------------

-- ----------------------------
-- Table structure for fieldoptiontranslationversions
-- ----------------------------
DROP TABLE IF EXISTS `fieldoptiontranslationversions`;
CREATE TABLE `fieldoptiontranslationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FieldOptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldOptionTranslationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldoptiontranslationversions
-- ----------------------------

-- ----------------------------
-- Table structure for fieldoptionversions
-- ----------------------------
DROP TABLE IF EXISTS `fieldoptionversions`;
CREATE TABLE `fieldoptionversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `Key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Selected` tinyint(1) NOT NULL,
  `DisplayOrder` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldOptionId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldoptionversions
-- ----------------------------

-- ----------------------------
-- Table structure for fields
-- ----------------------------
DROP TABLE IF EXISTS `fields`;
CREATE TABLE `fields`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `ParentFieldId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `FieldTypeId` int(11) NULL DEFAULT NULL,
  `Mandatory` smallint(6) NULL DEFAULT NULL,
  `ReadOnly` smallint(6) NULL DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `DisplayIndex` int(11) NULL DEFAULT NULL,
  `Dummy` smallint(6) NULL DEFAULT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UnitName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MinValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MaxValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MaxLength` int(11) NULL DEFAULT NULL,
  `DecimalCount` int(11) NULL DEFAULT NULL,
  `Multi` int(11) NULL DEFAULT NULL,
  `Optional` smallint(6) NULL DEFAULT NULL,
  `Selected` smallint(6) NULL DEFAULT NULL,
  `Split` smallint(6) NULL DEFAULT NULL,
  `GeolocationEnabled` smallint(6) NULL DEFAULT NULL,
  `GeolocationForced` smallint(6) NULL DEFAULT NULL,
  `GeolocationHidden` smallint(6) NULL DEFAULT NULL,
  `StopOnSave` smallint(6) NULL DEFAULT NULL,
  `IsNum` smallint(6) NULL DEFAULT NULL,
  `BarcodeEnabled` smallint(6) NULL DEFAULT NULL,
  `BarcodeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `QueryType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `KeyValuePairList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `EntityGroupId` int(11) NULL DEFAULT NULL,
  `parentid` int(11) NULL DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_fields_check_list_id`(`CheckListId`) USING BTREE,
  INDEX `IX_fields_field_type_id`(`FieldTypeId`) USING BTREE,
  INDEX `IX_fields_parentid`(`parentid`) USING BTREE,
  INDEX `FK_fields_fields_ParentFieldId`(`ParentFieldId`) USING BTREE,
  CONSTRAINT `FK_fields_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `checklists` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_fields_field_types_FieldTypeId` FOREIGN KEY (`FieldTypeId`) REFERENCES `fieldtypes` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_fields_fields_ParentFieldId` FOREIGN KEY (`ParentFieldId`) REFERENCES `fields` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fields
-- ----------------------------

-- ----------------------------
-- Table structure for fieldtranslations
-- ----------------------------
DROP TABLE IF EXISTS `fieldtranslations`;
CREATE TABLE `fieldtranslations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UploadedDataId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_FieldTranslations_FieldId`(`FieldId`) USING BTREE,
  CONSTRAINT `FK_FieldTranslations_Fields_FieldId` FOREIGN KEY (`FieldId`) REFERENCES `fields` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldtranslations
-- ----------------------------

-- ----------------------------
-- Table structure for fieldtranslationversions
-- ----------------------------
DROP TABLE IF EXISTS `fieldtranslationversions`;
CREATE TABLE `fieldtranslationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FieldId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FieldTranslationId` int(11) NOT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UploadedDataId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 73 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldtranslationversions
-- ----------------------------

-- ----------------------------
-- Table structure for fieldtypes
-- ----------------------------
DROP TABLE IF EXISTS `fieldtypes`;
CREATE TABLE `fieldtypes`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldtypes
-- ----------------------------
INSERT INTO `fieldtypes` VALUES (1, 'Text', 'Simple text field');
INSERT INTO `fieldtypes` VALUES (2, 'Number', 'Simple number field');
INSERT INTO `fieldtypes` VALUES (3, 'None', 'Simple text to be displayed');
INSERT INTO `fieldtypes` VALUES (4, 'CheckBox', 'Simple check box field');
INSERT INTO `fieldtypes` VALUES (5, 'Picture', 'Simple picture field');
INSERT INTO `fieldtypes` VALUES (6, 'Audio', 'Simple audio field');
INSERT INTO `fieldtypes` VALUES (7, 'Movie', 'Simple movie field');
INSERT INTO `fieldtypes` VALUES (8, 'SingleSelect', 'Single selection list');
INSERT INTO `fieldtypes` VALUES (9, 'Comment', 'Simple comment field');
INSERT INTO `fieldtypes` VALUES (10, 'MultiSelect', 'Simple multi select list');
INSERT INTO `fieldtypes` VALUES (11, 'Date', 'Date selection');
INSERT INTO `fieldtypes` VALUES (12, 'Signature', 'Simple signature field');
INSERT INTO `fieldtypes` VALUES (13, 'Timer', 'Simple timer field');
INSERT INTO `fieldtypes` VALUES (14, 'EntitySearch', 'Autofilled searchable items field');
INSERT INTO `fieldtypes` VALUES (15, 'EntitySelect', 'Autofilled single selection list');
INSERT INTO `fieldtypes` VALUES (16, 'ShowPdf', 'Show PDF');
INSERT INTO `fieldtypes` VALUES (17, 'FieldGroup', 'Field group');
INSERT INTO `fieldtypes` VALUES (18, 'SaveButton', 'Save eForm');
INSERT INTO `fieldtypes` VALUES (19, 'NumberStepper', 'Number stepper field');

-- ----------------------------
-- Table structure for fieldvalues
-- ----------------------------
DROP TABLE IF EXISTS `fieldvalues`;
CREATE TABLE `fieldvalues`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `DoneAt` datetime(6) NULL DEFAULT NULL,
  `Date` datetime(6) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `CaseId` int(11) NULL DEFAULT NULL,
  `FieldId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `CheckListDuplicateId` int(11) NULL DEFAULT NULL,
  `UploadedDataId` int(11) NULL DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Latitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Longitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Altitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Accuracy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_field_values_check_list_id`(`CheckListId`) USING BTREE,
  INDEX `IX_field_values_field_id`(`FieldId`) USING BTREE,
  INDEX `IX_field_values_uploaded_data_id`(`UploadedDataId`) USING BTREE,
  INDEX `IX_field_values_user_id`(`WorkerId`) USING BTREE,
  INDEX `IX_field_values_UploadedDataId`(`UploadedDataId`) USING BTREE,
  CONSTRAINT `FK_field_values_uploaded_datas_UploadedDataId` FOREIGN KEY (`UploadedDataId`) REFERENCES `uploadeddatas` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldvalues
-- ----------------------------

-- ----------------------------
-- Table structure for fieldvalueversions
-- ----------------------------
DROP TABLE IF EXISTS `fieldvalueversions`;
CREATE TABLE `fieldvalueversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FieldValueId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `DoneAt` datetime(6) NULL DEFAULT NULL,
  `Date` datetime(6) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `CaseId` int(11) NULL DEFAULT NULL,
  `FieldId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `CheckListDuplicateId` int(11) NULL DEFAULT NULL,
  `UploadedDataId` int(11) NULL DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Latitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Longitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Altitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Heading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Accuracy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldvalueversions
-- ----------------------------

-- ----------------------------
-- Table structure for fieldversions
-- ----------------------------
DROP TABLE IF EXISTS `fieldversions`;
CREATE TABLE `fieldversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `FieldId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `ParentFieldId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `FieldTypeId` int(11) NULL DEFAULT NULL,
  `Mandatory` smallint(6) NULL DEFAULT NULL,
  `ReadOnly` smallint(6) NULL DEFAULT NULL,
  `Label` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `DisplayIndex` int(11) NULL DEFAULT NULL,
  `Dummy` smallint(6) NULL DEFAULT NULL,
  `DefaultValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UnitName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MinValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MaxValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MaxLength` int(11) NULL DEFAULT NULL,
  `DecimalCount` int(11) NULL DEFAULT NULL,
  `Multi` int(11) NULL DEFAULT NULL,
  `Optional` smallint(6) NULL DEFAULT NULL,
  `Selected` smallint(6) NULL DEFAULT NULL,
  `Split` smallint(6) NULL DEFAULT NULL,
  `GeolocationEnabled` smallint(6) NULL DEFAULT NULL,
  `GeolocationForced` smallint(6) NULL DEFAULT NULL,
  `GeolocationHidden` smallint(6) NULL DEFAULT NULL,
  `StopOnSave` smallint(6) NULL DEFAULT NULL,
  `IsNum` smallint(6) NULL DEFAULT NULL,
  `BarcodeEnabled` smallint(6) NULL DEFAULT NULL,
  `BarcodeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `QueryType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `KeyValuePairList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Custom` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `EntityGroupId` int(11) NULL DEFAULT NULL,
  `OriginalId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fieldversions
-- ----------------------------

-- ----------------------------
-- Table structure for folders
-- ----------------------------
DROP TABLE IF EXISTS `folders`;
CREATE TABLE `folders`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `ParentId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_folders_parentid`(`ParentId`) USING BTREE,
  CONSTRAINT `FK_folders_folders_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `folders` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folders
-- ----------------------------
INSERT INTO `folders` VALUES (1, 2, 'created', '2023-09-08 16:16:29.669268', '2023-09-08 16:16:29.723792', NULL, NULL, 720272, NULL);
INSERT INTO `folders` VALUES (2, 2, 'created', '2023-09-08 16:16:35.824441', '2023-09-08 16:16:35.832929', NULL, NULL, 155945, NULL);
INSERT INTO `folders` VALUES (3, 2, 'created', '2023-09-08 16:16:40.962896', '2023-09-08 16:16:40.971025', NULL, NULL, 195541, NULL);

-- ----------------------------
-- Table structure for foldertranslations
-- ----------------------------
DROP TABLE IF EXISTS `foldertranslations`;
CREATE TABLE `foldertranslations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `FolderId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_FolderTranslations_FolderId`(`FolderId`) USING BTREE,
  INDEX `IX_FolderTranslations_LanguageId`(`LanguageId`) USING BTREE,
  CONSTRAINT `FK_FolderTranslations_Folders_FolderId` FOREIGN KEY (`FolderId`) REFERENCES `folders` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_FolderTranslations_Languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `languages` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 82 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of foldertranslations
-- ----------------------------
INSERT INTO `foldertranslations` VALUES (1, 1, 'created', '2023-09-08 16:16:29.739367', '2023-09-08 16:16:29.739367', 'testFolder1', '<div><b><s>test</s></b><i><s>Folder</s></i><u><s>1</s></u></div>', 0, 1, 1);
INSERT INTO `foldertranslations` VALUES (2, 1, 'created', '2023-09-08 16:16:29.780856', '2023-09-08 16:16:29.780856', '', '', 0, 2, 1);
INSERT INTO `foldertranslations` VALUES (3, 1, 'created', '2023-09-08 16:16:35.841899', '2023-09-08 16:16:35.841900', 'testFolder2', '', 0, 1, 2);
INSERT INTO `foldertranslations` VALUES (4, 1, 'created', '2023-09-08 16:16:35.851111', '2023-09-08 16:16:35.851111', '', '', 0, 2, 2);
INSERT INTO `foldertranslations` VALUES (5, 1, 'created', '2023-09-08 16:16:40.980291', '2023-09-08 16:16:40.980291', 'testFolder3', '', 0, 1, 3);
INSERT INTO `foldertranslations` VALUES (6, 1, 'created', '2023-09-08 16:16:40.989583', '2023-09-08 16:16:40.989583', '', '', 0, 2, 3);

-- ----------------------------
-- Table structure for foldertranslationversions
-- ----------------------------
DROP TABLE IF EXISTS `foldertranslationversions`;
CREATE TABLE `foldertranslationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `FolderId` int(11) NOT NULL,
  `FolderTranslationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 82 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of foldertranslationversions
-- ----------------------------

-- ----------------------------
-- Table structure for folderversions
-- ----------------------------
DROP TABLE IF EXISTS `folderversions`;
CREATE TABLE `folderversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `FolderId` int(11) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `ParentId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folderversions
-- ----------------------------

-- ----------------------------
-- Table structure for languagequestionsets
-- ----------------------------
DROP TABLE IF EXISTS `languagequestionsets`;
CREATE TABLE `languagequestionsets`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `LanguageId` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_LanguageQuestionSets_LanguageId`(`LanguageId`) USING BTREE,
  INDEX `IX_LanguageQuestionSets_QuestionSetId`(`QuestionSetId`) USING BTREE,
  CONSTRAINT `FK_LanguageQuestionSets_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `languages` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_LanguageQuestionSets_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `questionsets` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of languagequestionsets
-- ----------------------------

-- ----------------------------
-- Table structure for languagequestionsetversions
-- ----------------------------
DROP TABLE IF EXISTS `languagequestionsetversions`;
CREATE TABLE `languagequestionsetversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `LanguageId` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `LanguageQuestionSetId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_LanguageQuestionSetVersions_LanguageQuestionSetId`(`LanguageQuestionSetId`) USING BTREE,
  CONSTRAINT `FK_LanguageQuestionSetVersions_LanguageQuestionSets_LanguageQue~` FOREIGN KEY (`LanguageQuestionSetId`) REFERENCES `languagequestionsets` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of languagequestionsetversions
-- ----------------------------

-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LanguageCode` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of languages
-- ----------------------------
INSERT INTO `languages` VALUES (1, 1, 'created', '2023-09-08 15:50:06.881250', '2023-09-08 15:50:06.881331', 'Dansk', 'da', 1);
INSERT INTO `languages` VALUES (2, 1, 'created', '2023-09-08 15:50:06.939903', '2023-09-08 15:50:06.939903', 'English', 'en-US', 1);

-- ----------------------------
-- Table structure for languageversions
-- ----------------------------
DROP TABLE IF EXISTS `languageversions`;
CREATE TABLE `languageversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LanguageCode` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LanguageId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_language_versions_languageId`(`LanguageId`) USING BTREE,
  CONSTRAINT `FK_language_versions_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `languages` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of languageversions
-- ----------------------------

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `Transmission` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `NotificationUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Stacktrace` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for notificationversions
-- ----------------------------
DROP TABLE IF EXISTS `notificationversions`;
CREATE TABLE `notificationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `Transmission` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `NotificationUid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Stacktrace` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NOT NULL,
  `NotificationId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notificationversions
-- ----------------------------

-- ----------------------------
-- Table structure for options
-- ----------------------------
DROP TABLE IF EXISTS `options`;
CREATE TABLE `options`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `NextQuestionId` int(11) NULL DEFAULT NULL,
  `Weight` int(11) NOT NULL,
  `WeightValue` int(11) NOT NULL,
  `ContinuousOptionId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionIndex` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_options_questionId`(`QuestionId`) USING BTREE,
  CONSTRAINT `FK_options_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of options
-- ----------------------------

-- ----------------------------
-- Table structure for optiontranslations
-- ----------------------------
DROP TABLE IF EXISTS `optiontranslations`;
CREATE TABLE `optiontranslations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `OptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_OptionTranslations_LanguageId`(`LanguageId`) USING BTREE,
  INDEX `IX_OptionTranslations_OptionId`(`OptionId`) USING BTREE,
  CONSTRAINT `FK_OptionTranslations_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `languages` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_OptionTranslations_options_OptionId` FOREIGN KEY (`OptionId`) REFERENCES `options` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of optiontranslations
-- ----------------------------

-- ----------------------------
-- Table structure for optiontranslationversions
-- ----------------------------
DROP TABLE IF EXISTS `optiontranslationversions`;
CREATE TABLE `optiontranslationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `OptionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `OptionTranslationId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of optiontranslationversions
-- ----------------------------

-- ----------------------------
-- Table structure for optionversions
-- ----------------------------
DROP TABLE IF EXISTS `optionversions`;
CREATE TABLE `optionversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `NextQuestionId` int(11) NULL DEFAULT NULL,
  `Weight` int(11) NOT NULL,
  `WeightValue` int(11) NOT NULL,
  `ContinuousOptionId` int(11) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `OptionIndex` int(11) NOT NULL,
  `OptionId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `DisplayIndex` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_option_versions_optionId`(`OptionId`) USING BTREE,
  CONSTRAINT `FK_option_versions_options_OptionId` FOREIGN KEY (`OptionId`) REFERENCES `options` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of optionversions
-- ----------------------------

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `QuestionType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Minimum` int(11) NOT NULL,
  `Maximum` int(11) NOT NULL,
  `Type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `RefId` int(11) NOT NULL,
  `QuestionIndex` int(11) NOT NULL,
  `Image` tinyint(1) NOT NULL,
  `ContinuousQuestionId` int(11) NOT NULL,
  `ImagePosition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Prioritised` tinyint(1) NOT NULL,
  `BackButtonEnabled` tinyint(1) NOT NULL,
  `FontSize` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MinDuration` int(11) NOT NULL,
  `MaxDuration` int(11) NOT NULL,
  `ValidDisplay` tinyint(1) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_questions_questionSetId`(`QuestionSetId`) USING BTREE,
  CONSTRAINT `FK_questions_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `questionsets` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questions
-- ----------------------------

-- ----------------------------
-- Table structure for questionsets
-- ----------------------------
DROP TABLE IF EXISTS `questionsets`;
CREATE TABLE `questionsets`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `HasChild` tinyint(1) NOT NULL,
  `PossiblyDeployed` tinyint(1) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `Share` tinyint(1) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questionsets
-- ----------------------------

-- ----------------------------
-- Table structure for questionsetversions
-- ----------------------------
DROP TABLE IF EXISTS `questionsetversions`;
CREATE TABLE `questionsetversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `HasChild` tinyint(1) NOT NULL,
  `PossiblyDeployed` tinyint(1) NOT NULL,
  `ParentId` int(11) NOT NULL,
  `Share` tinyint(1) NOT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_question_set_versions_questionSetId`(`QuestionSetId`) USING BTREE,
  CONSTRAINT `FK_question_set_versions_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `questionsets` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questionsetversions
-- ----------------------------

-- ----------------------------
-- Table structure for questiontranslations
-- ----------------------------
DROP TABLE IF EXISTS `questiontranslations`;
CREATE TABLE `questiontranslations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `QuestionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_QuestionTranslations_LanguageId`(`LanguageId`) USING BTREE,
  INDEX `IX_QuestionTranslations_QuestionId`(`QuestionId`) USING BTREE,
  CONSTRAINT `FK_QuestionTranslations_languages_LanguageId` FOREIGN KEY (`LanguageId`) REFERENCES `languages` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_QuestionTranslations_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questiontranslations
-- ----------------------------

-- ----------------------------
-- Table structure for questiontranslationversions
-- ----------------------------
DROP TABLE IF EXISTS `questiontranslationversions`;
CREATE TABLE `questiontranslationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `QuestionId` int(11) NOT NULL,
  `LanguageId` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `QuestionTranslationId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_QuestionTranslationVersions_QuestionTranslationId`(`QuestionTranslationId`) USING BTREE,
  CONSTRAINT `FK_QuestionTranslationVersions_QuestionTranslations_QuestionTra~` FOREIGN KEY (`QuestionTranslationId`) REFERENCES `questiontranslations` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questiontranslationversions
-- ----------------------------

-- ----------------------------
-- Table structure for questionversions
-- ----------------------------
DROP TABLE IF EXISTS `questionversions`;
CREATE TABLE `questionversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `QuestionSetId` int(11) NOT NULL,
  `QuestionType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Minimum` int(11) NOT NULL,
  `Maximum` int(11) NOT NULL,
  `Type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `RefId` int(11) NOT NULL,
  `QuestionIndex` int(11) NOT NULL,
  `Image` tinyint(1) NOT NULL,
  `ContinuousQuestionId` int(11) NOT NULL,
  `ImagePosition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Prioritised` tinyint(1) NOT NULL,
  `BackButtonEnabled` tinyint(1) NOT NULL,
  `FontSize` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MinDuration` int(11) NOT NULL,
  `MaxDuration` int(11) NOT NULL,
  `ValidDisplay` tinyint(1) NOT NULL,
  `QuestionId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_question_versions_questionId`(`QuestionId`) USING BTREE,
  CONSTRAINT `FK_question_versions_questions_QuestionId` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questionversions
-- ----------------------------

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ChangedByName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Version` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of settings
-- ----------------------------
INSERT INTO `settings` VALUES (1, 'firstRunDone', 'true', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (2, 'logLevel', '4', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (3, 'logLimit', '25000', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (4, 'knownSitesDone', 'true', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (5, 'fileLocationPicture', '/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/picture/', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (6, 'fileLocationPdf', '/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/pdf/', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (7, 'fileLocationJasper', '/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/output/datafolder/reports/', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (8, 'token', 'abc1234567890abc1234567890abcdef', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (9, 'comAddressBasic', 'https://basic.microting.com', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (10, 'comAddressApi', 'http://srv05.microting.com', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (11, 'comAddressPdfUpload', 'https://srv16.microting.com', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (12, 'comOrganizationId', '64856189', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (13, 'awsAccessKeyId', '3T98EGIO4Y9H8W2', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (14, 'awsSecretAccessKey', '098u34098uergijt3098w', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (15, 'awsEndPoint', 'https://sqs.eu-central-1.amazonaws.com/564456879978/', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (16, 'unitLicenseNumber', '55', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (17, 'httpServerAddress', 'http://localhost:3000', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (18, 'maxParallelism', '1', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (19, 'numberOfWorkers', '1', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (20, 'comSpeechToText', 'https://srv16.microting.com', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (21, 'swiftEnabled', 'False', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (22, 'swiftUserName', 'eformsdk', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (23, 'swiftPassword', 'eformsdktosecretpassword', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (24, 'swiftEndPoint', 'http://172.16.4.4:8080/swift/v1', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (25, 'keystoneEndPoint', 'http://172.16.4.4:5000/v2.0', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (26, 'customerNo', '420', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (27, 's3Enabled', 'False', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (28, 's3AccessKeyId', 'XXX', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (29, 's3SecrectAccessKey', 'XXX', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (30, 's3Endpoint', 'https://s3.eu-central-1.amazonaws.com', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (31, 's3BucketName', 'microting-uploaded-data', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (32, 'rabbitMqUser', 'admin', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (33, 'rabbitMqPassword', 'password', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (34, 'rabbitMqHost', 'my-rabbit', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (35, 'translationsMigrated', '2.0', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (36, 'pluginsEnabled', 'none', NULL, NULL, NULL, 0);
INSERT INTO `settings` VALUES (37, 'servicesEnabled', 'none', NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for settingversions
-- ----------------------------
DROP TABLE IF EXISTS `settingversions`;
CREATE TABLE `settingversions`  (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ChangedByName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Version` int(11) NOT NULL,
  `SettingId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of settingversions
-- ----------------------------

-- ----------------------------
-- Table structure for sites
-- ----------------------------
DROP TABLE IF EXISTS `sites`;
CREATE TABLE `sites`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LanguageId` int(11) NOT NULL DEFAULT 0,
  `SearchableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `SelectableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sites
-- ----------------------------
INSERT INTO `sites` VALUES (1, '2023-09-08 16:19:34.315975', '2023-09-08 16:19:34.458141', 'site 1', 711237, 2, 'created', 1, 2, 1, 0);
INSERT INTO `sites` VALUES (2, '2023-09-08 16:19:41.708182', '2023-09-08 16:19:41.743018', 'site 2', 149946, 2, 'created', 1, 4, 3, 0);
INSERT INTO `sites` VALUES (3, '2023-09-08 16:19:49.511383', '2023-09-08 16:19:49.546338', 'site 3', 700642, 2, 'created', 1, 6, 5, 0);

-- ----------------------------
-- Table structure for sitesurveyconfigurations
-- ----------------------------
DROP TABLE IF EXISTS `sitesurveyconfigurations`;
CREATE TABLE `sitesurveyconfigurations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_site_survey_configurations_siteId`(`SiteId`) USING BTREE,
  INDEX `IX_site_survey_configurations_surveyConfigurationId`(`SurveyConfigurationId`) USING BTREE,
  CONSTRAINT `FK_site_survey_configurations_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_site_survey_configurations_survey_configurations_SurveyConfi~` FOREIGN KEY (`SurveyConfigurationId`) REFERENCES `surveyconfigurations` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sitesurveyconfigurations
-- ----------------------------

-- ----------------------------
-- Table structure for sitesurveyconfigurationversions
-- ----------------------------
DROP TABLE IF EXISTS `sitesurveyconfigurationversions`;
CREATE TABLE `sitesurveyconfigurationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NOT NULL,
  `SiteSurveyConfigurationId` int(11) NOT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_site_survey_configuration_versions_siteSurveyConfigurationId`(`SiteSurveyConfigurationId`) USING BTREE,
  CONSTRAINT `FK_site_survey_configuration_versions_site_survey_configuration~` FOREIGN KEY (`SiteSurveyConfigurationId`) REFERENCES `sitesurveyconfigurations` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sitesurveyconfigurationversions
-- ----------------------------

-- ----------------------------
-- Table structure for sitetags
-- ----------------------------
DROP TABLE IF EXISTS `sitetags`;
CREATE TABLE `sitetags`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `TagId` int(11) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_SiteTags_SiteId`(`SiteId`) USING BTREE,
  INDEX `IX_SiteTags_TagId`(`TagId`) USING BTREE,
  CONSTRAINT `FK_SiteTags_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_SiteTags_tags_TagId` FOREIGN KEY (`TagId`) REFERENCES `tags` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sitetags
-- ----------------------------

-- ----------------------------
-- Table structure for sitetagversions
-- ----------------------------
DROP TABLE IF EXISTS `sitetagversions`;
CREATE TABLE `sitetagversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `TagId` int(11) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `SiteTagId` int(11) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sitetagversions
-- ----------------------------

-- ----------------------------
-- Table structure for siteversions
-- ----------------------------
DROP TABLE IF EXISTS `siteversions`;
CREATE TABLE `siteversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `LanguageId` int(11) NOT NULL DEFAULT 0,
  `SearchableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `SelectableEntityItemId` int(11) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of siteversions
-- ----------------------------

-- ----------------------------
-- Table structure for siteworkers
-- ----------------------------
DROP TABLE IF EXISTS `siteworkers`;
CREATE TABLE `siteworkers`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SiteId` int(11) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_site_workers_site_id`(`SiteId`) USING BTREE,
  INDEX `IX_site_workers_worker_id`(`WorkerId`) USING BTREE,
  CONSTRAINT `FK_site_workers_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_site_workers_workers_WorkerId` FOREIGN KEY (`WorkerId`) REFERENCES `workers` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of siteworkers
-- ----------------------------
INSERT INTO `siteworkers` VALUES (1, 1, 1, 192064, 1, 'created', '2023-09-08 16:19:34.654557', '2023-09-08 16:19:34.654557');
INSERT INTO `siteworkers` VALUES (2, 2, 2, 202235, 1, 'created', '2023-09-08 16:19:41.790091', '2023-09-08 16:19:41.790091');
INSERT INTO `siteworkers` VALUES (3, 3, 3, 185973, 1, 'created', '2023-09-08 16:19:49.596011', '2023-09-08 16:19:49.596011');

-- ----------------------------
-- Table structure for siteworkerversions
-- ----------------------------
DROP TABLE IF EXISTS `siteworkerversions`;
CREATE TABLE `siteworkerversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `SiteId` int(11) NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteWorkerId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of siteworkerversions
-- ----------------------------

-- ----------------------------
-- Table structure for surveyconfigurations
-- ----------------------------
DROP TABLE IF EXISTS `surveyconfigurations`;
CREATE TABLE `surveyconfigurations`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Start` datetime(6) NOT NULL,
  `Stop` datetime(6) NOT NULL,
  `TimeToLive` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `TimeOut` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL DEFAULT 0,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_survey_configurations_QuestionSetId`(`QuestionSetId`) USING BTREE,
  CONSTRAINT `FK_survey_configurations_question_sets_QuestionSetId` FOREIGN KEY (`QuestionSetId`) REFERENCES `questionsets` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of surveyconfigurations
-- ----------------------------

-- ----------------------------
-- Table structure for surveyconfigurationversions
-- ----------------------------
DROP TABLE IF EXISTS `surveyconfigurationversions`;
CREATE TABLE `surveyconfigurationversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Start` datetime(6) NOT NULL,
  `Stop` datetime(6) NOT NULL,
  `TimeToLive` int(11) NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `TimeOut` int(11) NOT NULL,
  `SurveyConfigurationId` int(11) NOT NULL,
  `QuestionSetId` int(11) NOT NULL DEFAULT 0,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_survey_configuration_versions_surveyConfigurationId`(`SurveyConfigurationId`) USING BTREE,
  CONSTRAINT `FK_survey_configuration_versions_survey_configurations_SurveyCo~` FOREIGN KEY (`SurveyConfigurationId`) REFERENCES `surveyconfigurations` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of surveyconfigurationversions
-- ----------------------------

-- ----------------------------
-- Table structure for taggings
-- ----------------------------
DROP TABLE IF EXISTS `taggings`;
CREATE TABLE `taggings`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TagId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `TaggerId` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_taggings_check_list_id`(`CheckListId`) USING BTREE,
  INDEX `IX_taggings_tag_id`(`TagId`) USING BTREE,
  CONSTRAINT `FK_taggings_check_lists_CheckListId` FOREIGN KEY (`CheckListId`) REFERENCES `checklists` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_taggings_tags_TagId` FOREIGN KEY (`TagId`) REFERENCES `tags` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of taggings
-- ----------------------------

-- ----------------------------
-- Table structure for taggingversions
-- ----------------------------
DROP TABLE IF EXISTS `taggingversions`;
CREATE TABLE `taggingversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `TagId` int(11) NULL DEFAULT NULL,
  `CheckListId` int(11) NULL DEFAULT NULL,
  `TaggerId` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `TaggingId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of taggingversions
-- ----------------------------

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `TaggingsCount` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tags
-- ----------------------------

-- ----------------------------
-- Table structure for tagversions
-- ----------------------------
DROP TABLE IF EXISTS `tagversions`;
CREATE TABLE `tagversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `TaggingsCount` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `TagId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tagversions
-- ----------------------------

-- ----------------------------
-- Table structure for units
-- ----------------------------
DROP TABLE IF EXISTS `units`;
CREATE TABLE `units`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `OtpCode` int(11) NULL DEFAULT NULL,
  `CustomerNo` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `Manufacturer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Model` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `OsVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `eFormVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `InSightVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Os` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LastIp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LeftMenuEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `PushEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SeparateFetchSend` tinyint(1) NOT NULL DEFAULT 0,
  `SerialNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `SyncDefaultDelay` int(11) NOT NULL DEFAULT 0,
  `SyncDelayEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SyncDelayPrCheckList` int(11) NOT NULL DEFAULT 0,
  `SyncDialog` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_units_site_id`(`SiteId`) USING BTREE,
  CONSTRAINT `FK_units_sites_SiteId` FOREIGN KEY (`SiteId`) REFERENCES `sites` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of units
-- ----------------------------
INSERT INTO `units` VALUES (1, 178001, 129380, 420, 1, 'created', '2023-09-08 16:19:34.481777', '2023-09-08 16:19:34.481777', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, 0, 0);
INSERT INTO `units` VALUES (2, 193409, 211679, 420, 1, 'created', '2023-09-08 16:19:41.754696', '2023-09-08 16:19:41.754697', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, 0, 0);
INSERT INTO `units` VALUES (3, 166409, 138353, 420, 1, 'created', '2023-09-08 16:19:49.560706', '2023-09-08 16:19:49.560707', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 0, 0, 0, 0, 0);

-- ----------------------------
-- Table structure for unitversions
-- ----------------------------
DROP TABLE IF EXISTS `unitversions`;
CREATE TABLE `unitversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `MicrotingUid` int(11) NULL DEFAULT NULL,
  `OtpCode` int(11) NULL DEFAULT NULL,
  `CustomerNo` int(11) NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UnitId` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `SiteId` int(11) NULL DEFAULT NULL,
  `Manufacturer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Model` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `OsVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `eFormVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `InSightVersion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Os` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LastIp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LeftMenuEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `PushEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SeparateFetchSend` tinyint(1) NOT NULL DEFAULT 0,
  `SerialNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `SyncDefaultDelay` int(11) NOT NULL DEFAULT 0,
  `SyncDelayEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `SyncDelayPrCheckList` int(11) NOT NULL DEFAULT 0,
  `SyncDialog` tinyint(1) NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of unitversions
-- ----------------------------

-- ----------------------------
-- Table structure for uploadeddatas
-- ----------------------------
DROP TABLE IF EXISTS `uploadeddatas`;
CREATE TABLE `uploadeddatas`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `UploaderId` int(11) NULL DEFAULT NULL,
  `Checksum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Extension` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CurrentFile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UploaderType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FileLocation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ExpirationDate` datetime(6) NULL DEFAULT NULL,
  `Local` smallint(6) NULL DEFAULT NULL,
  `TranscriptionId` int(11) NULL DEFAULT NULL,
  `OriginalFileLocation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of uploadeddatas
-- ----------------------------

-- ----------------------------
-- Table structure for uploadeddataversions
-- ----------------------------
DROP TABLE IF EXISTS `uploadeddataversions`;
CREATE TABLE `uploadeddataversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UploadedDataId` int(11) NULL DEFAULT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `UploaderId` int(11) NULL DEFAULT NULL,
  `Checksum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Extension` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CurrentFile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `UploaderType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FileLocation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ExpirationDate` datetime(6) NULL DEFAULT NULL,
  `Local` smallint(6) NULL DEFAULT NULL,
  `TranscriptionId` int(11) NULL DEFAULT NULL,
  `OriginalFileLocation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of uploadeddataversions
-- ----------------------------

-- ----------------------------
-- Table structure for workers
-- ----------------------------
DROP TABLE IF EXISTS `workers`;
CREATE TABLE `workers`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `FirstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `Initials` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of workers
-- ----------------------------
INSERT INTO `workers` VALUES (1, '2023-09-08 16:19:34.577692', '2023-09-08 16:19:34.577692', 759283, 'created', 1, 'site', '1', NULL, 0, NULL);
INSERT INTO `workers` VALUES (2, '2023-09-08 16:19:41.770529', '2023-09-08 16:19:41.770529', 546106, 'created', 1, 'site', '2', NULL, 0, NULL);
INSERT INTO `workers` VALUES (3, '2023-09-08 16:19:49.572272', '2023-09-08 16:19:49.572272', 134322, 'created', 1, 'site', '3', NULL, 0, NULL);

-- ----------------------------
-- Table structure for workerversions
-- ----------------------------
DROP TABLE IF EXISTS `workerversions`;
CREATE TABLE `workerversions`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NULL DEFAULT NULL,
  `UpdatedAt` datetime(6) NULL DEFAULT NULL,
  `MicrotingUid` int(11) NOT NULL,
  `WorkflowState` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Version` int(11) NULL DEFAULT NULL,
  `FirstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `WorkerId` int(11) NULL DEFAULT NULL,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `Initials` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of workerversions
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
