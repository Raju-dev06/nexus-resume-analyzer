package com.nexus.resumeanalyzer.controller;

import com.nexus.resumeanalyzer.entity.Analysis;
import com.nexus.resumeanalyzer.entity.User;
import com.nexus.resumeanalyzer.service.AnalysisService;
import com.nexus.resumeanalyzer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private UserService userService;

    /**
     * Uploads and analyzes a resume file against specific job parameters.
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> uploadAndAnalyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam("role") String role,
            @RequestParam("experience") Integer experience,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) throws Exception {

        System.out.println("ANALYZE API HIT");

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a non-empty document.");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User profile not found. Please log in.");
        }

        Analysis analysis = analysisService.runResumeAnalysis(file, role, experience, jobDescription, userOpt.get());

        // Return clean response containing score highlights. Full details available via relationship.
        return ResponseEntity.ok(analysis);
    }

    /**
     * Retrieves resume history logs scoped by candidate email.
     */
    @GetMapping("/history")
    public ResponseEntity<?> getUserHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User profile not found.");
        }

        List<Analysis> analyses = analysisService.getUserHistory(userOpt.get());
        return ResponseEntity.ok(analyses);
    }

    /**
     * Deletes a specific scan record from candidate logs.
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteScanRecord(@PathVariable("id") Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            analysisService.deleteScanRecord(id, email);
            return ResponseEntity.ok("Scan log deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
