angular.module('cvia.models', ['cvia.factories'])
    .factory( 'cvModel', function (stem, cvParser, cvTokenizer, storageAccess) {

        //degree: 0 for undefined, 1 for diploma, 2 for bachelor, 3 for master, 4 for phd
        function CVEducation() {
            this.keywords = [];
            this.degree = 0;
        }

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
            //name of the applicant
            this.name = [];
            //time in milliseconds
            this.workExperienceTime = 0;
        }

        function reset() {
            storageAccess.resetAllCVs();
        }

        function save(result) {
            var tokens = cvTokenizer.tokenizeCv(result);
            var tokenizedCv = new CV();
            tokenizedCv.name = tokens.name;
            tokenizedCv.education.keywords = cvParser.parse_education_keywords(tokens.education);
            tokenizedCv.education.degree = cvParser.parse_education_degree(tokens.education);
            tokenizedCv.languages = cvParser.parse_language(tokens.language);
            tokenizedCv.interest = cvParser.parse_interest(tokens.interest);
            tokenizedCv.skill = cvParser.parse_skills(tokens.skill);
            tokenizedCv.experience = cvParser.parse_experience(tokens.experience.concat(tokens.project));
            cvParsed.workExperienceTime = cvParser.find_and_parse_work_time(tokens.experience);
            storageAccess.storeParsedCV(tokenizedCv);
        }

        function getAll() {
            return storageAccess.getAllCV();
        }

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
                stemmedCv.workExperienceTime = cv.workExperienceTime;
                return stemmedCv;
            });
            return allCvs;
        }

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
            get_all_stemmed: getAllStemmed,
            /**
             * Clears CV from storage
             * @param void
             * @return void
             */
            reset: reset
        };
    });