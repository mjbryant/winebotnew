import type { NextApiRequest, NextApiResponse } from "next";
import { getTasting } from "@/utils/tastingDatabase";
import { Tasting } from "@/types/tasting";

type Data = {
  tasting: Tasting;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const tastingId = req.query.id as string;
  const tasting = await getTasting(tastingId);
  res.status(200).json({ tasting });
}
