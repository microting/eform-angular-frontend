using eFormCore;
using Microting.eForm.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using EntityGroup = Microting.eForm.Infrastructure.Models.EntityGroup;

// ReSharper disable StringLiteralTypo

namespace WorkOrders.Pn.Helpers
{
    using Infrastructure.Consts;
    using Microting.eForm.Dto;

    public class SeedHelper
    {
        private static async Task<int> CreateTaskAreaList(Core core)
        {
            EntityGroupList model = await core.Advanced_EntityGroupAll(
                "id",
                "eform-angular-work-orders-plugin-editable-TaskArea",
                0, 1, Constants.FieldTypes.EntitySelect,
                false,
                Constants.WorkflowStates.NotRemoved);

            EntityGroup group;

            if (!model.EntityGroups.Any())
            {
                group = await core.EntityGroupCreate(Constants.FieldTypes.EntitySelect,
                    "eform-angular-work-orders-plugin-editable-TaskArea", "Områder");
            }
            else
            {
                group = model.EntityGroups.First();
            }

            return int.Parse(group.MicrotingUUID);
        }

        private static async Task<int> CreateWorkerList(Core core)
        {
            EntityGroupList model = await core.Advanced_EntityGroupAll(
                "id",
                "eform-angular-work-orders-plugin-editable-Worker",
                0, 1, Constants.FieldTypes.EntitySelect,
                false,
                Constants.WorkflowStates.NotRemoved);

            EntityGroup group;

            if (!model.EntityGroups.Any())
            {
                group = await core.EntityGroupCreate(Constants.FieldTypes.EntitySelect,
                    "eform-angular-work-orders-plugin-editable-Worker", "Medarbejdere");
            }
            else
            {
                group = model.EntityGroups.First();
            }
            return int.Parse(group.MicrotingUUID);
        }

        public static async Task<int> CreateNewTaskEform(Core core)
        {

            const string timeZone = "Europe/Copenhagen";
            TimeZoneInfo timeZoneInfo;

            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            }
            catch
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
            }
            int taskAreaListId = await CreateTaskAreaList(core);
            int workerListId = await CreateWorkerList(core);
            Language language = await core.DbContextHelper.GetDbContext().Languages.FirstAsync();

            List<Template_Dto> templatesDto = await core.TemplateItemReadAll(false,
                "",
                "eform-angular-work-orders-plugin-newtask",
                false,
                "",
                new List<int>(),
                timeZoneInfo,
                language
                );

            if (templatesDto.Count > 0)
            {
                return templatesDto.First().Id;
            }

            MainElement newTaskForm = new MainElement
            {
                Id = WorkOrderEformConsts.NewTaskId,
                Repeated = 0,
                Label = "eform-angular-work-orders-plugin-newtask|eform-angular-work-orders-plugin-newtask|eform-angular-work-orders-plugin-newtask",
                StartDate = new DateTime(2020, 09, 14),
                EndDate = new DateTime(2030, 09, 14),
                Language = "da",
                MultiApproval = false,
                FastNavigation = false,
                DisplayOrder = 0,
                EnableQuickSync = true
            };

            List<DataItem> dataItems = new List<DataItem>
            {
                new EntitySelect(
                    371261,
                    false,
                    false,
                    "Opgave område|Task area|Aufgabenbereich",
                    "",
                    Constants.FieldColors.Default,
                    0,
                    false,
                    0,
                    taskAreaListId),
                new EntitySelect(
                    371262,
                    false,
                    false,
                    "Opgave tildelt til|Task assigned to|Zuordnung zugewiesen zu",
                    "",
                    Constants.FieldColors.Default,
                    0,
                    false,
                    0,
                    workerListId),
                new Picture(
                    371263,
                    false,
                    false,
                    "Opgave billede|Picture of task|Aufgabenbild",
                    "",
                    Constants.FieldColors.Default,
                    0,
                    false,
                    0,
                    false
                ),
                new Text(
                    371264,
                    true,
                    false,
                    "Opgave beskrivelse|Description of task|Aufgabenbeschreibung",
                    "",
                    Constants.FieldColors.Default,
                    1,
                    false,
                    "",
                    0,
                    false,
                    false,
                    false,
                    false,
                    ""
                ),
                new Date(
                    371265,
                    true,
                    false,
                    "Opgave udføres senest|Task is performed at the latest|Die Aufgabe wird spätestens ausgeführt",
                    "",
                    Constants.FieldColors.Default,
                    2,
                    false,
                    new DateTime(),
                    new DateTime(),
                    ""
                ),
                new SaveButton(
                    371266,
                    false,
                    false,
                    "Tryk for at oprette opgave|Tap to create task|Tippen Sie hier, um eine Aufgabe zu erstellen",
                    "",
                    Constants.FieldColors.Green,
                    2,
                    false,
                    "Opret opgave|Create task|Aufgabe erstellen"
                )
            };


