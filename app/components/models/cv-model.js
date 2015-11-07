angular.module('myApp.models', ['myApp.factories'])
    .factory( 'cvModel', function (lemma, cvTokenizer, storageAccess) {

        //degree: 0 for undefined, 1 for diploma, 2 for bachelor, 3 for master, 4 for phd
        function CVEducation() {
            this.keywords = [];
            this.degree = 0;
        };

        function CV () {
            //CV education object
            this.education = new CVEducation();
            //returns an array of Keyword objects (see Constants.js)
            this.skill = [];
            //returns an array of Keyword objects (see Constants.js)
            //from both sections work experience and projects
            this.experience = [];
            //returns an array of strings
            this.interest = [];
            //array of ISO 639-1 codes i.e. keys of languages json in Constants
            this.languages = [];
            //TODO: not done
            this.id = [];
            //time in milliseconds
            this.workExperienceTime = 0;
        };

        function save(result) {
            var tokens = cvTokenizer.tokenizeCv(result);
            console.log("cv tokens", tokens);
            var cvParsed = new CV();
            cvParsed.education.keywords = lemma.parse_education_keywords(tokens.education);
            cvParsed.education.degree = lemma.parse_education_degree(tokens.education);
            cvParsed.languages = lemma.parse_language(tokens.language);
            cvParsed.interest = lemma.parse_interest(tokens.interest);
            cvParsed.skill = lemma.parse_skills(tokens.skill);
            cvParsed.experience = lemma.parse_experience(tokens.experience.concat(tokens.project));
            console.log("cv parsed", cvParsed);
            storageAccess.storeParsedCV(cvParsed);
        };

        function getAll() {

        };

        return {
            /**
             * Converts the string into a CV object, and saves it into storage
             * @param: string representing the CV
             * @return: void
             */
            save: save,
            /**
             * Retrieves all the CVs from storage
             * @param void
             * @return an array of cv objects from the storage
             */
            getAll: getAll
        };
    });