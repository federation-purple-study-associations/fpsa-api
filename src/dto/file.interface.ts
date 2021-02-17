export interface FileUpload {
    data: Buffer,
    filename: string,
    encoding: string,
    mimetype: string,
    limit: false,
}

export function containsUpload(files: FileUpload[]): boolean {
    return files && files[0] && files[0].data.length > 0;
}
