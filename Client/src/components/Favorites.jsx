import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";


function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const userToken = localStorage.getItem('authToken');
  const name = localStorage.getItem('user');
  const navigate = useNavigate();
  


  const handleImageClick = (imageSrc) => {
    setSelectedImage((prevSelectedImage) =>
    prevSelectedImage === imageSrc ? null : imageSrc
    );
  };

  const handleFavorites = (id) => {
    console.log("oiiiiiiiiiiiiiiiiiiiiiii", id)
    axios.delete(`http://localhost:3001/deleteFavorite/${id}`,{
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=UTF-8"}})
      .then(() => {
        storeToken(userToken);
        authenticateUser();
        navigate('/content');
      })
      .catch((err) => {
        console.log('Error', err);
      });
    
  };


  useEffect(() => {
    // Fetch data 
    const eventObj = {name: name}
    axios.post('http://localhost:3001/myFavoritesList', eventObj, {
        method: "GET",
        body: JSON.stringify(eventObj),
        headers: { "Content-type": "application/json; charset=UTF-8"}})
      .then((result) => {
        setFavorites(result.data.resultSet);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  return (
    <div className='posts-main-container'>
      <h1>Favorites.</h1>
          <div className='posts-main-page'>
            <div className='posts-mp-container'>
              {favorites.map((favorite) => (
                <div id="main-posts" key={favorite.id}>
                  <div className={` ${selectedImage === favorite.image ? 'centered-image' : ''}`} id="left-div" onClick={() => handleImageClick(favorite.image)}>
                  <img src={favorite.image} alt={favorite.image} />
                  </div>
                  <div id="postitle-div"><h3>{favorite.title}</h3></div>
                  <div id="description-div"><p>
                    <strong>Description</strong><br></br>{favorite.description}</p>
                  </div>
                  <div id="author-div">
                    <p><strong>Author</strong><br></br>{favorite.author}</p>
                    <button
                      className="noheart"
                      onClick={() => handleFavorites(favorite._id)}
                      title="Click to remove from favorites"
                    ></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      <a className="btn-top" href="#homePageContainer">Top</a>
    </div>
  );
}
 
export default Favorites;


