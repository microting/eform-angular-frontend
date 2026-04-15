import {DashboardTestItemEditModel} from '../InsightDashboard-DashboardEdit.page';

export const dashboardStackedBarItems: DashboardTestItemEditModel[] = [
  {
    firstQuestion: 'Q1',
    firstQuestionForSelect: '1 - Q1',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Vandret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [],
    comparedItems: []
  },
  {
    firstQuestion: 'Q2',
    firstQuestionForSelect: '2 - Q2',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Lodret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [8],
    comparedItems: []
  },
  {
    firstQuestion: 'Q3',
    firstQuestionForSelect: '3 - Q3',
    filterQuestionForSelect: '',
    filterQuestion: '',
    filterAnswer: '',
    period: 'Uge',
    chartType: 'Lodret Stablet Søjlediagram',
    calculateAverage: false,
    ignoredAnswerIds: [14],
    comparedItems: []
  }
];

export const dashboardStackedBarDataJson = {
  'id': 17,
  'dashboardName': 'Stacked Bar',
  'surveyName': 'Test-Set',
  'surveyId': 1,
  'locationName': null,
  'locationId': null,
  'tagName': 'Total',
  'tagId': 1,
  'answerDates': {
    'dateFrom': '2016-01-01T00:00:00',
    'dateTo': '2020-12-02T23:59:59',
    'today': true
  },
  'items': [
    {
      'id': 41,
      'firstQuestionName': 'Q1',
      'firstQuestionType': 'list',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 1,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 6,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 1,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 80,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 20,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 70,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 30,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 90,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 10,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 66.67,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 33.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 75,
                'dataCount': 12,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 25,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 44,
                'dataCount': 11,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 56,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 72.22,
                'dataCount': 13,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 27.78,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 56.25,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 43.75,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 78.26,
                'dataCount': 18,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 21.74,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 67.86,
                'dataCount': 19,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 32.14,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 73.08,
                'dataCount': 19,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 26.92,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 81.82,
                'dataCount': 18,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 18.18,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 66.67,
                'dataCount': 20,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 33.33,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_01',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Nej',
                'value': 100,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 75,
                'dataCount': 15,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 25,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 75.86,
                'dataCount': 22,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 24.14,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 82.14,
                'dataCount': 23,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 17.86,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 69.7,
                'dataCount': 23,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 30.3,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 76.92,
                'dataCount': 20,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 23.08,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 100,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 85.71,
                'dataCount': 24,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 14.29,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 86.67,
                'dataCount': 13,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 13.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 66.67,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 33.33,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 86.67,
                'dataCount': 26,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 13.33,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 83.33,
                'dataCount': 50,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 16.67,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Ja',
                'value': 95.45,
                'dataCount': 21,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Nej',
                'value': 4.55,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_01',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Ja',
                    'percents': [
                      80,
                      70,
                      90,
                      66.67,
                      75,
                      44,
                      72.22,
                      56.25,
                      78.26,
                      67.86,
                      73.08,
                      81.82,
                      66.67,
                      0,
                      75,
                      75.86,
                      82.14,
                      69.7,
                      76.92,
                      100,
                      85.71,
                      86.67,
                      66.67,
                      86.67,
                      83.33,
                      95.45
                    ],
                    'amounts': [
                      8,
                      7,
                      9,
                      4,
                      12,
                      11,
                      13,
                      9,
                      18,
                      19,
                      19,
                      18,
                      20,
                      0,
                      15,
                      22,
                      23,
                      23,
                      20,
                      5,
                      24,
                      13,
                      10,
                      26,
                      50,
                      21
                    ]
                  },
                  {
                    'valueName': 'Nej',
                    'percents': [
                      20,
                      30,
                      10,
                      33.33,
                      25,
                      56,
                      27.78,
                      43.75,
                      21.74,
                      32.14,
                      26.92,
                      18.18,
                      33.33,
                      100,
                      25,
                      24.14,
                      17.86,
                      30.3,
                      23.08,
                      0,
                      14.29,
                      13.33,
                      33.33,
                      13.33,
                      16.67,
                      4.55
                    ],
                    'amounts': [
                      2,
                      3,
                      1,
                      2,
                      4,
                      14,
                      5,
                      7,
                      5,
                      9,
                      7,
                      4,
                      10,
                      1,
                      5,
                      7,
                      5,
                      10,
                      6,
                      0,
                      4,
                      2,
                      5,
                      4,
                      10,
                      1
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100
                    ],
                    'amounts': [
                      10,
                      10,
                      10,
                      6,
                      16,
                      25,
                      18,
                      16,
                      23,
                      28,
                      26,
                      22,
                      30,
                      1,
                      20,
                      29,
                      28,
                      33,
                      26,
                      5,
                      28,
                      15,
                      15,
                      30,
                      60,
                      22
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [],
      'textQuestionData': []
    },
    {
      'id': 42,
      'firstQuestionName': 'Q2',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 2,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 9,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 2,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 85.71,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 44.44,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 55.56,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 100,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 25,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 58.33,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 8.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 8.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 54.55,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 27.27,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 9.09,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 9.09,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 69.23,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 15.38,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 7.69,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 7.69,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 100,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 77.78,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 16.67,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 5.56,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 42.11,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 52.63,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 5.26,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 47.37,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 47.37,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 5.26,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 50,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 50,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 84.21,
                'dataCount': 16,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 5.26,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 10.53,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 71.43,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 21.43,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 7.14,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 80,
                'dataCount': 16,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 15,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 60.87,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 34.78,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 86.96,
                'dataCount': 20,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 70,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 25,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 20,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 80,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 75,
                'dataCount': 18,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 20.83,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 4.17,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 53.85,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 46.15,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 60,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 40,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 76.92,
                'dataCount': 20,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 19.23,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 3.85,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 72.92,
                'dataCount': 35,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 16.67,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 10.42,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 66.67,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 33.33,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Meget glad',
                    'percents': [
                      37.5,
                      85.71,
                      44.44,
                      100,
                      25,
                      54.55,
                      69.23,
                      100,
                      77.78,
                      42.11,
                      47.37,
                      50,
                      84.21,
                      71.43,
                      80,
                      60.87,
                      86.96,
                      70,
                      20,
                      75,
                      53.85,
                      60,
                      76.92,
                      72.92,
                      66.67
                    ],
                    'amounts': [
                      3,
                      6,
                      4,
                      4,
                      3,
                      6,
                      9,
                      9,
                      14,
                      8,
                      9,
                      9,
                      16,
                      10,
                      16,
                      14,
                      20,
                      14,
                      1,
                      18,
                      7,
                      6,
                      20,
                      35,
                      14
                    ]
                  },
                  {
                    'valueName': 'Glad',
                    'percents': [
                      50,
                      0,
                      55.56,
                      0,
                      58.33,
                      27.27,
                      15.38,
                      0,
                      16.67,
                      52.63,
                      47.37,
                      50,
                      5.26,
                      21.43,
                      15,
                      34.78,
                      4.35,
                      25,
                      80,
                      20.83,
                      46.15,
                      40,
                      19.23,
                      16.67,
                      33.33
                    ],
                    'amounts': [
                      4,
                      0,
                      5,
                      0,
                      7,
                      3,
                      2,
                      0,
                      3,
                      10,
                      9,
                      9,
                      1,
                      3,
                      3,
                      8,
                      1,
                      5,
                      4,
                      5,
                      6,
                      4,
                      5,
                      8,
                      7
                    ]
                  },
                  {
                    'valueName': 'Neutral',
                    'percents': [
                      0,
                      0,
                      0,
                      0,
                      8.33,
                      9.09,
                      7.69,
                      0,
                      0,
                      5.26,
                      0,
                      0,
                      10.53,
                      0,
                      0,
                      4.35,
                      0,
                      5,
                      0,
                      0,
                      0,
                      0,
                      3.85,
                      10.42,
                      0
                    ],
                    'amounts': [
                      0,
                      0,
                      0,
                      0,
                      1,
                      1,
                      1,
                      0,
                      0,
                      1,
                      0,
                      0,
                      2,
                      0,
                      0,
                      1,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      1,
                      5,
                      0
                    ]
                  },
                  {
                    'valueName': 'Sur',
                    'percents': [
                      0,
                      0,
                      0,
                      0,
                      8.33,
                      0,
                      7.69,
                      0,
                      5.56,
                      0,
                      5.26,
                      0,
                      0,
                      0,
                      5,
                      0,
                      4.35,
                      0,
                      0,
                      4.17,
                      0,
                      0,
                      0,
                      0,
                      0
                    ],
                    'amounts': [
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      1,
                      0,
                      1,
                      0,
                      1,
                      0,
                      0,
                      0,
                      1,
                      0,
                      1,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0
                    ]
                  },
                  {
                    'valueName': 'Meget sur',
                    'percents': [
                      12.5,
                      14.29,
                      0,
                      0,
                      0,
                      9.09,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      7.14,
                      0,
                      0,
                      4.35,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                    ],
                    'amounts': [
                      1,
                      1,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100,
                      100,
                      100,
                      100,
                      99.99,
                      100,
                      99.99,
                      100,
                      100.01,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100.01,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100.01,
                      100
                    ],
                    'amounts': [
                      8,
                      7,
                      9,
                      4,
                      12,
                      11,
                      13,
                      9,
                      18,
                      19,
                      19,
                      18,
                      19,
                      14,
                      20,
                      23,
                      23,
                      20,
                      5,
                      24,
                      13,
                      10,
                      26,
                      48,
                      21
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 6,
          'answerId': 8,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    },
    {
      'id': 43,
      'firstQuestionName': 'Q3',
      'firstQuestionType': 'smiley2',
      'filterQuestionName': null,
      'filterAnswerName': null,
      'firstQuestionId': 3,
      'filterQuestionId': null,
      'filterAnswerId': null,
      'period': 1,
      'chartType': 9,
      'compareEnabled': false,
      'calculateAverage': false,
      'position': 3,
      'chartData': {
        'single': [],
        'multi': [
          {
            'id': 0,
            'name': '16_01',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 37.5,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 50,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 12.5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_05',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 71.43,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 14.29,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_09',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 33.33,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 55.56,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 11.11,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_13',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 50,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 25,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_14',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 33.33,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 41.67,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 16.67,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 8.33,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_18',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 36.36,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 27.27,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 18.18,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 18.18,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_23',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 38.46,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 30.77,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 15.38,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 15.38,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_27',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 33.33,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 44.44,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 22.22,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_31',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 50,
                'dataCount': 9,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 33.33,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 11.11,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 5.56,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_36',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 42.11,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 42.11,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 15.79,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '16_40',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 36.84,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 31.58,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 21.05,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 10.53,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_45',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 33.33,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 55.56,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 5.56,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 5.56,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '16_50',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 66.67,
                'dataCount': 12,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 16.67,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 5.56,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 11.11,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_02',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 53.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 13.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 6.67,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 13.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 13.33,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_05',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 70,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 30,
                'dataCount': 6,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_10',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 34.78,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 43.48,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 13.04,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_15',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 65.22,
                'dataCount': 15,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 30.43,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 4.35,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_19',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 50,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 35,
                'dataCount': 7,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 10,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 5,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_23',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 20,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 60,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 20,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_24',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 75,
                'dataCount': 18,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 20.83,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 4.17,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_27',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 66.67,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 33.33,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_28',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 40,
                'dataCount': 4,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 50,
                'dataCount': 5,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 10,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_33',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 56,
                'dataCount': 14,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 32,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 8,
                'dataCount': 2,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 4,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          },
          {
            'id': 0,
            'name': '17_37',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 40.82,
                'dataCount': 20,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 38.78,
                'dataCount': 19,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 16.33,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 2.04,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 3
              },
              {
                'name': 'Meget sur',
                'value': 2.04,
                'dataCount': 1,
                'answersDataCount': 0,
                'optionIndex': 4
              }
            ]
          },
          {
            'id': 0,
            'name': '17_38',
            'answersCount': 0,
            'isTag': false,
            'series': [
              {
                'name': 'Meget glad',
                'value': 47.62,
                'dataCount': 10,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Glad',
                'value': 38.1,
                'dataCount': 8,
                'answersDataCount': 0,
                'optionIndex': 1
              },
              {
                'name': 'Neutral',
                'value': 14.29,
                'dataCount': 3,
                'answersDataCount': 0,
                'optionIndex': 2
              },
              {
                'name': 'Sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              },
              {
                'name': 'Meget sur',
                'value': 0,
                'dataCount': 0,
                'answersDataCount': 0,
                'optionIndex': 0
              }
            ]
          }
        ],
        'multiStacked': [],
        'rawData': [
          {
            'rawHeaders': [
              '16_01',
              '16_05',
              '16_09',
              '16_13',
              '16_14',
              '16_18',
              '16_23',
              '16_27',
              '16_31',
              '16_36',
              '16_40',
              '16_45',
              '16_50',
              '17_02',
              '17_05',
              '17_10',
              '17_15',
              '17_19',
              '17_23',
              '17_24',
              '17_27',
              '17_28',
              '17_33',
              '17_37',
              '17_38'
            ],
            'rawDataItems': [
              {
                'rawValueName': '',
                'rawDataValues': [
                  {
                    'valueName': 'Meget glad',
                    'percents': [
                      37.5,
                      71.43,
                      33.33,
                      50,
                      33.33,
                      36.36,
                      38.46,
                      33.33,
                      50,
                      42.11,
                      36.84,
                      33.33,
                      66.67,
                      53.33,
                      70,
                      34.78,
                      65.22,
                      50,
                      20,
                      75,
                      66.67,
                      40,
                      56,
                      40.82,
                      47.62
                    ],
                    'amounts': [
                      3,
                      5,
                      3,
                      2,
                      4,
                      4,
                      5,
                      3,
                      9,
                      8,
                      7,
                      6,
                      12,
                      8,
                      14,
                      8,
                      15,
                      10,
                      1,
                      18,
                      8,
                      4,
                      14,
                      20,
                      10
                    ]
                  },
                  {
                    'valueName': 'Glad',
                    'percents': [
                      50,
                      14.29,
                      55.56,
                      25,
                      41.67,
                      27.27,
                      30.77,
                      44.44,
                      33.33,
                      42.11,
                      31.58,
                      55.56,
                      16.67,
                      13.33,
                      30,
                      43.48,
                      30.43,
                      35,
                      60,
                      20.83,
                      33.33,
                      50,
                      32,
                      38.78,
                      38.1
                    ],
                    'amounts': [
                      4,
                      1,
                      5,
                      1,
                      5,
                      3,
                      4,
                      4,
                      6,
                      8,
                      6,
                      10,
                      3,
                      2,
                      6,
                      10,
                      7,
                      7,
                      3,
                      5,
                      4,
                      5,
                      8,
                      19,
                      8
                    ]
                  },
                  {
                    'valueName': 'Neutral',
                    'percents': [
                      0,
                      0,
                      11.11,
                      25,
                      16.67,
                      18.18,
                      15.38,
                      22.22,
                      11.11,
                      15.79,
                      21.05,
                      5.56,
                      5.56,
                      6.67,
                      0,
                      13.04,
                      4.35,
                      10,
                      20,
                      4.17,
                      0,
                      10,
                      8,
                      16.33,
                      14.29
                    ],
                    'amounts': [
                      0,
                      0,
                      1,
                      1,
                      2,
                      2,
                      2,
                      2,
                      2,
                      3,
                      4,
                      1,
                      1,
                      1,
                      0,
                      3,
                      1,
                      2,
                      1,
                      1,
                      0,
                      1,
                      2,
                      8,
                      3
                    ]
                  },
                  {
                    'valueName': 'Sur',
                    'percents': [
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      11.11,
                      13.33,
                      0,
                      4.35,
                      0,
                      5,
                      0,
                      0,
                      0,
                      0,
                      4,
                      2.04,
                      0
                    ],
                    'amounts': [
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      2,
                      2,
                      0,
                      1,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      1,
                      1,
                      0
                    ]
                  },
                  {
                    'valueName': 'Meget sur',
                    'percents': [
                      12.5,
                      14.29,
                      0,
                      0,
                      8.33,
                      18.18,
                      15.38,
                      0,
                      5.56,
                      0,
                      10.53,
                      5.56,
                      0,
                      13.33,
                      0,
                      4.35,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      2.04,
                      0
                    ],
                    'amounts': [
                      1,
                      1,
                      0,
                      0,
                      1,
                      2,
                      2,
                      0,
                      1,
                      0,
                      2,
                      1,
                      0,
                      2,
                      0,
                      1,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      1,
                      0
                    ]
                  },
                  {
                    'valueName': 'Total',
                    'percents': [
                      100,
                      100.01,
                      100,
                      100,
                      100,
                      99.99,
                      99.99,
                      99.99,
                      100,
                      100.01,
                      100,
                      100.01,
                      100.01,
                      99.99,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100,
                      100.01,
                      100.01
                    ],
                    'amounts': [
                      8,
                      7,
                      9,
                      4,
                      12,
                      11,
                      13,
                      9,
                      18,
                      19,
                      19,
                      18,
                      18,
                      15,
                      20,
                      23,
                      23,
                      20,
                      5,
                      24,
                      12,
                      10,
                      25,
                      49,
                      21
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      'compareLocationsTags': [],
      'ignoredAnswerValues': [
        {
          'id': 7,
          'answerId': 14,
          'name': 'Ved ikke'
        }
      ],
      'textQuestionData': []
    }
  ]
};
