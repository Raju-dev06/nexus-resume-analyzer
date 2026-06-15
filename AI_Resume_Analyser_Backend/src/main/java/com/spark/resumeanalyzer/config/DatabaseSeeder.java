package com.nexus.resumeanalyzer.config;

import com.nexus.resumeanalyzer.entity.Analysis;
import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.entity.Skill;
import com.nexus.resumeanalyzer.entity.User;
import com.nexus.resumeanalyzer.repository.AnalysisRepository;
import com.nexus.resumeanalyzer.repository.ResumeRepository;
import com.nexus.resumeanalyzer.repository.SkillRepository;
import com.nexus.resumeanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // injected from SecurityConfig bean

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("NEXUS: Seeding database with demo accounts...");

            // Admin user — password hashed with BCrypt
            User admin = User.builder()
                    .username("Admin Nexus")
                    .email("admin@nexus.ai")
                    .password(passwordEncoder.encode("admin123")) // hashed
                    .role("ADMIN")
                    .build();
            admin = userRepository.save(admin);

            // Demo candidate — password hashed with BCrypt
            User candidate = User.builder()
                    .username("John Doe")
                    .email("user@nexus.ai")
                    .password(passwordEncoder.encode("user123")) // hashed
                    .role("USER")
                    .build();
            candidate = userRepository.save(candidate);

            // Demo resume for candidate
            Resume resume = Resume.builder()
                    .user(candidate)
                    .fileName("John_Doe_Java_Developer.pdf")
                    .filePath("uploads/resumes/seed_john_doe_resume.pdf")
                    .roleApplied("Senior Java Backend Engineer")
                    .experienceYears(6)
                    .jobDescription("Seeking a Senior Java Developer with expertise in Spring Boot, MySQL, JPA, Microservices, and Docker.")
                    .rawText("John Doe - Senior Software Engineer. Experience: 6 years. Key skills: Java 21, Spring Boot, Spring Data JPA, Hibernate, MySQL Database, RESTful APIs, Apache Maven.")
                    .uploadedAt(LocalDateTime.now().minusDays(2))
                    .build();
            resume = resumeRepository.save(resume);

            // Demo analysis
            String suggestionsJson = "["
                    + "{\"category\":\"Keyword Optimization\",\"title\":\"Add Microservices terminology\","
                    + "\"description\":\"Your resume is missing Microservices Architecture and Docker keywords. ATS systems flag resumes lacking these.\"},"
                    + "{\"category\":\"Action Language\",\"title\":\"Use stronger action verbs\","
                    + "\"description\":\"Replace passive phrases like 'responsible for' with 'Engineered', 'Spearheaded', or 'Architected'.\"}"
                    + "]";

            Analysis analysis = Analysis.builder()
                    .resume(resume)
                    .atsScore(82)
                    .roleMatchScore(85)
                    .experienceScore(90)
                    .overallFeedback("Strong candidate for Java Backend roles. ATS score of 82% places you in the top tier. Adding Microservices and Docker terminology will push you above 90%.")
                    .suggestions(suggestionsJson)
                    .analyzedAt(LocalDateTime.now().minusDays(2))
                    .build();
            analysisRepository.save(analysis);

            // Demo skills
            List<Skill> skills = Arrays.asList(
                    Skill.builder().resume(resume).skillName("Java 21").skillType(Skill.SkillType.HARD).build(),
                    Skill.builder().resume(resume).skillName("Spring Boot").skillType(Skill.SkillType.HARD).build(),
                    Skill.builder().resume(resume).skillName("Spring Data JPA").skillType(Skill.SkillType.HARD).build(),
                    Skill.builder().resume(resume).skillName("MySQL Database").skillType(Skill.SkillType.HARD).build(),
                    Skill.builder().resume(resume).skillName("RESTful APIs").skillType(Skill.SkillType.HARD).build(),
                    Skill.builder().resume(resume).skillName("Apache Maven").skillType(Skill.SkillType.HARD).build(),
                    Skill.builder().resume(resume).skillName("Analytical Thinking").skillType(Skill.SkillType.SOFT).build(),
                    Skill.builder().resume(resume).skillName("Problem Solving").skillType(Skill.SkillType.SOFT).build(),
                    Skill.builder().resume(resume).skillName("Collaboration").skillType(Skill.SkillType.SOFT).build(),
                    Skill.builder().resume(resume).skillName("Microservices Architecture").skillType(Skill.SkillType.MISSING).build(),
                    Skill.builder().resume(resume).skillName("Docker & Kubernetes").skillType(Skill.SkillType.MISSING).build()
            );
            skillRepository.saveAll(skills);

            System.out.println("NEXUS: Seeded. Login: admin@nexus.ai / admin123  |  user@nexus.ai / user123");
        } else {
            System.out.println("NEXUS: Database already populated. Skipping seeder.");
        }
    }
}
