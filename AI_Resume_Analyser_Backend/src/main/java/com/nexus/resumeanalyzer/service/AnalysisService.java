package com.nexus.resumeanalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexus.resumeanalyzer.entity.Analysis;
import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.entity.Skill;
import com.nexus.resumeanalyzer.entity.User;
import com.nexus.resumeanalyzer.repository.AnalysisRepository;
import com.nexus.resumeanalyzer.repository.ResumeRepository;
import com.nexus.resumeanalyzer.repository.SkillRepository;
import com.nexus.resumeanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AnalysisService {

    @Autowired
    private ParserService parserService;

    @Autowired
    private AIService aiService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String uploadDir = "uploads/resumes/";

    private static final String MOCK_FALLBACK_JSON = "{"
            + "\"atsScore\": 85,"
            + "\"roleMatchScore\": 82,"
            + "\"experienceScore\": 90,"
            + "\"overallFeedback\": \"[MOCK FALLBACK] The Gemini AI API is currently experiencing a global traffic spike (503 error). This is a fallback response so you can continue your demo. Your resume shows strong potential!\","
            + "\"matchedHardSkills\": [\"Java\", \"Spring Boot\", \"React\"],"
            + "\"matchedSoftSkills\": [\"Communication\", \"Problem Solving\"],"
            + "\"missingSkills\": [\"Docker\", \"Kubernetes\"],"
            + "\"suggestions\": ["
            + "  {\"category\": \"Formatting\", \"title\": \"Action Verbs\", \"description\": \"Start bullet points with strong action verbs.\"}"
            + "]"
            + "}";

    @Transactional
    public Analysis runResumeAnalysis(MultipartFile file, String role, Integer experience,
                                      String jobDescription, User user) throws IOException {

        // 1. Parse Document & Save to Disk
        String extractedText = parserService.parseResume(file);
        String savedFilePath = saveFileToDisk(file);

        // 2. Persist Initial Resume Record
        Resume resume = saveResumeRecord(user, file.getOriginalFilename(), savedFilePath, role, experience, jobDescription, extractedText);

        // 3. Fetch AI Analysis (with Fallback)
        String aiResponseJson = fetchAiResponse(extractedText, role, experience, jobDescription);

        // 4. Parse AI Response and Save Results
        return parseAndSaveAnalysis(aiResponseJson, resume);
    }

    public List<Analysis> getUserHistory(User user) {
        return analysisRepository.findByResumeUserOrderByAnalyzedAtDesc(user);
    }

    @Transactional
    public void deleteScanRecord(Long resumeId, String email) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found."));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new SecurityException("Unauthorized to delete this record.");
        }

        skillRepository.deleteByResume(resume);
        analysisRepository.findByResume(resume).ifPresent(analysisRepository::delete);
        resumeRepository.delete(resume);
    }

    public Map<String, Object> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalScans = resumeRepository.count();

        Double avgScoreObj = analysisRepository.findAverageAtsScore();
        double avgScore = avgScoreObj != null ? avgScoreObj : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalScans", totalScans);
        stats.put("avgAtsScore", Math.round(avgScore));
        stats.put("apiCost", 0.0);

        return stats;
    }

    public List<Resume> getAllScans() {
        return resumeRepository.findAllByOrderByUploadedAtDesc();
    }

    private String saveFileToDisk(MultipartFile file) throws IOException {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String uniqueFilename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filePath.toString();
    }

    private Resume saveResumeRecord(User user, String filename, String filePath, String role, Integer experience, String jobDescription, String rawText) {
        Resume resume = Resume.builder()
                .user(user)
                .fileName(filename)
                .filePath(filePath)
                .roleApplied(role)
                .experienceYears(experience)
                .jobDescription(jobDescription)
                .rawText(rawText)
                .build();
        return resumeRepository.save(resume);
    }

    private String fetchAiResponse(String extractedText, String role, Integer experience, String jobDescription) {
        try {
            return aiService.analyzeResume(extractedText, role, experience, jobDescription);
        } catch (Exception e) {
            System.err.println("NEXUS: Gemini API failed. Using Mock Fallback Data so demonstration can continue.");
            return MOCK_FALLBACK_JSON;
        }
    }

    private Analysis parseAndSaveAnalysis(String aiResponseJson, Resume resume) {
        int atsScore = 70;
        int roleScore = 70;
        int expScore = 70;
        String feedback = "Resume processed successfully.";
        String suggestionsJson = "[]";
        List<Skill> skillList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(aiResponseJson);
            atsScore = root.path("atsScore").asInt(70);
            roleScore = root.path("roleMatchScore").asInt(70);
            expScore = root.path("experienceScore").asInt(70);
            feedback = root.path("overallFeedback").asText("Resume parsed successfully.");

            // Store full response as suggestions for frontend parsing
            suggestionsJson = aiResponseJson;

            extractAndSaveSkills(root.path("matchedHardSkills"), Skill.SkillType.HARD, resume, skillList);
            extractAndSaveSkills(root.path("matchedSoftSkills"), Skill.SkillType.SOFT, resume, skillList);
            extractAndSaveSkills(root.path("missingSkills"), Skill.SkillType.MISSING, resume, skillList);

        } catch (Exception e) {
            System.err.println("NEXUS: Failed to parse Gemini JSON — " + e.getMessage());
            suggestionsJson = "[]";
        }

        Analysis analysis = Analysis.builder()
                .resume(resume)
                .atsScore(atsScore)
                .roleMatchScore(roleScore)
                .experienceScore(expScore)
                .overallFeedback(feedback)
                .suggestions(suggestionsJson)
                .build();
        analysis = analysisRepository.save(analysis);

        if (!skillList.isEmpty()) {
            skillRepository.saveAll(skillList);
        }

        return analysis;
    }

    private void extractAndSaveSkills(JsonNode node, Skill.SkillType type, Resume resume, List<Skill> list) {
        if (node != null && node.isArray()) {
            for (JsonNode element : node) {
                String skillName = element.asText().trim();
                if (!skillName.isEmpty()) {
                    list.add(Skill.builder()
                            .resume(resume)
                            .skillName(skillName)
                            .skillType(type)
                            .build());
                }
            }
        }
    }
}
