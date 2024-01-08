package com.naja.blogapp.domain;

import static com.naja.blogapp.domain.BlogTestSamples.*;
import static com.naja.blogapp.domain.BloggerTestSamples.*;
import static com.naja.blogapp.domain.CommentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naja.blogapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BlogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Blog.class);
        Blog blog1 = getBlogSample1();
        Blog blog2 = new Blog();
        assertThat(blog1).isNotEqualTo(blog2);

        blog2.setId(blog1.getId());
        assertThat(blog1).isEqualTo(blog2);

        blog2 = getBlogSample2();
        assertThat(blog1).isNotEqualTo(blog2);
    }

    @Test
    void commentsTest() throws Exception {
        Blog blog = getBlogRandomSampleGenerator();
        Comment commentBack = getCommentRandomSampleGenerator();

        blog.addComments(commentBack);
        assertThat(blog.getComments()).containsOnly(commentBack);
        assertThat(commentBack.getBlog()).isEqualTo(blog);

        blog.removeComments(commentBack);
        assertThat(blog.getComments()).doesNotContain(commentBack);
        assertThat(commentBack.getBlog()).isNull();

        blog.comments(new HashSet<>(Set.of(commentBack)));
        assertThat(blog.getComments()).containsOnly(commentBack);
        assertThat(commentBack.getBlog()).isEqualTo(blog);

        blog.setComments(new HashSet<>());
        assertThat(blog.getComments()).doesNotContain(commentBack);
        assertThat(commentBack.getBlog()).isNull();
    }

    @Test
    void bloggerTest() throws Exception {
        Blog blog = getBlogRandomSampleGenerator();
        Blogger bloggerBack = getBloggerRandomSampleGenerator();

        blog.setBlogger(bloggerBack);
        assertThat(blog.getBlogger()).isEqualTo(bloggerBack);

        blog.blogger(null);
        assertThat(blog.getBlogger()).isNull();
    }
}
