using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class StatByMonth
    {
        
//        public List<KeyValuePair<string, List<KeyValuePair<string, int>>>> StatByMonthListData1 
//            = new List<KeyValuePair<string, List<KeyValuePair<string, int>>>>();
        public List<Period> StatByMonthListData1 = new List<Period>();
        public List<Period> StatByMonthListData2 = new List<Period>();
//        public List<List<object>> StatByMonthListData3 = new List<List<object>>();
//
        public StatByMonth()
        {
//            StatByMonthListData1 = new List<KeyValuePair<string, List<KeyValuePair<string, int>>>>();
            StatByMonthListData1 = new List<Period>();
            StatByMonthListData2 = new List<Period>();
//            StatByMonthListData3 = new List<List<object>>();
        }
    }

    public class Period
    {
        public string Name;
        public List<SeriesObject> Series = new List<SeriesObject>();
    }

    public class SeriesObject
    {
        public string Name;
        public double Value;
    }
}