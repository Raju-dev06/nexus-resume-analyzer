package com.nexus.resumeanalyzer.repository;

import com.nexus.resumeanalyzer.entity.Analysis;
import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    Optional<Analysis> findByResume(Resume resume);
    
    @Query("SELECT a FROM Analysis a JOIN FETCH a.resume r WHERE r.user = :user ORDER BY a.analyzedAt DESC")
    List<Analysis> findByResumeUserOrderByAnalyzedAtDesc(@Param("user") User user);

    @Query("SELECT AVG(a.atsScore) FROM Analysis a")
    Double findAverageAtsScore();
}
