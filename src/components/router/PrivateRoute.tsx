import React, {ComponentType, useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext";

interface PrivateRouteProps {
    component: ComponentType<any>
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { authUser } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) =>
                authUser ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};

export default PrivateRoute;
