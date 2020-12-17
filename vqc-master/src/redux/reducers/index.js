import { combineReducers } from 'redux';
import hello from './hello';
import text from './text';
import model from './model';
import tracing from './tracing';
import negotiate from './negotiate';

export default combineReducers({ hello, text, model, tracing, negotiate });
