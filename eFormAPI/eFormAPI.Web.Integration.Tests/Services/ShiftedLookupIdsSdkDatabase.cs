using System.Threading.Tasks;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eForm.Infrastructure.Factories;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Integration.Tests.Services;

/// <summary>
/// An SDK database whose lookup rows carry the ids a fresh MariaDB Galera install gives them
/// (auto_increment_increment=3, issue #8141): FieldTypes Text=3, Number=6 ... ShowPicture=60 and
/// Languages Dansk=3, English=6, Deutsch=9. No row has the "classic" id 1.
/// </summary>
public static class ShiftedLookupIdsSdkDatabase
{
    public static int DanishLanguageId => 3;
    public static int EnglishLanguageId => 6;
    public static int GermanLanguageId => 9;

    // Same order the SDK seeds them in, so the DB id is (index + 1) * 3.
    public static readonly string[] FieldTypeNamesInSeedOrder =
    {
        Constants.FieldTypes.Text, Constants.FieldTypes.Number, Constants.FieldTypes.None,
        Constants.FieldTypes.CheckBox, Constants.FieldTypes.Picture, Constants.FieldTypes.Audio,
        Constants.FieldTypes.Movie, Constants.FieldTypes.SingleSelect, Constants.FieldTypes.Comment,
        Constants.FieldTypes.MultiSelect, Constants.FieldTypes.Date, Constants.FieldTypes.Signature,
        Constants.FieldTypes.Timer, Constants.FieldTypes.EntitySearch, Constants.FieldTypes.EntitySelect,
        Constants.FieldTypes.ShowPdf, Constants.FieldTypes.FieldGroup, Constants.FieldTypes.SaveButton,
        Constants.FieldTypes.NumberStepper, Constants.FieldTypes.ShowPicture,
    };

    public static string ConnectionStringFor(string databaseName) =>
        $"Server = 127.0.0.1; port = 3306; Database = {databaseName}; user = root; password = secretpassword; Convert Zero Datetime = true;";

    public static MicrotingDbContext Open(string connectionString) =>
        new MicrotingDbContextFactory().CreateDbContext(new[] { connectionString });

    /// <summary>Drops and recreates the test database, then seeds the shifted lookup rows.</summary>
    public static async Task CreateAsync(string connectionString)
    {
        await using var db = Open(connectionString);
        await db.Database.EnsureDeletedAsync();
        await db.Database.MigrateAsync();

        for (var i = 0; i < FieldTypeNamesInSeedOrder.Length; i++)
        {
            await new FieldType
            {
                Id = (i + 1) * 3,
                Type = FieldTypeNamesInSeedOrder[i],
                Description = FieldTypeNamesInSeedOrder[i]
            }.Create(db);
        }

        await new Language { Id = DanishLanguageId, Name = "Dansk", LanguageCode = "da" }.Create(db);
        await new Language { Id = EnglishLanguageId, Name = "English", LanguageCode = "en-US" }.Create(db);
        await new Language { Id = GermanLanguageId, Name = "Deutsch", LanguageCode = "de-DE" }.Create(db);
    }
}
