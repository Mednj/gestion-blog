package com.naja.blogapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.naja.blogapp.IntegrationTest;
import com.naja.blogapp.domain.Blogger;
import com.naja.blogapp.repository.BloggerRepository;
import jakarta.persistence.EntityManager;
import java.util.Base64;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BloggerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BloggerResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PROFILE_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/bloggers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BloggerRepository bloggerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBloggerMockMvc;

    private Blogger blogger;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Blogger createEntity(EntityManager em) {
        Blogger blogger = new Blogger()
            .username(DEFAULT_USERNAME)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .profileImage(DEFAULT_PROFILE_IMAGE)
            .profileImageContentType(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE);
        return blogger;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Blogger createUpdatedEntity(EntityManager em) {
        Blogger blogger = new Blogger()
            .username(UPDATED_USERNAME)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
        return blogger;
    }

    @BeforeEach
    public void initTest() {
        blogger = createEntity(em);
    }

    @Test
    @Transactional
    void createBlogger() throws Exception {
        int databaseSizeBeforeCreate = bloggerRepository.findAll().size();
        // Create the Blogger
        restBloggerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogger)))
            .andExpect(status().isCreated());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeCreate + 1);
        Blogger testBlogger = bloggerList.get(bloggerList.size() - 1);
        assertThat(testBlogger.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testBlogger.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testBlogger.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testBlogger.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testBlogger.getProfileImage()).isEqualTo(DEFAULT_PROFILE_IMAGE);
        assertThat(testBlogger.getProfileImageContentType()).isEqualTo(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createBloggerWithExistingId() throws Exception {
        // Create the Blogger with an existing ID
        blogger.setId(1L);

        int databaseSizeBeforeCreate = bloggerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloggerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogger)))
            .andExpect(status().isBadRequest());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBloggers() throws Exception {
        // Initialize the database
        bloggerRepository.saveAndFlush(blogger);

        // Get all the bloggerList
        restBloggerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blogger.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].profileImageContentType").value(hasItem(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profileImage").value(hasItem(Base64.getEncoder().encodeToString(DEFAULT_PROFILE_IMAGE))));
    }

    @Test
    @Transactional
    void getBlogger() throws Exception {
        // Initialize the database
        bloggerRepository.saveAndFlush(blogger);

        // Get the blogger
        restBloggerMockMvc
            .perform(get(ENTITY_API_URL_ID, blogger.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blogger.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.profileImageContentType").value(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.profileImage").value(Base64.getEncoder().encodeToString(DEFAULT_PROFILE_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingBlogger() throws Exception {
        // Get the blogger
        restBloggerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBlogger() throws Exception {
        // Initialize the database
        bloggerRepository.saveAndFlush(blogger);

        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();

        // Update the blogger
        Blogger updatedBlogger = bloggerRepository.findById(blogger.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBlogger are not directly saved in db
        em.detach(updatedBlogger);
        updatedBlogger
            .username(UPDATED_USERNAME)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);

        restBloggerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlogger.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlogger))
            )
            .andExpect(status().isOk());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
        Blogger testBlogger = bloggerList.get(bloggerList.size() - 1);
        assertThat(testBlogger.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testBlogger.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testBlogger.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testBlogger.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBlogger.getProfileImage()).isEqualTo(UPDATED_PROFILE_IMAGE);
        assertThat(testBlogger.getProfileImageContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingBlogger() throws Exception {
        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();
        blogger.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloggerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blogger.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blogger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlogger() throws Exception {
        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();
        blogger.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloggerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blogger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlogger() throws Exception {
        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();
        blogger.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloggerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogger)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBloggerWithPatch() throws Exception {
        // Initialize the database
        bloggerRepository.saveAndFlush(blogger);

        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();

        // Update the blogger using partial update
        Blogger partialUpdatedBlogger = new Blogger();
        partialUpdatedBlogger.setId(blogger.getId());

        partialUpdatedBlogger
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);

        restBloggerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlogger.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlogger))
            )
            .andExpect(status().isOk());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
        Blogger testBlogger = bloggerList.get(bloggerList.size() - 1);
        assertThat(testBlogger.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testBlogger.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testBlogger.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testBlogger.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testBlogger.getProfileImage()).isEqualTo(UPDATED_PROFILE_IMAGE);
        assertThat(testBlogger.getProfileImageContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateBloggerWithPatch() throws Exception {
        // Initialize the database
        bloggerRepository.saveAndFlush(blogger);

        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();

        // Update the blogger using partial update
        Blogger partialUpdatedBlogger = new Blogger();
        partialUpdatedBlogger.setId(blogger.getId());

        partialUpdatedBlogger
            .username(UPDATED_USERNAME)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);

        restBloggerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlogger.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlogger))
            )
            .andExpect(status().isOk());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
        Blogger testBlogger = bloggerList.get(bloggerList.size() - 1);
        assertThat(testBlogger.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testBlogger.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testBlogger.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testBlogger.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBlogger.getProfileImage()).isEqualTo(UPDATED_PROFILE_IMAGE);
        assertThat(testBlogger.getProfileImageContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingBlogger() throws Exception {
        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();
        blogger.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloggerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blogger.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blogger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlogger() throws Exception {
        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();
        blogger.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloggerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blogger))
            )
            .andExpect(status().isBadRequest());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlogger() throws Exception {
        int databaseSizeBeforeUpdate = bloggerRepository.findAll().size();
        blogger.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloggerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(blogger)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Blogger in the database
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlogger() throws Exception {
        // Initialize the database
        bloggerRepository.saveAndFlush(blogger);

        int databaseSizeBeforeDelete = bloggerRepository.findAll().size();

        // Delete the blogger
        restBloggerMockMvc
            .perform(delete(ENTITY_API_URL_ID, blogger.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Blogger> bloggerList = bloggerRepository.findAll();
        assertThat(bloggerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
