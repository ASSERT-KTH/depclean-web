package se.kth.castor.depclean.web.logic;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GHTag;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * This class allows to access the metadata of a repository in GitHub.
 */
@Slf4j
public class GitHubRepo {

   /**
    * The name of the repository in the form [user-on-github]/[name-of-the-repository]]
    */
   private final String repoName;

   /**
    * A repository on GitHub.
    */
   private final GHRepository ghRepository;

   public GitHubRepo(String repoName) throws IOException {
      this.repoName = repoName;
      GitHub github = GitHubBuilder.fromEnvironment().build();
      ghRepository = github.getRepository(repoName);
   }

   public int nbForks() {
      return ghRepository.getForksCount();
   }

   public String repositoryName() {
      return repoName;
   }

   public List<GHTag> tags() throws IOException {
      return ghRepository.listTags().toList();
   }

   public String url() {
      return ghRepository.getHtmlUrl().toString();
   }

   /**
    * Clones a repository into a folder in the file system using the GitHub repository name.
    *
    * @param repoDir The path where the repository is going to be placed.
    * @return A GitRepo.
    * @throws IOException
    */
   public GitRepo cloneRepository(File repoDir) throws IOException {
      // clone the repository
      var remoteRepository = new GitRepo(url());
      try {
         FileUtils.forceMkdir(repoDir);
         remoteRepository.cloneRepository(repoDir);
      } catch (GitAPIException e) {
         log.error("Unable to clone the repository from GitHub.");
      }
      return remoteRepository;
   }
}
