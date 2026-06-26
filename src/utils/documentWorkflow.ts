import { DocumentStep } from "../enums/DocumentStep";
import { UserRole } from "../types/user.types";

export class DocumentWorkflow {
    /**
     * Complete workflow sequence
     */
    private static readonly WORKFLOW: DocumentStep[] = [
        DocumentStep.FACULTY_MA_UPLOAD,

        DocumentStep.SAR_APPROVAL,

        DocumentStep.FACULTY_AR_APPROVAL,

        DocumentStep.DEPARTMENT_HEAD_APPROVAL,

        DocumentStep.DEPARTMENT_MA_APPROVAL,

        DocumentStep.DEPARTMENT_HEAD_RETURN,

        DocumentStep.FACULTY_AR_RETURN,

        DocumentStep.SAR_RETURN,

        DocumentStep.FACULTY_MA_FINAL,
    ];

    private static readonly ROLE_STEP_MAP: Record<UserRole, DocumentStep[]> = {
        [UserRole.ADMIN]: [],

        [UserRole.STUDENT_SERVICE_SAR]: [
            DocumentStep.SAR_APPROVAL,
            DocumentStep.SAR_RETURN,
        ],

        [UserRole.FACULTY_AR]: [
            DocumentStep.FACULTY_AR_APPROVAL,
            DocumentStep.FACULTY_AR_RETURN,
        ],

        [UserRole.FACULTY_MA]: [
            DocumentStep.FACULTY_MA_FINAL,
        ],

        [UserRole.DEPARTMENT_HEAD]: [
            DocumentStep.DEPARTMENT_HEAD_APPROVAL,
            DocumentStep.DEPARTMENT_HEAD_RETURN,
        ],

        [UserRole.DEPARTMENT_MA]: [
            DocumentStep.DEPARTMENT_MA_APPROVAL,
        ],

        [UserRole.STUDENT]: [],
    };


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

    /**
    * Returns all workflow steps handled by a role
    */
    static getStepsByRole(role: UserRole): DocumentStep[] {
        return this.ROLE_STEP_MAP[role] ?? [];
    }

    /**
    * Checks whether a role can handle a workflow step
    */
    static canRoleHandleStep(
        role: UserRole,
        step: DocumentStep
    ): boolean {
        const allowedSteps = this.getStepsByRole(role);

        return allowedSteps.includes(step);
    }
}