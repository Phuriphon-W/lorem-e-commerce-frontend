import { 
    DownloadFileByKeyRequest,
    DownloadFileByKeyResponse,
 } from "@/shared/types/file"
 import { serverAddr } from "@/shared/constants"
 import axios from "axios"

export const downloadStaticFile = async ({
    key
}: DownloadFileByKeyRequest): Promise<DownloadFileByKeyResponse> => {
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