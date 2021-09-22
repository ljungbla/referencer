import React, { useReducer, useState, useCallback } from 'react';
import './App.scss';
import DragAndDrop from "./DragAndDrop";
import SessionSettings from './SessionSettings';
import Session from './Session';
import Seen from './Seen';

function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_ERROR':
        return { ...state, error: action.error }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) };
      case 'FILES_FOUND':
        return { ...state, fileCount: state.fileCount + action.fileCount };
      case 'SET_SESSION':
        return { ...state, session: { ...state.session, ...action } };
      case 'TICK':
        if (state.session.passed === state.session.time) {
          // new Image
          let next = getNextImage(state.fileList.length - 1, state.session.seen);
          let count = state.session.count + 1;
          if (state.session.count < state.session.seen.length)
            count = state.session.seen.length + 1;

          if (next === -1) {
            // all images seen -> Stop session
            clearInterval(state.session.timer)
            return { ...state, session: { ...state.session, ...{ passed: 0, ongoing: false, img: 0, timer: undefined } } };
          } else {
            return {
              ...state,
              session: {
                ...state.session,
                ...{
                  passed: 0,
                  img: next,
                  seen: state.session.seen.concat([next]),
                  count: count
                }
              }
            };
          }
        } else {
          // Just increment passed time
          return {
            ...state, session: {
              ...state.session, ...{
                passed: state.session.pause ? state.session.passed : state.session.passed + 1,
              }
            }
          };
        }
      case 'START':
        let startImg = getNextImage(state.fileList.length - 1, state.session.seen);
        return {
          ...state, session: {
            ...state.session, ...{
              ongoing: true,
              img: startImg,
              seen: state.session.seen.concat([startImg]),
              timer: action.timer,
              count: state.session.count + 1
            }
          }
        };
      case 'NEXT':
        let skipNext = getNextImage(state.fileList.length - 1, state.session.seen);
        let nextSeen = [skipNext]
        if (state.session.count + 1 <= state.session.seen.length) {
          skipNext = state.session.seen[state.session.count];
          nextSeen = [];
        }
        return {
          ...state, session: {
            ...state.session, ...{
              passed: 0,
              img: skipNext,
              seen: state.session.seen.concat(nextSeen),
              count: state.session.count + 1
            }
          }
        };
      case 'PREV':
        let prev = state.session.seen[state.session.count - 2]
        return {
          ...state, session: {
            ...state.session, ...{
              passed: 0,
              img: prev,
              count: state.session.count - 1
            }
          }
        };
      case 'PAUSE':
        return {
          ...state, session: {
            ...state.session,
            ...{
              pause: !state.session.pause
            }
          }
        };
      case 'STOP':
        clearInterval(state.session.timer)
        return { ...state, session: { ...state.session, ...{ passed: 0, ongoing: false, img: 0, timer: undefined, pause: false } } };
      default:
        return state;
    }
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

  const getNextImage = (max, seen) => {
    if (seen.length - 1 === max)
      return -1;

    let next = getRandomInt(max);
    while (seen.indexOf(next) !== -1) {
      next = getRandomInt(max)
    }

    return next;
  }

  const [data, dispatch] = useReducer(
    reducer, {
    inDropZone: false,
    fileList: [],
    fileCount: 0,
    error: '',
    session: {
      time: 30,
      passed: 0,
      img: 0,
      ongoing: false,
      seen: [],
      count: 0,
      timer: undefined,
      pause: false
    }
  })

  const startSession = () => {
    let timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    dispatch({ type: 'START', timer: timer });
  }

  return (
    <div className="App">
      {
        !data.session.ongoing ?
          <div className="session-setup">
            <DragAndDrop data={data} dispatch={dispatch} />
            <SessionSettings data={data} dispatch={dispatch} onStart={startSession} />
          </div> :
          <Session data={data} dispatch={dispatch} />
      }
      {
        data.session.seen.length && !data.session.ongoing ? 
        <Seen data={data} /> :
        <></>
      }
    </div>
  );
}

export default App;
