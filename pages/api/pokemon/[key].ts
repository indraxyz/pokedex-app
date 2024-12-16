// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type api response

type Data = {
  error?: string;
  id?: number;
  name?: string;
  height?: number;
  weight?: number;
  species?: string;
  types?: object[];
  abilities?: object[];
  image?: string;
  stats?: object[];
  evolution?: object;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // key = id | name
    const { key } = req.query;
    const resPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);
    const jsonPokemon = await resPokemon.json();
    const { id, name, height, weight, species, types, abilities, stats } =
      jsonPokemon;
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    // get evolution
    const resEvolution = await fetch(
      `https://pokeapi.co/api/v2/evolution-chain/${id}/`
    );
    const jsonEvolution = await resEvolution.json();

    res.status(200).json({
      id,
      name,
      height,
      weight,
      species: species.url,
      types,
      abilities,
      image,
      stats,
      evolution: jsonEvolution,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "failed to fetch data" });
  }
}
