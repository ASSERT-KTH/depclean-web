import React, { createContext, useReducer, useContext } from "react";
import { filterArtifacts, getTreeHierarchy, cloneProject, highlightBloat } from "./utils/treeAccess";
// import { fetchFromFile } from './utils/dataRetrieve';
import * as d3 from 'd3';


//Interface for an artifact in the POM XML
interface artifact {
    coordinates: string,
    groupId: string,
    artifactId: string,
    version: string,
    scope: "compile" | "provided" | "runtime" | "test" | "sytem" | "import" | "null",
    packaging: "jar" | "war"
    omitted: boolean,
    classifier: string,
    parent: string,
    size: number,
    status: "used" | "bloated"
    type: "parent" | "direct" | "omitted" | "transitive" | "inherited"
    children: artifact[],
    highlight: boolean,
    visible: boolean,
}

export interface AppState {
    project: artifact,
    filteredProject: artifact,
    nodes: any,
    filtered: any,
    filteredDependencies: string[],
    filteredBloated: string[],
    colorSelected: "color-type" | "color-artifact-id",
    textDisplay: string[],
    filteredScope: string[],
    viewDependencyList: boolean,
    viewOmitted: boolean
}

interface AppStateContextProps {
    state: AppState,
    dispatch: React.Dispatch<Action>,
}

type Action =
    | {
        type: "SELECT_DEPENDENCY"
        payload: string[]
    }
    | {
        type: "SELECT_BLOAT"
        payload: string[]
    }
    | {
        type: "SELECT_VIEW"
        payload: string[]
    }
    | {
        type: "SELECT_SCOPE"
        payload: string[]
    }
    | {
        type: "SELECT_COLOR"
        payload: "color-type" | "color-artifact-id",
    }
    | {
        type: "LOAD_LOCAL_FILE"
        payload: any
    }
    | {
        type: "VIEW_DEPENDENCY_LIST"
        payload: boolean
    }
    | {
        type: "RESET_FILTERS"
        payload: null
    }
    | {
        type: "VIEW_OMITTED"
        payload: boolean
    }




