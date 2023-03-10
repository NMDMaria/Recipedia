import { useCallback, useEffect, useState } from "react";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";

import { useAuth } from "../../App";
import { Recipe } from "../../DTOs";
import ENV from "../../env";
import RecipeCard from "./RecipeCard";

export default function RecipesList() {
  const [value, setValue] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const context = useAuth();

  const searchRecipes = useCallback(
    (q: string) => {
      if (!ENV.BASE_RECIPE_URL) {
        return;
      }

      const params: { [key: string]: any } = {
        type: "any",
        q: q,
        app_id: ENV.RECIPE_SEARCH_APP_ID,
        app_key: ENV.RECIPE_SEARCH_APP_KEY,
        random: "true",
      };
      if (context.user?.preference_diet) {
        params.diet = context.user.preference_diet;
      }
      if (context.user?.preference_health) {
        params.health = context.user.preference_health;
      }

      axios
        .get(ENV.BASE_RECIPE_URL, {
          params: params,
          paramsSerializer: {
            indexes: null,
          },
        })
        .then((response) => {
          let newRecipes: Recipe[] = [];
          for (let i = 0; i < response.data.hits.length; i++) {
            newRecipes.push(response.data.hits[i].recipe);
          }
          setRecipes(newRecipes);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [context.user]
  );

  useEffect(() => {
    searchRecipes("any");
  }, [searchRecipes, context.token]);

  if (!recipes) {
    return null;
  }

  return (
    <>
      <Box
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 100,
          marginBottom: 20,
          width: "40%",
          backgroundColor: "white",
          borderRadius: 15,
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mr: 2,
            display: { md: "flex" },
            fontFamily: "Playfair",
            fontWeight: 700,
            color: "#383535",
            textDecoration: "none",
            textAlign: "center",
            margin: "auto",
            width: "60%",
            padding: 2,
          }}
        >
          See the recipes that await you
        </Typography>
      </Box>
      <Grid
        container
        sx={{
          marginTop: 10,
          marginLeft: "auto",
          marginRight: "auto",
          width: "90%",
        }}
        spacing={0}
      >
        <Grid item xs={11}>
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            inputProps={{ style: { fontSize: 18 } }}
            sx={{ width: "100%", background: "white", color: "black" }}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            onClick={() => {
              searchRecipes(value);
            }}
            sx={{
              marginLeft: 1,
              height: "90%",
              width: "80%",
              background: "#383535",
              fontSize: 16,
              opacity: "80%",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#BEBEBE !important",
                color: "black",
              },
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ marginBottom: 10 }}>
        {recipes.map((recipe) => (
          <RecipeCard
            label={recipe.label}
            image={recipe.image}
            dishType={recipe.dishType}
            categories={recipe.categories}
            recipe={recipe}
          />
        ))}
      </Grid>
    </>
  );
}
