package com.nexus.resumeanalyzer.controller;

import com.nexus.resumeanalyzer.entity.Resume;
import com.nexus.resumeanalyzer.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AnalysisService analysisService;

    /**
     * Real system stats — optimized to use SQL aggregations instead of RAM iteration.
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        return ResponseEntity.ok(analysisService.getSystemStats());
    }

    /**
     * All resumes across platform for admin auditing.
     */
    @GetMapping("/scans")
    public ResponseEntity<List<Resume>> getAllScans() {
        return ResponseEntity.ok(analysisService.getAllScans());
    }
}
