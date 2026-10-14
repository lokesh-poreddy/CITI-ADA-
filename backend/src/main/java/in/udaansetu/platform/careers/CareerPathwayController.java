package in.udaansetu.platform.careers;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CareerPathwayController {
    private final CareerPathwayService service;
    public CareerPathwayController(CareerPathwayService service) { this.service = service; }

    @GetMapping("/career-pathways")
    public List<CareerPathwaySummary> catalogue() { return service.list(); }

    @PostMapping("/career-pathways/recommendations")
    public CareerRecommendationResponse recommendations(@Valid @RequestBody CareerRecommendationRequest request) {
        return service.recommend(request.learnerId());
    }

    @GetMapping("/learning-pathways/{pathwayId}")
    public LearningPathwayResponse learningPlan(@PathVariable String pathwayId) { return service.detail(pathwayId); }
}
