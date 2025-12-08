import {configureStore} from "@reduxjs/toolkit";
import bouquetsReducer from "./bouquetsSlice";
import Bouquet from "../components/bouquet";
import Bouquets from "../pages/bouquets";

export const store = configureStore({
    reducer:{
        bouquets : bouquetsReducer,
    },
});