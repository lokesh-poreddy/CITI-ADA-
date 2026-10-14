package in.udaansetu.platform.voice;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/voice")
public class VoiceCapabilitiesController {
    @GetMapping("/capabilities")
    public Map<String, Object> capabilities() {
        return Map.of(
                "mode", "browser-capability-detected",
                "languageTags", List.of("en-IN", "hi-IN", "ta-IN"),
                "speechRecognitionProvider", "browser-native-if-supported",
                "speechSynthesisProvider", "browser-native-if-supported",
                "offlineGuarantee", false,
                "notice", "Browser speech support and offline availability vary by device and language. Text input remains available.");
    }
}
