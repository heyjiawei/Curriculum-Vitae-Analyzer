angular.module('myApp.models', ['myApp.factories'])
    .factory( 'cvModel', function (stem, cvParser, cvTokenizer, storageAccess) {

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
            cvParsed.education.keywords = cvParser.parse_education_keywords(tokens.education);
            cvParsed.education.degree = cvParser.parse_education_degree(tokens.education);
            cvParsed.languages = cvParser.parse_language(tokens.language);
            cvParsed.interest = cvParser.parse_interest(tokens.interest);
            cvParsed.skill = cvParser.parse_skills(tokens.skill);
            cvParsed.experience = cvParser.parse_experience(tokens.experience.concat(tokens.project));
            console.log("cv parsed", cvParsed);
            storageAccess.storeParsedCV(cvParsed);
        };

        function getAll() {
            return storageAccess.getAllCV();
        };

        function getAllStemmed() {
            var allCvs = storageAccess.getAllCV();
            allCvs.map(function(cv) {
                var stemmedCv = new CV();
                stemmedCv.education.keywords = stem.stem_array(cv.education.keywords);
                stemmedCv.education.degree = cv.education.degree;
                stemmedCv.languages = cv.languages;
                stemmedCv.interest = stem.stem_array(cv.interest);
                stemmedCv.skill = stem.stem_array(cv.skill);
                stemmedCv.experience = stem.stem_array(cv.experience);
                return stemmedCv;
            })
            console.log("all stemmed cvs", allCvs);
            return allCvs;
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
            get_all: getAll,
            /**
             * Retrieves and stems all the CVs from storage
             * @param void
             * @return an array of stemmed cv objects from the storage
             */
            get_all_stemmed: getAllStemmed
        };
    });