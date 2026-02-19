export type RiskLabel = "Safe" | "Adjust Dosage" | "Toxic" | "Ineffective" | "Unknown";

export type RiskSeverity = "none" | "low" | "moderate" | "high" | "critical";

export type Phenotype = "PM" | "IM" | "NM" | "RM" | "URM" | "Unknown";

export interface Variant {
  rsid: string;
  gene: string;
  genotype: string;
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: Phenotype;
  detected_variants: Variant[];
}

export interface RiskAssessment {
  risk_label: RiskLabel;
  confidence_score: number;
  severity: RiskSeverity;
}

export interface ClinicalRecommendation {
  recommendation: string;
  dosing_guideline?: string;
  alternatives?: string[];
}

export interface LLMExplanation {
  summary: string;
  mechanism_of_action?: string;
  citations?: string[];
}

export interface AnalysisResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMExplanation;
  quality_metrics: {
    vcf_parsing_success: boolean;
    variant_coverage: number;
  };
}
