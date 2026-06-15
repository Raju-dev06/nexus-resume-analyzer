package com.nexus.resumeanalyzer.repository;

import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    List<Resume> findAllByOrderByUploadedAtDesc();
}
