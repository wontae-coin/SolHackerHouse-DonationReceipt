import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
function Error404() {
    const useRedirectHook = () => {
        let navigate = useNavigate();
        useEffect( () => {
            setTimeout( () => {
                navigate(-1);
            }, 1000);
        })
    }
    return (
        <div>
            {useRedirectHook()}
            존재하지 않는 페이지입니다.
        </div>
    );
}

export {Error404};