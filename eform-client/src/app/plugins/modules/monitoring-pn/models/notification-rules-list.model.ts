export class NotificationRulesListModel {
  total: number;
  rules: NotificationRuleSimpleModel[] = [];
}

export class NotificationRuleSimpleModel {
  id: number;
  trigger: string;
  event: string;
  eFormName: string;
}
