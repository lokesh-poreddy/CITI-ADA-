package in.udaansetu.platform.integrations;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/partners/integrations")
public class IntegrationController {
    private final IntegrationRegistryService registry;
    public IntegrationController(IntegrationRegistryService registry){this.registry=registry;}
    @GetMapping public List<IntegrationDescriptor> list(){return registry.list();}
    @GetMapping("/{id}") public IntegrationDescriptor get(@PathVariable String id){return registry.get(id);}
}
