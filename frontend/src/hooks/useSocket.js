import { useEffect } from 'react';
import { socketService } from '../services/socket';

export const useSocket = (eventName, callback, dependencies = []) => {
  useEffect(() => {
    socketService.onStatsUpdate(callback);

    return () => {
      if (socketService.socket) {
        socketService.socket.off(eventName);
      }
    };
  }, [eventName, callback, ...dependencies]);
};