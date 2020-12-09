package se.kth.castor.depclean.web.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import se.kth.castor.depclean.web.model.Project;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
public class ProjectController {

   @GetMapping("/project")
   Project all() throws IOException {
      ObjectMapper objectMapper = new ObjectMapper();

      String content = Files.readString(Paths.get("/Users/cesarsv/IdeaProjects" +
              "/depclean-web/src/main/resources/templates/tmp/clothing/depclean-results.json"));

      Project listModel = objectMapper.readValue(content, new TypeReference<>() {
              }
                                                );
      return listModel;
   }

}
