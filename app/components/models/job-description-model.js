angular.module('myApp.models', ['myApp.factories'])
    .factory( 'jobDescriptionModel', function (jobDescriptionParser, jobDescTokenizer, storageAccess) {

        //degree: 0 for undefined, 1 for diploma, 2 for bachelor, 3 for master, 4 for phd
        function JobDescriptionEducation() {
            //array of keyword objects
            this.keywords = [];
            this.degree = 0;
        }

        function JobDescription() {
            //returns JobDescriptionEducation obj
            this.education = new JobDescriptionEducation();
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

        function save(result) {
            var tokens = jobDescTokenizer.tokenizeJobDesc(jobDesc);
            console.log("job desc tokens", tokens);

            var jobDescParsed = new JobDescription();
            jobDescParsed.essentialSkills = jobDescriptionParser.parse_min_req(tokens.minimumRequirement.concat(tokens.responsibility));
            jobDescParsed.preferredSkills = jobDescriptionParser.parse_skills(tokens.preferredQualification); // TODO: parse from minreq as well
            jobDescParsed.location = jobDescriptionParser.parse_location(tokens.location);
            jobDescParsed.education = jobDescriptionParser.parse_education_keywords(tokens.minimumRequirement);
            jobDescParsed.workExperienceTime = jobDescriptionParser.find_and_parse_work_time(tokens.minimumRequirement);
            jobDescParsed.languages = jobDescriptionParser.parse_languages(tokens.minimumRequirement.concat(tokens.preferredQualification));
            //console.log("job desc parsed", jobDescParsed);
            storageAccess.setJobDescription(jobDescParsed);
            console.log("job desc", jobDescParsed);
        };

        return {
            save: save
        };
    });