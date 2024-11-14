import type { NextApiRequest, NextApiResponse } from "next";
import { insertWine } from "@/utils/database";
import type { TypicalWine } from "@/types/wine";

type Data = {
  wine: TypicalWine;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const wine = req.body["wine"] as TypicalWine;
  await insertWine(wine);
  res.status(200).json({ wine });
}
