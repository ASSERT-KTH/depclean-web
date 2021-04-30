interface report {
    direct: number,
    inherited: number,
    transitive: number
}
interface project {
    tittle: string,
    id: number,
    version: string,
    cleanURL: string,
    gitURL: string,
    img: string,
    normalReport: report,
    depCleanReport: report,
    description: string,
}

interface gallery {
    children: project[]
}

export const galleryData: gallery = {
    children: [
        {
            tittle: "Spoon",
            id: 0,
            version: "9.1.0-SNAPSHOT",
            cleanURL: "spoon",
            gitURL: "https://github.com/INRIA/spoon",
            img: "img.spoon.jpg",
            normalReport: {
                direct: 16,
                inherited: 25,
                transitive: 5
            },
            depCleanReport: {
                direct: 0,
                inherited: 2,
                transitive: 2
            },
            description: "Spoon is an open-source library to analyze, rewrite, transform, transpile Java source code. "
        },
        {
            tittle: "Spork",
            id: 1,
            version: "0.5.0-SNAPSHOT",
            cleanURL: "spork",
            gitURL: "https://github.com/KTH/spork",
            img: "img.spork.jpg",
            normalReport: {
                direct: 10,
                inherited: 52,
                transitive: 0
            },
            depCleanReport: {
                direct: 2,
                inherited: 17,
                transitive: 0
            },
            description: "Spork is an AST based structured merge tool for Java."
        },
        {
            tittle: "Sorald",
            id: 2,
            version: "0.1.1-SNAPSHOT",
            cleanURL: "sorald",
            gitURL: "https://github.com/SpoonLabs/sorald",
            img: "img.sorald.jpg",
            normalReport: {
                direct: 16,
                inherited: 83,
                transitive: 0
            },
            depCleanReport: {
                direct: 2,
                inherited: 25,
                transitive: 0
            },
            description: "Sorald is a tool to automatically repair violations of static analysis rules checked with SonarQube. "
        },
        {
            tittle: "sat4j",
            id: 3,
            version: "3.0.0-SNAPSHOT",
            cleanURL: "sat4j",
            gitURL: "https://gitlab.ow2.org/sat4j/sat4j",
            img: "img.sat4j.jpg",
            normalReport: {
                direct: 10,
                inherited: 8,
                transitive: 2
            },
            depCleanReport: {
                direct: 0,
                inherited: 0,
                transitive: 0
            },
            description: "Sorald is a tool to automatically repair violations of static analysis rules checked with SonarQube. "
        },
        {
            tittle: "Maven core",
            id: 4,
            version: "3.7.0-SNAPSHOT",
            cleanURL: "maven-core",
            gitURL: "https://github.com/apache/maven",
            img: "img.mavenCore.jpg",
            normalReport: {
                direct: 26,
                inherited: 1,
                transitive: 25
            },
            depCleanReport: {
                direct: 2,
                inherited: 0,
                transitive: 20
            },
            description: "Apache Maven is a software project management and comprehension tool. "
        },
        {
            tittle: "Flink core",
            id: 5,
            version: "1.12-SNAPSHOT",
            cleanURL: "flink-core",
            gitURL: "https://github.com/apache/flink",
            img: "img.flinkCore.jpg",
            normalReport: {
                direct: 13,
                inherited: 12,
                transitive: 10
            },
            depCleanReport: {
                direct: 2,
                inherited: 5,
                transitive: 5
            },
            description: "Apache Flink is an open source stream processing framework with powerful stream- and batch-processing capabilities"
        },
        {
            tittle: "Quarkus",
            id: 6,
            version: "999-SNAPSHOT",
            cleanURL: "quarkus-core-runtime",
            gitURL: "https://github.com/quarkusio/quarkus",
            img: "img.quarkus.jpg",
            normalReport: {
                direct: 18,
                inherited: 0,
                transitive: 24
            },
            depCleanReport: {
                direct: 4,
                inherited: 0,
                transitive: 18
            },
            description: "A Kubernetes Native Java stack tailored for OpenJDK HotSpot and GraalVM"
        },
    ]
}
