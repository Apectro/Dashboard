import React from 'react';

export type UserContextType = {
  username: string;
  setUsername: (username: string) => void;
};

export const UserContext = React.createContext<UserContextType>({
  username: '',
  setUsername: () => {},
});