package in.udaansetu.platform.opportunity;

import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class OpportunityExceptionHandler {
    @ExceptionHandler(OpportunityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> notFound(OpportunityNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("code", "OPPORTUNITY_NOT_FOUND", "message", "The opportunity could not be found.", "timestamp", Instant.now().toString()));
    }
}
