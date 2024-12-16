// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type api response
type Data = {
  types?: object[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {

    const resTypes = await fetch(
      `https://pokeapi.co/api/v2/type?offset=0&limit=30`
    );
    const jsonTypes = await resTypes.json();

    res.status(200).json({ types: jsonTypes.results });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "failed to fetch data" });
  }
}
