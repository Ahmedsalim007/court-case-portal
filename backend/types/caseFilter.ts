export type CaseFilter ={
         status?: string;
        assignedJudge?: { $regex: string; $options: string };
        caseNum?: { $regex: string; $options: string };
        hearingDate?: { $gte?: Date; $lte?: Date };
}