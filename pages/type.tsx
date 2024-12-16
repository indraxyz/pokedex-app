import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import {
  Container,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import { FilterAlt, Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import NProgress from "../src/components/NProgress/Progress";

type Props = {
  query: Params;
};

type Params = {
  type: string;
};

type dataTable = {
  pokemon: Pokemon;
};
type Pokemon = {
  name: string;
};

const PokemonType = ({ query }: Props) => {
  const [loading, setLoading] = useState({
    isAnimating: false,
    key: 0,
  });
  const router = useRouter();
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [filterType, setFilterType] = useState("normal");
  const [dataTable, setDataTable] = useState([]);

  //   didMount
  useEffect(() => {
    // fetch get all types
    fetchTypes();
    // get query url, default normal
    if (query.type === undefined) {
      query.type = "normal";
    }
    console.log(query.type);
    setFilterType(query.type);
    // list pokemons by type, first call type
    fetchPokemonByType(query.type);
  }, []);

  const syncLoading = () => {
    setLoading((prev) => ({
      isAnimating: !prev.isAnimating,
      key: prev.isAnimating ? prev.key : prev.key ^ 1,
    }));
  };

  async function fetchTypes() {
    const res = await fetch(`/api/pokemon/type`);
    const json = await res.json();
    setTypes(json.types);
    console.log(json);
  }
  async function fetchPokemonByType(key: string) {
    syncLoading();
    const res = await fetch(`/api/pokemon/type/${key}`);
    const json = await res.json();
    setPokemons(json.pokemons);
    console.log(json);

    // first set data Table
    setDataTable(json.pokemons.slice(0, 9));
    syncLoading();
  }

  const paginateTo = (p: number) => {
    const of = (p - 1) * 9;
    setDataTable(Array.from(pokemons.slice(of, 9 * p)));
  };

  const DrawerList = (
    <Box sx={{ minwidth: 250 }} role="presentation">
      <Button
        onClick={() => router.push(`/`)}
        className="m-4 text-xl"
        variant="text"
      >
        PokeDex App
      </Button>
      <div className="flex items-center pl-4">
        <FilterAlt />
        <Typography className="p-2"> Pokemon Types</Typography>
      </div>
      <List>
        {types.map((t: { name: string }, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={filterType == t.name ? true : false}
              className="py-0"
              onClick={() => {
                setDrawer(false);
                setFilterType(t.name);
                fetchPokemonByType(t.name);
              }}
            >
              <ListItemText secondary={t.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Container className="w-full">
      <NProgress isAnimating={loading.isAnimating} key={loading.key} />

      <Fab
        onClick={() => setDrawer(true)}
        color="primary"
        size="medium"
        sx={{
          position: "fixed",
          right: 24,
          bottom: 8,
        }}
      >
        <MenuIcon />
      </Fab>

      {/* drawer */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>

      {/* list data */}
      <TableContainer component={Paper} className="">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Pokemons Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTable.map((row: dataTable, i) => (
              <TableRow
                className="cursor-pointer"
                component={"tr"}
                onClick={() => window.open(`/${row.pokemon.name}`, "_blank")}
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component={"td"} align="left">
                  {row.pokemon.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* paginaation */}
      <Stack spacing={2} className="my-10 items-center">
        <Pagination
          count={Math.ceil(pokemons.length / 9)}
          color="primary"
          onChange={(e, p) => paginateTo(p)}
        />
      </Stack>
    </Container>
  );
};

PokemonType.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  return { query };
};

export default PokemonType;
