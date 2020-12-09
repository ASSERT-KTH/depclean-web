package se.kth.castor.depclean.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import se.kth.castor.depclean.web.logic.Logic;
import se.kth.castor.depclean.web.model.Project;
import se.kth.castor.depclean.web.model.Repo;

import java.io.IOException;

@Slf4j
@Controller
public class HomeController {

    @GetMapping("/")
    public String homePageForm(Model model) {
        Repo repo = new Repo();
        repo.setName("cesarsotovalero/clothing");
        model.addAttribute("repo", repo);
        return "/home/home";
    }

    @PostMapping("/home/home")
    public Project submitRepo(Repo repo) throws IOException {
        log.info("Processing repo: " + repo.getName());
        Logic logic = new Logic();
        logic.processRepo(repo.getName());
        ProjectController projectController = new ProjectController();
        return projectController.all();
    }
}
