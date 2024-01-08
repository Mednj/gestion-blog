package com.naja.blogapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Blog.
 */
@Entity
@Table(name = "blog")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Blog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Lob
    @Column(name = "content")
    private String content;

    @Column(name = "date")
    private ZonedDateTime date;

    @Lob
    @Column(name = "main_image")
    private byte[] mainImage;

    @Column(name = "main_image_content_type")
    private String mainImageContentType;

    @Lob
    @Column(name = "document")
    private byte[] document;

    @Column(name = "document_content_type")
    private String documentContentType;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "blog")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blog" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "blogs" }, allowSetters = true)
    private Blogger blogger;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Blog id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Blog title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public Blog content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Blog date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public byte[] getMainImage() {
        return this.mainImage;
    }

    public Blog mainImage(byte[] mainImage) {
        this.setMainImage(mainImage);
        return this;
    }

    public void setMainImage(byte[] mainImage) {
        this.mainImage = mainImage;
    }

    public String getMainImageContentType() {
        return this.mainImageContentType;
    }

    public Blog mainImageContentType(String mainImageContentType) {
        this.mainImageContentType = mainImageContentType;
        return this;
    }

    public void setMainImageContentType(String mainImageContentType) {
        this.mainImageContentType = mainImageContentType;
    }

    public byte[] getDocument() {
        return this.document;
    }

    public Blog document(byte[] document) {
        this.setDocument(document);
        return this;
    }

    public void setDocument(byte[] document) {
        this.document = document;
    }

    public String getDocumentContentType() {
        return this.documentContentType;
    }

    public Blog documentContentType(String documentContentType) {
        this.documentContentType = documentContentType;
        return this;
    }

    public void setDocumentContentType(String documentContentType) {
        this.documentContentType = documentContentType;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setBlog(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setBlog(this));
        }
        this.comments = comments;
    }

    public Blog comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public Blog addComments(Comment comment) {
        this.comments.add(comment);
        comment.setBlog(this);
        return this;
    }

    public Blog removeComments(Comment comment) {
        this.comments.remove(comment);
        comment.setBlog(null);
        return this;
    }

    public Blogger getBlogger() {
        return this.blogger;
    }

    public void setBlogger(Blogger blogger) {
        this.blogger = blogger;
    }

    public Blog blogger(Blogger blogger) {
        this.setBlogger(blogger);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Blog)) {
            return false;
        }
        return getId() != null && getId().equals(((Blog) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Blog{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", content='" + getContent() + "'" +
            ", date='" + getDate() + "'" +
            ", mainImage='" + getMainImage() + "'" +
            ", mainImageContentType='" + getMainImageContentType() + "'" +
            ", document='" + getDocument() + "'" +
            ", documentContentType='" + getDocumentContentType() + "'" +
            "}";
    }
}
