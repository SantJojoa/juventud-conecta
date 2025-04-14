import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname === '/') {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
}

export default ScrollTop