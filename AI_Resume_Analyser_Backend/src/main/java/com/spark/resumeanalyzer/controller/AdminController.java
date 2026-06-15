package com.nexus.resumeanalyzer.controller;

import com.nexus.resumeanalyzer.entity.Analysis;
import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.repository.AnalysisRepository;
import com.nexus.resumeanalyzer.repository.ResumeRepository;
import com.nexus.resumeanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AnalysisRepository analysisRepository;

    /**
     * Real system stats — no fake inflation numbers.
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalScans = resumeRepository.count();

        List<Analysis> analyses = analysisRepository.findAll();
        double avgScore = 0.0;
        if (!analyses.isEmpty()) {
            double sum = analyses.stream().mapToInt(Analysis::getAtsScore).sum();
            avgScore = sum / analyses.size();
        }

        // Real API cost — $0 for Gemini free tier
        double totalCost = 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);   // real count only
        stats.put("totalScans", totalScans);   // real count only
        stats.put("avgAtsScore", Math.round(avgScore > 0 ? avgScore : 0));
        stats.put("apiCost", totalCost);       // real cost (0 on Gemini free tier)

        return ResponseEntity.ok(stats);
    }

    /**
     * All resumes across platform for admin auditing.
     */
    @GetMapping("/scans")
    public ResponseEntity<List<Resume>> getAllScans() {
        List<Resume> allScans = resumeRepository.findAllByOrderByUploadedAtDesc();
        return ResponseEntity.ok(allScans);
    }
}
