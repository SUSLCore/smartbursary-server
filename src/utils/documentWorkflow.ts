import { DocumentStep } from "../enums/DocumentStep";

export class DocumentWorkflow {
  /**
   * Complete workflow sequence
   */
  private static readonly WORKFLOW: DocumentStep[] = [
    DocumentStep.FACULTY_MA_UPLOAD,

    DocumentStep.SAR_APPROVAL,

    DocumentStep.FACULTY_ASR_APPROVAL,

    DocumentStep.DEPARTMENT_HEAD_APPROVAL,

    DocumentStep.DEPARTMENT_MA_APPROVAL,

    DocumentStep.DEPARTMENT_HEAD_RETURN,

    DocumentStep.FACULTY_ASR_RETURN,

    DocumentStep.SAR_RETURN,

    DocumentStep.FACULTY_MA_FINAL,
  ];

  /**
   * Returns next workflow step
   */
  static getNextStep(currentStep: DocumentStep): DocumentStep | null {
    const index = this.WORKFLOW.indexOf(currentStep);

    if (index === -1) {
      throw new Error("Invalid workflow step.");
    }

    if (index === this.WORKFLOW.length - 1) {
      return null;
    }

    return this.WORKFLOW[index + 1];
  }

  /**
   * Returns previous workflow step
   */
  static getPreviousStep(currentStep: DocumentStep): DocumentStep | null {
    const index = this.WORKFLOW.indexOf(currentStep);

    if (index <= 0) {
      return null;
    }

    return this.WORKFLOW[index - 1];
  }

  /**
   * Is workflow finished?
   */
  static isFinalStep(step: DocumentStep): boolean {
    return step === DocumentStep.FACULTY_MA_FINAL;
  }

  /**
   * Validate workflow step
   */
  static isValidStep(step: string): boolean {
    return this.WORKFLOW.includes(step as DocumentStep);
  }

  /**
   * Return all workflow steps
   */
  static getWorkflow(): DocumentStep[] {
    return [...this.WORKFLOW];
  }
}