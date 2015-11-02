function JobDescription() {
    //returns JobDescriptionEducation obj
    this.education = JobDescriptionEducation();
    //returns an array of Keyword objects (see Constants.js)
    this.preferredSkills =[];
    //returns an array of Keyword objects (see Constants.js)
    this.essentialSkills = [];
    //TODO: not done
    this.location=[];
    //returns JobDescriptionWorkExperienceTime obj
    this.workExperienceTime = JobDescriptionWorkExperienceTime;
    //TODO: not done
    this.languages = [];
}

//degree: 0 for undefined, 1 for diploma, 2 for bachelor, 3 for master, 4 for phd
function JobDescriptionEducation() {
    //array of keyword objects
    this.keywords = [];
    this.degree = 0;
}

//TODO: parse this better
function JobDescriptionWorkExperienceTime() {
    //e.g. year, months
    this.value = "";
    //e.g. "at least 1.5"
    this.duration = "";
};