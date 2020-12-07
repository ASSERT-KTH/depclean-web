package se.kth.castor.depclean.web.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class Project {

    private String id;
    private String coordinates;
    private String groupId;
    private String artifactId;
    private String version;
    private String scope;
    private String packaging;
    private Boolean omitted;
    private Integer size;
    private String type;
    private String status;
    private String parent;
    private List<String> allTypes;
    private List<String> usedTypes;
    private Double usageRatio;
    private Project children;

    @Override
    public String toString() {
        return "Project{" +
                "id='" + id + '\'' +
                ", coordinates='" + coordinates + '\'' +
                ", groupId='" + groupId + '\'' +
                ", artifactId='" + artifactId + '\'' +
                ", version='" + version + '\'' +
                ", scope='" + scope + '\'' +
                ", packaging='" + packaging + '\'' +
                ", omitted=" + omitted +
                ", size=" + size +
                ", type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", parent='" + parent + '\'' +
                ", allTypes=" + allTypes +
                ", usedTypes=" + usedTypes +
                ", usageRatio=" + usageRatio +
                '}';
    }
}
