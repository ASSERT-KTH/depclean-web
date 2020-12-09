package se.kth.castor.depclean.web;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class BinaryTreeNodeTest {
   @Test
   public void binaryTreeNodeTest() throws IOException {
      ObjectMapper objectMapper = new ObjectMapper();
        /*
             2
            / \
           1   10
              /
             5
        */
      final String jsonStr = "{\n"
              + "  \"value\": 2,\n"
              + "  \"left\": {\n"
              + "    \"value\": 1,\n"
              + "    \"left\": null,\n"
              + "    \"right\": null\n"
              + "  },\n" + "  \"right\": {\n"
              + "    \"value\": 10,\n"
              + "    \"left\": {\n"
              + "      \"value\": 5,\n"
              + "      \"left\": null,\n"
              + "      \"right\": null\n"
              + "    },\n"
              + "    \"right\": null\n"
              + "  }\n"
              + "}";
      System.out.println(jsonStr);
      final BinaryTreeNode<Integer> intTree = objectMapper.readValue(jsonStr,
              new TypeReference<>() {
              }
                                                                    );
      final List<Integer> listExpected = Arrays.asList(2, 1, 10, 5);
      assertEquals(listExpected, intTree.preOrder());
   }

   public static class BinaryTreeNode<E> {
      public E value;
      public BinaryTreeNode left;
      public BinaryTreeNode right;

      @JsonCreator
      public BinaryTreeNode(@JsonProperty("value") final E value) {
         this.value = value;
      }

      private static <E> void preOrder(BinaryTreeNode<E> root, ArrayList<E> result) {
         if (root == null) {
            return;
         }

         result.add(root.value);
         if (root.left != null) {
            preOrder(root.left, result);
         }
         if (root.right != null) {
            preOrder(root.right, result);
         }
      }

      ArrayList<E> preOrder() {
         final ArrayList<E> result = new ArrayList<>();
         if (this.value == null) {
            return result;
         }
         preOrder(this, result);
         return result;
      }
   }
}