// coordinates: string -> groupId:artifactId:version
// groupId: string
// artifactId: string
// version: string
// scope: string (compile | test | provided | system)
// packaging: string (jar | war )
// omitted: boolean
// classifier: string
// parent: string (coordinates)
// size: float (Kb)
// status: string (used | bloated)
// children: array [coordinates]
const data: artifact = {
    "coordinates": "com.ning:async-http-client:jar:1.7.23",
    "groupId": "com.ning",
    "artifactId": "async-http-client",
    "version": "1.7.23",
    "scope": "null",
    "packaging": "jar",
    "omitted": false,
    "classifier": "null",
    "size": 0.5329049217763098,
    "status": "used",
    "parent": "nulls",
    "visible": true,
    "highlight": false,
    "type": "parent",
    "children": [
        {
            "coordinates": "io.netty:netty:jar:3.6.6.Final:compile",
            "groupId": "io.netty",
            "artifactId": "netty",
            "version": "3.6.6.Final",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.47442792966571834,
            "status": "bloated",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": []
        },
        {
            "coordinates": "org.slf4j:slf4j-api:jar:1.7.5:compile",
            "groupId": "org.slf4j",
            "artifactId": "slf4j-api",
            "version": "1.7.5",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.14094719115888255,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "inherited",
            "children": []
        },
        {
            "coordinates": "com.google.guava:guava:jar:11.0.2:compile",
            "groupId": "com.google.guava",
            "artifactId": "guava",
            "version": "11.0.2",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.6744820076616684,
            "status": "bloated",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "com.google.code.findbugs:jsr305:jar:1.3.9:compile",
                    "groupId": "com.google.code.findbugs",
                    "artifactId": "jsr305",
                    "version": "1.3.9",
                    "scope": "compile",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.8073211710449711,
                    "status": "bloated",
                    "parent": "com.google.guava:guava:jar:11.0.2:compile",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "ch.qos.logback:logback-classic:jar:1.0.13:test",
            "groupId": "ch.qos.logback",
            "artifactId": "logback-classic",
            "version": "1.0.13",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.335044758148652,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "ch.qos.logback:logback-core:jar:1.0.13:test",
                    "groupId": "ch.qos.logback",
                    "artifactId": "logback-core",
                    "version": "1.0.13",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.2101302547485695,
                    "status": "bloated",
                    "parent": "ch.qos.logback:logback-classic:jar:1.0.13:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "(org.slf4j:slf4j-api:jar:1.7.5:test - omitted for duplicate)",
                    "groupId": "org.slf4j",
                    "artifactId": "slf4j-api",
                    "version": "1.7.5",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.11471420495454066,
                    "status": "used",
                    "parent": "ch.qos.logback:logback-classic:jar:1.0.13:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "log4j:log4j:jar:1.2.13:test",
            "groupId": "log4j",
            "artifactId": "log4j",
            "version": "1.2.13",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.44263276805979845,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "omitted",
            "children": []
        },
        {
            "coordinates": "org.testng:testng:jar:jdk15:5.8:test",
            "groupId": "org.testng",
            "artifactId": "testng",
            "version": "5.8",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "jdk15",
            "size": 0.4194884909155602,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "junit:junit:jar:3.8.1:test",
                    "groupId": "junit",
                    "artifactId": "junit",
                    "version": "3.8.1",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.7070761288917646,
                    "status": "used",
                    "parent": "org.testng:testng:jar:jdk15:5.8:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "org.eclipse.jetty:jetty-server:jar:8.1.1.v20120215:test",
            "groupId": "org.eclipse.jetty",
            "artifactId": "jetty-server",
            "version": "8.1.1.v20120215",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.9160368505388645,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "org.eclipse.jetty.orbit:javax.servlet:jar:3.0.0.v201112011016:test",
                    "groupId": "org.eclipse.jetty.orbit",
                    "artifactId": "javax.servlet",
                    "version": "3.0.0.v201112011016",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.7039211066485997,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-server:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.eclipse.jetty:jetty-continuation:jar:8.1.1.v20120215:test",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-continuation",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.5664229899726376,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-server:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.eclipse.jetty:jetty-http:jar:8.1.1.v20120215:test",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-http",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.28285449867976353,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-server:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": [
                        {
                            "coordinates": "(org.eclipse.jetty:jetty-io:jar:8.1.1.v20120215:test - omitted for duplicate)",
                            "groupId": "org.eclipse.jetty",
                            "artifactId": "jetty-io",
                            "version": "8.1.1.v20120215",
                            "scope": "test",
                            "packaging": "jar",
                            "omitted": true,
                            "classifier": "null",
                            "size": 0.10877277224205983,
                            "status": "bloated",
                            "parent": "org.eclipse.jetty:jetty-http:jar:8.1.1.v20120215:test",
                            "visible": true,
                            "highlight": false,
                            "type": "transitive",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "coordinates": "org.eclipse.jetty:jetty-servlet:jar:8.1.1.v20120215:test",
            "groupId": "org.eclipse.jetty",
            "artifactId": "jetty-servlet",
            "version": "8.1.1.v20120215",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.3204591979331075,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(org.eclipse.jetty:jetty-security:jar:8.1.1.v20120215:test - omitted for duplicate)",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-security",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.5570147236030396,
                    "status": "used",
                    "parent": "org.eclipse.jetty:jetty-servlet:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "org.eclipse.jetty:jetty-websocket:jar:8.1.1.v20120215:test",
            "groupId": "org.eclipse.jetty",
            "artifactId": "jetty-websocket",
            "version": "8.1.1.v20120215",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.836320249324984,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "inherited",
            "children": [
                {
                    "coordinates": "org.eclipse.jetty:jetty-util:jar:8.1.1.v20120215:test",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-util",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.8880080040785623,
                    "status": "used",
                    "parent": "org.eclipse.jetty:jetty-websocket:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.eclipse.jetty:jetty-io:jar:8.1.1.v20120215:test",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-io",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.9899986735333021,
                    "status": "used",
                    "parent": "org.eclipse.jetty:jetty-websocket:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": [
                        {
                            "coordinates": "(org.eclipse.jetty:jetty-util:jar:8.1.1.v20120215:test - omitted for duplicate)",
                            "groupId": "org.eclipse.jetty",
                            "artifactId": "jetty-util",
                            "version": "8.1.1.v20120215",
                            "scope": "test",
                            "packaging": "jar",
                            "omitted": true,
                            "classifier": "null",
                            "size": 0.03102055374052981,
                            "status": "bloated",
                            "parent": "org.eclipse.jetty:jetty-io:jar:8.1.1.v20120215:test",
                            "visible": true,
                            "highlight": false,
                            "type": "transitive",
                            "children": []
                        }
                    ]
                },
                {
                    "coordinates": "(org.eclipse.jetty:jetty-http:jar:8.1.1.v20120215:test - omitted for duplicate)",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-http",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.7861276016678043,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-websocket:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "org.eclipse.jetty:jetty-servlets:jar:8.1.1.v20120215:test",
            "groupId": "org.eclipse.jetty",
            "artifactId": "jetty-servlets",
            "version": "8.1.1.v20120215",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.41986204568545893,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(org.eclipse.jetty:jetty-continuation:jar:8.1.1.v20120215:test - omitted for duplicate)",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-continuation",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.637852700960928,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-servlets:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.eclipse.jetty:jetty-client:jar:8.1.1.v20120215:test",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-client",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.009916566996355236,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-servlets:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": [
                        {
                            "coordinates": "(org.eclipse.jetty:jetty-http:jar:8.1.1.v20120215:test - omitted for duplicate)",
                            "groupId": "org.eclipse.jetty",
                            "artifactId": "jetty-http",
                            "version": "8.1.1.v20120215",
                            "scope": "test",
                            "packaging": "jar",
                            "omitted": true,
                            "classifier": "null",
                            "size": 0.673461077017294,
                            "status": "used",
                            "parent": "org.eclipse.jetty:jetty-client:jar:8.1.1.v20120215:test",
                            "visible": true,
                            "highlight": false,
                            "type": "transitive",
                            "children": []
                        }
                    ]
                },
                {
                    "coordinates": "(org.eclipse.jetty:jetty-util:jar:8.1.1.v20120215:test - omitted for duplicate)",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-util",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.11590969184715294,
                    "status": "used",
                    "parent": "org.eclipse.jetty:jetty-servlets:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "org.eclipse.jetty:jetty-security:jar:8.1.1.v20120215:test",
            "groupId": "org.eclipse.jetty",
            "artifactId": "jetty-security",
            "version": "8.1.1.v20120215",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.37344546954568814,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(org.eclipse.jetty:jetty-server:jar:8.1.1.v20120215:test - omitted for duplicate)",
                    "groupId": "org.eclipse.jetty",
                    "artifactId": "jetty-server",
                    "version": "8.1.1.v20120215",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.6834023284535035,
                    "status": "bloated",
                    "parent": "org.eclipse.jetty:jetty-security:jar:8.1.1.v20120215:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "org.apache.tomcat:coyote:jar:6.0.29:test",
            "groupId": "org.apache.tomcat",
            "artifactId": "coyote",
            "version": "6.0.29",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.6076283527978861,
            "status": "bloated",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(org.apache.tomcat:catalina:jar:6.0.29:test - omitted for duplicate)",
                    "groupId": "org.apache.tomcat",
                    "artifactId": "catalina",
                    "version": "6.0.29",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.3434234780908889,
                    "status": "bloated",
                    "parent": "org.apache.tomcat:coyote:jar:6.0.29:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.apache.tomcat:servlet-api:jar:6.0.29:test",
                    "groupId": "org.apache.tomcat",
                    "artifactId": "servlet-api",
                    "version": "6.0.29",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.7834290179785834,
                    "status": "used",
                    "parent": "org.apache.tomcat:coyote:jar:6.0.29:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.apache.tomcat:juli:jar:6.0.29:test",
                    "groupId": "org.apache.tomcat",
                    "artifactId": "juli",
                    "version": "6.0.29",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.7515139896931735,
                    "status": "bloated",
                    "parent": "org.apache.tomcat:coyote:jar:6.0.29:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "org.apache.tomcat:catalina:jar:6.0.29:test",
            "groupId": "org.apache.tomcat",
            "artifactId": "catalina",
            "version": "6.0.29",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.5119623313495509,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(org.apache.tomcat:juli:jar:6.0.29:test - omitted for duplicate)",
                    "groupId": "org.apache.tomcat",
                    "artifactId": "juli",
                    "version": "6.0.29",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.06437843028876189,
                    "status": "bloated",
                    "parent": "org.apache.tomcat:catalina:jar:6.0.29:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.apache.tomcat:annotations-api:jar:6.0.29:test",
                    "groupId": "org.apache.tomcat",
                    "artifactId": "annotations-api",
                    "version": "6.0.29",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.841173365955335,
                    "status": "used",
                    "parent": "org.apache.tomcat:catalina:jar:6.0.29:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "commons-io:commons-io:jar:2.0.1:test",
            "groupId": "commons-io",
            "artifactId": "commons-io",
            "version": "2.0.1",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.10173526661861632,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": []
        },
        {
            "coordinates": "commons-fileupload:commons-fileupload:jar:1.2.2:test",
            "groupId": "commons-fileupload",
            "artifactId": "commons-fileupload",
            "version": "1.2.2",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.3378556330756416,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": []
        },
        {
            "coordinates": "commons-httpclient:commons-httpclient:jar:3.1:compile",
            "groupId": "commons-httpclient",
            "artifactId": "commons-httpclient",
            "version": "3.1",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.33763202435133643,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(commons-logging:commons-logging:jar:1.0.4:compile - omitted for conflict with 1.1.1)",
                    "groupId": "commons-logging",
                    "artifactId": "commons-logging",
                    "version": "1.0.4",
                    "scope": "compile",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.37261114770642023,
                    "status": "used",
                    "parent": "commons-httpclient:commons-httpclient:jar:3.1:compile",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "commons-codec:commons-codec:jar:1.2:compile",
                    "groupId": "commons-codec",
                    "artifactId": "commons-codec",
                    "version": "1.2",
                    "scope": "compile",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.5492602778144903,
                    "status": "used",
                    "parent": "commons-httpclient:commons-httpclient:jar:3.1:compile",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        },
        {
            "coordinates": "commons-lang:commons-lang:jar:2.4:compile",
            "groupId": "commons-lang",
            "artifactId": "commons-lang",
            "version": "2.4",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.8638365431992191,
            "status": "bloated",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": []
        },
        {
            "coordinates": "commons-logging:commons-logging:jar:1.1.1:compile",
            "groupId": "commons-logging",
            "artifactId": "commons-logging",
            "version": "1.1.1",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.7039005497450482,
            "status": "bloated",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": []
        },
        {
            "coordinates": "org.glassfish.grizzly:grizzly-websockets:jar:2.3.7:compile",
            "groupId": "org.glassfish.grizzly",
            "artifactId": "grizzly-websockets",
            "version": "2.3.7",
            "scope": "compile",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.3826336131755742,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "org.glassfish.grizzly:grizzly-framework:jar:2.3.7:compile",
                    "groupId": "org.glassfish.grizzly",
                    "artifactId": "grizzly-framework",
                    "version": "2.3.7",
                    "scope": "compile",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.6861624087434306,
                    "status": "bloated",
                    "parent": "org.glassfish.grizzly:grizzly-websockets:jar:2.3.7:compile",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                },
                {
                    "coordinates": "org.glassfish.grizzly:grizzly-http:jar:2.3.7:compile",
                    "groupId": "org.glassfish.grizzly",
                    "artifactId": "grizzly-http",
                    "version": "2.3.7",
                    "scope": "compile",
                    "packaging": "jar",
                    "omitted": false,
                    "classifier": "null",
                    "size": 0.5923966940710254,
                    "status": "used",
                    "parent": "org.glassfish.grizzly:grizzly-websockets:jar:2.3.7:compile",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": [
                        {
                            "coordinates": "(org.glassfish.grizzly:grizzly-framework:jar:2.3.7:compile - omitted for duplicate)",
                            "groupId": "org.glassfish.grizzly",
                            "artifactId": "grizzly-framework",
                            "version": "2.3.7",
                            "scope": "compile",
                            "packaging": "jar",
                            "omitted": true,
                            "classifier": "null",
                            "size": 0.8515147594503729,
                            "status": "bloated",
                            "parent": "org.glassfish.grizzly:grizzly-http:jar:2.3.7:compile",
                            "visible": true,
                            "highlight": false,
                            "type": "transitive",
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "coordinates": "org.glassfish.grizzly:grizzly-http-server:jar:2.3.5:test",
            "groupId": "org.glassfish.grizzly",
            "artifactId": "grizzly-http-server",
            "version": "2.3.5",
            "scope": "test",
            "packaging": "jar",
            "omitted": false,
            "classifier": "null",
            "size": 0.15843722630129053,
            "status": "used",
            "parent": "com.ning:async-http-client:jar:1.7.23",
            "visible": true,
            "highlight": false,
            "type": "direct",
            "children": [
                {
                    "coordinates": "(org.glassfish.grizzly:grizzly-http:jar:2.3.5:test - omitted for conflict with 2.3.7)",
                    "groupId": "org.glassfish.grizzly",
                    "artifactId": "grizzly-http",
                    "version": "2.3.5",
                    "scope": "test",
                    "packaging": "jar",
                    "omitted": true,
                    "classifier": "null",
                    "size": 0.025760646218693783,
                    "status": "used",
                    "parent": "org.glassfish.grizzly:grizzly-http-server:jar:2.3.5:test",
                    "visible": true,
                    "highlight": false,
                    "type": "transitive",
                    "children": []
                }
            ]
        }
    ]
}
//accessor to get the data
const childrenAccessor = (d: any) => d.children;
//Data state for all the application
const dependCheckGroup: string[] = ["direct", "transitive", "inherited"];
const bloatedCheckGroup: string[] = [];
const viewText: string[] = ["groupid", "artifactid", "version"];
const nodes = d3.hierarchy(data, childrenAccessor);
const scopeCheckGroup: string[] = ["compile", "test", "provided", "runtime", "system"]

const appData: AppState = {

    project: data,
    filteredProject: cloneProject(data),
    nodes: nodes,
    filtered: nodes,
    filteredDependencies: dependCheckGroup,
    filteredBloated: bloatedCheckGroup,
    textDisplay: viewText,
    viewDependencyList: false,
    colorSelected: "color-type",
    filteredScope: scopeCheckGroup,
    viewOmitted: true,
}


//REDUCER
const appStateReducer = (state: AppState, action: Action): AppState => {

    switch (action.type) {
        case "SELECT_DEPENDENCY": {
            //set the filters
            state.filteredDependencies = action.payload;
            state.filteredProject.children = filterArtifacts(state.filteredProject.children, state.filteredScope, state.filteredDependencies);
            state.filtered = getTreeHierarchy(state.filteredProject, childrenAccessor);

            return {
                ...state

            }
        }

        case "SELECT_BLOAT": {
            state.filteredBloated = action.payload;
            state.filteredProject.children = highlightBloat(state.filteredProject.children, action.payload);
            state.filtered = getTreeHierarchy(state.filteredProject, childrenAccessor);

            return {
                ...state

            }
        }

        case "SELECT_SCOPE": {
            state.filteredScope = [...action.payload, "provided", "runtime", "system"];
            state.filteredProject.children = filterArtifacts(state.filteredProject.children, state.filteredScope, state.filteredDependencies);
            state.filtered = getTreeHierarchy(state.filteredProject, childrenAccessor);

            return {
                ...state

            }
        }

        case "SELECT_VIEW": {
            state.textDisplay = action.payload;
            return {
                ...state

            }
        }
        case "SELECT_COLOR": {
            state.colorSelected = action.payload;
            return {
                ...state
            }
        }
        case "LOAD_LOCAL_FILE": {

            state.project = action.payload;
            state.filteredProject = cloneProject(action.payload);
            const newNodes = d3.hierarchy(action.payload, childrenAccessor);
            state.nodes = newNodes;
            state.filtered = newNodes;
            return {
                ...state
            }
        }
        case "VIEW_DEPENDENCY_LIST": {
            state.viewDependencyList = action.payload;
            return {
                ...state
            }
        }
        case "RESET_FILTERS": {
            return {
                ...state,
                filteredDependencies: dependCheckGroup,
                filteredBloated: bloatedCheckGroup,
                colorSelected: "color-type",
                filteredScope: scopeCheckGroup,
            }
        }
        case "VIEW_OMITTED": {
            return {
                ...state,
                viewOmitted: action.payload
            }
        }



        default: {
            console.log("DEFAULT")
            return state
        }

    }
}

//A
const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps);

//Retrieve the value from AppStateContext using
//usecontext hook and return the result
export const useAppState = () => {
    return useContext(AppStateContext);
}



export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [state, dispatch] = useReducer(appStateReducer, appData)
    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}