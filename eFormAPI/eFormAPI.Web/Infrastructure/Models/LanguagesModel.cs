using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models;

public class LanguagesModel
{
    public List<LanguageModel> Languages { get; set; }
}

public class LanguageModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string LanguageCode { get; set; }
    public bool IsActive { get; set; }
}