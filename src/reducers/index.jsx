/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import authReducer from './AuthReducer';
import UserServicesReducer from './UserServicesReducer'
import productServiceReducer from "./productServiceReducer"
import orderServiceReducer from "./orderServiceReducer"
import finalProductReducer from "./finalProductReducer"
import sellOrderReducer from './sellOrderReducer';
import devisReducer from './devisReducer';
import internalOrderReducer from './internalOrderReducer';
import maintenanceReducer from './MaintenanceReducer';


const reducers = combineReducers({
  auth: authReducer, 
  userServices: UserServicesReducer,
  productServices: productServiceReducer,
  order: orderServiceReducer,
  finalProductReducer:finalProductReducer,
  sellOrderReducer:sellOrderReducer,
  devisReducer:devisReducer,
  internalOrderReducer:internalOrderReducer,
  maintenanceReducer:maintenanceReducer
});

export default reducers;
