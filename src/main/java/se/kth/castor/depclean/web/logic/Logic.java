package se.kth.castor.depclean.web.logic;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class Logic {

    public void processRepo(String repoName) throws IOException {
        // String repoName = "cesarsotovalero/clothing";
        // String repoName = "INRIA/spoon";
        // String repoName = "AsyncHttpClient/async-http-client";
        File repoDir = new File("src/main/resources/templates/tmp" + File.separator + repoName.split("/")[1]);

        // Clone the repository
        cloneRepo(repoName, repoDir);

        // Execute maven plugins
        Cmd cmd = new Cmd(repoDir);
        cmd.compileSources();
        cmd.compileTestSources();
        cmd.executeDepClean();
    }

    /**
     * Clone a github repo to a custom repository.
     * @return The GitRepo object of the cloned repo
     * @param repoName The name of the repo, given as user/repo
     * @param repoDir The directory to be cloned to
     * @throws IOException
     */
    private GitRepo cloneRepo(String repoName, File repoDir) throws IOException {
        GitHubRepo gitHubRepo = new GitHubRepo(repoName);
        GitRepo gitRepo = null;
        if (!repoDir.exists()) {
            gitRepo = gitHubRepo.cloneRepository(repoDir);
        }
        return gitRepo;
    }

    /**
     * Gives the list of all tags in a git repository.
     *
     * @param repoDir The directory containing the repo
     * @return A list with the names of the tags
     * @throws GitAPIException
     * @throws IOException
     */
    private List<String> tags(File repoDir) throws GitAPIException, IOException {
        List<String> listOfTagNames = new ArrayList<>();
        try (Git git = Git.open(repoDir)) {
            git.tagList()
                    .call()
                    .forEach(a -> listOfTagNames.add(a.getName().split("/")[a.getName().split("/").length - 1]));
        }
        return listOfTagNames;
    }

    /**
     * Executes the Maven dependency tree on each tag of a given Git project.
     * @param git The Git project
     * @param listOfTagNames The list of tags to checkout
     * @param cmd A cmd to run the Maven plugins
     * @throws GitAPIException
     */
    private void executeDependencyTreeForEachTag(Git git, List<String> listOfTagNames, Cmd cmd) throws GitAPIException {
        for (String tagName : listOfTagNames) {
            git.checkout()
                    .setName(tagName)
                    .call();
            File treeTXT = new File("cloned-repository" + "/" + "dependency-tree-" + tagName + ".txt");
            cmd.dependencyTree(treeTXT);
        }
    }
}
