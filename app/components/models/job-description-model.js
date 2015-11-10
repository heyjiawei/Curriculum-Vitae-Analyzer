angular.module('cvia.models')
    .factory( 'jobDescriptionModel', function (stem, jobDescriptionParser, jobDescriptionTokenizer, storageAccess) {

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

        function save(jobDesc) {
            var tokens = jobDescriptionTokenizer.tokenizeJobDesc(jobDesc);

            var jobDescParsed = new JobDescription();
            jobDescParsed.essentialSkills = jobDescriptionParser.parse_min_req(tokens.minimumRequirement.concat(tokens.responsibility));
            jobDescParsed.preferredSkills = jobDescriptionParser.parse_skills(tokens.preferredQualification); // TODO: parse from minreq as well
            jobDescParsed.location = jobDescriptionParser.parse_location(tokens.location);
            jobDescParsed.education.keywords = jobDescriptionParser.parse_education_keywords(tokens.minimumRequirement);
            jobDescParsed.education.degree = jobDescriptionParser.parse_education_degree(tokens.minimumRequirement);
            jobDescParsed.workExperienceTime = jobDescriptionParser.find_and_parse_work_time(tokens.minimumRequirement);
            jobDescParsed.languages = jobDescriptionParser.parse_languages(tokens.minimumRequirement.concat(tokens.preferredQualification));
            //console.log("job desc parsed", jobDescParsed);
            storageAccess.setJobDescription(jobDescParsed);
        }

        function get() {
            return storageAccess.getJobDescription();
        }

        function getStemmed() {
            var jobDescription = storageAccess.getJobDescription();
            var stemmedJobDescription = new JobDescription();
            stemmedJobDescription.education.keywords = stem.stem_array(jobDescription.education.keywords);
            stemmedJobDescription.education.degree = jobDescription.education.degree;
            stemmedJobDescription.essentialSkills = stem.stem_array(jobDescription.essentialSkills);
            stemmedJobDescription.preferredSkills = stem.stem_array(jobDescription.preferredSkills);
            stemmedJobDescription.location = jobDescription.location;
            stemmedJobDescription.workExperienceTime = jobDescription.workExperienceTime;
            stemmedJobDescription.languages = jobDescription.languages;
            return stemmedJobDescription;
        }

        return {
            /**
             * Converts the string into a job description object, and saves it into storage
             * @param: string representing the job description
             * @return: void
             */
            save: save,
            /**
             * Retrieves the job description object from storage
             * @param void
             * @return job description from storage
             */
            get: get,
            /**
             * Retrieves and stems the job description object from storage
             * @param void
             * @return stemmmedjob description from storage
             */
            get_stemmed: getStemmed
        };
    });