package in.udaansetu.platform.opportunity;

public class OpportunityNotFoundException extends RuntimeException {
    public OpportunityNotFoundException(String id) { super("Opportunity not found: " + id); }
}
