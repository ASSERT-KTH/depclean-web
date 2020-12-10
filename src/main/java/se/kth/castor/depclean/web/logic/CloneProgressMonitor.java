package se.kth.castor.depclean.web.logic;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.lib.ProgressMonitor;

@Slf4j
class CloneProgressMonitor implements ProgressMonitor {

   @Override
   public void start(int totalTasks) {
      log.info("Starting work on " + totalTasks + " tasks");
   }

   @Override
   public void beginTask(String title, int totalWork) {
      log.info("Start " + title + ": " + totalWork);
   }

   @Override
   public void update(int completed) {
   }

   @Override
   public void endTask() {
      log.info("Done!");
   }

   @Override
   public boolean isCancelled() {
      return false;
   }
}
