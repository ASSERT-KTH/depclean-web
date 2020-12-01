# DepClean Web

## What is DepClean Web?

DepClean Web is an interactive website that allows a user to input the URL of a Java project and receive the analysis output of [DepClean](https://github.com/castor-software/depclean). The backend service detects all the unused dependencies declared in the `pom.xml` file of the project and sends them to the front for visualization as an interactive web site. 

> With DepClean Web, developers can easily observe all the unused dependencies in their projects and evaluate what benefits a project could gain from identifying and deleting them.

# Example
 
Visualization of the Spoon Maven Dependency tree, with supply chain information (one color = one provider)

<img src="https://github.com/castor-software/depclean-web/blob/main/.img/dependencyTree.jpg" align="left" alt="DepClean visualization of dependency tree"/>



# DepCleanfront-end

## How to run devevelopment mode

Go first to the front-end folder and use the following commands in the terminal to run the project:

### `yarn install`
### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# License

Distributed under the MIT License. See [LICENSE](https://github.com/castor-software/depclean/blob/master/LICENSE.md) for more information.

# Funding

DepClean is partially funded by the [Wallenberg Autonomous Systems and Software Program (WASP)](https://wasp-sweden.org).

<img src="https://github.com/castor-software/depclean/blob/master/.img/wasp.svg" height="50px" alt="Wallenberg Autonomous Systems and Software Program (WASP)"/>
