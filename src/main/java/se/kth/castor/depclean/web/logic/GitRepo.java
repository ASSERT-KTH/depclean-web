package se.kth.castor.depclean.web.logic;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class GitRepo {

    private final String remoteURL;
    private Git git;

    public GitRepo(String remoteURL) {
        this.remoteURL = remoteURL;
    }

    public void cloneRepository(File destinationDir) throws IOException, GitAPIException {
        // prepare a new folder for the cloned repository
        URL fileUrl = new URL("file://" + destinationDir.getAbsolutePath());
        File destinationFile = FileUtils.toFile(fileUrl);
        // then clone
        log.info("Cloning from " + remoteURL + " to " + fileUrl);
        this.git = Git.cloneRepository()
                .setURI(remoteURL)
                .setDirectory(destinationFile)
                .setBranch("master")
                .setProgressMonitor(new CloneProgressMonitor())
                .call();
        // Note: the call() returns an opened repository already which needs to be closed to avoid file handle leaks!
        log.info("Having repository: " + git.getRepository().getDirectory());
        git.close();

        // clean up here to not keep using more and more disk-space for these samples
        // FileUtils.deleteDirectory(localPath);
    }

    public void checkoutTag(String tagName) throws GitAPIException {
        git.checkout()
                .setName(tagName)
                .call();
    }

    public List<String> tagNames() throws GitAPIException {
        List<String> tags = new ArrayList<>();
        git.tagList().call().forEach(a -> tags.add(a.getName()));
        return tags;
    }
}

