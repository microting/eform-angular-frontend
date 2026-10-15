using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.VisualEformEditor;
using eFormAPI.Web.Services.Eform;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eForm.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services.Eform;

/// <summary>
/// Issue #8141: on a MariaDB Galera cluster (auto_increment_increment=3) the SDK lookup
/// tables are seeded with ids 3, 6, 9, ... instead of 1..20 / 1,2,3. The visual editor API
/// speaks the positional field-type enum the Angular client uses (Text=1 ... ShowPicture=20),
/// so the service must translate between that enum and the tenant's DB ids by FieldType.Type
/// name, never by assuming the ids line up.
/// </summary>
[TestFixture]
public class EFormVisualEditorServiceShiftedLookupIdsTests
{
    private static readonly string ConnectionString =
        ShiftedLookupIdsSdkDatabase.ConnectionStringFor("eform-8141-visual-editor-tests");

    // Client-side enum values (eform-client/src/app/common/const/eform-field-types.ts).
    private const int SingleSelectEnum = 8;
    private const int CommentEnum = 9;
    private const int TextEnum = 1;
    private const int FieldGroupEnum = 17;

    // Fresh-Galera DB ids (see ShiftedLookupIdsSdkDatabase).
    private const int SingleSelectDbId = 24;
    private const int CommentDbId = 27;
    private const int TextDbId = 3;
    private const int FieldGroupDbId = 51;
    private static readonly int DanishDbId = ShiftedLookupIdsSdkDatabase.DanishLanguageId;

    private MicrotingDbContext _sdkDbContext;
    private EFormVisualEditorService _service;

    [OneTimeSetUp]
    public Task CreateShiftedSdkDatabase() => ShiftedLookupIdsSdkDatabase.CreateAsync(ConnectionString);

    [SetUp]
    public void Setup()
    {
        var core = new Core { DbContextHelper = new DbContextHelper(ConnectionString) };
        var coreHelper = Substitute.For<IEFormCoreService>();
        coreHelper.GetCore().Returns(core);

        _service = new EFormVisualEditorService(
            coreHelper,
            Substitute.For<ILogger<EFormVisualEditorService>>(),
            Substitute.For<ILocalizationService>());

        _sdkDbContext = ShiftedLookupIdsSdkDatabase.Open(ConnectionString);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _sdkDbContext.DisposeAsync();
    }

    private static List<TranslationWithDefaultValue> Danish(string name) =>
        new() { new TranslationWithDefaultValue { LanguageId = DanishDbId, Name = name, Description = "" } };

    private static VisualEditorFields SingleSelectField(string name) => new()
    {
        FieldType = SingleSelectEnum,
        Position = 0,
        Color = "e8eaf6",
        Translations = Danish(name),
        Options = new List<FieldOptions>
        {
            new()
            {
                Key = 1,
                DisplayOrder = 1,
                Translates = new List<CommonTranslationsModel>
                    { new() { LanguageId = DanishDbId, Name = "Ja" } }
            }
        }
    };

    private async Task<int> CreateEformWithFields(string eformName, params VisualEditorFields[] fields)
    {
        var result = await _service.CreateVisualTemplate(new EformVisualEditorCreateModel
        {
            Translations = new List<CommonTranslationsModel>
                { new() { LanguageId = DanishDbId, Name = eformName, Description = "" } },
            Fields = fields.ToList()
        });
        Assert.That(result.Success, Is.True, result.Message);

        return await _sdkDbContext.CheckLists
            .Where(x => x.ParentId == null)
            .Where(x => x.Translations.Any(t => t.Text == eformName))
            .Select(x => x.Id)
            .SingleAsync();
    }

    private async Task<Field> SingleFieldOf(int eformId) =>
        await _sdkDbContext.Fields
            .AsNoTracking()
            .Include(x => x.FieldOptions)
            .SingleAsync(x => x.CheckList.ParentId == eformId);

    /// <summary>Writes a field straight to the SDK tables, by DB id, the way it sits on a tenant.</summary>
    private async Task StoreFieldDirectly(int eformId, int fieldTypeDbId)
    {
        var innerChecklistId = await _sdkDbContext.CheckLists
            .Where(x => x.ParentId == eformId).Select(x => x.Id).SingleAsync();
        var stored = new Field
        {
            CheckListId = innerChecklistId,
            FieldTypeId = fieldTypeDbId,
            DisplayIndex = 0,
            Color = "e8eaf6",
            Mandatory = 0
        };
        await stored.Create(_sdkDbContext);
        await new FieldTranslation { FieldId = stored.Id, LanguageId = DanishDbId, Text = "Vælg" }
            .Create(_sdkDbContext);
    }

