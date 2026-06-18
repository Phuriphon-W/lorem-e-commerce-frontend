'use server'

import { 
    DownloadFileByKeyRequest,
    DownloadFileByKeyResponse,
 } from "@/shared/types/file"
 import { serverAddr } from "@/shared/constants"
 import axios from "axios"

export const downloadStaticFile = async ({
    key
}: DownloadFileByKeyRequest): Promise<DownloadFileByKeyResponse> => {
    // SECURITY NOTE: The `key` parameter must only be sourced from backend-provided URLs/data 
    // (such as invoice files, order details, or system config) and never bound directly to 
    // unsanitized client inputs, to mitigate path traversal or unauthorized file access risks.
    const options = {
            url: `${serverAddr}/file/download/key/${key}`,
            method: "get",
            headers: {Accept: 'application/json'},
            withCredentials: true,
        }

    try {
        const response = await axios.request(options);
        return {
            downloadUrl: response.data.downloadUrl
        }
    } catch (err) {
        throw err;
    }
}