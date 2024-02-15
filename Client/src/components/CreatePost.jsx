
import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import axios from 'axios'
 
function CreatePost() {
    const [image,setImage]= useState()
    const [title,setTitle]= useState()
    const [description,setDescription]= useState()
    const activeUser = localStorage.getItem('user');

    const navigate = useNavigate();

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
      
    

    const userObj = {image: image, title: title, description: description, username: activeUser};

    const handleSubmit =(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/registerPost', userObj,{
        method: "POST",
        body: JSON.stringify(userObj),
        headers: { token: localStorage.getItem("authToken"),
        "Content-type": "application/json; charset=UTF-8" }})
    .then(() => {
      navigate('/content')})
    .catch(err=>console.log(err))  
}
    return (
        <div id="postFormContainer">
            <div id="postForm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="image">
                            <strong>Lego Image </strong>
                        </label>
                        <br></br>
                        <input 
                            type="file"
                            accept="image/*"
                            name="image"
                            className="imageInput"
                            onChange={convertToBase64}
                        />
                    </div>
                    <br></br>
                    <div className="mb-3">
                        <label htmlFor="title">
                            <strong>Title </strong>
                        </label>
                        <br></br>
                        <input 
                            type="text"
                            maxLength="25"
                            placeholder="Title (max. 25characters)"
                            autoComplete="off"
                            name="title"
                            className="titleInput"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <br></br>
                    <div className="mb-3">
                        <label htmlFor="description">
                            <strong>Description </strong>
                            </label>
                            <br></br>
                            <textarea
                                placeholder="Describe your lego construction. Pieces used, purpose of your construction."
                                name="description"
                                className="descriptionInput"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                    </div>
                    <br></br>
                    <button type="submit" className="rounder-0">Submit</button>
                    
                    </form>



            </div>
        </div>
    );
  
}
 
export default CreatePost;