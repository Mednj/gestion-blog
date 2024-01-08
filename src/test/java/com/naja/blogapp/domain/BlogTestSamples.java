package com.naja.blogapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class BlogTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Blog getBlogSample1() {
        return new Blog().id(1L).title("title1");
    }

    public static Blog getBlogSample2() {
        return new Blog().id(2L).title("title2");
    }

    public static Blog getBlogRandomSampleGenerator() {
        return new Blog().id(longCount.incrementAndGet()).title(UUID.randomUUID().toString());
    }
}
