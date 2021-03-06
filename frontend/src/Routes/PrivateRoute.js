import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={(props) => 
                (localStorage.getItem("customerAuthToken") || localStorage.getItem("hotelAdminAuthToken") )?(
                    <Component {...props} />
                ) : (
                    <Redirect to="/customer/signin" />
                )
            }
        />
    );
};

export default PrivateRoute;