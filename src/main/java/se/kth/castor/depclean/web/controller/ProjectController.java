package se.kth.castor.depclean.web.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.kth.castor.depclean.web.logic.Logic;
import se.kth.castor.depclean.web.model.Project;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@Slf4j
public class ProjectController {

   @GetMapping("/project/{user}/{repo}")
   Project all(@PathVariable String user, @PathVariable String repo) throws IOException {
      String repoName = user + "/" + repo;

      log.info("Processing repo: " + user + repo);
      Logic logic = new Logic();
      logic.processRepo(repoName);

      log.info("Getting JSON file");
      ObjectMapper objectMapper = new ObjectMapper();
      String localPathToRepo = "src/main/resources/templates/tmp/" + repo;
      String content = Files.readString(Paths.get(localPathToRepo + "/depclean-results.json"));

      Project listModel = objectMapper.readValue(content, new TypeReference<>() {
              }
                                                );

      // clean up here to not keep using more and more disk-space for these samples
      // FileUtils.deleteDirectory(new File(localPathToRepo));
      return listModel;
   }

}
