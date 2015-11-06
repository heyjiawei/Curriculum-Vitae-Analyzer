function JobDescription() {
    //returns JobDescriptionEducation obj
    this.education = JobDescriptionEducation();
    //returns an array of Keyword objects (see Constants.js)
    this.preferredSkills =[];
    //returns an array of Keyword objects (see Constants.js)
    this.essentialSkills = [];
    //TODO: not done
    this.location=[];
    //returns min work experience time in milliseconds
    this.workExperienceTime = 0;
    //array of ISO 639-1 codes i.e. keys of languages json in Constants
    this.languages = [];
}

//degree: 0 for undefined, 1 for diploma, 2 for bachelor, 3 for master, 4 for phd
function JobDescriptionEducation() {
    //array of keyword objects
    this.keywords = [];
    this.degree = 0;
}