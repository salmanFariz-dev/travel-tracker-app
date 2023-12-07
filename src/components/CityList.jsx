import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from "./Spinner"
import Message  from './Message'
import {  useCities } from '../contexts/CitiesContext'

const messsage = "add yout first city by pointing on the map"

function CityList() {   
 
    const {cities,isLoading} = useCities()

    if(isLoading) return <Spinner />
    if(!cities.length) return <Message message={messsage}/>

    return (
        <ul className={styles.cityList}>
            {cities.map((city)=>{
                return <CityItem city={city} key={city.cityName}/>
            })}
        </ul>
    )
}

export default CityList
