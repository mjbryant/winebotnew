import type { NextApiRequest, NextApiResponse } from "next";
import { deleteWine } from "@/utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.body["id"];
  await deleteWine(id);
  res.status(200).json({});
}
