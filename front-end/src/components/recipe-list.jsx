import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../style/recipe-list.css";
import RecipeCard from "./recipeCard.jsx";

const categories = [
  { name: "Vegan Recipes", key: "vegan" },
  { name: "Dessert Recipes", key: "desserts" },
  { name: "Meat Recipes", key: "meat" },
];

const TopRecipesPage = () => {
  const [recipesByCategory, setRecipesByCategory] = useState({
    vegan: [],
    desserts: [],
    meat: [],
  });

  const getRandomRecipes = (recipes, count = 20) => {
    const sorted = [...recipes].sort((a, b) => b.rating - a.rating);
    const topRecipes = sorted.slice(0, Math.min(count * 2, sorted.length));
    return topRecipes.sort(() => Math.random() - 0.5).slice(0, count);
  };

  useEffect(() => {
    categories.forEach(({ key }) => {
      fetch(`http://localhost:3000/recipes/category/${key}`, { method: "GET" })
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch ${key}`);
          return res.json();
        })
        .then((data) => {
          const randomRecipes = getRandomRecipes(data, 20);
          setRecipesByCategory((prev) => ({ ...prev, [key]: randomRecipes }));
        })
        .catch((err) => console.error("Error fetching recipes:", err));
    });
  }, []);

  const swiperConfig = {
    modules: [Navigation, Pagination],
    navigation: true,
    pagination: { clickable: true },
    slidesPerView: 5,
    spaceBetween: 16,
    breakpoints: {
      480: { slidesPerView: 1 },
      700: { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
      1200: { slidesPerView: 5 },
    },
  };

  return (
    <div className="page">
      <div className="sections">
        {categories.map(({ name, key }) => (
          <div className="container section" key={key}>
            <h2 className="sectionTitle">{name}</h2>
            <Swiper {...swiperConfig}>
              {recipesByCategory[key].map((recipe) => (
                <SwiperSlide key={recipe.recipeId}>
                  <RecipeCard recipe={recipe} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRecipesPage;
