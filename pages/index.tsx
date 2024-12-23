import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Pagination,
  Stack,
  Grid2 as Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Dialog,
  DialogContent,
  Chip,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import heroImage from "../public/hero.png";
import Image from "next/image";
import { useRouter } from "next/router";
import NProgress from "../src/components/NProgress/Progress";

type pokemons_type = { name: string; url: string }[];
type pokemon_type = {
  id?: number;
  name?: string;
  height?: number;
  weight?: number;
  species?: string;
  types?: object[];
  abilities?: object[];
  image?: string;
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

const Pokemon = () => {
  const [skeleton, setSkeleton] = useState(false);
  const [loading, setLoading] = useState({
    isAnimating: false,
    key: 0,
  });
  const router = useRouter();
  const [pokemons, setPokemons] = useState<pokemons_type>([]);
  const [offset, setOffset] = useState(0);
  const pokemonsCount = 1025; // last pokemon is pecharunt at 1025
  const limit = 24;
  const img_url =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

  const [dialogDetail, setDialogDetail] = useState(false);
  const [pokemon, setPokemon] = useState<pokemon_type>({});

  //   didMount
  useEffect(() => {
    pokemons_fetch(offset, limit);
  }, []);

  const syncLoading = () => {
    setLoading((prev) => ({
      isAnimating: !prev.isAnimating,
      key: prev.isAnimating ? prev.key : prev.key ^ 1,
    }));
  };

  async function pokemons_fetch(offset: number, limit: number) {
    setSkeleton(true);
    syncLoading();

    const res = await fetch(`/api/pokemon?offset=${offset}&limit=${limit}`);
    const json_pokemons = await res.json();

    setPokemons(json_pokemons.pokemons);
    setSkeleton(false);
    syncLoading();
  }

  async function pokemon_fetch(key: number) {
    syncLoading();
    const res = await fetch(`/api/pokemon/${key}`);
    const json_pokemon = await res.json();
    setPokemon(json_pokemon);
    setDialogDetail(true);
    syncLoading();
    console.log(json_pokemon);
  }

  const paginateTo = (p: number) => {
    const of = (p - 1) * limit;
    pokemons_fetch(of, limit);
    setOffset(of);
  };

  const detailPokemon = (id: number) => {
    // console.log(id);
    pokemon_fetch(id);
  };

  return (
    <Container>
      <NProgress isAnimating={loading.isAnimating} key={loading.key} />
      {/* WELCOME MESSAGE */}
      <Box
        component={"div"}
        className="justify-items-center content-center text-center  min-h-screen "
      >
        <Image src={heroImage} alt="" className="w-72 h-auto" priority />
        <Typography variant="h3" className="font-medium my-4">
          PokeDex App
        </Typography>
        <Button
          variant="contained"
          href="#pokedex"
          className="text-xl font-bold"
        >
          Check PokeDex
        </Button>
      </Box>

      {/* list of pokemons */}
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        id="pokedex"
        columns={{ xs: 2, sm: 8, md: 12 }}
        sx={{ paddingTop: 4 }}
      >
        {skeleton ? (
          <>
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Skeleton variant="rounded" className="w-full h-72" />
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Skeleton variant="rounded" className="w-full h-72" />
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Skeleton variant="rounded" className="w-full h-72" />
            </Grid>
          </>
        ) : (
          pokemons.map((p, i) => {
            const idPokemon = i + 1 + offset;
            return (
              <Grid key={i} size={{ xs: 2, sm: 4, md: 4 }}>
                <Card>
                  <CardActionArea onClick={() => detailPokemon(idPokemon)}>
                    <CardMedia
                      component="img"
                      image={`${img_url + idPokemon}.png`}
                      alt={p.name}
                      loading="lazy"
                      className="w-52 sm:w-72 !place-self-center !justify-self-center"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        className="text-center capitalize font-medium"
                      >
                        {p.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        #{idPokemon}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
      {/* paginaation */}
      <Stack spacing={2} className="my-10 items-center">
        <Pagination
          count={Math.ceil(pokemonsCount / 24)}
          color="primary"
          onChange={(e, p) => paginateTo(p)}
        />
      </Stack>

      {/* DIALOG DETAIL POKEMON */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={dialogDetail}
        onClose={() => setDialogDetail(false)}
      >
        <IconButton
          aria-label="close"
          onClick={() => setDialogDetail(false)}
          sx={{
            position: "absolute",
            right: 18,
            top: 8,
            zIndex: 9999,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseRounded />
        </IconButton>
        <DialogContent>
          {/* sign in form or sosmed acc */}
          <Box component={"div"} className="space-y-6">
            <Box className="!place-self-center !justify-self-center">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                loading="lazy"
                className="w-52 sm:w-auto"
              />
            </Box>

            <Box component={"div"} className="text-center">
              <Typography className="text-2xl font-semibold">
                # {pokemon.id}
              </Typography>
              <Typography className="text-2xl font-semibold capitalize tracking-wider">
                {pokemon.name}
              </Typography>
            </Box>

            <Paper square={false} elevation={3} className="p-8 rounded-2xl">
              <div className="space-y-4">
                <Box>
                  <Typography variant="h5">{pokemon.id}</Typography>
                  <Typography variant="body2" className="tracking-wider">
                    ID
                  </Typography>
                </Box>
                <Box className="mt-2">
                  <Typography variant="h5" className="capitalize">
                    {pokemon.name}
                  </Typography>
                  <Typography variant="body2" className="tracking-wider">
                    Name
                  </Typography>
                </Box>
                <Box className="mt-2">
                  <Typography variant="h5">
                    {Number(pokemon.height) / 10} m
                  </Typography>
                  <Typography variant="body2" className="tracking-wider">
                    Height
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5">
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
                  <div className="capitalize space-x-2  my-2 pt-1">
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

            <Button
              fullWidth
              variant="contained"
              className="text-lg font-bold"
              onClick={() => router.push(`/${pokemon.id}`)}
              // href={`/${pokemon.id}`}
            >
              More Details
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Pokemon;
