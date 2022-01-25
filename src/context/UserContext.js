import { createContext, useCallback, useEffect, useState } from "react";
import { getAuth } from "../utils/FirebaseUtil";
import {  } from 'firebase/auth';
import { useSnackbar } from "notistack";

const auth = getAuth();

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setUser(user);
        })
    }, []);

    const logout = useCallback(() => {
        auth.signOut()
            .then(() => {
                enqueueSnackbar(
                    'User sign out successfully',
                    { variant: 'success' }
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    'Could not sign out the user',
                    { variant: 'error' }
                );
            })
    }, [enqueueSnackbar]);

    return (
        <UserContext.Provider value={{ user, logout }}>
            {children}
        </UserContext.Provider>
    );
}