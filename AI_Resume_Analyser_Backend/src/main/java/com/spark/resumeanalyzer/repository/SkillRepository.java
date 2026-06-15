package com.nexus.resumeanalyzer.repository;

import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByResume(Resume resume);
    void deleteByResume(Resume resume);
}
