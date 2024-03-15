import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import DatabaseService from "../../services/TokenService";
import { AuthContext } from "../../contexts/AuthContext";
import authService from '../../services/AuthService';
import WelcomeView from "../../views/welcome/WelcomeView";
import PhotographerWelcomeView from '../../views/photographerWelcome/PhotographerWelcomeView';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Camera } from '@capacitor/camera';

const LoginRoute: React.FC = (props) => {
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [isOldTokenExist, setIsOldTokenExist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(() => {
        const checkTokenAndRedirect = async () => {
            try {
                if (!authUser?.id) {
                    const token = await DatabaseService.getOldToken();
                    if (token) {
                        await authService.getPhotographer(token).then((authUser: any) => {
                            setAuthUser(authUser)
                        })
                        setIsOldTokenExist(true);
                    }
                }
            } catch (error) {
                console.error('Error checking old token:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const checkPermisstions = async () => {
            const requestPermissions = async () => {
              const { camera, photos } = await Camera.requestPermissions();
              setHasPermissions(camera === 'granted' && photos === 'granted');
            };
        
            const status = await Camera.checkPermissions()
            setHasPermissions(status.camera === 'granted' && status.photos === 'granted');
        
            if (!hasPermissions) {
              requestPermissions();
            }
        }

        checkPermisstions();
        checkTokenAndRedirect();
    }, []);

    if (isLoading) {
        return (
            <div 
                style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </div>
        )
    }

    return (
        <Route 
            {...props}
            render={(props) => 
                authUser || isOldTokenExist
                    ? <PhotographerWelcomeView userId={authUser.id} />
                    : <WelcomeView {...props} />
            } 
        />
    )
};

export default LoginRoute;