            DataElement dataElement = new DataElement(
                142108,
                "Ny opgave|New task|Neue Aufgabe",
                0,
                "", // ?
                false,
                false,
                false,
                false,
                "",
                false,
                new List<DataItemGroup>(),
                dataItems);

            newTaskForm.ElementList.Add(dataElement);

            newTaskForm = await core.TemplateUploadData(newTaskForm);
            return await core.TemplateCreate(newTaskForm);
        }

        public static async Task<int> CreateTaskListEform(Core core)
        {
            string timeZone = "Europe/Copenhagen";
            TimeZoneInfo timeZoneInfo;

            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            }
            catch
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
            }

            Language language = await core.DbContextHelper.GetDbContext().Languages.FirstAsync();
            List<Template_Dto> templatesDto = await core.TemplateItemReadAll(false,
                    "",
                    "eform-angular-work-orders-plugin-tasklist",
                    false,
                    "",
                    new List<int>(),
                    timeZoneInfo,
                    language
                    );

            if (templatesDto.Count > 0)
            {
                return templatesDto.First().Id;
            }

            MainElement taskListForm = new MainElement
            {
                Id = WorkOrderEformConsts.TaskListId,
                Repeated = 0,
                Label = "eform-angular-work-orders-plugin-tasklist|eform-angular-work-orders-plugin-tasklist|eform-angular-work-orders-plugin-tasklist",
                StartDate = new DateTime(2020, 09, 14),
                EndDate = new DateTime(2030, 09, 14),
                Language = "da",
                MultiApproval = false,
                FastNavigation = false,
                DisplayOrder = 0,
                EnableQuickSync = true
            };

            List<DataItem> dataItems = new List<DataItem>
            {
                new None(
                    371267,
                    false,
                    false,
                    "Beskrivelse af opgaven|Description of the task|Beschreibung der Aufgabe",
                    "",
                    Constants.FieldColors.Yellow,
                    0,
                    false
                ),
                new ShowPdf(
                    371268,
                    false,
                    false,
                    "Tryk på PDF for at se billeder af opgaven|Click on PDF to see pictures of the task|Klicken Sie auf PDF, um Bilder der Aufgabe zu sehen",
                    "",
                    Constants.FieldColors.Default,
                    1,
                    false,
                    "https://eform.microting.com/app_files/uploads/20200914114927_14937_9fae9a0b11bda418201523437984027c.pdf"
                ),
                new CheckBox(
                    371269,
                    true,
                    false,
                    "Sæt flueben når opgaven er udført|Check the box when the task is completed|Aktivieren Sie das Kontrollkästchen, wenn die Aufgabe abgeschlossen ist",
                    "",
                    Constants.FieldColors.Default,
                    2,
                    false,
                    false,
                    false
                ),
                new Picture(
                    371270,
                    false,
                    false,
                    "Billede af udført opgave|Picture of completed task|Bild der erledigten Aufgabe",
                    "",
                    Constants.FieldColors.Default,
                    3,
                    false,
                    0,
                    false
                ),
                new Text(
                    371271,
                    false,
                    false,
                    "Beskrivelse af udført opgave|Description of completed task|Beschreibung der abgeschlossenen Aufgabe",
                    "",
                    Constants.FieldColors.Default,
                    4,
                    false,
                    "",
                    0,
                    false,
                    false,
                    false,
                    false,
                    ""
                ),
                new SaveButton(
                    371272,
                    false,
                    false,
                    "Tryk for at sende udført opgave|Tap to send completed task|Tippen Sie hier, um die abgeschlossene Aufgabe zu senden",
                    "",
                    Constants.FieldColors.Green,
                    5,
                    false,
                    "Opgave udført|Task completed|Aufgabe erledigt"
                )
            };


            DataElement dataElement = new DataElement(
                142109,
                "Opgave registreret|Task registered|Aufgabe registriert",
                0,
                "",
                false,
                false,
                false,
                false,
                "",
                false,
                new List<DataItemGroup>(),
                dataItems);

            taskListForm.ElementList.Add(dataElement);

            taskListForm = await core.TemplateUploadData(taskListForm);
            return await core.TemplateCreate(taskListForm);
        }
    }
}
