package se.kth.castor.depclean.web.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;

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
   private String[] allTypes;
   private String[] usedTypes;
   private Double usageRatio;
   private Project[] children;

   @JsonCreator
   public Project(@JsonProperty("id") String id,
                  @JsonProperty("coordinates") String coordinates,
                  @JsonProperty("groupId") String groupId,
                  @JsonProperty("artifactId") String artifactId,
                  @JsonProperty("version") String version,
                  @JsonProperty("scope") String scope,
                  @JsonProperty("packaging") String packaging,
                  @JsonProperty("omitted") Boolean omitted,
                  @JsonProperty("size") Integer size,
                  @JsonProperty("type") String type,
                  @JsonProperty("status") String status,
                  @JsonProperty("parent") String parent,
                  @JsonProperty("allTypes") String[] allTypes,
                  @JsonProperty("usedTypes") String[] usedTypes,
                  @JsonProperty("usageRatio") Double usageRatio,
                  @JsonProperty("children") Project[] children) {
      this.id = id;
      this.coordinates = coordinates;
      this.groupId = groupId;
      this.artifactId = artifactId;
      this.version = version;
      this.scope = scope;
      this.packaging = packaging;
      this.omitted = omitted;
      this.size = size;
      this.type = type;
      this.status = status;
      this.parent = parent;
      this.allTypes = allTypes;
      this.usedTypes = usedTypes;
      this.usageRatio = usageRatio;
      this.children = children;
   }
}
