export class MonthlyDocumentExistsError extends Error {
    public readonly documentId: number;
    public readonly canDelete: boolean;

    constructor(
        message: string,
        documentId: number,
        canDelete: boolean
    ) {
        super(message);

        this.name = "MonthlyDocumentExistsError";

        this.documentId = documentId;

        this.canDelete = canDelete;
    }
}