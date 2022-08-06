import { dummyPictures } from "../constants";

function Show() {
    return (
        <div>
            {/* 하나 방금 만들었으니 하나만 보여주는 로직 */}
            <img src={dummyPictures[0].image} alt={dummyPictures[0].name}/>
        </div>
    );
}

export {Show};