    [Test]
    public async Task CreateVisualTemplate_SingleSelectEnum_StoresTheSingleSelectDbId()
    {
        var eformId = await CreateEformWithFields("create-single-select", SingleSelectField("Vælg"));

        var field = await SingleFieldOf(eformId);
        Assert.That(field.FieldTypeId, Is.EqualTo(SingleSelectDbId));
        Assert.That(field.FieldOptions, Has.Count.EqualTo(1));
    }

    [Test]
    public async Task ReadVisualTemplate_FieldStoredWithSingleSelectDbId_ReturnsSingleSelectEnum()
    {
        var eformId = await CreateEformWithFields("read-single-select");
        await StoreFieldDirectly(eformId, SingleSelectDbId);

        var result = await _service.ReadVisualTemplate(eformId);

        Assert.That(result.Success, Is.True, result.Message);
        Assert.That(result.Model.Fields.Single().FieldType, Is.EqualTo(SingleSelectEnum));
    }

    [Test]
    public async Task UpdateVisualTemplate_ChangeFieldToCommentEnum_StoresTheCommentDbId()
    {
        var eformId = await CreateEformWithFields("update-to-comment");
        await StoreFieldDirectly(eformId, SingleSelectDbId);
        var read = (await _service.ReadVisualTemplate(eformId)).Model;
        var existing = read.Fields.Single();

        var result = await _service.UpdateVisualTemplate(new EformVisualEditorUpdateModel
        {
            Checklist = read,
            FieldForUpdate = new List<VisualEditorFields>
            {
                new()
                {
                    Id = existing.Id,
                    FieldType = CommentEnum,
                    Position = 0,
                    Color = existing.Color,
                    Translations = existing.Translations
                }
            }
        });

        Assert.That(result.Success, Is.True, result.Message);
        var field = await SingleFieldOf(eformId);
        Assert.That(field.FieldTypeId, Is.EqualTo(CommentDbId));
    }

    [Test]
    public async Task UpdateVisualTemplate_NewSingleSelectEnumField_StoresTheSingleSelectDbId()
    {
        var eformId = await CreateEformWithFields("update-add-single-select");
        var read = (await _service.ReadVisualTemplate(eformId)).Model;
        var newField = SingleSelectField("Ny");
        newField.ChecklistId = read.Id!.Value;

        var result = await _service.UpdateVisualTemplate(new EformVisualEditorUpdateModel
        {
            Checklist = read,
            FieldForCreate = new List<VisualEditorFields> { newField }
        });

        Assert.That(result.Success, Is.True, result.Message);
        var field = await SingleFieldOf(eformId);
        Assert.That(field.FieldTypeId, Is.EqualTo(SingleSelectDbId));
    }

    [Test]
    public async Task UpdateVisualTemplate_NewChecklistWithFieldGroupEnum_StoresGroupAndChildByDbIds()
    {
        var eformId = await CreateEformWithFields("update-new-checklist-group");
        var read = (await _service.ReadVisualTemplate(eformId)).Model;
        var group = new VisualEditorFields
        {
            TempId = 5001, FieldType = FieldGroupEnum, Position = 0, Color = "e8eaf6",
            Translations = Danish("Gruppe")
        };
        var child = new VisualEditorFields
        {
            TempId = 5002, ParentFieldId = 5001, FieldType = TextEnum, Position = 0, Color = "e8eaf6",
            Translations = Danish("Tekst i gruppe")
        };

        var result = await _service.UpdateVisualTemplate(new EformVisualEditorUpdateModel
        {
            Checklist = read,
            ChecklistForCreate = new List<EformVisualEditorModel>
            {
                new()
                {
                    TempId = 7001,
                    ParentChecklistId = read.Id,
                    Translations = new List<CommonTranslationsModel>
                        { new() { LanguageId = DanishDbId, Name = "Ny tjekliste", Description = "" } }
                }
            },
            FieldForCreate = new List<VisualEditorFields> { group, child }
        });

        Assert.That(result.Success, Is.True, result.Message);
        var stored = await _sdkDbContext.Fields.AsNoTracking()
            .Where(x => x.CheckList.ParentId == read.Id)
            .ToListAsync();
        var storedGroup = stored.Single(x => x.ParentFieldId == null);
        var storedChild = stored.Single(x => x.ParentFieldId != null);
        Assert.That(storedGroup.FieldTypeId, Is.EqualTo(FieldGroupDbId));
        Assert.That(storedChild.FieldTypeId, Is.EqualTo(TextDbId));
        Assert.That(storedChild.ParentFieldId, Is.EqualTo(storedGroup.Id));
    }
}
