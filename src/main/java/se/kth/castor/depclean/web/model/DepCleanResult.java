package se.kth.castor.depclean.web.model;

import lombok.Data;

@Data
public class DepCleanResult {

    private final String result;

    public DepCleanResult(String result) {
        this.result = result;
    }
}
