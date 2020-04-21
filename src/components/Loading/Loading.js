import React from 'react';

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
                <img src="http://a.top4top.net/p_1990j031.gif" alt="Loading" />
                <span>Cargando.....</span>
            </div>
            <div class="mouse original"></div>
        </div>        
    );
}

export default Loading;