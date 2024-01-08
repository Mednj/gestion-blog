package com.naja.blogapp.web.rest;

import com.naja.blogapp.domain.Blogger;
import com.naja.blogapp.repository.BloggerRepository;
import com.naja.blogapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.naja.blogapp.domain.Blogger}.
 */
@RestController
@RequestMapping("/api/bloggers")
@Transactional
public class BloggerResource {

    private final Logger log = LoggerFactory.getLogger(BloggerResource.class);

    private static final String ENTITY_NAME = "blogger";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BloggerRepository bloggerRepository;

    public BloggerResource(BloggerRepository bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }

    /**
     * {@code POST  /bloggers} : Create a new blogger.
     *
     * @param blogger the blogger to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blogger, or with status {@code 400 (Bad Request)} if the blogger has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Blogger> createBlogger(@RequestBody Blogger blogger) throws URISyntaxException {
        log.debug("REST request to save Blogger : {}", blogger);
        if (blogger.getId() != null) {
            throw new BadRequestAlertException("A new blogger cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Blogger result = bloggerRepository.save(blogger);
        return ResponseEntity
            .created(new URI("/api/bloggers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bloggers/:id} : Updates an existing blogger.
     *
     * @param id the id of the blogger to save.
     * @param blogger the blogger to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blogger,
     * or with status {@code 400 (Bad Request)} if the blogger is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blogger couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Blogger> updateBlogger(@PathVariable(value = "id", required = false) final Long id, @RequestBody Blogger blogger)
        throws URISyntaxException {
        log.debug("REST request to update Blogger : {}, {}", id, blogger);
        if (blogger.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blogger.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bloggerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Blogger result = bloggerRepository.save(blogger);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, blogger.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bloggers/:id} : Partial updates given fields of an existing blogger, field will ignore if it is null
     *
     * @param id the id of the blogger to save.
     * @param blogger the blogger to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blogger,
     * or with status {@code 400 (Bad Request)} if the blogger is not valid,
     * or with status {@code 404 (Not Found)} if the blogger is not found,
     * or with status {@code 500 (Internal Server Error)} if the blogger couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Blogger> partialUpdateBlogger(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Blogger blogger
    ) throws URISyntaxException {
        log.debug("REST request to partial update Blogger partially : {}, {}", id, blogger);
        if (blogger.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blogger.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bloggerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Blogger> result = bloggerRepository
            .findById(blogger.getId())
            .map(existingBlogger -> {
                if (blogger.getUsername() != null) {
                    existingBlogger.setUsername(blogger.getUsername());
                }
                if (blogger.getFirstName() != null) {
                    existingBlogger.setFirstName(blogger.getFirstName());
                }
                if (blogger.getLastName() != null) {
                    existingBlogger.setLastName(blogger.getLastName());
                }
                if (blogger.getEmail() != null) {
                    existingBlogger.setEmail(blogger.getEmail());
                }
                if (blogger.getProfileImage() != null) {
                    existingBlogger.setProfileImage(blogger.getProfileImage());
                }
                if (blogger.getProfileImageContentType() != null) {
                    existingBlogger.setProfileImageContentType(blogger.getProfileImageContentType());
                }

                return existingBlogger;
            })
            .map(bloggerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, blogger.getId().toString())
        );
    }

    /**
     * {@code GET  /bloggers} : get all the bloggers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bloggers in body.
     */
    @GetMapping("")
    public List<Blogger> getAllBloggers() {
        log.debug("REST request to get all Bloggers");
        return bloggerRepository.findAll();
    }

    /**
     * {@code GET  /bloggers/:id} : get the "id" blogger.
     *
     * @param id the id of the blogger to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blogger, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Blogger> getBlogger(@PathVariable("id") Long id) {
        log.debug("REST request to get Blogger : {}", id);
        Optional<Blogger> blogger = bloggerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blogger);
    }

    /**
     * {@code DELETE  /bloggers/:id} : delete the "id" blogger.
     *
     * @param id the id of the blogger to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogger(@PathVariable("id") Long id) {
        log.debug("REST request to delete Blogger : {}", id);
        bloggerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
