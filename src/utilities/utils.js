const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

  const uploadFileToS3 = async (file,invoice_number) => {
    console.log('------------>>>>  file',invoice_number)
    const s3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        },
    });

    console.log(process.env.S3_ACCESS_KEY_ID)
    console.log(process.env.AWS_S3_SECRET_ACCESS_KEY)
    const fileName = `invoices/${invoice_number}.pdf`;
    const bucketName = 'documents-prehome';
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: 'application/pdf', // Set the appropriate content type for the file
        // ACL: 'public-read', // Set the ACL to public-read if you want the uploaded files to be publicly accessible
    };
    // Upload the file to S3
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    console.log('pink palazo',command)
    console.log('------------>>>>  responseresponse',response)
    // Get the uploaded file URL
    const fileURL = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    return fileURL;
};

  module.exports ={
    uploadFileToS3
  }