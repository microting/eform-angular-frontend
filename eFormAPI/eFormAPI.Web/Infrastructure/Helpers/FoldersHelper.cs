/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System.Runtime.InteropServices;

namespace eFormAPI.Web.Infrastructure.Helpers;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;using Models.Folders;

public static class FoldersHelper
{
    public static IList<FolderDtoModel> BuildTree(this List<FolderDtoModel> source)
    {
        if (source.Any())
        {
            var groups = source.GroupBy(i => i.ParentId);
            var roots = groups.FirstOrDefault(g => g.Key.HasValue == false).ToList();

            if (roots.Count > 0)
            {
                var dict = groups.Where(g => g.Key.HasValue).ToDictionary(g => g.Key.Value, g => g.ToList());
                foreach (var item in roots.OrderBy(x => x.Name))
                {
                    AddChildren(item, dict);
                }
            }
            return roots;
        }
        return new List<FolderDtoModel>();
    }

    private static void AddChildren(FolderDtoModel node, Dictionary<int, List<FolderDtoModel>> source)
    {
        // Speed optimization
        ref var valOrNew = ref CollectionsMarshal.GetValueRefOrAddDefault(source, node.Id, out var exists);

        if (exists)
        {
            node.Children = valOrNew;
            foreach (var t in node.Children.OrderBy(x => x.Name))
            {
                AddChildren(t, source);
            }
        }
        else
        {
            node.Children = new List<FolderDtoModel>();
        }

        // if (source.ContainsKey(node.Id))
        // {
        //     node.Children = source[node.Id];
        //     foreach (var t in node.Children.OrderBy(x => x.Name))
        //     {
        //         AddChildren(t, source);
        //     }
        // }
        // else
        // {
        //     node.Children = new List<FolderDtoModel>();
        // }
    }

    public static async Task DeleteFolder(Core core, MicrotingDbContext sdkDbContext, int id)
    {
        await DeleteChildren(core, sdkDbContext, id);
        await core.FolderDelete(id);
    }

    private static async Task DeleteChildren(Core core, MicrotingDbContext sdkDbContext, int id)
    {
        var folders = await sdkDbContext.Folders.Where(x => x.ParentId == id).ToListAsync();
        foreach (var folder in folders)
        {
            var subFolders = await sdkDbContext.Folders.Where(x => x.ParentId == folder.Id).ToListAsync();
            foreach (var subfolder in subFolders)
            {
                await DeleteChildren(core, sdkDbContext, subfolder.Id);
            }
            await core.FolderDelete(folder.Id);
        }
    }

    public static List<FolderDtoModel> BuildTreeV2(List<FolderDtoModel> source)
    {
        var foldersForReturn = source.Where(x => x.ParentId == null).ToList();
        foreach (var dtoModel in foldersForReturn)
        {
            dtoModel.Children = AddToTree(source.Where(x => x.ParentId != null).ToList(), dtoModel);
        }

        return foldersForReturn;
    }

    private static List<FolderDtoModel> AddToTree(List<FolderDtoModel> source, FolderDtoModel folderDtoModelForAdd)
    {
        folderDtoModelForAdd.Children = source.Where(x => x.ParentId == folderDtoModelForAdd.Id).ToList(); // find children folder
        foreach (var folderDtoModel in folderDtoModelForAdd.Children) // if we have children, check if children also have children
        {
            folderDtoModel.Children = AddToTree(source, folderDtoModel);
        }

        return folderDtoModelForAdd.Children;
    }
}