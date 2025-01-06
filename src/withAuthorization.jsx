import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

function withAuthorization(Component, requiredRoles) {
 
    // Replace this with your logic to get the user's role
    const role =  Cookies.get('role')

    
    // Check if the user's role is included in the required roles
    const hasAccess = requiredRoles.includes(role);
    if (!hasAccess) {
      return <Navigate to="/" />;
    }

    return <Component/>;

}

export default withAuthorization;