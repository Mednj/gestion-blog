package com.naja.blogapp.domain;

import static com.naja.blogapp.domain.BlogTestSamples.*;
import static com.naja.blogapp.domain.CommentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naja.blogapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Comment.class);
        Comment comment1 = getCommentSample1();
        Comment comment2 = new Comment();
        assertThat(comment1).isNotEqualTo(comment2);

        comment2.setId(comment1.getId());
        assertThat(comment1).isEqualTo(comment2);

        comment2 = getCommentSample2();
        assertThat(comment1).isNotEqualTo(comment2);
    }

    @Test
    void blogTest() throws Exception {
        Comment comment = getCommentRandomSampleGenerator();
        Blog blogBack = getBlogRandomSampleGenerator();

        comment.setBlog(blogBack);
        assertThat(comment.getBlog()).isEqualTo(blogBack);

        comment.blog(null);
        assertThat(comment.getBlog()).isNull();
    }
}
