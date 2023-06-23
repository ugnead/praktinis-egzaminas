import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");

    return (
        <UserContext.Provider value={{ username, setUsername, userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
