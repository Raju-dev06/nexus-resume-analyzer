package com.nexus.resumeanalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(java.time.Duration.ofSeconds(60))
            .build();
            
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String ATS_PROMPT_TEMPLATE = 
            "You are an expert recruiter and Applicant Tracking System (ATS) evaluator. " +
            "Evaluate the following resume against the target role: '%s', experience required: '%d years', " +
            "and Job Description: '%s'.\n\n" +
            "Resume Text:\n%s\n\n" +
            "Provide a JSON response containing precisely these keys:\n" +
            "- atsScore (number from 0 to 100)\n" +
            "- roleMatchScore (number from 0 to 100)\n" +
            "- experienceScore (number from 0 to 100)\n" +
            "- overallFeedback (string summarizing the assessment)\n" +
            "- matchedHardSkills (array of strings found in resume)\n" +
            "- matchedSoftSkills (array of strings found in resume)\n" +
            "- missingSkills (array of strings missing for this role)\n" +
            "- suggestions (array of objects with keys: category, title, description)\n" +
            "Ensure output is pure raw JSON without markdown markers.";

    /**
     * Semantically analyzes resume raw text against target parameters via Google Gemini models.
     *
     * @param resumeText the parsed text of the resume
     * @param role the target job role
     * @param experience the candidate's years of experience
     * @param jobDescription the optional job description text
     * @return JSON formatted analysis details
     */
    public String analyzeResume(String resumeText, String role, Integer experience, String jobDescription) {
        try {
            String prompt = String.format(
                ATS_PROMPT_TEMPLATE,
                role, experience, jobDescription != null ? jobDescription : "N/A", resumeText
            );

            // Construct JSON request body safely using ObjectMapper
            java.util.Map<String, Object> requestBodyMap = java.util.Map.of(
                "contents", java.util.List.of(
                    java.util.Map.of(
                        "parts", java.util.List.of(
                            java.util.Map.of("text", prompt)
                        )
                    )
                )
            );
            String requestBody = objectMapper.writeValueAsString(requestBodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                // Parse the Gemini response structure
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                
                String extractedJson = textNode.asText();
                // Sometimes models wrap JSON in markdown block like ```json ... ```
                if (extractedJson.startsWith("```json")) {
                    extractedJson = extractedJson.substring(7, extractedJson.length() - 3).trim();
                } else if (extractedJson.startsWith("```")) {
                    extractedJson = extractedJson.substring(3, extractedJson.length() - 3).trim();
                }
                
                return extractedJson;
            } else {
                System.err.println("Gemini API returned status code: " + response.statusCode() + ". Body: " + response.body());
                throw new RuntimeException("AI Analysis failed due to API error.");
            }

        } catch (Exception e) {
            System.err.println("Gemini transaction failure: " + e.getMessage());
            throw new RuntimeException("Critical processing failure occurred: " + e.getMessage(), e);
        }
    }
}
