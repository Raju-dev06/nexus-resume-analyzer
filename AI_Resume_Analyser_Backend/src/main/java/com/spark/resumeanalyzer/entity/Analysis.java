package com.nexus.resumeanalyzer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @Column(name = "ats_score", nullable = false)
    private Integer atsScore;

    @Column(name = "role_match_score", nullable = false)
    private Integer roleMatchScore;

    @Column(name = "experience_score", nullable = false)
    private Integer experienceScore;

    @Lob
    @Column(name = "overall_feedback", nullable = false, columnDefinition = "TEXT")
    private String overallFeedback;

    @Lob
    @Column(name = "suggestions", nullable = false, columnDefinition = "TEXT") // Store suggestions list as JSON string
    private String suggestions;

    @Column(name = "analyzed_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime analyzedAt = LocalDateTime.now();
}
