import { saveDuck, fetchDuck } from 'helpers/api'
import { closeModal } from './modal'
import { addSingleUsersDuck } from './usersDucks'

const FETCHING_DUCK = 'FETCHING_DUCK'
const FETCHING_DUCK_FAILURE = 'FETCHING_DUCK_FAILURE'
const FETCHING_DUCK_SUCCESS = 'FETCHING_DUCK_SUCCESS'
const REMOVE_FETCHING = 'REMOVE_FETCHING'
const ADD_DUCK = 'ADD_DUCK'
const ADD_MULTIPLE_DUCKS = 'ADD_MULTIPLE_DUCKS'


// Dusks Action Creators
function fetchingDuck() {
  return {
    type: FETCHING_DUCK,
  }
}

function fetchingDuckFailure () {
  return {
    type: FETCHING_DUCK_FAILURE,
    error: 'Error fetching duck',
  }
}

function fetchingDuckSuccess(duck) {
  return {
    type: FETCHING_DUCK_SUCCESS,
    duck,
  }
}

export function removeFetching() {
  return {
    type: REMOVE_FETCHING,
  }
}

export function addDuck (duck) {
  return {
    type: ADD_DUCK,
    duck,
  }
}


/* Function in charge of handling all the different actions associated
 * with adding a duck.
 */
export function duckFanout (duck) {
  return function (dispatch, getState) {
    const uid = getState().users.authedId
    saveDuck(duck)
      .then((duckWithId) => {
        dispatch(addDuck(duckWithId))
        dispatch(closeModal())
        dispatch(addSingleUsersDuck(uid, duckWithId.duckId))
      })
      .catch((error) => {
        console.warn('Error in duck fanout', error)
      })
  }
}

export function fetchAndHandleDuck(duckId) {
  return function (dispatch) {
      dispatch(fetchingDuck())
      fetchDuck(duckId)
        .then((duck) => dispatch(fetchingDuckSuccess(duck)))
        .catch((error) => dispatch(fetchingUserFailure(error)))
  }
}

export function addMultipleDucks(ducks) {
  return {
    type: ADD_MULTIPLE_DUCKS,
    ducks,
  }
}

// Ducks Reducer
const initialState = {
  isFetching: true,
  error: '',
}


export default function ducks (state = initialState, action) {
  switch(action.type) {
    case FETCHING_DUCK :
      return {
        ...state,
        isFetching: true,
      }
    case FETCHING_DUCK_FAILURE :
      return {
        ...state,
        error: action.error,
        isFetching: false,
      }
    case ADD_DUCK :
    case FETCHING_DUCK_SUCCESS :
      return action.duck === null
        ? {
        ...state,
        error: '',
        isFetching: false,
        }
      : {
        ...state,
        error: '',
        isFetching: false,
        [action.duck.duckId] : action.duck
        }
    case REMOVE_FETCHING :
      return {
        ...state,
        isFetching: false,
        error: ''
      }

    case ADD_MULTIPLE_DUCKS :
      return {
        ...state,
        ...action.ducks,
      }
    default:
      return state
    }
  }