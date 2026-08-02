export const filterCases = (req, res, next) =>{
    const {status, judge, search, fromDate, toDate } = req.query;

    const filter = {};
    
    if(status){
        filter.status = status;
    }

    if(judge){
        filter.assignedJudge = {$regex:judge , $options:'i'}
    }
    if(search){
        filter.caseNum = {$regex:search, $options:'i'}
    }
    if(fromDate||toDate){
        filter.hearingDate ={};
        if(fromDate) filter.hearingDate.$gte = new Date (fromDate);
         if(toDate) filter.hearingDate.$lte = new Date (toDate)
    }
    
    req.filter= filter;
    next();
}