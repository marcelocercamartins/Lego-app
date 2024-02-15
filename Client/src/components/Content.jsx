
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

function Content() {
  const name = localStorage.getItem('user');
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const userToken = localStorage.getItem('authToken');
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  let [title,setTitle]= useState()
  let [description,setDescription]= useState()
  let [image,setImage]= useState()
  

  
  const userObj = {name: name};
  const navigate = useNavigate();


  const handleImageClick = (imageSrc) => {
    setSelectedImage((prevSelectedImage) =>
    prevSelectedImage === imageSrc ? null : imageSrc
    );
  };

  const handleEraseClick = (id) => {

    axios.delete(`http://localhost:3001/deletePost/${id}`,{
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=UTF-8"}})
      .then(() => {
        authenticateUser();
        navigate('/');
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  const handleEditToggle = () => {
    setIsEditable((prevIsEditable) => !prevIsEditable);
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const handleSaveToggle = (id) => {
    const newFavorites = favorites.map(obj => ({ _id: obj._id, title: obj.title, image: obj.image }));
  
    if (title === undefined) {
      const matchingObject = newFavorites.find(obj => obj._id === id);
  
      if (matchingObject) {
        title = matchingObject.title;
      }
    }

    if (description === undefined) {
      const matchingObject = newFavorites.find(obj => obj._id === id);
  
      if (matchingObject) {
        description = matchingObject.description;
      }
    }

    if (image === undefined) {
      const matchingObject = newFavorites.find(obj => obj._id === id);
  
      if (matchingObject) {
        image = matchingObject.image;
      }
    }



    const eventObj = {title: title, description: description, _id: id, image: image};
    axios.post('http://localhost:3001/updatePost', eventObj,{
        method: "POST",
        body: JSON.stringify(eventObj),
        headers: { "Content-type": "application/json; charset=UTF-8" }})
    .then(() => {
      authenticateUser();
      navigate('/content')})
    .catch(err=>console.log(err))  


  };

  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
        console.log(reader.result);
        setImage(reader.result);
    };
    reader.onerror = error => {
        console.log("error: ", error);
    }
}
  useEffect(() => {
    axios.post('http://localhost:3001/myFavorites', userObj,{
        method: "GET",
          body: JSON.stringify(userObj),
          headers: { "Content-type": "application/json; charset=UTF-8"}})
      .then((result) => {
        storeToken(userToken);
        authenticateUser();
        setFavorites(result.data.resultSet);
        console.log('Data', result.data.resultSet);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  },[]); 

  return (
    
    <div className='posts-main-container'>
      <h1>My Posts</h1>
      <div className='posts-mp-container'>
              {favorites.map((favorite) => (
                <div id="main-posts" key={favorite.id}>
                  <div className={` ${selectedImage === favorite.image ? 'centered-image' : ''}`} id="left-div" onClick={() => handleImageClick(favorite.image)}>
                  <img src={favorite.image} alt={favorite.image} />
                  </div>
                  {isEditable ? (
              <div className='changefile'>
                <label>Change Image:</label><br></br>
                <input 
                  type="file"
                  accept="image/*"
                  name="image"
                  className="imageInput"
                  onChange={convertToBase64}
                />
              </div>
            ) : null}
                  <div id="postitle-div"
                    contentEditable={isEditable}
                    onInput={(e) => setTitle(e.target.innerText)}
                    name="title">
                    <h3>{favorite.title}</h3>
                  </div>
                  <div
                    id="description-div"
                    contentEditable={isEditable}
                    onInput={(e) => setDescription(e.target.innerText)}
                    name="description"
                  ><p>{favorite.description}</p>
                  </div>
                  <div id="author-div">
                    <p><strong>Author</strong><br></br>{favorite.username}</p>
                  </div>
                  <div id="buttons_content">
                  <button className="deleteButton" onClick={() => handleEraseClick(favorite._id)}>Delete</button>
                  <button className="editButton" onClick={() => handleEditToggle()}>{editMode ? 'Close' : 'Edit'}</button>
                  {isEditable ? (
              <button className="saveButton" onClick={() => handleSaveToggle(favorite._id)}>Save</button>
            ) : null}
            </div>
            
                </div>
              ))}
        </div>
    </div>
  );
}

export default Content;