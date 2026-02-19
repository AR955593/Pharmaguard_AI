import { Variant } from "@/types";

const TARGET_GENES = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD", "G6PD", "HLA-B"];

export const parseVCF = (vcfContent: string): Variant[] => {
    const lines = vcfContent.split("\n");
    const variants: Variant[] = [];

    for (const line of lines) {
        if (line.startsWith("#") || line.trim() === "") {
            continue;
        }

        const fields = line.split("\t");
        // Standard VCF fields: CHROM POS ID REF ALT QUAL FILTER INFO ...
        // Index 7 is INFO
        if (fields.length < 8) continue;

        const info = fields[7];
        const rsid = fields[2] !== "." ? fields[2] : "";

        // Parse INFO tag to find GENE
        const infoMap: Record<string, string> = {};
        info.split(";").forEach((item) => {
            const parts = item.split("=");
            if (parts.length === 2) {
                infoMap[parts[0]] = parts[1];
            }
        });

        const gene = infoMap["GENE"];

        if (gene && TARGET_GENES.includes(gene)) {
            // genotype usually in FORMAT column (index 8) and sample data (index 9)
            // For this simplified parser, we'll try to extract genotype from INFO or assume standard 0/1, 1/1 if GT is present
            // However, the prompt says "Structure: Standard VCF with INFO tags (GENE, STAR, RS)"
            // If VCF is standard, we need to look at sample column. 
            // Let's assume the VCF might be a standard single-sample VCF.
            // We need to parse the GT (Genotype) field from the sample column if available.

            let genotype = "Unknown";
            if (fields.length >= 10) {
                const formatStr = fields[8];
                const sampleStr = fields[9];
                const formatKeys = formatStr.split(":");
                const gtIndex = formatKeys.indexOf("GT");
                if (gtIndex !== -1) {
                    const sampleValues = sampleStr.split(":");
                    genotype = sampleValues[gtIndex];
                }
            }

            variants.push({
                rsid: rsid || infoMap["RS"] || `chr${fields[0]}:${fields[1]}`,
                gene: gene,
                genotype: genotype
            });
        }
    }

    return variants;
};
