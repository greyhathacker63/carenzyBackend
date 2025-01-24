const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESSKEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    },
});

const uploadFileToS3 = async (file, fileName) => {
    try {
        if (!Buffer.isBuffer(file.buffer)) {
            throw new Error('Invalid file format: Expected Buffer');
        }

        const bucketName = 'carenzybucket';
        const params = {
            Bucket: bucketName,
            Key: `invoices/${fileName}.png`,
            Body: file.buffer,
            ContentType: 'image/png',
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${bucketName}.s3.amazonaws.com/invoices/${fileName}.png`;
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw error;
    }
};

module.exports = { uploadFileToS3 };
