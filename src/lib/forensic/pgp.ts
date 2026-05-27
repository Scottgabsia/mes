import * as openpgp from "openpgp";

export async function encryptWithPgpPublicKey(
  plaintext: string,
  armoredPublicKey: string
): Promise<{ armored: string; algorithm: string }> {
  const publicKey = await openpgp.readKey({ armoredKey: armoredPublicKey });
  const message = await openpgp.createMessage({ text: plaintext });
  const armored = await openpgp.encrypt({
    message,
    encryptionKeys: publicKey,
  });
  return { armored, algorithm: "OpenPGP" };
}
