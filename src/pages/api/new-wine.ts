import type { NextApiRequest, NextApiResponse } from "next";
import { getRandomId, insertWine } from "@/utils/database";
import { deepCopy } from "@/utils/helpers";
import { TemplateWine } from "@/types/questions";
import { TypicalWine } from "@/types/wine";

type Data = {
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const wine = deepCopy(TemplateWine) as any;
  delete wine["primaryCharacteristics"];
  wine.id = getRandomId();
  wine.name = req.body["name"];
  wine.subname = req.body["subname"];
  await insertWine(wine as TypicalWine);
  res.status(200).json({ id: wine.id });
}
