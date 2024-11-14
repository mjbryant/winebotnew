import type { NextApiRequest, NextApiResponse } from "next";
import { deleteWine, getIds, insertWine, wineExists } from "@/utils/database";
import { Chardonnay, OregonPinot } from "@/utils/sampleWines";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.body.clearAll) {
    const ids = await getIds();
    await Promise.all(ids.map(async (id) => {
      await deleteWine(id);
    }));
  } else if (req.body.clear) {
    await Promise.all(["wine_1", "wine_2"].map(async (id) => {
      await deleteWine(id);
    }));
  }

  let status = "already_present";

  const exists1 = await wineExists(OregonPinot.id);
  if (!exists1) {
    await insertWine(OregonPinot);
    status = "inserted";
  }

  const exists2 = await wineExists(Chardonnay.id);
  if (!exists2) {
    await insertWine(Chardonnay);
    status = "inserted";
  }

  res.status(200).json({ status });
}
