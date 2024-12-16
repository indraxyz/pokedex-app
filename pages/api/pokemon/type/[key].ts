// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type api response
type Data = {
  type_id?: number;
  name?: string;
  pokemons?: object[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { key } = req.query;
    const resPokemons = await fetch(`https://pokeapi.co/api/v2/type/${key}`);
    const jsonPokemons = await resPokemons.json();

    res.status(200).json({
      type_id: jsonPokemons.id,
      name: jsonPokemons.name,
      pokemons: jsonPokemons.pokemon,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "failed to fetch data" });
  }
}
