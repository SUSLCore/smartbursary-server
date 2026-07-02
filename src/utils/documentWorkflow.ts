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


    static getPreviousStep(currentStep: DocumentStep): DocumentStep | null {
        const index = this.WORKFLOW.indexOf(currentStep);

        if (index <= 0) {
            return null;
        }

        return this.WORKFLOW[index - 1];
    }


    static isFinalStep(step: DocumentStep): boolean {
        return step === DocumentStep.FACULTY_MA_FINAL;
    }


    static isValidStep(step: string): boolean {
        return this.WORKFLOW.includes(step as DocumentStep);
    }


    static getWorkflow(): DocumentStep[] {
        return [...this.WORKFLOW];
    }


    static getStepsByRole(role: UserRole): DocumentStep[] {
        return this.ROLE_STEP_MAP[role] ?? [];
    }


    static canRoleHandleStep(
        role: UserRole,
        step: DocumentStep
    ): boolean {
        const allowedSteps = this.getStepsByRole(role);

        return allowedSteps.includes(step);
    }


    static canReplaceUpload(
        lastHistoryStep: DocumentStep,
        currentStep: DocumentStep
    ): boolean {

        const expectedStep =
            this.getNextStep(lastHistoryStep);

        return expectedStep === currentStep;
    }

    static isReturnStep(
        step: DocumentStep
    ): boolean {

        return [

            DocumentStep.DEPARTMENT_HEAD_RETURN,

            DocumentStep.FACULTY_AR_RETURN,

            DocumentStep.SAR_RETURN,

        ].includes(step);

    }

    static getReturnStep(
        step: DocumentStep
    ): DocumentStep | null {

        switch (step) {

            case DocumentStep.DEPARTMENT_MA_APPROVAL:
                return DocumentStep.DEPARTMENT_HEAD_RETURN;

            case DocumentStep.DEPARTMENT_HEAD_APPROVAL:
                return DocumentStep.FACULTY_AR_RETURN;

            case DocumentStep.FACULTY_AR_APPROVAL:
                return DocumentStep.SAR_RETURN;

            default:
                return null;

        }

    }

    static canReturn(
        step: DocumentStep
    ): boolean {

        return this.getReturnStep(step) !== null;
    }


    static isApprovalStep(
        step: DocumentStep
    ): boolean {

        return [

            DocumentStep.SAR_APPROVAL,

            DocumentStep.FACULTY_AR_APPROVAL,

            DocumentStep.DEPARTMENT_HEAD_APPROVAL,

            DocumentStep.DEPARTMENT_MA_APPROVAL,

        ].includes(step);

    }


    static getCurrentRole(
        step: DocumentStep
    ): UserRole | null {

        switch (step) {

            case DocumentStep.FACULTY_MA_UPLOAD:
            case DocumentStep.FACULTY_MA_FINAL:
                return UserRole.FACULTY_MA;

            case DocumentStep.SAR_APPROVAL:
            case DocumentStep.SAR_RETURN:
                return UserRole.STUDENT_SERVICE_SAR;

            case DocumentStep.FACULTY_AR_APPROVAL:
            case DocumentStep.FACULTY_AR_RETURN:
                return UserRole.FACULTY_AR;

            case DocumentStep.DEPARTMENT_HEAD_APPROVAL:
            case DocumentStep.DEPARTMENT_HEAD_RETURN:
                return UserRole.DEPARTMENT_HEAD;

            case DocumentStep.DEPARTMENT_MA_APPROVAL:
                return UserRole.DEPARTMENT_MA;

            default:
                return null;

        }
    }



}