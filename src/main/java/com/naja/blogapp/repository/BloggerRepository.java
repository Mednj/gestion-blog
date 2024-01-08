package com.naja.blogapp.repository;

import com.naja.blogapp.domain.Blogger;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Blogger entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloggerRepository extends JpaRepository<Blogger, Long> {}
