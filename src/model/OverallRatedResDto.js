class OverallOfACriterion {
    constructor(criteriaId, criteriaPoint, criteriaTitle, selfPoint, teamPoint, managerPoint, overallPoint) {
        this.criteriaId = criteriaId;
        this.criteriaPoint = criteriaPoint;
        this.criteriaTitle = criteriaTitle;
        this.selfPoint = selfPoint;
        this.teamPoint = teamPoint;
        this.managerPoint = managerPoint;
        this.overallPoint = overallPoint;
    }
}

class OverallRatedResDto {

    constructor(
        /**
         * @type {OverallOfACriterion[]}
         */
        overallOfCriteria,
        overallPoint,
        rank,
        levelUpRecommend,
    ) {
        this.overallOfCriteria = overallOfCriteria;
        this.overallPoint = overallPoint;
        this.rank = rank;
        this.levelUpRecommend = levelUpRecommend;
    }
}

export default OverallRatedResDto;