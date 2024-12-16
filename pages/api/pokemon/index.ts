// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type api response
type Data = {
  pokemons?: object[];
  offset?: number;
  limit?: number;
  error?: string;
  total_count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // fetch here, all pokemons
    // https://pokeapi.co/api/v2/pokemon?offset=0&limit=20
    const { offset, limit } = req.query;
    const resPokemons = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const jsonPokemons = await resPokemons.json();

    res.status(200).json({
      pokemons: jsonPokemons.results,
      offset: Number(offset),
      limit: Number(limit),
      total_count: jsonPokemons.count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "failed to fetch data" });
  }
}
