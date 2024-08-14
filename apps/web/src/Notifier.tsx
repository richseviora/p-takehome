import { useEffect, useReducer, Fragment } from 'react';
import { Snackbar } from '@mui/material';

interface Message {
  id: string;
  message: string;
}

type ReducerAction = { id: string, message: string, type: 'add' } | { id: string, type: 'remove' };

function messageReducer(state: Record<string, any>, action: ReducerAction): Record<string, any> {
  switch (action.type) {
    case 'add':
      return { ...state, [action.id]: action.message };
    case 'remove':
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
}

export function Notification(props: { message: string, onClose: () => void }) {
  return (
    <Snackbar message={props.message} onClose={props.onClose} open={true}/>
  );
}

export function Notifier() {
  const [messages, dispatch] = useReducer(messageReducer, {});
  useEffect(() => {
    const sse = new EventSource('http://localhost:3000/sse');

    function getRealtimeData(data: any) {
      dispatch({ id: data.id, message: 'Added:' + data.name, type: 'add' });
    }

    sse.onmessage = e => getRealtimeData(JSON.parse(e.data));
    sse.onerror = (e) => {
      console.error('Encountered Error, terminating SSE', e);
      sse.close();
    };
    return () => {
      sse.close();
    };
  });

  return <Fragment>
    {Object.keys(messages).map(key => (<Notification key={key} message={messages[key]}
                                                     onClose={() => dispatch({ id: key, type: 'remove' })} />))}
  </Fragment>;
}