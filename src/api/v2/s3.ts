import { createRequestInstance } from "../lib/request";

const getPresignedUrl = async (key: string):Promise<{
    result: string;
}> => {
    return createRequestInstance(true).post('/file/upload-pre-sign', { key });
};

export default {
    getPresignedUrl,
}