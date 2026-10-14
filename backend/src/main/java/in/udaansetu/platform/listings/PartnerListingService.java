package in.udaansetu.platform.listings;

import in.udaansetu.platform.listings.PartnerListingDtos.*;
import java.net.URI;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PartnerListingService {
    private final Map<String, PartnerListing> listings = new ConcurrentHashMap<>();
    public PartnerListingService() {
        seed("listing-demo-apprenticeship", "Illustrative electrical maintenance apprenticeship", "Example training partner (demo)", ListingKind.APPRENTICESHIP, "Chennai / nearby district", "On-site", "Example listing to demonstrate the workflow. Not a live vacancy.", "https://example.org/apprenticeships", "https://example.org/apprenticeships", null);
        seed("listing-demo-internship", "Illustrative community technology internship", "Example NGO partner (demo)", ListingKind.INTERNSHIP, "Hybrid · Tamil Nadu", "Hybrid", "Example listing to demonstrate accessible technology work. Not a live vacancy.", "https://example.org/internships", "https://example.org/internships", null);
    }
    private void seed(String id, String title, String org, ListingKind kind, String location, String mode, String description, String apply, String source, java.time.LocalDate deadline) {
        listings.put(id,new PartnerListing(id,"demo-partner",title,org,description,location,mode,kind,"Illustrative requirements only; verify with the provider.",apply,source,deadline,ListingStatus.PUBLISHED,true,true,Instant.now(),Instant.now(),"Demo listing only"));
    }
    public List<PartnerListing> browse(String kind, String location, String query) {
        ListingKind filter = null;
        if (kind != null && !kind.isBlank() && !kind.equalsIgnoreCase("ALL")) {
            try { filter=ListingKind.valueOf(kind.toUpperCase()); } catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unsupported listing kind."); }
        }
        final ListingKind f=filter; final String q=clean(query).toLowerCase(); final String loc=clean(location).toLowerCase();
        return listings.values().stream().filter(x -> x.status()==ListingStatus.PUBLISHED && x.organizationVerified())
                .filter(x -> x.deadline()==null || !x.deadline().isBefore(LocalDate.now(ZoneId.of("Asia/Kolkata"))))
                .filter(x -> f==null || x.kind()==f).filter(x -> loc.isBlank() || x.location().toLowerCase().contains(loc))
                .filter(x -> q.isBlank() || (x.title()+" "+x.organization()+" "+x.description()+" "+x.eligibilitySummary()).toLowerCase().contains(q))
                .sorted(Comparator.comparing(PartnerListing::demoListing).thenComparing(PartnerListing::updatedAt, Comparator.reverseOrder())).toList();
    }

    public List<PartnerListing> reviewQueue() {
        return listings.values().stream().filter(l -> l.status()==ListingStatus.PENDING_REVIEW && !l.demoListing())
                .sorted(Comparator.comparing(PartnerListing::createdAt)).toList();
    }

    public List<PartnerListing> mine(String partnerKey) { requireActor(partnerKey); return listings.values().stream().filter(l -> l.partnerKey().equals(partnerKey)).sorted(Comparator.comparing(PartnerListing::createdAt).reversed()).toList(); }
    public PartnerListing create(String partnerKey, ListingCreateRequest request) {
        requireActor(partnerKey);
        ListingKind kind; try { kind=ListingKind.valueOf(request.kind().toUpperCase()); } catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unsupported listing kind."); }
        validateUrl(request.applicationUrl(), "Application URL"); if (request.sourceUrl()!=null && !request.sourceUrl().isBlank()) validateUrl(request.sourceUrl(),"Source URL");
        PartnerListing listing=new PartnerListing("listing-"+UUID.randomUUID(),partnerKey,clean(request.title()),clean(request.organization()),clean(request.description()),clean(request.location()),clean(request.workMode()),kind,clean(request.eligibilitySummary()),clean(request.applicationUrl()),clean(request.sourceUrl()),request.deadline(),ListingStatus.DRAFT,false,false,Instant.now(),Instant.now(),"");
        listings.put(listing.id(),listing); return listing;
    }
    public PartnerListing submit(String partnerKey,String id) { PartnerListing l=owned(partnerKey,id); if (l.status()!=ListingStatus.DRAFT && l.status()!=ListingStatus.REJECTED) throw new ResponseStatusException(HttpStatus.CONFLICT,"Only draft or rejected listings can be submitted."); return replace(l,ListingStatus.PENDING_REVIEW,false,"Submitted for review"); }
    public PartnerListing review(String id, ListingReviewRequest request) {
        PartnerListing l=listings.get(id); if(l==null || l.demoListing()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Reviewable listing not found.");
        String d=clean(request.decision()).toUpperCase(); if(!d.equals("APPROVE") && !d.equals("REJECT")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Decision must be APPROVE or REJECT.");
        if(l.status()!=ListingStatus.PENDING_REVIEW) throw new ResponseStatusException(HttpStatus.CONFLICT,"Listing is not pending review.");
        return replace(l,d.equals("APPROVE")?ListingStatus.PUBLISHED:ListingStatus.REJECTED,d.equals("APPROVE"),clean(request.note()));
    }
    private PartnerListing replace(PartnerListing l,ListingStatus status,boolean verified,String note) { PartnerListing updated=new PartnerListing(l.id(),l.partnerKey(),l.title(),l.organization(),l.description(),l.location(),l.workMode(),l.kind(),l.eligibilitySummary(),l.applicationUrl(),l.sourceUrl(),l.deadline(),status,verified,l.demoListing(),l.createdAt(),Instant.now(),note); listings.put(l.id(),updated); return updated; }
    private PartnerListing owned(String actor,String id) { requireActor(actor); PartnerListing l=listings.get(id); if(l==null||!l.partnerKey().equals(actor)||l.demoListing()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Partner listing not found."); return l; }
    private static void validateUrl(String raw,String label) { try { URI uri=URI.create(raw); if(!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost()==null) throw new IllegalArgumentException(); } catch(Exception ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,label+" must be a valid HTTPS URL."); } }
    private static void requireActor(String actor) { if(actor==null||actor.isBlank()||actor.length()>80) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"A valid partner key is required."); }
    private static String clean(String s) { return s==null?"":s.trim(); }
}
