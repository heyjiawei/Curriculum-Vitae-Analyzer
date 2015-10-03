# Curriculum Vitae Analyzer

A CV is a representation of a candidate’s profile, skill sets and achievements. Matching CV across a
job description to identify potential candidates to interview is a tedious job. In this project we
will be solving this problem by designing and implementing resume parser and analyzer which will
help recruiters to process resumes by extracting data in a meaningful way given a certain job
description. The application is aimed for recruiters to efficiently manage electronic resume documents
sent via the internet.

## Getting Started

To get started, clone the repository and install the dependencies:

### Prerequisites

You need git to clone the angular-seed repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test the project. You must have node.js and
its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone Repository

Clone the repository using [git][git]:

```
git clone https://github.com/heyjiawei/Curriculum-Vitae-Analyzer.git
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

### Run the Application

Start the server by running:

```
npm start
```

You should be able to access the app at `http://localhost:8000/app/index.html`.

Alternatively, you may choose to install the simple [http-server][http-server]

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```
## Testing
### Running Unit Tests

The app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[http-server]: https://github.com/nodeapps/http-server
