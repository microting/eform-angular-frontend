export class ReportEformPostModel {
    postId: number;
    caseId: number;
    sentTo: string[] = [];
    sentToTags: string[] = [];
    comment: string;
}
