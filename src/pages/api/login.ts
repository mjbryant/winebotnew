// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

const TOKEN = randomUUID();

type Data = {
  token?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const username = req.body["username"];
  const password = req.body["password"];
  if (username == "joel" && password == "bork") {
    res.status(200).json({ token: TOKEN });
  } else {
    res.status(401).json({ error: "incorrect-username-or-password" });
  }
}
