function AboutPage() {
  const divStyle = {
    width: '25%',
  };
    
    return (
      <div id="">
        <div className="backgroundImage"></div> 
          <div className="content">
            <h1>About Us</h1>
            <p>This page was made by a Full Stack Developer student at Ironhack. <br></br>
              Any suggestions are welcome to improve the website behavior and functionalities.
            </p>
            <h1>About Lego</h1>
            <p>The Lego Group began in the workshop of Ole Kirk Christiansen (1891–1958), a carpenter from Billund, Denmark, who began making wooden toys in 1932. In 1934, his company came to be called "Lego", derived from the Danish phrase leg godt [lɑjˀ ˈkʌt], which means "play well"</p>
            <div id="page-top-image">
            <img src="../src/assets/img/lego_history.jpg" style={divStyle}/>
          </div>
        </div>
      </div>
    );
  }
   
  export default AboutPage;