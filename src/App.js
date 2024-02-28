import { useState, useEffect } from 'react';
import './App.css';
import MyNutritions from './MyNutritions';
import LoaderPage from './Loader/LoaderPage';
import Swal from 'sweetalert2';


function App() {

  const MY_ID = "24cd1669";
  const MY_KEY = "6008ce892289d6acebbb56557d5d4aff";


const [mySearch, setMySearch] = useState ();
const [myIngredients, setMyIngredients] = useState ();
const [wordSubmitted, setWordSubmitted] = useState('');
const [stateLoader, setStateLoader] = useState (false);


    const getNutrition = async (ingr) => {

      setStateLoader(true);

      const response = await fetch (`https://api.edamam.com/api/nutrition-details?app_id=${MY_ID}&app_key=${MY_KEY}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
                  },
      body: JSON.stringify({ ingr: ingr })
      })

      if(response.ok) {

        setStateLoader(false);

        const data = await response.json();

        setMyIngredients (data);
        } 
        else {
          setStateLoader(false);

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter the ingredients correctly!",
          });
        }
    } 


const myIngredientSearch = (e) => {
  setMySearch (e.target.value);
}

const finalSearch = e => {
  e.preventDefault();
  setWordSubmitted (mySearch);
}

useEffect (() => {
  if (wordSubmitted !== '') {
    let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
    getNutrition(ingr);
  }
}, [wordSubmitted])


  return (

    <div className='main'>
      
      {stateLoader && <LoaderPage />}

      <div className="App poppins-light">

        <div className='container'>
          <h1>Nutrition analysis</h1>
        </div>

        <div className='container'>
          <form onSubmit={finalSearch}>
            <input className='search' placeholder='Enter ingredients...' onChange={myIngredientSearch}/>

            <button>Search</button>
          </form>

          </div>
      
          <div className='list'>

            { myIngredients && <h2>Structure:</h2> }

            {
              myIngredients && Object.values(myIngredients.totalNutrients)
              .map(({ label, quantity, unit}, index) =>
                <MyNutritions key={index}
                  label={label}
                  quantity={quantity}
                  unit={unit}
                />
                )
            }

          </div>

      </div>

    </div>
  );
}

export default App;
