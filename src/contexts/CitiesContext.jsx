import { useCallback, useReducer } from "react";
import { createContext,  useEffect, useContext } from "react";

const URL = "http://localhost:8000";
const CitiesContext = createContext();

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: "",
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
      
    default:
      throw new Error("unknown action");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, intialState);
  const { cities, isLoading, currentCity } = state;

  //fetching the cities data, need to be fechted intially(on mount), thats why its put on useEffect
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "the is an error to fetch data",
        });
      }
    }
    fetchCities();
  }, []);
  //----->

  //fetching the individual city details
  /*useCallback for avoid re-creating in every render, this useful for in the city page.
  when adding this getCity function in dependency array of useEffect */
  const getCity = useCallback(async (id) => {
    if(Number(id) === currentCity.id) return

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "the is an error to fetch city" });
    }
  },[currentCity.id])
  //------>

  //creating new city
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "the is an error to create city" });
    }
  }
  //------>

  //deleting the city
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${URL}/cities/${id}`, { method: "DELETE" });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: "the is an error to delete city" });
    }
  }
 //-------->

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
