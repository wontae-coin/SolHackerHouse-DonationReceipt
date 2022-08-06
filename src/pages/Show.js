import { dummyPictures } from "../constants";

function Show() {
    return (
        <div>
            {dummyPictures.map( (dummyPicture, index) => (
                <img key={index} src={dummyPicture.image} alt={dummyPicture.name}/>
            ))}
        </div>
    );
}

export {Show};