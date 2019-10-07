
using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models
{
    public class EntityGroupList
    {
        public EntityGroupList()
        {
        }

        public EntityGroupList(int numOfElements, int pageNum, List<EntityGroup> entityGroupList)
        {
            this.NumOfElements = numOfElements;
            this.PageNum = pageNum;
            this.EntityGroups = entityGroupList;
        }

        public int NumOfElements { get; set; }

        public int PageNum { get; set; }

        public List<EntityGroup> EntityGroups { get; set; }

        public static implicit operator EntityGroupList(
            Microting.eForm.Infrastructure.Models.EntityGroupList entityGroupList)
        {
            EntityGroupList newEntityGroupList = new EntityGroupList()
            {
                NumOfElements = entityGroupList.NumOfElements,
                PageNum = entityGroupList.PageNum,
                EntityGroups = new List<EntityGroup>()
            };

            foreach (EntityGroup entityGroup in entityGroupList.EntityGroups)
            {
                newEntityGroupList.EntityGroups.Add(entityGroup);
            }

            return newEntityGroupList;
        }
    }
}