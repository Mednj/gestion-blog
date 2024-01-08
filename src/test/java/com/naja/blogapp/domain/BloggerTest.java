package com.naja.blogapp.domain;

import static com.naja.blogapp.domain.BlogTestSamples.*;
import static com.naja.blogapp.domain.BloggerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naja.blogapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BloggerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Blogger.class);
        Blogger blogger1 = getBloggerSample1();
        Blogger blogger2 = new Blogger();
        assertThat(blogger1).isNotEqualTo(blogger2);

        blogger2.setId(blogger1.getId());
        assertThat(blogger1).isEqualTo(blogger2);

        blogger2 = getBloggerSample2();
        assertThat(blogger1).isNotEqualTo(blogger2);
    }

    @Test
    void blogsTest() throws Exception {
        Blogger blogger = getBloggerRandomSampleGenerator();
        Blog blogBack = getBlogRandomSampleGenerator();

        blogger.addBlogs(blogBack);
        assertThat(blogger.getBlogs()).containsOnly(blogBack);
        assertThat(blogBack.getBlogger()).isEqualTo(blogger);

        blogger.removeBlogs(blogBack);
        assertThat(blogger.getBlogs()).doesNotContain(blogBack);
        assertThat(blogBack.getBlogger()).isNull();

        blogger.blogs(new HashSet<>(Set.of(blogBack)));
        assertThat(blogger.getBlogs()).containsOnly(blogBack);
        assertThat(blogBack.getBlogger()).isEqualTo(blogger);

        blogger.setBlogs(new HashSet<>());
        assertThat(blogger.getBlogs()).doesNotContain(blogBack);
        assertThat(blogBack.getBlogger()).isNull();
    }
}
