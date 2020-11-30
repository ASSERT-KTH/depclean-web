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
            tittle: "Maven core",
            id: 1,
            version: "3.7.0-SNAPSHOT",
            cleanURL: "maven-core.json",
            gitURL: "https://github.com/apache/maven",
            img: "maven.jpg",
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
            tittle: "Apache Flink core",
            id: 2,
            version: "1.12-SNAPSHOT",
            cleanURL: "flink-core.json",
            gitURL: "https://github.com/apache/flink",
            img: "flink.jpg",
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
            tittle: "Aquarkus",
            id: 3,
            version: "999-SNAPSHOT",
            cleanURL: "quarkus-core-runtime.json",
            gitURL: "https://github.com/quarkusio/quarkus",
            img: "quarkus.jpg",
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
