package com.civicpulse.service;

import com.civicpulse.dto.AiAnalysisResultDto;
import org.springframework.web.multipart.MultipartFile;

public interface AiAnalysisService {
    AiAnalysisResultDto analyzeImage(MultipartFile file, String description);
}
