import type { NextApiRequest, NextApiResponse } from "next";
import { createTastingSession } from "@/utils/tastingDatabase";

type Data = {
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const tastingId = await createTastingSession(
    req.body["questionOrder"],
    req.body["secondQuestion"],
    req.body["questionOrderOverride"],
  );
  res.status(200).json({ id: tastingId });
}
