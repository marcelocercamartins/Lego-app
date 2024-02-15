import { useState, useEffect, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from "../context/auth.context";


function HomePage() {
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const name = localStorage.getItem('user');
  
  const navigate = useNavigate();


  const handleImageClick = (imageSrc) => {
    setSelectedImage((prevSelectedImage) =>
    prevSelectedImage === imageSrc ? null : imageSrc
    );
  };
  
  const handleFavorites = (id, image, title, author, description) => {
    const eventObj = {_id: id, name: name, title: title, description: description, image: image, author: author};
    axios.post('http://localhost:3001/addFavorite', eventObj,{
        method: "POST",
        body: JSON.stringify(eventObj),
        headers: { "Content-type": "application/json; charset=UTF-8" }})
    .then(() => {
      navigate('/favorites')})
    .catch(err=>console.log(err))  
  };



  useEffect(() => {
    // Fetch data 
    axios.get('http://localhost:3001/allPosts',{
        headers: { "Content-type": "application/json; charset=UTF-8"}})
      .then((result) => {
        setFavorites(result.data.resultSet);
        console.log('Data', result.data.resultSet);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }, []);

  return (
    <div id="homePageContainer">
      <h1>Lego Post.</h1>
        <div id="page-top-text">
            <h2>Discover, Connect, Experience: Your gateway to your Lego Posts!</h2>
            <h4>Publish about your Lego constructions and find inspiration for new constructions</h4>
          </div>
        <section id="scroll">
  
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
                    <p><strong>Author</strong><br></br>{favorite.username}</p>
                    {isLoggedIn ? (
                    <button
                      className="heart"
                      onClick={() => handleFavorites(favorite._id, favorite.image, favorite.title, favorite.username, favorite.description  )}
                      title="Click to add to favorites"
                    ></button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
      <a className="btn-top" href="#homePageContainer">Top</a>
    </section>
  </div>
  );
}
 
export default HomePage;


