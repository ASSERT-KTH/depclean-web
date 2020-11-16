package se.kth.castor.depclean.web.logic;

import fr.dutra.tools.maven.deptree.core.ParseException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class App {

    // private static final String repositoryName = "INRIA/spoon";
    private static final String repositoryName = "AsyncHttpClient/async-http-client";
    private static final File clonedRepositoryDir = new File("cloned-repository" + "/" + repositoryName.split("/")[1]);

    public static void main(String[] args) throws IOException, GitAPIException, ParseException {
        GitHubRepo gitHubRepo = new GitHubRepo(repositoryName);
        Cmd cmd = new Cmd(clonedRepositoryDir);
        GitRepo gitRepo = null;

        if (!clonedRepositoryDir.exists()) {
            gitRepo = gitHubRepo.remoteRepository(clonedRepositoryDir);
        }

        Git git = Git.open(clonedRepositoryDir);

        List<String> tagNames = new ArrayList<>();
        git.tagList()
                .call()
                .forEach(a -> tagNames.add(a.getName().split("/")[a.getName().split("/").length - 1]));

        // TODO checkout the tag and apply DepClean there
        for (String tagName : tagNames) {
            git.checkout()
                    .setName(tagName)
                    .call();
            File treeTXT = new File("cloned-repository" + "/" + "dependency-tree-" + tagName + ".txt");
            File treeJSON = new File("cloned-repository" + "/" + "dependency-tree-" + tagName + ".json");
            File depcleanTXT = new File("cloned-repository" + "/" + "depclean" + tagName + ".txt");

            cmd.dependencyTree(treeTXT);

            DepTree depTree = new DepTree(treeTXT.getAbsolutePath());
            FileUtils.write(treeJSON, depTree.parseTreeToJSON());

            cmd.compileProject();
            FileUtils.write(depcleanTXT, cmd.depCleanResult().toString());

        }
    }
}
