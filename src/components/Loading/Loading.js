import React from 'react';

import gifS from "../../images/final.gif"

const styles = {
    imageContainer:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "-webkit-fill-available",
        backgroundColor:"white"
    }
}


const Loading = props => {

    return (
        <div>
            <div className="loading" style={ styles.imageContainer } >
                <img src={gifS} alt="Loading" />
                <span>Cargando.....</span>
            </div>
            <div class="mouse original"></div>
        </div>        
    );
}

export default Loading;