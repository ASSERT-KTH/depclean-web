# DepClean Web

## What is DepClean Web?

DepClean Web is an interactive website visualization that allows a user to input the URL of a Java project and receive the analysis output of [DepClean](https://github.com/castor-software/depclean). The backend service detects all the unused dependencies declared in the `pom.xml` file of the project and sends them to the front for visualization as an interactive web site. 

> With DepClean Web, developers can easily observe all the unused dependencies in their projects and evaluate what benefits a project could gain from identifying and deleting them.

# Example
 
Visualization of the Maven-core dependency, with bloated or used dependencies information by color, and dependency size. 

<img src="https://github.com/castor-software/depclean-web/blob/main/.img/dependencyTree.png" align="left" alt="DepClean visualization of dependency tree"/>

# Installing and running the backen-end
Run the back-end using docker. First, pull the new docker image. Secondly, run the image. 
```bash
sudo docker pull cesarsotovalero/depclean-web:cors
sudo docker run -p 8000:8081 cesarsotovalero/depclean-web:cors
```

# Installing and running the font-end

In a terminal clone the repository and swith to the cloned folder

```bash
git clone https://github.com/castor-software/depclean-web.git
cd depclean-web
```

Afterwards, go  to the front-end folder and use the following commands in the terminal to run the project:

```bash
cd front-end
yarn install
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# License

Distributed under the MIT License. See [LICENSE](https://github.com/castor-software/depclean/blob/master/LICENSE.md) for more information.

# Funding

DepClean is partially funded by the [Wallenberg Autonomous Systems and Software Program (WASP)](https://wasp-sweden.org).

<img src="https://github.com/castor-software/depclean/blob/master/.img/wasp.svg" height="50px" alt="Wallenberg Autonomous Systems and Software Program (WASP)"/>
