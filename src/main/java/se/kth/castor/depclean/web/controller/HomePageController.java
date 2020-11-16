package se.kth.castor.depclean.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Calendar;

@Controller
public class HomePageController {

    @Value("${spring.application.name}")
    String appName;

    String today;

    @GetMapping("/")
    public String homePage(Model model) {
        model.addAttribute("appName", appName);
        Calendar cal = Calendar.getInstance();
        today = cal.getTime().toString();
        model.addAttribute("today", today);
        return "/home/home";
    }

    // @RequestMapping(value="/edit", method= RequestMethod.POST, params="action=save")
    // public ModelAndView save() {
    //
    //
    // }

}
