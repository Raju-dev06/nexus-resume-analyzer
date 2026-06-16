package com.nexus.resumeanalyzer.controller;

import com.nexus.resumeanalyzer.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/match")
    public ResponseEntity<?> getMatchingJobs(@RequestParam("role") String role, @RequestParam(value = "skills", defaultValue = "") String skills) {
        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Role parameter is required\"}");
        }
        
        String jobData = jobService.searchJobs(role, skills);
        
        // Ensure it returns a JSON response
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(jobData);
    }
}
