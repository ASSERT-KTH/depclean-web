FROM maven:3.6.3-jdk-11
RUN apt-get install -y git
RUN git clone https://github.com/castor-software/depclean.git;cd depclean;mvn clean install
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]