package in.udaansetu.platform.opportunity;

import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class OpportunityIngestionExceptionHandler {
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, Object>> invalid(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "code", "REQUEST_REJECTED",
                "message", exception.getMessage() == null ? "The request could not be processed." : exception.getMessage(),
                "timestamp", Instant.now().toString()));
    }
}
