import { useRouter } from "next/router";
import {
  Button,
  Box,
  Grid2 as Grid,
  Typography,
  Chip,
  Container,
  LinearProgress,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import NProgress from "../src/components/NProgress/Progress";

type Props = { query: object };
type pokemon_type = {
  id?: number;
  name?: string;
  height?: number;
  weight?: number;
  species?: string;
  types?: object[];
  abilities?: object[];
  image?: string;
  stats?: object[];
};

type BaseStat = {
  base_stat?: number;
  stat?: Stat;
};
type Stat = {
  name?: string;
};

type Abilities = {
  ability?: Ability | undefined;
};
type Ability = {
  name?: string;
};

type Types = {
  type?: Type;
};
type Type = {
  name?: string;
};

const PokemonDetail = ({ query }: Props) => {
  const router = useRouter();
  const { key } = router.query;
  const [pokemon, setPokemon] = useState<pokemon_type>({});
  const [loading, setLoading] = useState({
    isAnimating: false,
    key: 0,
  });

  useEffect(() => {
    console.log(query);
    pokemon_fetch(key);
  }, []);

  const syncLoading = () => {
    setLoading((prev) => ({
      isAnimating: !prev.isAnimating,
      key: prev.isAnimating ? prev.key : prev.key ^ 1,
    }));
  };

  async function pokemon_fetch(key: string | string[] | undefined) {
    syncLoading();
    const res = await fetch(`/api/pokemon/${key}`);
    const json_pokemon = await res.json();
    // setPokemon(json_pokemon);
    setPokemon(json_pokemon);
    console.log(json_pokemon);
    syncLoading();
  }

  return (
    <Container className="pb-6">
      <NProgress isAnimating={loading.isAnimating} key={loading.key} />

      <Button onClick={() => router.push(`/`)}>Back to Pokedex</Button>

      <Box
        component={"div"}
        className="!place-self-center !justify-self-center"
      >
        {/* image */}
        <img
          src={pokemon.image}
          srcSet=""
          alt={pokemon.name}
          loading="lazy"
          className="w-72 sm:w-auto"
        />
      </Box>

      <Box component={"div"} className="text-center my-4">
        <Typography className="text-2xl font-semibold">
          # {pokemon.id}
        </Typography>
        <Typography className="text-3xl font-semibold capitalize tracking-wider">
          {pokemon.name}
        </Typography>
      </Box>

      {/* detail, stats */}
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        columns={{ xs: 4, sm: 8 }}
        sx={{ marginTop: 6 }}
      >
        <Grid size={{ xs: 4 }}>
          <Paper square={false} elevation={3} className="p-8 rounded-2xl">
            <div className="space-y-4">
              <Typography className="text-2xl underline underline-offset-4 text-center sm:text-left">
                Basic Information
              </Typography>
              <Box>
                <Typography variant="h6">{pokemon.id}</Typography>
                <Typography variant="body2" className="tracking-wider">
                  ID
                </Typography>
              </Box>
              <Box className="mt-2">
                <Typography variant="h6" className="capitalize">
                  {pokemon.name}
                </Typography>
                <Typography variant="body2" className="tracking-wider">
                  Name
                </Typography>
              </Box>
              <Box className="mt-2">
                <Typography variant="h6">
                  {Number(pokemon.height) / 10} m
                </Typography>
                <Typography variant="body2" className="tracking-wider">
                  Height
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">
                  {Number(pokemon.weight) / 10} kg
                </Typography>
                <Typography variant="body2" className="tracking-wider">
                  Weight
                </Typography>
              </Box>

              <Box>
                <div className="capitalize space-x-2 my-2 pt-1">
                  {pokemon.abilities?.map((a: Abilities, i) => {
                    return (
                      <Chip
                        key={i}
                        label={a.ability?.name}
                        variant="outlined"
                      />
                    );
                  })}
                </div>

                <Typography variant="body2" className="tracking-wider">
                  Abilities
                </Typography>
              </Box>
              <Box>
                <div className="capitalize space-x-2 my-2 pt-1">
                  {pokemon.types?.map((t: Types, i) => {
                    return (
                      <Chip
                        key={i}
                        label={t.type?.name}
                        variant="outlined"
                        clickable
                        onClick={() =>
                          router.push(`/type?type=${t.type?.name}`)
                        }
                      />
                    );
                  })}
                </div>
                <Typography variant="body2" className="tracking-wider">
                  Types
                </Typography>
              </Box>
            </div>
          </Paper>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Paper square={false} elevation={3} className="p-8 rounded-2xl">
            <Typography className="text-2xl underline underline-offset-4 text-center sm:text-left mb-4">
              Base Stats
            </Typography>
            <div className="space-y-6">
              {pokemon.stats?.map((s: BaseStat, i) => {
                const val = s.base_stat;
                return (
                  <div key={i}>
                    <Typography className="capitalize" variant="h6">
                      {s.stat?.name} . {val}
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={val != undefined && val > 100 ? 100 : val}
                      />
                    </Box>
                  </div>
                );
              })}
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* evolution */}
    </Container>
  );
};

PokemonDetail.getInitialProps = async (ctx: NextPageContext) => {
  return { query: ctx.query };
};

export default PokemonDetail;
