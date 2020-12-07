package se.kth.castor.depclean.web.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Repo {

    private String name;

    public Repo(String name) {
        this.name = name;
    }
}
