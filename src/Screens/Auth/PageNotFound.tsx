
import "../../Styles/ThreeD404Page.css";
import astronaut from "../../assets/Images/png/image.png";
import CustomButton from "../../Compontents/CoustomButton";
import { Typography } from "antd";

const  PageNotFound = () => {
  return (
    <div className="space404-container">
      <div className="space404-text">
        <h1>404 - error</h1>
        <h2>PAGE NOT FOUND</h2>
        <Typography></Typography>
        <p>Oops! This page could not be found </p>
        {/* <a href="/" className="space404-button">Back To Home</a> */}
        <CustomButton buttonName="Back" sx={{paddingLeft:4,paddingRight:4,backgroundColor:"black"}} />
      </div>
      <div className="space404-image">
        <img src={astronaut} alt="Astronaut reading" />
      </div>
    </div>
  );
};

export default  PageNotFound;
