/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
namespace eFormAPI.Web.Infrastructure.Helpers
{
    using System.Collections.Generic;
    using System.Linq;
    using Models.Folders;

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

        private static void AddChildren(FolderDtoModel node, IDictionary<int, List<FolderDtoModel>> source)
        {
            if (source.ContainsKey(node.Id))
            {
                node.Children = source[node.Id];
                foreach (var t in node.Children.OrderBy(x => x.Name))
                {
                    AddChildren(t, source);
                }
            }
            else
            {
                node.Children = new List<FolderDtoModel>();
            }
        }
    }

}