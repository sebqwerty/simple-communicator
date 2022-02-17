import React from "react";

const Logout = () => {
    window.localStorage.clear();
    return window.location.replace("/");
};

export default Logout;
