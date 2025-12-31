import AWS from "aws-sdk";

const client = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function getSecrets() {
  const secretId = process.env.SECRET_ARN;
  if (!secretId) {
    if (process.env.NODE_ENV === "development") {
      return {
        MOCK_SECRET_KEY: "mock-value",
        ANOTHER_KEY: "another-mock",
      } as any;
    }

    throw new Error("Missing environment variable: SECRET_ARN");
  }

  const response = await client
    .getSecretValue({ SecretId: secretId })
    .promise();

  if (!response || !response.SecretString) return {};

  try {
    return JSON.parse(response.SecretString);
  } catch (err) {
    return {};
  }
}
