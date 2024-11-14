import { promises as fs } from "fs";
import { TypicalWine } from "@/types/wine";
import { generateRandom } from "./random";

const DATA_DIR = "./data/wines";

// TODO: figure out how to close the file handles

export const wineExists = async (id: string): Promise<boolean> => {
  try {
    const filename = `${DATA_DIR}/${id}.json`;
    await fs.open(filename);
    return true;
  } catch {
    return false;
  }
};

export const getWine = async (id: string): Promise<TypicalWine> => {
  try {
    const filename = `${id}.json`;
    const raw = await fs.readFile(`${DATA_DIR}/${filename}`, "utf-8");
    return JSON.parse(raw) as TypicalWine;
  } catch {
    throw new Error("404");
  }
};

export const getRandomId = (): string => {
  return `wine_${generateRandom(10)}`;
};

export const getIds = async (): Promise<string[]> => {
  return (await fs.readdir(DATA_DIR)).map((f) => {
    const [id, _] = f.split(".");
    return id;
  });
};

export const insertWine = async (wine: TypicalWine) => {
  await fs.writeFile(`${DATA_DIR}/${wine.id}.json`, JSON.stringify(wine));
};

export const deleteWine = async (id: string) => {
  const exists = await wineExists(id);
  if (exists) {
    await fs.unlink(`${DATA_DIR}/${id}.json`);
  }
};

export const getWines = async (): Promise<TypicalWine[]> => {
  const files = await fs.readdir(DATA_DIR);
  const wines = await Promise.all(files.map(async (file) => {
    const raw = await fs.readFile(`${DATA_DIR}/${file}`, "utf-8");
    return JSON.parse(raw) as TypicalWine;
  }));
  return wines;
};
