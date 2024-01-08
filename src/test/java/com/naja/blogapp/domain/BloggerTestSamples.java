package com.naja.blogapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class BloggerTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Blogger getBloggerSample1() {
        return new Blogger().id(1L).username("username1").firstName("firstName1").lastName("lastName1").email("email1");
    }

    public static Blogger getBloggerSample2() {
        return new Blogger().id(2L).username("username2").firstName("firstName2").lastName("lastName2").email("email2");
    }

    public static Blogger getBloggerRandomSampleGenerator() {
        return new Blogger()
            .id(longCount.incrementAndGet())
            .username(UUID.randomUUID().toString())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString());
    }
}
