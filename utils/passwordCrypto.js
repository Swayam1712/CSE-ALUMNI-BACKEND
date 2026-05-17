import crypto from "crypto";

const algorithm = "aes-256-cbc";

const secretKey = crypto
  .createHash("sha256")
  .update(process.env.PASSWORD_SECRET_KEY)
  .digest();

const iv = Buffer.alloc(16, 0);

export const encryptPassword = (password) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    iv
  );

  let encrypted = cipher.update(
    password,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  return encrypted;
};

export const decryptPassword = (encryptedPassword) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    iv
  );

  let decrypted = decipher.update(
    encryptedPassword,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
};