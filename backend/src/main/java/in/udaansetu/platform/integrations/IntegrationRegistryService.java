package in.udaansetu.platform.integrations;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class IntegrationRegistryService {
    private final List<IntegrationDescriptor> descriptors = List.of(
        new IntegrationDescriptor("LOCAL_OPPORTUNITY_CATALOGUE","UdaanSetu local catalogue","Browse locally curated opportunity and partner-listing records",IntegrationStatus.READY,"Available in this prototype; data is in-memory and resets on restart.",false),
        new IntegrationDescriptor("DIKSHA","DIKSHA","Explore integration for curriculum-linked resources",IntegrationStatus.NOT_CONFIGURED,"Confirm API documentation, credentials, permitted scopes and terms with the provider before enabling.",false),
        new IntegrationDescriptor("SKILL_INDIA","Skill India Digital Hub","Explore permitted skills and training references",IntegrationStatus.NOT_CONFIGURED,"Use approved public information or a provider-authorized interface; do not assume an open API.",false),
        new IntegrationDescriptor("NATIONAL_CAREER_SERVICE","National Career Service","Explore career and employment reference handoffs",IntegrationStatus.NOT_CONFIGURED,"Confirm approved integration route, source freshness and reuse terms.",false),
        new IntegrationDescriptor("BHASHINI","BHASHINI","Language-service adapter integration point",IntegrationStatus.NOT_CONFIGURED,"Configure an authorized speech/translation service adapter and protect credentials on the server.",false)
    );
    public List<IntegrationDescriptor> list(){ return descriptors; }
    public IntegrationDescriptor get(String id){return descriptors.stream().filter(d->d.id().equalsIgnoreCase(id)).findFirst().orElseThrow(()->new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,"Integration adapter not found."));}
}
