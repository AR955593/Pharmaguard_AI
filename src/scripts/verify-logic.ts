import { parseVCF } from "../lib/vcfParser";
import { analyzeRisk } from "../lib/riskEngine";

const sampleVCF = `##fileformat=VCFv4.2
##INFO=<ID=GENE,Number=1,Type=String,Description="Gene symbol">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
22	42523945	rs3892097	C	T	.	PASS	GENE=CYP2D6	GT	0/1
22	42524947	rs1065852	G	A	.	PASS	GENE=CYP2D6	GT	1/1`;

async function runTest() {
    console.log("Starting verification...");

    // Test 1: VCF Parsing
    const variants = parseVCF(sampleVCF);
    console.log("Parsed Variants:", JSON.stringify(variants, null, 2));

    if (variants.length !== 2) {
        console.error("FAIL: Expected 2 variants.");
        process.exit(1);
    }

    // Test 2: Risk Analysis
    const result = await analyzeRisk(variants, "Codeine");
    console.log("Risk Analysis Result:", JSON.stringify(result, null, 2));

    if (result.risk_assessment.risk_label === "Unknown") {
        console.error("FAIL: Risk analysis returned Unknown.");
        process.exit(1);
    }

    console.log("Verification Passed!");
}

runTest();
