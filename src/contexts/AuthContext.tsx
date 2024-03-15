import React, { createContext, useState, useEffect } from 'react';

interface AuthContextProps {
    authUser: any; // TODO add typing
    setAuthUser: (authUser: any) => void;
}

export const AuthContext = createContext<AuthContextProps>({
    authUser: null,
    setAuthUser: () => {},
});

const AuthProvider: React.FC<any> = ({ children }) => {
    const [authUser, setAuthUserState] = useState<any | null>(null);

    useEffect(() => {
        const storedAuthUserJSON = localStorage.getItem('authUser');
        const storedAuthUser = storedAuthUserJSON ? JSON.parse(storedAuthUserJSON) : null

        if (storedAuthUser) {
            setAuthUserState(storedAuthUser);
        }
    }, []);

    const setAuthUser = (authUser: any | null) => {
        if (authUser) {
            localStorage.setItem('authUser', JSON.stringify(authUser));
        } else {
            localStorage.removeItem('authUser');
        }

        setAuthUserState(authUser);
    };

    return (
        <AuthContext.Provider value={{ authUser: authUser, setAuthUser: setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
