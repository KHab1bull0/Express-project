import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";

dotenv.config();

const { S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME, S3_ENDPOINT, S3_REGION } =
  process.env;

export async function uploadFile(file) {
  try {
    const s3Client = new S3({
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
      endpoint: S3_ENDPOINT,
      forcePathStyle: true,
      region: S3_REGION,
    });

    const fileName = `${"habibullo"}/${Date.now()}-${file.originalname}`;
    let contentType = file.mimetype;

    if (contentType.startsWith("image/")) {
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          contentType
        )
      ) {
        contentType = "image/jpeg";
      }
    } else if (contentType.startsWith("video/")) {
      if (!["video/mp4", "video/webm", "video/ogg"].includes(contentType)) {
        contentType = "video/mp4";
      }
    } else {
      throw new Error("Only image or video files are allowed!");
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: contentType,
      },
    });

    await upload.done();

    const fileUrl = `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
}
