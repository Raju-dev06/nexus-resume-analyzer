package com.nexus.resumeanalyzer.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ParserService {

    /**
     * Extracts raw text from an uploaded resume file (PDF or DOCX).
     *
     * @param file the uploaded multipart file
     * @return the extracted raw text as a String
     * @throws IOException if an error occurs during reading or parsing
     */
    public String parseResume(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Invalid file: filename is null.");
        }

        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        
        try (InputStream inputStream = file.getInputStream()) {
            if ("pdf".equals(extension)) {
                return extractTextFromPdf(inputStream);
            } else if ("docx".equals(extension)) {
                return extractTextFromDocx(inputStream);
            } else {
                throw new IllegalArgumentException("Unsupported file format. Please upload PDF or DOCX.");
            }
        }
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            if (document.isEncrypted()) {
                throw new IllegalArgumentException("Encrypted PDF document cannot be parsed.");
            }
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        }
    }

    private String extractTextFromDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            try (XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
                return extractor.getText();
            }
        }
    }
}
