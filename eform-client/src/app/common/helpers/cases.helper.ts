import { TemplateDto } from 'src/app/common/models';

export function composeCasesTableHeaders(
  currentTemplate: TemplateDto,
  isAdmin: boolean
) {
  return [
    { name: 'Id', elementId: '', sortable: true },
    { name: 'done_at', elementId: '', sortable: true },
    isAdmin ? { name: 'created_at', elementId: '', sortable: true } : null,
    { name: 'worker_name', elementId: '', sortable: true },
    currentTemplate.field1 && currentTemplate.field1.label
      ? {
          name: 'field1',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field1.label,
        }
      : null,
    currentTemplate.field2 && currentTemplate.field2.label
      ? {
          name: 'field2',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field2.label,
        }
      : null,
    currentTemplate.field3 && currentTemplate.field3.label
      ? {
          name: 'field3',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field3.label,
        }
      : null,
    currentTemplate.field4 && currentTemplate.field4.label
      ? {
          name: 'field4',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field4.label,
        }
      : null,
    currentTemplate.field5 && currentTemplate.field5.label
      ? {
          name: 'field5',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field5.label,
        }
      : null,
    currentTemplate.field6 && currentTemplate.field6.label
      ? {
          name: 'field6',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field6.label,
        }
      : null,
    currentTemplate.field7 && currentTemplate.field7.label
      ? {
          name: 'field7',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field7.label,
        }
      : null,
    currentTemplate.field8 && currentTemplate.field8.label
      ? {
          name: 'field8',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field8.label,
        }
      : null,
    currentTemplate.field9 && currentTemplate.field9.label
      ? {
          name: 'field9',
          elementId: '',
          sortable: true,
          visibleName: currentTemplate.field9.label,
        }
      : null,
    { name: 'Actions', elementId: '', sortable: false },
  ];
}
