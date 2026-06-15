package com.nexus.resumeanalyzer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class JobService {

    @Value("${jsearch.api.url}")
    private String apiUrl;

    @Value("${jsearch.api.host}")
    private String apiHost;

    @Value("${jsearch.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    public String searchJobs(String role, String skills) {
        if ("YOUR_RAPIDAPI_KEY_HERE".equals(apiKey) || apiKey.isEmpty()) {
            // Return a mocked response or error if API key isn't set, to avoid crashing.
            return "{\"error\": \"JSearch API Key not configured. Please add it to application.properties.\"}";
        }

        try {
            // Build the query: role + top skills
            String query = role + " " + skills;
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = apiUrl + "?query=" + encodedQuery + "&page=1&num_pages=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("X-RapidAPI-Key", apiKey)
                    .header("X-RapidAPI-Host", apiHost)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return response.body();
            } else {
                return "{\"error\": \"Failed to fetch jobs from API: " + response.statusCode() + "\"}";
            }
        } catch (Exception e) {
            System.err.println("Job fetch error: " + e.getMessage());
            return "{\"error\": \"Exception occurred while fetching jobs.\"}";
        }
    }
}
