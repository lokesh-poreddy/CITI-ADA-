package in.udaansetu.platform.sustainability;

import in.udaansetu.platform.sustainability.SustainabilityDtos.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SustainabilityService {
    private final Map<String, InterestRecord> interests = new ConcurrentHashMap<>();
    private final List<RevenueModel> models = List.of(
        new RevenueModel("CSR_SPONSORSHIP","CSR or foundation sponsorship","CSR programmes, foundations or impact funders","Sponsor learner access, facilitator enablement or a defined local pilot; validate outcomes and cost per learner.","Core student access and opportunity ranking remain free; report outcomes transparently."),
        new RevenueModel("INSTITUTIONAL_LICENSE","Institution or NGO license","Schools, colleges, NGOs or skilling partners","Provide facilitated cohort support, content tools and reporting to an institution.","Do not expose more learner data than the institution is authorized to see."),
        new RevenueModel("FACILITATOR_MODULES","Facilitator-created modules","Institutions, sponsors or learners depending on an approved model","Allow modules to be free, sponsored or priced after quality and affordability checks.","Show price and terms clearly; do not imply a payment has occurred in this prototype."),
        new RevenueModel("PARTNER_SERVICE","Verified partner services","Employers or training providers","Explore clearly disclosed provider services or listing administration.","Paid placement must not influence career recommendations or eligibility outcomes.")
    );
    public SustainabilityOverview overview(){return new SustainabilityOverview("Core student discovery, public-opportunity navigation and official-source links stay free in this proposal.",models,List.of("Who has purchasing authority?","What evidence of learner/facilitator value is needed?","What price is affordable and sustainable?","Can a sponsor fund access without steering recommendations?"),"No payment processor or checkout is connected. No payment is collected.");}
    public InterestRecord submitInterest(InterestRequest request){
        if(models.stream().noneMatch(m->m.id().equals(request.modelId())))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Select a supported sustainability model.");
        if(!request.consentToFollowUp()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Follow-up consent is required to store a partnership enquiry.");
        InterestRecord item=new InterestRecord("interest-"+UUID.randomUUID(),request.organizationName().trim(),request.organizationType().trim(),request.modelId(),request.approximateLearners(),request.contactEmail()==null?"":request.contactEmail().trim(),request.notes()==null?"":request.notes().trim(),true,"RECEIVED_FOR_DEMO_REVIEW",Instant.now()); interests.put(item.id(),item); return item;
    }
}
