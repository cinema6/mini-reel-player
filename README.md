ECMAScript 6 Stub
====

Stub project for initializing a Cinema6 JS project using ECMAScript 6 (ES6.) 
This will seed a web-app boilerplate organized to fit into the overall embedding architecture. 
It uses Grunt to run common development and build processes.

Steps for starting a new project using stub
-------------------------------------------

1. Clone this repo:
```bash
$> git clone git@bitbucket.org:cinema6/es6-stub.git my-new-app
```
2. Set up as a new git repo:
```bash
$> cd my-new-app && rm -rf .git && git init .
```
4. Add GitHub as a remote
```bash
$> git remote add origin git@github.com:cinema6/my-new-app.git
```
5. Initialize as a new NPM repo
```bash
$> npm init
```
6. Add the files in the repo
```bash
$> git commit -am "Initial commit."
```
7. Push to Github!
```bash
$> git push origin --all -u
```

Installing Required Dependencies for Development
------------------------------------------------
1. Install [node](http://nodejs.org/download/)
2. Install Grunt
```bash
$> npm install -g grunt-cli
```
3. Install dependenices
```bash
$> npm install
```

Installing Required Dependencies for Building
---------------------------------------------
1. Follow steps for installing development dependencies
2. Clone the [Closure Compiler Repo](https://github.com/google/closure-compiler):
```
$> git clone git@github.com:google/closure-compiler.git
```
3. [Build the compiler](https://github.com/google/closure-compiler#building-it-yourself)
4. Create an environment variable called ```CLOSURE_PATH``` that points to the location of the
   closure compiler git repository



### Grunt Tasks and Configuration
#### Configuration
##### .jshintrc
There are many ```.jshintrc``` files in the project (used to give different configuration to the differing environments.) To find them all, run this command:
```bash
$> find . -path ./node_modules -prune -o -name ".jshintrc" -print
```
##### .aws.json
This file should be stored in a location where it can be accessed by many applications (usually your home directory.) It should have the following properties:

1. accessKeyId
2. secretAccessKey
3. region

##### package.json
The name and keywords in this file are used to configure certain application settings and defaults.

#### Tasks

##### genid:(prefix)
This task will generate and log a Cinema6-formatted UUID with the supplied prefix.

ex:
```bash
$> grunt genid:e
Running "genid:e" (genid) task
e-6c7ed80e3d68ac
$> grunt genid:o
Running "genid:o" (genid) task
o-df80d6438ab29c
```

##### server
This task will start a development server that uses c6embed. Your application will be embedded in a friendly iframe, and the Cinema6 postMessage API will be available.

ex:
```bash
$> grunt server
```

##### server:tdd
This task, in addition to starting a development server (just like the ```server``` task,) will also run unit tests whenever a source/test file changes.

ex:
```bash
$> grunt server:tdd
```

##### test:unit
This task will check your JS files for lint and execute the unit tests

ex:
```bash
$> grunt test:unit
```

##### test:perf
This task will check your JS files for lint and execute the performance tests

ex:
```bash
$> grunt test:perf
```

##### tdd
This task will watch your JS files for changes. If a file is changed, the unit tests will be re-executed.

ex:
```bash
$> grunt tdd
```

##### publish:('staging' || 'production')
This task will build and upload the application to the specified environment on S3.

ex:
```bash
$> grunt publish:staging #Upload app to staging server
$> grunt publish:production #Upload app to production server
```