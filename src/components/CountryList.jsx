import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import {  useCities } from "../contexts/CitiesContext";

const messsage = "add yout first city by pointing on the map";

function CountryList() {

  const {cities,isLoading} = useCities()
  
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message={messsage} />;

  //reduce fn for getting the countries from the city list 
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return <CountryItem country={country} key={country.country} />
      })}
    </ul>
  );
}

export default CountryList;
